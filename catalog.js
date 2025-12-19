// ============================================================================
// ALFAPETSHOP - CATALOG SYSTEM (SIMPLE VERSION)
// Pure catalog, no cart/checkout
// ============================================================================

// Product Database
const CATALOG_PRODUCTS = {
    'f1': { id: 'f1', name: 'Cat Food Pouch 85gr', brand: 'coucou', price: 6890, image: 'img/produk/f1.jpg', desc: 'Makanan kucing pouch dengan rasa tuna segar' },
    'f2': { id: 'f2', name: 'Salmon Cat Food 20kg', brand: 'bolt', price: 450000, image: 'img/produk/f2.jpg', desc: 'Cat food premium dengan kandungan salmon tinggi' },
    'f3': { id: 'f3', name: 'Dormeos Kitten 10kg', brand: 'dormeos', price: 50000, image: 'img/produk/f3.jpg', desc: 'Makanan khusus untuk anak kucing' },
    'f4': { id: 'f4', name: 'Fresh Tuna Sardine 400gr', brand: 'cici', price: 18000, image: 'img/produk/f4.jpg', desc: 'Makanan basah dengan tuna sarden segar' },
    'f5': { id: 'f5', name: 'Dormoes Feline 1kg', brand: 'dormoes', price: 52000, image: 'img/produk/f5.jpg', desc: 'Nutrisi lengkap untuk kucing dewasa' },
    'f6': { id: 'f6', name: 'Equilibrio Adult All Breed 1.5kg', brand: 'equilibrio', price: 160000, image: 'img/produk/f6.jpg', desc: 'Formula seimbang untuk semua ras kucing' },
    'f7': { id: 'f7', name: 'Equilibrio Persian All Breed 1.5kg', brand: 'equilibrio', price: 165000, image: 'img/produk/f7.jpg', desc: 'Khusus untuk kucing ras Persia' },
    'f8': { id: 'f8', name: 'Royal Canin Kitten 400gr', brand: 'royal canin', price: 168000, image: 'img/produk/f8.jpg', desc: 'Premium kitten food dari Royal Canin' },
    'n1': { id: 'n1', name: 'Whiskas Adult Tuna 1.2kg', brand: 'whiskas', price: 85000, image: 'img/produk2/n1.jpg', desc: 'Makanan kucing dewasa dengan rasa tuna' },
    'n2': { id: 'n2', name: 'Friskies Seafood Sensations 1.2kg', brand: 'friskies', price: 95000, image: 'img/produk2/n2.jpg', desc: 'Sensasi seafood untuk kucing kesayangan' },
    'n3': { id: 'n3', name: 'Meow Mix Original Choice 1.43kg', brand: 'meow mix', price: 120000, image: 'img/produk2/n3.jpg', desc: 'Formula original dengan nutrisi lengkap' },
    'n4': { id: 'n4', name: 'Purina Cat Chow Complete 1.42kg', brand: 'purina', price: 110000, image: 'img/produk2/n4.jpg', desc: 'Nutrisi lengkap dari Purina' }
};

// Get products from localStorage (for admin added products)
function getAllProducts() {
    const storedProducts = JSON.parse(localStorage.getItem('alfapetshop_products')) || {};
    // Merge: default products + admin uploaded products
    const allProducts = { ...CATALOG_PRODUCTS, ...storedProducts };
    console.log('[Catalog] Total products:', Object.keys(allProducts).length);
    return allProducts;
}

// Get single product by ID
function getProduct(productId) {
    const allProducts = getAllProducts();
    return allProducts[productId] || null;
}

// Export for global access
window.CATALOG_PRODUCTS = CATALOG_PRODUCTS;
window.getAllProducts = getAllProducts;
window.getProduct = getProduct;

console.log('[AlfaPetshop Catalog] System loaded!');
