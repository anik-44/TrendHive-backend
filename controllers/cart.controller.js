import prisma from '../db/prisma.js';

export const getCartItems = async (req, res) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { userId: req.user.id },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const addToCart = async (req, res) => {
  const { productId } = req.body;

  try {
    const cart = await prisma.cart.findFirst({
      where: {
        userId: req.user.id,
      },
      include: {
        cartItems: {
          where: { productId },
        },
      },
    });

    if (cart && cart.cartItems.length > 0) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: cart.cartItems[0].id },
        data: { quantity: { increment: 1 } },
      });

      return res
        .status(200)
        .json({ message: 'Item quantity updated', updatedItem });
    } else {
      let newItem;
      if (cart) {
        newItem = await prisma.cartItem.create({
          data: {
            cartId: cart?.id,
            productId,
            quantity: 1,
          },
        });
      } else {
        newItem = await prisma.cart.create({
          data: {
            userId: req.user.id,
            cartItems: {
              create: {
                productId,
                quantity: 1,
              },
            },
          },
        });
      }

      return res.status(201).json({ message: 'Item added to cart', newItem });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const updateCartItem = async (req, res) => {

  const { cartItemId, quantity } = req.body.data;

  try {
    if (quantity <= 0) {
      return res
        .status(400)
        .json({ error: 'Quantity must be greater than zero' });
    }

    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItemId },
      data: { quantity },
    });

    return res.status(200).json({ message: 'Cart item updated', updatedItem });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

export const removeCartItem = async (req, res) => {
  const { cartItemId } = req.body;

  try {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });

    return res.status(200).json({ message: 'Cart item removed' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};
