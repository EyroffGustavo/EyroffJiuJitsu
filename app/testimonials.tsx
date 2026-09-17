"use client";
import { FormEvent, useEffect, useState } from "react";

type Feedback = { id: number; name: string; interest: string; message: string };

export default function Testimonials() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetch("/api/feedbacks").then(response => response.ok ? response.json() : []).then(setItems).catch(() => setItems([]));
  }, []);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Enviando...");
    const form = event.currentTarget;
    const response = await fetch("/api/feedbacks", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (response.ok) {
      form.reset();
      setStatus("Obrigado! Seu depoimento foi enviado para aprovação.");
    } else {
      setStatus("Não foi possível enviar. Confira os campos e tente novamente.");
    }
  }

  const group = (copy: string, hidden = false) => <div className="testimonialGroup" aria-hidden={hidden || undefined}>
    {items.map(item => <article className="testimonialCard" key={`${copy}-${item.id}`}><blockquote title={item.message}>“{item.message}”</blockquote><b>{item.name}</b><small>{item.interest}</small></article>)}
  </div>;

  return <section className="testimonials" id="depoimentos">
    <div className="testimonialIntro"><span>03 — QUEM TREINA COM A GENTE</span><h2>EXPERIÊNCIAS NO TATAME.</h2>
      {items.length ? <div className="testimonialCarousel" aria-label="Depoimentos de alunos"><div className="testimonialTrack">{group("original")}{group("copy", true)}</div></div> : <p className="testimonialEmpty">Treina com a gente? Deixe sua experiência conosco e inspire outras pessoas a conhecerem a Escola Eyroff.</p>}
    </div>
    <form className="feedbackForm" onSubmit={send}>
      <h3>DEIXE SUA EXPERIÊNCIA CONOSCO</h3><p>Conte como está sendo sua experiência na Escola Eyroff.</p>
      <label>Nome<input name="name" required minLength={2} maxLength={80}/></label>
      <label>Turma<select name="interest" required><option value="">Selecione</option><option>Jiu Jitsu Adulto</option><option>Jiu Jitsu Kids</option></select></label>
      <label>Depoimento<textarea name="message" required minLength={10} maxLength={280} rows={5} placeholder="Escreva sua experiência..."/></label>
      <button className="button">ENVIAR DEPOIMENTO →</button><p className="feedbackStatus">{status}</p>
    </form>
  </section>;
}
