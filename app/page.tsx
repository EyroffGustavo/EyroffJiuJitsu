import ScheduleInterest from "./schedule-interest";
import Testimonials from "./testimonials";

export default function Home(){return <main>
  <header><a className="brand brandLogo" href="#inicio"><img src="/logo-eyroff-original.png" alt="Eyroff Escola de Jiu Jitsu"/></a><nav><a href="#escola">A escola</a><a href="#turmas">Turmas</a><a href="#horarios">Horários</a><a href="#depoimentos">Experiências</a></nav></header>
  <section className="hero" id="inicio"><div><span>EYROFF ESCOLA DE JIU JITSU</span><h1>MAIS QUE UMA LUTA.<br/><em>UMA NOVA VERSÃO DE VOCÊ.</em></h1><p>Jiu Jitsu para quem quer evoluir dentro e fora do tatame. Técnica, disciplina, confiança e uma equipe que cresce junto.</p></div><div className="originalLogo"><img src="/logo-eyroff-original.png" alt="Logo oficial Eyroff Escola de Jiu Jitsu"/></div></section>
  <section className="intro" id="escola"><div><span>01 — NOSSA ESCOLA</span><h2>SEU PRIMEIRO PASSO COMEÇA AQUI.</h2></div><div><p>Você não precisa estar em forma, ter experiência ou “saber lutar” para começar. A Escola recebe cada aluno no seu nível e constrói evolução de verdade.</p><p>Um ambiente seguro, técnico e acolhedor para crianças e adultos.</p></div></section>
  <section className="classes" id="turmas"><span>02 — ENCONTRE SUA TURMA</span><h2>JIU JITSU É PARA TODOS.</h2><div className="cards"><article><b>JIU JITSU ADULTO</b><h3>FORÇA, TÉCNICA E CONFIANÇA.</h3></article><article><b>JIU JITSU KIDS</b><h3>DISCIPLINA ALÉM DO TATAME.</h3></article></div></section>
  <ScheduleInterest/><Testimonials/>
  <section className="schoolAddress"><span>05 — ONDE ESTAMOS</span><h2>SEU LUGAR NO TATAME ESTÁ TE ESPERANDO.</h2><p><b>Rua Erich Steinbach, 22 — Sala 302</b><br/>Instagram: @eyroffjiujitsu</p></section>
  <footer>© 2026 EYROFF ESCOLA DE JIU JITSU <span><a href="/professor">Área do professor</a> · <a href="/admin">Administração</a></span></footer>
</main>}
