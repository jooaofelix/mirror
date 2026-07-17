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

### Solução: modelo Excel padronizado

Para garantir 100% de precisão na importação, o site oferece um **modelo Excel (.xlsx)** com estrutura fixa:

1. Clique em **"⬇ Baixar modelo Excel"** no painel esquerdo.
2. O arquivo baixado tem 4 abas:
   - **Dados**: coluna `Campo` (rótulo fixo, não altere) e coluna `Valor` (preencha aqui).
   - **Produtos**: uma linha por item da nota (Código, Descrição, NCM/SH, CFOP, quantidade, valores etc.).
   - **Duplicatas**: uma linha por parcela/duplicata (Número, Vencimento, Valor).
   - **Instruções**: passo a passo de preenchimento.
3. Preencha apenas os valores, sem renomear abas, cabeçalhos ou rótulos da coluna A.
4. Envie o arquivo preenchido pelo campo **"Modelo Excel"** no site — os dados são lidos linha a linha, por correspondência exata de rótulo/coluna, sem heurística.

Esse é o "padrão de arquivo" que garante bons resultados quando a origem dos dados não é um XML de NFe: basta transcrever as informações do PDF/Word/planilha original para o modelo e importar.

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
- [SheetJS (xlsx)](https://sheetjs.com/) — geração e leitura do modelo Excel padronizado.

## Publicando (opcional)

Por ser um único arquivo estático, pode ser hospedado em qualquer serviço de páginas estáticas (GitHub Pages, Netlify, Vercel etc.) sem configuração adicional — basta publicar `index.html`.
