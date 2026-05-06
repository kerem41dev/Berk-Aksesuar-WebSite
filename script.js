const SUPABASE_URL = 'https://uutgeyfwypsdqourgogo.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_3-jkstvE5TWCRj6d_kuqOQ_6edUP788';

// Burada ismi supabaseClient yaptık
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- VERİ ÇEKME FONKSİYONU (GÜNCEL) ---
async function fetchProducts(categoryId = null) {
    try {
        let query = supabaseClient
            .from('products')
            .select('*, categories(name)');

        // Eğer bir kategoriye tıklandıysa, sadece o kategoriyi getir
        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        const { data: products, error } = await query;

        if (error) throw error;
        
        // Ürünleri ekrana bas
        renderAllProducts(products);
    } catch (error) {
        console.error('Veri çekilirken hata oluştu:', error.message);
    }
}

// --- ÜRÜNLERİ LİSTELEME FONKSİYONU (GÜNCEL) ---
function renderAllProducts(products) {
    const allGrid = document.getElementById('all-categories');
    if (!allGrid) return;

    allGrid.innerHTML = ''; // Önce alanı temizle

    // --- GERİ DÖN BUTONU ---
    const backButtonHTML = `
        <div class="col-span-full mb-8 flex justify-start">
            <button onclick="renderCategories()" class="flex items-center gap-2 text-emerald-800 font-bold hover:text-emerald-600 transition-all duration-300 group">
                <span class="p-2 rounded-full bg-emerald-50 group-hover:bg-emerald-100 transition-colors">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i>
                </span>
                KATEGORİLERE GERİ DÖN
            </button>
        </div>
    `;
    allGrid.insertAdjacentHTML('beforeend', backButtonHTML);

    // --- BOŞ KATEGORİ KONTROLÜ ---
    if (!products || products.length === 0) {
        allGrid.insertAdjacentHTML('beforeend', `
            <div class="col-span-full text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <i data-lucide="package-search" class="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                <p class="text-gray-500 font-medium">Bu kategoride henüz ürün bulunmuyor.</p>
                <button onclick="renderCategories()" class="mt-4 text-emerald-700 underline font-bold">Diğer kategorilere göz at</button>
            </div>
        `);
    } else {
        // --- ÜRÜN KARTLARINI DİZ ---
        products.forEach(product => {
            const firstImage = product.images && product.images.length > 0 
                ? product.images[0] 
                : 'https://via.placeholder.com/400x300?text=Resim+Yok';

            const productHTML = `
                <div class="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 h-full">
                    <div class="h-64 overflow-hidden relative">
                        <img src="${firstImage}" alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    </div>
                    <div class="p-8 flex flex-col items-center text-center flex-1">
                        <div class="text-emerald-800 font-bold text-xs mb-2 uppercase tracking-widest">
                            ${product.categories?.name || 'Genel'}
                        </div>
                        <h3 class="text-xl font-bold text-gray-900 mb-3">${product.name}</h3>
                        <p class="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
                            ${product.description || ''}
                        </p>
                        <button onclick="switchPage('contact')" class="w-full py-3 bg-emerald-800 text-white font-bold rounded uppercase hover:bg-emerald-700 transition">
                            SİPARİŞ VER
                        </button>

                        <button onclick="openSubGallery(${JSON.stringify(product).split('"').join('&quot;')})" class="w-full py-3 border border-emerald-800 text-emerald-800 font-bold rounded uppercase hover:bg-emerald-50 transition">
                            ÜRÜNLERİ İNCELE
                        </button>   
                    </div>
                </div>
            `;
            allGrid.insertAdjacentHTML('beforeend', productHTML);
        });
    }

    lucide.createIcons(); // İkonları canlandır
    allGrid.scrollIntoView({ behavior: 'smooth' }); // Ürünlerin başına otomatik kaydır
}
// --- ÜRÜN İNCELEME (ALT GALERİ) SAYFASI ---
function openSubGallery(product) {
    const allGrid = document.getElementById('all-categories');
    if (!allGrid) return;

    allGrid.innerHTML = ''; // Mevcut ürünleri temizle

    // 1. SOL ÜST GERİ DÖN BUTONU VE BAŞLIK
    const headerHTML = `
        <div class="col-span-full mb-10">
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <button onclick="renderCategories()" class="flex items-center gap-2 text-emerald-800 font-bold hover:underline uppercase text-sm">
                    <i data-lucide="arrow-left" class="w-5 h-5"></i> 
                    ÜRÜNLERE DÖN
                </button>
                <h2 class="text-2xl font-bold text-gray-800 border-b-2 border-emerald-800 pb-2">
                    ${product.name}

                </h2>
            </div>
            <div class="p-5 mt-4 bg-emerald-50 border-l-8 border-emerald-800 rounded-r-lg shadow-sm text-left">
            <div class="text-emerald-900 font-medium italic leading-relaxed">
                ${product.description || 'Bu kategorideki tüm seçkin marka ve modellerimiz stoklarımızda mevcuttur.'}
            </div>
        </div>
        </div>
        </div>
    `;
    allGrid.insertAdjacentHTML('beforeend', headerHTML);

    // 2. FOTOĞRAFLAR VE SİPARİŞ BUTONLARI
    product.images.forEach(imgUrl => {
        const itemHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative group">
                <img src="${imgUrl}" class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute bottom-4 right-4">
                    <button onclick="switchPage('contact')" class="px-6 py-2 bg-emerald-800 text-white font-bold rounded-full shadow-lg hover:bg-emerald-700 transition uppercase text-xs">
                        SİPARİŞ VER
                    </button>
                </div>
            </div>
        `;
        allGrid.insertAdjacentHTML('beforeend', itemHTML);
    });

    // İkonları ve ekranı tazele
    lucide.createIcons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- SAYFA YÜKLENDİĞİNDE ÇALIŞTIR --- (Satır 74-81)
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    renderSlides();
    renderCategories(); // Statik kategoriler için
    //fetchProducts();    // Supabase'den ürünleri çekmek için
    startSliderInterval();
});
// --- ÜRÜN VE SLIDER VERİLERİ ---
const CATEGORIES = [
  { id: 1, title: "Mobilya Aksesuarları", desc: "Evinizin detaylarındaki şıklık. Kulplar, ayaklar ve bağlantı elemanları.", icon: "armchair", img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800" },
  { id: 2, title: "Mutfak & Banyo", desc: "Fonksiyonel ve estetik çözümler. Havluluklar, raflar ve düzenleyiciler.", icon: "bath", img: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800" },
  { id: 3, title: "Hırdavat Malzemeleri", desc: "Profesyonel projeleriniz için dayanıklı ve kaliteli teknik donanımlar.", icon: "wrench", img: "https://images.unsplash.com/photo-1581783898377-1c85bf937427?auto=format&fit=crop&q=80&w=800" },

];

const SLIDES = [
  { id: 1, title: "Detaylardaki Mükemmellik", subtitle: "Modern ve lüks mobilya aksesuarları.", img: "img/magaza3.jpeg" },
  { id: 2, title: "Eviniz İçin Şık Çözümler", subtitle: "Fonksiyonelliği estetikle buluşturan tasarımlar.", img: "img/magaza2.jpeg" },
  { id: 3, title: "Kaliteli Hırdavat", subtitle: "Projeleriniz için en sağlam yapı taşları.", img: "img/magaza6.jpeg" }
];

// --- NAVİGASYON (GÜNCEL) ---
function switchPage(pageId) {
    document.querySelectorAll('.page-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(`page-${pageId}`).classList.remove('hidden');
    
    // YENİ: Ürünler sayfasına tıklandığında kategorileri (vaktini) sıfırla
    if (pageId === 'products') {
        renderCategories(); 
    }

    document.querySelectorAll('.nav-btn').forEach(btn => {
        if(btn.dataset.target === pageId) {
            btn.classList.add('text-emerald-800', 'font-bold', 'border-b-2', 'border-yellow-400');
            btn.classList.remove('text-gray-500');
        } else {
            btn.classList.remove('text-emerald-800', 'font-bold', 'border-b-2', 'border-yellow-400');
            btn.classList.add('text-gray-500');
        }
    });

    document.getElementById('mobile-menu').classList.add('hidden');
    window.scrollTo(0,0);
}
// --- SLIDER FONKSİYONLARI ---
let currentSlideIndex = 0;
let sliderInterval;

function renderSlides() {
    const container = document.getElementById('slider-container');
    if(!container) return;
    
    SLIDES.forEach((slide, index) => {
        const slideHTML = `
            <div class="slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                <img src="${slide.img}" alt="${slide.title}" class="w-full h-full object-cover opacity-60">
                <div class="absolute inset-0 bg-gradient-to-t from-emerald-900/80 to-transparent flex items-center justify-center text-center px-4">
                    <div class="max-w-4xl mx-auto">
                        <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 font-serif tracking-wide">${slide.title}</h1>
                        <p class="text-lg md:text-2xl text-yellow-50 mb-8 font-light">${slide.subtitle}</p>
                        <button onclick="switchPage('products')" class="px-8 py-3 bg-yellow-500 text-emerald-900 font-bold rounded-sm hover:bg-yellow-400 transition shadow-lg uppercase tracking-wider">Ürünleri Keşfet</button>
                    </div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('afterbegin', slideHTML); 
    });
}

