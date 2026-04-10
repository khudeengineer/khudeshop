// Khude Engineer Academy - Main Script
console.log("🚀 KEA Script Loaded");

const PHONE_NUMBER = "8801736009324"; // Updated to user's number

interface CartItem {
    id: string;
    title: string;
    price: number;
    image: string;
    quantity: number;
}

interface ProductSearchItem {
    id: string;
    title: string;
    category: string;
    price: number;
    image: string;
}

// --- Cart Utilities ---
function getCart(): CartItem[] {
    try {
        const cartStr = localStorage.getItem('kea_cart');
        if (!cartStr) return [];
        const cart = JSON.parse(cartStr);
        if (!Array.isArray(cart)) return [];
        
        return cart.filter(item => item && item.id).map(item => ({
            id: String(item.id),
            title: String(item.title || 'Unknown Product'),
            price: Number(item.price) || 0,
            image: String(item.image || ''),
            quantity: Math.max(1, Number(item.quantity) || 1)
        }));
    } catch (e) {
        return [];
    }
}

function saveCart(cart: CartItem[]) {
    localStorage.setItem('kea_cart', JSON.stringify(cart));
    updateCartCounter();
}

function updateCartCounter() {
    const cart = getCart();
    const counters = document.querySelectorAll('#cart-counter');
    const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    
    counters.forEach(counter => {
        counter.textContent = totalItems.toString();
        counter.classList.add('scale-125');
        setTimeout(() => counter.classList.remove('scale-125'), 200);
    });
}

// --- Theme Logic ---
function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// --- Search Logic ---
function initSearch() {
    const searchInput = document.getElementById('global-search') as HTMLInputElement;
    const mobileSearchInput = document.getElementById('mobile-search') as HTMLInputElement;
    const resultsDropdown = document.getElementById('search-results');
    const resultsList = document.getElementById('search-results-list');
    const searchDataEl = document.getElementById('search-data');

    if (!searchInput || !resultsDropdown || !resultsList || !searchDataEl) return;

    let products: ProductSearchItem[] = [];
    try {
        products = JSON.parse(searchDataEl.textContent || '[]');
    } catch (e) {
        console.error("Failed to parse search data", e);
    }

    const performSearch = (query: string) => {
        if (!query.trim()) {
            resultsDropdown.classList.add('hidden');
            return;
        }

        const matches = products.filter(p => 
            p.title.toLowerCase().includes(query.toLowerCase()) || 
            p.category.toLowerCase().includes(query.toLowerCase())
        ).slice(0, 6);

        if (matches.length > 0) {
            resultsList.innerHTML = matches.map(p => `
                <a href="/product/${p.id}" class="flex items-center gap-4 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 rounded-xl transition-colors group">
                    <img src="${p.image}" class="w-12 h-12 rounded-lg object-cover" />
                    <div>
                        <h4 class="text-sm font-bold text-slate-900 dark:text-white group-hover:text-brand-blue transition-colors">${p.title}</h4>
                        <p class="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold">${p.category}</p>
                        <p class="text-xs font-black text-brand-blue">৳${p.price}</p>
                    </div>
                </a>
            `).join('');
            resultsDropdown.classList.remove('hidden');
        } else {
            resultsList.innerHTML = `<div class="p-4 text-center text-slate-500 dark:text-slate-400 text-sm font-medium">কোনো প্রোডাক্ট পাওয়া যায়নি</div>`;
            resultsDropdown.classList.remove('hidden');
        }
    };

    searchInput.addEventListener('input', (e) => performSearch((e.target as HTMLInputElement).value));
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('input', (e) => performSearch((e.target as HTMLInputElement).value));
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
        if (!resultsDropdown.contains(e.target as Node) && e.target !== searchInput) {
            resultsDropdown.classList.add('hidden');
        }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') resultsDropdown.classList.add('hidden');
    });
}

