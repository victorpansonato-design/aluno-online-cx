---
name: Aluno Online CX
description: Central de acompanhamento do aluno com identidade Anchieta.
colors:
   primary: "#153977"
   primary-hover: "#0e2c60"
   blue-soft: "#eaf0fc"
   yellow: "#ffd45c"
   bg: "#f6f8fc"
   surface: "#fff"
   shell: "#f1f4f9"
   ink: "#23334d"
   muted: "#59687e"
   line: "#e4e9f1"
   green: "#21664d"
   green-soft: "#eaf5ee"
   amber: "#875b12"
   amber-soft: "#fff5db"
   danger: "#a73636"
   focus: "#507fd8"
typography:
   headline:
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      fontSize: "29px"
      fontWeight: 650
      lineHeight: 1.35
      letterSpacing: "-0.025em"
   title:
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      fontSize: "18px"
      fontWeight: 650
      lineHeight: 1.35
      letterSpacing: "-0.025em"
   subsection:
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      fontSize: "15px"
      fontWeight: 600
      lineHeight: 1.35
      letterSpacing: "-0.025em"
   body:
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      fontSize: "14px"
      fontWeight: 400
      lineHeight: 1.55
   label:
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
      fontSize: "12.5px"
      fontWeight: 600
      lineHeight: 1.45
rounded:
   badge: "5px"
   field: "7px"
   control: "8px"
   contextual: "10px"
   card: "12px"
   panel: "14px"
   dialog: "15px"
spacing:
   inline: "8px"
   controls: "10px"
   compact: "12px"
   item: "16px"
   section: "20px"
   columns: "22px"
   panel: "24px"
   spacious: "28px"
components:
   button-primary:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.surface}"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "10px 16px"
   button-primary-hover:
      backgroundColor: "{colors.primary-hover}"
   button-secondary:
      backgroundColor: "{colors.surface}"
      textColor: "{colors.primary}"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "10px 16px"
   button-ghost:
      textColor: "{colors.primary}"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "10px 16px"
   button-yellow:
      backgroundColor: "{colors.yellow}"
      textColor: "#16366e"
      typography: "{typography.label}"
      rounded: "{rounded.control}"
      padding: "10px 16px"
   input:
      backgroundColor: "{colors.surface}"
      textColor: "{colors.ink}"
      rounded: "{rounded.field}"
      padding: "11px 13px"
   nav-active:
      backgroundColor: "{colors.primary}"
      textColor: "{colors.surface}"
      rounded: "{rounded.control}"
      padding: "10px 12px"
   status-green:
      backgroundColor: "{colors.green-soft}"
      textColor: "{colors.green}"
      rounded: "{rounded.badge}"
      padding: "4px 9px"
   panel:
      backgroundColor: "{colors.surface}"
      rounded: "{rounded.panel}"
      padding: "24px"
---

# Design System: Aluno Online CX

## Overview

**Creative North Star: "Central de acompanhamento do aluno"**

A Central de acompanhamento do aluno reúne a identidade Anchieta em uma interface operacional: azul institucional, amarelo pontual, superfícies claras e listas legíveis por hierarquia. A personalidade é direta, calma e orientada ao próximo passo, com densidade suficiente para mostrar informação acadêmica e ação no mesmo contexto.

A implementação usa Inter, bordas finas, cantos moderados e ícones de traço. O espaço distingue navegação, conteúdo e acompanhamento; a versão móvel reorganiza os mesmos elementos e conserva a orientação por rótulos. O tema escuro troca os papéis semânticos de cor; os painéis institucionais azuis de próxima aula e carteirinha mantêm o fundo fixo.

Este registro descreve a implementação em `src/cx/styles.css`, `src/cx/ui.tsx` e módulos `src/cx`, com o compromisso de marca de `PRODUCT.md` e o contexto de `docs/SURFACE.md`. Arquivos antigos do template fora desse fluxo não constituem autoridade. Trata-se de um protótipo com dados fictícios; este documento não certifica acessibilidade ou qualidade de todas as telas.

