export const calculateCartTotals = (cartItems, quantities) => {
  const subTotal = cartItems.reduce(
    (acc, food) => acc + food.price * quantities[food.id],
    0,
  );

  const shippingFee = subTotal > 0 ? 10 : 0.0;
  const tax = subTotal * 0.1; // Assuming a tax rate of 10%
  const total = subTotal + shippingFee + tax;

  return { subTotal, shippingFee, tax, total };
};
