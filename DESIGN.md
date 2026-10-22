---
name: Aluno Online CX — clone aprovado, revisão 5
description: Identidade Anchieta preservada em uma rotina acadêmica conectada.
colors:
   "primary": "oklch(39.341% .16812 263.91)"
   "primary-foreground": "oklch(99% .005 264)"
   "primary-soft": "oklch(95% .025 263.91)"
   "brand-yellow": "oklch(82% .165 86)"
   "brand-yellow-soft": "oklch(96% .05 95)"
   "background": "oklch(99.2% .003 264)"
   "foreground": "oklch(18% .025 264)"
   "shell": "oklch(95.8% .008 264)"
   "shell-foreground": "oklch(22% .03 264)"
   "canvas": "oklch(100% 0 0)"
   "card": "oklch(100% 0 0)"
   "muted": "oklch(96.5% .006 264)"
   "muted-foreground": "oklch(48% .022 264)"
   "accent": "oklch(94% .012 264)"
   "border": "oklch(92% .01 264)"
   "border-strong": "oklch(86% .014 264)"
   "input": "oklch(92% .01 264)"
   "ring": "oklch(55% .13 263.91)"
   "sidebar-accent": "oklch(92% .014 264)"
   "sidebar-border": "oklch(90% .014 264)"
   "success": "oklch(50% .12 152)"
   "success-soft": "oklch(95% .04 152)"
   "destructive": "oklch(58% .21 27)"
   "destructive-soft": "oklch(96% .03 27)"
   "warning": "oklch(60.341% .15574 51.704)"
   "warning-foreground": "oklch(27.722% .06872 54.875)"
   "dark-background": "oklch(15% .022 264)"
   "dark-foreground": "oklch(96% .006 264)"
   "dark-shell": "oklch(12.5% .02 264)"
   "dark-canvas": "oklch(19.5% .026 264)"
   "dark-card": "oklch(20% .028 264)"
   "dark-primary": "oklch(65% .15 263.91)"
   "dark-primary-foreground": "oklch(15% .025 264)"
   "dark-primary-soft": "oklch(28% .08 263.91)"
   "dark-muted": "oklch(22% .025 264)"
   "dark-muted-foreground": "oklch(68% .018 264)"
   "dark-border": "oklch(26% .028 264)"
   "dark-sidebar-accent": "oklch(17.5% .024 264)"
   "dark-sidebar-border": "oklch(21% .026 264)"
   "dark-success": "oklch(68% .14 152)"
   "dark-destructive": "oklch(62% .22 27)"
   "cx-teal": "#087568"
   "cx-violet": "#6852ad"
   "cx-rose": "#b64258"
   "dark-cx-teal": "#73d7bc"
   "dark-cx-violet": "#c1adff"
   "dark-cx-rose": "#ff9eaf"
typography:
   headline:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "30px"
      fontWeight: 700
      lineHeight: 1.2
      letterSpacing: "-0.025em"
   headline-mobile:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "25px"
      fontWeight: 700
      lineHeight: 1.25
      letterSpacing: "-0.025em"
   title:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "18px"
      fontWeight: 650
      lineHeight: 1.4
      letterSpacing: "-0.015em"
   section:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "16px"
      fontWeight: 650
      lineHeight: 1.45
   body:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "14px"
      fontWeight: 400
      lineHeight: 1.6
   label:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "14px"
      fontWeight: 500
      lineHeight: "20px"
   context-link:
      fontFamily: '"Inter", system-ui, sans-serif'
      fontSize: "13px"
      fontWeight: 550
   icon:
      fontFamily: '"Material Symbols Outlined"'
      fontSize: "20px"
      fontWeight: 400
      lineHeight: 1
      letterSpacing: "normal"
   financial-number:
      fontFamily: '"JetBrains Mono", ui-monospace, monospace'
      fontSize: "27px"
      fontWeight: 650
      lineHeight: 1.35
      letterSpacing: "-0.035em"
