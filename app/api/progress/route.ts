import { database } from '@/db/progress';
export async function GET(){try{
 const db=database();
 const [stats,days]=await Promise.all([
  db.prepare('SELECT exercise_id, SUM(correct) AS correct, COUNT(*) - SUM(correct) AS wrong, MAX(created_at) AS last_at FROM attempts GROUP BY exercise_id').all(),
  db.prepare('SELECT day, COUNT(DISTINCT CASE WHEN correct = 1 THEN exercise_id END) AS completed, SUM(correct) AS correct, COUNT(*) - SUM(correct) AS wrong FROM attempts GROUP BY day ORDER BY day DESC LIMIT 366').all(),
 ]);
 return Response.json({stats:stats.results,days:days.results},{headers:{'Cache-Control':'no-store'}});
}catch(error){console.error('progress',error);return Response.json({error:'Não foi possível carregar seu progresso. Tente novamente.'},{status:503});}}
