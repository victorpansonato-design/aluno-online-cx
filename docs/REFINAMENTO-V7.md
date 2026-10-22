# Revisão 7 · financeiro, jornada e movimento

Alterações de 22/10/2026 mantidas no ambiente local, sem commit, push ou publicação. Esta revisão substitui as regras V5/V6 incompatíveis, especialmente a restrição de vídeo por largura de tela.

## Resultado

- Financeiro: navegação superior com Cobranças e pagamentos e Extrato e bolsas. Vencimento e responsável permanecem no painel direito; no celular aparecem em dois atalhos fixos na composição, sem rolagem horizontal. Dez mensalidades de exemplo, seis em aberto e quatro no histórico, com seleção individual e múltipla preservada no Pix. Situação financeira alternativa mantém outubro em aberto; situação vazia continua sem cobranças.
- Sidebar: ordem e dimensões preservadas. Somente Estudos e Financeiro recebem acentos adicionais nos ícones inativos, em violeta e verde. Seleção conserva o azul institucional.
- Extensão: cartões e listas abrem diretamente o [sistema de prática extensionista](https://app.anchieta.br/sistema_pratica_extensionista/minhas_praticas.php), em nova aba. A antiga rota local encaminha ao sistema; os registros locais de extensão foram retirados.
- Serviços: o endereço do catálogo/formulário determina a aba Solicitar um serviço, inclusive quando um catálogo é aberto sobre a página de pedidos.
- Jornada: removido o deslocamento inline capturado no trilho interno do carrossel, que cortava o primeiro período. Os oito períodos continuam acessíveis. A mudança de período preserva rolagem horizontal e vertical; uma nova rota continua iniciando no topo.
- Exemplos acadêmicos: Análise Econômica ficou reprovada, com nota 4,0 e botão Inscrever em DP na própria linha; Business English ficou como adaptação, também com botão na linha. Ambos abrem o sistema institucional de inscrição. O texto orientativo inferior recebeu acesso direto ao sistema e ao edital. Não foram inventados parâmetros de pré-seleção que o sistema externo não documenta.
- Totais coerentes com os exemplos: três aprovações, uma adaptação e uma dependência; 180h concluídas, 320h cursando, 1900h restantes; progresso arredondado em 8%; média 8,00. As mesmas linhas e ações aparecem no acordeão móvel. A cópia da lista móvel agora usa o cabeçalho e a lista corretos e remove o estado inicial invisível da animação capturada.

## Portal real e troca de tema

A jornada real foi acessada com a conta de teste autorizada, em consulta, sem pedidos ou alterações acadêmicas. A troca de tema observada usa View Transitions com revelação circular a partir do centro do ícone, duração de 650ms, curva `cubic-bezier(.87,.12,0,.78)` e `::view-transition-new(root)`. Esses parâmetros foram reproduzidos em `src/cx/theme.ts`, incluindo o raio até o canto mais distante. Header, conta e preferências usam o mesmo mecanismo. Preferência de movimento reduzido e navegadores sem suporte recebem a troca direta.

## Vídeo e enquadramento

Novo clipe da Secretaria: [Mixkit 50115 — orientação de estudante na biblioteca](https://mixkit.co/free-stock-video/student-receiving-instructions-and-help-form-his-professor-in-the-50115/), com [Stock Video Free License](https://mixkit.co/license/modal/videoFree/), confirmada na página. A cena representa orientação e resolução de dúvidas, distinta dos clipes de anotações e mesa usados em Estudos e Atividades. A alternativa de recepção 49256 foi descartada porque a versão gratuita tem licença restrita a uso pessoal.

Origem Full HD 1920×1080, versão local H.264 Main/yuv420p, 24fps, sem áudio, aproximadamente 7,5s e 1,94MB, faststart e crossfade de 0,5s na emenda do loop. Pôster 1280×720. Download oficial confirmado pelo navegador; origem, especificações e hashes em `media-provenance-v7.json`.

Os três clipes agora podem reproduzir em mobile, com autoplay silenciado, playsinline e loop. O teste confirmou decodificação Full HD no novo clipe e uma volta completa do loop em viewport de 390px. No celular, a faixa visual usa 16:9 para preservar o enquadramento; no desktop, o recorte da orientação prioriza o aluno. Continuam as restrições explícitas de movimento reduzido, Save-Data, redes 2G e aba/região fora de vista. Foram removidas as heurísticas de largura, memória e downlink estimado que bloqueavam reprodução mesmo em celulares capazes. Recusa de autoplay mantém o pôster. Não houve teste em aparelho físico ou garantia de autoplay sob políticas de economia de bateria do sistema.

## Evidência

- 44 testes em quatro suítes aprovados, incluindo as regressões de rolagem, conteúdo móvel da jornada e seleção da aba de serviços.
- TypeScript, lint e build aprovados; permanece o aviso preexistente de bundle principal acima de 500KB.
- 24 combinações: seis telas em 1440/768/390/320px, sem transbordamento horizontal e com início de rota no topo.
- 17 verificações interativas aprovadas: seleção e Pix, aba do catálogo, primeiro/oitavo período, DP/ADAP na linha, totais, extensão externa, animação de tema, gestão financeira mobile, reprodução dos três vídeos, loop completo e interrupção fora de vista.
- Conferência adicional da troca de período manteve exatamente a rolagem de 457px antes e depois do carregamento.
- Quatro auditorias axe com zero violações automáticas no escopo examinado. Isso não comprova WCAG integral.
- 16 capturas em `screenshots/v7/`; relatório em `refinement-browser-v7.json`, reproduzível com `scripts/refinement-qa-v7.mjs`.

Dados e operações continuam locais/sintéticos; os links institucionais apenas direcionam para os sistemas externos. A V7 não inclui nova revisão independente ou estudo de compreensão com alunos. As evidências das revisões anteriores permanecem históricas.