rounded:
   "navigation": "6px"
   "control": "8px"
   "compact-card": "9px"
   "context": "10px"
   "container": "12px"
   "dialog": "14px"
   "priority-card": "16px"
   "pill": "999px"
   "sphere": "50%"
spacing:
   "4": "4px"
   "6": "6px"
   "8": "8px"
   "10": "10px"
   "12": "12px"
   "16": "16px"
   "20": "20px"
   "24": "24px"
   "28": "28px"
   "32": "32px"
components:
   button-primary:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.primary-foreground}"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "9px 15px"
   button-secondary:
      backgroundColor: "{colors.card}"
      textColor: "{colors.foreground}"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "9px 15px"
   input:
      backgroundColor: "{colors.card}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.control}"
      padding: "10px 12px"
   nav-active:
      height: "36px"
      width: "224px"
      typography: "{typography.label}"
      backgroundColor: "{colors.canvas}"
      textColor: "{colors.primary}"
      rounded: "{rounded.navigation}"
      padding: "8px"
   section-nav-active:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.primary-foreground}"
      rounded: "{rounded.pill}"
      padding: "8px 13px"
   status:
      backgroundColor: "{colors.primary-soft}"
      textColor: "{colors.primary}"
      rounded: "{rounded.pill}"
      padding: "3px 9px"
   priority-card:
      backgroundColor: "{colors.card}"
      rounded: "{rounded.priority-card}"
      padding: "23px"
   callout:
      backgroundColor: "{colors.primary-soft}"
      textColor: "{colors.primary}"
      rounded: "{rounded.control}"
      padding: "15px 16px"
   dialog:
      backgroundColor: "{colors.background}"
      textColor: "{colors.foreground}"
      rounded: "{rounded.dialog}"
      padding: "26px"
      width: "calc(100% - 32px)"
   payment-value:
      textColor: "{colors.success}"
      typography: "{typography.financial-number}"
   ana-floating:
      rounded: "{rounded.sphere}"
      width: "88px"
      height: "92px"
   formation-card:
      backgroundColor: "{colors.card}"
      rounded: "{rounded.container}"
      padding: "14px"
   hours-done:
      backgroundColor: "{colors.success}"
      height: "6px"
   hours-complementary-remaining:
      backgroundColor: "{colors.destructive}"
      height: "6px"
   hours-extension-remaining:
      backgroundColor: "{colors.muted}"
      height: "6px"
   sidebar-card:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.primary-foreground}"
      rounded: "{rounded.container}"
      padding: "13px 12px"
   context-panel:
      rounded: "{rounded.priority-card}"
      padding: "26px 28px"
---

# Design System: Aluno Online CX

## Overview

**Creative North Star: "Portal Anchieta, rotina conectada"**

A identidade vem do portal Anchieta clonado e aprovado: moldura clara, azul institucional, amarelo de seleção, Inter e números em JetBrains Mono. A experiência Conectada organiza essa mesma linguagem em seis destinos, com informação e próxima ação próximas, preservando os ativos institucionais e as páginas de referência.

A interface é operacional e familiar, de densidade moderada, com listas divididas por linhas, superfícies claras, cartões suaves e a esfera flutuante da Ana no canto inferior direito. O modo Original continua disponível para comparação. Este registro reconcilia o DESIGN anterior com a mudança autorizada; a proposta v1 rejeitada e o CSS inativo de src/cx não orientam novas superfícies.

Autoridade de implementação: src/replica/original.css, replica.css, student/student.css, student/refinements.css, student/Experience.tsx, App.tsx e reference.ts. PRODUCT.md sustenta a continuidade de marca; docs/SURFACE.md e docs/REFINAMENTO-V5.md contêm a composição e as referências da revisão 5. Este registro mescla o refinamento autorizado ao sistema existente. O frontmatter registra os valores reutilizados, com aliases de cor resolvidos; dark-* descreve os overrides reais de .dark, não novas variáveis CSS. A mudança de tema continua pelas variáveis semânticas existentes.

