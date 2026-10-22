# Refinamento 5 — clareza, ritmo e acompanhamento

## Brief e decisões

Revisão local solicitada em 22/10/2026, sem commit ou publicação. Preservar os seis destinos, a marca Anchieta, Inter, o menu compacto, os links externos e a Ana flutuante. O estudante deve entender o próximo compromisso, o próximo pagamento, suas horas e o que precisa resolver antes de explorar serviços administrativos.

A complexidade fica na implementação e na organização; a interface exige menos interpretação. Não aumentar a quantidade de menus nem acrescentar gráficos sem uma pergunta concreta. Retirar as mensagens repetidas de demonstração das telas de apresentação. A natureza local e a ausência de integrações continuam documentadas neste repositório. Os dados não passam a ser oficiais por essa alteração editorial.

## Composição e sequência

1. Home: próxima aula com o degradê aprovado; pagamento branco e compacto; horas complementares e extensão em módulos baixos; pendências com uma ação por situação; agenda cronológica; acompanhamento das disciplinas. No celular, trazer as horas para cima, reduzir repetições e preservar áreas de toque de 44px.
2. Estudos: abertura editorial com vídeo contextual, atalhos para notas, horários e jornada, desempenho por disciplina com valores e frequência legíveis. A visualização nunca compara notas de avaliações diferentes como se fossem evolução temporal.
3. Secretaria: busca por intenção, grupos de documentos, vida acadêmica e atendimento; acompanhamento de pedidos separado da descoberta. Manter todos os serviços acessíveis no catálogo de 40 formulários. Contadores usam somente o estado disponível.
4. Financeiro: resumo de valor aberto e seleção, organização dos documentos e histórico; manter o vínculo da cobrança da home até o Pix e o retorno ao pedido. Não usar vídeos de dinheiro nem sugerir crescimento financeiro.
5. Ajuda: entrada visual por assunto, busca nas perguntas, respostas acionáveis, roteiro de primeiros passos e atalhos de atendimento. Substituir a grande lista sem hierarquia.
6. Rodapé lateral: curso e semestre ganham cor institucional e acesso à carteirinha, útil no cotidiano e diferente dos indicadores já na home. Menu recolhido continua usável por nome acessível e dica de contexto.

## Direction contract

THESIS: compreender a rotina e encontrar uma próxima ação sem aprender a estrutura administrativa da faculdade.

OWN-WORLD: preservar a moldura e o menu do clone aprovado, Inter, azul/amarelo e ilustrações institucionais. Gradientes suaves pertencem às aberturas; branco organiza pagamentos; verde indica horas cumpridas e valor; cores auxiliares identificam assuntos.

STORY: aula e pagamento primeiro; horas resumidas próximas; pendências acionáveis; compromissos em ordem de data; desempenho com números e acesso ao detalhe. Secretaria e ajuda começam pela intenção do aluno.

FIRST VIEWPORT: desktop com próxima aula ampla e pagamento compacto, atalhos e duas colunas de rotina/formação. Celular com aula, pagamento e dois saldos de horas antes das seções longas. Tablet estreito usa uma coluna nas áreas de leitura e operação.

FORM: refinamento da composição operacional existente, autorizado diretamente pelo usuário, sem substituição da identidade ou rodada de novos conceitos. Seis destinos preservados. A assinatura de interação é indicador → detalhe relacionado, com animações nativas do portal e mídia contextual que pausa fora de vista.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance.

## Vídeo: seleção e orçamento

Foram consultados Pexels e Mixkit. O diretório Stripe não ofereceu CLI instalada e a página de configuração não pôde ser lida pelo conector; a pesquisa seguiu pelas páginas públicas dos próprios bancos. Pesquisa e inspeção no navegador: Mixkit 50109 e 50111, ambos oferecidos em Full HD sob Stock Video Free License. O 14734 foi descartado porque a versão gratuita tem licença restrita a uso pessoal.

- **50109:** mãos anotando e construindo gráficos em um caderno. Meus estudos: representa estudar e acompanhar o próprio aprendizado, sem atribuir um campus ou uma pessoa ao Anchieta.
- **50111:** mesa de estudo com caderno, livros e calculadora. Atividades e horas: mostra trabalho acadêmico complementar. Não é usado para representar ações reais de extensão na comunidade.
- Texto fica fora do vídeo; imagem tem região própria, altura limitada e ponto focal explícito. No celular usa pôster com recorte específico, sem download do MP4. Home conserva a ilustração institucional, sem vídeo concorrendo com ações urgentes.
- Originais Full HD ficam apenas no diretório de trabalho. Entrega local usa clipes curtos H.264, sem áudio, faststart e pôster WebP. Nenhum player de terceiros, iframe ou rastreador.
- Reprodução somente em tela larga, visível, documento ativo, sem preferência por movimento reduzido, economia de dados, conexão lenta ou hardware conhecido como limitado. Pausa explícita permanece disponível. Falha de carregamento mantém o pôster e não bloqueia nenhuma tarefa.

