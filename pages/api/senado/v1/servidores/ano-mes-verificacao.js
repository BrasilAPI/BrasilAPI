
function isYearValid(year){
    const currentYear = new Date().getFullYear();
    const yearN = parseInt(year, 10);   

    return !isNaN(yearN) && year <= currentYear && yearN >= 2012;
}

function isMonthValid(month){
  const currentMonth = new Date().getMonth();
  month = parseInt(month, 10); 

  return !isNaN(month) || month < currentMonth || month >= 1;
}


export function verificarAnoMes(ano, mes) {
    if(!ano || !mes)
          throw new BadRequestError({message: 'Ano e mês obrigatórios'});
        
    if(!isYearValid(ano) || !isMonthValid(mes) || (mes < 8 && ano === 2012))
        throw new BadRequestError({message: 'Ano e/ou mês inválido(s)'})
        
} 