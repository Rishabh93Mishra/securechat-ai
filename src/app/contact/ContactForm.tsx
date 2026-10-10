"use client";

import { useState } from "react";

export default function ContactForm(){
  const [form,setForm]=useState({name:"",email:"",message:""});
  const [status,setStatus]=useState("");
  const [sending,setSending]=useState(false);

  async function submit(e:React.FormEvent){
    e.preventDefault(); setSending(true); setStatus("");
    try{
      const res=await fetch("/api/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});
      const data=await res.json();
      if(!res.ok) throw new Error(data.error || "Message could not be sent.");
      setStatus(data.message || "Message sent.");
      setForm({name:"",email:"",message:""});
    }catch(e){setStatus(e instanceof Error?e.message:"Something went wrong.")}
    finally{setSending(false)}
  }

  return <form className="card" onSubmit={submit} style={{padding:22}}>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
      <input className="input" required placeholder="Your name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className="input" required type="email" placeholder="Email address" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
    </div>
    <textarea className="input" required placeholder="Your message" value={form.message} onChange={e=>setForm({...form,message:e.target.value})} style={{minHeight:170,resize:"vertical",marginTop:12}}/>
    <button className="btn btn-primary" disabled={sending} style={{width:"100%",marginTop:12}}>{sending?"Sending…":"Send message →"}</button>
    {status && <p className="muted" style={{fontSize:12,margin:"12px 0 0"}}>{status}</p>}
    <p className="muted" style={{fontSize:11,lineHeight:1.6,margin:"14px 0 0",textAlign:"center"}}>
      Email delivery uses Resend when configured. Without it, the API returns a clear setup message instead of silently failing.
    </p>
  </form>
}
