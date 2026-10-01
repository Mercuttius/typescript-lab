export const topics = [
{id:'explicit',name:'Tipagem explícita',counts:[35,30,15],tag:'Tipos que dizem o que são.'},
{id:'aliases',name:'Type aliases',counts:[25,25,20],tag:'Dê nome às suas ideias.'},
{id:'interfaces',name:'Interfaces',counts:[25,25,20],tag:'Contratos para seus objetos.'},
{id:'literals',name:'Literal types',counts:[20,15,5],tag:'Só os valores que fazem sentido.'},
{id:'unions',name:'Union types',counts:[25,30,25],tag:'Mais de uma possibilidade.'},
{id:'enums',name:'Enums',counts:[10,10,5],tag:'Constantes com significado.'},
{id:'special',name:'Tipos especiais',counts:[20,25,15],tag:'Conheça os limites do seu tipo.'},
{id:'narrowing',name:'Type narrowing',counts:[25,30,25],tag:'Verifique antes de usar.'},
{id:'intersections',name:'Intersection types',counts:[15,15,10],tag:'Tipos que trabalham juntos.'},
{id:'classes',name:'Modificadores de classe',counts:[15,15,10],tag:'Controle o acesso aos seus dados.'},
{id:'promises',name:'Tipagem de Promise',counts:[20,20,15],tag:'Tipos que chegam depois.'},
{id:'packages',name:'Pacotes @types',counts:[8,5,2],tag:'Conecte bibliotecas ao TypeScript.'},
{id:'config',name:'tsconfig.json',counts:[12,10,8],tag:'Configure seu ambiente de aprendizado.'},
{id:'generics',name:'Generics',counts:[25,35,40],tag:'Reutilize sem perder os tipos.'},
{id:'utilities',name:'Utility Types',counts:[25,35,30],tag:'Transforme tipos, simplifique código.'},
{id:'declarations',name:'Declarações .d.ts',counts:[10,10,5],tag:'Descreva o código que já existe.'},
] as const;
export type Level='easy'|'medium'|'hard';
export const levels:Level[]=['easy','medium','hard'];
export const levelNames:Record<Level,string>={easy:'Fácil',medium:'Médio',hard:'Difícil'};
export type Exercise={id:string;topic:string;level:Level;title:string;prompt:string;code:string;hint:string;explanation:string;answers:string[][];extension:string;check?:boolean};
export type PublicExercise=Omit<Exercise,'answers'|'explanation'|'check'> & {blanks:number};
export type Attempt={id:string;exercise_id:string;correct:number;created_at:string;day:string};
export function dayKey(date=new Date()){return new Intl.DateTimeFormat('en-CA',{timeZone:'America/Sao_Paulo',year:'numeric',month:'2-digit',day:'2-digit'}).format(date)}
