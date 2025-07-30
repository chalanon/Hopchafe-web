// เชื่อมต่อ Firebase และตั้งค่าการใช้งาน Offline
firebase.firestore().enablePersistence()
  .catch((err) => {
    if (err.code == 'failed-precondition') {
      console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code == 'unimplemented') {
      console.error('The current browser does not support all of the features required to enable persistence');
    }
  });

// ระบบจัดการตะกร้าสินค้า
const cart = {
  items: [],
  total: 0,

  init() {
    this.loadFromStorage();
    this.updateUI();
    this.setupListeners();
  },

  setupListeners() {
    // แสดง/ซ่อนตะกร้า
    const cartIcon = document.querySelector('.cart-icon');
    const cartPreview = document.querySelector('.cart-preview');
    
    cartIcon?.addEventListener('click', () => {
      cartPreview?.classList.toggle('active');
    });

    // ซ่อนตะกร้าเมื่อคลิกที่อื่น
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.cart-icon') && !e.target.closest('.cart-preview')) {
        cartPreview?.classList.remove('active');
      }
    });
  },

  addItem(item) {
    const existingItem = this.items.find(i => i.id === item.id);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      this.items.push({ ...item, quantity: 1 });
    }
    this.updateTotal();
    this.saveToStorage();
    this.updateUI();
    this.showNotification(`เพิ่ม ${item.name} ลงตะกร้าแล้ว`);
  },

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.updateTotal();
    this.saveToStorage();
    this.updateUI();
  },

  updateQuantity(itemId, delta) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(0, item.quantity + delta);
      if (item.quantity === 0) {
        this.removeItem(itemId);
      } else {
        this.updateTotal();
        this.saveToStorage();
        this.updateUI();
      }
    }
  },

  updateTotal() {
    this.total = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  },

  saveToStorage() {
    localStorage.setItem('cart', JSON.stringify({
      items: this.items,
      total: this.total
    }));
  },

  loadFromStorage() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      const data = JSON.parse(saved);
      this.items = data.items;
      this.total = data.total;
    }
  },

  updateUI() {
    const badge = document.querySelector('.cart-badge');
    const preview = document.querySelector('.cart-preview');
    const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);

    if (badge) {
      badge.textContent = totalItems;
      badge.style.display = totalItems ? 'flex' : 'none';
    }

    if (preview) {
      if (this.items.length === 0) {
        preview.innerHTML = '<div class="empty-cart">ตะกร้าว่างเปล่า</div>';
      } else {
        preview.innerHTML = `
          ${this.items.map(item => `
            <div class="cart-item">
              <img src="${item.image}" alt="${item.name}" class="cart-item-img">
              <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} บาท</div>
              </div>
              <div class="cart-controls">
                <button class="cart-btn" onclick="cart.updateQuantity('${item.id}', -1)">-</button>
                <span class="cart-quantity">${item.quantity}</span>
                <button class="cart-btn" onclick="cart.updateQuantity('${item.id}', 1)">+</button>
              </div>
            </div>
          `).join('')}
          <div class="cart-total">
            <div class="cart-total-text">รวมทั้งหมด</div>
            <div class="cart-total-amount">${this.total} บาท</div>
          </div>
          <button class="checkout-btn" onclick="location.href='checkout.html'">
            ดำเนินการสั่งซื้อ
          </button>
        `;
      }
    }
  },

  showNotification(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "var(--accent)",
      className: "toast",
    }).showToast();
  }
};

// ระบบจัดการเมนู
const menuSystem = {
  items: [],
  favorites: new Set(),

  init() {
    this.setupSearch();
    this.setupFilters();
    this.loadFavorites();
    this.fetchMenuItems();
  },

  setupSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput?.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      this.filterItems({ search: query });
    });
  },

  setupFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    categoryFilter?.addEventListener('change', () => this.applyFilters());
    priceFilter?.addEventListener('change', () => this.applyFilters());
  },

  async fetchMenuItems() {
    try {
      const menuContainer = document.getElementById('menuItems');
      if (menuContainer) {
        menuContainer.innerHTML = '<div class="loading"><div class="loading-spinner"></div></div>';
      }
      
      // ตรวจสอบการเชื่อมต่อ
      if (!navigator.onLine) {
        throw new Error('ไม่มีการเชื่อมต่ออินเทอร์เน็ต กำลังใช้ข้อมูลออฟไลน์');
      }

      // ดึงข้อมูลจาก Firestore
      const snapshot = await firebase.firestore().collection('menu').get();
      this.items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      this.renderItems(this.items);
    } catch (error) {
      console.error('Error fetching menu items:', error);
      this.showError('ไม่สามารถโหลดรายการเมนูได้ กรุณาลองใหม่อีกครั้ง');
    }
  },

  applyFilters() {
    const category = document.getElementById('categoryFilter')?.value;
    const price = document.getElementById('priceFilter')?.value;
    const search = document.getElementById('searchInput')?.value.toLowerCase();

    let filtered = [...this.items];

    if (search) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
      );
    }

    if (category && category !== 'all') {
      filtered = filtered.filter(item => item.category === category);
    }

    if (price) {
      const [min, max] = price.split('-').map(Number);
      filtered = filtered.filter(item => item.price >= min && (!max || item.price <= max));
    }

    this.renderItems(filtered);
  },

  renderItems(items) {
    const container = document.getElementById('menuItems');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML = '<div class="no-results">ไม่พบรายการที่ค้นหา</div>';
      return;
    }

    container.innerHTML = items.map(item => `
      <div class="menu-item">
        <img src="${item.image}" alt="${item.name}">
        <button class="fav-btn ${this.favorites.has(item.id) ? 'active' : ''}" 
                onclick="menuSystem.toggleFavorite('${item.id}')">
          <i class="fas fa-heart"></i>
        </button>
        <div class="menu-item-content">
          <div class="menu-item-title">${item.name}</div>
          <div class="menu-item-price">${item.price} บาท</div>
          <button class="add-to-cart-btn" onclick="cart.addItem(${JSON.stringify(item)})">
            <i class="fas fa-plus"></i> เพิ่มลงตะกร้า
          </button>
        </div>
      </div>
    `).join('');
  },

  toggleFavorite(itemId) {
    if (this.favorites.has(itemId)) {
      this.favorites.delete(itemId);
    } else {
      this.favorites.add(itemId);
    }
    this.saveFavorites();
    this.updateFavoriteUI(itemId);
  },

  loadFavorites() {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      this.favorites = new Set(JSON.parse(saved));
    }
  },

  saveFavorites() {
    localStorage.setItem('favorites', JSON.stringify([...this.favorites]));
  },

  updateFavoriteUI(itemId) {
    const btn = document.querySelector(`[onclick*="${itemId}"]`);
    if (btn) {
      btn.classList.toggle('active', this.favorites.has(itemId));
    }
  },

  showError(message) {
    Toastify({
      text: message,
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff4757",
      className: "toast",
    }).showToast();
  }
};

// เริ่มต้นระบบเมื่อโหลดหน้า
// ติดตามสถานะการเชื่อมต่อ
function updateOnlineStatus() {
  const status = navigator.onLine ? 'online' : 'offline';
  if (!navigator.onLine) {
    Toastify({
      text: "คุณกำลังอยู่ในโหมดออฟไลน์",
      duration: 3000,
      gravity: "top",
      position: "right",
      backgroundColor: "#ff9800"
    }).showToast();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  cart.init();
  menuSystem.init();
  
  // เพิ่ม Event Listeners สำหรับติดตามสถานะการเชื่อมต่อ
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus(); // ตรวจสอบสถานะเริ่มต้น
});
