/* ==========================================================================
   ANTIQUEAUCTION — APPLICATION CONTROLLER
   State, localStorage persistence, SPA routing, filters, bidding, auth,
   certificate handling, exports and global event wiring.
   ========================================================================== */
'use strict';

/* --------------------------- 1. STATE ------------------------------------ */
const LS_KEY = 'antiqueAuction.v1';

function loadState() {
    try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (parsed && Array.isArray(parsed.antiques) && parsed.antiques.length) return parsed;
        }
    } catch (err) { console.warn('Could not read saved state:', err); }
    return createSeed();
}

let state = loadState();
let saveTimer = null;
function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
        try { localStorage.setItem(LS_KEY, JSON.stringify(state)); }
        catch (err) { console.warn('Could not save state:', err); }
    }, 60);
}

const ui = {
    filters: { q: '', categories: [], eras: [], origins: [], condition: '', maxPrice: 250000, authenticatedOnly: false, liveOnly: false, sort: 'ending', view: 'grid' },
    galleryAngle: 0,
    galleryNight: false,
    pending: null,
    lastRoute: ''
};

function currentUser() { return state.users.find(u => u.id === state.currentUserId) || null; }
function getItem(id) { return state.antiques.find(a => a.id === Number(id)); }
function bidIncrement(price) {
    if (price < 50000) return 1000;
    if (price < 100000) return 2500;
    if (price < 200000) return 5000;
    return 10000;
}