**Key Characteristics:**

- Azul institucional e amarelo de seleção preservados.
- Moldura e cabeçalho do clone, com superfícies tonais e cantos suaves.
- Uma família de leitura e números acadêmicos em mono.
- Seis destinos, navegação interna por contexto, carteirinha no rodapé lateral e Ana flutuante.
- Módulos compactos, indicadores com números e mídia contextual separada do texto.

## Colors

A paleta conserva o azul profundo e o amarelo quente do portal, apoiados por neutros frios e estados semânticos.

### Primary

- **Azul institucional** (primary): ações, links, ícones e seleção; primary-foreground acompanha as ações preenchidas.
- **Azul suave** (primary-soft): contexto, seleção secundária e chamadas informativas.

### Secondary

- **Amarelo Anchieta** (brand-yellow): faixa de seleção principal e detalhes institucionais. O tom suave acompanha avisos existentes, sem ocupar todo o fundo da aplicação.

### Tertiary

- **Conclusão** (success / success-soft): sucesso acompanhado de texto; o verde forte também colore o valor do próximo pagamento e as horas cumpridas de complementares e extensão, conforme as imagens fixadas pelo usuário.
- **Erro** (destructive / destructive-soft): falha, atenção crítica e segmento restante das horas complementares. Extensão conserva restante muted e marcador muted-foreground, conforme sua referência própria.
- **Atenção** (warning / warning-foreground): alerta e marcador de horas exigidas. Ícones âmbar e coral conservam significado de pendência documental e faltas; warning-soft no CSS remete ao amarelo suave no tema claro. O cartão de pagamento permanece card, sem fundo amarelo arbitrário.
- **Assuntos** (cx-teal / cx-violet / cx-rose): cores auxiliares reutilizadas nos ícones de atalhos e pendências. Seus pares dark-* acompanham o tema escuro. O azul lavado de contexto é uma mistura CSS de primary (7%) com card, não uma segunda cor primária.

### Neutral

- **Fundo** (background), **moldura lateral** (shell) e **folha de trabalho** (canvas): camadas estruturais.
- **Cartão** (card), **fundo discreto** (muted) e **resposta de interação** (accent): superfícies locais.
- **Tinta** (foreground), **tinta lateral** (shell-foreground) e **texto secundário** (muted-foreground): hierarquia de leitura.
- **Linha** (border / border-strong), **campo** (input) e **foco** (ring): separação e estado de interação.
- **Navegação** (sidebar-accent / sidebar-border): hover e divisória próprios da moldura.

Os tokens dark-* do frontmatter são pares do tema escuro. O CSS também mantém os demais pares semânticos originais de sucesso, alerta, campo, popover e sidebar. Consumir var(--primary), var(--card), var(--foreground) e os demais nomes existentes; não criar variáveis --dark-* a partir deste registro.

**The Source Identity Rule.** Novas superfícies usam os tokens e ativos do clone aprovado; a primeira proposta rejeitada não é referência visual.

**The Selection Stripe Rule.** A seleção principal combina superfície canvas, texto azul e faixa amarela; a cor não substitui o rótulo.

## Typography

**Display Font / Body Font:** Inter, com system-ui e sans-serif como fallback.
**Numeric Font:** JetBrains Mono, com ui-monospace e monospace como fallback.
**Icon Font:** Material Symbols Outlined, biblioteca original em papel de ícone (icon no frontmatter), não texto nem Unicode improvisado.

**Character:** a leitura mantém a família sans do clone; peso, tamanho e proximidade constroem a hierarquia. A variante variável de Inter e JetBrains Mono cobre pesos de 400 a 700. Caveat permanece nos detalhes herdados que já a usam, sem tornar-se fonte de título ou de formulário.

### Hierarchy

