# Revisão 6 · continuidade entre as telas

Implementada em 22/10/2026, exclusivamente no ambiente local. Não houve commit, push ou publicação. A revisão preserva os conteúdos, formulários e links externos reconstruídos. As decisões abaixo atendem ao feedback posterior à V5 e substituem regras anteriores incompatíveis.

## Estrutura e orientação

- Carteirinha visual na base da lateral, com fundo institucional existente, avatar genérico e identificação do perfil. O acesso continua abrindo a carteirinha completa. O menu compacto e o menu móvel conservam esse acesso.
- O ícone de carteirinha do header foi substituído por megafone, com nome acessível e link externo para a Ouvidoria.
- Curso, período e semestre aparecem abaixo da saudação da home. Foram retirados da lateral.
- Rodapé genérico retirado das páginas. Comparação Original/Conectada permanece na conta. Ana continua somente na esfera inferior direita.
- Na navegação conectada, títulos usam 30px no desktop/tablet e 24px no celular, mesmo peso e altura de linha. O título e sua descrição precedem as abas, inclusive nos conteúdos reconstruídos.
- Cada rota abre no topo. Âncoras explícitas continuam levando ao conteúdo pretendido. O endereço de uma disciplina é uma exceção intencional: destaca seu cartão e abre o painel correspondente.

## Navegação e detalhe

A entrada do conteúdo usa opacity/translate de 5px, 260ms e desaceleração. A animação anterior era aplicada a um contêiner display:contents, que não produzia uma caixa própria animável. Agora o contêiner é real, a animação anterior é cancelada em uma navegação seguinte e o carregamento intermediário não dispara uma entrada falsa. Não há nova biblioteca. Redução de movimento do sistema e das preferências permanece respeitada.

Na home, as barras por disciplina e o título da próxima aula levam a `/perfil/notas-e-faltas?disciplina=ID`. A página seleciona a disciplina e abre o painel lateral com suas notas, frequência e ações. Fechar remove o parâmetro e mantém o contexto. O painel funciona também em 390px. A sinalização de faltas elevadas usa cor de atenção, incluindo o marcador textual.

## Pedidos sem vazio inicial

Os pedidos recentes deixaram a linha flexível do título. O antigo alinhamento pela base dessa linha empurrava o título para baixo e criava a grande área vazia. Agora os pedidos ocupam uma faixa própria logo após as abas, em duas colunas ou uma no celular. Catálogo, histórico original e ações continuam acessíveis. O resumo incorpora os pedidos presentes no estado local: inicialmente 21 no total, um em andamento e cinco concluídos. Os 19 registros do histórico capturado continuam preservados.

Os botões de exportação da agenda e o grupo Nova solicitação/Mais pedidos quebram linha quando necessário em 320px.

## Home e hierarquia de cores

Avisos e comunicados fica acima de Minha formação, também na ordem visual do mobile. Há duas prévias de publicações existentes no material capturado: “Tem vaga nova pra você!” e “The English Lab”, ambas de 19/10. Cada uma abre sua própria publicação. Não foram inventadas datas recentes para apresentar o conteúdo como atualizado.

Os destinos usam grupos semânticos: azul para aulas e desempenho; verde para atividades e formação; violeta para apoio e oportunidades; âmbar para avaliações e escuta. Fundo, borda e ícone acompanham o grupo. As antigas alternâncias de cor por posição foram sobrepostas por regras explícitas de assunto. As ações de rotina permanecem antes dos recursos secundários. Não há telemetria real de procura recente: esta ordem é uma decisão de produto, não um ranking medido.

## Mídia

A Secretaria usa o clipe de mesa e organização de documentos já licenciado na V5, em uma região separada do texto. Estudos e Atividades mantêm seus clipes. Não houve novo download nem dependência. Os recortes existentes permanecem responsivos.

O botão de pausa sobreposto foi retirado por pedido expresso. Permanecem o controle de movimento reduzido nas preferências, a preferência do sistema, pôster sem MP4 abaixo de 1024px, Save-Data, conexão lenta, memória conhecida limitada e interrupção fora de vista/aba inativa. A documentação V5 que menciona botão de pausa é histórica.

## Verificação desta revisão

- 40 testes em quatro suítes aprovados, incluindo os novos percursos de avisos e abertura de disciplina.
- Lint, TypeScript e build de produção aprovados. Permanece o aviso preexistente de bundle principal acima de 500KB.
- 48 combinações: 12 telas em 1440, 768, 390 e 320px. Título com escala esperada, abertura no topo e ausência de transbordamento horizontal da página.
- 17 verificações de interação e coerência no navegador: carteirinha/Ouvidoria, disciplina no desktop e mobile, aviso exato, limpeza do parâmetro ao fechar, topo ao trocar/revisitar, resumo de pedidos, detalhe de pedido, ausência do botão de vídeo, ordem mobile e quatro grupos cromáticos.
- Cinco auditorias axe com zero violações automáticas no escopo examinado. Isso não equivale a conformidade WCAG integral.
- 13 capturas em `screenshots/v6/`; relatório reproduzível em `refinement-browser-v6.json`, gerado por `scripts/refinement-qa-v6.mjs`.

Os resultados V5 continuam registrados separadamente. A V6 não recebeu nova revisão independente nem nova pesquisa com alunos. Não há integração institucional, envio real de solicitações ou pagamento real. Estes limites ficam na documentação e nos arquivos exportados, sem avisos repetitivos nas telas.
