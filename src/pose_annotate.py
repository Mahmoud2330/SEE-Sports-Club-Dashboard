# pose_annotate.py
# Usage:
#   python pose_annotate.py --source path/to/video.mp4 --out out/annotated.mp4 --json out/annotations.json
# Notes:
#   - Downloads a small YOLO pose model on first run.
#   - Draws person boxes + keypoint skeletons.
#   - Exports per-frame JSON (bboxes, keypoints, confidences, track IDs).

import argparse, json, os, math
import cv2
import numpy as np
from ultralytics import YOLO

def parse_args():
    ap = argparse.ArgumentParser()
    ap.add_argument("--source", required=True, help="input video path")
    ap.add_argument("--out",    required=True, help="output annotated mp4 path")
    ap.add_argument("--json",   required=True, help="output annotations json path")
    ap.add_argument("--model",  default="yolov8n-pose.pt", help="YOLO pose weights")
    ap.add_argument("--conf",   type=float, default=0.30, help="min confidence")
    ap.add_argument("--device", default=None, help="cuda:0 or cpu")
    ap.add_argument("--tracker", default="bytetrack.yaml", help="tracker cfg")
    return ap.parse_args()

def main():
    args = parse_args()
    os.makedirs(os.path.dirname(args.out), exist_ok=True)
    os.makedirs(os.path.dirname(args.json), exist_ok=True)

    cap = cv2.VideoCapture(args.source)
    if not cap.isOpened():
        raise SystemExit(f"Could not open: {args.source}")

    fps   = cap.get(cv2.CAP_PROP_FPS) or 30.0
    W     = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    H     = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 0)

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    writer = cv2.VideoWriter(args.out, fourcc, fps, (W, H))

    model = YOLO(args.model)

    # Stream results frame-by-frame with tracking
    frame_idx = 0
    all_ann = {
        "source": os.path.basename(args.source),
        "fps": fps,
        "size": {"w": W, "h": H},
        "frames": []  # each item holds detections for that frame
    }

    # IMPORTANT: using .track(stream=True) keeps memory usage low
    for result in model.track(
        source=args.source,
        conf=args.conf,
        iou=0.5,
        tracker=args.tracker,
        device=args.device,
        stream=True,
        imgsz=max(640, int(32 * math.ceil(max(W, H) / 32)))  # scale reasonably
    ):
        # result.orig_img is the original frame (numpy BGR)
        frame_bgr = result.plot()  # YOLO draws boxes + skeletons for you
        writer.write(frame_bgr)

        frame_info = {"index": frame_idx, "time": frame_idx / fps, "detections": []}

        boxes = result.boxes
        kpts  = result.keypoints
        n = 0 if boxes is None else boxes.xyxy.shape[0]

        # Extract detections into JSON
        for i in range(n):
            cls_id = int(boxes.cls[i].item()) if boxes.cls is not None else 0
            # keep only persons (cls 0 for COCO)
            if cls_id != 0:
                continue

            xyxy = boxes.xyxy[i].tolist()
            conf = float(boxes.conf[i].item()) if boxes.conf is not None else None
            tid  = int(boxes.id[i].item()) if boxes.id is not None else None

            # Keypoints (x,y[,conf]) – shape: (num_kpts, 2 or 3)
            k = []
            if kpts is not None and kpts.xy is not None:
                pts_xy = kpts.xy[i].tolist()              # [(x,y), ...]
                pts_cf = None
                if getattr(kpts, "conf", None) is not None:
                    pts_cf = kpts.conf[i].tolist()         # [conf, ...]
                for j, (x, y) in enumerate(pts_xy):
                    if pts_cf:
                        k.append({"x": float(x), "y": float(y), "c": float(pts_cf[j])})
                    else:
                        k.append({"x": float(x), "y": float(y)})

            det = {
                "track_id": tid,
                "bbox_xyxy": [float(v) for v in xyxy],
                "score": conf,
                "class": "person",
                "keypoints": k
            }
            frame_info["detections"].append(det)

        all_ann["frames"].append(frame_info)
        frame_idx += 1

    writer.release()
    cap.release()

    with open(args.json, "w", encoding="utf-8") as f:
        json.dump(all_ann, f, ensure_ascii=False)

    print(f"[OK] wrote video: {args.out}")
    print(f"[OK] wrote json : {args.json}")

if __name__ == "__main__":
    main()
