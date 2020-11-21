# BrasilApi Charts

Esse repositório contém os *charts* para instalar a BrasilAPI usando Helm. 

- `brasilapi` - O *chart* da BrasilAPI. Para o repositório completo, clique [aqui](https://github.com/BrasilAPI/BrasilAPI).

## Adicionando o chart
```
git clone https://github.com/BrasilAPI/BrasilAPI && cd BrasilAPI/charts
helm install brasilapi ./brasilapi
```

## Atualizando o chart

```
git pull
helm upgrade brasilapi ./brasilapi
```