// --- Main Init ---
function init() {
    console.log("📦 Initializing KEA logic...");
    
    // Core Handlers
    initTheme();
    initSearch();

    // 1. Mobile Menu Logic
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        if (!(mobileMenuBtn as any)._hasKEAHandler) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileMenu.classList.toggle('hidden');
            });
            (mobileMenuBtn as any)._hasKEAHandler = true;
        }
        
        if (!(document as any)._hasKEAMenuHandler) {
             document.addEventListener('click', (e) => {
                if (!mobileMenu.contains(e.target as Node) && !mobileMenuBtn.contains(e.target as Node)) {
                    mobileMenu.classList.add('hidden');
                }
            });
            (document as any)._hasKEAMenuHandler = true;
        }
    }

    // 2. Add to Cart Logic
    document.querySelectorAll('.btn-add-cart').forEach(btn => {
        if ((btn as any)._hasKEAHandler) return;
        (btn as any)._hasKEAHandler = true;

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');
            const title = btn.getAttribute('data-title');
            const price = parseFloat(btn.getAttribute('data-price') || "0");
            const image = btn.getAttribute('data-image');

            if (!id) return;

            let cart = getCart();
            const existingItem = cart.find(item => item.id === id);

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ 
                    id, 
                    title: title || 'Product', 
                    price: isNaN(price) ? 0 : price, 
                    image: image || '', 
                    quantity: 1 
                });
            }

            saveCart(cart);
            
            const originalIcon = btn.innerHTML;
            btn.innerHTML = '<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>';
            btn.classList.add('bg-brand-green', 'text-white');
            btn.classList.remove('bg-slate-100', 'text-slate-900');
            
            setTimeout(() => {
                btn.innerHTML = originalIcon;
                btn.classList.remove('bg-brand-green', 'text-white');
                btn.classList.add('bg-slate-100', 'text-slate-900');
            }, 1000);
        });
    });

    // 3. Buy with WP (Single Product)
    document.querySelectorAll('.btn-buy-wp').forEach(btn => {
        if ((btn as any)._hasKEAHandler) return;
        (btn as any)._hasKEAHandler = true;

        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const price = btn.getAttribute('data-price');
            const message = `আসসালামু আলাইকুম, আমি এই প্রোডাক্টটি নিতে চাই:\n\nপণ্য: ${title}\nমূল্য: ${price} টাকা।`;
            const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    });

    // 4. Cart Page Hydration
    if (window.location.pathname.includes('/cart')) {
        renderCartPage();
    }
    
    updateCartCounter();
}

function renderCartPage() {
    const container = document.getElementById('cart-container');
    const itemsListTpl = document.getElementById('cart-layout-tpl') as HTMLTemplateElement;
    const emptyCartTpl = document.getElementById('empty-cart-tpl') as HTMLTemplateElement;
    const itemTpl = document.getElementById('cart-item-tpl') as HTMLTemplateElement;

    if (!container || !itemsListTpl || !emptyCartTpl || !itemTpl) return;

    const cart = getCart();

    if (cart.length === 0) {
        container.innerHTML = '';
        container.appendChild(emptyCartTpl.content.cloneNode(true));
        return;
    }

    container.innerHTML = '';
    const layout = itemsListTpl.content.cloneNode(true) as DocumentFragment;
    container.appendChild(layout);

    const itemsContainer = document.getElementById('cart-items-list');
    const summaryCount = document.getElementById('cart-summary-count');
    const summaryTotal = document.getElementById('cart-summary-total');
    const checkoutBtn = document.getElementById('checkout-wp-btn');

    let grandTotal = 0;
    let totalQty = 0;

    cart.forEach(item => {
        const itemEl = itemTpl.content.cloneNode(true) as HTMLElement;
        
        const img = itemEl.querySelector('.item-img');
        const title = itemEl.querySelector('.item-title');
        const price = itemEl.querySelector('.item-price');
        const qty = itemEl.querySelector('.item-qty');

        if (img) img.setAttribute('src', item.image);
        if (img) img.setAttribute('alt', item.title);
        if (title) title.textContent = item.title;
        if (price) price.textContent = item.price.toString();
        if (qty) qty.textContent = item.quantity.toString();

        grandTotal += (item.price * item.quantity);
        totalQty += item.quantity;

        // Qty Decrease
        itemEl.querySelector('.btn-qty-dec')?.addEventListener('click', () => {
            updateItemQuantity(item.id, -1);
        });

        // Qty Increase
        itemEl.querySelector('.btn-qty-inc')?.addEventListener('click', () => {
            updateItemQuantity(item.id, 1);
        });

        // Remove
        itemEl.querySelector('.btn-remove')?.addEventListener('click', () => {
            removeItem(item.id);
        });

        itemsContainer?.appendChild(itemEl);
    });

    if (summaryCount) summaryCount.textContent = totalQty.toString();
    if (summaryTotal) summaryTotal.textContent = grandTotal.toString();

    if (checkoutBtn) {
        const newBtn = checkoutBtn.cloneNode(true);
        checkoutBtn.parentNode?.replaceChild(newBtn, checkoutBtn);

        newBtn.addEventListener('click', () => {
            let message = `আসসালামু আলাইকুম, আমি নিচের প্রোডাক্টগুলো অর্ডার করতে চাই:\n\n`;
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.title} (${item.quantity}x) - ${item.price * item.quantity} টাকা।\n`;
            });
            message += `\n------------------\n`;
            message += `সর্বমোট: ${grandTotal} টাকা।`;
            
            const url = `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank');
        });
    }
}

function updateItemQuantity(id: string, delta: number) {
    let cart = getCart();
    const item = cart.find(i => i.id === id);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        saveCart(cart);
        renderCartPage();
    }
}

function removeItem(id: string) {
    let cart = getCart();
    cart = cart.filter(i => i.id !== id);
    saveCart(cart);
    renderCartPage();
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('astro:after-swap', init);
