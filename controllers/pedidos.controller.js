import express from "express";
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

async function getAllPedidos(req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        delete data.nextId;
        res.send(data);

        global.logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

async function createPedido(req, res, next) {
    try {
        let pedido = req.body;
        const data = JSON.parse(await readFile(global.fileName));

        if (!pedido.cliente || !pedido.produto || pedido.valor == null) {
            throw new Error("Cliente, Produto e Valor são obrigatórios.");
        }

        pedido = {
            id: data.nextId,
            cliente: pedido.cliente,
            produto: pedido.produto,
            valor: pedido.valor,
            entregue: false,
            timestamp: new Date()
        };

        data.nextId++;
        data.pedidos.push(pedido);

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(pedido);

        global.logger.info(`${req.method} ${req.baseUrl} - Account = ${JSON.stringify(pedido)}`);
    } catch (err) {
        next(err);
    }
}

async function updatePedido(req, res, next) {
    try {
        let pedido = req.body;

        if (!pedido.id || !pedido.cliente || !pedido.produto || pedido.valor == null || pedido.entregue == null) {
            throw new Error("ID, Cliente, Produto, Valor,Entregue são obrigatórios.");
        }

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.pedidos.findIndex(ac => ac.id === parseInt(pedido.id));

        if (index === -1) {
            throw new Error("Registro não encontrado!");
        }

        data.pedidos[index].cliente = pedido.cliente;
        data.pedidos[index].produto = pedido.produto;
        data.pedidos[index].valor = pedido.valor;
        data.pedidos[index].entregue = pedido.entregue;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(pedido);

        global.logger.info(`${req.method} ${req.baseUrl} - Account = ${JSON.stringify(pedido)}`);
    } catch (err) {
        next(err);
    }
}

async function updateEntregaPedido(req, res, next) {
    try {
        let pedido = req.body;

        if (!pedido.id || pedido.entregue == null) {
            throw new Error("ID e Entregue são obrigatórios.");
        }

        const data = JSON.parse(await readFile(global.fileName));
        const index = data.pedidos.findIndex(ac => ac.id === parseInt(pedido.id));

        if (index === -1) {
            throw new Error("Registro não encontrado!");
        }

        data.pedidos[index].entregue = pedido.entregue;

        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.send(pedido);

        global.logger.info(`${req.method} ${req.baseUrl} - Account = ${JSON.stringify(pedido)}`);
    } catch (err) {
        next(err);
    }
}

async function deletePedido (req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const pedidos = data.pedidos.filter((pedido) =>
            pedido.id !== parseInt(req.params.id)
        );

        data.pedidos = pedidos;
        await writeFile(global.fileName, JSON.stringify(data, null, 2));
        res.end();

        global.logger.info(`${req.method} ${req.baseUrl} - ID = ${req.params.id}`);
    } catch (err) {
        next(err);
    }
}

async function getPedido (req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));
        const pedido = data.pedidos.filter((pedido) =>
            pedido.id === parseInt(req.params.id)
        );

        res.send(pedido);

        global.logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

async function getTotalPorCliente (req, res, next) {
    try {
        let params = req.body;
        let totalPorCliente = 0;
        const data = JSON.parse(await readFile(global.fileName));
        const pedidos = data.pedidos.filter((pedido) => {
            return pedido.cliente === params.cliente && pedido.entregue == true
        }).map((pedido) => {
            totalPorCliente += parseFloat(pedido.valor)
        })

        res.send(`O valor total de pedidos já realizados e entregues para o cliente ${params.cliente} é de R$${totalPorCliente}.`);

        global.logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

async function getTotalPorProduto (req, res, next) {
    try {
        let params = req.body;
        let totalPorProduto = 0;
        const data = JSON.parse(await readFile(global.fileName));
        const pedidos = data.pedidos.filter((pedido) => {
            return pedido.produto === params.produto && pedido.entregue == true
        }).map((pedido) => {
            totalPorProduto += parseFloat(pedido.valor)
        })

        res.send(`O valor total de pedidos já realizados e entregues para o produto ${params.produto} é de R$${totalPorProduto}.`);

        global.logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

export default
    {
        getAllPedidos,
        createPedido,
        updatePedido,
        updateEntregaPedido,
        deletePedido,
        getPedido,
        getTotalPorCliente,
        getTotalPorProduto
    }