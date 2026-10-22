# Aluno Online CX

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React 19, TypeScript e Vite. A base clonada usa CSS, fontes, ilustrações e telas sanitizadas do portal real. A revisão 5 refina a experiência sobre essa base aprovada pelo usuário, com páginas próprias carregadas sob demanda e sem adicionar dependências.

## Users

Alunos do Grupo Anchieta, sobretudo ingressantes sem familiaridade com termos administrativos, em acesso majoritariamente móvel.

## Product Purpose

Conectar informação, orientação e próxima ação em toda a vida acadêmica.

## Capabilities and Constraints

Protótipo completo de frontend em localhost, com dados sintéticos, sem autenticação ou API institucional. Portal real somente consulta: não solicitar serviços, enviar documentos, avaliar ou alterar registros. Sistemas externos preservam links observados. Não há pagamento real ou envio de solicitações. O usuário determinou retirar avisos repetidos de fictício/demonstração da interface; a natureza local permanece documentada e sinalizada nos arquivos exportados. Essa decisão editorial substitui a obrigação anterior de avisos na UI e não converte exemplos em informação oficial. Sem credenciais nem documentos pessoais no código ou Git.

## Brand Commitments

Preservar marca, azul/amarelo, Inter, Material Symbols, ilustrações, moldura, cabeçalho e componentes da cópia aprovada. Conectada é a experiência inicial da revisão 5, com seis destinos principais e home centrada na rotina. Original continua disponível para comparação. A primeira proposta visual rejeitada não orienta o sistema. A Ana permanece somente como esfera inferior direita, sem faixa; o rodapé lateral oferece carteirinha, curso e ajuda.

## Product Principles

Organizar por intenção do aluno; seis destinos principais: Início, Meus estudos, Secretaria virtual, Financeiro, Calendário e Meus dados. Cada área reúne assuntos relacionados e mantém os caminhos originais acessíveis. Home prioriza próxima aula, pagamento, documentos, prazos e horas; notificações opcionais deixam de dominar a home. Cobrança selecionada na home chega selecionada ao financeiro e a um Pix demonstrativo. Documentos pessoais pertencem a Meus dados; DP liga jornada à inscrição; cada pendência tem explicação e próxima ação.

## Evidence on Hand

Inspeção autenticada somente leitura das áreas visíveis, oito períodos, seis dias da semana, agenda mensal, 89 avisos e 40 formulários de serviço com suas opções. Capturas privadas fora do repositório. Pesquisa em docs/DIAGNOSTICO-E-ESTRATEGIA.md; revisão de fidelidade em docs/REANALISE-E-CLONAGEM.md.

O usuário aprovou o clone e forneceu imagem e endereço de seu esboço de calendário. O endereço abriu autenticação Microsoft na sessão de consulta; não foram acessados dados protegidos. A prévia local combina a composição do esboço com dados sintéticos. Mensalidades, Pix e horas de extensão são fictícios; não há emissão ou pagamento real. “Já realizei o pagamento” resulta em “Pagamento informado” no estado local, sem confirmação bancária.

A revisão 5 usa as referências e inferências de docs/REFINAMENTO-V5.md: hierarquia de tarefas, comparação de disciplinas, agenda cronológica e mídia contextual com carregamento condicionado. Foram registrados 38 testes aprovados, build aprovado, 36 combinações de seis páginas e seis larguras, 122 rotas, 40 formulários e 22 verificações interativas. Doze auditorias axe da matriz e três dos percursos retornaram zero violações nas condições examinadas; há verificações incompletas, inclusive contraste em gradientes. O revisor independente retornou `ship` após 12 capturas obrigatórias e dez estados extras. Não houve teste de satisfação ou facilidade com alunos.

## Accessibility & Inclusion

WCAG 2.2 AA como alvo técnico, navegação por teclado, foco visível e movimento reduzido. A sidebar preserva a altura visual de 36px solicitada; controles principais mantêm áreas de toque confortáveis. Não se declara conformidade integral ou validação com alunos.

Refinamento autorizado da revisão 5 preserva as medidas V4 do menu e as três referências visuais vinculantes: degradê da próxima aula, pagamento branco com valor verde e horas complementares verde/vermelho com extensão verde. Os módulos de horas são compactos e próximos; barras acadêmicas têm números e escala. Oito segmentos representam o curso, com o segundo atual e o primeiro pendente no cenário DP. Secretaria mantém busca, três grupos e catálogo completo; ajuda oferece oito perguntas filtráveis e próximas ações. Vídeo decorativo permanece restrito à região direita de Estudos/Atividades, com texto separado, pôster, pausa e respeito às condições de dispositivo/rede/movimento descritas em DESIGN.md. Não se promete a mesma fluidez em todos os aparelhos.
