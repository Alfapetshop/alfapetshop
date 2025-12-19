// ============================================================================
// ALFAPETSHOP - ADMIN PANEL FOR SHOP
// With image upload functionality
// ============================================================================

// Check authentication
if (localStorage.getItem('alfapetshop_admin_logged_in') !== 'true') {
    window.location.href = 'admin-login.html';
}

document.getElementById('admin-name').textContent = 
    localStorage.getItem('alfapetshop_admin_username') || 'Admin';

// ============================================================================
// DATA MANAGEMENT
// ============================================================================

function getProducts() {
    if (typeof getAllProducts !== 'undefined') {
        return getAllProducts();
    }
    return JSON.parse(localStorage.getItem('alfapetshop_products')) || {};
}

function saveProducts(products) {
    localStorage.setItem('alfapetshop_products', JSON.stringify(products));
}

// ============================================================================
// STATISTICS
// ============================================================================

function updateStats() {
    const products = getProducts();
    document.getElementById('total-products').textContent = Object.keys(products).length;
}

// ============================================================================
// NAVIGATION
// ============================================================================

function showSection(sectionName) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    document.getElementById(sectionName + '-section').classList.add('active');
    
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    if (sectionName === 'products') {
        loadProducts();
    }
}

// ============================================================================
// PRODUCTS MANAGEMENT
// ============================================================================

function loadProducts() {
    const products = getProducts();
    const container = document.getElementById('products-grid');
    
    if (Object.keys(products).length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <i class="fas fa-box-open" style="font-size: 4rem; color: #ccc; margin-bottom: 20px;"></i>
                <p style="color: #666; font-size: 1.1rem;">Belum ada produk dalam katalog</p>
                <p style="color: #999; margin-top: 10px;">Klik "Tambah Produk Baru" untuk mulai</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    Object.values(products).forEach(product => {
        html += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='img/logo.png'">
                <div class="product-card-body">
                    <div class="brand" style="color: #667eea; text-transform: uppercase; font-size: 0.75rem; font-weight: 600; margin-bottom: 5px;">
                        ${product.brand}
                    </div>
                    <h4 style="margin-bottom: 8px;">${product.name}</h4>
                    <div class="price">Rp ${product.price.toLocaleString('id-ID')}</div>
                    <div class="product-actions">
                        <button class="btn-edit" onclick="editProduct('${product.id}')">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn-delete" onclick="deleteProduct('${product.id}')">
                            <i class="fas fa-trash"></i> Hapus
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================================================
// IMAGE UPLOAD
// ============================================================================

let currentImageData = null;

function previewImage(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
        alert('⚠️ Ukuran file terlalu besar! Maksimal 2MB');
        return;
    }
    
    // Check file type
    if (!file.type.match('image.*')) {
        alert('⚠️ File harus berupa gambar (JPG, PNG, dll)');
        return;
    }
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        currentImageData = e.target.result;
        
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${currentImageData}" style="max-width: 100%; max-height: 200px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <button type="button" onclick="removeImage()" style="position: absolute; top: 10px; right: 10px; background: #f44336; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer; font-size: 1.2rem; line-height: 1;">
                    ×
                </button>
            </div>
            <p style="margin-top: 10px; font-size: 0.85rem; color: #666;">
                <i class="fas fa-check-circle" style="color: #4caf50;"></i> Gambar siap diupload
            </p>
        `;
    };
    
    reader.readAsDataURL(file);
}

function removeImage() {
    currentImageData = null;
    document.getElementById('image-file').value = '';
    document.getElementById('image-preview').innerHTML = '';
}

// ============================================================================
// MODAL FUNCTIONS
// ============================================================================

function openAddProductModal() {
    document.getElementById('modal-title').textContent = 'Tambah Produk Baru';
    document.getElementById('product-form').reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').innerHTML = '';
    currentImageData = null;
    document.getElementById('product-modal').classList.add('active');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.remove('active');
    currentImageData = null;
}

function editProduct(productId) {
    const products = getProducts();
    const product = products[productId];
    
    if (!product) return;
    
    document.getElementById('modal-title').textContent = 'Edit Produk';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-brand').value = product.brand;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-desc').value = product.desc || '';
    
    // Show existing image
    if (product.image) {
        currentImageData = product.image;
        document.getElementById('image-preview').innerHTML = `
            <div style="position: relative; display: inline-block;">
                <img src="${product.image}" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                <button type="button" onclick="removeImage()" style="position: absolute; top: 10px; right: 10px; background: #f44336; color: white; border: none; width: 30px; height: 30px; border-radius: 50%; cursor: pointer;">×</button>
            </div>
        `;
    }
    
    document.getElementById('product-modal').classList.add('active');
}

// ============================================================================
// SAVE PRODUCT
// ============================================================================

function saveProduct(event) {
    event.preventDefault();
    
    // Check if image is uploaded
    if (!currentImageData) {
        alert('⚠️ Silakan upload gambar produk terlebih dahulu!');
        return;
    }
    
    const products = getProducts();
    let productId = document.getElementById('product-id').value;
    
    // Generate ID for new product
    if (!productId) {
        productId = 'p' + Date.now();
    }
    
    const productData = {
        id: productId,
        name: document.getElementById('product-name').value,
        brand: document.getElementById('product-brand').value,
        price: parseInt(document.getElementById('product-price').value),
        desc: document.getElementById('product-desc').value || 'Produk makanan kucing berkualitas',
        image: currentImageData
    };
    
    products[productId] = productData;
    saveProducts(products);
    
    closeProductModal();
    loadProducts();
    updateStats();
    
    // Show success notification
    showNotification('✅ Produk berhasil disimpan!', 'success');
}

// ============================================================================
// DELETE PRODUCT
// ============================================================================

function deleteProduct(productId) {
    if (!confirm('⚠️ Yakin ingin menghapus produk ini?\n\nProduk yang dihapus tidak dapat dikembalikan.')) {
        return;
    }
    
    const products = getProducts();
    delete products[productId];
    saveProducts(products);
    
    loadProducts();
    updateStats();
    
    showNotification('🗑️ Produk berhasil dihapus', 'info');
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================

function showNotification(message, type = 'success') {
    const existing = document.querySelector('.admin-notification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.className = 'admin-notification';
    notification.textContent = message;
    
    const colors = {
        success: 'linear-gradient(135deg, #4caf50, #45a049)',
        error: 'linear-gradient(135deg, #f44336, #e53935)',
        info: 'linear-gradient(135deg, #2196f3, #1976d2)'
    };
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '-400px',
        background: colors[type] || colors.success,
        color: 'white',
        padding: '16px 24px',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        zIndex: '99999',
        transition: 'right 0.4s ease',
        fontWeight: '600',
        fontSize: '0.95rem'
    });
    
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.right = '20px', 100);
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ============================================================================
// LOGOUT
// ============================================================================

function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('alfapetshop_admin_logged_in');
        localStorage.removeItem('alfapetshop_admin_username');
        window.location.href = 'admin-login.html';
    }
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    updateStats();
    loadProducts();
});

console.log('[Admin Shop Panel] Ready for shop management!');
