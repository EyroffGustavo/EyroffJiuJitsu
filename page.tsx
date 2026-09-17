import { desc } from "drizzle-orm";
import { getDb } from "../../db";
import { feedbacks, leads } from "../../db/schema";
import { isAdminAuthenticated } from "./auth";
import LoginForm from "./login-form";
import AdminTable from "./admin-table";
import FeedbackAdmin from "./feedback-admin";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdminAuthenticated())) return <LoginForm />;
  const db = getDb();
  const [leadRows, feedbackRows] = await Promise.all([
    db.select().from(leads).orderBy(desc(leads.id)),
    db.select().from(feedbacks).orderBy(desc(feedbacks.id)),
  ]);
  return <main className="admin">
    <div className="adminTop"><div><span>PAINEL ADMINISTRATIVO</span><h1>INTERESSADOS</h1><p>{leadRows.length} cadastro(s) recebido(s)</p></div><div className="adminActions"><a className="button secondary" href="/">Ver site</a><form action="/api/admin/logout" method="post"><button className="textButton" type="submit">Sair</button></form></div></div>
    <AdminTable rows={leadRows.map(row => ({...row, createdAt: row.createdAt.toISOString()}))}/>
    <FeedbackAdmin rows={feedbackRows.map(row => ({...row, createdAt: row.createdAt.toISOString()}))}/>
  </main>;
}
