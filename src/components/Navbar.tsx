import Link from "next/link";
import { auth0 } from "@/lib/auth0";
import { site } from "@/lib/site";

export default async function Navbar({ app = false }: { app?: boolean }) {
  const session = await auth0.getSession();
  const user = session?.user;

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid var(--border)",
      background: "rgba(7,17,31,.72)", backdropFilter: "blur(18px)"
    }}>
      <div className="container" style={{height: 70, display:"flex", alignItems:"center", justifyContent:"space-between", gap:18}}>
        <Link href={app ? "/chat" : "/"} style={{textDecoration:"none", display:"flex", alignItems:"center", gap:10}}>
          <span style={{
            width:38,height:38,borderRadius:12,display:"grid",placeItems:"center",
            background:"linear-gradient(135deg,var(--brand),var(--brand-2))",
            boxShadow:"0 10px 28px rgba(109,124,255,.24)",fontSize:18,fontWeight:900
          }}>✦</span>
          <span style={{fontWeight:850, letterSpacing:"-.5px"}}>{site.shortName}<span style={{color:"var(--brand)"}}> AI</span></span>
        </Link>

        <nav style={{display:"flex",alignItems:"center",gap:20}}>
          {!app && <Link className="nav-link" href="#features">Features</Link>}
          <Link className="nav-link" href="/contact">Contact</Link>
          {user ? (
            <>
              <Link className="nav-link" href="/chat">Chat</Link>
              <Link className="nav-link" href="/documents">Knowledge</Link>
              <a className="btn btn-secondary" href="/auth/logout">Logout</a>
            </>
          ) : (
            <a className="btn btn-primary" href="/auth/login">Get started →</a>
          )}
        </nav>
      </div>
    </header>
  );
}
