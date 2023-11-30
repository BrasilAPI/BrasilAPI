// pages/api/currency/[...params].js
import app from '@/app';
import axios from 'axios';
import cheerio from 'cheerio';

// Função que obtém a taxa de câmbio entre duas moedas usando web scraping.
async function currencyRate(req, res) {
  const params = req.query.params; // Recebe os parâmetros da URL como um array.

  if (params.length === 2) { // Confirma se ambos parâmetros (moedas) foram fornecidos.
    const [baseCurrency, targetCurrency] = params; // Separa os parâmetros em duas variáveis.

    try {
      // Monta a URL do Google Finance para a requisição.
      const url = `https://www.google.com/finance/quote/${baseCurrency}-${targetCurrency}`;
      const response = await axios.get(url); 
      const $ = cheerio.load(response.data); 
      
      // Seleciona e processa o texto que contém o valor da moeda.
      const divText = $('.YMlKec.fxKbKc').text();
      const numericValue = parseFloat(divText.replace(/[^\d,\.]/g, '').replace(',', '.'));
      
      res.json({ value: numericValue }); 
    } catch (error) {
      res.status(500).send('Erro ao buscar valor da moeda'); 
    }
  } else {
    res.status(400).send('Parâmetros insuficientes'); 
  }
}

export default app().get(currencyRate); 
