# Aluno Online · clone e experiência conectada

Revisão 8: o clone aprovado do Aluno Online foi refinado para **simplificar a rotina do aluno**, mantendo a identidade, os conteúdos e os fluxos reconstruídos do portal real. A barra conserva seis destinos e suas medidas compactas; a home aproxima aula, pagamento, horas, pendências e agenda. Esta entrega reúne os refinamentos locais V5–V8 em um commit autorizado pelo usuário. O ambiente de teste continua disponível no localhost.

Detalhes da entrega mais recente: [home e responsáveis financeiros — V8](docs/REFINAMENTO-V8.md).

## Abrir

[Abrir teste local](http://127.0.0.1:5173/)

Sem RA ou senha. A visão **Conectada** abre por padrão. Use as opções do perfil para comparar **Original/Conectada** com o clone. A escolha fica salva no navegador. Em **Preferências**, explore DP/adaptação e outras situações fictícias.

No Windows, execute **Iniciar-Aluno-Online.cmd** para iniciar novamente. Com Node.js 24 e npm:

```bash
npm ci
npm run dev
```

Validação: npm run typecheck, npm run lint, npm test e npm run build. O preview de produção usa a porta 4173. Sem backend ou variáveis de ambiente; hospedagens precisam devolver index.html para rotas da SPA.

## Deploy na Vercel

O arquivo `vercel.json` na raiz configura Vite, o comando `npm run build` e a pasta de saída **`build`**, igual à definida em `vite.config.ts`. Também encaminha rotas como `/inicio` e `/financeiro` para `index.html`, permitindo acesso direto e atualização da página.

Importe a raiz deste repositório e use a branch `main`. Não é necessário configurar variáveis de ambiente. Ao atualizar um projeto existente, publique o commit que contém `vercel.json`; refazer o deploy de um commit anterior não inclui a correção. O erro “No Output Directory named dist” ocorre quando a hospedagem procura `dist`, embora este projeto gere `build`.

Referência: [Vite e rotas SPA na Vercel](https://vercel.com/docs/frameworks/frontend/vite#using-vite-to-make-spas).

## O que foi reconstruído

- 109 destinos de página capturados, incluindo os 89 avisos e as áreas internas acessíveis à conta de teste.
- 40 formulários próprios de serviço, com instruções, prazos, campos e opções observadas; catálogo pesquisável e conclusão local.
- Oito períodos da jornada, seis dias da agenda semanal e sete estados de detalhe do calendário mensal.
- Perfil, documentos, notas/faltas, horas, certificados, formatura, financeiro, contratos, estágio/TCC/PI, avaliações, mural, compensação, dispensa e laboratórios.
- Painéis de notas e detalhes, busca por Ctrl K, menu móvel, tema claro/escuro, carrosséis, preferências e guia Ana local.
- Pedidos fictícios com protocolo, acompanhamento, cancelamento e pagamento simulado ligado ao financeiro.

## O que mudou na simplificação

- **Início:** próxima aula, pendências, próximo pagamento, calendário, horas e jornada. Avisos ocupam um espaço compacto.
- **Meus estudos:** horários, notas/faltas, jornada, atividades/horas, estágio/TCC/PI, avaliações e recursos de estudo.
- **Secretaria virtual:** serviços, pedidos, contratos, formatura, compensação, aproveitamento e laboratórios. Documentos pessoais continuam em Meus dados.
- **Financeiro:** cobranças e pagamentos, extrato/bolsas, vencimento, responsável e comprovantes.
- **Calendário:** mês, busca, assuntos, dia, favoritos e ações ligadas ao evento.
- **Meus dados:** perfil, documentos, carteirinha e certificados. A carteirinha visual fica na base da barra; curso, período e semestre aparecem na home.

O caminho **Conferir e pagar → Continuar para Pix → Já realizei o pagamento → Pagamento informado** mantém a mesma cobrança selecionada e atualiza somente os itens relacionados no estado local. “Pagamento informado” registra a ação do usuário; não representa confirmação bancária. A mensalidade de R$ 890,00, o QR e o código são exemplos, sem validade de pagamento. Serviços continuam com os valores de referência do catálogo.

O calendário usa o esboço enviado e eventos ilustrativos; o endereço de referência pediu autenticação Microsoft na consulta. Não há integração com essa agenda. As horas de extensão (40/240h) também são exemplo. A pedido do usuário, avisos repetidos de demonstração foram retirados da interface; os limites continuam nesta documentação e nos arquivos exportados. Links institucionais externos preservam o direcionamento observado quando não contêm identificação privada.

## Documentação

- [Financeiro, jornada e movimento V7](docs/REFINAMENTO-V7.md)

- [Ajustes de navegação e hierarquia V6](docs/REFINAMENTO-V6.md)

- [Reanálise e clonagem](docs/REANALISE-E-CLONAGEM.md)
- [Planejamento e prompt mestre](docs/PLANEJAMENTO-E-PROMPT.md)
- [Cobertura](docs/COBERTURA.md)
- [Limites e integração](docs/LIMITES-E-INTEGRACAO.md)
- [Roteiro de demonstração](docs/ROTEIRO-DE-DEMONSTRACAO.md)
- [Mapa da simplificação](docs/SIMPLIFICACAO-CX.md)
- [Validação técnica](docs/VALIDACAO.md)
- [Pesquisa e estratégia de CX](docs/DIAGNOSTICO-E-ESTRATEGIA.md)
- [Sistema visual](DESIGN.md)
- [Direção, estudo e referências da revisão 5](docs/REFINAMENTO-V5.md)
- [Validação V5](docs/VALIDACAO-V5.md), [revisão independente](docs/REVISAO-INDEPENDENTE-V5.md) e [roteiro de apresentação](docs/ROTEIRO-V5.md)
- [Handoff documental da revisão 5](docs/DOCUMENTACAO-V5.md)
- [Contrato da superfície](docs/SURFACE.md) e [critérios de qualidade](docs/QUALITY-BAR.md)
- [Proveniência de ativos](docs/ASSETS.md) e [mídia da revisão 5](docs/media-provenance-v5.json)
- [Capturas atuais](docs/screenshots/v5)

## Arquitetura

Entrada em src/main.tsx; aplicação ativa em src/replica. original.css contém os estilos públicos observados, com fontes locais. reference.json indexa os documentos sanitizados em screens/, carregados sob demanda. student/ contém os hubs, a home, o calendário e o fluxo Pix, carregados em chunk próprio; Experience.tsx e refinements.css concentram os padrões da revisão 5. App.tsx implementa navegação e comportamentos; Dialogs.tsx contém as interações e etapas locais. Estado e catálogo compartilhados em src/cx/state.tsx e data.ts. As telas anteriores em src/cx são históricas e não são a entrada da aplicação.

Nenhum JavaScript executável, autenticação, cookies, credenciais ou documentos privados do portal foram incorporados. HTML de referência é sanitizado e interações são implementadas localmente. Capturas privadas e ferramentas de coleta ficam fora do Git.

Este frontend não envia pedidos à instituição, não faz pagamentos ou uploads e não assina contratos reais. Anexos guardam somente nome/status. Documentos gerados não têm validade. A inspeção representa a conta e os estados visíveis em 20/10/2026; regras do backend e situações de outros cursos exigem integração e validação institucional.

## Refinamento visual da revisão 5

Ana volta como esfera flutuante no canto inferior direito, sem faixa fixa ou cartão acoplado. A navegação conserva os seis grupos com o desenho compacto de origem: itens de 36px, fonte de 14px, ícones de 20px, recuos, seleção azul/amarela e gaveta de 18rem. A comparação de modos fica nas opções da conta e no rodapé, sem aumentar a barra.

A próxima aula mantém degradê claro/azul e ilustração em cor. O pagamento branco ficou compacto, com valor verde; os dois módulos de horas ficam lado a lado: 26/160h (16%) em complementares, com barra verde/vermelha, e 40/240h (17%) em extensão, com verde forte. Pendências têm contexto e ação; a agenda segue ordem cronológica; notas e faltas usam barras com números e escala, sem inventar uma série histórica. A jornada tem oito segmentos e o segundo atual; no cenário DP, o primeiro indica pendência e leva à regularização.

Secretaria combina busca e grupos Documentos/Vida acadêmica/Atendimento, oito atalhos e acesso ao catálogo completo de 40 serviços. Ajuda reúne busca, filtros, oito perguntas, ação contextual e roteiro inicial. O rodapé lateral ganhou cartão azul da carteirinha, curso e ajuda. Estudos e Atividades usam dois clipes Mixkit com pôster e pausa: MP4 apenas em condições elegíveis a partir de 1024px; telas menores mantêm imagem sem baixar o vídeo. As origens são Full HD, e os clipes entregues são 1280×720, sem áudio.

Foram registrados 38 testes aprovados, build aprovado com warning preexistente de chunk acima de 500KB, 36 combinações de páginas/larguras, 122 rotas e 40 formulários abertos. As 12 auditorias axe da matriz e três dos percursos retornaram zero violações, com verificações incompletas que exigem avaliação humana. A revisão independente examinou 12 capturas obrigatórias e dez estados extras e retornou `ship`, com rechecagem posterior dos textos de ambos os modos e estados vazios. Isso não comprova conformidade WCAG integral, fluidez em todos os celulares ou melhoria de CX sem teste com alunos. Veja o [escopo de validação](docs/VALIDACAO-V5.md) e a [revisão independente](docs/REVISAO-INDEPENDENTE-V5.md).
