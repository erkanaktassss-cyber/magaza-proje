import { Category, Order, Product } from './types';

export const whatsappNumber = '905551112233';

export const categories: Category[] = [
  { id: 'perfume', name: 'Parfüm', type: 'perfume', description: 'Kalıcı imza kokular ve özel koleksiyonlar.', imageTone: 'from-stone-900 via-stone-700 to-gold', featured: true },
  { id: 'essence', name: 'Parfüm Esansı', type: 'essence', description: 'Üretim ve kişisel kullanım için yoğun esanslar.', imageTone: 'from-amber-900 via-yellow-700 to-champagne', featured: true },
  { id: 'natural-soap', name: 'Doğal Sabun', type: 'soap', description: 'Zeytinyağlı, bitkisel ve nazik temizlik ürünleri.', imageTone: 'from-lime-900 via-lime-700 to-cream', featured: true },
  { id: 'handmade-soap', name: 'El Yapımı Sabun', type: 'soap', description: 'Atölye üretimi dekoratif ve aromatik sabunlar.', imageTone: 'from-purple-900 via-pink-700 to-cream', featured: true },
  { id: 'care', name: 'Doğal Krem & Balm', type: 'care', description: 'Dudak balmı, doğal krem ve bakım ritüelleri.', imageTone: 'from-orange-900 via-amber-600 to-cream', featured: true },
  { id: 'aromatherapy', name: 'Aromaterapi', type: 'aromatherapy', description: 'Uçucu yağlar, roll-onlar ve wellness ürünleri.', imageTone: 'from-emerald-950 via-teal-700 to-cream', featured: false },
  { id: 'candle', name: 'Mum', type: 'candle', description: 'Premium soya mumları ve dekoratif kokulu mumlar.', imageTone: 'from-neutral-950 via-yellow-800 to-cream', featured: false },
  { id: 'epoxy', name: 'Epoksi Hediyelik', type: 'epoxy', description: 'Kalıp ve butik hediyelik epoksi tasarımlar.', imageTone: 'from-sky-950 via-cyan-700 to-cream', featured: true },
  { id: 'supplies', name: 'Kalıp, Şişe & Ambalaj', type: 'supplies', description: 'Üretim ekipmanları, şişe, kalıp ve ambalaj çözümleri.', imageTone: 'from-zinc-950 via-zinc-600 to-champagne', featured: true }
];

