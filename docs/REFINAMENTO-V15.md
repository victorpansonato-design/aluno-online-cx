# Atestado de matrícula na home — V15

23/10/2026.

O atestado ganhou um cartão próprio na home, depois dos atalhos no desktop. Em tablet e celular, aparece logo após aula e pagamento, antes dos avisos. A posição reúne documentos e serviços na página inicial e evita ampliar a navegação lateral.

O primeiro clique em “Baixar PDF” abre uma conferência com aluno, RA, curso e semestre. O segundo gera o arquivo PDF A4. A janela mantém o aluno na home, oferece tentativa novamente se houver erro e devolve o foco ao botão de origem ao fechar. Consultar ou baixar não cria solicitações repetidas.

O serviço CSA_150 no catálogo e os pedidos concluídos desse serviço compartilham a conferência e o PDF na navegação conectada. A navegação Original continua preservada. A biblioteca pdf-lib carrega somente ao solicitar o download.

Este repositório não possui API de emissão institucional. O arquivo baixado identifica-se como prévia sem validade acadêmica; substituir a geração local pela resposta oficial da instituição é necessário para emitir atestados reais. O arquivo contém apenas os dados do perfil de exemplo do portal.

Validação: 61 testes em seis arquivos, lint e build aprovados. Fluxo de dois cliques exercitado no navegador em 1440, 768, 390 e 320 px, com quatro PDFs baixados e abertos para conferência. Janela também conferida em 320 × 568 e no tema escuro, incluindo erro de download e retorno do foco. PDF renderizado e inspecionado, sem cortes no conteúdo. O aviso já existente de tamanho do bundle principal permanece; a biblioteca de PDF está em um chunk separado.