- **Headline:** título de página, com a variante headline-mobile abaixo do breakpoint principal.
- **Title:** seção; no celular, títulos gerais de seção passam a 17px.
- **Section:** subtítulo interno.
- **Body:** texto e orientação. A introdução tem limite de 70ch; texto secundário costuma usar 13px.
- **Label:** ação comum; links contextuais usam context-link.
- **Financial Number:** quantia principal em success, com números tabulares; na home móvel passa a 23px e abaixo de 359px a 21px. O resumo financeiro tem sua própria hierarquia contextual.
- **Icon:** símbolos originais da navegação, com ligaturas e sem substituir o rótulo do destino.

As configurações cv11 e ss01 pertencem ao corpo original; mono usa tnum e zero. Metadados pequenos são observações do legado, não uma escala a herdar. Material Symbols é a biblioteca de ícones real herdada e preservada na interface. Os snippets do sidecar usam SVG inline apenas para serem autossuficientes no painel, sem exigir a fonte de ícones. Inter e a faixa ativa amarela são decisões originais explicitamente fixadas pelo usuário; os avisos genéricos sobre família frequente e faixa de seleção não autorizam trocar a identidade.

**The Numeric Continuity Rule.** Quantias e números acadêmicos que já usam mono preservam JetBrains Mono e algarismos tabulares; a leitura geral permanece em Inter.

## Layout

O desktop preserva a moldura externa de 8px e a sidebar de 272px, recolhida para 48px. O conteúdo ocupa a folha principal arredondada, com cabeçalho e rolagem próprios do clone. O controle lateral permite redimensionamento entre 224px e 400px; esses extremos são comportamento, não larguras padrão adicionais.

A navegação principal Conectada tem seis destinos: Início, Meus estudos, Secretaria virtual, Financeiro, Calendário e Meus dados. Assuntos relacionados usam hubs, listas e navegação contextual rolável; não se replica toda a árvore no menu. O rodapé lateral reúne carteirinha visual e Preciso de ajuda; curso, período/semestre ficam na home, com AVA acima desse conjunto. A região pode rolar em alturas pequenas. Os links têm a densidade original: posição desktop x=24px, largura interna de 224px, altura de 36px, padding de 8px, gap interno de 8px e intervalo de 4px na lista. A comparação Original/Conectada fica somente no menu da conta, fora do cabeçalho da sidebar e do drawer.

A grade usa minmax para proteger conteúdo: prioridades da home usam 1.8:1, segunda coluna mínima de 260px e intervalo de 18px; a região de acompanhamento usa 1.65:1, coluna de apoio mínima de 285px e intervalo de 28px. Os dois módulos de horas ficam lado a lado. As distâncias reutilizadas estão no frontmatter; 16–24px sustentam componentes e 28–32px separam regiões. São regras de ritmo, não uma grade rígida universal.

- **A partir de 1440px:** preservar a composição larga; os overrides V5 da home prevalecem sobre as medidas antigas da aula.
- **Abaixo de 1200px:** grades tornam-se mais compactas e ilustrações contextuais podem desaparecer; o calendário completo passa para uma coluna.
- **768–1023px:** prioridades, estudos e operação financeira usam uma coluna; horas são antecipadas na ordem de leitura e permanecem em dois módulos. Vídeo usa somente pôster.
- **Abaixo de 768px:** sidebar vira drawer à esquerda com largura min(18rem, calc(100vw - 32px)), equivalente a 288px quando há espaço. O cabeçalho reúne logo, busca e fechar. O menu preserva contexto e orientação; a Ana permanece o widget flutuante fora do menu. Prioridades e grades se empilham, a navegação interna pode rolar e as ações principais da página têm altura mínima de 44px.

## Elevation & Depth

