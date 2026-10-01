import { database } from '@/db/progress';
import { exercises, grade } from '@/lib/catalog';
import { dayKey } from '@/lib/topics';
export async function POST(request:Request){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({error:'Origem não autorizada.'},{status:403});
 try{
 const raw=await request.text();if(raw.length>12000)return Response.json({error:'Resposta muito longa.'},{status:413});
 let body;try{body=JSON.parse(raw)}catch{return Response.json({error:'Requisição inválida.'},{status:400})}
 const e=exercises.find(x=>x.id===body.exerciseId);
 if(!e||typeof body.id!=='string'||!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(body.id)||!Array.isArray(body.answers)||body.answers.length!==e.answers.length||body.answers.some((v:unknown)=>typeof v!=='string'||!v.trim()||v.length>1500))return Response.json({error:'Preencha todas as lacunas antes de verificar.'},{status:400});
 const correct=grade(e,body.answers);const db=database();const date=new Date();
 await db.prepare('INSERT INTO attempts (id, exercise_id, correct, created_at, day) VALUES (?, ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING').bind(body.id,e.id,correct?1:0,date.toISOString(),dayKey(date)).run();
 const attempt=await db.prepare('SELECT * FROM attempts WHERE id = ?').bind(body.id).first();
 if(attempt?.exercise_id!==e.id)return Response.json({error:'Identificador de tentativa em conflito.'},{status:409});
 return Response.json({attempt,correct:!!attempt?.correct,explanation:attempt?.correct?e.explanation:'Ainda não é a resposta esperada. Consulte a dica e revise as lacunas.',solutions:attempt?.correct?e.answers.map(a=>a[0]):undefined});
 }catch(error){console.error('attempt',error);return Response.json({error:'Não foi possível salvar sua tentativa. Suas respostas foram preservadas; tente novamente.'},{status:503});}
}
