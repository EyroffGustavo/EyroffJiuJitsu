"use client";
import { FormEvent, useState } from "react";

export default function LoginForm() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setStatus("");
    const response = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(Object.fromEntries(new FormData(event.currentTarget))) });
    if (response.ok) window.location.reload(); else { setStatus("Usuário ou senha incorretos."); setLoading(false); }
  }
  return <main className="loginPage"><section className="loginCard"><a className="brand" href="/">EYROFF <b>JIU JITSU</b></a><span>ÁREA RESTRITA</span><h1>LOGIN ADMIN</h1><p>Acesse para consultar as pessoas interessadas nas aulas.</p><form onSubmit={login}><label>Usuário<input name="username" autoComplete="username" required /></label><label>Senha<input name="password" type="password" autoComplete="current-password" required /></label><button className="button" disabled={loading}>{loading ? "ENTRANDO..." : "ENTRAR →"}</button><p className="loginError" role="alert">{status}</p></form><a className="backLink" href="/">← Voltar para o site</a></section></main>;
}
