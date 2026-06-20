/**
 * Carrito de compras — persistido en localStorage.
 * Emite el evento `cart:updated` en window cada vez que cambia,
 * para que el badge del navbar y la página /carrito se sincronicen.
 */

export interface CartItem {
  id: string;
  name: string;
  price: number;       // precio unitario en MXN
  priceLabel: string;  // "45,000"
  qty: number;
  gradient: string;
  category: string;
}

const KEY = 'adagio-cart';

function read(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

function write(items: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent('cart:updated', { detail: { items } }));
}

export function getCart(): CartItem[] {
  return read();
}

export function cartCount(): number {
  return read().reduce((n, i) => n + i.qty, 0);
}

export function cartTotal(): number {
  return read().reduce((n, i) => n + i.price * i.qty, 0);
}

export function addToCart(item: Omit<CartItem, 'qty'>, qty = 1) {
  const items = read();
  const existing = items.find(i => i.id === item.id);
  if (existing) existing.qty += qty;
  else items.push({ ...item, qty });
  write(items);
}

export function setQty(id: string, qty: number) {
  let items = read();
  if (qty <= 0) items = items.filter(i => i.id !== id);
  else {
    const it = items.find(i => i.id === id);
    if (it) it.qty = qty;
  }
  write(items);
}

export function removeFromCart(id: string) {
  write(read().filter(i => i.id !== id));
}

export function clearCart() {
  write([]);
}

export function formatMXN(n: number): string {
  return n.toLocaleString('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 });
}

/** Construye el mensaje de pedido para WhatsApp */
export function buildWhatsAppOrder(): string {
  const items = read();
  if (!items.length) return '';
  const lines = items.map(i => `• ${i.name} × ${i.qty} — ${formatMXN(i.price * i.qty)}`);
  return [
    'Hola AdagIO 👋, quiero realizar el siguiente pedido:',
    '',
    ...lines,
    '',
    `*Total: ${formatMXN(cartTotal())}*`,
  ].join('\n');
}