function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    currentSlideIndex = index;
}

function nextSlide() {
    let next = (currentSlideIndex + 1) % SLIDES.length;
    showSlide(next);
}

function prevSlide() {
    let prev = (currentSlideIndex - 1 + SLIDES.length) % SLIDES.length;
    showSlide(prev);
}

function startSliderInterval() {
    sliderInterval = setInterval(nextSlide, 4500);
}

// Slider Butonları
const nextBtn = document.getElementById('next-slide');
const prevBtn = document.getElementById('prev-slide');

if(nextBtn) nextBtn.addEventListener('click', () => {
    clearInterval(sliderInterval);
    nextSlide();
    startSliderInterval();
});

if(prevBtn) prevBtn.addEventListener('click', () => {
    clearInterval(sliderInterval);
    prevSlide();
    startSliderInterval();
});


// YENİ VERİLERİ BURAYA EKLE (GÜVENLİ BÖLGE)
const ABOUT_PHOTOS = [
    "img/magaza4.jpeg",
    "img/magaza3.jpeg",
    "img/magaza2.jpeg",
    "img/magaza6.jpeg",
    "img/magaza7.jpeg"
];
let currentAboutIndex = 0;





// --- KATEGORİ RENDER FONKSİYONU (DÜZELTİLMİŞ) ---
function renderCategories() {
    const homeGrid = document.getElementById('home-categories');
    const allGrid = document.getElementById('all-categories');
    
    // Ana Sayfa Kart Yapısı (Overlay)
    const createHomeCard = (cat) => `
        <div onclick="switchPage('products'); fetchProducts(${cat.id});" class="group relative h-[350px] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
            <img src="${cat.img}" alt="${cat.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
            <div class="absolute bottom-0 left-0 p-6 w-full flex items-end">
                <div class="flex items-center gap-4">
                    <div class="text-secondary">
                        <i data-lucide="${cat.icon}" class="w-8 h-8"></i>
                    </div>
                    <div>
                         <h3 class="text-white text-xl md:text-2xl font-bold tracking-wide leading-tight">${cat.title}</h3>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Ürünler Sayfası Kart Yapısı (Beyaz Kutu)
    const createProductCard = (cat) => `
        <div class="group bg-white rounded-lg shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-gray-100 h-full">
            <div class="h-64 overflow-hidden relative">
                <img src="${cat.img}" alt="${cat.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
            </div>
            <div class="p-8 flex flex-col items-center text-center flex-1">
                <div class="text-yellow-500 mb-4">
                     <i data-lucide="${cat.icon}" class="w-8 h-8"></i>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3">${cat.title}</h3>
                <p class="text-gray-500 text-sm mb-8 leading-relaxed line-clamp-3">
                    ${cat.desc}
                </p>
                <button onclick="fetchProducts(${cat.id})" class="mt-auto px-6 py-3 border border-emerald-800 text-emerald-800 font-bold text-sm rounded hover:bg-emerald-800 hover:text-white transition-colors duration-300 tracking-wide uppercase">
                    ÜRÜNLERİ GÖR
                </button>
            </div>
        </div>
    `;

    if(homeGrid) {
        homeGrid.innerHTML = '';
        CATEGORIES.slice(0,3).forEach(cat => {
            homeGrid.insertAdjacentHTML('beforeend', createHomeCard(cat));
        });
    }

    if(allGrid) {
        allGrid.innerHTML = '';
        CATEGORIES.forEach(cat => {
            allGrid.insertAdjacentHTML('beforeend', createProductCard(cat));
        });
    }
    
    lucide.createIcons();
}

//mail gönderme
async function handleContactSubmit(event) {
    event.preventDefault(); // Sayfanın yenilenmesini (refresh) engeller kral

    const btn = event.target.querySelector('button');
    const originalBtnText = btn.innerText;
    
    // Formdaki bilgileri paketliyoruz
    const formData = {
        from_name: document.getElementById('name').value, // 'Ad Soyad' kutusunun ID'si
        from_email: document.getElementById('email').value, // 'E-Posta' kutusunun ID'si
        message: document.getElementById('message').value   // 'Mesajınız' kutusunun ID'si
    };

    try {
        btn.innerText = "GÖNDERİLİYOR...";
        btn.disabled = true;

        // EmailJS'ye gönderim emri veriyoruz
        await emailjs.send(
            "service_8or6ljh",    // Senin Service ID'n
            "template_uduxwph",   // Senin Template ID'n (Dashboard'dan tekrar kontrol et kral)
            formData,
            "qywmL3Z_ElM3XbMar"   // Public Key'i buraya da ekleyelim, işi sağlama alalım
        );

        alert("Mesajın berkaksesuar41@gmail.com adresine iletildi!");
        event.target.reset(); // Formu tertemiz yapar
    } catch (error) {
        console.error("Hata çıktı:", error);
        alert("Bir aksilik oldu, WhatsApp'tan yazmayı dener misin?");
    } finally {
        btn.innerText = originalBtnText;
        btn.disabled = false;
    }
}

// burger butonuna basınca aç-kapa yapar
window.toggleMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.toggle('hidden');
        menu.classList.toggle('flex');
    }
};

// SEKMELERE BASINCA ZORLA KAPATIR (Aradığımız çözüm bu kral!)
window.closeMobileMenu = function() {
    const menu = document.getElementById('mobile-menu');
    if (menu) {
        menu.classList.add('hidden');
        menu.classList.remove('flex');
    }
};

// HAKKIMIZDA SLIDER 
window.initAboutSlider = function() {
    const container = document.getElementById('about-slider-container');
    if (!container) return;

    // Fotoğrafları bir kereye mahsus oluşturuyoruz
    container.innerHTML = ABOUT_PHOTOS.map((img, index) => `
        <div class="about-slide absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === 0 ? 'opacity-100' : 'opacity-0'}" data-index="${index}">
            <img src="${img}" class="w-full h-full object-cover">
        </div>
    `).join('');
};

window.updateAboutSlider = function() {
    const slides = document.querySelectorAll('.about-slide');
    slides.forEach((slide, index) => {
        if (index === currentAboutIndex) {
            slide.classList.replace('opacity-0', 'opacity-100');
        } else {
            slide.classList.replace('opacity-100', 'opacity-0');
        }
    });
};

window.nextAboutSlide = function() {
    currentAboutIndex = (currentAboutIndex + 1) % ABOUT_PHOTOS.length;
    updateAboutSlider();
};

window.prevAboutSlide = function() {
    currentAboutIndex = (currentAboutIndex - 1 + ABOUT_PHOTOS.length) % ABOUT_PHOTOS.length;
    updateAboutSlider();
};

// Sayfa yüklendiğinde slider'ı kur ve 2 saniyede bir döndür
document.addEventListener('DOMContentLoaded', () => {
    initAboutSlider();
    setInterval(nextAboutSlide, 3500); // 2 saniyede bir otomatik geçiş
});