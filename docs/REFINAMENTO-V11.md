# Revisão 11 · vídeo da Secretaria e Eletivas em Atividades e horas

23/10/2026. Atende à escolha do vídeo Pexels 7581281 e à reunião de Eletivas na tela Atividades e horas.

## Resultado e caminhos

Disciplinas eletivas agora fica entre extensão e certificados em Atividades e horas. Tem acento violeta próprio e texto que distingue inscrições em disciplinas do registro de horas complementares. A ação abre o sistema institucional em nova aba; não cria matrícula local ou falsa sincronização de dados.

O acesso antes presente em Apoio e escolhas para estudar foi movido para Atividades da minha formação. Os atalhos da organização conectada, a busca e a orientação da Ana apontam para `/meus-estudos/atividades#eletivas`. Os endereços antigos `/academico/eletivas`, `/meus-estudos/eletivas`, `/eletivas` e o prefixo `/aluno-online/academico/eletivas` redirecionam para o mesmo ponto. O contexto Meus estudos e a aba Atividades e horas permanecem ativos. O modo Original conserva a referência histórica do portal.

O sistema [Eletivas](https://app.anchieta.br/Eletivas/) foi consultado com a conta de teste autorizada, incluindo orientações e organização entre oferta e inscrições. Não houve nova inscrição, cancelamento ou alteração acadêmica. A confirmação continua no sistema oficial, conforme o escopo de integração por links externos deste front-end.

## Vídeo escolhido

[Person Signing the Documents — RDNE Stock project/Pexels](https://www.pexels.com/video/person-signing-the-documents-7581281/), sob a [licença Pexels](https://www.pexels.com/license/). O seletor Full HD foi conferido na página aberta pelo usuário. O arquivo efetivamente entregue pelo download oficial decodifica em **1280×720**, 30fps, aproximadamente 8,87s, apesar da indicação 1920×1080 da página. A versão do portal conserva a resolução nativa, sem ampliação artificial.

Entrega H.264 Main/yuv420p, level 3.1, sem áudio, faststart, 7,5s, 1.254.998 bytes. O trecho de 0,3 a 8,3s recebe uma sobreposição de 0,5s no fechamento do ciclo. Desktop usa cover com foco em 50%/68%, preservando mãos, caneta e documento; mobile usa 16:9. Pôster WebP acompanha o mesmo enquadramento. Autoplay silenciado, playsinline e loop permanecem; vídeo pausa fora da tela e da aba, e redução de movimento/Save-Data/2G conservam o pôster.

O novo nome `secretariat-documents` evita reaproveitar o endereço do vídeo antigo. Os três arquivos antigos de orientação foram retirados da entrega pública. Origem, hashes e especificações estão em `media-provenance-v11.json`.

A revisão visual também encontrou uma regra antiga que mantinha o vídeo de ContextBanner absoluto no mobile. Ao ganhar largura 100%, ele cobria o texto. Agora participa do fluxo abaixo do conteúdo, com validação dos limites dos elementos em 390 e 320px.

## Validação

- 59 testes em cinco suítes aprovados: inclui navegação contextual, quatro rotas antigas, busca e preservação do destino institucional.
- TypeScript, ESLint e build aprovados; aviso preexistente de bundle principal acima de 500KB permanece.
- Oito combinações de duas telas em 1440/768/390/320px sem transbordamento horizontal, com início de rota no topo.
- 14 verificações no navegador: limites do banner mobile, decodificação do vídeo escolhido, retorno real do loop em desktop e mobile, pausa fora da tela e caminhos de Eletivas.
- Duas auditorias axe sem violações automáticas no escopo de Atividades e horas. Há verificações incompletas; isso não comprova conformidade WCAG integral.
- Quatro capturas aprovadas em `screenshots/v11/`, relatório `refinement-browser-v11.json`, reprodução por `scripts/refinement-qa-v11.mjs`. Não houve teste em aparelho físico ou nova pesquisa com alunos.
