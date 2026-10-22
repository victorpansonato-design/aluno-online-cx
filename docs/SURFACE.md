# Contrato da superfície · revisão 5

Modo: Operate. Público: alunos do Grupo Anchieta, especialmente ingressantes, com prioridade para uso móvel. O clone aprovado e a simplificação anterior permanecem a base; o refinamento autorizado de 22/10/2026 melhora hierarquia, ritmo e acompanhamento sem substituir a identidade. Estudo, referências e decisões estão em [REFINAMENTO-V5.md](REFINAMENTO-V5.md).

## Direction contract

THESIS: compreender a rotina e encontrar uma próxima ação sem aprender a estrutura administrativa da faculdade.

AUTHORITY: identidade e componentes do portal real clonado e aprovado; instruções mais recentes do usuário prevalecem sobre regras anteriores. A mesclagem V5 mantém o sistema existente. A ordem de retirar avisos repetidos de fictício/demonstração da interface substitui os gatilhos antigos de aviso na UI; os limites técnicos continuam nos documentos e arquivos exportados.

OWN-WORLD: moldura de 8px, sidebar de 272px, cabeçalho, Inter, JetBrains Mono, Caveat nos detalhes herdados, Material Symbols, azul/amarelo e ativos institucionais. Gradientes suaves nas aberturas; branco no pagamento; verde no valor e nas horas cumpridas; cores auxiliares por assunto. A primeira proposta rejeitada não é referência.

STORY: aula e pagamento primeiro; dois módulos baixos de horas próximos; pendências com contexto e uma ação por situação; agenda cronológica; notas e faltas com valores e escala, ligadas ao detalhe. Secretaria e ajuda começam pela intenção do aluno.

FIRST VIEWPORT: desktop com próxima aula ampla e pagamento compacto, atalhos e duas colunas de rotina/formação. Celular com aula, pagamento e os dois saldos de horas antes das seções longas. Entre 768 e 1023px, prioridades e áreas de operação usam uma coluna; preservar a antecipação das horas e a leitura dos controles.

FORM: seis destinos — Início, Meus estudos, Secretaria virtual, Financeiro, Calendário e Meus dados. Hubs e navegação interna reúnem os temas sem expandir toda a árvore na sidebar. Conectada inicia; Original continua somente no menu da conta. Avisos e mural ficam acessíveis pelo sino e comunicação.

CONTINUITY: home → mesma cobrança selecionada → Pix local → Já realizei o pagamento → Pagamento informado → atualização local dos itens relacionados; falta → disciplina destacada; calendário → evento → ação relacionada; horas → atividades/certificados/registro; serviço → acompanhamento. Pagamento informado não é confirmação bancária.

MOTION: transições do portal preservadas, conteúdo visível por padrão, foco e movimento reduzido respeitados. Estudos/Atividades têm mídia decorativa na região direita, com texto separado e pôster, sem controle sobre a mídia conforme pedido na V6. MP4 apenas a partir de 1024px, visível, documento ativo e sem movimento reduzido, Save-Data, conexão lenta ou memória conhecida abaixo de 4GB. Abaixo disso não se anexa fonte MP4. Política exata em Experience.tsx e DESIGN.md. Não se promete fluidez equivalente em todo celular.

TRUTH: frontend sintético local, sem autenticação/API institucional, pagamento real ou envio de solicitações. Mensalidade de R$890 e extensão 40/240h são exemplos; QR e código Pix não são válidos. Calendário combina o esboço fornecido e eventos ilustrativos, sem acessar agenda protegida Microsoft. Complementares usam a referência 26/160h. Retirar avisos da interface não atribui validade institucional aos dados. Documentos exportados mantêm os limites.

FINISH: revisão independente concluída com disposition ship após 12 capturas obrigatórias e dez estados extras. O handoff V4→V5 reconcilia documentação e sistema existente. Cobertura técnica e limitações em QUALITY-BAR.md e nos relatórios de validação. Não declarar conformidade WCAG integral ou melhoria comprovada de CX sem pesquisa com alunos.

## Composição vigente

- Menu conserva medidas V4: item 36px, texto 14px, ícone 20px, intervalo 4px, gap/padding 8px, raio 6px e recuo desktop x=24px. Gaveta móvel min(18rem, calc(100vw - 32px)), com marca, busca e fechar. A carteirinha azul do rodapé, curso e ajuda não alteram esses seis itens. Barra recolhida conserva nomes acessíveis e contexto.
- Ana somente como esfera inferior direita, sem faixa, trilho, bloco azul ou reserva permanente de viewport. Espaço no fim da rolagem e revelação de foco protegem o alcance ao conteúdo.
- Aula em branco/azul com ilustração em cor; pagamento branco com valor verde. Complementares: 26/160h, 16%, 134h restantes, verde/vermelho. Extensão: 40/240h, 17%, 200h restantes, verde forte/cinza. Módulos compactos lado a lado, números e rótulos além da cor.
- Jornada: oito segmentos e segundo atual. No cenário DP, primeiro pendente e ação de regularização; não atribuir conclusão inexistente. Notas com escala 0–10 e faltas com limite por disciplina; nenhuma série histórica fabricada.
- Secretaria: busca, grupos Documentos/Vida acadêmica/Atendimento, oito serviços/atalhos e catálogo completo de 40. Ajuda: busca, filtros, oito perguntas, ação contextual e roteiro inicial. Financeiro: total em aberto, vencimento, histórico, seleção e fluxo Pix local; extrato/bolsas permanecem em rota própria.
- Estudos/Atividades: Mixkit 50109/50111, origem Full HD e entrega 1280×720 H.264, sem áudio. Pôster 960×540, recortes explícitos no CSS, texto fora da mídia. Não chamar o material de 4K. Proveniência em ASSETS.md e media-provenance-v5.json.

Atualização V6: [REFINAMENTO-V6.md](REFINAMENTO-V6.md) registra a nova autoridade: títulos e início de rota uniformes, carteirinha na lateral, megafone no header, retirada do rodapé genérico, prévia de dois avisos e painéis contextuais por disciplina. Os números V5 acima são históricos.

Autoridade vigente V7: REFINAMENTO-V7.md. Vídeos podem reproduzir no mobile com autoplay silenciado, loop e playsinline; mobile usa recorte 16:9. A regra antiga de pôster obrigatório abaixo de 1024px está substituída. Respeitar redução de movimento e Save-Data. Tema usa a revelação circular institucional de 650ms. O primeiro período permanece acessível; reprovação e adaptação têm ação na linha. Novas evidências V7 são separadas dos históricos V5/V6.
