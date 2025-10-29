// ระบบจัดการออเดอร์และป้องกันการซ้ำซ้อน
const orderUtils = {
    // เก็บ ID ของออเดอร์ที่กำลังดำเนินการ
    processingOrders: new Set(),

    // ตรวจสอบว่าออเดอร์กำลังดำเนินการอยู่หรือไม่
    isProcessing(orderId) {
        return this.processingOrders.has(orderId);
    },

    // เพิ่มออเดอร์เข้าระบบ
    async createOrder(cartItems, userId) {
        // สร้าง unique order ID
        const orderId = 'ORDER_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // ตรวจสอบว่าไม่มีออเดอร์นี้ในระบบ
        if (this.isProcessing(orderId)) {
            throw new Error('ออเดอร์นี้กำลังดำเนินการอยู่');
        }

        // เพิ่มเข้า processing set
        this.processingOrders.add(orderId);

        try {
            // ตรวจสอบสต็อกสินค้าก่อนบันทึก
            const stockCheck = await this.checkStock(cartItems);
            if (!stockCheck.success) {
                throw new Error(stockCheck.message);
            }

            // สร้างข้อมูลออเดอร์
            const orderData = {
                id: orderId,
                userId: userId,
                items: cartItems.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    options: item.options || {}
                })),
                total: cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                status: 'pending',
                created: firebase.firestore.FieldValue.serverTimestamp(),
                updated: firebase.firestore.FieldValue.serverTimestamp()
            };

            // บันทึกลง Firestore
            await firebase.firestore().collection('orders').doc(orderId).set(orderData);

            // อัพเดทสต็อกสินค้า
            await this.updateStock(cartItems);

            return {
                success: true,
                orderId: orderId,
                message: 'สั่งซื้อสำเร็จ'
            };

        } catch (error) {
            console.error('Error creating order:', error);
            return {
                success: false,
                message: error.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ'
            };
        } finally {
            // ลบออกจาก processing set เมื่อเสร็จสิ้น
            this.processingOrders.delete(orderId);
        }
    },

    // ตรวจสอบสต็อกสินค้า
    async checkStock(items) {
        try {
            const db = firebase.firestore();
            const batch = db.batch();
            let insufficient = [];

            // ตรวจสอบสต็อกทีละรายการ
            for (const item of items) {
                const menuRef = db.collection('menu').doc(item.id);
                const menuDoc = await menuRef.get();
                
                if (!menuDoc.exists) {
                    insufficient.push(item.name);
                    continue;
                }

                const menuData = menuDoc.data();
                if (menuData.stock < item.quantity) {
                    insufficient.push(item.name);
                }
            }

            if (insufficient.length > 0) {
                return {
                    success: false,
                    message: `สินค้าหมด: ${insufficient.join(', ')}`
                };
            }

            return { success: true };

        } catch (error) {
            console.error('Error checking stock:', error);
            return {
                success: false,
                message: 'ไม่สามารถตรวจสอบสต็อกสินค้าได้'
            };
        }
    },

    // อัพเดทสต็อกสินค้า
    async updateStock(items) {
        const db = firebase.firestore();
        const batch = db.batch();

        for (const item of items) {
            const menuRef = db.collection('menu').doc(item.id);
            batch.update(menuRef, {
                stock: firebase.firestore.FieldValue.increment(-item.quantity)
            });
        }

        await batch.commit();
    }
};

// Export เพื่อใช้งานในไฟล์อื่น
window.orderUtils = orderUtils;
