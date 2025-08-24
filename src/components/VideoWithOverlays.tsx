import React, { useEffect, useRef, useState, useMemo } from "react";

/** ---------------- Types ---------------- */
type Keypoint = { x: number; y: number; c?: number };
type Person = { id: string; keypoints: Keypoint[] };
type FocusBox = { label: string; x: number; y: number; w: number; h: number; severity?: "info"|"warn"|"danger" };

type OverlayFrameT = { t: number; people: Person[]; focus: FocusBox[] };          // time-based
type OverlayFrameF = { f: number; people: Person[]; focus: FocusBox[] };          // frame-index-based

type OverlayJSON = {
  fps?: number;
  schema: "v1";
  skeletonPairs: number[][];
  frames: Array<OverlayFrameT | OverlayFrameF>;
};

type Props = {
  src: string;
  overlaySrc?: string;
  poster?: string;
  compact?: boolean;
  // When true, we interpolate between frames for smoother motion
  interpolate?: boolean;
};

/** ---------------- Helpers ---------------- */
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

/** Safely deep-interpolate two frames (linear kp & box positions). */
function lerpFrame(a: OverlayFrameT | OverlayFrameF, b: OverlayFrameT | OverlayFrameF, alpha: number): OverlayFrameT {
  const lerp = (x: number, y: number) => x + (y - x) * alpha;

  const people: Person[] = (a.people || []).map((pa, i) => {
    const pb = (b.people || [])[i];
    if (!pb) return pa;
    const kps: Keypoint[] = pa.keypoints.map((ka, j) => {
      const kb = pb.keypoints[j] || ka;
      return {
        x: lerp(ka.x, kb.x),
        y: lerp(ka.y, kb.y),
        c: kb.c ?? ka.c
      };
    });
    return { id: pa.id, keypoints: kps };
  });

  const focus: FocusBox[] = (a.focus || []).map((fa, i) => {
    const fb = (b.focus || [])[i];
    if (!fb) return fa;
    return {
      label: fa.label,
      x: lerp(fa.x, fb.x),
      y: lerp(fa.y, fb.y),
      w: lerp(fa.w, fb.w),
      h: lerp(fa.h, fb.h),
      severity: fa.severity
    };
  });

  // Use time from a (caller handles where we are in time)
  return { t: "t" in a ? a.t : 0, people, focus };
}

/** Binary search for index of last frame <= value (time or frame). */
function findFloorIndex<T extends { t?: number; f?: number }>(
  arr: T[],
  value: number,
  key: "t" | "f"
): number {
  let lo = 0, hi = arr.length - 1, ans = 0;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    const v = arr[mid][key] ?? 0;
    if (v <= value) { ans = mid; lo = mid + 1; } else { hi = mid - 1; }
  }
  return ans;
}

