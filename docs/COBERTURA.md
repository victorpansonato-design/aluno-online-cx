# Cobertura da navegação e da proposta

## Áreas internas observadas

| Portal consultado                | Destino proposto                           | Comportamento no frontend                                           |
| -------------------------------- | ------------------------------------------ | ------------------------------------------------------------------- |
| Início                           | /                                          | Aula, pendências, atalhos, progresso, pedidos e avisos              |
| Horários                         | /academico/horarios                        | Semana, dias, mês e exportação ICS                                  |
| Jornada acadêmica                | /academico/jornada                         | 8 períodos, 44 disciplinas e detalhes; DP/adaptação por cenário     |
| Perfil: Notas e Faltas           | /academico/notas                           | Resumo, expansão de lançamentos e serviços contextuais              |
| Perfil: Horas Complementares     | /academico/horas                           | Progresso, histórico ilustrativo e registro externo                 |
| Avaliar Disciplinas              | /academico/avaliacoes                      | Avaliação salva somente no exemplo local                            |
| Avaliação Institucional          | /academico/institucional                   | Estado sem pendência e questionário ilustrativo                     |
| Meu Estágio/TCC/PI               | /academico/estagio                         | Orientações, grade sem estágio e entrada externa observada          |
| Relatórios de estágio            | /academico/estagio/relatorios              | Estado sem relatórios e entrega local de teste                      |
| Solicitação de Serviços          | /secretaria                                | Home própria, busca por intenção e agrupamento                      |
| Nova solicitação: catálogo       | /secretaria/servicos                       | 40 serviços, categorias, busca, filtros de custo                    |
| Serviço e etapas                 | /secretaria/servicos/:code                 | Explicação, dados, revisão e criação local                          |
| Minhas solicitações e detalhes   | /secretaria/solicitacoes/:id               | Protocolo, etapa, resultado e cancelamento local                    |
| Compensação de Faltas            | /secretaria/compensacao                    | Orientação, vínculo à disciplina, revisão e protocolo de teste      |
| Dispensa de Disciplinas          | /secretaria/dispensa                       | Pedido ilustrativo de aproveitamento e acompanhamento               |
| Agendamento de Laboratórios      | /secretaria/laboratorios                   | Recursos fictícios, data, horários, validação e protocolo           |
| Contratos                        | /secretaria/contratos                      | Consulta e simulação de status de assinatura                        |
| Perfil: Colação de Grau          | /secretaria/formatura                      | Requisitos explicados e ligações à jornada, horas e documentos      |
| Financeiro                       | /financeiro                                | Situação, mensalidades, serviços e cenário de cobrança              |
| Alteração de Vencimento          | /financeiro/vencimento                     | Revisão e atualização local de um dia ilustrativo                   |
| Responsável Financeiro           | /financeiro/responsavel                    | Consulta e alteração fictícia local                                 |
| Extrato e documentos financeiros | /financeiro/extrato e /financeiro/informes | CSV, impressão, resumo e informes externos                          |
| Meu perfil / Visão Geral         | /meus-dados                                | Perfil e contato fictícios, documentos, certificados e preferências |
| Perfil: Documentos               | /meus-dados/documentos                     | Seis tipos, validação, metadados locais e simulação de conferência  |
| Carteirinha                      | /meus-dados/carteirinha                    | Identificação demonstrativa e arquivo sem validade                  |
| Perfil: Certificados             | /meus-dados/certificados                   | Lista, busca, arquivo de exemplo e descrição copiável               |
| Notificações e mensagem completa | /avisos e /avisos/:id                      | Busca, filtros, leitura e ação contextual                           |
| Mural                            | /mural                                     | Manuais, editais e regulamentos observados                          |
| Ana / orientação                 | /ajuda e guia flutuante                    | Guia por assuntos; sem envio de mensagens ou IA real                |

Login foi observado durante a autenticação autorizada. O protótipo oferece entrada de demonstração sem credenciais; recuperação de acesso e autenticação de produção não foram implementadas, pois dependem do backend.

## Saídas externas preservadas

AVA geral e por disciplina; inscrição em DP/adaptação; oferta e edital de DP; práticas extensionistas; eletivas; calendários; negociação; ouvidoria; monitoria; biblioteca; CPIC; registro e regulamento de horas; informes financeiros; cursos de extensão; manuais do aluno, Meet e monitoria; critérios de rendimento; regimento; trânsito; ligas acadêmicas; portal público de estágios e manual de relatórios.

Os destinos estão em src/cx/data.ts. Links privados de documentos individuais e SSO com identificação da conta não foram publicados. A existência do link foi verificada na interface de origem; isso não equivale a testar o funcionamento de todos os sistemas externos.

## Profundidade e limites

Foram inspecionadas áreas, menus, painéis e estados acessíveis à conta fornecida. O catálogo completo foi lido. Formulários e controles foram observados sem efetuar envios ou mudanças. A confirmação e os estados posteriores de cada um dos 40 serviços reais não foram executados; o pedido guiado entregue é uma proposta de frontend, cujas regras específicas devem ser validadas.

O currículo de referência é o curso acessível à conta de teste, não todas as matrizes do Grupo Anchieta. A demonstração diferencia dados da matriz observada de notas e estados fictícios. Dependência, adaptação, pagamento e assinatura foram modelados como cenários de teste, sem afirmar que ocorreram na conta consultada.

## Inventários exportáveis

- inventario-rotas.csv: 39 entradas principais de navegação e descrição.
- catalogo-servicos.csv: 40 serviços, nomes original/proposto, categoria, custo observado e tipo.
- matriz-curricular.csv: 44 disciplinas e cargas horárias dos oito períodos observados.

Os detalhes dinâmicos ampliam a navegação; eles não devem ser contados como 132 funcionalidades diferentes.
