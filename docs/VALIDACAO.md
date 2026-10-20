# Validação técnica · revisão 2

Verificações em 20/10/2026 no frontend local. O portal real foi fonte de consulta, sem envios ou alterações de registros.

| Verificação              | Resultado                       | Escopo                                                                                                                                                                                                                      |
| ------------------------ | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript e ESLint      | Passaram                        | Código ativo src/replica, compartilhado src/cx, entrada e testes                                                                                                                                                            |
| Vitest / Testing Library | 24 testes passaram              | 13 do clone ativo e 11 do histórico/dados compartilhados; oito períodos, 40 formulários, sanitização, documentos, protocolo/financeiro, laboratórios, múltiplas disciplinas, calendário, retorno de formulário e instruções |
| Produção Vite            | Passou                          | Páginas e formulários em chunks por demanda, fontes e ativos locais                                                                                                                                                         |
| Cobertura de rotas       | 344 visitas sem falha detectada | 152 destinos em 1280/390px; 20 áreas principais em 320/768px                                                                                                                                                                |
| Smoke por navegador      | 6 verificações passaram         | Menu móvel, Ctrl K, seleção de dia, mês anterior/seguinte e destino ativo único                                                                                                                                             |
| axe automatizado         | 0 violations em 12 amostras     | Seis superfícies em 1280/390px; há verificações manuais incomplete                                                                                                                                                          |
| axe após correções       | 0 violations em 6 amostras      | Documentos, histórico e formulário de reopção em 1280/390px                                                                                                                                                                 |
| Preview compilado        | 4 rotas passaram                | Início, documentos, serviço e aviso em 390px; sem overflow ou recursos de API institucional                                                                                                                                 |
| Capturas de revisão      | 30 capturas válidas             | 1280×720, 390×844 e largura real 981×884; dados fictícios                                                                                                                                                                   |
| Correções da revisão     | 3 verificações passaram         | Aba ativa visível sem deslocamento vertical; campos iguais antes/depois da conferência em duas larguras                                                                                                                     |
| Revisão independente     | ship no verdict pass            | Os três achados da revisão foram classificados resolved; aprovação restrita às correções pontuadas                                                                                                                          |
| Proveniência             | 35 rasters registrados          | 30 capturas e cinco ativos; payloads de pixels preservados                                                                                                                                                                  |

## Interpretação da cobertura

O índice contém 109 destinos capturados, incluindo os 89 avisos, e 40 formulários de serviço. A varredura adiciona Secretaria virtual, Preferências e Ajuda: 152 destinos em cada uma das duas larguras completas. As 20 páginas principais repetidas em 320 e 768px completam 344 visitas. Isso verifica renderização, conteúdo, imagens visíveis quebradas e overflow da página; não equivale a testar todas as combinações de estado e interação.

Os testes de componentes e os percursos no navegador complementam a varredura: campo específico de turno, revisão, protocolo e pagamento local; seleção de documento sem conteúdo persistido; habilitação de laboratório; seleção múltipla de disciplinas; detalhes da jornada; datas do calendário; preservação do rascunho ao voltar. A revisão das imagens confirma composição e hierarquia, sem medir equivalência de cada pixel ou curva de animação.

## Evidências atuais

- clone-coverage-report.json: visitas por rota e largura.
- clone-smoke-report.json: seis percursos e 12 amostras axe.
- clone-final-checks.json: seis amostras axe após correções e quatro rotas de produção.
- clone-browser-report.json e screenshots/v2/: capturas atuais.
- clone-verdict-checks.json: valores antes/depois e posição da aba ativa.
- REVISAO-INDEPENDENTE-V2.md: revisão completa e verdict pass limitado aos três achados.
- asset-provenance-v2.json: origem e preservação dos rasters.

Os relatórios browser-report.json, capture-report.json e smoke-report.json sem o prefixo clone, e capturas fora de v2, pertencem à versão anterior. Seus números não são usados para validar a revisão atual.

## Limites técnicos

O build emite aviso de chunk principal acima de 500kB: aproximadamente 645kB minificado / 144kB gzip, além de CSS de referência de aproximadamente 235kB / 38kB gzip e chunks de página sob demanda. Não foi feita medição de desempenho em aparelhos ou rede móvel reais. O aviso não foi ocultado alterando o limite da ferramenta.

Axe sem violations não certifica conformidade WCAG. Faltam leitores de tela, zoom, aparelhos reais e estados não capturados. A revisão independente examinou as imagens fornecidas e código amostrado; não executou navegador nem auditou toda a sanitização. O detector rodou uma vez nos arquivos autorais alterados; Inter, símbolos e o marcador original são compromissos da cópia, e avisos do DESIGN anterior foram encaminhados à documentação atualizada.

Nenhuma melhoria de satisfação, tempo ou retenção foi apresentada como medida. Regras acadêmicas e financeiras, autenticação, documentos oficiais e integrações de backend permanecem fora deste frontend demonstrativo.
