/// <reference types="cypress" />

function makeInvalidRequest(cep, validationError) {
  cy.request({
    method: "get",
    url: `http://localhost:3000/api/v1/cep/${cep}`,
    failOnStatusCode: false
  }).should(response => {
    expect(response.status).to.eq(404);
    expect(response.body).to.deep.equal(validationError);
  });
}

context("Cep HTTP Cases", () => {
  it("Open HomePage with Success", () => {
    cy.visit("http://localhost:3000");
    cy.get("main").within(() => {
      cy.get("h1").contains("Brasil API");
      cy.get("p").contains("Vamos transformar o Brasil em uma API?");
    });
  });

  it("Get CEP with success", () => {
    const myAdress = {
      cep: "55540000",
      state: "PE",
      city: "Palmares",
      neighborhood: "",
      street: ""
    };
    cy.request(`http://localhost:3000/api/v1/cep/${myAdress.cep}`).should(
      response => {
        expect(response.status).to.eq(200);
        expect(response.body).to.deep.equal(myAdress);
      }
    );
  });

  it("Use CEP with invalid pattern and get validation error", () => {
    const validationError = {
      name: "CepPromiseError",
      message: "Todos os serviços de CEP retornaram erro.",
      type: "service_error",
      errors: [
        {
          name: "ServiceError",
          message: "CEP INVÁLIDO",
          service: "correios"
        },
        {
          name: "ServiceError",
          message: "CEP não encontrado na base do ViaCEP.",
          service: "viacep"
        }
      ]
    };
    const cep = 123;
    makeInvalidRequest(cep, validationError);

  });

  it("Use CEP with more than 8 characteres and get validation error", () => {
    const validationError = {
      name: "CepPromiseError",
      message: "CEP deve conter exatamente 8 caracteres.",
      type: "validation_error",
      errors: [
        {
          message: "CEP informado possui mais do que 8 caracteres.",
          service: "cep_validation"
        }
      ]
    };
    const cep = 11122233344;
    makeInvalidRequest(cep, validationError);
  });
});
