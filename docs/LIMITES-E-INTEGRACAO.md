# Escopo, fidelidade e integração

## O que funciona no protótipo

Navegação local, detalhes de disciplinas e matriz, busca global, catálogo dos 40 serviços, filtros, pedido guiado, revisão, protocolo, cancelamento local, resultado de exemplo, arquivos de demonstração, validação de anexos, atualização de metadados de documentos, agenda semanal e mensal, calendário, exportação ICS/CSV, perfil, tema, leitura maior, movimento reduzido, avisos e guia Ana por assuntos.

As ações ficam no localStorage deste navegador. Arquivos selecionados não têm conteúdo enviado ou persistido. Os documentos gerados são HTML de demonstração com impressão/salvamento em PDF pelo navegador e aviso explícito de ausência de validade.

## O que é referência observada

- Marca e cores derivadas do template fornecido.
- Categorias, rotas e recursos observados durante a navegação autorizada.
- Catálogo de 40 serviços com código, nome original, tipo e preço exibido em 20/10/2026.
- Matriz de oito períodos, 44 disciplinas e 2.400 horas do curso acessível à conta de teste.
- Links de saída observados no menu, mural, avisos e áreas de conteúdo.

O protótipo repagina a interface. Não é uma cópia exata de cada pixel ou de cada animação do sistema original. Preserva identidade e caráter operacional, com movimento curto e redução de movimento.

## O que é fictício ou proposto

Pessoa, RA, dados de contato, notas do exemplo, atividades, solicitações e documentos locais. Cenários de dependência, cobrança pendente, assinatura e validação são simulações. A conta consultada não tinha dependência ou cobrança em aberto; essas regras não foram inferidas a partir de uma situação real inexistente.

O valor de mensalidade do cenário de cobrança é fictício. Dias alternativos de vencimento, recursos de laboratório e horários ilustrativos não representam oferta oficial. Serviços especializados têm fluxo demonstrativo; todos os campos, anexos e critérios de cada serviço devem ser confirmados com a instituição antes de produção.

## Limite da inspeção

A revisão cobriu as áreas internas visíveis à conta de teste, o catálogo de serviços, estados de consulta, painéis, menus e recursos externos identificados. Não cobriu todas as possíveis situações de todos os cursos, todos os vínculos ou regras do backend. Não foram concluídos pedidos, alterações, assinaturas, pagamentos, uploads ou avaliações no portal real.

As capturas autenticadas ficaram fora deste repositório, na área de trabalho local. Capturas versionadas mostram somente o protótipo fictício. Documentos privados e endereços de contratos com identificação do aluno não foram copiados para o Git. Para estágios, o protótipo utiliza o endereço público de candidatos observado em um aviso, em vez do link individual de SSO.

## Contratos necessários para produção

| Domínio      | Dados e comportamento necessários                                                             |
| ------------ | --------------------------------------------------------------------------------------------- |
| Autenticação | Sessão institucional, expiração, recuperação de acesso e múltiplos vínculos                   |
| Acadêmico    | Matrícula por oferta, identificadores, notas lançadas, fórmula de média, frequência e limites |
| Jornada      | Matriz por versão, equivalências, pré-requisitos, dependências e elegibilidade                |
| Serviços     | Catálogo vigente, requisitos por serviço, custos, SLAs, anexos e etapas oficiais              |
| Documentos   | Tipos aceitos, limites, armazenamento seguro, validação e motivos de recusa                   |
| Financeiro   | Cobranças, bolsas, comprovantes, integração de pagamento e conciliação                        |
| Contratos    | Documento oficial, consentimento aplicável, assinatura e comprovante verificável              |
| Comunicação  | Mensagens, leitura, preferências e canais institucionais                                      |
| Integrações  | SSO seguro e destinos por usuário, sem tokens permanentes no frontend                         |

O projeto não contém endpoints falsamente apresentados como integrações reais. Os módulos originais do template foram preservados como referência técnica e não são importados pelo protótipo. O código executado está em src/cx e src/main.tsx.

## Validação

Testes automáticos e revisão de interface ajudam a encontrar defeitos técnicos. Não comprovam conformidade integral com WCAG, desempenho em todos os aparelhos ou melhoria de satisfação e retenção. Esses resultados dependem de auditoria e pesquisa adicionais.
