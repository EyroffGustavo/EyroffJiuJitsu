import {eq} from "drizzle-orm";
import {NextResponse} from "next/server";
import {getDb} from "../../../../db";
import {classProfessors,professors} from "../../../../db/schema";
import {isAdminAuthenticated} from "../../../admin/auth";
import {hashPassword} from "../../../professor/auth";

export async function POST(req:Request){
  if(!await isAdminAuthenticated())return NextResponse.json({error:"Não autorizado"},{status:401});
  const b=await req.json(),name=String(b.name??"").trim(),username=String(b.username??"").trim().toLowerCase(),password=String(b.password??"");
  if(name.length<2||username.length<3||password.length<6)return NextResponse.json({error:"Preencha nome, usuário e uma senha com 6 ou mais caracteres"},{status:400});
  if(!/^[a-z0-9._-]+$/.test(username))return NextResponse.json({error:"O usuário pode ter apenas letras, números, ponto, hífen e sublinhado"},{status:400});
  const[existing]=await getDb().select({id:professors.id}).from(professors).where(eq(professors.username,username)).limit(1);
  if(existing)return NextResponse.json({error:"Este usuário já existe"},{status:409});
  try{
    const salt=crypto.randomUUID(),passwordHash=await hashPassword(password,salt);
    const[created]=await getDb().insert(professors).values({name,username,passwordHash,passwordSalt:salt}).returning({id:professors.id,name:professors.name,username:professors.username,active:professors.active,createdAt:professors.createdAt});
    return NextResponse.json(created);
  }catch(error){
    console.error("Falha ao criar professor",error);
    return NextResponse.json({error:"Não foi possível criar o professor. Tente novamente."},{status:500});
  }
}

export async function PATCH(req:Request){
  if(!await isAdminAuthenticated())return NextResponse.json({error:"Não autorizado"},{status:401});
  const b=await req.json(),id=Number(b.id);
  if(!Number.isInteger(id))return NextResponse.json({error:"ID inválido"},{status:400});
  if(typeof b.active==="boolean")await getDb().update(professors).set({active:b.active}).where(eq(professors.id,id));
  if(typeof b.password==="string"){
    if(b.password.length<6)return NextResponse.json({error:"A senha precisa ter pelo menos 6 caracteres"},{status:400});
    const salt=crypto.randomUUID();
    await getDb().update(professors).set({passwordSalt:salt,passwordHash:await hashPassword(b.password,salt)}).where(eq(professors.id,id));
  }
  return NextResponse.json({ok:true});
}

export async function DELETE(req:Request){
  if(!await isAdminAuthenticated())return NextResponse.json({error:"Não autorizado"},{status:401});
  const b=await req.json(),id=Number(b.id);
  if(!Number.isInteger(id))return NextResponse.json({error:"ID inválido"},{status:400});
  const[professor]=await getDb().select({id:professors.id}).from(professors).where(eq(professors.id,id)).limit(1);
  if(!professor)return NextResponse.json({error:"Professor não encontrado"},{status:404});
  await getDb().delete(classProfessors).where(eq(classProfessors.professorId,id));
  await getDb().delete(professors).where(eq(professors.id,id));
  return NextResponse.json({ok:true});
}
