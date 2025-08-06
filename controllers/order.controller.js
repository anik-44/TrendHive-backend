import prisma from '../db/prisma.js';
import razorpay from '../utils/razorpay.js';
import crypto from 'crypto';

export const creatOrderHandler = async (req, res) => {
    const userId = req.user.id;
    try {
        const cart = await prisma.cart.findUnique({
            where: {userId},
            include: {
                cartItems: {
                    include: {product: true},
                },
            },
        });

        if (!cart || cart.cartItems.length === 0) {
            return res.status(400).json({error: "Cart is empty"});
        }

        const totalAmount = cart.cartItems.reduce((sum, item) => {
            return sum + item.product.price * item.quantity;
        }, 0);

        const razorpayOrder = await razorpay.orders.create({
            amount: totalAmount * 100,
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
        });

        await prisma.order.create({
            data: {
                userId,
                razorpayOrderId: razorpayOrder.id,
                amount: totalAmount,
                status: "CREATED",
            },
        });

        res.json({
            orderId: razorpayOrder.id,
            amount: totalAmount,
            currency: "INR",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({error: "Internal Server Error"});
    }
}

export const verifyPaymentHandler = async (req, res) => {
    const userId = req.user.id
    const {razorpay_order_id, razorpay_payment_id, razorpay_signature,} = req.body;

    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

    if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({error: "Invalid signature"});
    }

    await prisma.order.update({
        where: {razorpayOrderId: razorpay_order_id},
        data: {status: "PAID"},
    });

    const cart = await prisma.cart.findUnique({where: {userId}});
    if (cart) await prisma.cartItem.deleteMany({where: {cartId: cart.id}});

    res.json({success: true});
}