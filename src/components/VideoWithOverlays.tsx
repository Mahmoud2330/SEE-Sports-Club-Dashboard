import React, { useEffect, useRef, useState } from "react";

type Keypoint = { x: number; y: number; c?: number };
type Person = { id: string; keypoints: Keypoint[] };
type FocusBox = { label: string; x: number; y: number; w: number; h: number; severity?: "info"|"warn"|"danger" };
type OverlayFrame = { t: number; people: Person[]; focus: FocusBox[] };
type OverlayJSON = { fps?: number; schema: "v1"; skeletonPairs: number[][]; frames: OverlayFrame[] };

type Props = {
  /** mp4 path from /public or assets */
  src: string;
  /** overlay json path (optional) */
  overlaySrc?: string;
  /** poster image (optional) */
  poster?: string;
  /** compact UI if you want tighter paddings */
  compact?: boolean;
};

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function VideoWithOverlays({ src, overlaySrc, poster, compact }: Props) {
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

  // Load overlay JSON
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!overlaySrc) { setData(null); return; }
      try {
        const res = await fetch(overlaySrc);
        const json = (await res.json()) as OverlayJSON;
        if (!cancelled) setData(json);
      } catch {
        if (!cancelled) setData(null);
      }
    })();
    return () => { cancelled = true; };
  }, [overlaySrc]);

  // Canvas tracks the rendered video size
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

  // Draw loop synced to currentTime
  useEffect(() => {
    const v = videoRef.current, c = canvasRef.current, ctx = c?.getContext("2d");
    if (!v || !c || !ctx) return;
    let raf = 0;

    const draw = () => {
      raf = requestAnimationFrame(draw);
      if (!ready) return;

      ctx.clearRect(0, 0, c.width, c.height);
      if (!data) return;

      // find nearest frame <= video.currentTime (linear scan is fine for short demos)
      const t = v.currentTime;
      let frame = data.frames[0];
      for (let i = 1; i < data.frames.length; i++) {
        if (data.frames[i].t <= t) frame = data.frames[i]; else break;
      }

      ctx.save();
      ctx.globalAlpha = opacity;

      const W = c.width, H = c.height;

      // Focus Areas
      if (showFocus && frame.focus) {
        for (const box of frame.focus) {
          const x = box.x * W, y = box.y * H, w = box.w * W, h = box.h * H;
          const color =
            box.severity === "danger" ? "#ff5c80" :
            box.severity === "warn"   ? "#ffd166" : "#7BFFBA";

          // glow + border
          ctx.shadowColor = color; ctx.shadowBlur = 12;
          ctx.strokeStyle = color; ctx.lineWidth = 2;
          ctx.strokeRect(x, y, w, h);
          ctx.shadowBlur = 0;

          // label chip
          const padX = 8; ctx.font = "600 12px Inter, system-ui, -apple-system, Segoe UI, Roboto";
          const tw = ctx.measureText(box.label).width;
          const px = clamp(x, 0, W - (tw + padX*2) - 8);
          const py = clamp(y - 20, 0, H - 24);
          ctx.fillStyle = "rgba(0,0,0,.6)";
          ctx.fillRect(px, py, tw + padX*2, 20);
          ctx.strokeStyle = color;
          ctx.strokeRect(px, py, tw + padX*2, 20);
          ctx.fillStyle = color;
          ctx.fillText(box.label, px + padX, py + 14);
        }
      }

      // Skeleton + keypoints
      for (const person of frame.people || []) {
        const pts = person.keypoints;

        if (showSkeleton && data.skeletonPairs) {
          ctx.strokeStyle = "rgba(103, 40, 245, 0.9)"; // purple
          ctx.lineWidth = 2;
          ctx.shadowColor = "rgba(103, 40, 245, 0.6)";
          ctx.shadowBlur = 8;
          for (const [a, b] of data.skeletonPairs) {
            const A = pts[a], B = pts[b];
            if (!A || !B || (A.c !== undefined && A.c < .2) || (B.c !== undefined && B.c < .2)) continue;
            ctx.beginPath();
            ctx.moveTo(A.x * W, A.y * H);
            ctx.lineTo(B.x * W, B.y * H);
            ctx.stroke();
          }
          ctx.shadowBlur = 0;
        }

        if (showKeypoints) {
          ctx.fillStyle = "#7BFFBA"; // mint
          for (const p of pts) {
            if (p.c !== undefined && p.c < .2) continue;
            ctx.beginPath();
            ctx.arc(p.x * W, p.y * H, kpSize, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      ctx.restore();
    };

    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [data, ready, opacity, kpSize, showKeypoints, showSkeleton, showFocus]);

  return (
    <div className={`video-analytic ${compact ? "video-analytic--compact" : ""}`} style={{ position: "relative" }}>
      {/* Overlay controls — matches your chip/badge vibe */}
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
          onLoadedData={() => setReady(true)}
          style={{ display:"block", width:"100%", height:"auto", background:"#000" }}
        />
        <canvas
          ref={canvasRef}
          style={{ position:"absolute", left:0, top:0, width:"100%", height:"100%", pointerEvents:"none" }}
        />
      </div>
    </div>
  );
}
