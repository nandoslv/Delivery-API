import express from 'express';
import pedidosRouter from './routes/pedidos.routes.js';
import maisVendidosRouter from './routes/maisVendidos.routes.js';
import { promises as fs } from 'fs';
import winston from 'winston';
import cors from 'cors';

const { readFile, writeFile } = fs;
const { combine, timestamp, label, printf } = winston.format;
const myFormat = printf(({level, message, label, timestamp}) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

global.fileName = 'pedidos.json';
global.logger = winston.createLogger({
    level: 'silly',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: 'delivery-api.log' })
    ],
    format: combine(
        label({ label: 'delivery-api' }),
        timestamp(),
        myFormat
    )
});

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use('/pedidos', pedidosRouter);
app.use('/maisVendidos/', maisVendidosRouter);

app.listen(3000, async () => {
    try {
        await readFile(global.fileName);
        global.logger.info("API Started!")
    } catch (err) {
        const initialJson = {
            nextId: 1,
            accounts: []
        };
        writeFile(global.fileName, JSON.stringify(initialJson)).then(() => {
            global.logger.info('Delivery-API Started and File Created!')
        }).catch(err => {
            global.logger.error(err);
        });
    }
});