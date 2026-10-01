import { topics, type PublicExercise } from './topics';
export type Stats={exercise_id:string;correct:number;wrong:number;last_at:string};
export type Day={day:string;completed:number;correct:number;wrong:number};
export function summarize(exercises:PublicExercise[],stats:Stats[]){
 const byId=new Map(stats.map(s=>[s.exercise_id,s]));
 const correct=stats.reduce((n,s)=>n+s.correct,0),wrong=stats.reduce((n,s)=>n+s.wrong,0);
 const completed=stats.filter(s=>s.correct>0).length;
 const topicStats=topics.map(t=>{
  const all=exercises.filter(e=>e.topic===t.id);
  const seen=all.filter(e=>byId.has(e.id));
  const done=seen.filter(e=>(byId.get(e.id)?.correct||0)>0).length;
  // Each exercise contributes once, so repeated easy answers cannot dominate proficiency.
  const weight=(e:PublicExercise)=>e.level==='hard'?3:e.level==='medium'?2:1;
  const evidence=seen.reduce((n,e)=>{const s=byId.get(e.id)!;return n+weight(e)*s.correct/(s.correct+s.wrong)},0);
  const observedWeight=seen.reduce((n,e)=>n+weight(e),0);
  return {...t,total:all.length,done,seen:seen.length,score:observedWeight?Math.round(evidence/observedWeight*100):0,
   correct:seen.reduce((n,e)=>n+(byId.get(e.id)?.correct||0),0),wrong:seen.reduce((n,e)=>n+(byId.get(e.id)?.wrong||0),0)};
 });
 const observed=topicStats.filter(t=>t.seen>0);
 const score=observed.length?Math.round(observed.reduce((n,t)=>n+t.score*t.seen,0)/observed.reduce((n,t)=>n+t.seen,0)):0;
 const label=stats.length<10?'Em avaliação':score>=85&&completed>=225?'Avançando com consistência':score>=65?'Em desenvolvimento':'Construindo a base';
 return {byId,correct,wrong,completed,topicStats,score,label};
}
