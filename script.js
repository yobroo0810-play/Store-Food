// State Keranjang Belanja
let cart = [];

// Identitas Pengembang di Konsol Browser
console.log("Website 'Store Fast Food Catering' dikembangkan oleh yobroo.");

// 1. Sistem Navigasi SPA (Single Page Application)
function navigateTo(pageId) {
    document.querySelectorAll('.page-section').forEach(page => {
        page.classList.remove('active');
    });
    
    const selectedPage = document.getElementById('page-' + pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('text-red-900', 'bg-red-50', 'font-bold');
        btn.classList.add('hover:bg-gray-100', 'hover:text-red-800');
    });
    
    const activeNav = document.getElementById('nav-' + pageId);
    if (activeNav) {
        activeNav.classList.add('text-red-900', 'bg-red-50', 'font-bold');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 2. Format Angka ke Rupiah
function formatRupiah(number) {
    return 'Rp ' + number.toLocaleString('id-ID');
}

// 3. Toggle Cart Modal
function toggleCart() {
    const cartModal = document.getElementById('cart-modal');
    cartModal.classList.toggle('hidden');
}

// 4. Tambah Item ke Keranjang
function addToCart(name, price, image) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, image, quantity: 1 });
    }
    updateCartUI();
    showToast(`${name} ditambahkan ke keranjang!`);
}

// 5. Ubah Jumlah Porsi
function updateQuantity(name, change) {
    const item = cart.find(item => item.name === name);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.name !== name);
        }
    }
    updateCartUI();
}

// 6. Update Keranjang UI
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let itemCount = 0;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-center text-xs text-gray-400 py-6">Keranjang Anda masih kosong.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.quantity;
            itemCount += item.quantity;
            
            const itemElement = document.createElement('div');
            itemElement.className = 'flex items-center space-x-3 bg-gray-50 p-2.5 rounded-xl border border-gray-200';
            itemElement.innerHTML = `
                <img src="${item.image}" class="w-12 h-12 rounded-lg object-cover">
                <div class="flex-grow">
                    <h4 class="font-bold text-xs text-gray-800">${item.name}</h4>
                    <p class="text-[11px] text-red-600 font-bold">${formatRupiah(item.price)}</p>
                    <div class="flex items-center space-x-2 mt-1">
                        <button onclick="updateQuantity('${item.name}', -1)" class="w-5 h-5 bg-gray-200 rounded text-xs font-bold">-</button>
                        <span class="text-xs font-semibold">${item.quantity}</span>
                        <button onclick="updateQuantity('${item.name}', 1)" class="w-5 h-5 bg-gray-200 rounded text-xs font-bold">+</button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }
    
    cartCount.textContent = itemCount;
    cartTotal.textContent = formatRupiah(total);
}

// 7. Checkout Process
function openCheckout() {
    if (cart.length === 0) {
        showToast('Keranjang masih kosong!');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('checkout-total').textContent = formatRupiah(total);
    toggleCart();
    document.getElementById('checkout-modal').classList.remove('hidden');
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
}

function processPayment(e) {
    e.preventDefault();
    const name = document.getElementById('cust-name').value;
    const method = document.getElementById('payment-method').value;
    
    alert(`Terima kasih, ${name}!\n\nPesanan Store Fast Food Catering telah kami terima menggunakan pembayaran ${method}.\nStatus: Sedang Diproses & Siap Dikirim!`);
    
    cart = [];
    updateCartUI();
    closeCheckout();
    e.target.reset();
}

// 8. Toast Notification
function showToast(message) {
    const toast = document.getElementById('toast');
    document.getElementById('toast-message').innerText = message;
    toast.classList.remove('hidden');
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}