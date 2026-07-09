// Authentication
let currentUser = null;
let orders = [];

// Load data from localStorage
function loadData() {
    const user = localStorage.getItem('currentUser');
    if (user) {
        currentUser = JSON.parse(user);
    }
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
        orders = JSON.parse(savedOrders);
    }
}

// Save data to localStorage
function saveData() {
    if (currentUser) {
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    }
    localStorage.setItem('orders', JSON.stringify(orders));
}

// Modal Functions
function showLogin() {
    document.getElementById('loginModal').classList.remove('hidden');
}

function closeLogin() {
    document.getElementById('loginModal').classList.add('hidden');
}

function showRegister() {
    document.getElementById('registerModal').classList.remove('hidden');
}

function closeRegister() {
    document.getElementById('registerModal').classList.add('hidden');
}

function toggleModals() {
    document.getElementById('loginModal').classList.toggle('hidden');
    document.getElementById('registerModal').classList.toggle('hidden');
}

// Login Handler
document.addEventListener('DOMContentLoaded', function() {
    loadData();
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            // Simulasi login (dalam produksi, kirim ke server)
            if (email && password) {
                currentUser = {
                    email: email,
                    name: email.split('@')[0]
                };
                saveData();
                closeLogin();
                updateUI();
                alert('Login berhasil!');
            }
        });
    }

    // Register Handler
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Password tidak cocok!');
                return;
            }

            // Simulasi registrasi
            currentUser = {
                name: name,
                email: email
            };
            saveData();
            closeRegister();
            updateUI();
            alert('Registrasi berhasil! Selamat datang ' + name);
        });
    }

    // Update Auth Buttons
    updateUI();
});

function updateUI() {
    const authButtons = document.querySelector('.auth-buttons');
    
    if (currentUser) {
        authButtons.innerHTML = `
            <span>Halo, ${currentUser.name}!</span>
            <button class="btn-register" onclick="goToDashboard()">Dashboard</button>
            <button class="btn-login" onclick="logout()">Logout</button>
        `;
    }
}

function goToDashboard() {
    document.getElementById('dashboard').classList.remove('hidden');
    scrollTo('dashboard');
    showDashboardSection('pesanan');
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    document.getElementById('dashboard').classList.add('hidden');
    updateUI();
    alert('Logout berhasil');
}

// Dashboard Functions
function showDashboardSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(section => {
        section.classList.remove('active');
        section.classList.add('hidden');
    });

    // Show selected section
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        section.classList.add('active');
    }

    // Update content
    if (sectionId === 'pesanan') {
        displayOrders();
    }
}

function displayOrders() {
    const ordersList = document.querySelector('.orders-list');
    
    if (orders.length === 0) {
        ordersList.innerHTML = '<p>Anda belum memiliki pesanan. <a href="#" onclick="showDashboardSection(\'buat-pesanan\')">Buat pesanan baru</a></p>';
        return;
    }

    let html = '<div class="orders-table">';
    orders.forEach((order, index) => {
        html += `
            <div class="order-item">
                <h4>${order.title}</h4>
                <p><strong>Jenis:</strong> ${order.type}</p>
                <p><strong>Deskripsi:</strong> ${order.description}</p>
                <p><strong>Batas Waktu:</strong> ${order.deadline}</p>
                <p><strong>Paket:</strong> ${order.package}</p>
                <p><strong>Status:</strong> <span class="status-badge">${order.status || 'Menunggu'}</span></p>
                <button class="btn-primary" onclick="viewOrderDetail(${index})">Lihat Detail</button>
            </div>
        `;
    });
    html += '</div>';
    ordersList.innerHTML = html;
}

function viewOrderDetail(index) {
    const order = orders[index];
    alert('Detail Pesanan:\n\nJudul: ' + order.title + '\nDeskripsi: ' + order.description + '\nBatas Waktu: ' + order.deadline + '\nPaket: ' + order.package);
}

// Create Order Handler
document.addEventListener('DOMContentLoaded', function() {
    const orderForm = document.querySelector('.order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);
            const order = {
                id: Date.now(),
                type: this.querySelector('select').value,
                title: this.querySelectorAll('input')[0].value,
                description: this.querySelector('textarea').value,
                deadline: this.querySelectorAll('input')[1].value,
                package: this.querySelectorAll('select')[1].value,
                status: 'Menunggu',
                createdAt: new Date().toLocaleDateString('id-ID')
            };

            orders.push(order);
            saveData();
            
            alert('Pesanan berhasil dibuat! Kami akan menghubungi Anda segera.');
            this.reset();
            showDashboardSection('pesanan');
        });
    }
});

// Smooth Scroll
function scrollTo(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target == loginModal) {
        loginModal.classList.add('hidden');
    }
    if (event.target == registerModal) {
        registerModal.classList.add('hidden');
    }
});

// Initialize app
loadData();
if (currentUser) {
    updateUI();
}
