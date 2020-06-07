import xml2js from 'xml2js';
import axios from 'axios';

class SOAPRequestService {
  constructor() {
    this.parser = new xml2js.Parser();
  }

  async makeRequest(url, method, obj) {
    const data = this._mountSearchParams(obj);
    const options = {
      url,
      method,
      data,
    };

    const response = await axios(options)
      .then((res) => this._parseResponse(res.data))
      .then((res) => res)
      .catch((err) => err);

    return response;
  }

  async _parseResponse(xml) {
    let response;

    await this.parser.parseString(xml, (err, result) => {
      if (err) return err;

      response = JSON.stringify(result);

      return response;
    });

    response = JSON.parse(response);
    response = this._replaceBrackets(
      JSON.stringify(response.cResultado.Servicos[0].cServico[0])
    );

    return JSON.parse(response);
  }

  _replaceBrackets(str) {
    return str.replace(/\[|\]|/g, '');
  }

  _mountSearchParams(obj) {
    return Object.getOwnPropertyNames(obj)
      .map((key) => `${key}=${obj[key]}`)
      .join('&');
  }
}

export default SOAPRequestService;
