import app from '@/app';
import csvToJson from 'csvtojson';

async function getBairrosPorCidade(req, res) {
  try {
    // Query deve ser: '/api/ibge/bairros/São-José-dos-Campos,SP' por exemplo
    const { municipio: cidadeEstado } = req.query;

    if (!cidadeEstado.includes(',') || cidadeEstado.includes(' ')) {
      return res
        .status(400)
        .json({ mensagem: 'Formato inválido de cidade e estado.' });
    }

    const [cidadeRaw, estado] = cidadeEstado.split(',');
    const cidade = cidadeRaw.replaceAll('-', ' ');

    const csvFilePath = `${process.cwd()}/public/bairros.csv`;

    const json = await csvToJson().fromFile(csvFilePath);

    const bairrosJSON = JSON.stringify(json, null, 2);
    const bairrosList = JSON.parse(bairrosJSON);

    const bairros = [];

    bairrosList.forEach((bairro) => {
      if (
        cidade.toLowerCase() === bairro.Cidade.toLowerCase() &&
        estado.toLowerCase() === bairro.Estado.toLowerCase()
      ) {
        bairros.push(bairro.Bairro);
      }
    });

    if (bairros.length === 0) {
      return res
        .status(404)
        .json({ mensagem: 'Cidade ou estado não encontrado.' });
    }

    return res.status(200).json({ bairros });
  } catch (error) {
    return res.status(500).json({ mensagem: 'Erro ao buscar bairros.' });
  }
}

export default app().get(getBairrosPorCidade);
