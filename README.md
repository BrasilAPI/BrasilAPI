# Brasil API
Vamos transformar o Brasil em uma API?

## CEP
Busca por CEP com múltiplos providers de fallback.

### Endpoint
**GET** `https://brasilapi.com.br/api/cep/`**[cep]**

#### Consulta com sucesso

```json
// GET https://brasilapi.com.br/api/cep/05010000

{
  "cep": "05010000",
  "state": "SP",
  "city": "São Paulo",
  "neighborhood": "Perdizes",
  "street": "Rua Caiubi"
}
```

#### Consulta com erro

```json
// GET https://brasilapi.com.br/api/cep/00000000

{
  "name": "CepPromiseError",
  "message": "Todos os serviços de CEP retornaram erro.",
  "type": "service_error",
  "errors": [
    {
      "name": "ServiceError",
      "message": "CEP INVÁLIDO",
      "service": "correios"
    },
    {
      "name": "ServiceError",
      "message": "CEP não encontrado na base do ViaCEP.",
      "service": "viacep"
    }
  ]
}
```

## Autores

| [<img src="https://avatars3.githubusercontent.com/u/4248081?s=460&v=4" width=115><br><sub>@filipedeschamps</sub>](https://github.com/filipedeschamps) | [<img src="https://avatars3.githubusercontent.com/u/8251208?s=400&v=4" width=115><br><sub>@lucianopf</sub>](https://github.com/lucianopf) |
| :---: | :---: |
