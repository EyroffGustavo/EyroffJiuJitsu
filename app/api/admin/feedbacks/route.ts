import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../../db";
import { feedbacks } from "../../../../db/schema";
import { isAdminAuthenticated } from "../../../admin/auth";

export async function PATCH(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  try {
    const body = await request.json();
    const id = Number(body.id);
    if (!Number.isInteger(id) || typeof body.approved !== "boolean") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    await getDb().update(feedbacks).set({ approved: body.approved }).where(eq(feedbacks.id, id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível atualizar" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  await getDb().delete(feedbacks).where(eq(feedbacks.id, id));
  return NextResponse.json({ ok: true });
}
