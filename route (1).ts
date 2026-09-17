import { NextResponse } from "next/server";
import { createSessionCookie, credentialsAreValid } from "../../../admin/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!(await credentialsAreValid(String(body.username ?? ""), String(body.password ?? "")))) return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 });
    const session = await createSessionCookie();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(session.name, session.value, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: session.maxAge });
    return response;
  } catch { return NextResponse.json({ error: "Não foi possível entrar" }, { status: 400 }); }
}
