import express from "express";
import { promises as fs } from 'fs';

const { readFile, writeFile } = fs;

async function getMaisVendidos (req, res, next) {
    try {
        const data = JSON.parse(await readFile(global.fileName));        
        const agrupamento = data.pedidos
            .filter((pedido) => pedido.entregue == true)
            .reduce((produtos, item) => {
                if (!produtos[item.produto]) {
                    produtos[item.produto] = [];
                }
                produtos[item.produto].push(item);
                return produtos;
            }, {})

        let atributosAgrupamento = Object.keys(agrupamento).reverse();

        let maisVendidos = [];

        for(let attr of atributosAgrupamento){
            console.log(`${attr} -> ${agrupamento[attr].length}`);
            maisVendidos.push({
                produto: attr,
                quantidade: agrupamento[attr].length
            })
        };

        maisVendidos = maisVendidos.sort((prodA, prodB) => {
            if(prodA.quantidade > prodB.quantidade)
                return -1
            else if(prodB.quantidade > prodA.quantidade)
                return 1
            else
                return 0
        })

        let resultado = [];

        maisVendidos.map((produto) => {
            resultado.push(`${produto.produto} - ${produto.quantidade}`)
        })

        res.send(resultado);

        global.logger.info(`${req.method} ${req.baseUrl}`);
    } catch (err) {
        next(err);
    }
}

export default getMaisVendidos;