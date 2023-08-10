import express from "express";
import getMaisVendidos from "../controllers/maisVendidos.controller.js";

const router = express.Router();

router.get('/', getMaisVendidos);

router.use((err, req, res, next) => {
    global.logger.error(`${req.method} ${req.baseUrl} - ${err.message}`);
    console.log(err)
    res.status(400).send({ error: err.message })
})

export default router;