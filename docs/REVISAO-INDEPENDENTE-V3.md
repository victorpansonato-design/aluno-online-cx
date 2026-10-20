disposition: fix

Escopo: revisão independente por arquivos, sem navegador, execução de testes ou edição de fontes. Não fornecida comparação pixel a pixel com o portal aprovado; não é condição desta expansão sobre clone aprovado, sem nova composição aprovada. Fontes e testes foram amostrados; formulários originais completos, curvas de movimento e percursos não capturados não foram reinspecionados.

## persistence

**Fail documental.** PRODUCT.md, docs/SURFACE.md e docs/QUALITY-BAR.md existem e descrevem a revisão 3. DESIGN.md ainda descreve `src/cx`, sidebar de 255px, navegação inferior móvel, cartões de próxima aula azuis com texto branco e ação amarela; essas prescrições contradizem o clone aprovado efetivamente usado. O próprio pacote reconhece que sua reconciliação está pendente. Não há exigência de nova rodada de composição ou de seed de conceito para esta operação de continuidade da identidade aprovada; FORM registra os seis destinos efetivamente implementados. O papel de STORY é exercido por THESIS + CONTINUITY.

**Evidência válida.** Todos os 31 PNGs exigidos foram enumerados, abertos individualmente em lotes e tiveram suas dimensões verificadas. Sem tela branca ou captura de rota divergente. As capturas de notas e jornada são os recortes profundos declarados; a confirmação Pix mostra o êxito após confirmação local. `menu-390.png` mostra o menu assentado. A área escurecida atrás do menu é o overlay esperado.

Inventário completo inspecionado:

- 1280×900: inicio-1280.png, estudos-1280.png, secretaria-1280.png, financeiro-1280.png, pix-1280.png, calendario-1280.png, horas-1280.png, comunicados-1280.png, notas-foco-1280.png, documentos-1280.png, extrato-1280.png, inicio-escuro-1280.png, menu-recolhido-1280.png.
- 390×844: inicio-390.png, estudos-390.png, secretaria-390.png, financeiro-390.png, pix-390.png, calendario-390.png, horas-390.png, comunicados-390.png, notas-foco-390.png, documentos-390.png, extrato-390.png, extensao-390.png, pix-confirmado-390.png, inicio-escuro-390.png, jornada-dp-390.png, menu-390.png.
- 981×884: inicio-981.png.
- 320×844: inicio-320.png.

O detector fornecido contém 106 avisos consultivos e zero achados primários; não foi repetido. O relatório de navegador contém 24 verificações de renderização e 18 amostras axe; o smoke registra quatro verificações e duas amostras axe. Zero violações reportadas nessas amostras não comprova AA integral: itens inconclusivos de contraste e foco estão presentes. Os testes de `tests/cx/student.test.tsx` verificam seleção da mesma cobrança, confirmação apenas local, isolamento de protocolo, filtros/favorito/ação do calendário, preferências opcionais, disciplina destacada e catálogo de 40 serviços. Trata-se de inspeção do código e dos resultados fornecidos, sem alegação de interação própria.

## fidelity

Inventário visual anterior à leitura do contrato: marca Anchieta, moldura clara, menu lateral, faixa ativa amarela, ícones azuis, tipografia sans com numerais mono, superfícies brancas e azul muito claro, cabeçalho compacto, aula e cobrança em primeiro plano, listas por assunto, contexto do curso ancorado embaixo e Ana flutuante. No telefone, coluna única e menu em folha lateral.

| Elemento / promessa                     | Estado       | Evidência e autoridade                                                                                                                                                                                                                                               |
| --------------------------------------- | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| TYPE                                    | match        | Inter, numerais JetBrains Mono e detalhes herdados permanecem no mundo declarado; títulos e valores têm hierarquia visível sem nova voz editorial.                                                                                                                   |
| MATERIAL                                | match        | Marca, fotografia do campus, ilustração de aula e Ana permanecem como ativos; novos painéis são superfícies operacionais planas, sem material físico fingido.                                                                                                        |
| GROUND                                  | match        | Campos claros frios e tema escuro seguem o mundo do clone; esta revisão não possui comp para medição de desvio cromático. Nenhuma equivalência de pixels é afirmada.                                                                                                 |
| Marca, moldura, cabeçalho e faixa ativa | match        | Visíveis em todas as capturas desktop; menu móvel preserva marca e ícones. A faixa azul/amarela é obrigação explícita do usuário e prevalece sobre a preferência genérica do craft floor.                                                                            |
| Seis grupos, AVA e rodapé da sidebar    | match        | `menu-390.png`, `inicio-1280.png` e `menu-recolhido-1280.png`; curso/período/semestre e ajuda preenchem a base, conforme a última observação do usuário. `reference.ts:169` liga o curso ao perfil e conserva ajuda.                                                 |
| THESIS / orientação ao ingressante      | match        | Próxima aula, cobrança, documentos e faltas têm rótulos de ação e caminhos diretos; estudos e secretaria reúnem os assuntos em listas explicativas.                                                                                                                  |
| FIRST VIEWPORT                          | adaptation   | Desktop mostra aula + pagamento e início de atenção/calendário/horas. Mobile prioriza aula e pagamento em uma coluna; CSS `student.css:1816` põe horas antes da prévia mensal, como exige o contrato. A quebra de título em 320px conserva a ação.                   |
| FORM / catálogo preservado              | match        | Seis destinos; hubs, subnavegação horizontal e links contextuais mantêm estudos, secretaria, finanças, dados e avisos encontráveis. A redução da árvore foi autorizada expressamente por SIMPLIFICAR.                                                                |
| CONTINUITY / pagamento                  | match        | Mesmo ID por query string em home → financeiro → Pix; `Financial.tsx` filtra IDs disponíveis e atualiza somente cobranças escolhidas e respectivos pedidos aguardando pagamento. Capturas mostram R$890 e vencimento correspondente; sucesso identifica a simulação. |
| Calendário e avisos                     | match        | Busca, categorias, mês, favoritos, seleção e ação contextual implementados; calendário visual segue a referência como inspiração autorizada. Todos os avisos têm acesso próprio; assuntos opcionais são locais.                                                      |
| Notas e DP                              | match        | Disciplina de Contabilidade destacada em `notas-foco-*`; `jornada-dp-390.png` liga pendências fictícias às inscrições correspondentes.                                                                                                                               |
| TRUTH                                   | match        | Pix, valor, RA de exemplo, extensão 40/240h e pendências DP identificados como demonstração; calendário contém explicação de origem e confirmação oficial. QR geométrico explicitamente inválido; nenhuma API institucional integra o fluxo examinado.               |
| Espaço de leitura e ação livre          | contradicted | Ana cobre texto e controles nos estados móveis e parte das listas desktop; ver correção 1.                                                                                                                                                                           |

