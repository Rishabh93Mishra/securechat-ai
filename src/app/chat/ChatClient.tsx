"use client";

import { useChat } from "ai/react";
import { useEffect, useRef } from "react";

interface Props {
  userName: string;
  userEmail: string;
}

export default function ChatClient({ userName }: Props) {
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({ api: "/api/chat" });
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const suggestions = [
    "Explain how this project works",
    "What can you tell me from my knowledge base?",
    "How does secure RAG protect documents?",
    "Give me ideas to improve this project",
  ];

  return (
    <main style={{maxWidth:900,margin:"0 auto",padding:"34px 18px 28px"}}>
      <div style={{display:"flex",justifyContent:"space-between",gap:18,alignItems:"end",marginBottom:24}}>
        <div>
          <div style={{color:"var(--brand)",fontSize:12,fontWeight:800,letterSpacing:1.5}}>SECURE WORKSPACE</div>
          <h1 style={{fontSize:"clamp(28px,5vw,40px)",letterSpacing:"-1.5px",margin:"5px 0 6px"}}>Hello, {userName.split(" ")[0]} 👋</h1>
          <p className="muted" style={{margin:0,fontSize:14}}>Ask Gemini anything. Authorized knowledge is added when relevant.</p>
        </div>
        <div className="glass" style={{padding:"8px 11px",borderRadius:10,fontSize:11,color:"var(--muted)"}}>● Protected</div>
      </div>

      {messages.length === 0 && (
        <div className="card animate-fade" style={{padding:22,marginBottom:18}}>
          <div style={{fontSize:15,fontWeight:750,marginBottom:13}}>Try one of these</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:9}}>
            {suggestions.map((s) => (
              <button key={s} className="btn btn-secondary" style={{fontSize:12,fontWeight:600}}
                onClick={() => {
                  const inputEvent = { target: { value: s } } as React.ChangeEvent<HTMLInputElement>;
                  handleInputChange(inputEvent);
                }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      <div style={{minHeight:420}}>
        {messages.map((m) => (
          <div key={m.id} className="animate-fade" style={{display:"flex",gap:10,justifyContent:m.role==="user"?"flex-end":"flex-start",marginBottom:15}}>
            <div style={{
              maxWidth:"82%",padding:"13px 15px",borderRadius:16,
              border:m.role==="assistant"?"1px solid var(--border)":"none",
              background:m.role==="user"?"linear-gradient(135deg,var(--brand),var(--brand-2))":"rgba(13,25,43,.8)",
              lineHeight:1.7,fontSize:14,whiteSpace:"pre-wrap"
            }}>{m.content}</div>
          </div>
        ))}
        {isLoading && <div className="muted" style={{fontSize:13,padding:"8px 2px"}}>✦ Gemini is thinking…</div>}
        {error && <div style={{padding:13,borderRadius:12,background:"rgba(251,113,133,.08)",border:"1px solid rgba(251,113,133,.25)",color:"#fda4af",fontSize:13}}>{error.message || "Something went wrong."}</div>}
        <div ref={bottom} />
      </div>

      <form onSubmit={handleSubmit} className="glass" style={{padding:10,borderRadius:16,display:"flex",gap:8,position:"sticky",bottom:14}}>
        <input className="input" value={input} onChange={handleInputChange} placeholder="Message SecureChat AI…" disabled={isLoading} />
        <button className="btn btn-primary" type="submit" disabled={isLoading || !input.trim()} style={{minWidth:78}}>
          {isLoading ? "…" : "Send ↑"}
        </button>
      </form>
      <div className="muted" style={{fontSize:11,textAlign:"center",marginTop:10}}>🔒 Auth0 session · RAG authorization · Gemini</div>
    </main>
  );
}
