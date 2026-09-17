"use client";
import { useState } from "react";

type Feedback = { id: number; name: string; interest: string; message: string; published: boolean; createdAt: string };

export default function FeedbackAdmin({ rows }: { rows: Feedback[] }) {
  const [items, setItems] = useState(rows);
  const [saving, setSaving] = useState<number | null>(null);

  async function toggle(id: number, published: boolean) {
    setSaving(id);
    const response = await fetch("/api/admin/feedbacks", {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ id, published }),
    });
    if (response.ok) setItems(current => current.map(item => item.id === id ? {...item, published} : item));
    setSaving(null);
  }

  return <section className="feedbackAdmin">
    <div className="feedbackAdminTitle"><div><span>MODERAÇÃO</span><h2>DEPOIMENTOS</h2></div><p>Escolha quais experiências aparecem no carrossel da página principal.</p></div>
    {items.length ? <div className="feedbackAdminGrid">{items.map(item => <article key={item.id} className={item.published ? "published" : ""}>
      <div className="feedbackMeta"><b>{item.name}</b><span>{item.interest}</span></div><p>“{item.message}”</p>
      <div className="feedbackDecision"><small>{new Date(item.createdAt).toLocaleDateString("pt-BR")}</small><label className="publishToggle"><input type="checkbox" checked={item.published} disabled={saving === item.id} onChange={event => toggle(item.id, event.target.checked)}/>{saving === item.id ? "Salvando..." : "Exibir no site"}</label></div>
    </article>)}</div> : <div className="adminEmpty">Nenhum depoimento recebido ainda.</div>}
  </section>;
}
