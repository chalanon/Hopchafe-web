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
      window.location.href = "login.html";
  } else {
      errorDiv.innerText = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
  }
};