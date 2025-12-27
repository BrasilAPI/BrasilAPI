export default async function handler(req, res) {
  const { ano } = req.query;

  // Validação — ano precisa ser número com 4 dígitos
  if (!/^\d{4}$/.test(ano)) {
    return res
      .status(400)
      .json({ message: 'Ano inválido. Use um ano no formato YYYY.' });
  }

  try {
    const response = await fetch(
      `https://brasilapi.com.br/api/feriados/v1/${ano}`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ message: 'Erro ao consultar BrasilAPI' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro interno no servidor' });
  }
}