A profundidade combina superfícies tonais, bordas finas e sombras suaves. A próxima aula recebe gradiente branco/azul (112deg, card a 10% → primary-soft) e a ilustração workspace.svg original em suas cores; o pagamento mantém superfície card e quantia success. Aberturas contextuais usam gradiente suave; carteirinha usa o azul institucional. A moldura e os cartões herdados conservam sombras discretas. Diálogos e sheets têm elevação maior e overlay escuro.

### Shadow Vocabulary

- **Seleção lateral:** sombra mínima, registrada no sidecar.
- **Prioridade:** sombra azul difusa da próxima aula.
- **Diálogo:** elevação central sobre overlay.
- **Sheet:** sombra lateral do painel deslizante.
- **Ana:** drop-shadow suave do widget esférico original, sem bloco ou trilho de apoio.

Transições de cor duram 150ms; pressão de botão desloca 1px em 120ms. Diálogo usa 200ms, sheet 500ms no desktop e 300ms no celular; o drawer usa 300ms. As extensões usam curvas existentes e respeitam movimento reduzido. As curvas exatas estão no sidecar; não se afirma equivalência completa com o portal.

**The Floating Ana Rule.** A Ana permanece somente a esfera flutuante no canto inferior direito em Conectada e Original. Não acrescentar barra, trilho, bloco azul ou reserva permanente de viewport. O alcance ao conteúdo é protegido por espaço no fim da rolagem e revelação do foco.

## Shapes

Cantos suaves variam por função: navegação, controle, cartão compacto, contexto, container, diálogo e prioridade seguem os tokens correspondentes. Pílulas pertencem a status e subnavegação. Bordas de 1px distinguem campos, cartões e divisórias; uploads usam linha tracejada. Círculos são usados para avatar e marcadores. Preservar os ativos reais sem redesenhar logo, Ana ou ilustrações.

## Components

### Buttons

Ações diretas com ícone opcional e rótulo explícito. Principal usa primary e primary-foreground; secundário usa card, foreground e borda. O hover principal mistura 90% do azul com preto; secundário usa accent. Pressionar desloca 1px. O botão base tem mínimo de 38px; nas novas páginas Conectadas, mínimo de 42px no desktop e 44px no celular. Disabled usa opacidade de 0.45. Foco visível usa ring com offset de 3px; páginas Conectadas têm contorno de 3px e extensões gerais de 2px.

### Chips

Status é uma pílula azul suave com texto; não é controle. Filtros acionáveis são botões com aria-pressed, borda e seleção explícita. Subnavegação ativa é uma pílula preenchida em primary, enquanto a seleção principal usa canvas e faixa amarela. Não misturar esses dois níveis.

### Cards / Containers

Cartões de prioridade têm raio mais amplo; pagamento usa card e borda, com quantia verde success e padding de 19px 20px no desktop. Próxima aula usa gradiente branco/azul, sombra discreta e a ilustração workspace.svg em cor, sem redesenhar ou recolorir o ativo. Na revisão 5, a imagem mede 175×144px, right 6px e opacidade 1; abaixo de 1200px é ocultada. A aula tem mínimo de 206px e padding de 23px 26px; no telefone, mínimo de 176px e padding de 18px. Listas de destinos nos hubs usam superfícies muted separadas, com raio de 12px, padding de 12px e hover accent; os atalhos sobre painéis muted usam card. Informações críticas, valor, prazo e ação permanecem juntos quando a grade se empilha.

### Inputs / Fields

Campos com rótulo externo, card, linha input, raio control e padding registrado. Altura mínima de 42px; textarea começa em 100px e redimensiona verticalmente. Busca combina SVG e campo sem duplicar bordas; foco envolve o grupo com ring. Busca do calendário móvel usa texto de 16px. Erro e confirmação aparecem junto ao campo ou ação com texto semântico.

### Navigation

