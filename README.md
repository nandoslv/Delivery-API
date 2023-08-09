# Delivery-API
Uma API simples para manter pedidos de um delivery. Desenvolvida em NodeJS com Express, Cors, Winston. Os dados são manitdos em um arquivo JSON estático, que simula a utilização de um banco de dados.
Stack: 
- Node
- Express
- Winston
- Cors

## Endpoints
- [GET] /pedidos: Consulta todos os pedidos.
- [GET] /pedidos/:id: Consulta pedido específico.
- [POST] /pedidos: Cria de novo pedido.
- [PUT] /pedidos: Atualiza de pedido.
- [PATCH] /pedidos: Atualiza status de pedido.
- [DELETE] /pedidos/:id: Apaga pedido.
- [POST] /pedidos/totalPorCliente: Retorna valor total de pedidos por Cliente.
- [POST] /pedidos/totalPorProdutos: Retorna valor toral de pedidos por Produto.
- [GET] /maisVendidos: Retorna lista de produtos com quantidade de vendas ordenada de forma decrescente.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
nodemon index.js
```
