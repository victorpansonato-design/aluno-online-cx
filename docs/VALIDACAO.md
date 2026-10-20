# Validação técnica · revisão 4

Verificações em 20/10/2026 somente no frontend local, com dados fictícios. Esta revisão preserva a simplificação e aplica as referências visuais mais recentes do usuário: sidebar na densidade da origem, Ana somente flutuante, degradê da aula, pagamento branco/valor verde e horas segmentadas.

| Verificação              | Resultado                                | Escopo                                                                                                                |
| ------------------------ | ---------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| TypeScript e ESLint      | Passaram                                 | Aplicação ativa src/replica, compartilhado src/cx e entrada                                                           |
| Vitest / Testing Library | 32 testes passaram                       | 13 do clone, 8 da experiência simplificada e 11 históricos/dados compartilhados                                       |
| Build Vite               | Passou                                   | Código, páginas, formulários e fontes locais; chunks por demanda                                                      |
| Renderização             | 24 verificações sem overflow da página   | 11 rotas em 1280/390px; home em 981/320px                                                                             |
| axe automatizado         | 0 violations em 18 amostras              | Nove superfícies em 1280/390px; itens inconclusivos permanecem                                                        |
| Smoke                    | 5 verificações passaram                  | Links recolhidos nomeados; seis destinos/curso no menu; Ana flutuante; recuperação de cobrança inválida; troca de mês |
| axe dos menus            | 0 violations em 2 amostras               | Sidebar recolhida e gaveta móvel                                                                                      |
| Geometria                | 13 verificações passaram                 | Dez primitivas iguais ao modo Original; Ana sem bloco; drawer 288px; foco de data fora da esfera                      |
| Capturas finais          | 31 PNGs válidos                          | Desktop, móvel, 981/320px, escuro, DP, confirmação Pix, menu e sidebar recolhida                                      |
| Detector                 | Uma execução, 5 achados primários brutos | Dois compromissos explícitos da origem e três declarações de fonte de ícone; explicação abaixo                        |
| Proveniência             | 31 capturas registradas                  | Origem incorporada sem alterar payload de pixels; ativos de marca preservam registros anteriores                      |

## Medidas da barra

A comparação foi executada entre Conectada e o HTML sanitizado do modo Original, no mesmo navegador local e viewport 1280×900. Coincidiram x=24px, largura interna de 224px, altura de 36px, fonte de 14px, peso ativo de 500, padding de 8px, gap de 8px, raio de 6px, sombra e ícone de 20px. A largura externa é de 272px. No móvel, a gaveta mede 288px/18rem. Isso verifica essas primitivas, não afirma equivalência de cada pixel de todos os estados.

A Ana permanece fixa: desktop 88×92px, direita 24px/inferior 16px; móvel 76×80px, direita 14px/inferior 12px. O usuário rejeitou a faixa fixa e pediu apenas a esfera no canto original. Não há bloco de assistência nem redução permanente da viewport. Há folga de rolagem no fim e ajuste de foco quando um controle focado cruza o canto; a última data do calendário foi alcançada acima da Ana no teste. A esfera ainda pode se sobrepor transitoriamente a conteúdo em posições de rolagem, como o padrão solicitado; não se promete ausência universal de sobreposição.

## Percursos e limites dos testes

Os oito testes da simplificação cobrem seis destinos/associação das áreas; cobrança da home selecionada até confirmação local; taxa de serviço isolada da mensalidade; calendário com busca/filtro/favorito/ação; assuntos opcionais e acesso aos 89 avisos; disciplina indicada pelas faltas; catálogo filtrado com retorno aos 40 serviços; abertura da Ana flutuante sem faixa.

Os 13 testes do clone preservado verificam conteúdos, formulários, oito períodos, documentos por metadados, protocolos/financeiro, laboratórios, seleção de disciplinas, agenda, rascunho e instruções sanitizadas. Os 11 testes históricos/dados compartilhados não percorrem a interface atual. Os relatórios clone-* e student-* sem sufixo V4, e capturas v2/v3, são históricos; a varredura de 344 visitas pertence à revisão 2 e não foi repetida integralmente nesta revisão.

## Detector e documentação

A execução única sobre os arquivos autorais alterados produziu 5 achados primários e 187 avisos consultivos. Inter e a faixa amarela de seleção são exigências do clone e da instrução de manter a identidade; foram preservados. Os três achados de Material Symbols se referiam à ausência dessa biblioteca de ícones no registro tipográfico anterior; DESIGN.md e o sidecar agora a documentam como papel de ícone de 20px. Não houve troca de fontes, remoção da faixa nem segunda execução para ocultar resultados. Avisos consultivos abrangem valores legados e pontuais da varredura ampla; não foram todos convertidos em tokens normativos.

## Evidências atuais

- student-browser-report-v4.json: 24 verificações e 18 amostras axe.
- student-smoke-report-v4.json: cinco verificações e duas amostras axe.
- student-geometry-report-v4.json: medidas e foco, com comparação ao modo Original local.
- student-detector-report-v4.json: resultado bruto único.
- screenshots/v4/: 31 recapturas finais; notas, DP e confirmação são estados profundos deliberados.
- REVISAO-INDEPENDENTE-V4.md: revisão independente, com alcance e veredito registrados no próprio documento.
- asset-provenance-v4.json: origens e integridade dos payloads.

## Limites técnicos

O build mantém aviso de chunk principal maior que 500kB: 655,58kB minificado/147,49kB gzip; CSS 274,04kB/43,95kB gzip; telas próprias StudentPage 42,42kB/11,64kB gzip, além dos chunks de páginas/formulários. O limite de aviso não foi aumentado. Não houve medição em aparelho/rede móvel reais.

Axe sem violations não certifica WCAG; há itens inconclusivos de contraste em gradiente e foco de guardas de diálogo. Capturas estáticas não comprovam todas as animações, leitor de tela, zoom ou estados. A revisão independente usa imagens e código amostrado, sem interação de navegador própria.

Sem API institucional, cobrança bancária, SSO, envio de anexos ou documento oficial. Mensalidade, Pix, calendário e extensão incluem exemplos identificados. Melhorias de compreensão, satisfação, tempo ou retenção precisam ser medidas com alunos. A falha temporária de Vitest no sandbox por EPERM, registrada na revisão 3, foi resolvida pela execução local autorizada; os testes atuais concluíram com êxito.

A revisão independente final V4 retornou **disposition: ship** após examinar as 31 capturas, o código amostrado, relatórios e documentação. Não identificou correção material aberta sob as referências mais recentes. O parecer registra o alcance da análise e a escolha expressa de manter a Ana flutuante.
