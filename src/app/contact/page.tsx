import Navbar from "@/components/Navbar";
import ContactForm from "./ContactForm";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="container" style={{padding:"70px 0"}}>
        <div style={{maxWidth:760,margin:"0 auto",textAlign:"center"}}>
          <div style={{color:"var(--brand)",fontSize:12,fontWeight:800,letterSpacing:1.5}}>CONTACT</div>
          <h1 style={{fontSize:"clamp(38px,6vw,58px)",letterSpacing:"-2px",margin:"8px 0 12px"}}>Let&apos;s build something secure.</h1>
          <p className="muted" style={{lineHeight:1.7}}>Have a question about the project, deployment, or integration? Send a message.</p>
        </div>
        <div style={{maxWidth:650,margin:"32px auto 0"}}>
          <ContactForm />
        </div>
      </main>
    </>
  );
}
