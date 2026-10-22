# Validação V5 — 22/10/2026

## Resultado e escopo

Refinamento local, sem commit, push ou publicação. O HEAD permanece `d8d053f`, a correção anterior de deploy. A instituição não foi acionada para enviar pedidos, documentos, avaliações, alterações cadastrais ou pagamentos.

- **38 testes automatizados** em quatro suítes: comportamentos anteriores, clone, navegação conectada e refinamento. Os testes de pedido pago verificam que só o protocolo relacionado muda; o pagamento de uma cobrança não quita outra.
- **36 combinações de layout:** seis páginas (Início, Estudos, Secretaria, Financeiro, Ajuda e Atividades) em 1440, 1280, 1024, 768, 390 e 320px. Sem transbordamento da página nem imagens quebradas nas verificações finais.
- **12 auditorias axe** nas páginas principais em desktop e celular: zero violações automáticas. Mais três auditorias em menu recolhido, menu móvel e home escura: zero violações.
- **122 rotas** percorridas pelo script, incluindo as 109 páginas capturadas e os novos destinos/overlays. Extrato `/financeiro/extrato` conferido adicionalmente, com o título e conteúdo próprios. Catálogo com os **40 formulários**, cada um aberto e fechado com sua estrutura de campos.
- **55 destinos únicos** inventariados nas seis páginas refinadas. Os caminhos internos correspondem às telas, ao catálogo ou aos overlays existentes; extrato usa a fonte financeira com recorte próprio. Links externos preservam o destino, sem executar operações na instituição.
- **22 verificações de interação** no navegador: seis destinos principais, menu recolhido e acessível, vídeo com decodificação/reprodução/pausa, parada fora de vista, Save-Data simulado, recuperação de busca, resposta contextual da ajuda, cobrança selecionada desde a home, informação de pagamento e retorno, menu móvel, Ana, DP/adaptação, texto maior, cobrança inválida, troca de mês e ausência de transferência de MP4 na home móvel.
- **57 capturas** em `docs/screenshots/v5/`, com primeiras viewports e fundos das páginas de rolagem interna, menu e estados de interação. **59 rasters** contando os dois pôsteres têm origem embutida; scanner final sem origem ausente e payload visual preservado.

Evidência reproduzível: `refinement-browser-v5.json`, `refinement-flows-v5.json`, `refinement-detector-v5.json`, `asset-provenance-v5.json` e `media-provenance-v5.json`; scripts `scripts/refinement-qa-v5.mjs` e `scripts/refinement-flows-v5.mjs`.

## Correções encontradas na verificação

O lote inicial apontou transbordamento da grade de Atividades em 768px e um atributo ARIA sem papel válido na jornada. A grade passa a uma coluna nas áreas estreitas; a jornada tem descrição acessível e papel próprio. O cenário de DP distingue pendências de um período concluído e leva à regularização. A home e o financeiro móveis foram compactados mantendo valor, prazo e ação juntos.

O arquivo de vídeo após a primeira transição de loop usava amostragem 4:4:4; a versão final foi convertida para **H.264 Main, yuv420p, nível 3.1**, adequada ao player testado. A reprodução real e a pausa foram verificadas após a conversão. O navegador reportou downlink limitado em parte da sessão; para testar reprodução com elegibilidade foi usada conexão rápida **simulada**, e para testar economia de dados foi usado Save-Data **simulado**. Isso valida as ramificações da política, sem representar um teste físico de todos os celulares.

O detector mecânico foi executado uma vez: 123 avisos de aconselhamento, zero achados primários. Eles refletem principalmente os tamanhos e valores compactos em relação ao documento V4 e não foram apagados por declarar todos os valores como tokens. A revisão independente retornou **ship**, com escopo e limites registrados em `REVISAO-INDEPENDENTE-V5.md`.

## Mídia e custo

Os originais Full HD Mixkit ficam no diretório de trabalho e não são entregues ao navegador. O portal usa dois loops de 7,5s, 1280×720, sem áudio e com faststart: aproximadamente **956 KB** e **740 KB**. Pôsteres WebP de 960×540 têm cerca de **30 KB** e **48 KB**. A passagem de fim/início usa crossfade de 0,5s.

Na home não há vídeo. Em Estudos e Atividades, nenhum MP4 é anexado abaixo de 1024px, com movimento reduzido, Save-Data, conexão lenta ou hardware conhecido como limitado. A mídia para fora da tela e quando o documento fica inativo. Texto e ações não dependem da imagem. Origem, licença e hashes estão no manifesto de mídia.

## Limites da conclusão

O resultado é um frontend com dados de apresentação e estado no navegador. A base temporal é outubro de 2026; não existe feed institucional atualizado. A remoção dos avisos repetidos da interface é uma decisão editorial pedida pelo usuário, não uma integração. Valores, horas de extensão, calendário adicional e QR/Pix permanecem sintéticos. “Pagamento informado” registra somente a ação local e não é confirmação bancária. Arquivos exportados mantêm identificação de origem e validade.

O build conserva o aviso de chunk acima de 500 KB já existente no clone. Nenhuma biblioteca de gráficos, player remoto ou serviço de rastreamento foi acrescentado. Os resultados automáticos não comprovam acessibilidade integral: há verificações incompletas de contraste em gradientes, e não foram realizados testes com tecnologia assistiva ou hardware físico de baixa capacidade. A revisão examinou as capturas exigidas e amostras adicionais, não todas as combinações de conteúdo e estado. Satisfação, sucesso e tempo de tarefa com alunos reais continuam a exigir o estudo proposto no planejamento.
