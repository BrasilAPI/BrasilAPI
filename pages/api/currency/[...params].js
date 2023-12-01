// pages/api/currency/[...params].js
import app from '@/app';
import axios from 'axios';
import cheerio from 'cheerio';

// Função que obtém a taxa de câmbio entre duas moedas usando web scraping.
async function currencyRate(req, res) {
  const { params } = req.query; // Recebe os parâmetros da URL como um array.

  // Confirma se ambos parâmetros (moedas) foram fornecidos.
  if (params.length === 2) {
    const [baseCurrency, targetCurrency] = params; // Separa os parâmetros em duas variáveis.

    try {
      // Monta a URL do Google Finance para a requisição.
      const url = `https://www.google.com/finance/quote/${baseCurrency}-${targetCurrency}`;
      const response = await axios.get(url);

      // Verifica se a resposta contém dados
      if (!response || !response.data) {
        res.status(404).send('Dados não encontrados na resposta');
        return;
      }

      const $ = cheerio.load(response.data);

      // Seleciona e processa o texto que contém o valor da moeda.
      const divText = $('.YMlKec.fxKbKc').text();
      if (!divText) {
        res.status(404).send('Valor da moeda não encontrado na página');
        return;
      }

      const numericValue = parseFloat(
        divText.replace(/[^\d,.]/g, '').replace(',', '.')
      );

      // Verifica se o valor obtido é um número válido
      if (Number.isNaN(numericValue)) {
        res.status(500).send('Falha ao processar o valor da moeda');
        return;
      }

      res.json({ value: numericValue });
    } catch (error) {
      // Trata erros de requisição HTTP ou de scraping
      res.status(500).send(`Erro ao buscar valor da moeda: ${error.message}`);
    }
  } else {
    // Caso os parâmetros não estejam completos
    res.status(400).send('Parâmetros insuficientes');
  }
}

export default app().get(currencyRate);
