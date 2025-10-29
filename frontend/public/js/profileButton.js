// profileButton.js
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";

export function initProfileButton() {
  const auth = getAuth();
  const db = getFirestore();

  // ตรวจสอบว่ามีปุ่มอยู่แล้วหรือไม่
  if (document.getElementById('accountButton')) {
    return; // ถ้ามีปุ่มอยู่แล้วให้จบการทำงาน
  }

  // หา nav-right ที่มีอยู่แล้ว
  const existingNavRight = document.querySelector('.nav-right');
  if (!existingNavRight) {
    // ถ้าไม่มี nav-right ให้หา nav และเพิ่ม nav-right เข้าไป
    const nav = document.querySelector('nav');
    if (!nav) return; // ถ้าไม่มี nav ให้จบการทำงาน
    
    const newNavRight = document.createElement('div');
    newNavRight.className = 'nav-right';
    nav.appendChild(newNavRight);
    return initProfileButton(); // เรียกฟังก์ชันอีกครั้งหลังจากสร้าง nav-right
  }

  // สร้าง HTML สำหรับปุ่มโปรไฟล์
  const profileContainer = document.createElement('div');
  profileContainer.style.position = 'relative';
  profileContainer.innerHTML = `
    <button class="account-button" id="accountButton">
      <i class="fas fa-user"></i>
    </button>
    <div class="account-menu" id="accountMenu">
      <div class="account-menu-header">
        <span id="userEmail" style="padding: 0.8rem 1rem; display: block; color: var(--primary); font-size: 0.9rem; border-bottom: 1px solid #eee;"></span>
      </div>
      <a href="profile.html" class="account-menu-item">
        <i class="fas fa-user-circle"></i>
        <span>โปรไฟล์</span>
      </a>
      <a href="order_history.html" class="account-menu-item">
        <i class="fas fa-history"></i>
        <span>ประวัติการสั่งซื้อ</span>
      </a>
      <div class="account-menu-item" id="logoutButton" style="color: var(--danger)">
        <i class="fas fa-sign-out-alt"></i>
        <span>ออกจากระบบ</span>
      </div>
    </div>
  `;

  // เพิ่มปุ่มเข้าไปใน nav-right
  existingNavRight.appendChild(profileContainer);

  // จัดการการแสดง/ซ่อนเมนู
  const accountButton = document.getElementById('accountButton');
  const accountMenu = document.getElementById('accountMenu');
  const logoutButton = document.getElementById('logoutButton');

  if (!accountButton || !accountMenu || !logoutButton) return;

  // เพิ่มการคลิกที่ปุ่มโปรไฟล์เพื่อไปที่หน้า profile.html
  accountButton.addEventListener('click', (e) => {
    e.stopPropagation();
    // ถ้าผู้ใช้กดคลิกที่ปุ่มโดยตรง (ไม่ใช่กดที่เมนู) ให้ไปที่หน้าโปรไฟล์
    if (e.target === accountButton || e.target === accountButton.querySelector('span') || e.target === accountButton.querySelector('img')) {
      window.location.href = 'profile.html';
      return;
    }
    // ถ้าคลิกที่เมนูให้แสดง/ซ่อนเมนูตามปกติ
    accountMenu.classList.toggle('show');
  });

  document.addEventListener('click', (e) => {
    if (!accountMenu.contains(e.target)) {
      accountMenu.classList.remove('show');
    }
  });

  // จัดการการออกจากระบบ
  logoutButton.addEventListener('click', async () => {
    try {
      await signOut(auth);
      window.location.href = 'login.html';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  });

  // อัปเดตปุ่มตามสถานะการล็อกอิน
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      // แสดงอีเมลในเมนู
      const userEmailElement = document.getElementById('userEmail');
      if (userEmailElement) {
        userEmailElement.textContent = user.email;
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().photoURL) {
        // ถ้ามีรูปโปรไฟล์ให้แสดงรูป
        accountButton.innerHTML = `<img src="${userDoc.data().photoURL}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
      } else {
        // ถ้าไม่มีรูปโปรไฟล์ให้แสดงตัวอักษรแรกของอีเมล
        const firstLetter = user.email.charAt(0).toUpperCase();
        accountButton.innerHTML = `<span style="font-size: 1.2rem; font-weight: 600; color: var(--primary);">${firstLetter}</span>`;
      }
      
      // ทำให้ปุ่มคลิกได้และมี cursor: pointer
      accountButton.style.cursor = 'pointer';
    } else {
      accountButton.innerHTML = '<i class="fas fa-user"></i>';
      if (!window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
      }
    }
  });
}
