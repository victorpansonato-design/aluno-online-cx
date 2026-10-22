# Proveniência de ativos

public/brand/anchieta.png: ativo preexistente do template fornecido; pertence à primeira versão, mantida como histórico.

Na revisão 2, public/replica contém logo, fontes, SVGs de ilustração e rasters públicos observados no portal real. Os endereços de origem dos rasters e capturas estão em asset-provenance-v2.json. A Ana é o WebP preexistente do widget público institucional, decodificado sem recriação. O avatar genérico SVG foi criado por código para substituir fotos pessoais.

As 30 capturas em screenshots/v2 mostram somente o frontend local com dados fictícios. A proveniência foi incorporada aos PNG/JPEG e, quando o formato exige, registrada em sidecar JSON para WebP. A comparação dos payloads de imagem confirmou que a incorporação de metadados não alterou os pixels dos 35 rasters da revisão.

CSS, classes e SVGs de referência foram mantidos para a cópia autorizada. Nenhum JavaScript executável do portal ou conteúdo de imagem privada de aluno/docente foi incluído. Capturas autenticadas, HTML bruto e ferramentas de coleta ficam em work/clone-reference e work/, fora do repositório, e não devem ser publicados.

Na revisão 3, screenshots/v3 contém 31 capturas locais com dados fictícios. Origens registradas em asset-provenance-v3.json, com payloads de pixels preservados. Nenhum novo bitmap foi gerado para a simplificação; as ilustrações continuam sendo os ativos do portal. O esboço de calendário do usuário orienta o componente HTML/CSS e não foi incorporado como imagem de página.

A revisão 4 usa 31 recapturas locais em screenshots/v4, substituindo em todos os arquivos os estados intermediários rejeitados. As três imagens enviadas pelo usuário orientaram degradê, ausência da faixa e indicadores de horas; não foram copiadas como imagem de interface ou publicadas no repositório.

## Revisão 5 · mídia contextual e capturas

As fontes originais de identidade e as revisões anteriores acima permanecem preservadas. O refinamento de 22/10/2026 adicionou dois clipes de banco para Estudos/Atividades, sem substituir os ativos institucionais. Nenhuma imagem foi gerada por IA nesta revisão, e nenhuma foto privada de aluno foi incorporada. Não houve adição de dependências.

| Ativo entregue                | Origem e licença                                                                                                                                                                                                     | Especificação entregue                         |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| public/media/study-notes.mp4  | [Mixkit 50109](https://mixkit.co/free-stock-video/a-student-making-notes-and-mathematical-charts-on-the-notebook-50109/), [Stock Video Free License](https://mixkit.co/license/#videoFree), consultada em 22/10/2026 | 1280×720, 7,5s, 956.060 bytes                  |
| public/media/study-desk.mp4   | [Mixkit 50111](https://mixkit.co/free-stock-video/student-makes-a-note-over-wooden-desk-filled-with-mathematical-50111/), mesma licença e data                                                                       | 1280×720, 7,5s, 739.530 bytes                  |
| public/media/study-notes.webp | Quadro extraído de Mixkit 50109 com ffmpeg                                                                                                                                                                           | 960×540, aproximadamente 30KB, origem embutida |
| public/media/study-desk.webp  | Quadro extraído de Mixkit 50111 com ffmpeg                                                                                                                                                                           | 960×540, aproximadamente 48KB, origem embutida |

Os dois originais são **Full HD 1920×1080**, não 4K. Os MP4 entregues usam H.264 Main, yuv420p, level 3.1, sem áudio, faststart e crossfade de 0,5s no ciclo. SHA-256, tamanhos e caminhos exatos estão em [media-provenance-v5.json](media-provenance-v5.json). Originais de trabalho não integram a entrega. Mixkit 14734 foi descartado pela restrição da licença gratuita a uso pessoal; Pexels foi pesquisado como alternativa, mas nenhum ativo foi incorporado.

Os clipes representam o ato de estudar; não documentam alunos, instalações ou atividades comunitárias reais do Anchieta. Texto fica fora da mídia, na região esquerda do painel; o CSS explicita os recortes. O pôster é a experiência estática em telas menores e condições restritas, sem requisição do MP4 abaixo de 1024px. Elegibilidade por movimento, dados, rede e memória, pausa e visibilidade estão descritas em DESIGN.md e implementadas em Experience.tsx. Não há player externo, iframe ou rastreador, nem promessa de desempenho uniforme.

A revisão 5 contém 57 capturas locais em docs/screenshots/v5 e dois pôsteres com metadados de origem incorporados. [asset-provenance-v5.json](asset-provenance-v5.json) relaciona os 59 rasters e registra preservação do payload de pixels. O scanner da revisão retornou zero origens ausentes. Capturas são do frontend local com perfil isolado e dados sintéticos, não evidência de integração institucional. A retirada dos avisos repetidos da UI não altera essa proveniência. Fontes, logo, Ana e ilustrações herdadas continuam com a origem registrada nas revisões anteriores; não se atribui a eles a licença Mixkit.

## Revisão 7

A Secretaria usa o clipe Mixkit 50115, de orientação ao estudante na biblioteca, com licença Stock Video Free License confirmada. Fonte Full HD e entrega local 1920×1080 H.264 sem áudio, loop de aproximadamente 7,5s. Origem, hash e política atual em media-provenance-v7.json e REFINAMENTO-V7.md. Os clipes anteriores continuam em Estudos/Atividades e agora também reproduzem no mobile. Dezesseis screenshots V7 e o novo pôster possuem origem registrada em asset-provenance-v7.json.

V8: nove capturas locais da home, Financeiro e responsáveis em `screenshots/v8/`, com hashes em `asset-provenance-v8.json`. São identidades sintéticas; nenhum novo vídeo ou ativo remoto foi acrescentado nesta revisão.
