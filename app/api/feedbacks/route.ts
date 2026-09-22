import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "../../../db";
import { feedbacks } from "../../../db/schema";

const allowedInterests = ["Jiu Jitsu Adulto", "Jiu Jitsu Kids"];

export async function GET() {
  try {
    const rows = await getDb().select({ id: feedbacks.id, name: feedbacks.name, interest: feedbacks.interest, message: feedbacks.message }).from(feedbacks).where(eq(feedbacks.approved, true)).orderBy(desc(feedbacks.id));
    return NextResponse.json(rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível carregar os depoimentos" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const interest = String(body.interest ?? "").trim();
    const message = String(body.message ?? "").trim();
    if (name.length < 2 || name.length > 80 || !allowedInterests.includes(interest) || message.length < 10 || message.length > 500) return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    await getDb().insert(feedbacks).values({ name, interest, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Não foi possível enviar o depoimento" }, { status: 500 });
  }
}
