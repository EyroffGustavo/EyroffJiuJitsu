"use client";

import {FormEvent,useEffect,useMemo,useState} from "react";

type Schedule={id:number;category:string;label:string};

export default function ScheduleInterest(){
  const[schedules,setSchedules]=useState<Schedule[]>([]);
  const[category,setCategory]=useState("");
  const[selectedIds,setSelectedIds]=useState<number[]>([]);
  const[status,setStatus]=useState("");

  useEffect(()=>{
    fetch(`/api/schedules?t=${Date.now()}`,{cache:"no-store"})
      .then(async response=>{
        if(!response.ok)throw new Error("Não foi possível carregar os horários");
        return response.json();
      })
      .then(rows=>setSchedules(Array.isArray(rows)?rows:[]))
      .catch(()=>{setSchedules([]);setStatus("Não foi possível carregar os horários. Atualize a página e tente novamente.")});
  },[]);

  const categories=useMemo(()=>Array.from(new Set(schedules.map(item=>item.category))).sort((a,b)=>a.localeCompare(b,"pt-BR")),[schedules]);
  const available=useMemo(()=>schedules.filter(item=>item.category===category),[schedules,category]);

  function changeCategory(value:string){
    setCategory(value);
    setSelectedIds([]);
  }

  function toggleSchedule(id:number,checked:boolean){
    setSelectedIds(current=>checked?[...current,id]:current.filter(item=>item!==id));
  }

  async function send(e:FormEvent<HTMLFormElement>){
    e.preventDefault();
    const form=e.currentTarget;
    const data=new FormData(form);
    const suggestedTime=String(data.get("suggestedTime")??"").trim();
    if(!selectedIds.length&&!suggestedTime){setStatus("Escolha pelo menos um horário ou sugira outro.");return}
    setStatus("Registrando...");
    try{
      const response=await fetch("/api/schedule-responses",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:data.get("name"),phone:data.get("phone"),category,scheduleIds:selectedIds,suggestedTime})});
      const result=await response.json().catch(()=>({}));
      if(response.ok){form.reset();setCategory("");setSelectedIds([]);setStatus("Interesse registrado! Obrigado por participar.")}
      else setStatus(result.error??"Não foi possível registrar. Tente novamente.");
    }catch{
      setStatus("Não foi possível conectar ao servidor. Tente novamente.");
    }
  }

  return <section className="scheduleSurvey" id="horarios">
    <div className="surveyIntro">
      <span>03 — PESQUISA DE HORÁRIOS</span>
      <h2>QUAIS HORÁRIOS FUNCIONAM PARA VOCÊ?</h2>
      <p>Queremos organizar as turmas nos horários de maior procura. Você pode selecionar todas as opções que atendem à sua rotina ou sugerir um novo horário.</p>
      <div className="surveySteps"><b>1. Informe seus dados</b><b>2. Escolha a turma</b><b>3. Marque um ou mais horários</b></div>
    </div>
    <form onSubmit={send} className="surveyForm">
      <label>Nome completo<input name="name" required minLength={2} maxLength={100}/></label>
      <label>WhatsApp<input name="phone" inputMode="tel" required maxLength={20} placeholder="(47) 99999-9999"/></label>
      <label>Tenho interesse em
        <select name="category" required value={category} onChange={e=>changeCategory(e.target.value)}>
          <option value="">Selecione</option>
          {categories.map(item=><option key={item} value={item}>{item}</option>)}
        </select>
      </label>
      {category&&<fieldset>
        <legend>Horários de interesse <small>(marque quantos quiser)</small></legend>
        {available.length?available.map(item=><label className="scheduleOption" key={item.id}><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={e=>toggleSchedule(item.id,e.target.checked)}/><span>{item.label}</span></label>):<p className="noSchedule">Nenhum horário disponível nesta turma. Use o campo abaixo para sugerir um.</p>}
      </fieldset>}
      <label>Tem algum horário para sugerir? Diz pra gente aqui embaixo<input name="suggestedTime" maxLength={50} placeholder="Ex.: 6h ou 15h"/></label>
      <button className="button" type="submit">REGISTRAR MEU INTERESSE →</button>
      <p className="status">{status}</p>
    </form>
  </section>
}
