// ระบบเข้าสู่ระบบ
document.getElementById('loginForm').onsubmit = function(e) {
  e.preventDefault();
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');
  errorDiv.innerText = '';
  
  let users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find(u => (u.username === username || u.email === username) && u.password === password);
  
  if (user) {
    localStorage.setItem('loginUser', JSON.stringify(user));
    // Redirect based on role
    if (user.role === 'admin' || user.role === 'ผู้ดูแลร้าน') {
      window.location.href = "admin_dashboard.html";
    } else {
      window.location.href = "menu.html"; // Regular users go to menu page
    }
  } else {
    errorDiv.innerText = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  }
};

// แสดงโปรไฟล์ใน header ถ้า login แล้ว
function renderHeaderProfile() {
  const user = JSON.parse(localStorage.getItem('loginUser'));
  const area = document.getElementById('profile-header-area');
  const loginBtn = document.getElementById('login-header-btn');
  
  if (!area) return;
  
  if (user) {
    area.innerHTML = `
      <div class="profile-area">
        <div class="profile-circle">${(user.username ? user.username[0] : user.email[0]).toUpperCase()}</div>
        <span class="profile-name">${user.username || user.email}</span>
        <button onclick="logout()" class="logout-btn">ออกจากระบบ</button>
      </div>
    `;
    if (loginBtn) loginBtn.style.display = 'none';
  } else {
    area.innerHTML = '';
    if (loginBtn) loginBtn.style.display = '';
  }
}

// ฟังก์ชันออกจากระบบ
function logout() {
  localStorage.removeItem('loginUser');
  window.location.href = 'index.html';
}

// เรียก renderHeaderProfile เมื่อโหลดหน้า
document.addEventListener('DOMContentLoaded', renderHeaderProfile);