/* ==========================================================================
   ANTIQUEAUCTION — VIEW RENDERERS (home, listing, detail, valuation, bidding)
   Each renderer returns an HTML string injected into #app by the router.
   ========================================================================== */

function viewHome() {
    const heroItem = state.antiques.find(a => a.featured && a.live) || state.antiques[0];
    const featured = state.antiques.filter(a => a.featured).slice(0, 6);
    const live = state.antiques.filter(a => a.live).slice(0, 3);
    const marqueeItems = ['VICTORIAN FURNITURE', 'OLD MASTER PAINTINGS', 'ESTATE JEWELRY', 'RARE FIRST EDITIONS', 'CERTIFIED AUTHENTICITY', 'LIVE ONLINE BIDDING', 'GLOBAL COLLECTORS'];

    return `
    <section class="hero" id="home">
        <div class="container hero-grid">
            <div>
                <span class="eyebrow">The Heritage Marketplace · Est. 1998</span>
                <h1 class="hero-title">Timeless treasures, <em>stories retold.</em></h1>
                <p class="hero-lead">Discover antiques, vintage pieces and rare collectibles with documented history. Browse our curated lots, read their provenance and bid with confidence — all from the comfort of home.</p>
                <div class="hero-actions">
                    <a class="btn btn-gold btn-lg" href="#/antiques">Explore the Collection <i class="fa-solid fa-arrow-right"></i></a>
                    <a class="btn btn-outline btn-lg" href="#/bidding"><i class="fa-solid fa-gavel"></i> Live Auctions</a>
                </div>
                <div class="hero-stats">
                    <div class="stat"><strong>${state.antiques.length}+</strong><span>Curated Lots</span></div>
                    <div class="stat"><strong>14</strong><span>Countries</span></div>
                    <div class="stat"><strong>98%</strong><span>Authenticated</span></div>
                    <div class="stat"><strong>24/7</strong><span>Online Bidding</span></div>
                </div>
            </div>
            <div class="hero-visual">
                <div class="hero-frame">
                    ${artImage(heroItem, 0)}
                    <div class="hero-caption"><small>Lot of the Season</small><strong>${esc(heroItem.name)}</strong></div>
                </div>
                <div class="float-card top">
                    <div class="label"><span class="live-dot"></span> Live now</div>
                    <div class="value" data-countdown="${heroItem.endAt}">--:--:--</div>
                </div>
                <div class="float-card bottom">
                    <div class="label">Current bid</div>
                    <div class="value">${money(heroItem.currentBid)}</div>
                </div>
            </div>
        </div>
    </section>

    <div class="marquee" aria-hidden="true">
        <div class="marquee-track">
            ${[...marqueeItems, ...marqueeItems].map(m => `<span><i class="fa-solid fa-asterisk"></i> ${m}</span>`).join('')}
        </div>
    </div>

    <section class="section">
        <div class="container">
            <div class="section-head centered">
                <span class="eyebrow">Handpicked for You</span>
                <h2>Featured Antiques</h2>
                <p>Exceptional pieces chosen by our curators for their craft, condition and compelling histories.</p>
            </div>
            <div class="grid grid-3">${featured.map(antiqueCard).join('')}</div>
            <div class="text-center" style="margin-top:36px">
                <a class="btn btn-outline btn-lg" href="#/antiques">View All Antiques <i class="fa-solid fa-arrow-right"></i></a>
            </div>
        </div>
    </section>

    <section class="section section-alt">
        <div class="container">
            <div class="section-head centered">
                <span class="eyebrow">Find Your Era</span>
                <h2>Browse by Category</h2>
                <p>From carved furniture to illuminated manuscripts — every collection tells a different story.</p>
            </div>
            <div class="grid grid-4">
                ${CATEGORIES.map(c => `
                    <a class="category-card" href="#/antiques" data-action="set-category" data-cat="${c.key}">
                        <div class="cat-icon"><i class="${c.icon}"></i></div>
                        <h3>${c.name}</h3>
                        <p>${c.blurb}</p>
                        <span class="cat-count">${state.antiques.filter(a => a.category === c.key).length} Lots Available →</span>
                        <div class="cat-subs">${c.subs.map(s => `<span>${s}</span>`).join('')}</div>
                    </a>`).join('')}
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <span class="eyebrow">Curator's Pick</span>
            <div class="grid grid-2 detail-layout">
                <div class="main-image" style="aspect-ratio:4/3">${artImage(state.antiques[5], 0)}</div>
                <div>
                    <span class="badge badge-gold"><i class="fa-solid fa-star"></i> Curator's Choice</span>
                    <h2 style="margin-top:16px">${esc(state.antiques[5].name)}</h2>
                    <p class="soft">${esc(state.antiques[5].description)}</p>
                    <div class="curator-note">“${esc(state.antiques[5].curatorNote)}”<br><small>— Dr. Anjali Rao, Senior Curator</small></div>
                    <div class="spec-table" style="margin:20px 0">
                        <table class="spec-table"><tbody>
                            <tr><th>Origin</th><td>${esc(state.antiques[5].origin)}, ${esc(state.antiques[5].era)}</td></tr>
                            <tr><th>Provenance</th><td>${esc(state.antiques[5].provenance)}</td></tr>
                            <tr><th>Estimate</th><td>${money(state.antiques[5].currentBid)} – ${money(Math.round(state.antiques[5].currentBid * 1.25))}</td></tr>
                        </tbody></table>
                    </div>
                    <a class="btn btn-gold" href="#/antique/${state.antiques[5].id}">Discover This Piece <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    </section>

    <section class="section section-alt">
        <div class="container">
            <div class="section-head">
                <span class="eyebrow">Closing Soon</span>
                <h2>Auction Highlights</h2>
                <p>Live lots with active bidding. Place your bid before the clock runs out.</p>
            </div>
            <div class="grid grid-3">${live.map(antiqueCard).join('')}</div>
            <div class="text-center" style="margin-top:36px">
                <a class="btn btn-dark" href="#/bidding">Enter the Live Auction <i class="fa-solid fa-gavel"></i></a>
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-head centered">
                <span class="eyebrow">Simple &amp; Transparent</span>
                <h2>How AntiqueAuction Works</h2>
            </div>
            <div class="grid grid-4">
                ${[
                    ['fa-solid fa-magnifying-glass', 'Explore', 'Browse curated lots with detailed histories, photographs and condition reports.'],
                    ['fa-solid fa-shield-halved', 'Verify', 'Review authentication records, provenance documents and expert notes.'],
                    ['fa-solid fa-gavel', 'Bid', 'Place secure bids live. Track the countdown and watch your position in real time.'],
                    ['fa-solid fa-box-open', 'Collect', 'Win, receive your certificate of authenticity and add the piece to your collection.']
                ].map((step, i) => `
                    <div class="panel text-center">
                        <div class="value-icon" style="margin-bottom:14px"><i class="${step[0]}"></i></div>
                        <span class="upper gold">Step ${String(i + 1).padStart(2, '0')}</span>
                        <h3 style="margin-top:8px">${step[1]}</h3>
                        <p class="muted" style="font-size:.85rem;margin:0">${step[2]}</p>
                    </div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section-sm" style="background:linear-gradient(120deg,#2D1B12,#5a3d27);color:#F5EDE6">
        <div class="container" style="display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center">
            <div>
                <span class="eyebrow" style="color:#D4A574">Expert Opinions</span>
                <h2 style="margin-bottom:8px">Wondering what it's worth?</h2>
                <p style="color:rgba(245,237,230,.72);margin:0;max-width:620px">Our specialists estimate value using provenance, condition, rarity and recent comparable sales — free, in minutes.</p>
            </div>
            <a class="btn btn-gold btn-lg" href="#/valuation">Get a Free Valuation <i class="fa-solid fa-arrow-right"></i></a>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-head centered"><span class="eyebrow">Collector Voices</span><h2>Trusted by Enthusiasts</h2></div>
            <div class="grid grid-3">
                ${[
                    ['“The provenance research was thorough and the bidding process could not be simpler. My first auction here was a delight.”', 'Ananya R.', 'Collector · Mumbai'],
                    ['“As a seller, I appreciated how clearly the condition report was documented. Serious buyers, fair process.”', 'Vikram S.', 'Seller · Jaipur'],
                    ['“The certificate of authenticity gave me complete confidence in a 250-year-old purchase. Beautiful platform.”', 'Dr. Leela P.', 'Collector · Bengaluru']
                ].map(q => `
                    <div class="panel text-center">
                        <div style="color:var(--gold);letter-spacing:3px">★★★★★</div>
                        <p style="font-style:italic;margin:16px 0">${q[0]}</p>
                        <strong class="serif">${q[1]}</strong><br><small class="muted">${q[2]}</small>
                    </div>`).join('')}
            </div>
        </div>
    </section>`;
}

function viewListing() {
    const catCounts = key => state.antiques.filter(a => a.category === key).length;
    const eraCounts = key => state.antiques.filter(a => a.eraKey === key).length;
    const regionCounts = key => state.antiques.filter(a => a.region === key).length;

    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>The Collection</span></div>
            <span class="eyebrow">Explore the Archive</span>
            <h1>The Collection</h1>
            <p>Browse ${state.antiques.length} curated lots. Filter by era, region, category, condition and price to find a piece with your name on it.</p>
        </div>
    </section>

    <section class="section-sm">
        <div class="container listing-layout">
            <aside class="filter-panel panel" id="filterPanel">
                <div class="filter-head"><h3><i class="fa-solid fa-sliders"></i> Filters</h3><button class="btn btn-ghost btn-sm" data-action="clear-filters">Clear all</button></div>

                <div class="filter-group">
                    <h4>Category</h4>
                    ${CATEGORIES.map(c => `<label class="check-row"><input type="checkbox" data-filter-key="categories" value="${c.key}"><span>${c.name}</span><span class="count">${catCounts(c.key)}</span></label>`).join('')}
                </div>
                <div class="filter-group">
                    <h4>Era</h4>
                    ${ERAS.map(e => `<label class="check-row"><input type="checkbox" data-filter-key="eras" value="${e.key}"><span>${e.label}</span><span class="count">${eraCounts(e.key)}</span></label>`).join('')}
                </div>
                <div class="filter-group">
                    <h4>Origin</h4>
                    ${REGIONS.map(r => `<label class="check-row"><input type="checkbox" data-filter-key="origins" value="${r.key}"><span>${r.label}</span><span class="count">${regionCounts(r.key)}</span></label>`).join('')}
                </div>
                <div class="filter-group">
                    <h4>Condition</h4>
                    <div class="radio-row">
                        <label class="chip"><input type="radio" name="condition" data-filter-key="condition" value="" checked> Any</label>
                        ${CONDITIONS.map(c => `<label class="chip"><input type="radio" name="condition" data-filter-key="condition" value="${c}"> ${c}</label>`).join('')}
                    </div>
                </div>
                <div class="filter-group">
                    <h4>Maximum Budget</h4>
                    <div class="range-value"><span>₹0</span><span id="priceLabel">₹2,50,000</span></div>
                    <input type="range" id="priceRange" data-filter-key="maxPrice" min="10000" max="250000" step="5000" value="250000">
                </div>
                <div class="filter-group" style="border-bottom:1px solid var(--border)">
                    <label class="check-row"><input type="checkbox" data-filter-key="authenticatedOnly"><span>Authenticated only</span><i class="fa-solid fa-shield-halved gold"></i></label>
                    <label class="check-row"><input type="checkbox" data-filter-key="liveOnly"><span>Live auctions only</span><i class="fa-solid fa-gavel gold"></i></label>
                </div>
            </aside>

            <div>
                <div class="listing-toolbar">
                    <div class="search-box"><i class="fa-solid fa-magnifying-glass"></i><input id="listingSearch" type="search" placeholder="Search antiques, eras, origins…" value="${esc(ui.filters.q)}" aria-label="Search antiques"></div>
                    <button class="btn btn-outline btn-sm filter-toggle" data-action="toggle-filters"><i class="fa-solid fa-sliders"></i> Filters</button>
                    <select class="toolbar-select" id="sortSelect" data-filter-key="sort" aria-label="Sort antiques">
                        <option value="ending">Ending soonest</option>
                        <option value="price-high">Price: high to low</option>
                        <option value="price-low">Price: low to high</option>
                        <option value="popular">Most bid</option>
                        <option value="newest">Newest first</option>
                    </select>
                    <div class="view-toggle" aria-label="View mode">
                        <button class="${ui.filters.view === 'grid' ? 'active' : ''}" data-action="listing-view" data-view="grid" aria-label="Grid view"><i class="fa-solid fa-grip"></i></button>
                        <button class="${ui.filters.view === 'list' ? 'active' : ''}" data-action="listing-view" data-view="list" aria-label="List view"><i class="fa-solid fa-list"></i></button>
                    </div>
                </div>
                <div class="results-bar">
                    <span id="resultCount">Showing ${state.antiques.length} antiques</span>
                    <span id="activeFilterChips"></span>
                </div>
                <div class="grid grid-3 listing-grid ${ui.filters.view === 'list' ? 'list-view' : ''}" id="listingGrid"></div>
            </div>
        </div>
    </section>`;
}

function listingGridHTML(items) {
    if (!items.length) {
        return `<div class="empty-state" style="grid-column:1/-1"><i class="fa-solid fa-magnifying-glass"></i><h3>No antiques found</h3><p>Try adjusting your filters or search terms.</p><button class="btn btn-outline" data-action="clear-filters">Clear filters</button></div>`;
    }
    return items.map(antiqueCard).join('');
}

function antiqueCard(a) {
    const watched = state.watchlist.includes(a.id);
    const cert = state.certificates.find(c => c.antiqueId === a.id);
    return `
    <article class="antique-card">
        <div class="card-img">
            ${artImage(a, 0)}
            <div class="card-tags">
                ${a.live ? '<span class="badge badge-red"><span class="live-dot"></span> Live</span>' : ''}
                ${cert ? '<span class="badge badge-green"><i class="fa-solid fa-shield-halved"></i> Verified</span>' : ''}
            </div>
            <button class="watch-btn ${watched ? 'active' : ''}" data-action="toggle-watch" data-id="${a.id}" aria-label="${watched ? 'Remove from' : 'Add to'} watchlist" title="Watchlist"><i class="fa-${watched ? 'solid' : 'regular'} fa-heart"></i></button>
        </div>
        <div class="card-body">
            <div class="card-meta">${esc(a.category)} · ${esc(a.eraKey)}</div>
            <h3 class="card-title"><a href="#/antique/${a.id}">${esc(a.name)}</a></h3>
            <p class="card-desc">${esc(a.description)}</p>
            <div class="card-foot">
                <div><span class="price-label">${a.live ? 'Current bid' : 'Asking price'}</span><div class="price-value">${money(a.currentBid)}</div><div class="bid-meta">${a.bidCount} bids · ${esc(a.origin)}</div></div>
                <a class="btn btn-gold btn-sm" href="#/antique/${a.id}">${a.live ? 'Bid Now' : 'View'}</a>
            </div>
        </div>
    </article>`;
}

function viewDetail(id) {
    const a = state.antiques.find(x => x.id === Number(id));
    if (!a) return viewNotFound();
    const related = state.antiques.filter(x => x.category === a.category && x.id !== a.id).slice(0, 3);
    const cert = state.certificates.find(c => c.antiqueId === a.id);
    const watched = state.watchlist.includes(a.id);
    const increment = bidIncrement(a.currentBid);
    const seller = state.users.find(u => u.id === a.sellerId);

    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><a href="#/antiques">The Collection</a><i class="fa-solid fa-chevron-right"></i><span>${esc(a.name)}</span></div>
            <span class="eyebrow">Lot No. AA-${String(a.id).padStart(4, '0')}</span>
            <h1>${esc(a.name)}</h1>
            <p>${esc(a.category)} · ${esc(a.era)} · ${esc(a.origin)}</p>
        </div>
    </section>

    <section class="section-sm">
        <div class="container detail-layout">
            <div class="detail-gallery">
                <div class="main-image" id="mainImage">${artImage(a, 0)}</div>
                <div class="thumbs">
                    ${a.images.map((src, i) => `<button class="${i === 0 ? 'active' : ''}" data-action="set-thumb" data-src="${i}" aria-label="View image ${i + 1}">${artImage(a, i)}</button>`).join('')}
                </div>
                <p class="muted" style="font-size:.74rem;margin-top:10px"><i class="fa-solid fa-camera"></i> ${a.images.length} high-resolution views · Click main image to enlarge</p>
            </div>

            <div>
                <div class="detail-lot">
                    ${a.live ? '<span class="badge badge-red"><span class="live-dot"></span> Live Auction</span>' : '<span class="badge badge-blue">Available Now</span>'}
                    ${cert ? '<span class="badge badge-green"><i class="fa-solid fa-shield-halved"></i> Authenticated</span>' : '<span class="badge badge-muted">Verification available</span>'}
                    <span class="badge badge-gold">${esc(a.condition)} Condition</span>
                </div>
                <h2 class="detail-title">${esc(a.name)}</h2>
                <p class="detail-sub">${esc(a.sub)} · Circa ${a.ageYears} years old · ${esc(a.origin)}</p>

                <div class="detail-price-box">
                    <span class="price-label">${a.live ? 'Current bid' : 'Asking price'}</span>
                    <div class="price-value" id="detailPrice">${money(a.currentBid)}</div>
                    <div class="bid-stats">
                        <div><span>Opening bid</span><strong>${money(a.startingPrice)}</strong></div>
                        <div><span>Total bids</span><strong id="detailBidCount">${a.bidCount}</strong></div>
                        <div><span>Bid increment</span><strong>${money(increment)}</strong></div>
                    </div>
                </div>

                ${a.live ? `
                <div class="countdown-box" id="countdownBox">
                    <i class="fa-solid fa-clock"></i>
                    <div><div class="cd-label">Auction closes in</div><div class="cd-time" data-countdown="${a.endAt}">--:--:--</div></div>
                </div>
                <form data-form="bid" class="bid-form" id="detailBidForm">
                    <div class="field"><input type="number" id="bidAmount" name="amount" min="${a.currentBid + increment}" step="${increment}" value="${a.currentBid + increment}" required aria-label="Your bid amount"></div>
                    <button class="btn btn-gold" type="submit"><i class="fa-solid fa-gavel"></i> Place Bid</button>
                </form>
                <div class="quick-bids">
                    ${[1, 2, 3].map(n => `<button class="chip" data-action="quick-bid" data-amount="${a.currentBid + increment * n}">+${money(increment * n)}</button>`).join('')}
                </div>` : `
                <div class="countdown-box" style="background:var(--info-bg);border-color:var(--border-strong)">
                    <i class="fa-solid fa-tag"></i><div><div class="cd-label">Available to purchase</div><div class="cd-time" style="color:var(--brown)">Make an offer</div></div>
                </div>
                <button class="btn btn-gold btn-block" data-action="open-bid" data-id="${a.id}" style="margin-bottom:10px"><i class="fa-solid fa-hand-holding-dollar"></i> Make an Offer</button>`}

                <div class="detail-actions">
                    <button class="btn btn-outline ${watched ? 'active' : ''}" data-action="toggle-watch" data-id="${a.id}"><i class="fa-${watched ? 'solid' : 'regular'} fa-heart"></i> ${watched ? 'Watching' : 'Watchlist'}</button>
                    <button class="btn btn-outline" data-action="share"><i class="fa-solid fa-share-alt"></i> Share</button>
                    <button class="btn btn-outline" data-action="open-certificate" data-id="${a.id}"><i class="fa-solid fa-file-certificate"></i> Certificate</button>
                </div>
                <p class="trust-line"><i class="fa-solid fa-lock"></i> Secure bidding · No payment required to place a bid · Demo project</p>

                <div style="margin-top:30px">
                    <div class="tabs" role="tablist">
                        <button class="tab-btn active" data-action="tab" data-tab="overview">Overview</button>
                        <button class="tab-btn" data-action="tab" data-tab="history">History &amp; Provenance</button>
                        <button class="tab-btn" data-action="tab" data-tab="condition">Condition Report</button>
                        <button class="tab-btn" data-action="tab" data-tab="authentication">Authentication</button>
                    </div>
                    <div class="tab-panel active" data-panel="overview">
                        <p class="soft">${esc(a.description)}</p>
                        <table class="spec-table"><tbody>
                            <tr><th>Category</th><td>${esc(a.sub)}</td></tr>
                            <tr><th>Era / Period</th><td>${esc(a.era)}</td></tr>
                            <tr><th>Origin</th><td>${esc(a.origin)}</td></tr>
                            <tr><th>Material</th><td>${esc(a.material)}</td></tr>
                            <tr><th>Dimensions</th><td>${esc(a.dimensions)}</td></tr>
                            <tr><th>Age</th><td>Approximately ${a.ageYears} years</td></tr>
                            <tr><th>Condition</th><td>${esc(a.condition)}</td></tr>
                            <tr><th>Seller</th><td>${esc(seller ? seller.name : 'Private Consignor')}</td></tr>
                        </tbody></table>
                    </div>
                    <div class="tab-panel" data-panel="history">
                        <h4>The Story</h4><p class="soft">${esc(a.history)}</p>
                        <h4 style="margin-top:18px">Provenance</h4><p class="soft">${esc(a.provenance)}</p>
                        <div class="timeline">
                            <div class="timeline-item"><strong>Circa ${new Date().getFullYear() - a.ageYears}</strong><span>Created in ${esc(a.origin)}</span></div>
                            <div class="timeline-item"><strong>Early 20th century</strong><span>Entered documented private ownership</span></div>
                            <div class="timeline-item"><strong>Recent years</strong><span>Conserved and catalogued by AntiqueAuction</span></div>
                            <div class="timeline-item"><strong>Today</strong><span>Offered in the ${esc(a.live ? 'live auction' : 'heritage collection')}</span></div>
                        </div>
                    </div>
                    <div class="tab-panel" data-panel="condition">
                        <h4>Condition: ${esc(a.condition)}</h4><p class="soft">${esc(a.conditionNotes)}</p>
                        <h4 style="margin-top:18px">Restoration History</h4>
                        ${a.restoration.length ? `<div class="timeline">${a.restoration.map(r => `<div class="timeline-item"><strong>${esc(r.year)}</strong><span>${esc(r.note)}</span></div>`).join('')}</div>` : '<p class="muted">No recorded restoration. Original surface throughout.</p>'}
                    </div>
                    <div class="tab-panel" data-panel="authentication">
                        ${cert ? `
                            <div class="verify-result valid">
                                <h4><i class="fa-solid fa-shield-halved"></i> Verified Authentic</h4>
                                <p style="font-size:.85rem;margin:8px 0">${esc(cert.report)}</p>
                                <p style="font-size:.78rem;color:var(--muted);margin:0">Certificate <strong>${cert.number}</strong> · ${esc(cert.verifiedBy)} · ${cert.date}</p>
                            </div>` : `<p class="soft">This lot has not yet been examined by our authentication board. Request a verification report below.</p>`}
                        <button class="btn btn-outline btn-sm" data-action="request-verification" data-id="${a.id}" style="margin-top:16px"><i class="fa-solid fa-file-circle-check"></i> Request Verification</button>
                    </div>
                </div>

                ${a.curatorNote ? `<div class="curator-note" style="margin-top:26px"><i class="fa-solid fa-quote-left"></i> ${esc(a.curatorNote)}<br><small>— Curatorial Note</small></div>` : ''}
            </div>
        </div>
    </section>

    ${related.length ? `<section class="section section-alt"><div class="container"><div class="section-head"><span class="eyebrow">You May Also Like</span><h2>More from ${esc(a.category)}</h2></div><div class="grid grid-3">${related.map(antiqueCard).join('')}</div></div></section>` : ''}`;
}

function viewValuation() {
    const options = state.antiques.map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('');
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Expert Valuation</span></div>
            <span class="eyebrow">Complimentary Service</span>
            <h1>Expert Valuation</h1>
            <p>Curious about an heirloom? Our specialists combine provenance, condition, rarity and recent comparable sales to give you a considered estimate — free of charge.</p>
        </div>
    </section>

    <section class="section">
        <div class="container valuation-layout">
            <div class="panel">
                <h3>Tell Us About Your Piece</h3>
                <p class="muted" style="font-size:.85rem">Select a catalogued lot for a quick estimate, or describe your own item below.</p>
                <form data-form="valuation">
                    <div class="field"><label for="valItem">Catalogued antique (optional)</label><select id="valItem" name="antiqueId"><option value="">— Describe my own item —</option>${options}</select></div>
                    <div class="form-grid">
                        <div class="field"><label for="valName">Item name *</label><input id="valName" name="name" placeholder="e.g. Victorian writing desk" required></div>
                        <div class="field"><label for="valCategory">Category *</label><select id="valCategory" name="category" required>${CATEGORIES.map(c => `<option value="${c.key}">${c.name}</option>`).join('')}</select></div>
                        <div class="field"><label for="valEra">Era / Period</label><select id="valEra" name="era">${ERAS.map(e => `<option value="${e.key}">${e.label}</option>`).join('')}</select></div>
                        <div class="field"><label for="valOrigin">Origin</label><input id="valOrigin" name="origin" placeholder="e.g. England" value="England"></div>
                    </div>
                    <div class="field"><label for="valCondition">Condition *</label><select id="valCondition" name="condition" required>${CONDITIONS.map(c => `<option value="${c}">${c}</option>`).join('')}</select></div>
                    <div class="field"><label for="valNotes">Anything else we should know?</label><textarea id="valNotes" name="notes" placeholder="Provenance, maker's marks, dimensions, restoration work…"></textarea></div>
                    <button class="btn btn-gold btn-block btn-lg" type="submit" id="valSubmit"><i class="fa-solid fa-wand-magic-sparkles"></i> Get My Free Estimate</button>
                </form>
                <p class="hint" style="margin-top:12px;text-align:center">Simulated valuation for demonstration purposes — no data leaves your browser.</p>
            </div>

            <div class="valuation-result" id="valuationResult">
                <div class="empty-state" style="border:1px dashed var(--border-strong);border-radius:var(--radius-lg);height:100%;display:flex;flex-direction:column;justify-content:center">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <h3>Your estimate will appear here</h3>
                    <p>Complete the form and our valuation engine will analyse the details in a moment.</p>
                </div>
            </div>
        </div>

        <div class="container" style="margin-top:64px">
            <div class="section-head centered"><span class="eyebrow">Meet the Specialists</span><h2>Our Panel of Experts</h2></div>
            <div class="expert-grid">
                ${[
                    ['RN', 'Dr. R. Natarajan', 'Furniture & Decorative Arts · 28 years'],
                    ['AR', 'Dr. Anjali Rao', ' Paintings & Manuscripts · 21 years'],
                    ['SK', 'S. Krishnamurthy', 'Jewelry & Timepieces · 17 years']
                ].map(e => `<div class="panel expert-card"><div class="expert-avatar">${e[0]}</div><h4>${e[1]}</h4><p>${e[2]}</p></div>`).join('')}
            </div>
        </div>

        ${state.valuations.filter(v => !v.ownerId || v.ownerId === (state.currentUserId || 1)).length ? `
        <div class="container" style="margin-top:60px">
            <div class="dash-section-head"><h3>Recent Valuations</h3><button class="btn btn-outline btn-sm" data-action="export-valuations"><i class="fa-solid fa-file-csv"></i> Export CSV</button></div>
            <div class="table-wrap"><table class="data-table"><thead><tr><th>Item</th><th>Expert</th><th>Estimate</th><th>Confidence</th><th>Date</th></tr></thead><tbody>
                ${state.valuations.slice().reverse().slice(0, 6).map(v => `<tr><td class="table-title">${esc(v.antiqueName)}</td><td>${esc(v.expert)}</td><td>${money(v.estimatedLow)} – ${money(v.estimatedHigh)}</td><td>${v.confidence}%</td><td>${fmtDate(v.date)}</td></tr>`).join('')}
            </tbody></table></div>
        </div>` : ''}
    </section>`;
}

function viewBidding() {
    const liveItems = state.antiques.filter(a => a.live);
    const featured = liveItems[0] || state.antiques[0];
    const recentBids = state.bids.slice().reverse().slice(0, 12);

    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Live Bidding</span></div>
            <span class="eyebrow">The Room is Open</span>
            <h1>Live Bidding</h1>
            <p>Real-time lots, transparent increments and complete bid histories. Place a bid, watch the clock and see where you stand.</p>
        </div>
    </section>

    <section class="section-sm">
        <div class="container">
            <div class="live-banner">
                <div>
                    <span class="live-badge"><span class="live-dot"></span> Auction in progress</span>
                    <h2 style="margin-top:14px">${esc(featured.name)}</h2>
                    <p>${esc(featured.description)}</p>
                    <div style="display:flex;gap:20px;flex-wrap:wrap;margin-top:20px">
                        <div><small style="color:var(--gold-light);letter-spacing:.12em;text-transform:uppercase;font-size:.66rem">Current bid</small><div class="serif" style="font-size:1.8rem">${money(featured.currentBid)}</div></div>
                        <div><small style="color:var(--gold-light);letter-spacing:.12em;text-transform:uppercase;font-size:.66rem">Bids placed</small><div class="serif" style="font-size:1.8rem">${featured.bidCount}</div></div>
                    </div>
                </div>
                <div class="lb-side">
                    <small style="letter-spacing:.16em;text-transform:uppercase;font-size:.68rem;color:rgba(245,237,230,.65)">Lot closes in</small>
                    <div class="cd-time" data-countdown="${featured.endAt}">--:--:--</div>
                    <a class="btn btn-gold" href="#/antique/${featured.id}" style="margin-top:10px">View Lot <i class="fa-solid fa-arrow-right"></i></a>
                </div>
            </div>

            <div class="stat-grid">
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-gavel"></i></div><span class="stat-trend">Active now</span></div><div class="stat-num">${liveItems.length}</div><div class="stat-name">Live Lots</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-hammer"></i></div><span class="stat-trend">+${state.bids.length} today</span></div><div class="stat-num">${state.bids.length}</div><div class="stat-name">Bids Placed</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div><span class="stat-trend">Across all lots</span></div><div class="stat-num">${money(liveItems.reduce((s, a) => s + a.currentBid, 0))}</div><div class="stat-name">Total Value</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-users"></i></div><span class="stat-trend">Registered</span></div><div class="stat-num">${state.users.length * 184}</div><div class="stat-name">Collectors</div></div>
            </div>

            <div class="dash-section-head"><h3>Live Lots</h3><button class="btn btn-outline btn-sm" data-action="export-bids"><i class="fa-solid fa-file-csv"></i> Export Bid Report</button></div>
            <div class="grid grid-3">
                ${liveItems.map(a => {
                    const pct = Math.min(100, Math.round((a.currentBid / (a.startingPrice * 2)) * 100));
                    return `<article class="antique-card live-bid-card">
                        <div class="card-img">${artImage(a, 0)}<div class="card-tags"><span class="badge badge-red"><span class="live-dot"></span> Live</span></div></div>
                        <div class="card-body">
                            <div class="card-meta">${esc(a.eraKey)} · ${esc(a.origin)}</div>
                            <h3 class="card-title"><a href="#/antique/${a.id}">${esc(a.name)}</a></h3>
                            <div class="price-label">Current bid</div><div class="price-value">${money(a.currentBid)}</div>
                            <div class="bid-progress"><span style="width:${pct}%"></span></div>
                            <div class="bid-meta">${a.bidCount} bids · Closes in <span data-countdown="${a.endAt}">--:--:--</span></div>
                            <div style="margin-top:14px;display:flex;gap:8px"><button class="btn btn-gold btn-sm" data-action="open-bid" data-id="${a.id}"><i class="fa-solid fa-gavel"></i> Bid Now</button><a class="btn btn-outline btn-sm" href="#/antique/${a.id}">Details</a></div>
                        </div>
                    </article>`;
                }).join('')}
            </div>

            <div class="dash-section" style="margin-top:46px">
                <div class="dash-section-head"><h3>Recent Bid Activity</h3><span class="muted" style="font-size:.8rem">Most recent first</span></div>
                <div class="panel">
                    ${recentBids.map(b => {
                        const item = state.antiques.find(a => a.id === b.antiqueId);
                        return `<div class="bid-history-row">
                            <div><strong>${esc(b.bidderName)}</strong> <span class="muted">bid on</span> <a href="#/antique/${b.antiqueId}" class="gold">${esc(item ? item.name : 'Lot')}</a></div>
                            <div><strong>${money(b.amount)}</strong> <span class="muted">· ${fmtTime(b.time)}</span></div>
                        </div>`;
                    }).join('')}
                </div>
            </div>
        </div>
    </section>`;
}
