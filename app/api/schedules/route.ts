import {asc,eq} from "drizzle-orm";import {NextResponse} from "next/server";import {getDb} from "../../../db";import {classSchedules} from "../../../db/schema";
export const dynamic="force-dynamic";
export const revalidate=0;
export async function GET(){
  try{
    const rows=await getDb().select({id:classSchedules.id,category:classSchedules.category,label:classSchedules.label}).from(classSchedules).where(eq(classSchedules.active,true)).orderBy(asc(classSchedules.category),asc(classSchedules.position),asc(classSchedules.id));
    return NextResponse.json(rows,{headers:{"Cache-Control":"no-store, no-cache, must-revalidate, max-age=0"}});
  }catch(error){
    console.error("Falha ao carregar horários",error);
    return NextResponse.json({error:"Não foi possível carregar os horários"},{status:500,headers:{"Cache-Control":"no-store"}});
  }
}
