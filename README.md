# Aluno Online · clone e experiência conectada

Revisão 2: frontend reconstruído a partir da navegação autorizada no Aluno Online real do Grupo Anchieta. Preserva o CSS, fontes, logo, ilustrações, composição das telas e comportamento responsivo observado. A primeira proposta de layout foi substituída após a avaliação do usuário.

## Abrir

**http://127.0.0.1:5173/**

Sem RA ou senha. O modo **Original** abre primeiro. Use o botão **Original/Conectada** no topo ou as opções do perfil para comparar a reorganização. Em **Preferências e cenários**, explore DP/adaptação e outras situações fictícias.

No Windows, execute **Iniciar-Aluno-Online.cmd** para iniciar novamente. Com Node.js 24 e npm:

```bash
npm ci
npm run dev
```

Validação: npm run typecheck, npm run lint, npm test e npm run build. O preview de produção usa a porta 4173. Sem backend ou variáveis de ambiente; hospedagens precisam devolver index.html para rotas da SPA.

## O que foi reconstruído

- 109 destinos de página capturados, incluindo os 89 avisos e as áreas internas acessíveis à conta de teste.
- 40 formulários próprios de serviço, com instruções, prazos, campos e opções observadas; catálogo pesquisável e conclusão local.
- Oito períodos da jornada, seis dias da agenda semanal e sete estados de detalhe do calendário mensal.
- Perfil, documentos, notas/faltas, horas, certificados, formatura, financeiro, contratos, estágio/TCC/PI, avaliações, mural, compensação, dispensa e laboratórios.
- Painéis de notas e detalhes, busca por Ctrl K, menu móvel, tema claro/escuro, carrosséis, preferências e guia Ana local.
- Pedidos fictícios com protocolo, acompanhamento, cancelamento e pagamento simulado ligado ao financeiro.

Na visão Conectada, Secretaria virtual reúne serviços e acompanhamento; documentos pessoais ficam em Meus dados; home, notas, faltas, jornada, financeiro e solicitações oferecem próximos passos relacionados. Links institucionais externos preservam o direcionamento observado quando não contêm identificação privada.

## Documentação

- [Reanálise e clonagem](docs/REANALISE-E-CLONAGEM.md)
- [Planejamento e prompt mestre](docs/PLANEJAMENTO-E-PROMPT.md)
- [Cobertura](docs/COBERTURA.md)
- [Limites e integração](docs/LIMITES-E-INTEGRACAO.md)
- [Roteiro de demonstração](docs/ROTEIRO-DE-DEMONSTRACAO.md)
- [Validação técnica](docs/VALIDACAO.md)
- [Pesquisa e estratégia de CX](docs/DIAGNOSTICO-E-ESTRATEGIA.md)
- [Sistema visual](DESIGN.md)
- [Capturas atuais](docs/screenshots/v2)

## Arquitetura

Entrada em src/main.tsx; aplicação ativa em src/replica. original.css contém os estilos públicos observados, com fontes locais. reference.json indexa os documentos sanitizados em screens/, carregados sob demanda. App.tsx implementa navegação e comportamentos; Dialogs.tsx contém as interações e etapas locais. Estado e catálogo compartilhados em src/cx/state.tsx e data.ts. As telas anteriores em src/cx são históricas e não são a entrada da aplicação.

Nenhum JavaScript executável, autenticação, cookies, credenciais ou documentos privados do portal foram incorporados. HTML de referência é sanitizado e interações são implementadas localmente. Capturas privadas e ferramentas de coleta ficam fora do Git.

Este frontend não envia pedidos à instituição, não faz pagamentos ou uploads e não assina contratos reais. Anexos guardam somente nome/status. Documentos gerados não têm validade. A inspeção representa a conta e os estados visíveis em 20/10/2026; regras do backend e situações de outros cursos exigem integração e validação institucional.
