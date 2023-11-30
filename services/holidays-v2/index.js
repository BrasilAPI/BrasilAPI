import NotFoundError from '@/errors/NotFoundError';
const { JSDOM } = require('jsdom');

export default async function getHolidays(city, uf, year) {
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    if (uf != "") {
        let urlUF = 'https://servicodados.ibge.gov.br/api/v1/localidades/estados';
        const responseUF = await fetch(urlUF);
        const htmlUF = await responseUF.text();
        const objetoUF = JSON.parse(htmlUF);

        var achou = false;

        objetoUF.forEach((item) => {
            if (item["sigla"] == uf.toUpperCase()) {
                achou = true;
            }
        });

        if (!achou) {
            throw new NotFoundError({
                name: 'NotFoundError',
                message: `Sigla não corresponde a nenhum estado existente.`,
                type: 'uf_range_error',
            });
        } 

        if (city != "") {
            const urlCity = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf.replaceAll(" ", "_")}/municipios`;
            const responseCity = await fetch(urlCity);
            const htmlCity = await responseCity.text();

            const objetoCity = JSON.parse(htmlCity);

            achou = false;

            objetoCity.forEach((item) => {
                if (item["nome"].toUpperCase() == city.toUpperCase()) {
                    achou = true;
                }
            });

            if (!achou) {
                throw new NotFoundError({
                    name: 'NotFoundError',
                    message: `Cidade não existente ou não correspondete ao estado informado.`,
                    type: 'feriados_error',
                });
            }

        }
    }

    if (year <= 2000 || year > (currentYear + 7)) {
        throw new NotFoundError({
            name: 'NotFoundError',
            message: `Ano fora do intervalo suportado entre 2000 e ${currentYear + 7}.`,
            type: 'feriados_error',
        });
    }

    const url = `https://www.feriados.com.br/feriados-${city.replaceAll(" ", "_")}-${uf.replaceAll(" ", "_")}.php?ano=${year}`;
    const response = await fetch(url);
    const html = await response.text();

    const dom = new JSDOM(html);

    const holidayArrays = Array.from(dom.window.document.querySelectorAll("ul.multi-column > li")).map(item => {

        var holidayItem = item.querySelector("div");  
        var type = holidayItem.getAttribute("title").replace("<b>", "").replace("</b>", "").trim();

        if ( (uf == "" && type == "Feriado Nacional") || (uf != "" && city == "" && (type == "Feriado Nacional" || type == "Feriado Estadual")) || (uf != "" && city != "") ) {
            const [day, month, year] = item.textContent.trim().split(" - ")[0].trim().split("/");
            const formattedData = `${year}-${month}-${day}`;
            const name = item.textContent.split(" - ")[1].trim();

            return {"date": formattedData, "name": name, "type": type};
        }
    })

    var arrayVerificado = [];

    holidayArrays.forEach((item) => {
        if (item != null) {
            arrayVerificado.push(item);
        }
    });


    return arrayVerificado;
}