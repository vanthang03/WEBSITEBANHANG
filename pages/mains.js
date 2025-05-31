 const filterBtns = document.querySelectorAll('.section__type-item');
const productCards = document.querySelectorAll('.section__product-card');

const overlay = document.getElementById('overlay');


function closeViewDetail() {
    productCards.forEach(p => p.classList.remove('active'));
    overlay.style.display = 'none';
}                           

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const btnType = btn.getAttribute('type');
        filter(btnType);
    })
})

overlay.addEventListener('click',closeViewDetail);

function filter(type) {
    productCards.forEach(p => {
        if (type === 'all') {
            p.style.display = 'flex';
            return;
            }
            const productType = p.getAttribute('type');
        if (productType === type)
            p.style.display = 'flex';
        else
            p.style.display = 'none';
    })
}

productCards.forEach(p => {
    p.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('section__view-detail')) {
            p.classList.add('active');
            overlay.style.display = 'block';
        }
    })
})


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('nav a[href*="cart.html"] .fa-cart-shopping');
    if (cartIcon) {
        let badge = cartIcon.nextElementSibling;
        if (!badge || !badge.classList.contains('cart-count')) {
            badge = document.createElement('span');
            badge.className = 'cart-count';
            badge.style.cssText = 'position:absolute;top:-8px;right:-8px;background:orange;color:#fff;border-radius:50%;padding:2px 6px;font-size:12px;';
            cartIcon.parentNode.style.position = 'relative';
            cartIcon.parentNode.appendChild(badge);
        }
        badge.textContent = count;
        badge.style.display = count > 0 ? 'inline' : 'none';
    }
}
document.querySelectorAll('.section__add-to-cart').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.stopPropagation();
        const card = btn.closest('.section__product-card');
        const id = Array.from(document.querySelectorAll('.section__product-card')).indexOf(card);
        const name = card.querySelector('.section__product-name')?.textContent.trim();
        const price = card.querySelector('.section__product-price')?.textContent.trim();
        const img = card.querySelector('.section__product-img img')?.src;
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const exist = cart.find(item => item.id === id);
        if (exist) {
            exist.quantity += 1;
        } else {
            cart.push({ id, name, price, img, quantity: 1 });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        alert('Đã thêm vào giỏ hàng!');
    });
});
updateCartCount();

// ...existing code...

// Đăng ký/Đăng nhập đơn giản với localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Hiển thị form
    const signupModal = document.getElementById('signup-modal');
    const loginModal = document.getElementById('login-modal');
    const btnSignup = document.getElementById('btn-signup');
    const btnLogin = document.getElementById('btn-login');
    const btnLogout = document.getElementById('btn-logout');
    const userInfo = document.getElementById('user-info');

    function showSignup() { signupModal.style.display = 'flex'; }
    function hideSignup() { signupModal.style.display = 'none'; }
    function showLogin() { loginModal.style.display = 'flex'; }
    function hideLogin() { loginModal.style.display = 'none'; }

    btnSignup && btnSignup.addEventListener('click', showSignup);
    btnLogin && btnLogin.addEventListener('click', showLogin);

    // Đăng ký
    document.getElementById('signup-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('signup-username').value.trim();
        const password = document.getElementById('signup-password').value;
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.find(u => u.username === username)) {
            document.getElementById('signup-msg').textContent = 'Tên đăng nhập đã tồn tại!';
            return;
        }
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        document.getElementById('signup-msg').textContent = 'Đăng ký thành công! Bạn có thể đăng nhập.';
        setTimeout(() => { hideSignup(); }, 1000);
    };

    // Đăng nhập
    document.getElementById('login-form').onsubmit = function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value.trim();
        const password = document.getElementById('login-password').value;
        let users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.username === username && u.password === password);
        if (!user) {
            document.getElementById('login-msg').textContent = 'Sai tên đăng nhập hoặc  mật khẩu!!';
            return;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        hideLogin();
        updateUserUI();
    };

    // Đăng xuất
    btnLogout && btnLogout.addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        updateUserUI();
    });

    // Ẩn form khi click ra ngoài
    [signupModal, loginModal].forEach(modal => {
        if (!modal) return;
        modal.addEventListener('click', function(e) {
            if (e.target === modal) modal.style.display = 'none';
        });
    });

    // Hiển thị tên người dùng khi đã đăng nhập
    function updateUserUI() {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null');
        if (user) {
            userInfo.textContent = 'Xin chào, ' + user.username;
            btnSignup.style.display = 'none';
            btnLogin.style.display = 'none';
            btnLogout.style.display = '';
        } else {
            userInfo.textContent = '';
            btnSignup.style.display = '';
            btnLogin.style.display = '';
            btnLogout.style.display = 'none';
        }
    }
    updateUserUI();
});