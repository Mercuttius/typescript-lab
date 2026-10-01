import { applications } from './scenarios';
import { topics, levels, type Exercise, type Level } from './topics';
// Each context has its own data model; exercises combine a learning objective with that model.
const contexts = [
 ['Produto','catálogo','titulo','string','"Teclado"','preco','number','149.9','disponivel','boolean','true'],
 ['Usuario','perfis','email','string','"ana@exemplo.com"','idade','number','28','verificado','boolean','false'],
 ['Pedido','vendas','codigo','string','"PED-042"','itens','number','3','pago','boolean','true'],
 ['Sensor','telemetria','local','string','"estufa"','temperatura','number','23.5','online','boolean','true'],
 ['Curso','educação','nome','string','"TypeScript"','aulas','number','24','publicado','boolean','false'],
 ['Reserva','hotelaria','hospede','string','"Lia"','noites','number','4','confirmada','boolean','true'],
 ['Tarefa','produtividade','descricao','string','"Revisar PR"','prioridade','number','2','concluida','boolean','false'],
 ['Arquivo','armazenamento','caminho','string','"/docs/guia.pdf"','bytes','number','4096','publico','boolean','false'],
 ['Evento','agenda','titulo','string','"Workshop"','vagas','number','40','remoto','boolean','true'],
 ['Conta','finanças','titular','string','"Caio"','saldo','number','250.5','ativa','boolean','true'],
].map(([N,domain,a,ta,va,b,tb,vb,c,tc,vc],i)=>({N,domain,a,ta,va,b,tb,vb,c,tc,vc,i,
 fields:`${a}: ${ta}; ${b}: ${tb}; ${c}: ${tc}`,
 value:`{ ${a}: ${va}, ${b}: ${vb}, ${c}: ${vc} }`,
 base:`type ${N} = { ${a}: ${ta}; ${b}: ${tb}; ${c}: ${tc} };`,
}));
type C=typeof contexts[number];
type Draft={title:string;prompt:string;code:string;answers:string[][];hint:string;explanation:string;extension?:string;check?:boolean};
type Recipe=(c:C)=>Draft;
const d=(title:string,prompt:string,code:string,answers:(string|string[])[],hint:string,explanation?:string):Draft=>({title,prompt,code,answers:answers.map(x=>typeof x==='string'?[x]:x),hint,explanation:explanation||hint});
const sets:Record<string,Record<Level,Recipe[]>>={};
sets.explicit={easy:[
 c=>d('Texto com identidade',`Anote o tipo primitivo de ${c.a} no contexto de ${c.domain}.`,`const ${c.a}: ___ = ${c.va};\nconsole.log(${c.a}.toUpperCase());`,['string'],'Textos entre aspas têm o tipo primitivo string.'),
 c=>d('Uma medida numérica',`Use um tipo primitivo para ${c.b}, inclusive valores decimais.`,`let ${c.b}: ___ = ${c.vb};\n${c.b} += 1;`,['number'],'TypeScript usa number tanto para inteiros quanto para decimais.'),
 c=>d('Sinalizador de estado',`Anote o tipo de ${c.c}, que pode alternar entre true e false.`,`let ${c.c}: ___ = ${c.vc};\n${c.c} = !${c.c};`,['boolean'],'Um sinalizador verdadeiro/falso usa boolean.'),
 c=>d('Lista de textos',`Anote uma lista mutável de ${c.a}, usando string[] ou Array<string>.`,`const valores: ___ = [${c.va}];\nvalores.push("novo");`,[['string[]','Array<string>']],'Use o tipo dos elementos seguido de [] ou Array<T>.'),
],medium:[
 c=>d('Parâmetro e retorno',`A função lê ${c.b} de um objeto ${c.N}. Complete o parâmetro e o retorno.`,`${c.base}\nfunction medir(item: ___): ___ {\n  return item.${c.b};\n}\nconsole.log(medir(${c.value}));`,[c.N,'number'],`O parâmetro é ${c.N}; a propriedade ${c.b} é numérica.`),
 c=>d('Callback tipado',`Complete o retorno do callback que testa ${c.c} e o retorno de filtrar.`,`${c.base}\nfunction filtrar(itens: ${c.N}[], teste: (x: ${c.N}) => ___): ___ {\n  return itens.filter(teste);\n}\nfiltrar([${c.value}], x => x.${c.c});`,['boolean',[`${c.N}[]`,`Array<${c.N}>`]],'filter usa um predicado e devolve um array do mesmo tipo de elemento.'),
 c=>d('Tupla de resumo',`Use uma tupla [string, number] para o resumo de ${c.N}.`,`${c.base}\nfunction resumo(item: ${c.N}): ___ {\n  return [item.${c.a}, item.${c.b}];\n}\nconsole.log(resumo(${c.value}));`,['[string, number]'],'Uma tupla mantém o tipo de cada posição; não use um array de union.'),
],hard:[
 c=>d('Contrato de transformação',`Anote uma função que recebe ${c.N} e devolve string, depois complete seu retorno.`,`${c.base}\ntype Transformar = (entrada: ___) => ___;\nconst formatar: Transformar = entrada => entrada.${c.a};\nfunction executar(fn: Transformar, item: ${c.N}): ___ {\n  return fn(item);\n}\nexecutar(formatar, ${c.value});`,[c.N,'string','string'],'A assinatura deve preservar a relação entre a entrada de domínio e a saída textual.'),
 c=>d('Coleção imutável',`Complete a coleção somente leitura (ReadonlyArray), a seleção por chave e o retorno numérico.`,`${c.base}\nfunction somar(itens: ___<${c.N}>, ler: (x: ${c.N}) => ${c.N}[___]): ___ {\n  return itens.reduce((total, item) => total + ler(item), 0);\n}\nsomar([${c.value}], x => x.${c.b});`,['ReadonlyArray',`"${c.b}"`,'number'],'ReadonlyArray impede mutações; o acesso indexado usa uma chave literal entre aspas.'),
]};
sets.aliases={easy:[
 c=>d('Seu primeiro alias',`Declare ${c.N} usando a palavra-chave de alias.`,`___ ${c.N} = { ${c.fields} };\nconst item: ${c.N} = ${c.value};`,['type'],'Aliases são declarados com type, um nome e =.'),
 c=>d('Alias para uma coleção',`Complete o alias de lista usando o nome ${c.N}.`,`${c.base}\ntype Lista = ___[];\nconst itens: Lista = [${c.value}];`,[c.N],'Use o nome do tipo existente antes de [].'),
 c=>d('Propriedade opcional',`Permita que um ${c.N} exista sem o campo ${c.a}.`,`type ${c.N} = {\n  ${c.a}___: string;\n  ${c.b}: number;\n};\nconst item: ${c.N} = { ${c.b}: ${c.vb} };`,['?'],'O modificador ? depois do nome torna a propriedade opcional.'),
],medium:[
 c=>d('Chaves do modelo',`Extraia a união das chaves de ${c.N}.`,`${c.base}\ntype Chave = ___ ${c.N};\nconst chave: Chave = "${c.b}";`,['keyof'],'keyof produz a união das chaves de um objeto.'),
 c=>d('Tipo de uma propriedade',`Extraia o tipo de ${c.b} sem escrever number diretamente.`,`${c.base}\ntype Medida = ${c.N}[___];\nconst medida: Medida = ${c.vb};`,[`"${c.b}"`],'Um tipo indexado recebe uma chave literal, como Modelo["campo"].'),
 c=>d('Contrato de função',`Crie um alias de função que transforma ${c.N} em boolean.`,`${c.base}\ntype Validar = (item: ___) => ___;\nconst validar: Validar = item => item.${c.c};`,[c.N,'boolean'],'Aliases também descrevem funções, incluindo parâmetros e retorno.'),
],hard:[
 c=>d('Árvore recursiva',`Faça cada nó de ${c.domain} armazenar ${c.N} e uma lista do próprio tipo No.`,`${c.base}\ntype No = { valor: ___; filhos: ___[] };\nconst raiz: No = { valor: ${c.value}, filhos: [] };`,[c.N,'No'],'Um alias recursivo pode se referir a si mesmo dentro de uma propriedade.'),
 c=>d('Projeção com mapped type',`Mapeie todas as chaves de ${c.N}, mantendo seus tipos e tornando os campos readonly.`,`${c.base}\ntype Snapshot = {\n  readonly [K in ___ ${c.N}]: ${c.N}[___]\n};\nconst snapshot: Snapshot = ${c.value};`,['keyof','K'],'O parâmetro K percorre as chaves e é usado para consultar o tipo original.'),
]};
sets.interfaces={easy:[
 c=>d('Contrato de objeto',`Declare a interface ${c.N} para o objeto abaixo.`,`___ ${c.N} { ${c.fields} }\nconst item: ${c.N} = ${c.value};`,['interface'],'Uma interface usa chaves diretamente, sem =.'),
 c=>d('Campo somente leitura',`Impeça reatribuições de ${c.a} pela interface.`,`interface ${c.N} { ___ ${c.a}: string; ${c.b}: number }\nconst item: ${c.N} = { ${c.a}: ${c.va}, ${c.b}: ${c.vb} };`,['readonly'],'readonly restringe atribuições pelo tipo; não congela o objeto em runtime.'),
 c=>d('Método no contrato',`Complete o retorno de um método que informa ${c.c}.`,`interface ${c.N} {\n  consultar(): ___;\n}\nconst item: ${c.N} = { consultar: () => ${c.vc} };`,['boolean'],'A assinatura de método declara seus parâmetros e o tipo devolvido.'),
],medium:[
 c=>d('Herança de contrato',`Estenda Identificavel para dar um id ao ${c.N}.`,`interface Identificavel { id: string }\ninterface ${c.N} ___ Identificavel { ${c.fields} }\nconst item: ${c.N} = { id: "01", ...${c.value} };`,['extends'],'Uma interface estende outra com extends.'),
 c=>d('Dicionário de objetos',`Anote a chave textual e o valor ${c.N} da assinatura de índice.`,`${c.base}\ninterface Indice { [chave: ___]: ___ }\nconst indice: Indice = { principal: ${c.value} };`,['string',c.N],'Uma assinatura de índice descreve propriedades cujos nomes não são conhecidos previamente.'),
 c=>d('Implementar uma interface',`Use a palavra-chave que verifica se a classe cumpre o contrato.`,`interface Leitor { ler(): string }\nclass Leitor${c.N} ___ Leitor {\n  ler(): string { return ${c.va}; }\n}`,['implements'],'implements verifica o contrato; não fornece uma implementação dos métodos.'),
],hard:[
 c=>d('Contrato genérico de repositório',`Complete a chave id e a possibilidade de ausência ao consultar um repositório de ${c.N}.`,`${c.base}\ninterface Repositorio<T> {\n  buscar(id: ___): T | ___;\n}\nconst repo: Repositorio<${c.N}> = {\n  buscar: id => id === "01" ? ${c.value} : undefined\n};`,['string','undefined'],'A interface genérica precisa representar tanto o item quanto uma busca sem resultado.'),
 c=>d('Interface chamável',`Uma função também possui uma propriedade descrição. Complete entrada, retorno e tipo da descrição.`,`${c.base}\ninterface Regra {\n  (item: ___): ___;\n  descricao: ___;\n}\nconst regra: Regra = Object.assign(\n  (item: ${c.N}) => item.${c.c},\n  { descricao: "Verificar ${c.c}" }\n);`,[c.N,'boolean','string'],'Uma interface chamável combina uma assinatura de chamada e propriedades comuns.'),
]};
sets.unions={easy:[
 c=>d('Identificador flexível',`Permita identificadores numéricos ou textuais de ${c.N}.`,`type Id${c.N} = string ___ number;\nconst identificadores: Id${c.N}[] = ["${c.N.toLowerCase()}-1", 1];`,['|'],'O operador | aceita uma possibilidade ou outra.'),
 c=>d('Item ausente',`Complete a união para representar uma busca sem ${c.N}.`,`${c.base}\nlet resultado: ${c.N} | ___ = null;\nresultado = ${c.value};`,['null'],'null representa a ausência explícita neste contrato.'),
 c=>d('Configuração não informada',`Permita que ${c.a} fique undefined até ser configurado.`,`let ${c.a}: string | ___ = undefined;\n${c.a} = ${c.va};`,['undefined'],'Uma variável pode unir seu tipo principal a undefined.'),
],medium:[
 c=>d('Resposta discriminada',`Complete os literais do discriminante de sucesso e de falha.`,`${c.base}\ntype Resposta =\n  | { ok: ___; dado: ${c.N} }\n  | { ok: ___; erro: string };\nconst resposta: Resposta = { ok: true, dado: ${c.value} };`,['true','false'],'Literais booleanos no discriminante associam cada estado aos campos disponíveis.'),
 c=>d('Normalizar entradas',`Use typeof para diferenciar o texto de um objeto ${c.N}.`,`${c.base}\nfunction nome(entrada: string | ${c.N}): string {\n  if (typeof entrada === ___) return entrada;\n  return entrada.___;\n}`,['"string"',c.a],'Depois de eliminar string, resta apenas o objeto de domínio.'),
 c=>d('Lista heterogênea',`Anote cada elemento como ${c.N} ou null, preservando os parênteses.`,`${c.base}\nconst itens: (___ | ___)[] = [${c.value}, null];`,[c.N,'null'],'Os parênteses fazem [] se aplicar à união inteira.'),
],hard:[
 c=>d('Máquina de estados',`Complete os estados literais que permitem acessar dados e erro com segurança.`,`${c.base}\ntype Estado =\n | { status: "idle" }\n | { status: "pronto"; dados: ${c.N} }\n | { status: "erro"; mensagem: string };\nfunction apresentar(e: Estado): string {\n if (e.status === ___) return e.dados.${c.a};\n if (e.status === ___) return e.mensagem;\n return "Aguardando";\n}`,['"pronto"','"erro"'],'O discriminante status determina quais campos existem em cada ramo.'),
 c=>d('Excluir o ramo de erro',`Use Extract para selecionar o ramo que contém ${c.N}.`,`${c.base}\ntype Resultado = { ok: true; valor: ${c.N} } | { ok: false; erro: string };\ntype Sucesso = ___<Resultado, { ok: ___ }>;\nconst sucesso: Sucesso = { ok: true, valor: ${c.value} };`,['Extract','true'],'Extract mantém os membros da união compatíveis com o filtro.'),
 c=>d('Exaustividade de estados',`Complete o tipo que comprova que todos os estados foram tratados.`,`${c.base}\ntype Estado = { tipo: "item"; valor: ${c.N} } | { tipo: "vazio" };\nfunction ler(e: Estado): string {\n switch (e.tipo) {\n  case "item": return e.valor.${c.a};\n  case "vazio": return "Sem dados";\n  default: { const impossivel: ___ = e; return impossivel; }\n }\n}`,['never'],'Depois de esgotar os membros da união, o valor restante tem tipo never.'),
]};
sets.intersections={easy:[
 c=>d('Objeto com auditoria',`Combine ${c.N} com um campo de criação.`,`${c.base}\ntype Auditado = ${c.N} ___ { criadoEm: Date };\nconst item: Auditado = { ...${c.value}, criadoEm: new Date() };`,['&'],'Uma interseção exige que o objeto satisfaça ambos os tipos.'),
 c=>d('Combinar identidade',`Complete a interseção usando o alias Identidade.`,`${c.base}\ntype Identidade = { id: string };\ntype Registro = ${c.N} & ___;\nconst item: Registro = { id: "${c.N.toLowerCase()}-01", ...${c.value} };`,['Identidade'],'Combine contratos reutilizáveis pelo nome de cada alias.'),
],medium:[
 c=>d('Metadados de versão',`Combine modelo, versão e permissões em uma única interseção.`,`${c.base}\ntype Versao = { versao: number };\ntype Permissao = { editar: boolean };\ntype Completo = ${c.N} ___ Versao ___ Permissao;\nconst item: Completo = { ...${c.value}, versao: 1, editar: true };`,['&','&'],'Cada & acrescenta mais um contrato que o mesmo valor deve satisfazer.'),
 c=>d('Campo incompatível',`O campo ${c.b} precisa ser number e string ao mesmo tempo. Qual tipo resulta dessa interseção?`,`${c.base}\ntype Conflito = ${c.N} & { ${c.b}: string };\ntype Campo = Conflito["${c.b}"];\ntype Esperado = ___;\nconst provar = (x: Campo): Esperado => x;`,['never'],'A interseção de number e string é impossível: never.'),
],hard:[
 c=>d('Substituir sem conflito',`Remova ${c.b} com Omit antes de redefinir o campo como string.`,`${c.base}\ntype Serializado = ___<${c.N}, ___> & { ${c.b}: string };\nconst item: Serializado = { ...${c.value}, ${c.b}: String(${c.vb}) };`,['Omit',`"${c.b}"`],'Interseção não sobrescreve campos: remova o campo antigo antes de adicionar o novo.'),
]};
sets.literals={easy:[
 c=>d('Estado permitido',`Use o literal de texto "ativo" para o estado inicial de ${c.domain}.`,`type Estado${c.N} = ___ | "inativo";\nconst estado: Estado${c.N} = "ativo";`,['"ativo"'],'Um literal entre aspas aceita exatamente aquele texto.'),
 c=>d('Congelar a inferência',`Preserve o valor literal de ${c.a} usando uma const assertion.`,`const opcoes = { ${c.a}: ${c.va}, modo: "leitura" } as ___;\ntype Modo = typeof opcoes.modo;`,['const'],'as const preserva literais e marca as propriedades como readonly.'),
],medium:[
 c=>d('Extrair opções da tupla',`Extraia a união de todos os valores da tupla usando seu índice numérico.`,`const campos = ["${c.a}", "${c.b}", "${c.c}"] as const;\ntype Campo = typeof campos[___];\nconst campo: Campo = "${c.b}";`,['number'],'T[number] obtém o tipo de qualquer elemento de uma tupla ou array.'),
 c=>d('Evento com template literal',`Complete a chave para permitir o evento "${c.a}Changed".`,`type Chave = ___ | "${c.b}";\ntype Evento = \`${'${Chave}'}Changed\`;\nconst evento: Evento = "${c.a}Changed";`,[`"${c.a}"`],'Template literal types combinam partes fixas com uma união de textos.'),
],hard:[
 c=>d('Validar sem perder literais',`Valide com satisfies e preserve os valores literais com as const.`,`${c.base}\nconst item = ${c.value} as ___ ___ ${c.N};\ntype NomeExato = typeof item.${c.a};`,['const','satisfies'],'as const preserva os literais; satisfies verifica compatibilidade sem substituir o tipo inferido.'),
]};
sets.generics={easy:[
 c=>d('Identidade genérica',`Faça a função devolver o mesmo tipo que recebeu e use-a com ${c.N}.`,`${c.base}\nfunction identidade<T>(valor: ___): ___ { return valor; }\nconst item = identidade<${c.N}>(${c.value});`,['T','T'],'O mesmo parâmetro T deve aparecer na entrada e na saída.'),
 c=>d('Caixa reutilizável',`Complete o tipo do conteúdo da caixa de ${c.N}.`,`${c.base}\ntype Caixa<T> = { conteudo: ___ };\nconst caixa: Caixa<${c.N}> = { conteudo: ${c.value} };`,['T'],'O parâmetro de tipo representa o conteúdo variável do contêiner.'),
 c=>d('Array genérico',`Receba um array de T e devolva uma cópia do mesmo tipo.`,`${c.base}\nfunction copiar<T>(itens: ___[]): T[] { return [...itens]; }\nconst copia = copiar<${c.N}>([${c.value}]);`,['T'],'O parâmetro T representa o elemento, não a coleção inteira.'),
],medium:[
 c=>d('Restrição de propriedade',`Restrinja T a objetos com o campo textual ${c.a}.`,`${c.base}\nfunction rotulo<T ___ { ${c.a}: string }>(item: T): string {\n return item.${c.a};\n}\nrotulo(${c.value});`,['extends'],'extends em um parâmetro genérico limita quais tipos podem ser usados.'),
 c=>d('Ler por chave',`Restrinja K às chaves de T e preserve o tipo da propriedade retornada.`,`${c.base}\nfunction obter<T, K extends ___ T>(item: T, chave: K): T[___] {\n return item[chave];\n}\nconst valor = obter(${c.value}, "${c.b}");`,['keyof','K'],'keyof limita as chaves; T[K] mantém o tipo exato do valor consultado.'),
 c=>d('Transformar uma coleção',`Complete os parâmetros genéricos da função map para converter ${c.N} em texto.`,`${c.base}\nfunction mapear<T, U>(itens: T[], fn: (item: ___) => ___): U[] {\n return itens.map(fn);\n}\nmapear([${c.value}], item => item.${c.a});`,['T','U'],'T descreve a entrada e U a saída; não precisam ser o mesmo tipo.'),
 c=>d('Valor padrão de tipo',`Use ${c.N} como parâmetro genérico padrão da resposta.`,`${c.base}\ntype Resposta<T ___ ${c.N}> = { dado: T; status: number };\nconst resposta: Resposta = { dado: ${c.value}, status: 200 };`,['='],'Um parâmetro genérico pode ter um tipo padrão após =.'),
],hard:[
 c=>d('Inferir o item',`Extraia o elemento de um array usando infer; use never para os demais tipos.`,`${c.base}\ntype Elemento<T> = T extends (___ U)[] ? U : ___;\ntype Item = Elemento<${c.N}[]>;\nconst item: Item = ${c.value};`,['infer','never'],'infer introduz uma variável de tipo dentro da condição de um conditional type.'),
 c=>d('Selecionar propriedades por tipo',`Mantenha apenas as chaves de ${c.N} cujos valores são numéricos.`,`${c.base}\ntype ChavesNumericas<T> = {\n [K in keyof T]: T[K] extends ___ ? K : ___\n}[keyof T];\nconst chave: ChavesNumericas<${c.N}> = "${c.b}";`,['number','never'],'Cada propriedade vira sua própria chave ou never; o acesso indexado reúne os resultados.'),
 c=>d('Atualização segura',`Relacione o tipo do novo valor à chave K em uma atualização imutável.`,`${c.base}\nfunction atualizar<T, K extends keyof T>(obj: T, chave: ___, valor: ___): T {\n return { ...obj, [chave]: valor };\n}\natualizar(${c.value}, "${c.b}", 100);`,['K','T[K]'],'Usar T[K] impede passar texto a uma propriedade numérica.'),
 c=>d('Mapeamento com novo nome',`Complete o remapeamento de chaves para gerar getters de ${c.N}.`,`${c.base}\ntype Getters<T> = {\n [K in keyof T as \`get${'${Capitalize<K & string>}'}\`]: () => T[___]\n};\ntype Leitores = Getters<___>;\nconst exemplo: Leitores["get${c.a[0].toUpperCase()+c.a.slice(1)}"] = () => ${c.va};`,['K',c.N],'O as remapeia o nome; T[K] mantém o tipo original e Capitalize altera a primeira letra.'),
]};
sets.utilities={easy:[
 c=>d('Atualização parcial',`Torne todas as propriedades de ${c.N} opcionais.`,`${c.base}\ntype Atualizacao = ___<${c.N}>;\nconst patch: Atualizacao = { ${c.b}: ${c.vb} };`,['Partial'],'Partial<T> permite fornecer apenas os campos que serão atualizados.'),
 c=>d('Selecionar um campo',`Use Pick para manter apenas ${c.a}.`,`${c.base}\ntype Resumo = ___<${c.N}, "${c.a}">;\nconst resumo: Resumo = { ${c.a}: ${c.va} };`,['Pick'],'Pick seleciona as propriedades informadas no segundo parâmetro.'),
 c=>d('Remover um campo',`Remova ${c.c} da versão pública de ${c.N}.`,`${c.base}\ntype Publico = ___<${c.N}, "${c.c}">;\nconst publico: Publico = { ${c.a}: ${c.va}, ${c.b}: ${c.vb} };`,['Omit'],'Omit conserva todas as propriedades exceto as chaves indicadas.'),
],medium:[
 c=>d('Dicionário com Record',`Crie um mapa com chaves string e valores ${c.N}.`,`${c.base}\ntype Indice = ___<string, ___>;\nconst indice: Indice = { principal: ${c.value} };`,['Record',c.N],'Record<K, V> associa cada chave K a um valor V.'),
 c=>d('Configuração obrigatória',`Remova a opcionalidade de todas as propriedades.`,`${c.base}\ntype Config = Partial<${c.N}>;\ntype Completa = ___<Config>;\nconst config: Completa = ${c.value};`,['Required'],'Required<T> remove os modificadores ? de primeiro nível.'),
 c=>d('Snapshot somente leitura',`Use o utility type que impede reatribuir os campos de ${c.N}.`,`${c.base}\ntype Snapshot = ___<${c.N}>;\nconst item: Snapshot = ${c.value};`,['Readonly'],'Readonly<T> torna as propriedades de primeiro nível somente leitura.'),
 c=>d('Eliminar ausência',`Remova null e undefined da união.`,`${c.base}\ntype Possivel = ${c.N} | null | undefined;\ntype Presente = ___<Possivel>;\nconst item: Presente = ${c.value};`,['NonNullable'],'NonNullable remove os dois tipos que representam ausência.'),
],hard:[
 c=>d('Patch com identidade obrigatória',`Torne o modelo parcial, mas exija ${c.a} com Pick e uma interseção.`,`${c.base}\ntype Patch = ___<${c.N}> & ___<${c.N}, "${c.a}">;\nconst patch: Patch = { ${c.a}: ${c.va} };`,['Partial','Pick'],'A interseção restaura a obrigatoriedade do campo selecionado.'),
 c=>d('Extrair assinatura',`Use ReturnType e Parameters para reutilizar os tipos de uma função existente.`,`${c.base}\nfunction criar(item: ${c.N}, prefixo: string) { return prefixo + item.${c.a}; }\ntype Saida = ___<typeof criar>;\ntype Entrada = ___<typeof criar>[0];\nconst item: Entrada = ${c.value};\nconst texto: Saida = criar(item, "Item: ");`,['ReturnType','Parameters'],'ReturnType obtém a saída e Parameters obtém uma tupla dos parâmetros.'),
 c=>d('Desembrulhar uma Promise',`Extraia o retorno resolvido da função com Awaited e ReturnType.`,`${c.base}\nasync function carregar(): Promise<${c.N}> { return ${c.value}; }\ntype Carregado = ___<___<typeof carregar>>;\nconst item: Carregado = ${c.value};`,['Awaited','ReturnType'],'ReturnType devolve Promise<Modelo>; Awaited extrai seu valor resolvido.'),
]};
sets.special={easy:[
 c=>d('Entrada ainda desconhecida',`Receba um dado externo sem permitir operações antes da validação.`,`const entrada: ___ = ${c.value};\nif (typeof entrada === "string") console.log(entrada.toUpperCase());`,['unknown'],'unknown aceita qualquer valor, mas exige refinamento antes de usá-lo.'),
 c=>d('Escape de tipagem',`Identifique o tipo que desativa as verificações de acesso neste exemplo de código legado.`,`let legado: ___ = ${c.va};\nlegado = ${c.vb};\n// Este acesso não é validado pelo compilador:\nconst campo = legado.campoInexistente;`,['any'],'any desliga verificações: reconheça-o em código legado e prefira unknown para novas entradas.'),
],medium:[
 c=>d('Função que sempre falha',`Anote o retorno de uma função que nunca termina normalmente.`,`function falhar${c.N}(mensagem: string): ___ {\n throw new Error(mensagem);\n}`,['never'],'Uma função que sempre lança erro pode ter retorno never.'),
 c=>d('Erro capturado com segurança',`Mantenha o erro desconhecido e verifique se é Error.`,`function ler${c.N}(texto: string): unknown {\n try { return JSON.parse(texto); }\n catch (erro: ___) {\n  if (erro ___ Error) console.log(erro.message);\n  return null;\n }\n}`,['unknown','instanceof'],'Um catch pode receber qualquer valor lançado, não apenas instâncias de Error.'),
 c=>d('Sem valor de retorno',`Diferencie void de never: a função conclui normalmente, mas não devolve um valor útil.`,`function registrar${c.N}(valor: string): ___ {\n console.log(valor);\n}\nregistrar${c.N}(${c.va});`,['void'],'void significa que o valor de retorno não é usado; never significa que não há conclusão normal.'),
],hard:[
 c=>d('Validar um objeto desconhecido',`Complete o teste de objeto, a verificação de chave e o tipo do campo textual.`,`function ler${c.N}(entrada: unknown): string {\n if (typeof entrada === ___ && entrada !== null && ___ in entrada) {\n  const valor = entrada.${c.a};\n  if (typeof valor === ___) return valor;\n }\n throw new Error("Campo ${c.a} inválido");\n}`,['"object"',`"${c.a}"`,'"string"'],'Só é seguro acessar a propriedade após excluir null e confirmar que a chave existe.'),
 c=>d('Filtrar tipos impossíveis',`Use never para descartar membros que não são ${c.N}.`,`${c.base}\ntype Manter<T> = T extends ${c.N} ? T : ___;\ntype Filtrado = Manter<${c.N} | string | null>;\nconst item: Filtrado = ${c.value};`,['never'],'never desaparece de uma união; condicionais distributivas podem usá-lo como filtro.'),
]};
sets.narrowing={easy:[
 c=>d('Texto ou número',`Refine ${c.a} com o operador typeof antes de chamar toUpperCase.`,`function formatar${c.N}(valor: string | number): string {\n if (___ valor === "string") return valor.toUpperCase();\n return valor.toFixed(2);\n}`,['typeof'],'typeof permite distinguir tipos primitivos em runtime.'),
 c=>d('Excluir null',`Complete a comparação estrita para acessar um ${c.N} existente.`,`${c.base}\nfunction ler(item: ${c.N} | null): string {\n if (item ___ null) return item.${c.a};\n return "Não encontrado";\n}`,['!=='],'!== null remove null do tipo dentro do bloco.'),
 c=>d('Verificar instância',`Diferencie Date de string usando o operador de instância.`,`function data${c.N}(valor: Date | string): string {\n if (valor ___ Date) return valor.toISOString();\n return valor;\n}`,['instanceof'],'instanceof compara a cadeia de protótipos com uma classe/construtora.'),
],medium:[
 c=>d('Propriedade que distingue',`Use a propriedade ${c.b} para diferenciar o modelo de uma mensagem de erro.`,`${c.base}\nfunction ler(item: ${c.N} | { erro: string }): string {\n if (___ in item) return String(item.${c.b});\n return item.erro;\n}`, [`"${c.b}"`],'O operador in permite refinar uniões de objetos por propriedades exclusivas.'),
 c=>d('Predicado de tipo',`Complete o predicado que informa ao compilador que o valor é string.`,`function texto${c.N}(valor: unknown): valor ___ string {\n return typeof valor === "string";\n}\nconst entrada: unknown = ${c.va};\nif (texto${c.N}(entrada)) console.log(entrada.toUpperCase());`,['is'],'Um predicado usa parametro is Tipo e deve realmente validar esse contrato.'),
 c=>d('Refinamento por retorno antecipado',`Retorne quando item for undefined, liberando o acesso seguro depois.`,`${c.base}\nfunction nome(item: ${c.N} | undefined): string {\n if (item === ___) return "Ausente";\n return item.${c.a};\n}`,['undefined'],'O fluxo depois do retorno antecipado já excluiu o caso ausente.'),
],hard:[
 c=>d('Função de asserção',`Complete a assinatura que assegura que o campo textual foi validado.`,`function garantir${c.N}(valor: unknown): ___ valor ___ string {\n if (typeof valor !== "string") throw new Error("Texto obrigatório");\n}\nconst entrada: unknown = ${c.va};\ngarantir${c.N}(entrada);\nconsole.log(entrada.toUpperCase());`,['asserts','is'],'asserts valor is string refina a variável após uma chamada que termina sem erro.'),
 c=>d('Guard para objeto de domínio',`Complete os testes primitivos de cada campo do contrato.`,`${c.base}\nfunction eh${c.N}(x: unknown): x is ${c.N} {\n return typeof x === "object" && x !== null\n  && "${c.a}" in x && typeof x.${c.a} === ___\n  && "${c.b}" in x && typeof x.${c.b} === ___\n  && "${c.c}" in x && typeof x.${c.c} === ___;\n}`,['"string"','"number"','"boolean"'],'Um guard confiável valida todos os campos exigidos pelo tipo que promete.'),
 c=>d('Eliminar ausentes de uma lista',`Complete o predicado do filter e o tipo de saída.`,`${c.base}\nconst itens: (${c.N} | null)[] = [${c.value}, null];\nconst presentes: ___[] = itens.filter((item): item is ___ => item !== null);`,[c.N,c.N],'O predicado informa que os elementos aceitos pelo filtro são modelos completos.'),
]};
sets.enums={easy:[
 c=>d('Constantes nomeadas',`Declare um enum textual para o fluxo de ${c.domain}.`,`___ Estado${c.N} {\n Aberto = "aberto",\n Fechado = "fechado"\n}\nconst estado = Estado${c.N}.Aberto;`,['enum'],'enum define um conjunto de membros nomeados com valores de runtime.'),
],medium:[
 c=>d('Enum como parâmetro',`Use o próprio enum como tipo do parâmetro e compare seu membro.`,`enum Estado${c.N} { Ativo = "ativo", Pausado = "pausado" }\nfunction ativo(estado: ___): boolean {\n return estado === Estado${c.N}.___;\n}`, [`Estado${c.N}`,'Ativo'],'O nome do enum pode ser usado como tipo; seus membros existem como valores.'),
],hard:[
 c=>d('Mapa completo de enum',`Use Record para obrigar que todos os estados de ${c.domain} tenham rótulos.`,`enum Estado${c.N} { Novo = "novo", Finalizado = "finalizado" }\nconst rotulos: ___<___, string> = {\n [Estado${c.N}.Novo]: "Novo",\n [Estado${c.N}.Finalizado]: "Finalizado"\n};`,['Record',`Estado${c.N}`],'Record<Enum, string> exige uma entrada para cada valor do enum.'),
]};
sets.classes={easy:[
 c=>d('Identidade imutável',`Use readonly para impedir reatribuir ${c.a} depois da construção.`,`class ${c.N} {\n constructor(public ___ ${c.a}: string) {}\n}\nconst item = new ${c.N}(${c.va});`,['readonly'],'Uma parameter property pode combinar public e readonly.'),
 c=>d('Estado encapsulado',`Restrinja ${c.b} à própria classe, usando private.`,`class ${c.N} {\n ___ ${c.b}: number = ${c.vb};\n consultar(): number { return this.${c.b}; }\n}`,['private'],'private restringe o acesso em verificação de tipos; não é o mesmo que um campo # privado em runtime.'),
],medium:[
 c=>d('Acesso de subclasses',`Permita que subclasses acessem ${c.a}, sem expor o campo publicamente.`,`class Base${c.N} {\n constructor(___ ${c.a}: string) {}\n}\nclass ${c.N} extends Base${c.N} {\n rotulo(): string { return this.${c.a}; }\n}`,['protected'],'protected permite acesso pela classe e por suas subclasses.'),
 c=>d('Superfície pública',`Exponha consultar usando explicitamente public e mantenha o campo private.`,`class ${c.N} {\n ___ ${c.c}: boolean = ${c.vc};\n ___ consultar(): boolean { return this.${c.c}; }\n}\nconsole.log(new ${c.N}().consultar());`,['private','public'],'public define a API acessível de fora; private guarda os detalhes internos.'),
],hard:[
 c=>d('Contrato abstrato',`Declare classe e método abstratos; marque a implementação da subclasse com override.`,`___ class Base${c.N} {\n ___ ler(): string;\n}\nclass ${c.N} extends Base${c.N} {\n ___ ler(): string { return ${c.va}; }\n}`,['abstract','abstract','override'],'Uma classe abstrata pode exigir métodos que serão implementados por subclasses.'),
]};
sets.promises={easy:[
 c=>d('Texto assíncrono',`Complete o tipo resolvido pela Promise que carrega ${c.a}.`,`async function carregar${c.N}(): Promise<___> {\n return ${c.va};\n}`,['string'],'O argumento de Promise é o valor resolvido, não a Promise inteira.'),
 c=>d('Objeto assíncrono',`Complete o tipo resolvido pela busca de ${c.N}.`,`${c.base}\nasync function buscar(): Promise<___> {\n return ${c.value};\n}`, [c.N],'Uma função async que retorna o objeto resolve Promise<Modelo>.'),
],medium:[
 c=>d('Busca opcional',`Represente uma Promise que pode resolver ${c.N} ou null.`,`${c.base}\nasync function buscar(encontrado: boolean): Promise<___ | ___> {\n return encontrado ? ${c.value} : null;\n}`, [c.N,'null'],'A união fica dentro de Promise porque ambos os resultados são assíncronos.'),
 c=>d('Coleção assíncrona',`Anote a lista resolvida usando Promise<Modelo[]>.`,`${c.base}\nasync function listar(): ___<___[]> {\n return [${c.value}];\n}`,['Promise',c.N],'Promise<Modelo[]> representa uma Promise de lista; Promise<Modelo>[] seria uma lista de Promises.'),
],hard:[
 c=>d('Resultados em paralelo',`Complete a tupla resolvida por Promise.all, preservando a ordem dos tipos.`,`${c.base}\nasync function carregar(): Promise<[___, ___]> {\n return Promise.all([\n  Promise.resolve<${c.N}>(${c.value}),\n  Promise.resolve(10)\n ]);\n}`, [c.N,'number'],'Promise.all preserva a posição dos elementos da tupla.'),
 c=>d('Resultados parciais',`Complete o status que permite acessar value e o retorno numérico.`,`${c.base}\nasync function total(): Promise<___> {\n const resultados = await Promise.allSettled([Promise.resolve<${c.N}>(${c.value})]);\n return resultados.reduce((soma, r) =>\n  r.status === ___ ? soma + r.value.${c.b} : soma, 0);\n}`,['number','"fulfilled"'],'Em allSettled, fulfilled tem value e rejected tem reason.'),
]};
sets.declarations={easy:[
 c=>({...d('Descrever um valor externo',`Neste arquivo .d.ts, declare a constante global ${c.N.toLowerCase()} sem implementação.`,`___ const ${c.N.toLowerCase()}: { ${c.fields} };`,['declare'],'declare descreve um valor fornecido por outro código, sem gerar JavaScript.'),extension:'d.ts'}),
],medium:[
 c=>({...d('Contrato de módulo legado',`Declare o módulo fictício "legacy-${c.N.toLowerCase()}" e o retorno da função ler.`,`declare ___ "legacy-${c.N.toLowerCase()}" {\n export function ler(): ___;\n}`,['module','string'],'Um módulo ambiente descreve a API de um pacote que existe em runtime, mas não possui tipos.'),extension:'d.ts'}),
],hard:[
 c=>({...d('Ampliar um global',`Complete o bloco que amplia Window e a palavra-chave da interface.`,`export {};\ndeclare ___ {\n ___ Window {\n  ${c.N.toLowerCase()}Config: { ${c.fields} };\n }\n}`,['global','interface'],'export {} torna o arquivo um módulo; declare global permite ampliar tipos globais a partir dele.'),extension:'d.ts'}),
]};
const exercises:Exercise[]=[];
for(const topic of topics){if(!sets[topic.id]||topic.id==='declarations')continue;for(const [li,level] of levels.entries()){
 const recipes=sets[topic.id][level];
 for(let i=0;i<topic.counts[li];i++){
  const recipe=recipes[Math.floor(i/contexts.length) % recipes.length];
  const context=contexts[i%contexts.length];
  const e=recipe(context);
  const application=applications[level][context.i];
  exercises.push({...e,
   code:e.code+(application?'\n\n// Aplicação: '+application.title+'\n'+application.code:''),
   prompt:e.prompt+(application?' '+application.prompt:''),
   answers:[...e.answers,...(application?.answers||[])],
   hint:e.hint+(application?' Aplicação: '+application.hint:''),
   explanation:e.explanation+(application?' '+application.hint:''),
   id:`${topic.id}-${level}-${String(i+1).padStart(3,'0')}`,topic:topic.id,level,
   title:`${e.title} · ${context.domain}`,extension:e.extension||'ts'});
 }
}}
function add(topic:string,level:Level,title:string,prompt:string,code:string,answers:(string|string[])[],hint:string,extension='json'){
 const i=exercises.filter(e=>e.topic===topic&&e.level===level).length+1;
 exercises.push({...d(title,prompt,code,answers,hint),topic,level,id:`${topic}-${level}-${String(i).padStart(3,'0')}`,extension,check:false});
}
// Tooling exercises are individually specified rather than padded with renamed code.
const declarationExercises:[Level,string,string,string,string[],string][]=[
 ['easy','Versão fornecida pelo host','Declare uma constante global textual, sem inicializador.','___ const VERSAO_APP: string;',['declare'],'declare descreve um valor fornecido por código externo.'],
 ['easy','Função JavaScript existente','Complete a declaração ambiente da função somar.','declare ___ somar(a: number, b: number): number;',['function'],'Declarações de função não incluem corpo de implementação.'],
 ['easy','Objeto de configuração','Anote o tipo da flag debug no contrato global.','declare const CONFIG: { apiUrl: string; debug: ___ };',['boolean'],'As declarações descrevem a forma do objeto que o runtime fornece.'],
 ['easy','Lista de recursos','Declare que a variável global contém um array de textos.','declare const RECURSOS: ___[];',['string'],'O tipo dos elementos vem antes de [].'],
 ['easy','Exportação nomeada','Exporte a função definida pelo módulo JavaScript correspondente.','___ declare function saudacao(nome: string): string;',['export'],'export torna a declaração parte da API do módulo.'],
 ['easy','Alias publicado','Use type para publicar um identificador textual.','export ___ Identificador = string;',['type'],'Aliases de tipos podem ser exportados em arquivos de declaração.'],
 ['easy','Interface publicada','Declare a interface pública de opções.','export ___ Opcoes { timeout: number; cache: boolean }',['interface'],'Interfaces descrevem contratos sem gerar código JavaScript.'],
 ['easy','Retorno assíncrono externo','Complete a Promise resolvida pela função externa carregarToken.','export declare function carregarToken(): Promise<___>;',['string'],'O argumento de Promise descreve o valor resolvido.'],
 ['easy','Opção não obrigatória','Torne o campo timeout opcional na API declarada.','export interface ClienteConfig { url: string; timeout___: number }',['?'],'O consumidor pode omitir propriedades marcadas com ?.'],
 ['easy','Constante imutável do host','Impeça reatribuições do campo id pelo contrato.','declare const HOST: { ___ id: string };',['readonly'],'readonly restringe atribuições através desse tipo.'],
 ['medium','Pacote legado sem tipos','Descreva um módulo fictício instalado chamado leitor-csv.','declare ___ "leitor-csv" { export function ler(texto: string): string[][]; }',['module'],'Um módulo ambiente descreve exports de um pacote externo.'],
 ['medium','Importar imagens','Declare que imports terminados em .png fornecem uma URL textual.','declare module "*.png" { const url: string; export ___ url; }',['default'],'O bundler deve realmente tratar esses arquivos; o .d.ts só fornece o contrato.'],
 ['medium','Classe de biblioteca','Declare uma classe sem implementar o construtor e os métodos.','export declare ___ Cliente { constructor(url: string); buscar(): Promise<string>; }',['class'],'Uma classe ambiente contém assinaturas, sem corpos de métodos.'],
 ['medium','Objeto global com namespace','Descreva a função Loja.iniciar disponível no navegador.','declare ___ Loja { function iniciar(chave: string): void; }',['namespace'],'Um namespace ambiente descreve membros de um objeto global.'],
 ['medium','Função com sobrecargas','Complete os retornos de cada assinatura de converter.','export declare function converter(v: string): ___;\nexport declare function converter(v: number): ___;',['number','string'],'Cada sobrecarga descreve uma relação específica entre entrada e saída.'],
 ['medium','Contrato genérico de resposta','Preserve o parâmetro genérico no conteúdo da interface.','export interface Resposta<T> { dados: ___; status: number }',['T'],'O parâmetro T mantém o contrato reutilizável.'],
 ['medium','Callback de biblioteca','Declare que o callback recebe o erro ou null.','export declare function salvar(callback: (erro: Error | ___) => void): void;',['null'],'null representa sucesso nesta API baseada em callback.'],
 ['medium','Fábrica sem implementação','Declare a assinatura de uma fábrica cujo resultado usa a interface exportada.','export interface Sessao { token: string }\nexport declare function criarSessao(): ___;',['Sessao'],'O .d.ts reutiliza os tipos públicos para descrever resultados.'],
 ['medium','Import de tipo em declaração','Importe o tipo Stats de Node usando import type.','import ___ { Stats } from "node:fs";\nexport declare function inspecionar(): Stats;',['type'],'Imports marcados como type não representam dependências de valores em runtime. Requer @types/node.'],
 ['medium','Biblioteca CommonJS','Complete a atribuição de exportação usada por essa biblioteca CommonJS.','declare function analisar(texto: string): unknown;\nexport ___ analisar;',['='],'export = descreve o valor exportado por uma biblioteca CommonJS.'],
 ['hard','Ampliar Window','Transforme o arquivo em módulo e acrescente uma propriedade ao escopo global.','export {};\ndeclare ___ { interface Window { labVersao: string } }',['global'],'declare global dentro de um módulo amplia o escopo global.'],
 ['hard','Mapa de eventos global','Acrescente um evento customizado ao mapa global de eventos de Document.','export {};\ndeclare global { interface DocumentEventMap { "lab:salvo": ___<{ id: string }> } }',['CustomEvent'],'CustomEvent<T> descreve um evento cuja propriedade detail tem tipo T.'],
 ['hard','Construtor genérico','Descreva uma interface que pode ser instanciada para produzir T.','export interface Fabrica<T> { ___ (nome: string): ___ }',['new','T'],'Uma assinatura de construção usa new e preserva o tipo da instância.'],
 ['hard','Objeto invocável com estado','Combine uma assinatura chamável genérica com uma propriedade somente leitura.','export interface Cache { <T>(chave: string): T | undefined; ___ tamanho: number }\nexport declare const cache: Cache;',['readonly'],'Uma interface pode representar uma função que também possui propriedades.'],
 ['hard','Contrato com tipo derivado','Use keyof e acesso indexado para relacionar chave e resultado na API externa.','export declare function consultar<T, K extends ___ T>(obj: T, chave: K): T[___];',['keyof','K'],'K só aceita chaves existentes e T[K] mantém o retorno correspondente.'],
];
for(const [level,title,prompt,code,answers,hint] of declarationExercises){
 add('declarations',level,title,prompt,code,answers,hint,'d.ts');
 // The Node import is checked with @types/node during curriculum verification.
 exercises[exercises.length-1].check=true;
}
const packageEasy=[
 ['Node.js no compilador','Complete o pacote de tipos de Node.js.','npm install -D ___','@types/node','O pacote @types/node descreve APIs como process e node:fs.'],
 ['Tipagem de Express','Complete o pacote de declarações de Express.','npm install -D ___','@types/express','O pacote de declarações tem o prefixo @types/ e o nome express.'],
 ['Componentes React','Instale as declarações de React.','npm install -D ___','@types/react','As declarações de React descrevem componentes, props e hooks.'],
 ['Integração com React DOM','Instale as declarações da integração de React com o DOM.','npm install -D ___','@types/react-dom','O nome com hífen é preservado após @types/.'],
 ['Utilitários Lodash','Complete as declarações para lodash.','npm install -D ___','@types/lodash','Use o mesmo nome da biblioteca após @types/.'],
 ['Declarações para Jest','Instale os tipos que descrevem globals do Jest, em projetos que usam esses globals.','npm install -D ___','@types/jest','Essas declarações não instalam nem executam o Jest.'],
 ['Tipos de desenvolvimento','Escolha a opção longa que salva tipos como dependência de desenvolvimento.','npm install ___ @types/node','--save-dev','Tipos são normalmente necessários durante desenvolvimento e compilação.'],
 ['Do runtime para os tipos','Você já instalou cookie-parser. Complete o pacote de declarações.','npm install -D ___','@types/cookie-parser','As declarações complementam a biblioteca instalada, não a substituem.'],
];
for(const [t,p,code,a,h] of packageEasy)add('packages','easy',t,p,code,[a],h,'sh');
add('packages','medium','Pacote com escopo','Para o pacote fictício @acme/widget, aplique a convenção de nomes do DefinitelyTyped.','npm install -D @types/___',['acme__widget'],'O escopo perde @ e a barra vira dois underscores. O exemplo ensina a convenção; não pressupõe que esse pacote exista.','sh');
add('packages','medium','Expor globals de Node','Complete o nome em types, sem o prefixo @types/.','{ "compilerOptions": { "types": ["___"] } }',['node'],'Dentro de types, use node, e não @types/node.');
add('packages','medium','Globals de teste e servidor','Inclua os globals de Jest e Node, nessa ordem.','{ "compilerOptions": { "types": ["___", "___"] } }',['jest','node'],'types restringe os pacotes de tipos incluídos automaticamente no escopo global.');
add('packages','medium','Biblioteca com tipos próprios','Um pacote publica suas declarações no arquivo dist/index.d.ts. Complete o campo do package.json.','{ "name": "minha-biblioteca", "___": "dist/index.d.ts" }',['types'],'O campo types aponta para a entrada de declarações fornecidas pelo próprio pacote.');
add('packages','medium','Tipos globais controlados','Complete a lista vazia para não incluir automaticamente pacotes @types no escopo global.','{ "compilerOptions": { "types": ___ } }',['[]'],'types: [] remove inclusão automática de globals; imports continuam resolvendo suas declarações.');
add('packages','hard','Diretórios personalizados','Complete a opção que define diretórios de pacotes de tipos e preserve node_modules/@types.','{ "compilerOptions": { "___": ["./tipos", "./node_modules/___"] } }',['typeRoots','@types'],'typeRoots aponta para diretórios de pacotes, não arquivos .d.ts individuais.');
add('packages','hard','Publicar declarações e JavaScript','Complete a entrada de tipos e a extensão do arquivo que contém apenas declarações.','{\n "name": "lab-utils",\n "main": "dist/index.js",\n "___": "dist/index.___"\n}',['types','d.ts'],'O consumidor precisa de JavaScript para executar e de declarações para verificar tipos.');
const configEasy=[
 ['Verificação estrita','Ative o conjunto de verificações estritas.','strict','true','strict ativa um conjunto de verificações que ajudam a detectar erros.'],
 ['Apenas verificar tipos','Impeça o compilador de gerar arquivos.','noEmit','true','noEmit é útil quando outra ferramenta produz o JavaScript.'],
 ['Destino do JavaScript','Escolha ES2022 como alvo de emissão.','target','"ES2022"','target controla a versão da sintaxe JavaScript emitida.'],
 ['Pasta de saída','Direcione os arquivos gerados para dist.','outDir','"dist"','outDir define a pasta de saída, sem alterar imports por si só.'],
 ['Raiz do código','Configure src como diretório raiz.','rootDir','"src"','rootDir organiza a estrutura da emissão; não seleciona sozinho os arquivos de entrada.'],
 ['Mapas de código','Gere mapas para depurar o código TypeScript original.','sourceMap','true','sourceMap relaciona o JavaScript emitido com as linhas do TypeScript.'],
 ['Gerar declarações','Emita arquivos .d.ts junto do JavaScript.','declaration','true','declaration publica contratos de tipos para consumidores.'],
 ['Bloquear any implícito','Sinalize parâmetros cujo tipo seria any por falta de anotação ou inferência.','noImplicitAny','true','noImplicitAny não proíbe um any escrito explicitamente.'],
 ['Ausência explícita','Trate null e undefined como tipos distintos.','strictNullChecks','true','Sem strictNullChecks, diversas verificações de ausência são enfraquecidas.'],
 ['Permitir JavaScript','Inclua arquivos JavaScript no projeto TypeScript.','allowJs','true','allowJs permite incluir JS; checkJs controla a checagem desses arquivos.'],
 ['Verificar JavaScript','Ative a análise de tipos dos arquivos JavaScript incluídos.','checkJs','true','checkJs habilita diagnósticos em JavaScript.'],
 ['JSX automático','Selecione o modo JSX react-jsx.','jsx','"react-jsx"','Esse modo usa o runtime automático de JSX de React.'],
];
for(const [t,p,key,a,h] of configEasy)add('config','easy',t,p,`{ "compilerOptions": { "${key}": ___ } }`,[a],h);
const configMedium=[
 ['Selecionar arquivos','Complete include para selecionar os fontes dentro de src.','{ "___": ["src/**/*"] }','include','include usa padrões para selecionar os arquivos de entrada.'],
 ['Excluir saídas','Complete exclude para não incluir dist pela descoberta inicial.','{ "include": ["**/*"], "___": ["dist", "node_modules"] }','exclude','exclude filtra a descoberta por include; arquivos importados ainda podem entrar no programa.'],
 ['Herdar configurações','Use extends para herdar o arquivo base.','{ "___": "./tsconfig.base.json", "compilerOptions": { "strict": true } }','extends','extends compartilha uma configuração base entre projetos.'],
 ['Tipos para DOM','Adicione a biblioteca que descreve APIs do navegador.','{ "compilerOptions": { "lib": ["ES2022", "___"] } }','DOM','DOM descreve document, window e outras APIs do navegador.'],
 ['Variáveis esquecidas','Ative o diagnóstico de variáveis locais não utilizadas.','{ "compilerOptions": { "___": true } }','noUnusedLocals','Essa opção ajuda a identificar declarações locais sem uso.'],
 ['Parâmetros esquecidos','Ative o diagnóstico de parâmetros não usados.','{ "compilerOptions": { "___": true } }','noUnusedParameters','Essa opção verifica parâmetros sem uso; nomes iniciados por _ têm tratamento especial.'],
 ['Emitir só contratos','Complete a opção que emite apenas declarações.','{ "compilerOptions": { "declaration": true, "___": true } }','emitDeclarationOnly','emitDeclarationOnly depende da emissão de declarações estar habilitada.'],
 ['Impedir emissão com erros','Não gere saídas quando houver erros de tipo.','{ "compilerOptions": { "___": true } }','noEmitOnError','noEmitOnError condiciona a emissão ao sucesso da checagem.'],
 ['Resolução em bundler','Use o modo de resolução apropriado para um bundler moderno.','{ "compilerOptions": { "module": "ESNext", "moduleResolution": "___", "noEmit": true } }','Bundler','Bundler modela a resolução feita por ferramentas de empacotamento.'],
 ['Compilação incremental','Habilite o cache de informações de compilação.','{ "compilerOptions": { "___": true } }','incremental','incremental reutiliza informações para acelerar compilações posteriores.'],
];
for(const [t,p,code,a,h] of configMedium)add('config','medium',t,p,code,[a],h);
add('config','hard','Node ESM consistente','Use NodeNext para módulo e resolução, nessa ordem.','{ "compilerOptions": { "module": "___", "moduleResolution": "___" } }',['NodeNext','NodeNext'],'Os dois modos precisam ser compatíveis; package.json e extensões também influenciam ESM/CJS.');
add('config','hard','Acesso indexado seguro','Complete a opção que inclui undefined em acessos indexados não garantidos.','{ "compilerOptions": { "strict": true, "___": true } }',['noUncheckedIndexedAccess'],'Um índice pode não existir mesmo quando o array contém elementos do tipo esperado.');
add('config','hard','Opcional é diferente de undefined','Ative a opção que diferencia campo ausente de campo explicitamente undefined.','{ "compilerOptions": { "strictNullChecks": true, "___": true } }',['exactOptionalPropertyTypes'],'Com essa opção, campo?: string não aceita necessariamente { campo: undefined }.');
add('config','hard','Fronteiras de módulos','Verifique a compatibilidade com transpilações que processam cada arquivo isoladamente.','{ "compilerOptions": { "___": true } }',['isolatedModules'],'isolatedModules alerta sobre construções que dependem da análise de outros arquivos para transpilar.');
add('config','hard','Referências de projetos','Habilite composite e adicione uma referência ao projeto core.','{\n "compilerOptions": { "___": true },\n "___": [{ "path": "../core" }]\n}',['composite','references'],'Projetos referenciados precisam de composite; references descreve as dependências de compilação.');
add('config','hard','Imports explícitos de tipos','Preserve imports de valores e exija import type para importações só de tipos.','{ "compilerOptions": { "module": "ESNext", "___": true } }',['verbatimModuleSyntax'],'verbatimModuleSyntax preserva imports/exports sem modificador type e remove os marcados como type.');
add('config','hard','Override obrigatório','Exija override em membros que sobrescrevem a classe base.','{ "compilerOptions": { "___": true } }',['noImplicitOverride'],'A opção ajuda a detectar mudanças no contrato da classe base.');
add('config','hard','Aliases no compilador','Mapeie @/* para src/* usando paths.','{ "compilerOptions": { "___": { "@/*": ["./src/*"] } } }',['paths'],'paths orienta a resolução de tipos, mas não reescreve imports emitidos; o runtime ou bundler também precisa entender o alias.');
exercises.sort((a,b)=>{
 const topicOrder=topics.findIndex(t=>t.id===a.topic)-topics.findIndex(t=>t.id===b.topic);
 if(topicOrder)return topicOrder;
 const levelOrder=levels.indexOf(a.level)-levels.indexOf(b.level);if(levelOrder)return levelOrder;
 if(a.topic==='packages'||a.topic==='config')return a.id.localeCompare(b.id);
 const ai=Number(a.id.slice(-3))-1,bi=Number(b.id.slice(-3))-1;
 return (ai%10)-(bi%10)||Math.floor(ai/10)-Math.floor(bi/10);
});
export { exercises };
export function publicExercises(){return exercises.map(({answers,explanation,check,...e})=>({...e,blanks:answers.length}))}
// Normalize tokens, not raw characters: quoted text retains its internal spaces.
export function normalize(source:string){
 const tokens=source.trim().match(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[A-Za-z_$][\w$]*|\d+(?:\.\d+)?|[^\s]/g)||[];
 return tokens.map(t=>t.startsWith("'")?'"'+t.slice(1,-1).replace(/\\'/g,"'")+'"':t).join('\u0001');
}
export function grade(e:Exercise,answers:string[]){return answers.length===e.answers.length&&e.answers.every((options,i)=>options.some(a=>normalize(a)===normalize(answers[i])))}
