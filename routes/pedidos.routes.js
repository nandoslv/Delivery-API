import express from "express";
import pedidos from "../controllers/pedidos.controller.js"
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;
const router = express.Router();

router.get('/', pedidos.getAllPedidos);

router.post('/', pedidos.createPedido);

router.put('/', pedidos.updatePedido);

router.patch('/', pedidos.updateEntregaPedido);

router.delete('/:id', pedidos.deletePedido);

router.get('/:id', pedidos.getPedido);

router.post('/totalPorCliente', pedidos.getTotalPorCliente);

router.post('/totalPorProduto', pedidos.getTotalPorProduto);

router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    console.log(err)
    res.status(400).send({ error: err.message })
})

export default router;