export const products: Product[] = [
  {
    id: 'p-001', slug: 'savage-erkek-parfum-50-ml', name: 'Savage Erkek Parfüm 50 ml', categoryId: 'perfume', categoryName: 'Parfüm', price: 890, discountedPrice: 749, stock: 18, imageTone: 'from-slate-950 via-stone-700 to-gold', badge: 'Çok satan', isBestSeller: true, isCampaign: true,
    description: 'Baharatlı ferahlık ve odunsu dip notalarla güçlü, modern ve kalıcı erkek parfümü.',
    variants: [{ type: 'ml', label: '50 ml', stock: 18 }, { type: 'ml', label: '100 ml', priceDelta: 640, stock: 7 }, { type: 'adet', label: '2 adet set', priceDelta: 690, stock: 5 }],
    perfumeDetails: { fragranceFamily: 'Aromatik odunsu', topNotes: 'Bergamot, pembe biber', heartNotes: 'Lavanta, paçuli', baseNotes: 'Ambroxan, sedir', gender: 'Erkek', longevity: '8-10 saat', usageTime: 'Gündüz / gece', similarScentType: 'Fresh baharatlı niş çizgi' }
  },
  {
    id: 'p-002', slug: 'labella-kadin-parfum-50-ml', name: 'Labella Kadın Parfüm 50 ml', categoryId: 'perfume', categoryName: 'Parfüm', price: 860, discountedPrice: 699, stock: 22, imageTone: 'from-rose-950 via-pink-700 to-champagne', badge: 'Yeni', isNew: true,
    description: 'Işıltılı meyve notaları ve zarif çiçeklerle feminen, temiz ve premium bir imza koku.',
    variants: [{ type: 'ml', label: '50 ml', stock: 22 }, { type: 'koku', label: 'Çiçeksi yoğun', stock: 9 }, { type: 'koku', label: 'Meyvemsi hafif', stock: 10 }],
    perfumeDetails: { fragranceFamily: 'Çiçeksi meyvemsi', topNotes: 'Armut, mandalina', heartNotes: 'Yasemin, portakal çiçeği', baseNotes: 'Vanilya, misk', gender: 'Kadın', longevity: '6-8 saat', usageTime: 'Günlük / özel davet', similarScentType: 'Soft floral luxury' }
  },
  {
    id: 'p-003', slug: 'amber-oud-unisex-parfum-50-ml', name: 'Amber Oud Unisex Parfüm 50 ml', categoryId: 'perfume', categoryName: 'Parfüm', price: 1180, discountedPrice: 990, stock: 12, imageTone: 'from-black via-amber-950 to-gold', badge: 'Premium', isBestSeller: true,
    description: 'Amber, öd ağacı ve reçinemsi sıcaklıkla lüks algısı yüksek, derin unisex parfüm.',
    variants: [{ type: 'ml', label: '50 ml', stock: 12 }, { type: 'ml', label: '10 ml seyahat', priceDelta: -740, stock: 30 }],
    perfumeDetails: { fragranceFamily: 'Amber odunsu', topNotes: 'Safran, reçine', heartNotes: 'Gül, oud akoru', baseNotes: 'Amber, deri, sandal', gender: 'Unisex', longevity: '10+ saat', usageTime: 'Akşam / kış', similarScentType: 'Oriental niche oud' }
  },
  {
    id: 'p-004', slug: 'dogal-zeytinyagli-sabun-100-gr', name: 'Doğal Zeytinyağlı Sabun 100 gr', categoryId: 'natural-soap', categoryName: 'Doğal Sabun', price: 165, stock: 64, imageTone: 'from-emerald-900 via-lime-700 to-cream', isBestSeller: true,
    description: 'Soğuk proses yöntemiyle üretilmiş, nazik temizlik sağlayan zeytinyağlı doğal sabun.',
    variants: [{ type: 'gram', label: '100 gr', stock: 64 }, { type: 'adet', label: '3 adet paket', priceDelta: 290, stock: 20 }],
    naturalDetails: { ingredients: 'Zeytinyağı, hindistan cevizi yağı, saf su', skinType: 'Tüm cilt tipleri', weight: '100 gr', usage: 'Islak cilde köpürterek uygulayın.', warnings: 'Göz ile temasından kaçının.' }
  },
  {
    id: 'p-005', slug: 'lavantali-el-yapimi-sabun', name: 'Lavantalı El Yapımı Sabun', categoryId: 'handmade-soap', categoryName: 'El Yapımı Sabun', price: 190, discountedPrice: 159, stock: 38, imageTone: 'from-violet-950 via-purple-600 to-cream', isNew: true, isCampaign: true,
    description: 'Lavanta kokulu, dekoratif görünümlü ve günlük bakım ritüeline uygun el yapımı sabun.',
    variants: [{ type: 'koku', label: 'Lavanta', stock: 38 }, { type: 'renk', label: 'Lila', stock: 18 }, { type: 'boyut', label: 'Mini set', priceDelta: 120, stock: 14 }],
    naturalDetails: { ingredients: 'Bitkisel gliserin, lavanta yağı, doğal renk verici', skinType: 'Normal ve karma cilt', weight: '95 gr', usage: 'El ve vücut temizliğinde kullanın.', warnings: 'Alerjik ciltlerde küçük bölgede test edin.' }
  },
  {
    id: 'p-006', slug: 'hindistan-cevizi-dudak-balmi', name: 'Hindistan Cevizi Dudak Balmı', categoryId: 'care', categoryName: 'Doğal Krem & Balm', price: 145, stock: 46, imageTone: 'from-orange-950 via-amber-500 to-cream', isNew: true,
    description: 'Shea ve hindistan cevizi yağı ile dudaklara yoğun nem ve parlak bakım sunar.',
    variants: [{ type: 'gram', label: '10 gr', stock: 46 }, { type: 'adet', label: '2 adet', priceDelta: 115, stock: 17 }],
    naturalDetails: { ingredients: 'Shea butter, hindistan cevizi yağı, balmumu, E vitamini', skinType: 'Kuru dudaklar', weight: '10 gr', usage: 'Gün içinde ihtiyaç duydukça uygulayın.', warnings: 'Serin yerde muhafaza edin.' }
  },
  {
    id: 'p-007', slug: 'shea-butter-dogal-krem', name: 'Shea Butter Doğal Krem', categoryId: 'care', categoryName: 'Doğal Krem & Balm', price: 320, discountedPrice: 279, stock: 25, imageTone: 'from-yellow-950 via-yellow-600 to-cream', isCampaign: true,
    description: 'Kuru bölgeler için yoğun nem desteği sağlayan zengin dokulu doğal bakım kremi.',
    variants: [{ type: 'gram', label: '50 gr', stock: 25 }, { type: 'gram', label: '100 gr', priceDelta: 220, stock: 12 }],
    naturalDetails: { ingredients: 'Shea butter, badem yağı, E vitamini', skinType: 'Kuru ve hassas cilt', weight: '50 gr', usage: 'Temiz cilde masajla uygulayın.', warnings: 'Harici kullanım içindir.' }
  },
  {
    id: 'p-008', slug: 'silikon-sabun-kalibi', name: 'Silikon Sabun Kalıbı', categoryId: 'supplies', categoryName: 'Kalıp, Şişe & Ambalaj', price: 240, stock: 31, imageTone: 'from-zinc-900 via-neutral-500 to-champagne', isBestSeller: true,
    description: 'Esnek silikon yapısıyla atölye ve butik üretim için profesyonel sabun kalıbı.',
    variants: [{ type: 'boyut', label: '6 gözlü', stock: 31 }, { type: 'renk', label: 'Şeffaf', stock: 16 }],
    supplyDetails: { materialType: 'Gıda uyumlu silikon', dimensions: '28 x 17 x 3 cm', compatibleProducts: 'Sabun, mum, kokulu taş', packageContent: '1 adet 6 gözlü kalıp' }
  },
  {
    id: 'p-009', slug: '50-ml-parfum-sisesi', name: '50 ml Parfüm Şişesi', categoryId: 'supplies', categoryName: 'Kalıp, Şişe & Ambalaj', price: 38, discountedPrice: 32, stock: 220, imageTone: 'from-stone-950 via-stone-400 to-cream', isCampaign: true,
    description: 'Premium parfüm üretimi için sprey başlıklı, kutulamaya uygun cam şişe.',
    variants: [{ type: 'ml', label: '50 ml', stock: 220 }, { type: 'adet', label: '10 adet paket', priceDelta: 270, stock: 40 }, { type: 'renk', label: 'Siyah kapak', stock: 90 }],
    supplyDetails: { materialType: 'Cam şişe, metalize sprey', dimensions: '50 ml', compatibleProducts: 'Parfüm, kolonya, oda spreyi', packageContent: 'Şişe + sprey + kapak' }
  },
  {
    id: 'p-010', slug: 'epoksi-kolye-kalibi', name: 'Epoksi Kolye Kalıbı', categoryId: 'epoxy', categoryName: 'Epoksi Hediyelik', price: 210, stock: 19, imageTone: 'from-cyan-950 via-sky-600 to-cream', isNew: true,
    description: 'Takı ve hediyelik üretimi için parlak yüzeyli çoklu epoksi kolye kalıbı.',
    variants: [{ type: 'boyut', label: 'Çoklu set', stock: 19 }, { type: 'adet', label: '2 kalıp', priceDelta: 175, stock: 9 }],
    supplyDetails: { materialType: 'Silikon epoksi kalıbı', dimensions: 'Kolye uçları 2-4 cm', compatibleProducts: 'Epoksi reçine, UV reçine', packageContent: '1 adet çoklu kolye kalıbı' }
  }
];

export const demoOrders: Order[] = [
  { id: 'BA-1042', customer: 'Elif A.', total: 1548, status: 'Beklemede', payment: 'Havale / EFT' },
  { id: 'BA-1041', customer: 'Murat K.', total: 990, status: 'Hazırlanıyor', payment: 'Kapıda ödeme' },
  { id: 'BA-1040', customer: 'Atölye Nova', total: 1840, status: 'Kargoda', payment: 'Online ödeme hazırlığı', trackingCode: 'TRK982314' }
];

export const formatPrice = (value: number) => new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(value);
export const productBySlug = (slug: string) => products.find((product) => product.slug === slug);
export const categoryById = (id: string) => categories.find((category) => category.id === id);
