import {eq,inArray} from "drizzle-orm";
import {NextResponse} from "next/server";
import {getDb} from "../../../../db";
import {classSchedules} from "../../../../db/schema";
import {isAdminAuthenticated} from "../../../admin/auth";

async function guard(){return isAdminAuthenticated()}

export async function POST(req:Request){
  if(!await guard())return NextResponse.json({error:"Não autorizado"},{status:401});
  const b=await req.json(),category=String(b.category??"").trim(),label=String(b.label??"").trim();
  if(category.length<2||category.length>60||!label||label.length>50)return NextResponse.json({error:"Informe o nome da turma e o horário"},{status:400});
  const existing=await getDb().select({position:classSchedules.position}).from(classSchedules).where(eq(classSchedules.category,category));
  const position=existing.length?Math.max(...existing.map(item=>item.position))+1:0;
  const[created]=await getDb().insert(classSchedules).values({category,label,position}).returning();
  return NextResponse.json(created);
}

export async function PATCH(req:Request){
  if(!await guard())return NextResponse.json({error:"Não autorizado"},{status:401});
  const b=await req.json(),id=Number(b.id);
  if(Array.isArray(b.orderedIds)){
    const orderedIds=Array.from(new Set(b.orderedIds.map(Number).filter((value:number)=>Number.isInteger(value)&&value>0))) as number[];
    if(!orderedIds.length)return NextResponse.json({error:"Ordem inválida"},{status:400});
    const rows=await getDb().select({id:classSchedules.id,category:classSchedules.category}).from(classSchedules).where(inArray(classSchedules.id,orderedIds));
    if(rows.length!==orderedIds.length||new Set(rows.map(row=>row.category)).size!==1)return NextResponse.json({error:"Os horários precisam pertencer à mesma turma"},{status:400});
    await Promise.all(orderedIds.map((scheduleId,position)=>getDb().update(classSchedules).set({position}).where(eq(classSchedules.id,scheduleId))));
    return NextResponse.json({ok:true});
  }
  if(!Number.isInteger(id))return NextResponse.json({error:"ID inválido"},{status:400});
  if(typeof b.active==="boolean")await getDb().update(classSchedules).set({active:b.active}).where(eq(classSchedules.id,id));
  if(typeof b.category==="string"){
    const category=b.category.trim();
    if(category.length<2||category.length>60)return NextResponse.json({error:"Nome da turma inválido"},{status:400});
    await getDb().update(classSchedules).set({category}).where(eq(classSchedules.id,id));
  }
  if(typeof b.label==="string"){
    const label=b.label.trim();
    if(!label||label.length>50)return NextResponse.json({error:"Horário inválido"},{status:400});
    await getDb().update(classSchedules).set({label}).where(eq(classSchedules.id,id));
  }
  return NextResponse.json({ok:true});
}

export async function DELETE(req:Request){
  if(!await guard())return NextResponse.json({error:"Não autorizado"},{status:401});
  const id=Number(new URL(req.url).searchParams.get("id"));
  if(!Number.isInteger(id))return NextResponse.json({error:"ID inválido"},{status:400});
  await getDb().delete(classSchedules).where(eq(classSchedules.id,id));
  return NextResponse.json({ok:true});
}