## Fundamentos e referências

- [NN/g — Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/): prioridade inicial e acesso às opções especializadas. Referência de organização, não evidência de validação deste portal com alunos.
- [Dashboard Design Patterns — artigo de pesquisa](https://arxiv.org/abs/2205.00757): escolhas de espaço, interação e informação. Aqui a cronologia pertence a compromissos; notas são comparação de disciplinas e horas são progresso para uma exigência.
- [Pinterest — University Dashboard, Richard Okunoghae](https://www.pinterest.com/pin/107664247337864365/): repertório visual de agenda e resumo estudantil. Inspiração de composição, sem copiar marca, dados, ilustrações ou tratar um mockup como prova de usabilidade.
- [Linear — UI refresh, 12/03/2026](https://linear.app/changelog/2026-03-12-ui-refresh): referência atual de consistência entre cabeçalhos, navegação e controles, com ícones revistos e barra lateral menos dominante. Aplicação aqui: preservar o menu aprovado, organizar o conteúdo e concentrar cor onde ajuda a decidir; não copiar a identidade Linear.
- [CFPB — Data visualization guidelines](https://cfpb.github.io/design-system/guidelines/data-visualization-guidelines): barras para comparar categorias e linhas para mudanças ao longo do tempo. Por isso o painel usa notas por disciplina e uma agenda cronológica, sem inventar uma curva de evolução de notas sem série histórica.
- [Carbon — Data visualization](https://www.carbondesignsystem.com/building-blocks/data-visualization/overview): repertório de representações simples e acessíveis. A implementação usa HTML/CSS e valores textuais, sem uma biblioteca de gráficos adicional para cinco barras.
- [GOV.UK — Task list](https://design-system.service.gov.uk/components/task-list/): tarefas independentes com estado e retomada entre sessões. Inspira o acompanhamento da documentação; não se apresenta esse padrão como solução validada para toda a jornada acadêmica.
- [web.dev — Lazy loading video](https://web.dev/articles/lazy-loading-video): adiar transferência, usar pôster e carregar somente o necessário.
- [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion): substituir movimento por estado estático conforme a preferência da pessoa.
- [W3C — Pause, Stop, Hide](https://www.w3.org/WAI/WCAG22/Understanding/pause-stop-hide): controle de pausa para movimento paralelo ao conteúdo. A preferência por movimento reduzido não substitui o controle.
- [Mixkit — licença](https://mixkit.co/license/#videoFree), [50109](https://mixkit.co/free-stock-video/a-student-making-notes-and-mathematical-charts-on-the-notebook-50109/), [50111](https://mixkit.co/free-stock-video/student-makes-a-note-over-wooden-desk-filled-with-mathematical-50111/).
- [Pexels — licença](https://help.pexels.com/hc/en-us/articles/360042295174-What-is-the-license-of-the-photos-and-videos-on-Pexels): banco alternativo consultado; nenhum ativo Pexels foi incorporado.

## Verificação e limites

Verificar rotas e destinos de navegação, 40 formulários, chamadas à ação, busca/filtros, menu móvel e recolhido, temas, preferências de movimento, estados vazio/DP/cobrança vencida e fluxo de pagamento local. Capturar desktop, notebook, tablet e celular, incluindo 320px; verificar transbordamento, imagens, nomes acessíveis e erros de console. Limitar a inspeção visual própria a um lote completo e um lote de confirmação após correções. Revisão independente ao final. Não chamar links institucionais que possam executar mudanças, solicitar serviços ou pagar no sistema real.

Os testes técnicos demonstram cobertura de comportamento e composição nas condições examinadas. Não demonstram satisfação universal, conformidade integral WCAG, compatibilidade com todo celular ou redução mensurada de chamados. Próxima validação com alunos: ingressantes e veteranos executando cinco tarefas (encontrar aula; pagar a cobrança correta; acompanhar documento; entender faltas; solicitar comprovante), medindo conclusão, tempo, erros e confiança antes/depois.
