# Aluno Online · clone e experiência conectada

Revisão 4: o clone aprovado do Aluno Online foi reorganizado para **simplificar a rotina do aluno**, mantendo a identidade, os conteúdos e os fluxos reconstruídos do portal real. A barra reúne seis destinos; cada área apresenta os assuntos relacionados e os próximos passos.

## Abrir

**http://127.0.0.1:5173/**

Sem RA ou senha. A visão **Conectada** abre por padrão. Use as opções do perfil ou o rodapé da página para comparar **Original/Conectada** com o clone. A escolha fica salva no navegador. Em **Preferências e cenários**, explore DP/adaptação e outras situações fictícias.

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
- **Meus dados:** perfil, documentos, carteirinha e certificados. No rodapé da barra ficam curso, período, semestre e ajuda.

O caminho **Conferir e pagar → Continuar para Pix → Simular confirmação** mantém a mesma cobrança selecionada e atualiza somente os itens relacionados. A mensalidade de R$ 890,00, o QR e o código são exemplos, sem validade de pagamento. Serviços continuam com os valores de referência do catálogo.

O calendário usa o esboço enviado e eventos ilustrativos identificados; o endereço de referência pediu autenticação Microsoft na consulta. Não há integração com essa agenda. As horas de extensão (40/240h) também são exemplo. Links institucionais externos preservam o direcionamento observado quando não contêm identificação privada.

## Documentação

- [Reanálise e clonagem](docs/REANALISE-E-CLONAGEM.md)
- [Planejamento e prompt mestre](docs/PLANEJAMENTO-E-PROMPT.md)
- [Cobertura](docs/COBERTURA.md)
- [Limites e integração](docs/LIMITES-E-INTEGRACAO.md)
- [Roteiro de demonstração](docs/ROTEIRO-DE-DEMONSTRACAO.md)
- [Mapa da simplificação](docs/SIMPLIFICACAO-CX.md)
- [Validação técnica](docs/VALIDACAO.md)
- [Pesquisa e estratégia de CX](docs/DIAGNOSTICO-E-ESTRATEGIA.md)
- [Sistema visual](DESIGN.md)
- [Capturas atuais](docs/screenshots/v4)

## Arquitetura

Entrada em src/main.tsx; aplicação ativa em src/replica. original.css contém os estilos públicos observados, com fontes locais. reference.json indexa os documentos sanitizados em screens/, carregados sob demanda. student/ contém os hubs, a home, o calendário e o fluxo Pix da revisão 3, carregados em chunk próprio. App.tsx implementa navegação e comportamentos; Dialogs.tsx contém as interações e etapas locais. Estado e catálogo compartilhados em src/cx/state.tsx e data.ts. As telas anteriores em src/cx são históricas e não são a entrada da aplicação.

Nenhum JavaScript executável, autenticação, cookies, credenciais ou documentos privados do portal foram incorporados. HTML de referência é sanitizado e interações são implementadas localmente. Capturas privadas e ferramentas de coleta ficam fora do Git.

Este frontend não envia pedidos à instituição, não faz pagamentos ou uploads e não assina contratos reais. Anexos guardam somente nome/status. Documentos gerados não têm validade. A inspeção representa a conta e os estados visíveis em 20/10/2026; regras do backend e situações de outros cursos exigem integração e validação institucional.

## Refinamento visual solicitado

Ana volta como esfera flutuante no canto inferior direito, sem faixa fixa ou cartão acoplado. A navegação conserva os seis grupos com o desenho compacto de origem: itens de 36px, fonte de 14px, ícones de 20px, recuos, seleção azul/amarela e gaveta de 18rem. A comparação de modos fica nas opções da conta e no rodapé, sem aumentar a barra.

A próxima aula mantém degradê claro/azul e ilustração em cor. Próximo pagamento fica branco, com valor verde. Horas complementares mostram percentual, cumpridas/exigidas/restantes e barra verde/vermelha; extensão usa verde forte, com meta ilustrativa identificada. A verificação das medidas está em docs/student-geometry-report-v4.json; o histórico visual v3 permanece disponível.
