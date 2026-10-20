# Validação técnica · revisão 3

Verificações em 20/10/2026 somente no frontend local, com dados fictícios. A base clonada aprovada está registrada separadamente nos relatórios clone-* e nas capturas v2.

| Verificação               | Resultado                              | Escopo                                                                                                                                              |
| ------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| TypeScript e ESLint       | Passaram                               | Aplicação ativa src/replica, código compartilhado src/cx e entrada                                                                                  |
| Vitest / Testing Library  | 32 testes passaram                     | 13 do clone, 8 da simplificação e 11 do histórico/dados compartilhados                                                                              |
| Produção Vite             | Passou                                 | Páginas, formulários e novas telas da simplificação carregados sob demanda                                                                          |
| Renderização no navegador | 24 verificações sem overflow da página | 11 rotas em 1280/390px e home em 981/320px                                                                                                          |
| axe automatizado          | 0 violations em 18 amostras            | Home, estudos, secretaria, financeiro, Pix, calendário, horas, avisos e documentos em 1280/390px                                                    |
| Smoke adicional           | 5 verificações passaram                | Nomes dos links recolhidos; seis destinos/curso no menu móvel; recuperação de cobrança inválida; troca de mês; abertura da Ana após fechar a gaveta |
| axe do menu               | 0 violations em 2 amostras             | Sidebar recolhida e gaveta móvel; há itens inconclusivos                                                                                            |
| Capturas                  | 31 PNGs locais                         | 1280×900, 390×844, home981×884/320×844, tema escuro, DP, pagamento confirmado e menus                                                               |
| Detector                  | 0 achados primários                    | Uma execução nos arquivos autorais alterados; 106 avisos consultivos comparavam a especificação visual V1 anterior                                  |
| Proveniência              | 31 capturas com origem                 | Payloads de pixels preservados ao incorporar metadados; ativos originais mantêm registros v2                                                        |

## Percursos verificados

Os oito testes da simplificação cobrem: seis destinos e associação das áreas; cobrança selecionada na home até confirmação local e atualização da home; pagamento de taxa isolado da mensalidade; filtro/favorito/ação do calendário; assuntos opcionais e acesso a todos os avisos; disciplina indicada pelo aviso de faltas; catálogo filtrado e retorno aos 40 serviços; acesso à Ana na navegação sem camada flutuante sobre o conteúdo.

Os 13 testes do clone continuam verificando conteúdos e comportamentos preservados, incluindo oito períodos, formulários específicos, metadados de documentos, protocolo/financeiro, laboratórios, múltiplas disciplinas, agenda, rascunho após conferência e instruções sanitizadas. Os 11 testes históricos/dados compartilhados não são apresentados como se percorressem a interface atual.

Uma primeira execução de Vitest dentro do sandbox falhou antes de coletar testes por EPERM ao renomear um arquivo temporário. A execução local autorizada fora desse diretório temporário foi concluída com êxito. Não foi tratado como defeito da aplicação.

## Evidências

A revisão independente completa identificou duas correções materiais: sobreposição da Ana e documentação visual da proposta anterior. Após uma rodada de correção e 31 recapturas válidas, o revisor classificou ambas como **resolved**, com **disposition: ship** restrito a esses dois achados. A Ana permanece no rodapé da navegação Conectada; Original preserva o widget da cópia. DESIGN.md e o sidecar foram reconciliados por um documentador dedicado. A tentativa documental da revisão anterior havia falhado por limite de uso; foi substituída com êxito nesta revisão, sem apresentar aquele trabalho incompleto como concluído.

- student-browser-report.json: renderização e 18 amostras axe.
- student-smoke-report.json: cinco verificações e duas amostras axe dos menus.
- student-detector-report.json: resultado único do detector anterior à reconciliação documental; não foi repetido para maquiar avisos.
- screenshots/v3/: capturas da simplificação; estados de notas e DP são links profundos deliberadamente rolados.
- REVISAO-INDEPENDENTE-V3.md: revisão por imagens e código amostrado, sem navegador do revisor; achados e veredito estão registrados no próprio documento.
- asset-provenance-v3.json: origem das capturas e integridade dos payloads.

A revisão 2 executou 344 visitas a rotas, 18 amostras axe em suas etapas e quatro rotas em preview compilado. Esses resultados permanecem como histórico da base aprovada e não substituem as verificações atuais. A revisão 3 não repetiu todas as combinações de formulários, períodos, avisos e dispositivos.

## Limites

O build mantém aviso de chunk principal maior que 500kB, aproximadamente 656kB minificado / 148kB gzip, mais CSS de aproximadamente 272kB / 44kB gzip e chunks sob demanda. O limite de aviso não foi aumentado. Não há medição de desempenho em aparelho ou rede móvel real.

Axe sem violations não certifica WCAG. Há itens inconclusivos, por exemplo contraste em gradiente e foco em guardas de diálogo. Capturas estáticas não comprovam todas as animações, leituras de tela, zoom, impressão e interações. A revisão independente só sustenta o escopo e o veredito declarados no relatório.

Sem APIs institucionais, cobrança bancária, SSO, envio de anexos ou documentos oficiais. Calendário, valor da mensalidade e extensão contêm exemplos identificados. A melhoria de compreensão, satisfação, tempo ou retenção precisa ser medida com alunos; os testes técnicos não a comprovam.
