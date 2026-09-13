export const getCart = () => JSON.parse(localStorage.getItem('cart') || '[]');

export const saveCart = (cart) => {
  localStorage.setItem('cart', JSON.stringify(cart));
  window.dispatchEvent(new Event('cart-updated'));
};

export const addToCart = (product, size) => {
  const cart = getCart();
  const existing = cart.find(item => item.id === product.id && item.size === size);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, size, quantity: 1 });
  }
  saveCart(cart);
};

export const removeFromCart = (id, size) => {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === id && item.size === size));
  saveCart(cart);
};

export const clearCart = () => {
  localStorage.removeItem('cart');
  window.dispatchEvent(new Event('cart-updated'));
};