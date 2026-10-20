# Reanálise e clonagem · revisão 2

## Mudança de direção

O usuário considerou a primeira versão crua e pediu uma cópia do portal real antes de alterar sua organização. O layout anterior deixou de ser referência. A revisão mantém uma visão Original e uma visão Conectada para comparar mudanças de arquitetura sem confundir mudança de identidade com melhoria de CX.

## Evidência utilizada

Navegação autenticada autorizada, somente leitura, nas áreas acessíveis; capturas e HTML privados; CSS e ativos públicos; inspeção do código público de interface para distinguir consultas de abertura dos formulários de ações de envio. Nenhum pedido, anexo, avaliação, alteração de cadastro, assinatura ou pagamento foi concluído no portal real.

O levantamento inclui 109 destinos de página, os 89 avisos completos, 40 formulários e suas opções disponíveis, oito períodos acadêmicos, seis dias da agenda semanal, mês carregado e sete detalhes por dia da semana. Os avisos usam lista e artigo lado a lado, conforme o original; não foram convertidos em modais. Os formulários não foram reduzidos a uma descrição genérica: turno, motivo, datas, disciplinas e outros campos conservam suas diferenças.

## Implementação de fidelidade

CSS original armazenado localmente, com Inter, JetBrains Mono, Caveat e Material Symbols. Logo, ilustrações, imagem institucional, fundo da carteirinha e Ana são ativos observados. Estruturas de tela sanitizadas preservam classes, SVGs, hierarquia, espaçamento e composição responsiva. JavaScript executável do portal e suas APIs não são usados. Pessoas, RA, contato, CPF e protocolos foram substituídos por exemplos; fotos pessoais foram trocadas por avatar fictício.

Painéis, busca, navegação, carrosséis, calendário, filtros, formulários e persistência são comportamentos locais implementados em React/TypeScript. O calendário mantém aulas demonstrativas em outubro de 2026; outros meses têm grade e seleção reais, com estado vazio explícito. Opções dependentes indisponíveis na consulta recebem uma opção de demonstração identificada.

## Reorganização sobre a cópia

| Contexto           | Continuidade proposta                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| Início             | Aula, documentos pessoais e acompanhamento abrem o destino relacionado                               |
| Secretaria virtual | Home própria, catálogo completo, pedidos, compensação, dispensa, laboratórios, contratos e formatura |
| Meus dados         | Cadastro, arquivos pessoais, carteirinha, certificados e preferências                                |
| Notas e faltas     | AVA, horários e serviços relacionados junto da disciplina                                            |
| Jornada            | DP/adaptação de exemplo com inscrição externa na própria linha                                       |
| Serviço pago       | Mesmo protocolo na solicitação e no financeiro; pagamento apenas simulado                            |
| Documento pessoal  | Nome/status locais atualizam o acompanhamento e a pendência                                          |

## Critérios e limites

A fidelidade é baseada nas telas e estados observados, sem promessa de equivalência pixel a pixel ou de todas as animações internas. A conta não expõe todos os cursos, vínculos ou regras. O frontend é suficiente para navegar, comparar e demonstrar percursos; não substitui a implementação dos contratos oficiais de backend. A hipótese de melhor experiência precisa de testes com ingressantes.
