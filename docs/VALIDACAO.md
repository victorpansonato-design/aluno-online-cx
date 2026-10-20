# Validação técnica da entrega

Verificações realizadas em 20/10/2026 no protótipo local. O portal real permaneceu apenas como fonte de consulta.

| Verificação              | Resultado                                              | Escopo                                                                             |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------------------------------------- |
| TypeScript               | Passou                                                 | src/cx, entrada e testes CX                                                        |
| ESLint                   | Passou                                                 | Código executado pelo protótipo                                                    |
| Vitest + Testing Library | 11 testes passaram                                     | Inventário, serviços, revisão, estado local, anexos, cancelamento e mês            |
| Compilação de produção   | Passou                                                 | Vite, módulos por área, fonte local                                                |
| npm audit                | 0 vulnerabilidades reportadas                          | Árvore instalada no momento da entrega                                             |
| Varredura de rotas       | 293 visitas sem falha detectada                        | Desktop 1440 px e áreas principais em 390, 320 e 768 px                            |
| Capturas após correções  | 10 checagens sem overflow ou controle visível sem nome | Home, secretaria, documentos, notas e serviço em desktop/celular                   |
| axe-core 4.12.1          | 0 violations nas 10 verificações finais                | Cinco superfícies × 1440/390 px                                                    |
| Smoke no navegador       | 8 verificações passaram                                | 320 px, menu, busca por teclado, mês e tema                                        |
| Revisão independente     | Quatro achados classificados resolved                  | Ação de documentos, rótulo de faltas, cancelamento terminal e posição de metadados |
| Proveniência de imagens  | 12 arquivos com origem registrada                      | Marca fornecida e capturas fictícias; pixels preservados                           |

## Como interpretar a contagem de rotas

O inventário tem 39 entradas principais. Os detalhes dinâmicos de disciplinas, matriz, serviços, pedidos e avisos completam 132 caminhos distintos no conjunto de QA. A execução registrada fez 293 visitas porque repetiu 44 caminhos da matriz no desktop; o script foi posteriormente deduplicado. Esses números representam visitas verificadas, não centenas de funcionalidades diferentes nem um teste de cada possível interação.

A checagem procura título, erro fatal, destino dinâmico ausente, overflow horizontal e controles visíveis sem nome. O primeiro filtro do teste foi corrigido para desconsiderar controles dentro de detalhes fechados. A varredura técnica foi complementada por testes de componentes e interações reais no navegador.

## Evidências versionadas

- browser-report.json: execução de navegação com quatro larguras e inspeções de acessibilidade.
- capture-report.json: checagens e axe das dez telas recapturadas após os ajustes.
- smoke-report.json: verificações finais no navegador a 320 px.
- screenshots/: capturas das telas com dados fictícios, incluindo cancelamento terminal.
- tests/cx/flows.test.tsx: regressões automatizadas de fluxos e estado.

## Revisão de acabamento

Uma revisão independente examinou as capturas e uma amostra do código. Encontrou quatro pontos: a ação dos documentos sumia no celular; as frações de faltas perdiam identificação; o cancelamento mantinha etapa ativa; metadados apareciam acima dos títulos. Todos foram corrigidos em um lote. O verdict pass retornou **ship**, com os quatro itens **resolved**, no escopo desses achados. Isso não representa revisão exaustiva de todas as linhas ou certificação global.

O detector de design registrou Inter e transição de largura como avisos. Inter foi preservada como parte da identidade e do uso operacional. A animação de largura foi removida.

## Limites

Automação sem violations não comprova conformidade integral com WCAG. Ainda são necessários testes com leitores de tela, zoom, aparelhos reais, conexões lentas, diferentes vínculos e cursos, além de pesquisa com estudantes. Nenhuma redução de tempo, esforço, contatos ou evasão foi apresentada como medida.

Os cenários de pagamento, assinatura, DP/adaptação e conferência são fictícios. Sistemas externos não foram submetidos a testes de envio. Capturas autenticadas e dados reais da conta de teste não fazem parte deste repositório.
