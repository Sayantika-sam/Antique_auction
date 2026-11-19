/* ==========================================================================
   ANTIQUEAUCTION — DATA LAYER
   All project data lives in JavaScript arrays / objects. No database.
   ========================================================================== */

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;
const U = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=80`;

const CATEGORIES = [
    { key: 'Furniture', name: 'Furniture & Decor', icon: 'fa-solid fa-chair', subs: ['Victorian Furniture', 'Art Deco Pieces', 'Antique Mirrors', 'Vintage Lighting'], blurb: 'Hand-carved woodwork, gilded frames and lighting that remembers another era.' },
    { key: 'Art', name: 'Art & Paintings', icon: 'fa-solid fa-paintbrush', subs: ['Old Master Paintings', 'Vintage Posters', 'Antique Prints', 'Miniature Art'], blurb: 'Original works and prints with documented history and exhibition records.' },
    { key: 'Jewelry', name: 'Jewelry & Timepieces', icon: 'fa-solid fa-gem', subs: ['Vintage Jewelry', 'Pocket Watches', 'Antique Rings', 'Clock Collections'], blurb: 'Signed pieces, estate jewelry and precision timekeeping from the past.' },
    { key: 'Books', name: 'Rare Books & Manuscripts', icon: 'fa-solid fa-book-open', subs: ['First Editions', 'Historical Documents', 'Illuminated Manuscripts', 'Vintage Maps'], blurb: 'First editions, illuminated leaves and archival documents of consequence.' }
];

const ERAS = [
    { key: 'Medieval', label: 'Medieval (pre-1500)' },
    { key: 'Renaissance', label: 'Renaissance (1500–1700)' },
    { key: '18th Century', label: '18th Century' },
    { key: 'Victorian', label: 'Victorian (1837–1901)' },
    { key: 'Edwardian', label: 'Edwardian (1901–1910)' },
    { key: 'Art Deco', label: 'Art Deco (1920–1940)' },
    { key: 'Mid-Century', label: 'Mid-Century (1945–1969)' }
];

const REGIONS = [
    { key: 'Europe', label: 'Europe' },
    { key: 'India', label: 'Indian Subcontinent' },
    { key: 'Asia', label: 'East Asia' },
    { key: 'Americas', label: 'Americas' }
];

const CONDITIONS = ['Excellent', 'Very Good', 'Good', 'Fair'];

/* --------------------------- SEED DATA ----------------------------------- */
function createSeed() {
    const now = Date.now();

    const antiques = [
        {
            id: 1,
            name: 'Victorian Mahogany Cabinet',
            category: 'Furniture', sub: 'Victorian Furniture',
            era: 'Victorian (1837–1901)', eraKey: 'Victorian',
            origin: 'England', region: 'Europe',
            condition: 'Excellent', material: 'Solid mahogany with gilt brass',
            dimensions: '122 × 52 × 186 cm', ageYears: 128,
            description: 'A magnificent Victorian mahogany cabinet with intricate hand-carved scrollwork, original gilt brass fittings and a mirrored upper door. The figured timber retains its deep original patina.',
            history: 'Commissioned in 1892 for a prominent London merchant family, the cabinet remained in the family townhouse until 1968. It travelled to Chennai with the family’s descendants and has been carefully cared for ever since.',
            provenance: 'Private Collection, London (1892–1968); Family Collection, Chennai (1968–2024)',
            conditionNotes: 'Structurally sound. Minor wear to the lower edges consistent with age. Original locks and keys present.',
            restoration: [
                { year: '2019', note: 'Surface cleaned and French-polished by the AntiqueAuction conservation studio.' },
                { year: '1985', note: 'Mirror re-silvered; original frame retained.' }
            ],
            authenticated: true, startingPrice: 50000, currentBid: 72000, bidCount: 14, views: 1240,
            images: [U('photo-1600210492486-724fe5c67fb0'), U('photo-1555041469-a586c61ea9bc'), U('photo-1494438639946-1ebd1d20bf85')],
            sellerId: 2, featured: true, live: true, endAt: now + 9 * HOUR + 24 * 60 * 1000,
            curatorNote: 'A textbook example of late-Victorian craftsmanship — the carving on the frieze is exceptionally crisp.'
        },
        {
            id: 2,
            name: '18th Century Rococo Oil Painting',
            category: 'Art', sub: 'Old Master Paintings',
            era: '18th Century', eraKey: '18th Century',
            origin: 'France', region: 'Europe',
            condition: 'Good', material: 'Oil on canvas, original gilt frame',
            dimensions: '94 × 118 cm', ageYears: 255,
            description: 'A lyrical Rococo pastoral scene with delicate figures in a landscaped garden, painted in the manner of the French court. Presented in its original carved and gilded frame.',
            history: 'Part of a noble family collection near Lyon for seven generations. An old inventory label on the reverse records its display in the château’s east salon.',
            provenance: 'Château de Vaux collection, Lyon; Private collection, Geneva; AntiqueAuction consignment, 2025',
            conditionNotes: 'Stable craquelure throughout. Two small areas of historic retouching visible under UV light.',
            restoration: [{ year: '2011', note: 'Lined, cleaned and varnished by Atelier Moreau, Paris.' }],
            authenticated: true, startingPrice: 180000, currentBid: 185000, bidCount: 9, views: 980,
            images: [U('photo-1579783902614-a3fb3927b6a5'), U('photo-1541961017774-22349e4a1262'), U('photo-1536924940846-227afb31e2a5')],
            sellerId: 2, featured: true, live: true, endAt: now + 26 * HOUR,
            curatorNote: 'The handling of light in the distant foliage is worth the price of admission alone.'
        },
        {
            id: 3,
            name: 'Art Deco Emerald & Platinum Brooch',
            category: 'Jewelry', sub: 'Vintage Jewelry',
            era: 'Art Deco (1920–1940)', eraKey: 'Art Deco',
            origin: 'France', region: 'Europe',
            condition: 'Excellent', material: 'Platinum, emerald, old-cut diamonds',
            dimensions: '4.2 × 2.6 cm · 14.8 g', ageYears: 96,
            description: 'A geometric emerald-and-diamond brooch with milgrain detailing and an original platinum setting — a quintessential Art Deco statement piece.',
            history: 'Purchased from a Parisian jewellery house in 1928 by a Mumbai-based industrialist as an anniversary gift. Accompanied by the original fitted case.',
            provenance: 'Private family collection, Mumbai',
            conditionNotes: 'All stones original and secure. Clasp in working order. Original case included.',
            restoration: [{ year: '2022', note: 'Ultrasonic cleaning and professional rhodium refresh.' }],
            authenticated: true, startingPrice: 48000, currentBid: 54000, bidCount: 11, views: 1510,
            images: [U('photo-1602173574767-37ac01994b2a'), U('photo-1515562141207-7a88fb7ce338'), U('photo-1611652022419-a9419f74343d')],
            sellerId: 2, featured: true, live: false, endAt: now + 5 * DAY,
            curatorNote: 'The emerald’s colour is unusually vivid for a stone of this period.'
        },
        {
            id: 4,
            name: '1912 Swiss Pocket Watch',
            category: 'Jewelry', sub: 'Pocket Watches',
            era: 'Edwardian (1901–1910)', eraKey: 'Edwardian',
            origin: 'Switzerland', region: 'Europe',
            condition: 'Very Good', material: '18k gold case, enamel dial',
            dimensions: '5.1 cm diameter · 92 g', ageYears: 114,
            description: 'A finely engraved 18k gold pocket watch with a crisp enamel dial, blued steel hands and a 15-jewel mechanical movement that keeps time beautifully.',
            history: 'Carried by a railway official in Madras from 1914 until his retirement in 1948. The case is engraved with his initials and the year 1914.',
            provenance: 'Family heirloom, Chennai',
            conditionNotes: 'Hairline scratch to the case back. Movement serviced in 2023 and running within 20 seconds per day.',
            restoration: [{ year: '2023', note: 'Full movement service and balance adjustment.' }],
            authenticated: true, startingPrice: 32000, currentBid: 38500, bidCount: 7, views: 760,
            images: [U('photo-1523170335258-f5ed11844a49'), U('photo-1617038260897-41a1f14a8ca0')],
            sellerId: 2, featured: false, live: true, endAt: now + 4 * HOUR + 40 * 60 * 1000,
            curatorNote: 'A working timepiece with a documented Indian provenance — a rare combination.'
        },
        {
            id: 5,
            name: 'First Edition — The Jungle Book',
            category: 'Books', sub: 'First Editions',
            era: 'Victorian (1837–1901)', eraKey: 'Victorian',
            origin: 'England', region: 'Europe',
            condition: 'Good', material: 'Cloth-bound hardcover, gilt blocking',
            dimensions: '19 × 13 cm · 332 pages', ageYears: 132,
            description: 'The 1894 first edition of Rudyard Kipling’s classic, complete with the original gilt-decorated cloth binding and all illustrations. A lovely, well-preserved copy.',
            history: 'Presented as a school prize in 1905, with a contemporary inscription on the front free endpaper. Later held in a private collection in Pune.',
            provenance: 'School prize, 1905; Private collection, Pune',
            conditionNotes: 'Light foxing to endpapers, gentle rubbing at spine ends. Text block tight and clean.',
            restoration: [{ year: '2020', note: 'Spine tips consolidated; archival storage box provided.' }],
            authenticated: true, startingPrice: 35000, currentBid: 42000, bidCount: 8, views: 890,
            images: [U('photo-1544947950-fa07a98d237f'), U('photo-1512820790803-83ca734da794'), U('photo-1456513080510-7bf3a84b82f8')],
            sellerId: 2, featured: true, live: false, endAt: now + 6 * DAY,
            curatorNote: 'A first edition with an early inscription — the provenance makes this copy special.'
        },
        {
            id: 6,
            name: 'Mughal Miniature Painting',
            category: 'Art', sub: 'Miniature Art',
            era: 'Renaissance (1500–1700)', eraKey: 'Renaissance',
            origin: 'India', region: 'India',
            condition: 'Excellent', material: 'Opaque watercolour and gold on paper',
            dimensions: '21 × 15 cm', ageYears: 350,
            description: 'A refined Mughal miniature depicting a courtly gathering, with finely rendered figures, architecture and a richly gilded border. Remarkable preservation of pigment.',
            history: 'From a princely library in Rajasthan, catalogued in a 1920s family inventory. Acquired by the consignor’s grandfather in 1956.',
            provenance: 'Princely collection, Rajasthan; Private collection, Delhi',
            conditionNotes: 'Minor creasing at the lower margin. Colours remain exceptionally fresh.',
            restoration: [{ year: '2018', note: 'Mounted on archival board with a conservation-grade overlay.' }],
            authenticated: true, startingPrice: 85000, currentBid: 96000, bidCount: 13, views: 1130,
            images: [U('photo-1531058020387-3be344556be6'), U('photo-1513519245088-0e12902e5a38'), U('photo-1577083552431-6e5fd01aa342')],
            sellerId: 2, featured: true, live: true, endAt: now + 14 * HOUR,
            curatorNote: 'The gold work in the architecture is intact — unusually fine for a work of this age.'
        },
        {
            id: 7,
            name: 'Victorian Rosewood Writing Desk',
            category: 'Furniture', sub: 'Victorian Furniture',
            era: 'Victorian (1837–1901)', eraKey: 'Victorian',
            origin: 'England', region: 'Europe',
            condition: 'Very Good', material: 'Rosewood, leather, brass',
            dimensions: '122 × 68 × 76 cm', ageYears: 140,
            description: 'A charming Victorian writing desk with a tooled leather surface, nine dovetailed drawers and original brass pulls. The warm rosewood grain is beautifully figured.',
            history: 'Used in a Calcutta trading house from the 1890s. A small brass plaque records the firm’s name.',
            provenance: 'Trading house, Kolkata; Private collection, Bengaluru',
            conditionNotes: 'Leather worn but supple. One drawer runner replaced with matching timber.',
            restoration: [{ year: '2021', note: 'French polish and leather conditioning.' }],
            authenticated: false, startingPrice: 105000, currentBid: 120000, bidCount: 6, views: 620,
            images: [U('photo-1567538096630-e0c55bd6374c'), U('photo-1503602642458-232111445657'), U('photo-1524758631624-e2822e304c36')],
            sellerId: 2, featured: false, live: false, endAt: now + 8 * DAY,
            curatorNote: 'A working desk with real character — the sort of piece that anchors a study.'
        },
        {
            id: 8,
            name: '1930s Vintage Travel Poster',
            category: 'Art', sub: 'Vintage Posters',
            era: 'Art Deco (1920–1940)', eraKey: 'Art Deco',
            origin: 'France', region: 'Europe',
            condition: 'Fair', material: 'Lithographic print on paper',
            dimensions: '62 × 100 cm', ageYears: 91,
            description: 'A striking Art Deco travel poster advertising the French Riviera, with bold typography and a sun-drenched coastal scene. Linen-backed for preservation.',
            history: 'Found in a Parisian print shop in 1988 and kept in a portfolio ever since.',
            provenance: 'Print shop, Paris; Private collection, Kochi',
            conditionNotes: 'Linen-backed with repaired edge tears. Colours strong; some toning in margins.',
            restoration: [{ year: '1998', note: 'Linen backing and minor inpainting at edges.' }],
            authenticated: false, startingPrice: 15000, currentBid: 18000, bidCount: 5, views: 430,
            images: [U('photo-1577083552431-6e5fd01aa342'), U('photo-1513506003901-1e6a229e2d15')],
            sellerId: 2, featured: false, live: false, endAt: now + 3 * DAY,
            curatorNote: 'Graphic, optimistic and gloriously of its moment.'
        },
        {
            id: 9,
            name: 'Antique Brass Telescope',
            category: 'Furniture', sub: 'Vintage Lighting',
            era: '18th Century', eraKey: '18th Century',
            origin: 'England', region: 'Europe',
            condition: 'Good', material: 'Brass, wood, glass optics',
            dimensions: '76 cm extended · tripod 110 cm', ageYears: 210,
            description: 'A three-draw brass refracting telescope on its original wooden tripod. The lacquered brass and eyepiece assembly are complete and functional.',
            history: 'Believed to have been made by a London instrument maker around 1810. Used at a coastal observatory until the 1960s.',
            provenance: 'Coastal observatory, Tamil Nadu; Private collection, Chennai',
            conditionNotes: 'Optics clear with light coating. Tripod joints tight.',
            restoration: [{ year: '2017', note: 'Optics cleaned and brass gently polished.' }],
            authenticated: true, startingPrice: 25000, currentBid: 29500, bidCount: 4, views: 380,
            images: [U('photo-1507473885765-e6ed057f782c'), U('photo-1586023492125-27b2c045efd7')],
            sellerId: 2, featured: false, live: false, endAt: now + 4 * DAY,
            curatorNote: 'A beautiful object that still does exactly what it was made to do.'
        },
        {
            id: 10,
            name: 'Illuminated Manuscript Leaf',
            category: 'Books', sub: 'Illuminated Manuscripts',
            era: 'Medieval', eraKey: 'Medieval',
            origin: 'Italy', region: 'Europe',
            condition: 'Good', material: 'Tempera and gold leaf on vellum',
            dimensions: '24 × 17 cm', ageYears: 560,
            description: 'A single vellum leaf from a 15th-century Italian choir book, with a historiated initial, gold leaf highlights and neat Gothic script on both sides.',
            history: 'Removed from a disbound antiphonal in the early 20th century and held in a private library in Florence.',
            provenance: 'Private library, Florence; AntiqueAuction consignment, 2025',
            conditionNotes: 'Some edge trimming and light cockling. Gold leaf intact; no modern retouching.',
            restoration: [{ year: '2015', note: 'Housed in an archival sleeve and acid-free mount.' }],
            authenticated: true, startingPrice: 130000, currentBid: 145000, bidCount: 10, views: 1020,
            images: [U('photo-1481277542470-605612bd2d61'), U('photo-1507842217343-583bb7270b66'), U('photo-1524995997946-a1c2e315a42f')],
            sellerId: 2, featured: false, live: true, endAt: now + 20 * HOUR,
            curatorNote: 'Five centuries old and still luminous — the gold catchs light even in low daylight.'
        },
        {
            id: 11,
            name: 'Victorian Cameo Ring',
            category: 'Jewelry', sub: 'Antique Rings',
            era: 'Victorian (1837–1901)', eraKey: 'Victorian',
            origin: 'Italy', region: 'Europe',
            condition: 'Excellent', material: '18k gold, carved shell cameo',
            dimensions: 'US size 7 · 8.4 g', ageYears: 145,
            description: 'A delicate 18k gold ring set with a hand-carved shell cameo of a classical profile. The carving is remarkably detailed and the setting is original.',
            history: 'A Victorian souvenir purchased on the Grand Tour, passed down through an Anglo-Indian family.',
            provenance: 'Family collection, Shimla',
            conditionNotes: 'Cameo secure, no chips. Band shows light surface wear.',
            restoration: [],
            authenticated: false, startingPrice: 28000, currentBid: 33000, bidCount: 3, views: 290,
            images: [U('photo-1611652022419-a9419f74343d'), U('photo-1515562141207-7a88fb7ce338')],
            sellerId: 2, featured: false, live: false, endAt: now + 2 * DAY,
            curatorNote: 'Small in scale, enormous in charm.'
        },
        {
            id: 12,
            name: 'Mid-Century Teak Lounge Chair',
            category: 'Furniture', sub: 'Art Deco Pieces',
            era: 'Mid-Century (1945–1969)', eraKey: 'Mid-Century',
            origin: 'Denmark', region: 'Europe',
            condition: 'Good', material: 'Teak, woven cane, wool upholstery',
            dimensions: '68 × 82 × 79 cm', ageYears: 68,
            description: 'A sculptural Danish teak lounge chair with a bentwood frame, woven cane sides and new wool cushions. Clean lines and wonderful patina.',
            history: 'Imported into India in the 1960s for a modernist architect’s residence in Chennai.',
            provenance: 'Architect’s residence, Chennai',
            conditionNotes: 'Frame excellent; cane intact. Cushions are period-correct replacements.',
            restoration: [{ year: '2020', note: 'Cushions reupholstered in British-made wool.' }],
            authenticated: false, startingPrice: 40000, currentBid: 47000, bidCount: 6, views: 540,
            images: [U('photo-1503602642458-232111445657'), U('photo-1567538096630-e0c55bd6374c')],
            sellerId: 2, featured: false, live: false, endAt: now + 7 * DAY,
            curatorNote: 'A quiet icon of Scandinavian design with a genuinely local story.'
        }
    ];

    const users = [
        { id: 1, name: 'Aarav Mehta', email: 'demo@antiqueauction.com', password: 'demo123', role: 'Collector', joined: '2023-04-12', city: 'Chennai' },
        { id: 2, name: 'Meera Iyer', email: 'seller@antiqueauction.com', password: 'seller123', role: 'Seller', joined: '2021-09-03', city: 'Bengaluru' },
        { id: 3, name: 'Dr. R. Natarajan', email: 'expert@antiqueauction.com', password: 'expert123', role: 'Expert', joined: '2019-01-18', city: 'Chennai' }
    ];

    const bids = [
        { id: 1, antiqueId: 1, bidderId: 1, bidderName: 'Aarav Mehta', amount: 72000, time: new Date(now - 2 * HOUR).toISOString(), status: 'Leading' },
        { id: 2, antiqueId: 1, bidderId: 3, bidderName: 'R. Natarajan', amount: 68500, time: new Date(now - 5 * HOUR).toISOString(), status: 'Outbid' },
        { id: 3, antiqueId: 2, bidderId: 1, bidderName: 'Aarav Mehta', amount: 185000, time: new Date(now - 8 * HOUR).toISOString(), status: 'Leading' },
        { id: 4, antiqueId: 4, bidderId: 1, bidderName: 'Aarav Mehta', amount: 38500, time: new Date(now - 30 * 60 * 1000).toISOString(), status: 'Leading' },
        { id: 5, antiqueId: 6, bidderId: 3, bidderName: 'R. Natarajan', amount: 96000, time: new Date(now - 3 * HOUR).toISOString(), status: 'Leading' },
        { id: 6, antiqueId: 10, bidderId: 1, bidderName: 'Aarav Mehta', amount: 145000, time: new Date(now - 11 * HOUR).toISOString(), status: 'Leading' },
        { id: 7, antiqueId: 3, bidderId: 1, bidderName: 'Aarav Mehta', amount: 54000, time: new Date(now - DAY).toISOString(), status: 'Leading' },
        { id: 8, antiqueId: 5, bidderId: 3, bidderName: 'R. Natarajan', amount: 42000, time: new Date(now - 2 * DAY).toISOString(), status: 'Leading' }
    ];

    const valuations = [
        { id: 1, antiqueId: 1, antiqueName: 'Victorian Mahogany Cabinet', expert: 'Dr. R. Natarajan', estimatedLow: 68000, estimatedHigh: 88000, confidence: 92, date: new Date(now - 6 * DAY).toISOString(), notes: 'Strong provenance and original fittings support the upper range.', ownerId: 1 },
        { id: 2, antiqueId: 6, antiqueName: 'Mughal Miniature Painting', expert: 'Dr. Anjali Rao', estimatedLow: 90000, estimatedHigh: 120000, confidence: 88, date: new Date(now - 12 * DAY).toISOString(), notes: 'Pigment condition exceptional; comparable sales reviewed.', ownerId: 1 },
        { id: 3, antiqueId: 5, antiqueName: 'First Edition — The Jungle Book', expert: 'Dr. R. Natarajan', estimatedLow: 38000, estimatedHigh: 52000, confidence: 85, date: new Date(now - 20 * DAY).toISOString(), notes: 'Inscription and original cloth add a modest premium.', ownerId: 1 }
    ];

    const certificates = [
        { id: 1, antiqueId: 1, number: 'AA-VER-2026-1042', verifiedBy: 'Dr. R. Natarajan', date: '2026-02-18', status: 'Verified', report: 'Materials, construction and provenance consistent with late-Victorian English manufacture.', registrar: 'AntiqueAuction Heritage Board' },
        { id: 2, antiqueId: 2, number: 'AA-VER-2026-1088', verifiedBy: 'Dr. Anjali Rao', date: '2026-03-04', status: 'Verified', report: 'Canvas, ground and pigment analysis consistent with an 18th-century French work.', registrar: 'AntiqueAuction Heritage Board' },
        { id: 3, antiqueId: 4, number: 'AA-VER-2025-0917', verifiedBy: 'Dr. R. Natarajan', date: '2025-11-22', status: 'Verified', report: 'Hallmarks and movement serial confirm Swiss origin, circa 1912.', registrar: 'AntiqueAuction Heritage Board' },
        { id: 4, antiqueId: 6, number: 'AA-VER-2026-1103', verifiedBy: 'Dr. Anjali Rao', date: '2026-04-01', status: 'Verified', report: 'Vellum, pigment and gold leaf consistent with 15th-century Italian illumination.', registrar: 'AntiqueAuction Heritage Board' },
        { id: 5, antiqueId: 10, number: 'AA-VER-2026-1131', verifiedBy: 'Dr. R. Natarajan', date: '2026-05-16', status: 'Verified', report: 'Optical construction and brass alloy consistent with early-19th-century London makers.', registrar: 'AntiqueAuction Heritage Board' }
    ];

    return {
        antiques, users, bids, valuations, certificates,
        currentUserId: null,
        watchlist: [2, 6],
        theme: 'light',
        nextId: { antique: 13, bid: 9, valuation: 4, certificate: 6, user: 4 }
    };
}