Links principais Conectados mantêm a altura original de 36px, texto de 14px, ícone de 20px, padding e gap de 8px, raio de 6px e lista com intervalo de 4px. Seleção usa peso 500, canvas, texto primary e a mesma sombra do Original. A faixa amarela mede 3px de largura e 16px de altura, centralizada, com raio 0 2px 2px 0. Itens inativos usam sidebar-foreground a 80% e ícones muted-foreground; hover recebe sidebar-accent. Cabeçalho e drawer conservam a identidade aprovada; a comparação fica somente na conta.

### Formação e horas

Dois módulos card com borda e raio container substituem o grande cartão externo. Padding base de 14px, 12px na coluna da home, 11px 12px no celular e 10px abaixo de 359px. Complementares mostra 16%, 26/160h e 134h restantes; extensão mostra 17%, 40/240h e 200h restantes. A barra de 6px usa success no trecho cumprido; complementares usa destructive no restante e extensão usa muted. Os detalhes de Atividades ampliam padding e valores. Percentuais são arredondados; a proporção usa os valores exatos. Números, rótulos e nomes acessíveis sustentam a leitura além da cor. A meta de extensão continua sintética e registrada na documentação; não há aviso repetido de demonstração na UI.

### Cartão lateral e painéis de contexto

Carteirinha é um link azul com gradiente de 130deg, raio container, mínimo de 82px e padding de 13px 12px; hover usa primary. Na barra recolhida, mínimo de 40px, ícone com nome acessível e contexto por dica. Curso e ajuda continuam próximos. Esse cartão não muda a geometria dos seis itens principais.

Painéis de Estudos e Atividades separam texto da região de mídia à direita, com raio priority-card, grade 1.35:1 e padding textual de 26px 28px. No celular, a faixa visual mede 84px (70px abaixo de 359px) e o texto conserva sua região. Ícones de assunto têm superfícies tonais, sem transformar cada auxílio em uma nova cor de marca.

### Mídia contextual

Os clipes Mixkit 50109/50111 têm origem Full HD e entrega 1280×720, H.264 Main, yuv420p, level 3.1, 7,5s, sem áudio, faststart e crossfade de 0,5s no ciclo. Pôsteres WebP 960×540 permanecem disponíveis. O recorte usa cover e foco de 54%/54% para study-notes e 55%/55% para study-desk; no celular o pôster usa 54%/50%. O texto fica fora do vídeo.

O MP4 só é anexado a partir de 1024px, em região visível e elegível. Reprodução requer documento ativo, sem preferência por movimento reduzido do sistema/aplicação, Save-Data, effectiveType slow-2g/2g/3g, downlink conhecido abaixo de 1,5Mbps ou memória conhecida abaixo de 4GB. IntersectionObserver usa threshold 0,2. Pausa explícita, saída da região visível e aba inativa interrompem a reprodução; falha mantém pôster. Ausência de sinais de hardware/rede não comprova capacidade do aparelho. Abaixo de 1024px usa-se somente pôster, sem baixar MP4. Não chamar os clipes de 4K ou prometer a mesma fluidez em todos os celulares.

### Indicadores e descoberta

Barras de notas e faltas mostram valor e escala junto à disciplina: notas de 0 a 10; faltas em relação ao limite daquela disciplina. A seleção usa botões com aria-pressed e leva ao detalhe relacionado. Não há curva de evolução sem dados temporais. Agenda ordena compromissos por data. Jornada usa oito segmentos; o segundo é atual e, no cenário DP, o primeiro fica pendente com ação de regularização, sem afirmar conclusão inexistente.

Secretaria usa busca, filtros Documentos/Vida acadêmica/Atendimento, oito serviços/atalhos e catálogo completo de 40. Ajuda reúne oito perguntas em detalhes expansíveis, busca, filtros e ação contextual; estado aberto usa azul lavado e foco explícito. O pagamento local termina em “Pagamento informado”, sem apresentar a ação do usuário como confirmação bancária.

### Assistência da Ana

