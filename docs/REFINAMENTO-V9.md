# Revisão 9 · vencidas e situação acadêmica

Atualização de 23/10/2026.

- O primeiro indicador de Meu financeiro passou de Total em aberto para Vencidas: soma somente cobranças não pagas com vencimento anterior à data de referência do portal. As futuras e pagas não entram no valor. Sem atraso, mostra R$ 0,00 em cor neutra e Nenhuma cobrança vencida em aberto; com atraso, valor em vermelho e quantidade explícita.
- A lista de cobranças e as opções de pagamento continuam completas.
- Removido Realizar pagamento da situação acadêmica da home. Permanecem contrato, documentos e DP/ADAP, em três colunas no desktop; no celular os dois primeiros dividem a linha e DP/ADAP ocupa a seguinte. Próximo pagamento continua disponível.
- 52 testes aprovados, incluindo os cenários sem vencidas, com outubro vencido e com outubro já pago; lint, TypeScript e build aprovados. Mantém-se o aviso preexistente de bundle acima de 500KB.
- Conferência visual da home e do Financeiro em 1440 e 390 px, além do valor vencido em vermelho. O modelo continua usando sua data de referência sintética; nenhuma integração financeira institucional foi adicionada.