/** ---------------- Component ---------------- */
export default function VideoWithOverlays({
  src,
  overlaySrc,
  poster,
  compact,
  interpolate = true
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [data, setData] = useState<OverlayJSON | null>(null);
  const [ready, setReady] = useState(false);

  // UI toggles
  const [showKeypoints, setShowKeypoints] = useState(true);
  const [showSkeleton, setShowSkeleton]   = useState(true);
  const [showFocus, setShowFocus]         = useState(true);
  const [opacity, setOpacity]             = useState(1);
  const [kpSize, setKpSize]               = useState(5);

  // Derived: are frames time-based or frame-index-based?
  const mode: "time" | "frame" = useMemo(() => {
    if (!data?.frames?.length) return "time";
    return "t" in data.frames[0] ? "time" : "frame";
  }, [data]);

  // Load overlay JSON
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!overlaySrc) { setData(null); return; }
      try {
        console.log('Loading overlay from:', overlaySrc);
        const res = await fetch(overlaySrc);
        const json = (await res.json()) as OverlayJSON;
        console.log('Loaded overlay data:', json);
        if (!cancelled) {
          // Ensure frames sorted by key (t or f)
          const frames = [...json.frames].sort((a: any, b: any) => {
            const ka = ("t" in a ? a.t : a.f) ?? 0;
            const kb = ("t" in b ? b.t : b.f) ?? 0;
            return ka - kb;
          });
          console.log('Sorted frames:', frames);
          setData({ ...json, frames });
        }
      } catch (error) {
        console.error('Error loading overlay:', error);
        if (!cancelled) setData(null);
      }
    })();
    return () => { cancelled = true; };
  }, [overlaySrc]);

  // Canvas tracks element size
  useEffect(() => {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c) return;
    const resize = () => {
      const rect = v.getBoundingClientRect();
      c.width  = Math.max(1, Math.floor(rect.width));
      c.height = Math.max(1, Math.floor(rect.height));
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(v);
    return () => ro.disconnect();
  }, []);

  // Compute the *visible video content rect* inside the element (handles pillar/letter‑boxing)
  function getContentRect() {
    const v = videoRef.current, c = canvasRef.current;
    if (!v || !c || !v.videoWidth || !v.videoHeight) {
      return { x: 0, y: 0, w: c?.width ?? 0, h: c?.height ?? 0 };
    }
    const elemW = c.width, elemH = c.height;
    const videoAR = v.videoWidth / v.videoHeight;
    const elemAR  = elemW / elemH;

    // object-fit: contain
    if (elemAR > videoAR) {
      const h = elemH;
      const w = Math.round(h * videoAR);
      const x = Math.round((elemW - w) / 2);
      return { x, y: 0, w, h };
    } else {
      const w = elemW;
      const h = Math.round(w / videoAR);
      const y = Math.round((elemH - h) / 2);
      return { x: 0, y, w, h };
    }
  }

  /** Get frame (optionally interpolated) for current video time. */
  function getSyncedFrame(nowSec: number): OverlayFrameT | null {
    if (!data?.frames?.length) return null;

    if (mode === "time") {
      const arr = data.frames as OverlayFrameT[];
      const lastIdx = findFloorIndex(arr, nowSec, "t");
      const a = arr[clamp(lastIdx, 0, arr.length - 1)];
      // If no interpolation or at end, return a
      if (!interpolate || lastIdx >= arr.length - 1) return a;
      const b = arr[lastIdx + 1];
      const span = Math.max(1e-6, b.t - a.t);
      const alpha = clamp((nowSec - a.t) / span, 0, 1);
      return lerpFrame(a, b, alpha);
    } else {
      // Frame-index-based
      const fps = data.fps ?? 30;
      const nowFrame = Math.floor(nowSec * fps);
      const arr = data.frames as OverlayFrameF[];
      const lastIdx = findFloorIndex(arr, nowFrame, "f");
      const a = arr[clamp(lastIdx, 0, arr.length - 1)];
      if (!interpolate || lastIdx >= arr.length - 1) {
        // Cast to time-frame for downstream draw (set t = nowSec)
        return { t: nowSec, people: a.people, focus: a.focus };
      }
      const b = arr[lastIdx + 1];
      const span = Math.max(1, b.f - a.f);
      const alpha = clamp((nowFrame - a.f) / span, 0, 1);
      const lerped = lerpFrame(
        { t: nowSec, people: a.people, focus: a.focus },
        { t: nowSec, people: b.people, focus: b.focus },
        alpha
      );
      return lerped;
    }
  }

  // Draw loop (requestAnimationFrame; follows currentTime, handles play/pause/seek)
  useEffect(() => {
    const v = videoRef.current, c = canvasRef.current, ctx = c?.getContext("2d");
    if (!v || !c || !ctx) return;
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!ready || !data) {
        if (!ready) console.log('Video not ready yet');
        if (!data) console.log('No overlay data');
        return;
      }

      ctx.clearRect(0, 0, c.width, c.height);

      const frame = getSyncedFrame(v.currentTime);
      if (!frame) {
        console.log('No frame found for time:', v.currentTime);
        return;
      }
      
      console.log('Rendering frame at time:', v.currentTime, 'frame:', frame);

      const { x: offX, y: offY, w: W, h: H } = getContentRect();

      ctx.save();
      ctx.globalAlpha = opacity;

      // Focus Areas
      if (showFocus && frame.focus) {
        for (const box of frame.focus) {
          const bx = offX + box.x * W;
          const by = offY + box.y * H;
          const bw = box.w * W;
          const bh = box.h * H;
          const color =
            box.severity === "danger" ? "#ff5c80" :
            box.severity === "warn"   ? "#ffd166" : "#7BFFBA";

          ctx.shadowColor = color; ctx.shadowBlur = 12;
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.strokeRect(bx, by, bw, bh);
          ctx.shadowBlur = 0;

          // chip
          const padX = 8; ctx.font = "600 12px Inter, system-ui, -apple-system, Segoe UI, Roboto";
          const tw = ctx.measureText(box.label).width;
          const px = clamp(bx, 0, c.width - (tw + padX*2) - 8);
          const py = clamp(by - 22, 0, c.height - 24);
          ctx.fillStyle = "rgba(0,0,0,.6)";
          ctx.fillRect(px, py, tw + padX*2, 20);
          ctx.strokeStyle = color;
          ctx.strokeRect(px, py, tw + padX*2, 20);
          ctx.fillStyle = color;
          ctx.fillText(box.label, px + padX, py + 14);
        }
      }

      // People (skeleton + keypoints)
      if (frame.people) {
        for (const person of frame.people) {
          const pts = person.keypoints;

          if (showSkeleton && data.skeletonPairs) {
            ctx.strokeStyle = "rgba(103, 40, 245, 0.95)";
            ctx.lineWidth = 2;
            ctx.shadowColor = "rgba(103, 40, 245, 0.6)";
            ctx.shadowBlur = 8;
            for (const [a, b] of data.skeletonPairs) {
              const A = pts[a], B = pts[b];
              if (!A || !B || (A.c !== undefined && A.c < .2) || (B.c !== undefined && B.c < .2)) continue;
              ctx.beginPath();
              ctx.moveTo(offX + A.x * W, offY + A.y * H);
              ctx.lineTo(offX + B.x * W, offY + B.y * H);
              ctx.stroke();
            }
            ctx.shadowBlur = 0;
          }

          if (showKeypoints) {
            ctx.fillStyle = "#7BFFBA";
            for (const p of pts) {
              if (p.c !== undefined && p.c < .2) continue;
              ctx.beginPath();
              ctx.arc(offX + p.x * W, offY + p.y * H, kpSize, 0, Math.PI * 2);
              ctx.fill();
            }
          }
        }
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [data, ready, opacity, kpSize, showKeypoints, showSkeleton, showFocus, mode, interpolate]);

  return (
    <div className={`video-analytic ${compact ? "video-analytic--compact" : ""}`} style={{ position: "relative" }}>
      {/* Controls */}
      <div className="overlay-controls">
        <label><input type="checkbox" checked={showKeypoints} onChange={e=>setShowKeypoints(e.target.checked)} /> Keypoints</label>
        <label><input type="checkbox" checked={showSkeleton}  onChange={e=>setShowSkeleton(e.target.checked)}  /> Skeleton</label>
        <label><input type="checkbox" checked={showFocus}     onChange={e=>setShowFocus(e.target.checked)}     /> Focus Areas</label>
        <label className="slider">Opacity
          <input type="range" min={0.2} max={1} step={0.05} value={opacity} onChange={e=>setOpacity(parseFloat(e.target.value))}/>
        </label>
        <label className="slider">Dot Size
          <input type="range" min={2} max={10} step={1} value={kpSize} onChange={e=>setKpSize(parseInt(e.target.value))}/>
        </label>
      </div>

      {/* Stacked video + canvas */}
      <div className="video-stack" style={{ position:"relative", borderRadius:12, overflow:"hidden", border:"1px solid var(--db-border)" }}>
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          controls
          onLoadedData={() => {
            console.log('Video loaded, setting ready to true');
            setReady(true);
          }}
          onError={(e) => console.error('Video error:', e)}
          style={{
            display:"block",
            width:"100%",
            height:"100%",
            maxHeight:"420px",
            background:"#000",
            objectFit:"contain"      // pillarbox/letterbox, we map to content rect
          }}
        />
        <canvas
          ref={canvasRef}
          style={{ position:"absolute", left:0, top:0, width:"100%", height:"100%", pointerEvents:"none" }}
        />
      </div>
    </div>
  );
}
