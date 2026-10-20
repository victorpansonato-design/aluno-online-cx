# Plano de experiência e prompt de execução

## Missão

Redesenhar o Aluno Online do Grupo Anchieta a partir da intenção de um aluno ingressante que usa o celular. Preservar marca, linguagem brasileira, funcionalidades e destinos externos observados. Entregar frontend navegável com dados fictícios e persistência exclusivamente local. O portal autenticado é fonte de consulta: nunca realizar solicitações, alterar cadastro, enviar arquivos, assinar contratos ou registrar avaliações nele.

## Prompt mestre

Atue como equipe sênior de CX educacional, arquitetura de informação, engenharia frontend, acessibilidade e mobile web. Cada tela deve responder: onde estou; qual é minha situação; o que significa; qual é o próximo passo; como acompanhar o resultado; onde buscar ajuda. Organize o produto em Início, Minha vida acadêmica, Secretaria virtual, Financeiro e Meus dados. Não exponha códigos internos como primeiro nome do serviço. Permita localizar serviços pelo nome antigo e por sinônimos. Crie uma home de secretaria com busca por intenção, catálogo completo, acompanhamento e atalhos contextuais. Documentos enviados pelo aluno pertencem a Meus dados; declarações emitidas pela instituição pertencem à Secretaria. Jornada e notas conectam dependência à inscrição externa observada. Preserve os contextos de disciplina, origem e serviço durante a navegação. A home prioriza próxima aula, pendências e solicitações antes de conteúdo institucional. O mobile muda a estrutura: navegação inferior, menu completo acessível, listas em lugar de tabelas largas, campos de 16px, alvos de 44px e safe area. Os estados de sucesso, erro, vazio, carregamento, indisponibilidade e elegibilidade devem ensinar a recuperação. Use animação funcional de 150–250ms e prefers-reduced-motion. Faça todas as operações da demonstração sem APIs reais e identifique arquivos gerados como sem validade. Registre hipóteses, cobertura e limitações. Não invente preços, prazos ou regras oficiais ausentes; marque exemplos e encaminhe para confirmação institucional. Implemente componentes reutilizáveis, rotas com deep link e estado local consistente. Valide fluxos completos no desktop e mobile, sem declarar impacto de CX ou conformidade WCAG comprovados sem pesquisa.

## Arquitetura proposta

- Início: orientação, próxima aula, tarefas, solicitações, avisos e atalhos.
- Minha vida acadêmica: disciplinas, notas/faltas, horários, jornada, horas, estágio/TCC/PI, extensão, eletivas e avaliações.
- Secretaria virtual: catálogo dos 40 serviços observados, pedido guiado, protocolos, compensação de faltas, dispensa, laboratórios, contratos, formatura, atendimento e integrações.
- Financeiro: cobranças, extrato, comprovantes, vencimento, responsável, informes e negociação.
- Meus dados: cadastro, documentos pessoais, carteirinha, certificados e preferências.
- Avisos, mural, calendário e ajuda acessíveis transversalmente.

## Sequência de entrega

1. Inventário de rotas e inspeção somente leitura.
2. Evidência → problema → mudança → hipótese de sucesso.
3. Registro dos destinos externos, sem tokens nem identificadores privados.
4. Implementação da estrutura e conteúdo específico de cada família de telas.
5. Fluxos integrados: documento → pendência; serviço → protocolo; disciplina → DP; nota → revisão; falta → compensação; certificado → horas; financeiro → secretaria.
6. Testes de navegação, persistência, teclado, formulários, links, responsividade e build.
7. Documentação, commit e publicação do código no repositório autorizado.

## Direção

Sete estruturas consideradas: agenda pessoal; painel de tarefas; mapa do curso; balcão de serviços; caderno acadêmico; central pessoal de acompanhamento; linha do semestre. A direção 6 (semente a8887512) é uma central pessoal de acompanhamento, mantendo a identidade do template e a legibilidade de produto. A comparação com painéis de transporte reforça prioridade temporal e estados claros, sem adotar estética de aeroporto. O mapa de transporte reforça conexões de contexto. O estilo monocromático cede à marca institucional solicitada. A metáfora botânica não atende à clareza operacional. As referências não substituem o briefing.

## Critérios de aceite

Nenhum botão sem resultado; nenhuma navegação local perdida; ação externa identificada; contexto claro após voltar; solicitações e documentos simulados coerentes com a home; layout sem rolagem horizontal a 320px; todas as áreas do inventário com destino; interface utilizável por teclado. Estados e regras que a conta de teste não expõe ficam explicitamente identificados como proposta, com aprovação institucional pendente.
