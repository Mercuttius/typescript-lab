# Typescript Lab

Aplicativo pessoal de exercícios com estética de janela macOS, azuis inspirados no Docker e 900 exercícios divididos em 16 assuntos e três níveis.

## Rodar localmente

Requer Node.js 22.13 ou posterior e npm.

```sh
npm install
npm run dev -- --port 5180
```

Abra http://127.0.0.1:5180. A prévia usa um banco SQLite persistente gerenciado pelo D1 local em `.wrangler/state/`. Essa pasta contém seu histórico: não a apague para manter o progresso. A instalação desta sessão já tem o esquema aplicado.

Em uma cópia nova, com o servidor iniciado, aplique as migrações com `npm run db:local`. Pare e reinicie a prévia se ela ainda exibir a mensagem de banco indisponível.

## Recursos

- 335 fáceis, 395 médios e 270 difíceis, com lacunas, dicas, busca e filtros.
- Exemplos de código combinam objetivos de tipos e etapas de aplicação em contextos de catálogo, perfis, pedidos, sensores, educação, reservas, tarefas, arquivos, agenda e contas. Os exercícios de configuração, pacotes e declarações incluem contratos e comandos próprios.
- Código copiável com as respostas atuais; lacunas vazias são preservadas.
- Correção no servidor por respostas previstas, com normalização de tokens e alternativas específicas. Não é um compilador de respostas arbitrárias. O compilador TypeScript é usado na validação do currículo, não na correção online.
- Tentativas persistentes, identificação idempotente para reenvios, validação de entrada e origem.
- Aprendizado: exercícios únicos por dia, acertos/erros, cobertura por assunto, ranking de repetições corretas e proficiência estimada.
- Dias calculados no fuso America/Sao_Paulo. Histórico diário mostra os últimos 366 dias registrados; totais e ranking consideram todas as tentativas.
- Proficiência considera precisão por exercício, pesos 1/2/3 por dificuldade e cobertura. A fórmula e os limites estão descritos na própria interface; não é certificação.

## Banco e privacidade

O banco tem uma tabela `attempts` e índices por exercício e dia. Não há exclusão de histórico na interface. A hospedagem está configurada como privada. Este aplicativo é de um único proprietário; não altere para acesso compartilhado sem implementar isolamento por usuário.

Migrações ficam em `drizzle/`. Para gerar novas migrações: `npm run db:generate`.

## Verificações

```sh
npm run verify:curriculum
npm run typecheck
npm run build
```

A verificação confirma quantidade por assunto e dificuldade, IDs, combinações de código/resposta distintas dentro de cada assunto, número de lacunas, gabaritos, rejeição de respostas inválidas e compilação estrita dos exemplos preenchidos. Configurações JSON são analisadas estruturalmente. Comandos de instalação não são executados automaticamente.

A validação de interface nesta sessão cobriu respostas vazias, erro, acerto, repetição, cópia para clipboard, painel de aprendizado e layout de celular. A API foi verificada para idempotência, validação de entrada e rejeição de origem externa.

## Referências

- [Handbook do TypeScript](https://www.typescriptlang.org/docs/handbook/intro.html)
- [Utility Types](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html)
- [TSConfig](https://www.typescriptlang.org/tsconfig/)

## Hospedagem

A identidade de hospedagem existente está em `.openai/hosting.json`. Reutilize esse `project_id` ao retomar a publicação. Não crie outro site. Use o fluxo oficial do Sites para enviar a fonte, compilar, aplicar as migrações e publicar mantendo o acesso privado. O banco local e o banco hospedado têm históricos independentes.
