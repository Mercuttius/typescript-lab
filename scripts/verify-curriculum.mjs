import ts from 'typescript';
import { build } from 'esbuild';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
const temp=mkdtempSync(path.join(tmpdir(),'tslab-verify-'));
try{
 await build({entryPoints:['lib/catalog.ts'],bundle:true,platform:'node',format:'esm',outfile:path.join(temp,'catalog.mjs')});
 await build({entryPoints:['lib/topics.ts'],bundle:true,platform:'node',format:'esm',outfile:path.join(temp,'topics.mjs')});
 const {exercises,grade,normalize}=await import(path.join(temp,'catalog.mjs'));
 const {topics,levels}=await import(path.join(temp,'topics.mjs'));
 assert.equal(exercises.length,900);assert.equal(new Set(exercises.map(e=>e.id)).size,900);
 const duplicates=new Map(),files=[];
 for(const t of topics)for(const [i,level] of levels.entries())assert.equal(exercises.filter(e=>e.topic===t.id&&e.level===level).length,t.counts[i],`${t.id} ${level}`);
 for(const e of exercises){
  assert.equal(e.code.split('___').length-1,e.answers.length,e.id);assert.ok(e.hint&&e.prompt&&e.explanation,e.id);
  assert.ok(grade(e,e.answers.map(a=>a[0])),e.id);assert.ok(!grade(e,e.answers.map(()=> '__incorrect__')),e.id);
  assert.ok(grade(e,e.answers.map(a=>'  '+a[0]+'  ')),e.id);
  const key=e.topic+'|'+e.code+'|'+JSON.stringify(e.answers);assert.ok(!duplicates.has(key),`Duplicate ${e.id} ${duplicates.get(key)}`);duplicates.set(key,e.id);
  let i=0;const solved=e.code.replace(/___/g,()=>e.answers[i++][0]);
  if(e.extension==='json'){JSON.parse(solved);continue}
  if(e.check===false)continue;
  const name=path.join(temp,e.id+'.'+e.extension);
  writeFileSync(name,(e.extension==='ts'?'export {};\n':'')+solved);files.push(name);
 }
 assert.notEqual(normalize('"a b"'),normalize('"ab"'));assert.equal(normalize("'string'"),normalize('"string"'));
 const program=ts.createProgram(files,{strict:true,noEmit:true,target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.ESNext,moduleResolution:ts.ModuleResolutionKind.Bundler,types:['node'],typeRoots:[path.resolve('node_modules/@types')],skipLibCheck:false});
 const diagnostics=ts.getPreEmitDiagnostics(program);
 if(diagnostics.length){console.error(ts.formatDiagnosticsWithColorAndContext(diagnostics,{getCurrentDirectory:()=>process.cwd(),getCanonicalFileName:f=>f,getNewLine:()=> '\n'}));process.exitCode=1}else console.log(`PASS: 900 exercises, exact distribution, unique IDs/code within topics, all blanks, grading; ${files.length} solved TypeScript/declaration files compiled under strict mode; JSON parsed.`);
}finally{rmSync(temp,{recursive:true,force:true})}