Esfera flutuante fixa em ambos os modos, usando o ativo original ana.webp com object-fit: contain. Desktop: 88×92px, right 24px e bottom 16px; celular abaixo de 768px: 76×80px, right 14px e bottom 12px. Z-index 40, raio de 50% e drop-shadow original. Hover fino sobe 2px; ao abrir diálogo o widget fica invisível. Não existe botão da Ana na sidebar, barra de assistência, trilho ou bloco azul.

Conectada adiciona 112px de espaço no fim da rolagem e scroll-padding-bottom; o foco que colide com o canto é revelado por ajuste de rolagem. Isso não reduz a viewport nem mantém uma faixa vazia permanente. O snippet isolado do sidecar usa um SVG esquemático de avatar apenas para demonstrar posição e interação; a aplicação usa a Ana real, sem redesenho do ativo.

### Diálogos e sheets

Diálogo central com largura fluida, máximo de 620px, altura máxima de calc(100dvh - 48px) e rolagem interna. Variante ampla chega a 850px. Sheet desktop tem largura de 448px; no celular ocupa toda a largura. Fechamento usa controle de 44px. Catálogo móvel sobe pela borda inferior; menu principal entra pela esquerda. Não converter o menu principal em bottom sheet.

## Do's and Don'ts

### Do:

- **Do** preservar logo, avatar da Ana, ilustrações e SVGs institucionais existentes.
- **Do** herdar as propriedades CSS semânticas do clone para que claro e escuro continuem coerentes.
- **Do** manter a carteirinha visual e orientação no rodapé lateral, com curso, período e semestre na home; conservar a Ana somente como esfera flutuante no canto original.
- **Do** combinar estado com texto, foco visível e próxima ação; manter os mesmos destinos no drawer móvel.
- **Do** preservar as três referências fixadas: aula em branco/azul com ilustração, pagamento branco com valor verde e horas compactas com números e segmentos próprios.
- **Do** manter texto e próxima ação fora da mídia e oferecer pôster e respeitar movimento reduzido conforme a política de reprodução.

### Don't:

- **Don't** reintroduzir a paleta, as medidas ou a navegação inferior da proposta v1 rejeitada.
- **Don't** substituir a esfera da Ana por barra, trilho, cartão lateral ou bloco azul; não reservar uma faixa fixa de viewport.
- **Don't** trocar Inter, Material Symbols ou a faixa amarela para satisfazer avisos genéricos que contradigam a identidade aprovada.
- **Don't** promover metadados muito pequenos, rótulos em caixa alta ou alvos compactos do legado a padrões para novas telas.
- **Don't** reintroduzir avisos repetidos de fictício/demonstração na interface; preservar os limites nos documentos e arquivos exportados conforme a decisão do usuário.

Não canonizado nem reparado neste registro: cada tamanho, raio e cor pontual encontrados na varredura ampla; metadados pequenos e rótulos auxiliares não se tornam uma escala universal. As medidas compactas do menu, Inter, a faixa amarela e Material Symbols são preservados por decisão explícita de identidade do usuário, sem generalizar essas exceções para outros componentes. Os avisos de detector não são apagados por alargar artificialmente os tokens. O documento não afirma conformidade WCAG de toda a aplicação nem validação de CX com alunos.

Atualização V6: [REFINAMENTO-V6.md](docs/REFINAMENTO-V6.md) registra a nova autoridade: títulos e início de rota uniformes, carteirinha na lateral, megafone no header, retirada do rodapé genérico, prévia de dois avisos e painéis contextuais por disciplina. Os números V5 acima são históricos.

Autoridade vigente V7: docs/REFINAMENTO-V7.md. Vídeos podem reproduzir no mobile com autoplay silenciado, loop e playsinline; mobile usa recorte 16:9. A regra antiga de pôster obrigatório abaixo de 1024px está substituída. Respeitar redução de movimento e Save-Data. Tema usa a revelação circular institucional de 650ms. O primeiro período permanece acessível; reprovação e adaptação têm ação na linha. Novas evidências V7 são separadas dos históricos V5/V6.
