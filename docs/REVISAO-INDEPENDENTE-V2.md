disposition: fix

Entradas ausentes: cartão QUALITY BAR e comp aprovado não foram fornecidos; a autoridade é o portal real, por exigência explícita do usuário. Revisão independente sem navegador, a partir dos arquivos e das imagens. Fontes amostradas; não houve leitura integral de todos os JSON nem execução própria dos testes.

## persistence

pass — PRODUCT.md e docs/SURFACE.md registram a direção vigente, o público majoritariamente móvel, o modo Original inicial e as limitações do frontend local. A direção anterior foi substituída pela ordem explícita de clonar o portal real; DESIGN.md anterior não serve de autoridade e sua atualização continua prevista na documentação final. Comp, diff de comp e seed de sorteio não se aplicam à reprodução de uma interface existente fixada pelo usuário.

As 28 capturas obrigatórias de docs/screenshots/v2 foram abertas individualmente: oito áreas em 1280×720 e 390×844; painel de notas, secretaria conectada, histórico, substitutiva e mês nas duas larguras; início e documentos em 981×884. Todas mostram o estado correspondente, com conteúdo legível e sem regiões pretas ou vazias indevidas. São primeiras viewports do painel com rolagem interna. As referências privadas indicadas também foram abertas; não foram copiadas nem publicadas. A referência financeira está em carregamento e não comprova a aparência final dessa área.

Os relatórios fornecidos registram cobertura de renderização e seis verificações de interação, além de amostras axe sem violações reportadas; há verificações manuais incompletas. Isso não demonstra conformidade AA integral nem teste de todos os percursos. O detector fornecido foi considerado sem nova execução.

## fidelity

Inventário visual independente: moldura com sidebar e cabeçalho, aula ilustrada, resumos acadêmicos, anéis e jornada pontilhada; fotografia institucional, identificação e abas do perfil; folhas laterais e formulários; mural com papéis fixados; agenda semanal e mensal. Esse conjunto está presente e preserva o reconhecimento do portal.

| Elemento/promessa                        | Estado       | Evidência e limite                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TYPE                                     | match        | Inter, JetBrains Mono, detalhes manuscritos e símbolos originais; escala, densidade e relações tipográficas correspondem às referências. Não substituir essas famílias por preferência estética.                                                                                                                       |
| MATERIAL                                 | match        | Fotografia institucional, logo, ilustração da aula e Ana são ativos presentes; mural e progressos reproduzem os materiais gráficos do produto observado. Não há reconstrução de fotografia por CSS.                                                                                                                    |
| GROUND                                   | adaptation   | Capturas locais usam tema claro consistente com as referências claras e com os tokens originais. Algumas referências privadas estão em tema escuro; isso não implica mudar a temperatura do tema claro. Não foi realizada medição numérica de pixels nem inspeção visual do tema escuro local.                         |
| Moldura e primeiro viewport              | match        | Sidebar de 272px, margem de 8px, cabeçalho, aula e três resumos correspondem em composição; em 390px a ilustração sai e os resumos empilham conforme a origem móvel. A memória imediata é do Aluno Online.                                                                                                             |
| Identificação pessoal                    | adaptation   | Nome, avatar e identificadores fictícios substituem os pessoais conforme PRODUCT.md/TRUTH e a restrição explícita do pacote. Não é defeito de fidelidade.                                                                                                                                                              |
| Perfil e documentos em 1280/981px        | match        | Banner, fotografia, abas, contagem, estados e linhas conservam a hierarquia observada.                                                                                                                                                                                                                                 |
| Aba selecionada em documentos no celular | contradicted | documentos-390.png exibe Visão Geral e Notas e Faltas na faixa horizontal, enquanto Documentos está fora da área visível. Na referência móvel a aba selecionada Documentos aparece. Falta revelação horizontal da seleção ao entrar por rota.                                                                          |
| Jornada, notas e folha de notas          | match        | Progressos, barras, composição das disciplinas e painel lateral preservados. O valor de nota fictício é adaptação autorizada por TRUTH, identificado como ilustrativo na folha.                                                                                                                                        |
| Serviços e formulários observados        | adaptation   | Composição e campos específicos preservados. Seletores nativos e etapas locais de conferência/conclusão estão explicitamente documentados em LIMITES-E-INTEGRACAO.md; não se exige comportamento remoto não observado.                                                                                                 |
| Retorno da conferência para o formulário | contradicted | Em Dialogs.tsx, ServiceForm desmonta NativeLayer ao avançar; Voltar apenas executa setStep(0), e NativeLayer injeta novamente o HTML original sem reaplicar answers. As escolhas e textos informados se perdem, comprometendo a continuidade exigida em THESIS/FORM. Achado por código, não por captura desse retorno. |
| Secretaria conectada                     | adaptation   | Hub mantém paleta, escala, moldura e ilustração original; agrupamentos e encaminhamento de documentos para Meus dados respondem à reorganização autorizada em PRODUCT.md/FORM.                                                                                                                                         |
| Jornada e inscrição DP/adaptação         | adaptation   | reference.ts inclui cenário explicitamente fictício, com inscrição ao lado da disciplina e edital. A implementação é verificável por código; não foi fornecida captura desse cenário específico.                                                                                                                       |
| Calendário e mural                       | match        | Semana, mês, lista diária e mural conservam composição e ativos. A grade fora de outubro e seu estado vazio são adaptação local declarada.                                                                                                                                                                             |
| Financeiro                               | adaptation   | Tela local válida com aparência compatível com o sistema observado; equivalência visual final não comprovada pela referência privada, que mostra apenas carregamento. Escopo limitado conforme documentação.                                                                                                           |

