import React, { useState } from 'react';
import { Bot, MessageSquare, X, Send } from "lucide-react";

/* -------------------- CHAT WIDGET -------------------- */
type ChatMsg = { id: number; role: "bot" | "user"; text: string; time?: string };

const ChatWidget: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(1);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    {
      id: 1,
      role: "bot",
      text:
        "Hello! I'm your AI assistant for the Sports Club Management system. How can I help you today?",
      time: "15:34",
    },
  ]);

  const send = () => {
    const t = input.trim();
    if (!t) return;
    const id = Date.now();
    setMsgs((m) => [...m, { id, role: "user", text: t }]);
    setInput("");
    // simple stubbed reply
    setTimeout(() => {
      setMsgs((m) => [
        ...m,
        { id: id + 1, role: "bot", text: "Got it! I'll look into that for you." },
      ]);
      if (!open) setUnread((u) => u + 1);
    }, 500);
  };

  const openPanel = () => {
    setOpen(true);
    setUnread(0);
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button className="chatfab" onClick={openPanel} aria-label="Open chat">
          <MessageSquare size={22} />
          {unread > 0 && <span className="chatfab__badge">{unread}</span>}
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="chat dock">
          <header className="chat__head">
            <div className="chat__title">
              <span className="chat__icon"><Bot size={16} /></span>
              <div>
                <div className="chat__name">AI Assistant</div>
                <div className="chat__status"><span className="dot dot--green" /> Online</div>
              </div>
            </div>
            <div className="chat__actions">
              <button className="chat__btn" onClick={() => setOpen(false)} title="Close">
                <X size={16} />
              </button>
            </div>
          </header>

          <div className="chat__body">
            {msgs.map((m) => (
              <div key={m.id} className={`msg ${m.role === "bot" ? "msg--bot" : "msg--user"}`}>
                {m.text}
                {m.time && <div className="msg__time">{m.time}</div>}
              </div>
            ))}
          </div>

          <footer className="chat__foot">
            <input
              className="chat__input"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <button className="chat__send" onClick={send} aria-label="Send">
              <Send size={16} />
            </button>
          </footer>
        </div>
      )}
    </>
  );
};

export default ChatWidget; 