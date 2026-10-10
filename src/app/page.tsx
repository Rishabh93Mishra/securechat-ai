import Link from "next/link";
import Navbar from "@/components/Navbar";

const features = [
  ["🔐", "Private by design", "Auth0 sessions protect the workspace and optional FGA controls document-level access."],
  ["✦", "Gemini AI", "Ask questions, brainstorm, summarize, and use your authorized knowledge as context."],
  ["📚", "Knowledge base", "Add your own notes and documents. The RAG layer filters private content before it reaches the model."],
  ["⚡", "Production ready", "Health checks, contact API, environment-based configuration, and Vercel deployment support."],
];

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <section className="container" style={{padding:"86px 0 74px", textAlign:"center"}}>
          <div className="animate-fade" style={{
            display:"inline-flex",padding:"7px 12px",borderRadius:999,
            border:"1px solid var(--border)",background:"rgba(255,255,255,.035)",
            color:"var(--muted)",fontSize:13,fontWeight:700
          }}>SECURE AI WORKSPACE · GEMINI + AUTH0</div>

          <h1 style={{fontSize:"clamp(44px,7vw,78px)",lineHeight:1.02,letterSpacing:"-4px",margin:"22px auto 20px",maxWidth:900}}>
            AI that works with your data, <span className="gradient-text">without losing control.</span>
          </h1>
          <p className="muted" style={{fontSize:18,lineHeight:1.7,maxWidth:720,margin:"0 auto 30px"}}>
            A polished secure chatbot for teams that need AI, authentication, private documents,
            retrieval-augmented answers, and a clean deployment path.
          </p>

          <div style={{display:"flex",gap:12,justifyContent:"center",flexWrap:"wrap"}}>
            <a className="btn btn-primary" href="/auth/login">Launch SecureChat ✦</a>
            <Link className="btn btn-secondary" href="/contact">Contact us</Link>
          </div>

          <div className="glass float" style={{
            margin:"58px auto 0",maxWidth:920,padding:14,borderRadius:24,textAlign:"left",
            boxShadow:"0 30px 90px rgba(0,0,0,.3)"
          }}>
            <div style={{borderRadius:16,background:"linear-gradient(145deg,#0c1729,#0a1424)",padding:24}}>
              <div style={{display:"flex",gap:8,marginBottom:24}}>
                <span style={{width:9,height:9,borderRadius:99,background:"#fb7185"}} />
                <span style={{width:9,height:9,borderRadius:99,background:"#fbbf24"}} />
                <span style={{width:9,height:9,borderRadius:99,background:"#34d399"}} />
              </div>
              <div style={{display:"grid",gridTemplateColumns:"170px 1fr",gap:22}}>
                <div style={{display:"grid",gap:8}}>
                  {["Chat","Knowledge","Security","Contact"].map((x,i)=><div key={x} style={{
                    padding:"10px 12px",borderRadius:10,background:i===0?"rgba(109,124,255,.15)":"transparent",
                    color:i===0?"#fff":"var(--muted)",fontSize:13,fontWeight:700
                  }}>{x}</div>)}
                </div>
                <div>
                  <div style={{color:"var(--muted)",fontSize:12,marginBottom:10}}>SECURECHAT AI</div>
                  <div style={{fontSize:20,fontWeight:800,marginBottom:8}}>How can I help?</div>
                  <p className="muted" style={{lineHeight:1.6,fontSize:13,maxWidth:540}}>
                    Ask a question and I&apos;ll use your authorized knowledge when it is relevant.
                  </p>
                  <div style={{height:42,border:"1px solid var(--border)",borderRadius:11,marginTop:22,display:"flex",alignItems:"center",padding:"0 14px",color:"#687a95",fontSize:12}}>
                    Message SecureChat AI…
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="container" style={{padding:"28px 0 90px"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{color:"var(--brand)",fontSize:12,fontWeight:800,letterSpacing:2}}>BUILT FOR REAL USE</div>
            <h2 style={{fontSize:32,letterSpacing:"-1px",margin:"8px 0"}}>Everything you need to demo and deploy</h2>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:14}}>
            {features.map(([icon,title,text]) => (
              <div className="card" key={title} style={{padding:22}}>
                <div style={{fontSize:26,marginBottom:14}}>{icon}</div>
                <h3 style={{margin:"0 0 8px",fontSize:16}}>{title}</h3>
                <p className="muted" style={{margin:0,fontSize:13,lineHeight:1.7}}>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <footer style={{borderTop:"1px solid var(--border)",padding:"28px 0"}}>
        <div className="container" style={{display:"flex",justifyContent:"space-between",gap:20,flexWrap:"wrap",color:"var(--muted)",fontSize:13}}>
          <span>© {new Date().getFullYear()} SecureChat AI</span>
          <span>Built with Next.js · Auth0 · Gemini</span>
        </div>
      </footer>
    </>
  );
}
