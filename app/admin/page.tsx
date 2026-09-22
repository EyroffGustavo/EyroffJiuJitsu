import { asc, desc, eq } from "drizzle-orm";
import { getDb } from "../../db";
import { academyClasses, attendanceRecords, attendanceSessions, classProfessors, classSchedules, classStudents, feedbacks, leads, professors, scheduleResponses, students } from "../../db/schema";
import { isAdminAuthenticated } from "./auth";
import LoginForm from "./login-form";
import AdminDashboard from "./admin-dashboard";
import SchoolAdmin from "./school-admin";

export const dynamic = "force-dynamic";

export default async function Admin() {
  if (!(await isAdminAuthenticated())) return <LoginForm />;
  const [leadRows,scheduleRows,responseRows,feedbackRows,professorRows,classRows,assignmentRows,studentRows,membershipRows,attendanceRows]=await Promise.all([
    getDb().select().from(leads).orderBy(desc(leads.id)),
    getDb().select().from(classSchedules).orderBy(asc(classSchedules.category),asc(classSchedules.position),asc(classSchedules.id)),
    getDb().select().from(scheduleResponses).orderBy(desc(scheduleResponses.id)),
    getDb().select().from(feedbacks).orderBy(desc(feedbacks.id)),
    getDb().select({id:professors.id,name:professors.name,username:professors.username,active:professors.active,createdAt:professors.createdAt}).from(professors).orderBy(asc(professors.name)),
    getDb().select().from(academyClasses).orderBy(asc(academyClasses.name)),
    getDb().select().from(classProfessors),
    getDb().select().from(students).orderBy(asc(students.name)),
    getDb().select().from(classStudents),
    getDb().select({studentId:attendanceRecords.studentId,classId:attendanceSessions.classId,classDate:attendanceSessions.classDate,status:attendanceRecords.status}).from(attendanceRecords).innerJoin(attendanceSessions,eq(attendanceRecords.sessionId,attendanceSessions.id)),
  ]);
  return <main className="admin"><div className="adminTop"><div><span>PAINEL ADMINISTRATIVO</span><h1>GESTÃO DA ESCOLA</h1><p>Horários, equipe, alunos e depoimentos em um só lugar.</p></div><div className="adminActions"><a className="button secondary" href="/professor">Área do professor</a><a className="button secondary" href="/">Ver site</a><form action="/api/admin/logout" method="post"><button className="textButton" type="submit">Sair</button></form></div></div><AdminDashboard initialLeads={leadRows} initialSchedules={scheduleRows} initialResponses={responseRows} initialFeedbacks={feedbackRows}/><SchoolAdmin initialProfessors={professorRows} initialClasses={classRows} initialAssignments={assignmentRows} students={studentRows} memberships={membershipRows} attendance={attendanceRows}/></main>;
}