/* --------------------------- 2. HELPERS ---------------------------------- */
function esc(value) {
    return String(value == null ? '' : value)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function money(n) { return '₹' + Number(n || 0).toLocaleString('en-IN'); }
function pad(n) { return String(n).padStart(2, '0'); }
function fmtDate(s) {
    const d = new Date(s);
    return isNaN(d) ? s : d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
function fmtTime(s) {
    const d = new Date(s);
    return isNaN(d) ? s : d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}
function artImage(a, index = 0) {
    const src = (a.images && a.images[index]) || (a.images && a.images[0]) || '';
    return `<img src="${esc(src)}" alt="${esc(a.name)}" loading="lazy" data-fallback data-label="${esc(a.name)}">`;
}
function fallbackSVG(label) {
    const text = String(label || 'Antique').slice(0, 26).replace(/[<>&"']/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2D1B12"/><stop offset="1" stop-color="#8B6B4A"/></linearGradient></defs>
    <rect width="800" height="600" fill="url(#g)"/><rect x="28" y="28" width="744" height="544" fill="none" stroke="#D4A574" stroke-width="2"/>
    <rect x="42" y="42" width="716" height="516" fill="none" stroke="#D4A574" stroke-opacity=".35"/>
    <text x="400" y="290" text-anchor="middle" font-family="Georgia,serif" font-size="110" fill="#D4A574">&#9878;</text>
    <text x="400" y="365" text-anchor="middle" font-family="Georgia,serif" font-size="34" fill="#F5EDE6">${text}</text>
    <text x="400" y="410" text-anchor="middle" font-family="Georgia,serif" font-size="16" letter-spacing="6" fill="#D4A574">ANTIQUE AUCTION</text></svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
}
function applyImageFallbacks(scope) {
    scope.querySelectorAll('img[data-fallback]').forEach(img => {
        if (img.dataset.bound) return;
        img.dataset.bound = '1';
        const fix = () => { img.src = fallbackSVG(img.dataset.label || 'Antique'); };
        img.addEventListener('error', fix, { once: true });
        if (img.complete && img.naturalWidth === 0) fix();
    });
}
function toast(message, type = 'info') {
    const root = document.getElementById('toastRoot');
    const icons = { info: 'fa-circle-info', success: 'fa-circle-check', error: 'fa-triangle-exclamation' };
    const el = document.createElement('div');
    el.className = `toast ${type}`;
    el.innerHTML = `<i class="fa-solid ${icons[type] || icons.info}"></i><span>${esc(message)}</span>`;
    root.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 320); }, 4200);
}
function closeMobileNav() {
    document.getElementById('navMenu').classList.remove('open');
    document.getElementById('hamburger').classList.remove('active');
    document.getElementById('hamburger').setAttribute('aria-expanded', 'false');
}
function closeDropdowns() {
    document.querySelectorAll('.has-dropdown.open').forEach(el => {
        el.classList.remove('open');
        el.querySelector('.nav-drop').setAttribute('aria-expanded', 'false');
    });
}
function withUser(fn) {
    if (currentUser()) return fn(currentUser());
    ui.pending = fn;
    openAuthModal('login');
    toast('Please sign in to continue', 'info');
}

/* --------------------------- 3. ROUTER ----------------------------------- */
const routeTable = [
    [/^\/home$/, () => viewHome(), 'Home'],
    [/^\/antiques$/, () => viewListing(), 'The Collection'],
    [/^\/antique\/(\d+)$/, m => viewDetail(m[1]), 'Antique Detail'],
    [/^\/valuation$/, () => viewValuation(), 'Expert Valuation'],
    [/^\/bidding$/, () => viewBidding(), 'Live Bidding'],
    [/^\/dashboard\/collector$/, () => viewDashboard('collector'), 'Collector Dashboard'],
    [/^\/dashboard\/seller$/, () => viewDashboard('seller'), 'Seller Dashboard'],
    [/^\/authenticity$/, () => viewAuthenticity(), 'Authenticity Verification'],
    [/^\/certificates$/, () => viewCertificates(), 'Certificates'],
    [/^\/gallery$/, () => viewGallery(), 'Virtual Gallery'],
    [/^\/curators$/, () => viewCurators(), "Curator's Picks"],
    [/^\/about$/, () => viewAbout(), 'About Us']
];

function route() {
    const path = (location.hash.replace(/^#/, '') || '/home').split('?')[0];
    let html = viewNotFound(), title = 'Page Not Found', found = false;
    for (const [pattern, renderer, pageTitle] of routeTable) {
        const match = path.match(pattern);
        if (match) { html = renderer(match); title = pageTitle; found = true; break; }
    }
    closeModal();
    closeMobileNav();
    const app = document.getElementById('app');
    app.innerHTML = html;
    document.title = `${title} — AntiqueAuction`;
    updateActiveNav(path);
    applyImageFallbacks(app);
    if (path === '/antiques') { syncFilterControls(); updateListingGrid(); }
    tick();
    if (ui.lastRoute !== path) window.scrollTo({ top: 0, behavior: 'auto' });
    ui.lastRoute = path;
}
function updateActiveNav(path) {
    document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
    let target = path;
    if (path.startsWith('/antique/')) target = '/antiques';
    if (path.startsWith('/dashboard/')) target = path;
    document.querySelectorAll('.nav-link[href^="#/"]').forEach(el => {
        if (el.getAttribute('href') === '#' + target) el.classList.add('active');
    });
}

/* --------------------------- 4. COUNTDOWNS ------------------------------- */
function tick() {
    const now = Date.now();
    document.querySelectorAll('[data-countdown]').forEach(el => {
        let diff = Number(el.dataset.countdown) - now;
        if (diff < 0) diff = 0;
        const s = Math.floor(diff / 1000);
        const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
        el.textContent = (d > 0 ? `${d}d ` : '') + `${pad(h)}:${pad(m)}:${pad(sec)}`;
        const box = el.closest('.countdown-box');
        if (box) box.classList.toggle('urgent', diff < 3600000 && diff > 0);
    });
}

/* --------------------------- 5. LISTING FILTERS -------------------------- */
function filteredAntiques() {
    const f = ui.filters;
    const q = f.q.trim().toLowerCase();
    let items = state.antiques.filter(a => {
        if (q && ![a.name, a.description, a.era, a.origin, a.category, a.sub, a.provenance].join(' ').toLowerCase().includes(q)) return false;
        if (f.categories.length && !f.categories.includes(a.category)) return false;
        if (f.eras.length && !f.eras.includes(a.eraKey)) return false;
        if (f.origins.length && !f.origins.includes(a.region)) return false;
        if (f.condition && a.condition !== f.condition) return false;
        if (a.currentBid > f.maxPrice) return false;
        if (f.authenticatedOnly && !a.authenticated) return false;
        if (f.liveOnly && !a.live) return false;
        return true;
    });
    const sorters = {
        ending: (a, b) => a.endAt - b.endAt,
        'price-high': (a, b) => b.currentBid - a.currentBid,
        'price-low': (a, b) => a.currentBid - b.currentBid,
        popular: (a, b) => b.bidCount - a.bidCount,
        newest: (a, b) => b.id - a.id
    };
    return items.sort(sorters[f.sort] || sorters.ending);
}
function syncFilterControls() {
    const f = ui.filters;
    document.querySelectorAll('[data-filter-key]').forEach(el => {
        const k = el.dataset.filterKey;
        if (el.type === 'checkbox') {
            el.checked = Array.isArray(f[k]) ? f[k].includes(el.value) : !!f[k];
        } else if (el.id === 'priceRange') {
            el.value = f[k];
            const label = document.getElementById('priceLabel');
            if (label) label.textContent = money(f[k]);
        } else if (el.type === 'radio') {
            el.checked = el.value === f[k];
        } else {
            el.value = f[k];
        }
    });
    const search = document.getElementById('listingSearch');
    if (search) search.value = f.q;
}
function updateListingGrid() {
    const grid = document.getElementById('listingGrid');
    if (!grid) return;
    const items = filteredAntiques();
    grid.className = `grid grid-3 listing-grid ${ui.filters.view === 'list' ? 'list-view' : ''}`;
    grid.innerHTML = listingGridHTML(items);
    applyImageFallbacks(grid);
    const count = document.getElementById('resultCount');
    if (count) count.textContent = `Showing ${items.length} of ${state.antiques.length} antiques`;
    const chips = document.getElementById('activeFilterChips');
    if (chips) {
        const active = [];
        if (ui.filters.q) active.push(`“${esc(ui.filters.q)}”`);
        ui.filters.categories.forEach(c => active.push(c));
        ui.filters.eras.forEach(e => active.push(e));
        ui.filters.origins.forEach(o => active.push(o));
        if (ui.filters.condition) active.push(ui.filters.condition);
        if (ui.filters.authenticatedOnly) active.push('Authenticated');
        if (ui.filters.liveOnly) active.push('Live only');
        chips.innerHTML = active.length ? `<span class="badge badge-gold">${active.length} filter${active.length > 1 ? 's' : ''} active</span>` : '';
    }
}
function resetFilters() {
    ui.filters = { q: '', categories: [], eras: [], origins: [], condition: '', maxPrice: 250000, authenticatedOnly: false, liveOnly: false, sort: 'ending', view: ui.filters.view };
    if ((location.hash.replace('#', '') || '') === '/antiques') { syncFilterControls(); updateListingGrid(); }
    else location.hash = '#/antiques';
}

/* --------------------------- 6. MODALS ----------------------------------- */
const modalRoot = document.getElementById('modalRoot');
function openModal(inner, wide = false) {
    modalRoot.innerHTML = `<div class="modal-backdrop" data-action="close-modal"></div><div class="modal-dialog ${wide ? 'wide' : ''}" role="dialog" aria-modal="true">${inner}</div>`;
    modalRoot.classList.add('open');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('no-scroll');
}
function closeModal() {
    modalRoot.classList.remove('open');
    modalRoot.setAttribute('aria-hidden', 'true');
    modalRoot.innerHTML = '';
    document.body.classList.remove('no-scroll');
}
function modalHead(title, sub) {
    return `<div class="modal-head"><div><h3>${title}</h3>${sub ? `<p>${sub}</p>` : ''}</div><button class="modal-close" data-action="close-modal" aria-label="Close dialog"><i class="fa-solid fa-xmark"></i></button></div>`;
}
function loginForm() {
    return `<form data-form="auth-login">
        <div class="field"><label>Email address</label><input type="email" name="email" placeholder="you@example.com" value="demo@antiqueauction.com" required></div>
        <div class="field"><label>Password</label><input type="password" name="password" value="demo123" required></div>
        <button class="btn btn-gold btn-block" type="submit"><i class="fa-solid fa-right-to-bracket"></i> Sign In</button>
    </form>`;
}
function registerForm() {
    return `<form data-form="auth-register">
        <div class="form-grid">
            <div class="field"><label>Full name</label><input name="name" placeholder="Your name" required></div>
            <div class="field"><label>Email address</label><input type="email" name="email" placeholder="you@example.com" required></div>
        </div>
        <div class="form-grid">
            <div class="field"><label>Password</label><input type="password" name="password" minlength="4" required></div>
            <div class="field"><label>Account type</label><select name="role"><option>Collector</option><option>Seller</option></select></div>
        </div>
        <button class="btn btn-gold btn-block" type="submit"><i class="fa-solid fa-user-plus"></i> Create Account</button>
    </form>`;
}
function openAuthModal(tab = 'login') {
    openModal(`${modalHead('Welcome to AntiqueAuction', 'Sign in to bid, watch lots and manage your collection.')}
    <div class="modal-body">
        <div class="auth-tabs">
            <button class="${tab === 'login' ? 'active' : ''}" data-action="auth-tab" data-tab="login">Sign In</button>
            <button class="${tab === 'register' ? 'active' : ''}" data-action="auth-tab" data-tab="register">Register</button>
        </div>
        <div id="authFormArea">${tab === 'login' ? loginForm() : registerForm()}</div>
        <div class="auth-hint"><i class="fa-solid fa-circle-info"></i> Demo accounts: <strong>demo@antiqueauction.com / demo123</strong> (collector) · <strong>seller@antiqueauction.com / seller123</strong> (seller)</div>
        <div class="or-divider">OR</div>
        <div style="display:flex;gap:10px;flex-wrap:wrap">
            <button class="btn btn-outline btn-sm" data-action="demo-login" data-role="collector"><i class="fa-solid fa-user-tie"></i> Demo Collector</button>
            <button class="btn btn-outline btn-sm" data-action="demo-login" data-role="seller"><i class="fa-solid fa-store"></i> Demo Seller</button>
        </div>
    </div>`);
}
function openBidModal(id) {
    const a = getItem(id);
    if (!a) return;
    const inc = bidIncrement(a.currentBid);
    const min = a.currentBid + inc;
    openModal(`${modalHead('Place Your Bid', `Lot AA-${String(a.id).padStart(4, '0')} · ${a.name}`)}
    <div class="modal-body">
        <div style="display:flex;gap:16px;align-items:center;margin-bottom:20px">
            <img src="${a.images[0]}" alt="" data-fallback data-label="${esc(a.name)}" style="width:88px;height:88px;object-fit:cover;border-radius:10px">
            <div><span class="price-label">Current bid</span><div class="price-value" style="font-size:1.9rem">${money(a.currentBid)}</div><small class="muted">Minimum next bid ${money(min)}</small></div>
        </div>
        <form data-form="modal-bid">
            <input type="hidden" name="antiqueId" value="${a.id}">
            <div class="field"><label>Your bid (₹)</label><input type="number" name="amount" min="${min}" step="${inc}" value="${min}" required></div>
            <div class="quick-bids">${[1, 2, 3].map(n => `<button type="button" class="chip" data-action="quick-bid" data-amount="${a.currentBid + inc * n}">${money(a.currentBid + inc * n)}</button>`).join('')}</div>
            <button class="btn btn-gold btn-block btn-lg" type="submit"><i class="fa-solid fa-gavel"></i> Confirm Bid</button>
        </form>
        <p class="hint" style="margin-top:12px;text-align:center;font-size:.74rem">Bids are simulated and stored in your browser only.</p>
    </div>`);
    applyImageFallbacks(modalRoot);
}
function openListingModal(item) {
    const a = item || {};
    openModal(`${modalHead(item ? 'Edit Listing' : 'List an Antique', item ? 'Update the lot details below.' : 'Add a new lot to your inventory.')}
    <div class="modal-body">
        <form data-form="listing">
            ${item ? `<input type="hidden" name="id" value="${a.id}">` : ''}
            <div class="form-grid">
                <div class="field"><label>Antique name *</label><input name="name" value="${esc(a.name || '')}" placeholder="e.g. Victorian writing desk" required></div>
                <div class="field"><label>Category *</label><select name="category">${CATEGORIES.map(c => `<option ${a.category === c.key ? 'selected' : ''} value="${c.key}">${c.name}</option>`).join('')}</select></div>
                <div class="field"><label>Era</label><select name="era">${ERAS.map(e => `<option ${a.eraKey === e.key ? 'selected' : ''} value="${e.key}">${e.label}</option>`).join('')}</select></div>
                <div class="field"><label>Origin</label><input name="origin" value="${esc(a.origin || 'England')}" required></div>
                <div class="field"><label>Condition</label><select name="condition">${CONDITIONS.map(c => `<option ${a.condition === c ? 'selected' : ''}>${c}</option>`).join('')}</select></div>
                <div class="field"><label>Starting price (₹) *</label><input type="number" name="startingPrice" min="1000" value="${a.startingPrice || 25000}" required></div>
            </div>
            <div class="field"><label>Description *</label><textarea name="description" required placeholder="Describe the piece, its materials and distinguishing features…">${esc(a.description || '')}</textarea></div>
            <div class="field"><label>Image URL (optional)</label><input name="image" type="url" value="${esc(a.images ? a.images[0] : '')}" placeholder="https://…"><span class="hint">Leave blank to use a decorative placeholder image.</span></div>
            <div class="modal-foot" style="padding:6px 0 0"><button type="button" class="btn btn-outline" data-action="close-modal">Cancel</button><button class="btn btn-gold" type="submit"><i class="fa-solid fa-floppy-disk"></i> ${item ? 'Save Changes' : 'Publish Listing'}</button></div>
        </form>
    </div>`, true);
}
function certificateHTML(c) {
    const a = getItem(c.antiqueId) || { name: 'Antique', era: '', origin: '' };
    let seed = 0;
    for (const ch of c.number) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
    const cells = Array.from({ length: 81 }, (_, i) => `<i class="${((seed >> (i % 24)) + i) % 3 === 0 ? '' : 'off'}"></i>`).join('');
    return `<div class="certificate">
        <div class="cert-kicker">AntiqueAuction · Heritage Board</div>
        <h2>Certificate of Authenticity</h2>
        <div class="cert-sub">Issued in accordance with the AntiqueAuction verification standard</div>
        <div class="cert-body">This is to certify that the undermentioned item has been examined by our panel of specialists and, to the best of their knowledge and belief, is <strong>genuine and consistent with its described age and origin</strong>.</div>
        <div class="cert-name">${esc(a.name)}</div>
        <div class="cert-meta">
            <div><strong>Certificate Number</strong>${esc(c.number)}</div>
            <div><strong>Date of Issue</strong>${fmtDate(c.date)}</div>
            <div><strong>Period / Origin</strong>${esc(a.era)} · ${esc(a.origin)}</div>
            <div><strong>Verified By</strong>${esc(c.verifiedBy)}</div>
        </div>
        <div style="font-size:.82rem;font-style:italic;color:#6F5236">${esc(c.report || 'Materials, construction and provenance consistent with the declared period.')}</div>
        <div class="cert-seal-big">🏺</div>
        <div class="qr-grid" aria-hidden="true">${cells}</div>
        <div style="font-family:monospace;font-size:.7rem;color:#8B6B4A">VERIFY AT ANTIQUEAUCTION / ${esc(c.number)}</div>
        <div class="cert-sign"><span>${esc(c.verifiedBy)}<br>Examining Specialist</span><span>${esc(c.registrar || 'AntiqueAuction Heritage Board')}<br>Registrar</span></div>
    </div>`;
}
function openCertificateModal(id) {
    const c = state.certificates.find(x => x.id === Number(id));
    if (!c) { toast('Certificate not found', 'error'); return; }
    openModal(`${modalHead('Certificate of Authenticity', `Reference ${c.number}`)}
    <div class="modal-body">${certificateHTML(c)}</div>
    <div class="modal-foot no-print"><button class="btn btn-outline" data-action="close-modal">Close</button><button class="btn btn-gold" data-action="print-certificate" data-id="${c.id}"><i class="fa-solid fa-print"></i> Print Certificate</button></div>`, true);
}
function openReportModal() {
    openModal(`${modalHead('Seller Performance Report', 'Print-ready summary of your AntiqueAuction activity.')}
    <div class="modal-body">
        <div class="certificate" style="text-align:left">
            <div class="cert-kicker">AntiqueAuction · Consignor Report</div>
            <h2 style="font-size:2rem">Performance Summary</h2>
            <div class="cert-meta" style="grid-template-columns:1fr 1fr">
                <div><strong>Report date</strong>${fmtDate(new Date().toISOString())}</div>
                <div><strong>Active listings</strong>${state.antiques.filter(a => a.sellerId === 2).length}</div>
                <div><strong>Total bids received</strong>${state.antiques.filter(a => a.sellerId === 2).reduce((s, a) => s + a.bidCount, 0)}</div>
                <div><strong>Portfolio value</strong>${money(state.antiques.filter(a => a.sellerId === 2).reduce((s, a) => s + a.currentBid, 0))}</div>
            </div>
            <p style="font-size:.82rem;color:#6F5236">This report is generated locally from demonstration data. No financial transactions are recorded.</p>
        </div>
    </div>
    <div class="modal-foot no-print"><button class="btn btn-outline" data-action="close-modal">Close</button><button class="btn btn-gold" data-action="print-report"><i class="fa-solid fa-print"></i> Print / Save as PDF</button></div>`, true);
}
function printContent(selector) {
    const source = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!source) return;
    document.getElementById('printArea').innerHTML = source.innerHTML;
    window.print();
}
function printCertificate(id) {
    const c = state.certificates.find(x => x.id === Number(id));
    if (c) { document.getElementById('printArea').innerHTML = certificateHTML(c); window.print(); }
}

/* --------------------------- 7. ACTIONS ---------------------------------- */
function placeBid(id, amount) {
    const a = getItem(id);
    if (!a) return;
    const min = a.currentBid + bidIncrement(a.currentBid);
    if (amount < min) { toast(`Bid must be at least ${money(min)}`, 'error'); return; }
    const u = currentUser();
    state.bids.push({
        id: state.nextId.bid++, antiqueId: a.id, bidderId: u ? u.id : 1,
        bidderName: u ? u.name : 'Guest Bidder', amount: Number(amount),
        time: new Date().toISOString(), status: 'Leading'
    });
    state.bids.filter(b => b.antiqueId === a.id && b.id !== state.nextId.bid - 1).forEach(b => { if (b.status === 'Leading') b.status = 'Outbid'; });
    a.currentBid = Number(amount);
    a.bidCount += 1;
    save();
    closeModal();
    route();
    toast(`Bid of ${money(amount)} placed on ${a.name}`, 'success');
}
function loginUser(user) {
    state.currentUserId = user.id;
    save();
    renderAuthArea();
    closeModal();
    toast(`Welcome back, ${user.name.split(' ')[0]}`, 'success');
    const pending = ui.pending;
    ui.pending = null;
    if (pending) setTimeout(pending, 0);
    else route();
}
function renderAuthArea() {
    const area = document.getElementById('authArea');
    const u = currentUser();
    if (!u) {
        area.innerHTML = `<button class="btn btn-gold btn-sm" data-action="open-auth"><i class="fa-solid fa-right-to-bracket"></i> <span>Login / Register</span></button>`;
        return;
    }
    const dash = u.role === 'Seller' ? 'seller' : 'collector';
    area.innerHTML = `<div class="user-chip">
        <a href="#/dashboard/${dash}" class="avatar" title="${esc(u.name)}">${esc(u.name.split(' ').map(x => x[0]).join('').slice(0, 2).toUpperCase())}</a>
        <a href="#/dashboard/${dash}" class="user-meta">${esc(u.name.split(' ')[0])}<small>${esc(u.role)}</small></a>
        <button class="icon-btn" data-action="logout" title="Logout" aria-label="Logout"><i class="fa-solid fa-right-from-bracket"></i></button>
    </div>`;
}
function downloadCSV(filename, headers, rows) {
    const quote = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
    const csv = [headers, ...rows].map(row => row.map(quote).join(',')).join('\r\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = filename;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast(`${filename} downloaded`, 'success');
}

function handleAction(action, el) {
    const id = Number(el.dataset.id);
    switch (action) {
        case 'close-modal': closeModal(); break;
        case 'set-category':
            ui.filters.categories = [el.dataset.cat];
            location.hash = '#/antiques';
            if ((location.hash.replace('#', '') || '') === '/antiques') route();
            closeMobileNav();
            break;
        case 'clear-filters': resetFilters(); break;
        case 'toggle-filters': document.getElementById('filterPanel')?.classList.toggle('open'); break;
        case 'listing-view': {
            ui.filters.view = el.dataset.view;
            document.querySelectorAll('.view-toggle button').forEach(b => b.classList.toggle('active', b === el));
            updateListingGrid();
            break;
        }
        case 'toggle-watch': {
            const i = state.watchlist.indexOf(id);
            const added = i < 0;
            if (added) state.watchlist.push(id); else state.watchlist.splice(i, 1);
            save();
            document.querySelectorAll(`[data-action="toggle-watch"][data-id="${id}"]`).forEach(btn => {
                btn.classList.toggle('active', added);
                const icon = btn.querySelector('i');
                if (icon) icon.className = `fa-${added ? 'solid' : 'regular'} fa-heart`;
                if (btn.dataset.id && btn.textContent.trim() && !btn.classList.contains('watch-btn')) {
                    btn.lastChild.textContent = added ? ' Watching' : ' Watchlist';
                }
            });
            toast(added ? 'Added to your watchlist' : 'Removed from your watchlist', added ? 'success' : 'info');
            break;
        }
        case 'quick-bid': {
            const input = document.querySelector('#bidAmount, [data-form="modal-bid"] input[name="amount"]');
            if (input) { input.value = el.dataset.amount; input.focus(); }
            break;
        }
        case 'open-bid': withUser(() => openBidModal(id)); break;
        case 'share': {
            const url = location.href;
            if (navigator.clipboard) navigator.clipboard.writeText(url).then(() => toast('Link copied to clipboard', 'success')).catch(() => toast(url, 'info'));
            else toast(url, 'info');
            break;
        }
        case 'tab': {
            el.parentElement.querySelectorAll('.tab-btn').forEach(b => b.classList.toggle('active', b === el));
            const panel = document.querySelector(`[data-panel="${el.dataset.tab}"]`);
            document.querySelectorAll('.tab-panel').forEach(p => p.classList.toggle('active', p === panel));
            break;
        }
        case 'set-thumb': {
            const main = document.getElementById('mainImage');
            const src = el.querySelector('img')?.src;
            if (main && src) main.innerHTML = `<img src="${src}" alt="Selected view" data-fallback data-label="Antique detail">`;
            el.parentElement.querySelectorAll('button').forEach(b => b.classList.toggle('active', b === el));
            applyImageFallbacks(main);
            break;
        }
        case 'open-certificate': openCertificateModal(el.dataset.id); break;
        case 'print-certificate': printCertificate(id); break;
        case 'print-report': printContent('.modal-dialog .certificate'); break;
        case 'request-verification': {
            location.hash = '#/authenticity';
            setTimeout(() => { const sel = document.getElementById('certAntique'); if (sel) sel.value = el.dataset.id; }, 60);
            break;
        }
        case 'open-auth': openAuthModal('login'); break;
        case 'auth-tab': {
            document.querySelectorAll('.auth-tabs button').forEach(b => b.classList.toggle('active', b === el));
            document.getElementById('authFormArea').innerHTML = el.dataset.tab === 'login' ? loginForm() : registerForm();
            break;
        }
        case 'demo-login': {
            const u = state.users.find(x => x.role.toLowerCase() === el.dataset.role);
            if (u) loginUser(u);
            break;
        }
        case 'logout':
            state.currentUserId = null; save(); renderAuthArea(); toast('You have been signed out', 'info'); route();
            break;
        case 'open-listing-form': openListingModal(null); break;
        case 'edit-listing': openListingModal(getItem(id)); break;
        case 'delete-listing': {
            if (!confirm('Delete this listing from the catalogue?')) break;
            state.antiques = state.antiques.filter(a => a.id !== id);
            save(); route(); toast('Listing deleted', 'success');
            break;
        }
        case 'mark-sold': {
            const a = getItem(id);
            if (a) { a.status = 'Sold'; a.live = false; save(); route(); toast('Listing marked as sold', 'success'); }
            break;
        }
        case 'export-bids':
            downloadCSV('antiqueauction-bids.csv', ['Bid ID', 'Antique', 'Bidder', 'Amount (INR)', 'Time', 'Status'],
                state.bids.map(b => [b.id, (getItem(b.antiqueId) || {}).name || '', b.bidderName, b.amount, b.time, b.status]));
            break;
        case 'export-antiques':
            downloadCSV('antiqueauction-listings.csv', ['Lot', 'Name', 'Category', 'Era', 'Origin', 'Condition', 'Current Bid', 'Bids', 'Status'],
                state.antiques.map(a => [`AA-${String(a.id).padStart(4, '0')}`, a.name, a.category, a.era, a.origin, a.condition, a.currentBid, a.bidCount, a.status || 'Active']));
            break;
        case 'export-valuations':
            downloadCSV('antiqueauction-valuations.csv', ['Item', 'Expert', 'Low Estimate', 'High Estimate', 'Confidence', 'Date', 'Notes'],
                state.valuations.map(v => [v.antiqueName, v.expert, v.estimatedLow, v.estimatedHigh, v.confidence + '%', v.date, v.notes]));
            break;
        case 'export-report': openReportModal(); break;
        case 'gallery-rotate':
            ui.galleryAngle = Math.max(-2, Math.min(2, ui.galleryAngle + Number(el.dataset.dir)));
            route();
            break;
        case 'gallery-light': ui.galleryNight = !ui.galleryNight; route(); break;
        case 'gallery-reset': ui.galleryAngle = 0; ui.galleryNight = false; route(); break;
        case 'open-gallery-item': location.hash = `#/antique/${id}`; break;
        default: break;
    }
}

/* --------------------------- 8. FORMS ------------------------------------ */
function handleSubmit(form) {
    const type = form.dataset.form;
    const data = Object.fromEntries(new FormData(form).entries());
    switch (type) {
        case 'newsletter':
            toast('Thank you for subscribing to The Collector’s Letter', 'success');
            form.reset();
            break;

        case 'bid':
        case 'modal-bid': {
            const target = data.antiqueId ? Number(data.antiqueId) : Number((location.hash.match(/\/antique\/(\d+)/) || [])[1]);
            const bidTarget = getItem(target);
            if (!bidTarget) { toast('Antique not found', 'error'); break; }
            const amount = Number(data.amount);
            if (!amount || amount < bidTarget.currentBid + bidIncrement(bidTarget.currentBid)) {
                toast(`Minimum bid is ${money(bidTarget.currentBid + bidIncrement(bidTarget.currentBid))}`, 'error');
                break;
            }
            withUser(() => placeBid(bidTarget.id, amount));
            break;
        }

        case 'auth-login': {
            const u = state.users.find(x => x.email.toLowerCase() === data.email.trim().toLowerCase() && x.password === data.password);
            if (!u) { toast('Invalid email or password', 'error'); break; }
            loginUser(u);
            break;
        }
        case 'auth-register': {
            if (state.users.some(x => x.email.toLowerCase() === data.email.trim().toLowerCase())) { toast('An account with that email already exists', 'error'); break; }
            const u = {
                id: state.nextId.user++, name: data.name.trim(), email: data.email.trim().toLowerCase(),
                password: data.password, role: data.role, joined: new Date().toISOString().slice(0, 10), city: 'India'
            };
            state.users.push(u); save(); loginUser(u);
            toast('Account created successfully', 'success');
            break;
        }

        case 'valuation': {
            const chosen = data.antiqueId ? getItem(data.antiqueId) : null;
            const name = chosen ? chosen.name : data.name;
            const baseByCat = { Furniture: 90000, Art: 120000, Jewelry: 60000, Books: 50000 };
            const eraMult = { Medieval: 2.4, Renaissance: 1.9, '18th Century': 1.5, Victorian: 1.2, Edwardian: 1.1, 'Art Deco': 1.25, 'Mid-Century': 0.9 };
            const condMult = { Excellent: 1.2, 'Very Good': 1.05, Good: 0.9, Fair: 0.65 };
            const mid = (baseByCat[data.category] || 60000) * (eraMult[chosen ? chosen.eraKey : data.era] || 1) * (condMult[data.condition] || 1);
            const low = Math.round(mid * 0.82 / 500) * 500;
            const high = Math.round(mid * 1.22 / 500) * 500;
            const experts = ['Dr. R. Natarajan', 'Dr. Anjali Rao', 'S. Krishnamurthy'];
            const expert = experts[Math.floor(Math.random() * experts.length)];
            const confidence = 78 + Math.floor(Math.random() * 17);
            const result = document.getElementById('valuationResult');
            const btn = document.getElementById('valSubmit');
            if (btn) { btn.disabled = true; btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Analysing comparable sales…'; }
            if (result) result.innerHTML = `<div class="panel text-center"><i class="fa-solid fa-spinner fa-spin fa-3x gold"></i><p class="muted" style="margin-top:14px">Consulting the valuation register…</p></div>`;
            setTimeout(() => {
                const notes = data.notes || 'Estimate prepared using documented comparable sales, period, origin and condition.';
                state.valuations.push({
                    id: state.nextId.valuation++, antiqueId: chosen ? chosen.id : null, antiqueName: name,
                    expert, estimatedLow: low, estimatedHigh: high, confidence,
                    date: new Date().toISOString(), notes,
                    ownerId: currentUser() ? currentUser().id : 1
                });
                save();
                if (result) result.innerHTML = `
                <div class="result-card">
                    <span class="badge badge-green"><i class="fa-solid fa-circle-check"></i> Estimate Complete</span>
                    <h3 style="margin-top:14px">${esc(name)}</h3>
                    <p class="muted" style="font-size:.84rem">${esc(data.category)} · ${esc(chosen ? chosen.era : data.era)} · ${esc(data.origin || '')} · ${esc(data.condition)}</p>
                    <span class="price-label">Estimated market value</span>
                    <div class="result-range">${money(low)} – ${money(high)}</div>
                    <div class="result-meter"><span style="width:${confidence}%"></span></div>
                    <p class="muted" style="font-size:.76rem">Confidence: ${confidence}% · Prepared by ${esc(expert)}</p>
                    <div class="curator-note" style="font-size:.85rem;margin-top:18px"><i class="fa-solid fa-quote-left"></i> ${esc(notes)}</div>
                    <p class="hint" style="margin-top:16px">Simulated estimate for demonstration purposes. Not a formal appraisal.</p>
                    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px">
                        <button class="btn btn-outline btn-sm" data-action="export-valuations"><i class="fa-solid fa-file-csv"></i> Export</button>
                        <a class="btn btn-gold btn-sm" href="#/authenticity"><i class="fa-solid fa-shield-halved"></i> Verify Authenticity</a>
                    </div>
                </div>`;
                if (btn) { btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-wand-magic-sparkles"></i> Get Another Estimate'; }
                toast('Valuation estimate ready', 'success');
            }, 900);
            break;
        }

        case 'verify': {
            const needle = data.number.trim().toUpperCase();
            const cert = state.certificates.find(c => c.number.toUpperCase() === needle);
            const box = document.getElementById('verifyResult');
            if (!box) break;
            if (!cert) {
                box.innerHTML = `<div class="verify-result invalid"><h4><i class="fa-solid fa-triangle-exclamation"></i> Not Found</h4><p style="font-size:.84rem;margin:6px 0 0">No certificate matches <strong>${esc(needle)}</strong>. Check the number and try again.</p></div>`;
                toast('Certificate not found', 'error');
            } else {
                const a = getItem(cert.antiqueId);
                box.innerHTML = `<div class="verify-result valid"><h4><i class="fa-solid fa-circle-check"></i> Genuine Certificate</h4>
                    <p style="font-size:.84rem;margin:8px 0"><strong>${esc(a ? a.name : 'Antique')}</strong> · ${esc(cert.number)}</p>
                    <p style="font-size:.78rem;color:var(--muted);margin:0">Verified by ${esc(cert.verifiedBy)} on ${fmtDate(cert.date)} · Status: ${cert.status}</p>
                    <button class="btn btn-outline btn-sm" data-action="open-certificate" data-id="${cert.id}" style="margin-top:12px"><i class="fa-solid fa-file-certificate"></i> View Certificate</button></div>`;
                toast('Certificate verified', 'success');
            }
            break;
        }

        case 'certificate': {
            const a = getItem(data.antiqueId);
            if (!a) break;
            const number = `AA-VER-${new Date().getFullYear()}-${String(2000 + state.nextId.certificate * 7).slice(-4)}`;
            const cert = {
                id: state.nextId.certificate++, antiqueId: a.id, number,
                verifiedBy: data.expert, date: new Date().toISOString().slice(0, 10), status: 'Verified',
                report: data.report || 'Materials, construction and provenance consistent with the declared period.',
                registrar: 'AntiqueAuction Heritage Board'
            };
            state.certificates.push(cert);
            a.authenticated = true;
            save();
            openCertificateModal(cert.id);
            toast(`Certificate ${number} issued`, 'success');
            break;
        }

        case 'listing': {
            const era = ERAS.find(e => e.key === data.era);
            const common = {
                name: data.name.trim(), category: data.category,
                sub: CATEGORIES.find(c => c.key === data.category)?.subs[0] || data.category,
                era: era ? era.label : data.era, eraKey: data.era, origin: data.origin.trim(),
                region: REGIONS.some(r => r.key === data.origin.trim()) ? data.origin.trim() : 'Europe',
                condition: data.condition, description: data.description.trim(),
                images: [data.image || U('photo-1494438639946-1ebd1d20bf85')]
            };
            if (data.id) {
                const a = getItem(data.id);
                if (a) Object.assign(a, common, { startingPrice: Number(data.startingPrice), authenticated: a.authenticated });
                toast('Listing updated', 'success');
            } else {
                state.antiques.push({
                    ...common, id: state.nextId.antique++, material: 'See description', dimensions: 'On request',
                    ageYears: 100, history: 'Newly consigned to AntiqueAuction.', provenance: 'Private consignment',
                    conditionNotes: 'Condition as described by the consignor.', restoration: [], authenticated: false,
                    startingPrice: Number(data.startingPrice), currentBid: Number(data.startingPrice),
                    bidCount: 0, views: 0, sellerId: currentUser() ? currentUser().id : 2,
                    featured: false, live: true, endAt: Date.now() + 7 * DAY,
                    curatorNote: '', status: 'Active'
                });
                toast('New antique listed successfully', 'success');
            }
            save(); closeModal(); location.hash = '#/antiques'; route();
            break;
        }
        default: break;
    }
}

/* --------------------------- 9. EVENT WIRING ----------------------------- */
function setupEvents() {
    document.addEventListener('click', e => {
        const actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            if (actionEl.tagName === 'A') e.preventDefault();
            handleAction(actionEl.dataset.action, actionEl, e);
        }
        if (e.target.closest('a[href^="#/"]')) closeMobileNav();
        if (!e.target.closest('.has-dropdown')) closeDropdowns();
    });

    document.addEventListener('submit', e => {
        const form = e.target.closest('[data-form]');
        if (!form) return;
        e.preventDefault();
        handleSubmit(form);
    });

    document.addEventListener('input', e => {
        if (e.target.id === 'listingSearch') { ui.filters.q = e.target.value; updateListingGrid(); }
    });

    document.addEventListener('change', e => {
        const key = e.target.dataset.filterKey;
        if (key) {
            if (e.target.type === 'checkbox') {
                if (Array.isArray(ui.filters[key])) {
                    const arr = ui.filters[key];
                    const i = arr.indexOf(e.target.value);
                    if (e.target.checked && i < 0) arr.push(e.target.value);
                    if (!e.target.checked && i >= 0) arr.splice(i, 1);
                } else ui.filters[key] = e.target.checked;
            } else if (e.target.type === 'radio') {
                ui.filters[key] = e.target.value;
            } else {
                ui.filters[key] = key === 'maxPrice' ? Number(e.target.value) : e.target.value;
            }
            if (key === 'maxPrice') {
                const label = document.getElementById('priceLabel');
                if (label) label.textContent = money(ui.filters.maxPrice);
            }
            updateListingGrid();
        }
        if (e.target.id === 'valItem' && e.target.value) {
            const a = getItem(e.target.value);
            if (a) {
                document.getElementById('valName').value = a.name;
                document.getElementById('valCategory').value = a.category;
                document.getElementById('valEra').value = a.eraKey;
                document.getElementById('valOrigin').value = a.origin;
                document.getElementById('valCondition').value = a.condition;
            }
        }
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') { closeModal(); closeMobileNav(); closeDropdowns(); }
    });

    window.addEventListener('hashchange', route);
    window.addEventListener('scroll', () => {
        document.getElementById('siteHeader').classList.toggle('scrolled', window.scrollY > 12);
        document.getElementById('backToTop').classList.toggle('show', window.scrollY > 400);
    }, { passive: true });
    window.addEventListener('afterprint', () => { document.getElementById('printArea').innerHTML = ''; });

    const hamburger = document.getElementById('hamburger');
    hamburger.addEventListener('click', () => {
        const open = document.getElementById('navMenu').classList.toggle('open');
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.nav-drop').forEach(btn => {
        btn.addEventListener('click', e => {
            e.stopPropagation();
            const parent = btn.parentElement;
            const willOpen = !parent.classList.contains('open');
            closeDropdowns();
            parent.classList.toggle('open', willOpen);
            btn.setAttribute('aria-expanded', String(willOpen));
        });
    });
    document.getElementById('themeToggle').addEventListener('click', () => {
        state.theme = state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = state.theme;
        updateThemeIcon(); save();
        toast(state.theme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled', 'info');
    });
    document.getElementById('backToTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
function updateThemeIcon() {
    const icon = document.querySelector('#themeToggle i');
    if (icon) icon.className = state.theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
}
function refreshDemoTimers() {
    const now = Date.now();
    state.antiques.forEach((a, i) => {
        if (a.live && a.endAt < now) a.endAt = now + (i + 1) * 2 * HOUR + 17 * 60 * 1000;
    });
}

/* --------------------------- 10. INIT ------------------------------------ */
function init() {
    refreshDemoTimers();
    document.documentElement.dataset.theme = state.theme === 'dark' ? 'dark' : 'light';
    updateThemeIcon();
    renderAuthArea();
    setupEvents();
    if (!location.hash) location.hash = '#/home';
    route();
    document.getElementById('year').textContent = new Date().getFullYear();
    setInterval(tick, 1000);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
