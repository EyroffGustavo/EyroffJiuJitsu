"use client";
import { useState } from "react";
import Testimonials from "./testimonials";

export default function Home() {
  const [status, setStatus] = useState("");

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Enviando...");
    const form = event.currentTarget;
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (response.ok) {
      form.reset();
      setStatus("Cadastro enviado! A Escola entrará em contato.");
    } else {
      setStatus("Não foi possível enviar. Tente novamente.");
    }
  }

  return <main>
    <header>
      <a className="brand brandLogo" href="#inicio"><img src="/logo-eyroff-original.png" alt="Eyroff Escola de Jiu Jitsu"/></a>
      <nav><a href="#escola">A escola</a><a href="#turmas">Turmas</a><a href="#contato">Contato</a></nav>
    </header>
    <section className="hero" id="inicio">
      <div><span>EYROFF ESCOLA DE JIU JITSU</span><h1>MAIS QUE UMA LUTA.<br/><em>UMA NOVA VERSÃO DE VOCÊ.</em></h1><p>Jiu Jitsu para quem quer evoluir dentro e fora do tatame. Técnica, disciplina, confiança e uma equipe que cresce junto.</p></div>
      <div className="originalLogo"><img src="/logo-eyroff-original.png" alt="Logo oficial Eyroff Escola de Jiu Jitsu"/></div>
    </section>
    <section className="intro" id="escola">
      <div><span>01 — NOSSA ESCOLA</span><h2>SEU PRIMEIRO PASSO COMEÇA AQUI.</h2></div>
      <div><p>Você não precisa estar em forma, ter experiência ou “saber lutar” para começar. A Escola recebe cada aluno no seu nível e constrói evolução de verdade.</p><p>Um ambiente seguro, técnico e acolhedor para crianças e adultos.</p></div>
    </section>
    <section className="classes" id="turmas">
      <span>02 — ENCONTRE SUA TURMA</span><h2>JIU JITSU É PARA TODOS.</h2>
      <div className="cards"><article><b>JIU JITSU ADULTO</b><h3>FORÇA, TÉCNICA E CONFIANÇA.</h3></article><article><b>JIU JITSU KIDS</b><h3>DISCIPLINA ALÉM DO TATAME.</h3></article></div>
    </section>
    <Testimonials/>
    <section className="contact" id="contato">
      <div><span>04 — QUERO CONHECER</span><h2>SEU LUGAR NO TATAME ESTÁ TE ESPERANDO.</h2><p>Preencha seus dados. A Escola entrará em contato pelo WhatsApp.</p><p><b>Rua Erich Steinbach, 22 — Sala 302</b><br/>Instagram: @eyroffjiujitsu</p></div>
      <form onSubmit={send}>
        <label>Nome completo<input name="name" required maxLength={100}/></label>
        <label>Idade<input name="age" type="number" min="3" max="100" required/></label>
        <label>Interesse<select name="interest" required><option value="">Selecione</option><option>Jiu Jitsu Adulto</option><option>Jiu Jitsu Kids</option></select></label>
        <label>WhatsApp<input name="phone" inputMode="tel" required maxLength={20} placeholder="(47) 99999-9999"/></label>
        <label>Instagram<input name="instagram" maxLength={100} placeholder="@seuinstagram"/></label>
        <label className="privacyConsent"><input name="privacy" type="checkbox" required/>Autorizo o contato da Escola Eyroff pelos dados informados.</label>
        <button className="button">ENVIAR MEU INTERESSE →</button><p className="status">{status}</p>
      </form>
    </section>
    <footer>© 2026 EYROFF ESCOLA DE JIU JITSU <a href="/admin">Área administrativa</a></footer>
  </main>;
}
