"use client";

import { useCallback, useEffect, useState } from "react";

interface Doc {
  id: string; name: string; content: string; ownerId: string;
  isPublic: boolean; createdAt: string; access: "public" | "owner" | "shared";
}

export default function DocumentsClient({ userEmail }: { userEmail: string; userName: string }) {
  const [docs,setDocs]=useState<Doc[]>([]);
  const [loading,setLoading]=useState(true);
  const [saving,setSaving]=useState(false);
  const [message,setMessage]=useState("");
  const [form,setForm]=useState({name:"",content:"",isPublic:false});

  const load=useCallback(async()=>{
    try {
      const res=await fetch("/api/documents/list",{cache:"no-store"});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || "Could not load documents");
      setDocs(data);
    } catch(e) { setMessage(e instanceof Error?e.message:"Could not load documents"); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{load()},[load]);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setSaving(true); setMessage("");
    try{
      const res=await fetch("/api/documents/upload",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || "Upload failed");
      setForm({name:"",content:"",isPublic:false});
      setMessage("Document saved successfully.");
      await load();
    }catch(e){setMessage(e instanceof Error?e.message:"Upload failed")}
    finally{setSaving(false)}
  }

  async function importText(file: File){
    if(!file.name.endsWith(".txt") && !file.name.endsWith(".md")){
      setMessage("For now, import .txt or .md files, or paste content below.");
      return;
    }
    const text=await file.text();
    setForm(v=>({...v,name:v.name || file.name.replace(/\.(txt|md)$/i,""),content:text}));
  }

  return (
    <main className="container" style={{padding:"36px 0 70px"}}>
      <div style={{marginBottom:26}}>
        <div style={{color:"var(--brand)",fontSize:12,fontWeight:800,letterSpacing:1.5}}>KNOWLEDGE BASE</div>
        <h1 style={{fontSize:38,letterSpacing:"-1.5px",margin:"6px 0"}}>Your documents</h1>
        <p className="muted" style={{margin:0,fontSize:14}}>Public documents are visible to everyone. Private documents stay with their owner unless FGA grants access.</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"minmax(0,1fr) minmax(0,1.35fr)",gap:16,alignItems:"start"}}>
        <form className="card" onSubmit={submit} style={{padding:20}}>
          <h2 style={{fontSize:16,margin:"0 0 16px"}}>Add knowledge</h2>
          <label className="muted" style={{fontSize:12,fontWeight:700}}>NAME</label>
          <input className="input" style={{margin:"6px 0 14px"}} required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Project documentation" />
          <label className="muted" style={{fontSize:12,fontWeight:700}}>CONTENT</label>
          <textarea className="input" style={{margin:"6px 0 12px",minHeight:190,resize:"vertical"}} required value={form.content} onChange={e=>setForm({...form,content:e.target.value})} placeholder="Paste notes, FAQs, documentation…" />
          <input type="file" accept=".txt,.md,text/plain,text/markdown" onChange={e=>e.target.files?.[0] && importText(e.target.files[0])} style={{fontSize:12,color:"var(--muted)",maxWidth:"100%"}} />
          <label style={{display:"flex",gap:9,alignItems:"center",margin:"15px 0",fontSize:13}}>
            <input type="checkbox" checked={form.isPublic} onChange={e=>setForm({...form,isPublic:e.target.checked})}/>
            Make this document public
          </label>
          <button className="btn btn-primary" disabled={saving} type="submit" style={{width:"100%"}}>{saving?"Saving…":"Save document"}</button>
          {message && <div className="muted" style={{fontSize:12,marginTop:12}}>{message}</div>}
        </form>

        <section>
          <div className="glass" style={{padding:"11px 14px",borderRadius:12,marginBottom:12,fontSize:12,color:"var(--muted)"}}>
            🔐 Access control is applied before document text is added to the AI context.
          </div>
          {loading ? <div className="muted" style={{padding:30,textAlign:"center"}}>Loading…</div> :
            docs.length===0 ? <div className="card" style={{padding:40,textAlign:"center"}}>No documents yet.</div> :
            <div style={{display:"grid",gap:10}}>
              {docs.map(doc=><article className="card" key={doc.id} style={{padding:17}}>
                <div style={{display:"flex",justifyContent:"space-between",gap:12,alignItems:"start"}}>
                  <div>
                    <div style={{fontWeight:800,fontSize:15}}>{doc.name}</div>
                    <div className="muted" style={{fontSize:11,marginTop:3}}>{doc.ownerId===userEmail?"Your document":doc.ownerId}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:800,padding:"5px 8px",borderRadius:999,background:doc.access==="public"?"rgba(53,211,153,.1)":"rgba(109,124,255,.1)",color:doc.access==="public"?"var(--success)":"#aab5ff"}}>{doc.access.toUpperCase()}</span>
                </div>
                <p className="muted" style={{fontSize:13,lineHeight:1.6,margin:"12px 0 0"}}>{doc.content.length>230?doc.content.slice(0,230)+"…":doc.content}</p>
              </article>)}
            </div>}
        </section>
      </div>

      <style>{`@media(max-width:760px){main>div:nth-of-type(2){grid-template-columns:1fr!important}}`}</style>
    </main>
  );
}
