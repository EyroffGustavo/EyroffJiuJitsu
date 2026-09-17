"use client";
import { useMemo, useState } from "react";

type Lead = { id: number; name: string; age: number; interest: string; phone: string; instagram: string; createdAt: string };

export default function AdminTable({ rows }: { rows: Lead[] }) {
  const [search, setSearch] = useState("");
  const [interest, setInterest] = useState("");
  const [minAge, setMinAge] = useState("");
  const [maxAge, setMaxAge] = useState("");
  const interests = useMemo(() => Array.from(new Set(rows.map(row => row.interest))).sort(), [rows]);
  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("pt-BR");
    return rows.filter(row => {
      const searchable = `${row.name} ${row.phone} ${row.instagram}`.toLocaleLowerCase("pt-BR");
      return (!term || searchable.includes(term)) && (!interest || row.interest === interest) && (!minAge || row.age >= Number(minAge)) && (!maxAge || row.age <= Number(maxAge));
    });
  }, [rows, search, interest, minAge, maxAge]);

  function clearFilters() { setSearch(""); setInterest(""); setMinAge(""); setMaxAge(""); }

  return <><section className="filters" aria-label="Filtros dos interessados"><label className="searchField">Pesquisar<input value={search} onChange={e => setSearch(e.target.value)} placeholder="Nome, telefone ou Instagram" /></label><label>Turma / interesse<select value={interest} onChange={e => setInterest(e.target.value)}><option value="">Todas</option>{interests.map(item => <option key={item}>{item}</option>)}</select></label><label>Idade mínima<input type="number" min="3" max="100" value={minAge} onChange={e => setMinAge(e.target.value)} placeholder="Ex.: 6" /></label><label>Idade máxima<input type="number" min="3" max="100" value={maxAge} onChange={e => setMaxAge(e.target.value)} placeholder="Ex.: 17" /></label><button className="clearFilters" type="button" onClick={clearFilters}>Limpar filtros</button></section><div className="resultsCount"><b>{filtered.length}</b> de {rows.length} cadastro(s) encontrado(s)</div><div className="table"><table><thead><tr><th>Data</th><th>Nome</th><th>Idade</th><th>Interesse</th><th>Telefone</th><th>Instagram</th><th>Ação</th></tr></thead><tbody>{filtered.map(row => <tr key={row.id}><td>{new Date(row.createdAt + "Z").toLocaleDateString("pt-BR")}</td><td><b>{row.name}</b></td><td>{row.age}</td><td>{row.interest}</td><td>{row.phone}</td><td>{row.instagram || "—"}</td><td><a className="whats" target="_blank" rel="noreferrer" href={"https://wa.me/55" + row.phone.replace(/\D/g, "") + "?text=" + encodeURIComponent("Olá, " + row.name + "! Recebemos seu interesse em " + row.interest + " na Escola Eyroff. Podemos conversar?")}>Chamar no WhatsApp</a></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="emptyResults"><b>Nenhum cadastro encontrado.</b><span>Ajuste ou limpe os filtros para visualizar outros interessados.</span></div>}</div></>;
}
