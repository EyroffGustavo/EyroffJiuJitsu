"use client";
import { useState } from "react";

type Feedback = { id: number; name: string; interest: string; message: string; approved: boolean; createdAt: string };

export default function FeedbackManager({ initialRows }: { initialRows: Feedback[] }) {
  const [rows, setRows] = useState(initialRows);
  const [saving, setSaving] = useState<number | null>(null);

  async function toggle(id: number, approved: boolean) {
    setSaving(id);
    const response = await fetch("/api/admin/feedbacks", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ id, approved }) });
    if (response.ok) setRows(current => current.map(row => row.id === id ? { ...row, approved } : row));
    setSaving(null);
  }

  return <section className="feedbackAdmin"><div className="feedbackAdminTitle"><div><span>CURADORIA DA PÁGINA</span><h2>DEPOIMENTOS</h2></div><p>{rows.filter(row=>row.approved).length} publicado(s) de {rows.length}</p></div>{rows.length === 0 ? <div className="adminEmpty">Nenhum depoimento recebido ainda.</div> : <div className="feedbackAdminGrid">{rows.map(row=><article key={row.id} className={row.approved?"published":""}><div className="feedbackMeta"><b>{row.name}</b><span>{row.interest}</span></div><p>“{row.message}”</p><div className="feedbackDecision"><small>{new Date(row.createdAt+"Z").toLocaleDateString("pt-BR")}</small><label className="publishToggle"><input type="checkbox" checked={row.approved} disabled={saving===row.id} onChange={event=>toggle(row.id,event.target.checked)}/><span>{saving===row.id?"Salvando...":row.approved?"Publicado":"Exibir no site"}</span></label></div></article>)}</div>}</section>;
}
