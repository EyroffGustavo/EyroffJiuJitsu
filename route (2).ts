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
    if (!Number.isInteger(id) || typeof body.published !== "boolean") return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    await getDb().update(feedbacks).set({ published: body.published }).where(eq(feedbacks.id, id));
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao atualizar" }, { status: 500 });
  }
}