O teste de memória do primeiro viewport é atendido: próxima aula e valor/vencimento do pagamento são os dois fatos dominantes. A validação de compreensão com alunos continua pendente, conforme o produto declara. Movimento é verificável apenas pela implementação fornecida, não por PNGs estáticos.

## ceiling

A moldura, a marca, o azul/amarelo, os ícones, as fotografias e a densidade do portal estão empregados sem uma nova linguagem ornamental. O dispositivo nativo de assistência ainda disputa espaço com as tarefas em vez de acompanhá-las. Não há justificativa para acrescentar textura, lettering ou ornamento fora desse mundo. Falta resolver a colisão da assistência e reconciliar a documentação para atingir o quality bar declarado.

## material_fixes

1. **[P2 · FIRST VIEWPORT / floor, espaço e controles] Retirar a sobreposição de Ana sobre o conteúdo.** `src/replica/replica.css:389` fixa o launcher de 88×92px; `:1767` mantém 76×80px a 14px da borda móvel, sem área protegida no conteúdo; `src/replica/App.tsx:864` o monta em todas as páginas. Em `calendario-390.png` cobre os dias da coluna de sábado; em `notas-foco-390.png` cobre a ação AVA do terceiro cartão; em `jornada-dp-390.png` cobre o nome da disciplina; em `inicio-320.png` invade a nota de pagamento e a linha de atenção. `estudos-1280.png` e `inicio-981.png` também mostram texto/ação sob a arte. Preservar o ativo e o acesso à ajuda, mas dar à assistência um lugar sem sobreposição nas telas estreitas ou um estado recolhido que não intercepte os alvos. Nos layouts largos, reservar um espaço real ou reposicionar a assistência fora das linhas acionáveis. Recapturar esses estados após a correção e verificar que texto, dias e botões ficam inteiros e acionáveis.
2. **[P2 · persistence] Reconciliar DESIGN.md com o mundo realmente entregue.** Substituir a descrição de `src/cx`, sidebar 255px, navegação inferior e aula azul/amarela da proposta anterior pela base `src/replica`, `original.css`, fontes e tokens originais e organização atual. Documentar seis destinos, folha móvel, contexto inferior de curso/ajuda, hubs e novos componentes. A revisão do documento não deve alterar a identidade aprovada para satisfazer os 106 avisos produzidos contra a especificação antiga.

## keep

Preservar marca, fontes, ícones, ativos, faixa ativa azul/amarela e moldura aprovados; manter os seis grupos, curso/semestre e ajuda no rodapé, ações contextuais, seleção contínua da cobrança e a identificação explícita de toda simulação.

---

## verdict

1. **resolved — sobreposição de Ana.** Os mesmos 31 PNGs foram reabertos e suas dimensões novamente verificadas; permanecem válidos para os estados declarados. Em `calendario-390.png`, os sábados 24 e 31 estão livres; em `notas-foco-390.png`, o AVA do terceiro cartão está inteiro; em `jornada-dp-390.png`, o nome da disciplina está livre; em `inicio-320.png`, a nota de pagamento e a linha de atenção não têm a arte sobreposta. As listas de `estudos-1280.png` e a ação das horas em `inicio-981.png` também estão livres. `menu-390.png`, `inicio-1280.png` e `menu-recolhido-1280.png` comprovam que a Ana permanece acessível, com seu ativo original, dentro da navegação. `reference.ts:169–170`, `student.css:234–267` e `App.tsx:350–352,869–873` corroboram botão no rodapé, avatar 32×36px, fechamento do menu ao abrir o chat e acionador fixo restrito ao modo Original. O teste específico verifica ausência da camada fixa e abertura do diálogo; o smoke fornecido registra o percurso móvel aprovado. Sem interação própria de navegador.
2. **resolved — documentação anterior.** DESIGN.md agora identifica a autoridade `src/replica`, os tokens OKLCH, Inter/JetBrains Mono, moldura de 8px, sidebar 272/48px, drawer abaixo de 768px, seis destinos e contexto de curso/Ana/ajuda. Navegação inferior, paleta e painel de aula da v1 deixaram de ser prescrições; aparecem somente como referências explicitamente rejeitadas. O tratamento da assistência documentado corresponde ao código e às recapturas. `.impeccable/design.json` possui schemaVersion 2, nove componentes e extensões de cores, tipografia, sombras, movimento e breakpoints.

## remaining

clear. Nenhuma regressão material observada no lote de correção. Esta aprovação cobre exatamente as duas correções pontuadas acima, sem nova auditoria da superfície completa e sem ampliar as alegações de acessibilidade, desempenho ou validação de CX.

disposition: ship
