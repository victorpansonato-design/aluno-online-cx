# Aluno Online · Anchieta CX

Protótipo navegável de uma experiência orientada pelo aluno, com prioridade para o celular. Desenvolvido a partir do template fornecido e de inspeção autorizada, somente em consulta, do portal do Grupo Anchieta.

## Abrir agora

**http://127.0.0.1:5173/**

Não precisa de RA ou senha. O acesso é uma demonstração com dados fictícios e estado salvo somente no navegador.

Para iniciar novamente no Windows, abra `Iniciar-Aluno-Online.cmd`. A porta 5173 precisa estar livre. Se o servidor já estiver em execução, basta abrir o endereço acima.

## Rodar pelo terminal

Requer Node.js 24 e npm.

```bash
npm ci
npm run dev
```

```bash
npm run lint
npm test
npm run build
npm run preview
```

`npm run preview` serve a compilação de produção em http://127.0.0.1:4173. O projeto não precisa de variáveis de ambiente ou backend. Para hospedar a SPA, configure o servidor para devolver index.html nas rotas locais; há uma referência Apache em public/.htaccess.

## O que explorar

- Cinco áreas principais: Início, Minha vida acadêmica, Secretaria virtual, Meu financeiro e Meus dados.
- 39 rotas de referência, além de detalhes dinâmicos de disciplinas, matriz, serviços, protocolos e avisos.
- 40 serviços do catálogo observado, com pesquisa, categorias, custos, pedido guiado, revisão e acompanhamento.
- 44 disciplinas em oito períodos da matriz consultada, com carga horária e detalhes navegáveis.
- Documentos pessoais em Meus dados; declarações emitidas pela faculdade na Secretaria virtual.
- Notas e faltas conectadas a revisão de nota, compensação e prova substitutiva.
- Cenário de dependência e adaptação com ação de inscrição externa no contexto da jornada.
- Financeiro com situação, extrato, comprovantes ilustrativos, vencimento, responsável e informes.
- Agenda, calendário, certificados, estágio, extensão, eletivas, contratos e formatura.
- Busca global com Ctrl K, guia Ana por assuntos, temas, texto maior e movimento reduzido.
- Exportação de agenda ICS, extrato CSV e documentos HTML de exemplo imprimíveis em PDF.

Use **Explorar cenários**, no topo, para testar dependência/adaptação, cobrança, estado vazio e indisponibilidade. Em Meus dados → Preferências é possível recomeçar.

## Documentação

- [Diagnóstico e estratégia de CX](docs/DIAGNOSTICO-E-ESTRATEGIA.md): evidências, decisões, pesquisa e plano de validação com alunos.
- [Planejamento e prompt mestre](docs/PLANEJAMENTO-E-PROMPT.md): briefing operacional da implementação.
- [Roteiro de demonstração](docs/ROTEIRO-DE-DEMONSTRACAO.md): caminhos para apresentar e testar.
- [Cobertura da auditoria](docs/COBERTURA.md): relação entre áreas originais e destinos propostos.
- [Limites e integração](docs/LIMITES-E-INTEGRACAO.md): o que foi observado, simulado e o que falta para produção.
- [Validação técnica](docs/VALIDACAO.md): escopo e resultados dos testes.
- [Design system](DESIGN.md): tokens e padrões da interface construída.
- [Capturas do protótipo](docs/screenshots): imagens com dados fictícios.

## Arquitetura

React 19, TypeScript, Vite, React Router, Radix Dialog, Lucide e Sonner. Inter hospedada localmente pelo pacote Fontsource. As áreas são carregadas sob demanda; estado compartilhado em `src/cx/state.tsx` e dados de referência em `src/cx/data.ts`.

O código executado fica em `src/cx` e `src/main.tsx`. Arquivos não usados do template original foram preservados localmente e ignorados na versão CX. O ZIP original não foi alterado. Nenhum código antigo de autenticação ou API do template é utilizado nesta demonstração.

## Escopo importante

Este é um frontend de demonstração. Não autentica no sistema acadêmico, não altera registros da faculdade, não realiza pagamentos, não envia arquivos e não assina contratos reais. Os links externos observados mantêm seus próprios controles de acesso. Documentos privados e links individualizados não estão no repositório.

Os preços do catálogo foram observados em 20/10/2026 e precisam de confirmação institucional antes de produção. Outros valores e estados são exemplos identificados. As hipóteses de melhoria de CX ainda precisam de teste com alunos.
