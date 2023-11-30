import axios from "axios";

/**
 * Get all Brazilian holidays by city
 * @returns {Array}
 */
export async function getHolidaysByCity(state, city) {
    const currentYear = new Date().getFullYear()
    let url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/municipal/json/${currentYear}.json`
    const result = await axios({
        url,
        method: 'get',
        responseEncoding: 'utf-8',
    });

    let stateData = []
    result.data.forEach(element => {
        if (element.uf.toLowerCase().trim() == state.trim().toLowerCase() && 
            element.municipio.toLowerCase().trim().replace(/\s+/g, "") == city.trim().toLowerCase()) {
            stateData.push(element)
        }
    });
    return stateData
}

/**
 * Get all Brazilian holidays by state
 * @returns {Array}
 */
export async function getHolidaysByState(state) {
    const currentYear = new Date().getFullYear()
    let url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/estadual/json/${currentYear}.json`
    const result = await axios({
        url,
        method: 'get',
        responseEncoding: 'utf-8',
    });

    let stateData = []
    result.data.forEach(element => {
        if (element.uf.toLowerCase().trim() == state.trim().toLowerCase()) {
            stateData.push(element)
        }
    });

    return stateData
}

/**
 * Get all Brazilian national holidays
 * @returns {Array}
 */
export async function getNationalHolidays() {
    const currentYear = new Date().getFullYear()
    let url = `https://raw.githubusercontent.com/joaopbini/feriados-brasil/master/dados/feriados/nacional/json/${currentYear}.json`
    const result = await axios({
        url,
        method: 'get',
        responseEncoding: 'utf-8',
    });

    return result.data
}