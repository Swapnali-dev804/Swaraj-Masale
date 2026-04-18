// ===== CART SYSTEM =====
const WHATSAPP = '919834879138';
var cart = [];

function loadCart() {
  try { const s = localStorage.getItem('swaraj_cart'); cart = s ? JSON.parse(s) : []; if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
}
function saveCart() { localStorage.setItem('swaraj_cart', JSON.stringify(cart)); updateCount(); }

function addToCart(name, price) {
  loadCart();
  const item = cart.find(i => i.name === name);
  if (item) item.qty++; else cart.push({ name, price, qty: 1 });
  saveCart(); showToast(name + ' added to cart!');
}

function showToast(msg) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2200);
}

function updateCount() {
  loadCart();
  const count = cart.reduce((t, i) => t + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function openCart() { loadCart(); renderCart(); document.getElementById('cartModal').classList.add('open'); }
function closeCart() { document.getElementById('cartModal').classList.remove('open'); }

function renderCart() {
  loadCart();
  const box = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  if (!box) return;
  if (cart.length === 0) {
    box.innerHTML = '<p style="color:var(--text-muted);text-align:center;padding:40px 20px;font-size:0.9rem;">Your cart is empty 🛒</p>';
    if (totalEl) totalEl.textContent = '₹0'; return;
  }
  box.innerHTML = cart.map(i => `
    <div class="cart-item">
      <div style="flex:1">
        <div class="cart-item-name">${i.name}</div>
        <div class="cart-item-price">₹${i.price} × ${i.qty} = ₹${i.price * i.qty}</div>
        <div class="cart-qty-ctrl">
          <button class="qty-btn" onclick="changeQty('${i.name}',-1)">−</button>
          <span style="font-size:0.9rem;font-weight:600;">${i.qty}</span>
          <button class="qty-btn" onclick="changeQty('${i.name}',1)">+</button>
          <button class="remove-btn" onclick="removeItem('${i.name}')">Remove</button>
        </div>
      </div>
    </div>`).join('');
  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);
  if (totalEl) totalEl.textContent = '₹' + total;
}

function changeQty(name, delta) {
  loadCart();
  const item = cart.find(i => i.name === name);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.name !== name);
  saveCart(); renderCart();
}

function removeItem(name) {
  loadCart(); cart = cart.filter(i => i.name !== name); saveCart(); renderCart();
}

function checkout() {
  loadCart();
  const name = document.getElementById('custName')?.value.trim();
  const phone = document.getElementById('custPhone')?.value.trim();
  const address = document.getElementById('custAddress')?.value.trim();
  if (!name || !phone || !address) { alert('Please fill in Name, Phone & Address'); return; }
  if (cart.length === 0) { alert('Your cart is empty!'); return; }
  const total = cart.reduce((t, i) => t + i.price * i.qty, 0);
  let msg = `*Swaraj Masale Order*%0A%0A`;
  cart.forEach(i => { msg += `${i.name} × ${i.qty} = ₹${i.price * i.qty}%0A`; });
  msg += `%0A*Total: ₹${total}*%0A%0AName: ${name}%0APhone: ${phone}%0AAddress: ${address}`;
  window.open(`https://wa.me/${WHATSAPP}?text=${msg}`, '_blank');
  cart = []; saveCart(); renderCart();
}

// Exports
window.addToCart = addToCart;
window.openCart = openCart;
window.closeCart = closeCart;
window.changeQty = changeQty;
window.removeItem = removeItem;
window.checkout = checkout;

document.addEventListener('DOMContentLoaded', () => { loadCart(); updateCount(); });
