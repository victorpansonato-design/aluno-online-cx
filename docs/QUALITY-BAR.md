# Critérios de qualidade · revisão 5

O clone foi aprovado pelo usuário. A revisão 5 refina a rotina do aluno sem substituir a identidade nem retirar funcionalidades. Estes critérios descrevem a implementação e a revisão local; satisfação, compreensão e redução de esforço ainda precisam de teste com alunos.

## Contrato vigente

- Preservar seis destinos, tipografia, marca, ativos, moldura e métricas V4 do menu: itens 36px, texto 14px, ícone 20px, gap/padding 8px, raio 6px, intervalo 4px; drawer de até 18rem. Não ampliar os itens por causa do cartão novo da carteirinha.
- Ana somente como esfera inferior direita, sem faixa acoplada; foco e controles próximos ao canto permanecem alcançáveis. Carteirinha visual e ajuda compõem o rodapé lateral; o curso fica na home, inclusive no estado recolhido.
- Home responde próxima aula, pagamento, horas, pendências, prazos e percurso. Aula conserva degradê e ilustração; pagamento branco com valor verde. Dois módulos de horas compactos ficam lado a lado e antes das seções longas no celular. Não exigir o antigo cartão externo grande nem suas dimensões V4.
- Complementares: 26/160h (16%), 134h restantes e barra verde/vermelha. Extensão: 40/240h (17%), 200h restantes e verde forte/cinza. Números, rótulos e nomes acessíveis complementam a cor; não transformar a meta sintética em regra institucional.
- Agenda ordenada por data; notas 0–10 e faltas em relação ao limite da disciplina, com números e detalhe relacionado. Não fabricar curva de evolução sem observações temporais. Jornada tem oito segmentos, segundo atual e primeiro pendente no cenário DP, com destino de regularização.
- Secretaria começa por busca e grupos Documentos/Vida acadêmica/Atendimento, oferece oito serviços/atalhos e mantém os 40 formulários. Pedidos têm acompanhamento separado da descoberta. Ajuda oferece busca, filtros, oito perguntas, ação contextual e roteiro inicial; estados sem resultado oferecem recuperação.
- Financeiro reúne total, vencimento, histórico e seleção. A cobrança da home chega selecionada ao financeiro e ao Pix. “Já realizei o pagamento” resulta “Pagamento informado” e atualiza somente o estado local relacionado; nenhuma confirmação bancária é inferida. Extrato e bolsas continuam acessíveis.
- Calendário mantém busca, categorias, mês, seleção de dia, favoritos e ação contextual. Avisos e mural continuam acessíveis; os 89 avisos não voltam a dominar a home. Original continua comparável.
- Por determinação do usuário, não reintroduzir mensagens repetidas de fictício/demonstração na interface. A antiga exigência de avisos visíveis foi substituída; manter limites, dados sintéticos e ausência de validade institucional documentados e nos arquivos exportados.
- Mídia decorativa em Estudos/Atividades/Secretaria, com texto fora da imagem, recorte explícito e pôster, sem botão de pausa na V6. MP4 elegível somente >=1024px e visível; reprodução somente com aba ativa, sem movimento reduzido/Save-Data/rede lenta/memória conhecida <4GB. Menores usam pôster sem baixar MP4; falha mantém imagem e não bloqueia tarefa. Não prometer 4K ou a mesma fluidez em todos os aparelhos.
- Teclado, foco visível, movimento reduzido, tema e refluxo de 320px a desktop permanecem alvos. Controles principais móveis têm área de 44px; os itens compactos do menu são uma decisão de identidade, não escala geral para novos controles.
- Sem autenticação/API institucional, credenciais, pagamento real ou envio de solicitações. Não executar ações no portal real durante testes locais.

## Evidência disponível e seus limites

Validação registrada para V5: 38 testes aprovados e build aprovado, com warning preexistente de chunk acima de 500KB; nenhuma dependência adicionada. A matriz percorreu seis páginas em 1440/1280/1024/768/390/320px (36 combinações), 122 rotas e 40 formulários. Doze auditorias axe da matriz retornaram zero violações. Os percursos registraram 22 verificações interativas aprovadas e mais três auditorias axe com zero violações. Relatórios: [matriz](refinement-browser-v5.json) e [percursos](refinement-flows-v5.json).

A revisão independente retornou `ship`, examinando as 12 capturas obrigatórias e dez estados extras, sem correção material de interface. Há 57 screenshots V5 e dois pôsteres com origem embutida; o scanner verificou 59 rasters e não encontrou origem ausente. O detector único anterior à mesclagem documental registrou 123 advisories e zero primary findings. Não aumentar a escala de tokens para silenciar avisos: registrar padrões reutilizados e preservar a exceção de metadados compactos sem tornar cada tamanho 9/10px uma norma.

Zero violações axe nas amostras não prova conformidade WCAG integral; os relatórios contêm verificações incompletas, inclusive contraste sobre gradientes e estado de foco em diálogo. Capturas estáticas não validam todo o movimento. Não houve teste de satisfação com alunos. A revisão não comprova redução de chamados, facilidade universal ou desempenho em todos os celulares. Critérios de aceite em produção ainda exigem avaliação humana de acessibilidade, integração institucional e pesquisa com estudantes.

Atualização V6: [REFINAMENTO-V6.md](REFINAMENTO-V6.md) registra a nova autoridade: títulos e início de rota uniformes, carteirinha na lateral, megafone no header, retirada do rodapé genérico, prévia de dois avisos e painéis contextuais por disciplina. Os números V5 acima são históricos.

Autoridade vigente V7: REFINAMENTO-V7.md. Vídeos podem reproduzir no mobile com autoplay silenciado, loop e playsinline; mobile usa recorte 16:9. A regra antiga de pôster obrigatório abaixo de 1024px está substituída. Respeitar redução de movimento e Save-Data. Tema usa a revelação circular institucional de 650ms. O primeiro período permanece acessível; reprovação e adaptação têm ação na linha. Novas evidências V7 são separadas dos históricos V5/V6.

Atualização V8: [REFINAMENTO-V8.md](REFINAMENTO-V8.md) acrescenta os atalhos de Estágio, DP/ADAP e Cursos Livres; responsáveis por cobrança, filtros sem perda de seleção e histórico preservado na troca. Evidências V8 estão separadas dos relatórios anteriores. O usuário autorizou o commit acumulado V5–V8 ao concluir a validação.
