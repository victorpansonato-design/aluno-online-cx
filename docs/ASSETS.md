# Proveniência de ativos

public/brand/anchieta.png: ativo preexistente do template fornecido; pertence à primeira versão, mantida como histórico.

Na revisão 2, public/replica contém logo, fontes, SVGs de ilustração e rasters públicos observados no portal real. Os endereços de origem dos rasters e capturas estão em asset-provenance-v2.json. A Ana é o WebP preexistente do widget público institucional, decodificado sem recriação. O avatar genérico SVG foi criado por código para substituir fotos pessoais.

As 30 capturas em screenshots/v2 mostram somente o frontend local com dados fictícios. A proveniência foi incorporada aos PNG/JPEG e, quando o formato exige, registrada em sidecar JSON para WebP. A comparação dos payloads de imagem confirmou que a incorporação de metadados não alterou os pixels dos 35 rasters da revisão.

CSS, classes e SVGs de referência foram mantidos para a cópia autorizada. Nenhum JavaScript executável do portal ou conteúdo de imagem privada de aluno/docente foi incluído. Capturas autenticadas, HTML bruto e ferramentas de coleta ficam em work/clone-reference e work/, fora do repositório, e não devem ser publicados.

Na revisão 3, screenshots/v3 contém 31 capturas locais com dados fictícios. Origens registradas em asset-provenance-v3.json, com payloads de pixels preservados. Nenhum novo bitmap foi gerado para a simplificação; as ilustrações continuam sendo os ativos do portal. O esboço de calendário do usuário orienta o componente HTML/CSS e não foi incorporado como imagem de página.

A revisão 4 usa 31 recapturas locais em screenshots/v4, substituindo em todos os arquivos os estados intermediários rejeitados. As três imagens enviadas pelo usuário orientaram degradê, ausência da faixa e indicadores de horas; não foram copiadas como imagem de interface ou publicadas no repositório.