TRUTH: há sinalização de demonstração no rodapé e nos fluxos de conclusão/documentos; o frontend declara ausência de envio real. Esta revisão não constitui auditoria completa de todos os dados sanitizados ou de todos os links externos.

## ceiling

O teto exigido é reconhecimento e fluência do portal, sem reinvenção estética. Moldura, densidade, fotografia, símbolos, pontilhado, anéis e marcadores originais foram empregados. Inter, azul/amarelo, cartões e marcador lateral permanecem justificados pela identidade fixada e não constituem correções do detector. Movimento não pode ser avaliado nas imagens; código contém redução de movimento e transições locais, sem comprovar equivalência de todas as curvas. A clareza operacional móvel ainda fica abaixo do contrato nos achados delimitados abaixo.

## material_fixes

1. [Fidelity / FIRST VIEWPORT / móvel] Revelar horizontalmente a aba ativa ao montar ou trocar a seção do perfil, sem deslocar verticalmente o painel; recapturar documentos-390.png mostrando Documentos selecionado e visível. Aplicar a mesma regra às demais abas do perfil.
2. [Continuidade / THESIS e FORM] Preservar os valores dos campos de ServiceForm ao voltar da conferência; restaurar selects, textos, datas e opções selecionadas. Para arquivos, manter os metadados e instruir nova seleção quando necessária, sem alegar que o conteúdo foi persistido. Verificar um formulário com vários campos, indo e voltando antes da conclusão.
3. [Clareza / Floor Copy] O histórico renderiza literalmente `<br><br>` no bloco de instruções em historico-formulario-1280.png e -390.png. Converter somente essas quebras escapadas em separação de parágrafos, mantendo requisitos e aviso, sem executar HTML arbitrário. É defeito observado também na origem, mas sua reprodução prejudica a leitura móvel e não acrescenta identidade; registrar a pequena correção de clareza na documentação de diferenças.

## keep

Preservar a composição e os ativos reais, os dois modos sobre a mesma base, a densidade reconhecível, a localização contextual das ações e a honestidade da simulação; não regressar à direção genérica rejeitada.

---

## verdict

Rodada única de conferência das correções, em 20/10/2026, sem nova busca de problemas. As mesmas 28 capturas foram reabertas e permanecem válidas; também foram abertas servico-retorno-1280.png e servico-retorno-390.png. Código pertinente e docs/clone-verdict-checks.json foram lidos; não executei navegador nem testes nesta revisão.

1. **resolved** — documentos-390.png mostra Documentos selecionado e integralmente visível na faixa de abas, mantendo banner e início do painel na mesma posição vertical. O relatório registra scrollTop 0; App.tsx altera somente scrollLeft e observa redimensionamento. As capturas de 1280 e 981px preservam a composição.
2. **resolved** — servico-retorno-1280.png e -390.png mostram Turno, Curso e Observação preenchidos após o retorno da conferência; as duas verificações fornecidas registram igualdade dos valores. Dialogs.tsx guarda o rascunho e reaplica os campos ao montar o conteúdo. O tratamento de anexos permanece restrito à memória da sessão, com nome e instrução de nova seleção quando necessário; essa parte foi verificada por código e documentação, sem captura específica de anexo.
3. **resolved** — historico-formulario-1280.png e -390.png exibem as instruções sem os tokens literais de quebra, com requisitos e aviso preservados. NativeLayer limita a conversão aos tokens conhecidos e cria parágrafos via textContent; LIMITES-E-INTEGRACAO.md registra a diferença de clareza em relação à origem.

Regressões introduzidas pela rodada: nenhuma observada no escopo das três correções.

## remaining

clear — os três achados estão encerrados. ship cobre as correções pontuadas, não toda a superfície. Permanecem os limites da revisão original quanto a estados não capturados, movimento, regras oficiais, integração e acessibilidade integral.

disposition: ship
