// Inject header HTML
export function createNavHeader() {
  const header = document.createElement('header');
  header.innerHTML = `
    <div class="header-inner">
      <div class="logo-title" style="cursor:pointer;" onclick="window.location.href='index.html'">
        <img src="https://tse1.mm.bing.net/th/id/OIP.QRJR_4Y3hoyuaVZJGTNuAAHaHa?cb=thvnextc2&rs=1&pid=ImgDetMain&o=7&rm=3" alt="logo" style="height:38px;width:38px;object-fit:contain;vertical-align:middle;">
        <span>HopChafe Cafe</span>
      </div>
      <nav>
        <a href="index.html"><i class="fas fa-home"></i> หน้าแรก</a>
        <a href="menu.html"><i class="fas fa-mug-hot"></i> เมนู</a>
        <a href="contact.html"><i class="fas fa-phone"></i> ติดต่อเรา</a>
      </nav>
      <div style="display:flex;align-items:center;gap:10px;">
        <div id="user-profile-area" class="profile-area"></div>
        <button class="cart-btn" id="cartBtn">
          <i class="fa-solid fa-cart-shopping"></i>
          <span class="cart-count" id="cartCount">0</span>
        </button>
      </div>
    </div>
    <div class="cart-modal" id="cartModal">
      <button class="close-btn" id="closeCart"><i class="fa-solid fa-xmark"></i></button>
      <h2><i class="fa-solid fa-cart-shopping"></i> ตะกร้าของคุณ</h2>
      <div id="cartList"></div>
      <div class="cart-total" id="cartTotal"></div>
      <button id="checkoutBtn" style="margin-top:1rem; width:100%; background:var(--starbucks-light); color:var(--starbucks-green); border:none; border-radius:20px; padding:0.7rem 0; font-size:1.1rem; font-weight:bold; cursor:pointer; display:none;">
        <i class="fa-solid fa-money-bill-wave"></i> ชำระเงิน
      </button>
    </div>
  `;
  document.body.insertBefore(header, document.body.firstChild);
}

// Check user role and redirect if needed
export function checkRoleRedirect() {
  const user = JSON.parse(localStorage.getItem('loginUser'));
  if (user && (user.role === 'admin' || user.role === 'ผู้ดูแลร้าน')) {
    window.location.href = 'admin_dashboard.html';
  }
}

// Render user profile in header
export function renderUserProfile() {
  const user = JSON.parse(localStorage.getItem('loginUser'));
  const area = document.getElementById('user-profile-area');
  if (!area) return;
  
  if (user) {
    area.innerHTML = `
      <div class="profile-circle">${user.username ? user.username[0].toUpperCase() : user.email[0].toUpperCase()}</div>
      <span class="profile-name">${user.username || user.email}</span>
      <button class="logout-btn" onclick="logout()">ออกจากระบบ</button>
    `;
  } else {
    area.innerHTML = `<a href="login.html"><button class="login-btn">Login / Register</button></a>`;
  }
}

// Cart functions
let cart = JSON.parse(localStorage.getItem('cart')) || [];

export function initCart() {
  const cartBtn = document.getElementById('cartBtn');
  const closeCart = document.getElementById('closeCart');
  const cartModal = document.getElementById('cartModal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (cartBtn) {
    cartBtn.onclick = function() {
      cartModal.classList.add('active');
      renderCart();
    };
  }

  if (closeCart) {
    closeCart.onclick = function() {
      cartModal.classList.remove('active');
    };
  }

  if (checkoutBtn) {
    checkoutBtn.onclick = function() {
      window.location.href = 'checkout.html';
    };
  }

  updateCartCount();
  renderCart();
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (cartCount) {
    cartCount.textContent = cart.reduce((sum, item) => sum + item.qty, 0);
  }
}

function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
}

function renderCart() {
  const cartList = document.getElementById('cartList');
  const cartTotal = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  
  if (!cartList || !cartTotal || !checkoutBtn) return;

  if (cart.length === 0) {
    cartList.innerHTML = '<div class="empty">ไม่มีสินค้าในตะกร้า</div>';
    cartTotal.textContent = '';
    checkoutBtn.style.display = 'none';
    return;
  }

  let total = 0;
  cartList.innerHTML = cart.map((item, idx) => {
    let price = item.price + (item.topping && item.topping.includes('+') ? parseInt(item.topping.split('+')[1]) : 0);
    let sum = price * item.qty;
    total += sum;
    return `
      <div class='cart-item'>
        <img src='${item.img}' width='40' class="cart-item-img">
        <div class='cart-item-info'>
          <div class='cart-item-name'>${item.name}</div>
          <div class='cart-item-price'>${price} บาท x ${item.qty}</div>
          <div style='font-size:0.9em;color:#888;'>
            ${item.topping ? 'ท็อปปิ้ง: ' + item.topping : ''} 
            ${item.sweetness ? ' | หวาน: ' + item.sweetness : ''}
          </div>
          <div class='cart-controls'>
            <button onclick='changeQty(${idx},-1)'>&minus;</button>
            <span class="cart-quantity">${item.qty}</span>
            <button onclick='changeQty(${idx},1)'>&plus;</button>
            <button onclick='removeCart(${idx})' style='margin-left:8px;background:#e57373;'>ลบ</button>
          </div>
        </div>
      </div>
    `;
  }).join('');
  
  cartTotal.textContent = 'รวม ' + total + ' บาท';
  checkoutBtn.style.display = 'block';
}

export function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart();
  renderCart();
}

export function removeCart(idx) {
  cart.splice(idx, 1);
  saveCart();
  renderCart();
}

export function logout() {
  localStorage.removeItem('loginUser');
  location.reload();
}

// Initialize everything when document is ready
document.addEventListener('DOMContentLoaded', function() {
  createNavHeader();
  checkRoleRedirect();
  renderUserProfile();
  initCart();
});
