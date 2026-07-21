# Backend de e-mail (Google Apps Script) — gratuito, sem servidor

Este backend recebe o PDF da ficha (gerado em `ficha-cnpj.html`) e envia por
e-mail usando a sua própria conta Gmail, via `MailApp`. Não tem custo, não
exige cartão de crédito nem plano pago — só uma conta Google.

Limite: **100 e-mails/dia** numa conta Gmail comum (1.500/dia em contas
Google Workspace). Mais que suficiente para uso interno de baixo volume.

## Passo a passo

1. Acesse **https://script.google.com/** e clique em **Novo projeto**.
2. Apague o conteúdo padrão do arquivo `Código.gs` e cole o conteúdo de
   [`Code.gs`](./Code.gs) deste repositório.
3. No topo do script, troque o valor de `TOKEN_SECRETO` por uma string
   aleatória só sua (ex: gere uma em https://www.uuidgenerator.net/). Isso
   evita que alguém que descubra a URL do Web App consiga mandar e-mail
   pela sua conta.
4. Salve o projeto (ícone de disquete). Dê um nome, ex: `Ficha CNPJ - Envio de E-mail`.
5. Clique em **Implantar → Nova implantação**.
   - Tipo: **App da Web** (Web app).
   - Descrição: à vontade.
   - Executar como: **Eu** (sua conta).
   - Quem pode acessar: **Qualquer pessoa**.
6. Clique em **Implantar**. Na primeira vez, o Google vai pedir para você
   **autorizar** o script a enviar e-mail em seu nome — é normal, aceite
   (é o próprio Google avisando que o script agirá como você).
7. Copie a **URL do app da Web** (termina em `/exec`).
8. Abra `ficha-cnpj.html` no navegador, vá em **Configuração do envio** e
   cole:
   - **URL do Web App**: a URL copiada no passo 7.
   - **Token compartilhado**: o mesmo valor que você colocou em `TOKEN_SECRETO`.

Pronto — o botão **"✉ Enviar por e-mail"** na página já vai funcionar.

## Atualizando o script depois de editado

Sempre que alterar `Code.gs` no editor do Apps Script, é preciso publicar de
novo: **Implantar → Gerenciar implantações → ✏ (editar) → Nova versão → Implantar**.
Só salvar o arquivo não atualiza a versão publicada.

## Por que `text/plain` no envio (não `application/json`)?

O Google Apps Script Web App não responde de forma confiável a requisições
de "preflight" CORS (`OPTIONS`). Por isso `ficha-cnpj.html` envia o payload
como `Content-Type: text/plain`, o que evita o preflight — o `doPost` do
`Code.gs` mesmo assim faz `JSON.parse(e.postData.contents)` normalmente.

## Segurança

- O token evita uso indevido por quem descobrir a URL, mas a URL de um Web
  App do Apps Script com acesso "Qualquer pessoa" ainda é pública — não a
  divulgue fora do time.
- Se quiser revogar o acesso a qualquer momento, vá em **Implantar → Gerenciar
  implantações** e arquive a implantação.
