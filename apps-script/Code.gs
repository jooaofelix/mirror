/**
 * Backend gratuito (Google Apps Script) para o envio por e-mail da
 * "Ficha de Cadastro de Empresa" gerada em ficha-cnpj.html.
 *
 * Não usa nenhum servidor próprio nem serviço pago: roda vinculado à sua
 * conta Google e envia e-mail pela sua própria caixa Gmail (MailApp),
 * com o PDF da ficha anexado.
 *
 * Instruções de deploy: ver apps-script/README.md
 */

// Defina aqui um token secreto (qualquer string aleatória sua). O mesmo valor
// deve ser colado no campo "Token compartilhado" em ficha-cnpj.html.
// Isso evita que alguém que descubra a URL do Web App envie e-mails pela sua conta.
var TOKEN_SECRETO = 'TROQUE_ESTE_VALOR_POR_UM_TOKEN_SECRETO';

function doPost(e) {
  var resposta = { ok: false };
  try {
    var dados = JSON.parse(e.postData.contents);

    if (!TOKEN_SECRETO || dados.token !== TOKEN_SECRETO) {
      throw new Error('Token inválido.');
    }
    if (!dados.to) {
      throw new Error('Destinatário (to) não informado.');
    }
    if (!dados.pdfBase64) {
      throw new Error('PDF (pdfBase64) não informado.');
    }

    var restante = MailApp.getRemainingDailyQuota();
    if (restante <= 0) {
      throw new Error('Cota diária de e-mails do Gmail esgotada. Tente novamente amanhã.');
    }

    var blobPdf = Utilities.newBlob(
      Utilities.base64Decode(dados.pdfBase64),
      'application/pdf',
      dados.fileName || 'ficha-cadastro.pdf'
    );

    MailApp.sendEmail({
      to: dados.to,
      subject: dados.subject || 'Ficha de Cadastro de Empresa',
      body: dados.message || '',
      attachments: [blobPdf],
      name: 'Ficha de Cadastro'
    });

    resposta.ok = true;
  } catch (err) {
    resposta.ok = false;
    resposta.error = err.message;
  }

  return ContentService
    .createTextOutput(JSON.stringify(resposta))
    .setMimeType(ContentService.MimeType.JSON);
}

// Health check simples: abrir a URL do Web App no navegador (GET) deve
// mostrar esta mensagem, confirmando que o deploy está no ar.
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, info: 'Backend de envio da Ficha de Cadastro de Empresa está no ar.' }))
    .setMimeType(ContentService.MimeType.JSON);
}
