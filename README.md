# Gerador de Espelho de DANFE (SEM VALOR FISCAL)

⚠️ **Este projeto gera apenas uma representação visual (espelho) de DANFE para fins de estudo, teste ou layout.**
O documento resultante **NÃO é uma DANFE válida**, não substitui a NF-e original e **não tem qualquer validade fiscal, tributária ou legal**.

## Como usar

Abra o arquivo `index.html` diretamente no navegador (não precisa de servidor nem de instalação — é um app estático de página única). Preencha os campos manualmente ou importe dados por um dos métodos abaixo, confira o resultado no painel visual e baixe o PDF ou imprima.

## Métodos de importação de dados

| Método | Confiabilidade | Observação |
|---|---|---|
| **XML de NFe** | ✅ Exata | Lê a estrutura oficial do XML e preenche tudo automaticamente. |
| **Modelo Excel** | ✅ Exata | Padrão de arquivo próprio deste projeto — leitura determinística por planilha (recomendado para PDF/Word/Excel de origem, papel escaneado, etc). |
| **PDF / Word (.docx) / TXT** | ⚠️ Melhor esforço | Busca por padrões (regex) no texto extraído. Depende do layout do documento original e nunca é garantida. |

### Por que não é possível extrair 100% de qualquer PDF/Word?

PDFs e documentos Word não têm uma estrutura de dados padronizada (ao contrário do XML da NFe) — cada nota, boleto ou relatório pode organizar o texto de um jeito diferente. Por isso, a leitura desses formatos é feita por **busca de padrões** (CNPJ, chave de acesso de 44 dígitos, valores monetários, datas, etc.) e deve sempre ser conferida manualmente.

### Solução: modelo Excel padronizado, com uma aba por assunto

Para garantir 100% de precisão na importação — e deixar impossível confundir "onde coloco os dados da empresa" com "onde coloco os produtos" — o site oferece um **modelo Excel (.xlsx)** com uma aba dedicada a cada assunto, cada uma com título e cor próprios:

1. Clique em **"⬇ Baixar modelo Excel"** no painel esquerdo.
2. O arquivo baixado tem estas abas, nesta ordem:
   - **Instruções** — abre primeiro, explica o passo a passo e mostra a cor de cada aba.
   - **1 - Empresa (Emitente)** — somente os dados de quem emite a nota.
   - **2 - Nota Fiscal** — número, série, datas, chave de acesso, protocolo.
   - **3 - Destinatario** — somente os dados de quem vai receber.
   - **4 - Transportador** — dados do transporte e volumes, se houver.
   - **5 - Produtos** — somente os produtos/itens, uma linha por produto.
   - **6 - Duplicatas** — uma linha por parcela de pagamento, se houver.
   - **7 - Totais e Impostos** — valores totais e impostos da nota.
   - **8 - Informacoes Adicionais** — textos livres complementares.
3. Nas abas de "Campo/Valor", preencha somente a coluna B. Nas abas de tabela (Produtos/Duplicatas), apague ou substitua a linha de exemplo e acrescente quantas linhas precisar.
4. Envie o arquivo preenchido pelo campo **"Modelo Excel"** no site — os dados são lidos aba a aba, por correspondência exata de rótulo/coluna, sem heurística.

Esse é o "padrão de arquivo" que garante bons resultados quando a origem dos dados não é um XML de NFe: basta transcrever as informações do PDF/Word/planilha original para o modelo e importar.

### A importação tolera edições feitas em Excel, Google Sheets e LibreOffice

O arquivo pode ser reaberto, editado e salvo de novo em qualquer um desses programas antes de ser reenviado — a leitura não depende do nome exato das abas nem da posição das colunas:

- **Abas por apelido**: renomear "5 - Produtos" para "Itens", "Mercadorias" etc. continua funcionando.
- **Colunas de Produtos/Duplicatas por apelido e em qualquer ordem**: o cabeçalho é procurado nas primeiras 30 linhas da aba, e cada coluna é reconhecida pelo nome (`Cod`, `Qtd`, `Vl. Unitário`, `VUNCOM`...), não pela posição.
- **Linhas extras**: inserir uma linha antes do cabeçalho de uma aba não quebra a leitura.
- **Números em formato brasileiro ou como número real do Excel**: `1.234,56`, `R$ 1.234,56` e o número `1234.56` digitado direto na célula são todos entendidos corretamente.
- **Duas camadas de leitura**: o arquivo é aberto primeiro com a biblioteca que gera o modelo (ExcelJS); se isso falhar por qualquer motivo, uma segunda biblioteca de leitura (SheetJS) é tentada automaticamente antes de reportar qualquer problema — isso cobre incompatibilidades pontuais entre a forma como cada programa (Excel, Google Sheets, LibreOffice) grava o arquivo `.xlsx`.
- **Erros nunca são genéricos**: um arquivo que não é um `.xlsx` de verdade, um `.xls` antigo, um `.xlsx` realmente corrompido e uma planilha válida sem campos reconhecidos geram mensagens diferentes e específicas — o erro técnico real (quando houver) sempre aparece no console do navegador (F12), nunca é escondido atrás de um "arquivo corrompido" genérico.
- **Produtos/duplicatas já digitados na tela são preservados por padrão**: se você importar uma planilha depois de já ter preenchido produtos ou duplicatas manualmente, o site pergunta antes de substituir os seus dados pelos da planilha.

### Nada bloqueia a geração do espelho

Nenhum campo é obrigatório em lugar nenhum do site. Você pode baixar o PDF ou imprimir a qualquer momento — em branco, parcialmente preenchido ou com uma importação incompleta. Se a planilha, o XML ou o PDF/Word enviado não trouxer todas as informações, o site nunca bloqueia nada: ele só mostra um aviso listando quais campos não vieram (e por isso aparecerão em branco no espelho), deixando você decidir se completa manualmente ou segue em frente assim mesmo.

## Estrutura do projeto

```
index.html   # aplicação completa (HTML + CSS + JS), sem dependências de build
README.md
```

Bibliotecas usadas (via CDN, carregadas no `<head>`):
- [JsBarcode](https://github.com/lindell/JsBarcode) — geração do código de barras da chave de acesso.
- [html2canvas](https://github.com/niklasvh/html2canvas) + [jsPDF](https://github.com/parallax/jsPDF) — exportação do espelho para PDF.
- [JSZip](https://github.com/Stuk/jszip) — leitura de `.docx` (extração de texto do `word/document.xml`).
- [pdf.js](https://mozilla.github.io/pdf.js/) — extração de texto de arquivos `.pdf`.
- [ExcelJS](https://github.com/exceljs/exceljs) — geração (com estilo/cores por aba) e primeira tentativa de leitura do modelo Excel.
- [SheetJS (xlsx)](https://sheetjs.com/) — segunda tentativa de leitura (fallback), usada só se o ExcelJS não conseguir abrir o arquivo enviado.

## Publicando (opcional)

Por ser um único arquivo estático, pode ser hospedado em qualquer serviço de páginas estáticas (GitHub Pages, Netlify, Vercel etc.) sem configuração adicional — basta publicar `index.html`.
