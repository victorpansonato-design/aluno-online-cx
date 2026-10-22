# Revisão 8 · atalhos da rotina e responsáveis financeiros

Entrega de 22/10/2026. O usuário autorizou o commit ao final, substituindo a orientação anterior de manter as alterações sem commit. Esta entrega reúne também os refinamentos V5–V7 já presentes no ambiente local; seus relatórios conservam o contexto e a validação de cada revisão.

## Home e navegação

- Meus horários usa o símbolo de relógio `schedule`.
- Estágio substitui Documentos nos atalhos da rotina e abre `/meu-estagio`, com Estágio, TCC e PI. Documentos continuam em Meus dados e na situação acadêmica.
- Situação acadêmica passa a ter quatro cards no desenho aprovado: contrato, pagamento, documentos e DP/ADAP. O último abre `/jornada-academica?periodo=1`, com as duas disciplinas pendentes e as inscrições externas nas linhas. Em celular os cards ocupam duas colunas, sem exigir rolagem horizontal.
- Cursos Livres aparece no bloco Amplie seu conhecimento da home e abre o [catálogo oficial](https://www.cursoslivres.anchieta.br/collections), verificado em 22/10/2026. Não há promessa de gratuidade geral nem de aproveitamento automático como horas.
- A lâmpada do AVA recebeu amarelo dourado no tema claro e amarelo no tema escuro, mantendo a ordem e as medidas da navegação.

## Responsáveis junto às cobranças

As cápsulas de responsável ficam imediatamente abaixo da orientação de seleção, na posição indicada pelo usuário. Mostram iniciais e nome, filtram as cobranças atribuídas àquela pessoa e oferecem Gerenciar. Cada cobrança também identifica seu responsável na emissão.

O conjunto sintético permite visualizar três situações: mensalidades com um único responsável; janeiro dividido entre Marina (60%) e Paulo (40%); e mensalidades antigas de Joana, anterior à troca. Os percentuais são exemplos para avaliar a interface, não regras financeiras do Anchieta. Selecionar uma cobrança compartilhada continua encaminhando o valor integral ao Pix. Não foram inventados pagamentos parciais ou boletos independentes.

Filtrar não apaga seleções. Se uma cobrança selecionada ficar fora do filtro, a composição informa quantas estão ocultas e oferece Ver todas. O resumo de pagamento continua considerando todos os itens selecionados.

Gerenciar abre um diálogo com os responsáveis atuais, o anterior, alterações agendadas, data de vigência e cancelamento do agendamento. Uma troca preserva o responsável original de cobranças emitidas e comprovantes. Datas incluem o ano para distinguir períodos e vigências. Dados salvos no formato anterior são migrados sem perder pedidos.

Todas essas ações são estado local do protótipo, persistido no navegador. O agendamento demonstra a intenção e a confirmação visual; não existe integração com cadastro institucional ou motor de emissão de novas cobranças. A integração real deve fornecer vínculos e percentuais por cobrança, datas de vigência, permissões e validação do cadastro. Os nomes de pessoas da referência visual não foram copiados.

## Validação

- 49 testes em cinco suítes aprovados, incluindo filtros/seleção, valor integral compartilhado, histórico preservado, cancelamento, migração e destinos da home.
- TypeScript, ESLint e build de produção aprovados. O bundle principal mantém o aviso já existente de tamanho acima de 500KB; o build gera `build/`, conforme a configuração da Vercel.
- Home e Financeiro verificados em 1440, 768, 390 e 320 px: oito combinações sem transbordamento horizontal e com início de rota no topo.
- Nove verificações de fluxo no navegador aprovadas, incluindo abertura de Estágio e DP, filtro, Pix com duas cobranças e agendamento sem reatribuição histórica.
- Três auditorias axe sem violações automáticas no escopo examinado: diálogo desktop, diálogo mobile e Financeiro mobile. Verificações incompletas continuam no relatório; isso não comprova conformidade WCAG integral.
- Capturas inspecionadas em `screenshots/v8/`; relatório em `refinement-browser-v8.json`; reprodução por `scripts/refinement-qa-v8.mjs`.

O preenchimento automatizado de `input[type=date]` pelo CLI apresentou uma limitação; no fluxo de navegador a data pré-preenchida foi conferida como válida. A mudança de data está coberta pelo teste de componente. Não houve teste em aparelho físico ou estudo de compreensão com alunos.
