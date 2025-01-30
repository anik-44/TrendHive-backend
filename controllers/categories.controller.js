import prisma from '../db/prisma.js';

export const getCategories = async (req, res) => {
    try {
        const categories = await prisma.category.findMany();
        return res.status(200).json(categories);
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal error'});
    }
};

export const getProducts = async (req, res) => {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 10;
    const {category} = req.params;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
        const products = await prisma.product.findMany({
            skip,
            take,
            where: {
                categoryId: category,
            },
        });
        res.status(200).json({
            products,
            total: products.length,
            page,
            pageSize,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: 'Internal error'});
    }
};
