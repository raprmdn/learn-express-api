let express = require('express');
let router = express.Router();
const Validator = require('fastest-validator');

const { Product } = require('../models');

const v = new Validator();

router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            order: [
                ['createdAt', 'DESC']
            ]
        });
        return res.json(products);
    } catch (err) {
        return res.status(500).send(err);
    }
});

router.post('/', async (req, res) => {
    const schema = {
        name: 'string',
        brand: 'string',
        description: 'string|optional',
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json(validate);
    }

    const product = await Product.create(req.body);

    res.json(product);
});

router.get('/:id', async (req, res) => {
    const product = await Product.findByPk(req.params.id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found'
        });
    }

    res.json(product);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    let product = await Product.findByPk(id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }

    const schema = {
        name: 'string',
        brand: 'string',
        description: 'string|optional',
    }

    const validate = v.validate(req.body, schema);

    if (validate.length) {
        return res.status(400).json(validate);
    }

    product = await product.update(req.body);

    res.json(product);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;
    const product = await Product.findByPk(id);

    if (!product) {
        return res.status(404).json({
            message: 'Product not found',
        });
    }

    await product.destroy();

    res.json({
        message: 'Product deleted',
    });
});

module.exports = router;