**Key Characteristics:**

- Azul institucional como eixo de ação e seleção.
- Superfícies planas com linhas divisórias e cantos moderados.
- Texto, ícone e cor trabalham juntos nos estados.
- Navegação lateral no desktop e inferior no celular.

## Colors

A paleta combina azul institucional profundo, amarelo quente e neutros frios; estados acrescentam verde, âmbar e vermelho.

### Primary

- **Azul institucional** (`primary`): botões, seleção na navegação, links, números acadêmicos e marcas de informação.
- **Azul de interação** (`primary-hover`): resposta ao hover da ação principal.
- **Azul de contexto** (`blue-soft`): informações, ícones, seleção secundária e chamadas suaves.

### Secondary

- **Amarelo Anchieta** (`yellow`): ação contextual sobre o painel azul, sinal de presença e detalhe de marca. O botão amarelo usa texto azul fixo e clareia para `#ffe28d` ao hover.

### Tertiary

- **Verde de conclusão** (`green` / `green-soft`): êxito, documentos aceitos e resultado concluído.
- **Âmbar de atenção** (`amber` / `amber-soft`): pendência e informação financeira que exige atenção.
- **Vermelho de erro** (`danger`): erro de campo e texto de risco; o badge de perigo existente compartilha o fundo âmbar.
- **Azul de foco** (`focus`): contorno do teclado; a busca usa uma variação própria (`#7094d3`).

### Neutral

- **Fundo frio** (`bg`): base da página.
- **Superfície clara** (`surface`): painéis, cabeçalho, campos e diálogos.
- **Casca de navegação** (`shell`): lateral, cabeçalhos de tabela e estados neutros.
- **Tinta** (`ink`), **texto secundário** (`muted`) e **linha** (`line`): hierarquia de leitura e separação.

O tema escuro preserva os nomes CSS e altera os valores: bg `#101827`, surface `#172233`, shell `#121d2c`, ink `#e2e9f4`, muted `#a7b4c8`, line `#2c3b50`, primary `#a6c2ff`, primary-hover `#c3d5ff`, blue-soft `#223859`, green `#91d5ad`, green-soft `#1c3c32`, amber `#f4ce80`, amber-soft `#403722` e danger `#ffaaaa`. O amarelo permanece. Os tokens do frontmatter registram o tema claro; esses overrides são os valores reais de `:root.dark`.

**The Action Blue Rule.** O azul semântico identifica ação, seleção e informação; manter seus pares de fundo e texto quando o tema muda.

## Typography

**Display Font / Body Font:** Inter, com os fallbacks declarados no frontmatter. Os arquivos carregados são os pesos estáticos 400, 500, 600 e 700; alguns títulos solicitam 650 no CSS, sem arquivo específico desse peso.

**Character:** uma só família sans mantém continuidade entre orientação, formulário e informação. Hierarquia por tamanho e peso, com tracking ligeiramente fechado nos títulos; não há fonte editorial nem mono separada.

### Hierarchy

- **Headline:** título de página; saudação tem variação própria (31px, tracking -0.04em) e passa a 29px no celular.
- **Title:** título geral de seção; cabeçalho de seção dentro do painel usa 16px.
- **Subsection:** nomes e grupos menores.
- **Body:** base herdada; parágrafos usam entrelinha 1.65. Descrições operacionais usam frequentemente 12px e limite de 75ch; estados vazios usam até 55ch.
- **Label:** ação principal; rótulos de formulário usam 12px e peso 500, campos 13px e entrelinha 1.5.
- **Números:** notas e métricas acadêmicas usam algarismos tabulares; valores de nota usam 20px. Tamanhos maiores são contextuais, sem escala de display global.

Existem metadados de 8–11px no código. Registram a densidade atual, mas não formam uma recomendação para novas superfícies. Em telas até 700px, campos de formulário e preferências passam a 16px; isso não altera indiscriminadamente toda a tipografia.

