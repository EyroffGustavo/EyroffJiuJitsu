import {and,eq,inArray} from "drizzle-orm";
import {NextResponse} from "next/server";
import {getDb} from "../../../db";
import {classSchedules,scheduleResponses} from "../../../db/schema";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function POST(req:Request){
  try{
    const b=await req.json();
    const name=String(b.name??"").trim(),phone=String(b.phone??"").trim(),category=String(b.category??"").trim(),suggestedTime=String(b.suggestedTime??"").trim();
    const scheduleIds=Array.from(new Set((Array.isArray(b.scheduleIds)?b.scheduleIds:[]).map(Number).filter((id:number)=>Number.isInteger(id)&&id>0))) as number[];
    if(name.length<2||name.length>100||phone.length<8||phone.length>20||!category||category.length>60||suggestedTime.length>50)return NextResponse.json({error:"Dados inválidos"},{status:400});
    if(!scheduleIds.length&&!suggestedTime)return NextResponse.json({error:"Escolha pelo menos um horário ou sugira outro"},{status:400});

    const validSchedules=scheduleIds.length?await getDb().select().from(classSchedules).where(and(inArray(classSchedules.id,scheduleIds),eq(classSchedules.category,category),eq(classSchedules.active,true))):[];
    if(validSchedules.length!==scheduleIds.length)return NextResponse.json({error:"Um dos horários selecionados não está mais disponível"},{status:400});

    const records:{name:string;phone:string;category:string;scheduleId:number|null;scheduleLabel:string;suggestedTime:string}[]=validSchedules.map(schedule=>({name,phone,category,scheduleId:schedule.id,scheduleLabel:schedule.label,suggestedTime:""}));
    if(suggestedTime)records.push({name,phone,category,scheduleId:null,scheduleLabel:"Horário sugerido",suggestedTime});
    await getDb().insert(scheduleResponses).values(records);
    return NextResponse.json({ok:true,total:records.length});
  }catch(e){
    console.error("Falha ao registrar interesse em horário:",e);
    return NextResponse.json({error:"Não foi possível registrar agora. Verifique se a atualização do banco foi executada e tente novamente."},{status:500});
  }
}
