// ระบบสั่งซื้อ
document.getElementById('order-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const product = document.getElementById('product').value;
  const quantity = document.getElementById('quantity').value;
  const summary = `คุณได้สั่งซื้อ ${product} จำนวน ${quantity} แก้ว`;
  document.getElementById('order-summary').textContent = summary;
});

// ระบบจองโต๊ะ
document.getElementById('reservation-form').addEventListener('submit', function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const phone = document.getElementById('phone').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const people = document.getElementById('people').value;
  const summary = `คุณ ${name} ได้จองโต๊ะสำหรับ ${people} คน ในวันที่ ${date} เวลา ${time} เบอร์โทร: ${phone}`;
  document.getElementById('reservation-summary').textContent = summary;
});