## Layout

A estrutura desktop usa barra lateral fixa (255px), área de trabalho deslocada pela mesma largura e cabeçalho sticky (74px). O conteúdo central tem largura máxima de 1500px e padding (36px 42px 24px). A lateral recolhida mede 78px. Painéis usam padding de 24px; pares de colunas usam gap de 22px. A escala é prática, com intervalos frequentes de 8, 10, 12, 16, 20, 22, 24 e 28px; não há grade universal de múltiplos de oito.

- **A partir de 1700px:** padding superior de 44px; a grade principal de início usa proporção 1.7:1 e a próxima aula tem altura mínima de 300px.
- **Até 1250px:** lateral de 225px, conteúdo com padding (29px 27px 20px), grades acadêmicas e mural em duas colunas; a grade inicial usa 1.45:1.
- **Até 999px:** lateral desktop oculta, área de trabalho em largura total, cabeçalho de 65px e navegação inferior fixa com cinco itens. A altura inferior é `67px + env(safe-area-inset-bottom)`; conteúdo recebe 90px de reserva inferior.
- **Até 700px:** cabeçalho de 62px, conteúdo com padding (25px 19px 100px), blocos principais empilhados e atalhos em duas colunas. Formulários, pedidos e documentos se reorganizam; ação documental permanece visível. As notas preservam legenda de frequência dentro da linha.
- **Até 360px:** margens laterais do conteúdo de 15px e ajustes pontuais de atalhos, métricas e meses.
- **Impressão:** navegação, ações e assistência são ocultadas; área de trabalho ocupa a largura total e painéis evitam quebra interna.

## Elevation & Depth

Predominam superfícies planas, tom de fundo e borda fina. O movimento é curto: botões mudam cor em 0.18s e pressionam 1px; listas mudam fundo em 0.15s. Diálogos entram em 0.22s com deslocamento e escala, e o painel de ajuda sobe 8px. Overlay entra em 0.16s. Preferência do sistema por movimento reduzido e o modo interno reduzem animação e transição a 0.01ms e removem rolagem animada.

### Shadow Vocabulary

- **Flutuante:** `0 16px 50px -16px #20355e36`, usado em popover, diálogo e painel de assistência.
- **Acionador de assistência:** `0 6px 25px -8px #23344a44`, usado somente no botão flutuante.
- **Overlay:** `#10234477`, separando o diálogo da página; não há blur de fundo.

**The Flat Surface Rule.** Painéis de conteúdo usam fundo e borda; sombras pertencem a popovers, diálogos e assistência flutuante.

## Shapes

Cantos moderados distinguem a escala dos elementos: badge (5px), campos (7px), botões e navegação (8px), chamadas e ícones (10px), cartões (12px), painéis (14px) e diálogo (15px). A próxima aula usa 14px no desktop e 12px no celular; carteirinha usa 16px. Círculos pertencem a avatar, indicador, vazio e marco de acompanhamento. Bordas de 1px separam painéis e linhas; upload usa borda tracejada. Ícones são SVG de traço, com espessura global 1.75, geralmente entre 16 e 24px.

## Components

### Buttons

Ações compactas e explícitas. Altura mínima de 44px, gap de 8px e alinhamento central. Principal usa o par primary/surface; secundário tem superfície e borda; ghost mantém fundo transparente. Secundário e ghost recebem blue-soft ao hover; amarelo atende o destaque contextual. Pressionar desloca 1px, exceto quando desabilitado. Disabled reduz opacidade para 0.48 e usa cursor de indisponibilidade. Foco visível usa contorno de 3px e offset de 4px. Ícones isolados normalmente usam caixa de 44px; ações externas incluem seta diagonal e texto assistivo de nova aba.

### Chips

