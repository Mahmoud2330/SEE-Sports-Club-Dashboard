import React, { useState } from "react";

export default function PoseUploader(){
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [jsonUrl,  setJsonUrl]  = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("video", f);
      const r = await fetch("/api/pose", { method: "POST", body: fd });
      const j = await r.json();
      setVideoUrl(j.videoUrl);
      setJsonUrl(j.jsonUrl);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="card" style={{padding:16}}>
      <h3>Pose Annotator</h3>
      <input type="file" accept="video/*" onChange={onFile} disabled={busy}/>
      {busy && <div className="muted">Processing…</div>}

      {videoUrl && (
        <div style={{marginTop:12}}>
          <video controls src={videoUrl} style={{width:"100%", borderRadius:12}} />
          <div style={{marginTop:8}}>
            <a href={videoUrl} target="_blank" rel="noreferrer">Download annotated video</a>
            {" • "}
            <a href={jsonUrl!} target="_blank" rel="noreferrer">Download keypoints JSON</a>
          </div>
        </div>
      )}
    </div>
  );
}