Badge informativo usa padding (4px 9px), tamanho (10.5px), peso (600) e pares de estado. É texto de estado, não botão. Filtros acionáveis são outro padrão: borda, altura mínima de 39px, padding (8px 13px), raio de 7px e `aria-pressed`; selecionado recebe blue-soft e borda `#a9bfe6`. Esses filtros não têm hover específico no código.

### Cards / Containers

Painel base: superfície, linha de 1px, raio e padding do token de painel. Listas relacionadas usam divisórias horizontais; a linha de navegação combina bloco de ícone (38px), título, descrição opcional e chevron. Hover muda o título para azul. O vazio centraliza ícone circular, título, explicação e ação opcional, com padding (45px 20px).

### Inputs / Fields

Campo de formulário tem altura mínima de 46px; textarea tem mínimo de 110px, máximo de 360px e redimensionamento vertical. Rótulo aparece fora do campo; dica e erro ficam próximos, erro em danger. Não há nova borda de erro global. Busca usa wrapper com padding (0 13px), fundo de superfície, raio de 8px, ícone e input de 12px; foco envolve o wrapper com contorno de 2px e offset de 2px. Limpar busca aparece somente quando há valor. Foco de campos comuns segue o contorno global.

### Navigation

Link principal usa altura mínima de 45px, texto de 12px e peso 500. Selecionado recebe fundo primary e texto surface; hover dos demais recebe line e tinta. Subnavegação usa linha vertical e seleção azul suave. No celular a navegação inferior combina ícone, rótulo e traço superior no item ativo. Menu móvel e diálogos mantêm botão de fechar explícito. Não inferir que todos os elementos do protótipo já atendem ao alvo de 44px.

### Contexto e acompanhamento

A próxima aula é um painel institucional azul fixo, com texto branco, informações de horário/local e ação amarela. Chamadas informativas usam azul suave e chamadas de atenção usam o par âmbar. O acompanhamento usa marcos circulares de 34px e conector de 1px: concluído em primary, atual em blue-soft com borda primary, futuro neutro. Cancelado encerra a linha em tom neutro, remove a etapa de análise e declara que não há retorno a aguardar. Resultado concluído recebe bloco verde com ação documental. Toda interpretação depende também do texto, não só da cor.

### Diálogos e estados de carregamento

Diálogo tem largura `calc(100% - 36px)`, máximo de 570px, altura máxima de 88dvh, padding de 30px e rolagem interna. No celular usa padding (27px 22px), raio de 13px e máximo de `calc(100dvh - 40px)`. Radix fornece a estrutura de overlay, título, descrição e fechamento. Carregamento usa linhas e bloco skeleton estáticos em line; vazio, erro de formulário e falha de página têm mensagens explícitas. A implementação tem preferência de texto maior e tema escuro; isto descreve recursos construídos, sem equivaler a uma auditoria completa.

## Do's and Don'ts

### Do:

- **Do** reutilizar o azul institucional para ação e seleção, o amarelo para destaque contextual e os pares semânticos para estados.
- **Do** manter texto de estado, ação e acompanhamento visíveis quando as linhas se reorganizam no celular.
- **Do** usar borda e tom para separar superfícies em repouso, reservando as sombras existentes para elementos flutuantes.
- **Do** preservar foco visível, redução de movimento e os estilos móveis de formulário nas extensões.

### Don't:

- **Don't** reduzir status a uma cor ou a um ícone sem o texto correspondente.
- **Don't** aplicar sombras a todos os cartões; os painéis existentes são planos e delimitados por borda.
- **Don't** congelar as cores claras nos novos componentes temáticos; usar as propriedades CSS existentes.
- **Don't** tratar os tamanhos minúsculos de metadados e rótulos auxiliares como escala tipográfica recomendada.

Não canonizado: tamanhos auxiliares de 8–11px e eventuais exceções ao alvo de toque permanecem limites da implementação. O registro não transforma esses valores em padrão a herdar nem altera código; a revisão independente passada cobre somente o escopo examinado.
