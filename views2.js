/* ==========================================================================
   ANTIQUEAUCTION — VIEW RENDERERS (dashboards, verification, gallery, about)
   ========================================================================== */

function demoBanner(role) {
    if (currentUser()) return '';
    return `
    <div class="demo-banner">
        <i class="fa-solid fa-circle-info"></i>
        <span>You're browsing <strong>${role === 'seller' ? 'seller' : 'collector'} demo data</strong>. Sign in to personalise this dashboard and save your activity.</span>
        <button class="btn btn-gold btn-sm" data-action="demo-login" data-role="${role}">Continue as Demo ${role === 'seller' ? 'Seller' : 'Collector'}</button>
        <button class="btn btn-outline btn-sm" data-action="open-auth">Sign In</button>
    </div>`;
}

function viewDashboard(role) {
    const user = currentUser();
    const demoId = role === 'seller' ? 2 : 1;
    const uid = user ? user.id : demoId;
    const isSeller = role === 'seller';
    const myBids = state.bids.filter(b => b.bidderId === uid);
    const watching = state.antiques.filter(a => state.watchlist.includes(a.id));
    const myListings = state.antiques.filter(a => a.sellerId === uid);
    const wonIds = role === 'collector' ? [3, 8] : [];
    const won = state.antiques.filter(a => wonIds.includes(a.id));

    if (isSeller) {
        return `
        <section class="page-hero">
            <div class="container">
                <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Seller Dashboard</span></div>
                <span class="eyebrow">Consignor Studio</span>
                <h1>Seller Dashboard</h1>
                <p>Manage your inventory, track bidding activity and review completed sales.</p>
            </div>
        </section>
        <section class="section-sm">
            <div class="container">
                ${demoBanner('seller')}
                <div class="stat-grid">
                    <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-boxes-stacked"></i></div><span class="stat-trend">Live</span></div><div class="stat-num">${myListings.length}</div><div class="stat-name">Active Listings</div></div>
                    <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-eye"></i></div><span class="stat-trend">+12% MoM</span></div><div class="stat-num">${myListings.reduce((s, a) => s + a.views, 0).toLocaleString('en-IN')}</div><div class="stat-name">Total Views</div></div>
                    <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-hammer"></i></div><span class="stat-trend">This month</span></div><div class="stat-num">${myListings.reduce((s, a) => s + a.bidCount, 0)}</div><div class="stat-name">Bids Received</div></div>
                    <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-indian-rupee-sign"></i></div><span class="stat-trend">Realised</span></div><div class="stat-num">${money(428000)}</div><div class="stat-name">Sales Value</div></div>
                </div>

                <div class="dash-section">
                    <div class="dash-section-head"><h3>My Listings</h3>
                        <div style="display:flex;gap:8px;flex-wrap:wrap">
                            <button class="btn btn-outline btn-sm" data-action="export-antiques"><i class="fa-solid fa-file-csv"></i> Export CSV</button>
                            <button class="btn btn-gold btn-sm" data-action="open-listing-form"><i class="fa-solid fa-plus"></i> List an Antique</button>
                        </div>
                    </div>
                    <div class="table-wrap"><table class="data-table">
                        <thead><tr><th>Antique</th><th>Category</th><th>Status</th><th>Current Bid</th><th>Bids</th><th>Views</th><th>Actions</th></tr></thead>
                        <tbody>${myListings.length ? myListings.map(a => `
                            <tr>
                                <td><div style="display:flex;align-items:center;gap:10px"><img class="table-thumb" src="${a.images[0]}" alt="" data-fallback data-label="${esc(a.name)}"><div class="table-title">${esc(a.name)}<small>Lot AA-${String(a.id).padStart(4, '0')}</small></div></div></td>
                                <td>${esc(a.category)}</td>
                                <td>${a.status === 'Sold' ? '<span class="badge badge-blue">Sold</span>' : a.live ? '<span class="badge badge-red">Live</span>' : '<span class="badge badge-green">Active</span>'}</td>
                                <td><strong>${money(a.currentBid)}</strong></td>
                                <td>${a.bidCount}</td><td>${a.views}</td>
                                <td><div class="row-actions">
                                    <a class="btn btn-outline btn-sm" href="#/antique/${a.id}">View</a>
                                    <button class="btn btn-outline btn-sm" data-action="edit-listing" data-id="${a.id}">Edit</button>
                                    ${a.status === 'Sold' ? '' : `<button class="btn btn-outline btn-sm" data-action="mark-sold" data-id="${a.id}">Mark Sold</button>`}
                                    <button class="btn btn-outline btn-sm" data-action="delete-listing" data-id="${a.id}" title="Delete"><i class="fa-solid fa-trash"></i></button>
                                </div></td>
                            </tr>`).join('') : '<tr><td colspan="7" class="text-center muted">No listings yet. Add your first antique.</td></tr>'}
                        </tbody>
                    </table></div>
                </div>

                <div class="dash-grid">
                    <div class="dash-section">
                        <div class="dash-section-head"><h3>Completed Sales</h3></div>
                        <div class="table-wrap"><table class="data-table"><thead><tr><th>Antique</th><th>Buyer</th><th>Hammer Price</th><th>Date</th><th>Status</th></tr></thead><tbody>
                            ${[
                                ['Art Deco Silver Tea Service', 'R. Krishnamurthy', 64000, '2026-09-14'],
                                ['Edwardian Writing Slope', 'Priya Nair', 38500, '2026-08-02'],
                                ['Victorian Portrait Miniature', 'S. Iqbal', 325500, '2026-06-21']
                            ].map(s => `<tr><td class="table-title">${s[0]}</td><td>${s[1]}</td><td>${money(s[2])}</td><td>${fmtDate(s[3])}</td><td><span class="badge badge-green">Settled</span></td></tr>`).join('')}
                        </tbody></table></div>
                    </div>
                    <div class="dash-section">
                        <div class="dash-section-head"><h3>Performance</h3></div>
                        <div class="panel">
                            ${[['Browse-to-bid rate', 38], ['Verified lots', 62], ['Sell-through rate', 81], ['Buyer satisfaction', 96]].map(p => `
                                <div class="progress-row"><span class="pname">${p[0]}</span><div class="progress"><span style="width:${p[1]}%"></span></div><span class="pval">${p[1]}%</span></div>`).join('')}
                            <div class="curator-note" style="margin-top:18px;font-size:.85rem"><i class="fa-solid fa-lightbulb"></i> Tip: listings with a condition report and 3+ photos receive 40% more bids.</div>
                            <button class="btn btn-outline btn-block btn-sm" data-action="export-report" style="margin-top:16px"><i class="fa-solid fa-file-pdf"></i> Print Performance Report</button>
                        </div>
                    </div>
                </div>
            </div>
        </section>`;
    }

    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Collector Dashboard</span></div>
            <span class="eyebrow">Your Collection</span>
            <h1>Collector Dashboard</h1>
            <p>Keep track of the pieces you love, the bids you've placed and the treasures you've won.</p>
        </div>
    </section>
    <section class="section-sm">
        <div class="container">
            ${demoBanner('collector')}
            <div class="stat-grid">
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-gavel"></i></div><span class="stat-trend">Active bids</span></div><div class="stat-num">${myBids.filter(b => b.status === 'Leading').length}</div><div class="stat-name">Leading Bids</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-heart"></i></div><span class="stat-trend">Saved</span></div><div class="stat-num">${watching.length}</div><div class="stat-name">Watchlist</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-trophy"></i></div><span class="stat-trend">Collected</span></div><div class="stat-num">${won.length}</div><div class="stat-name">Won Items</div></div>
                <div class="stat-card"><div class="stat-top"><div class="stat-icon"><i class="fa-solid fa-file-certificate"></i></div><span class="stat-trend">Issued</span></div><div class="stat-num">${state.certificates.length}</div><div class="stat-name">Certificates</div></div>
            </div>

            <div class="dash-grid">
                <div class="dash-section">
                    <div class="dash-section-head"><h3>My Bidding History</h3><button class="btn btn-outline btn-sm" data-action="export-bids"><i class="fa-solid fa-file-csv"></i> Export CSV</button></div>
                    <div class="table-wrap"><table class="data-table"><thead><tr><th>Antique</th><th>Amount</th><th>Placed</th><th>Status</th></tr></thead><tbody>
                        ${myBids.length ? myBids.slice().reverse().map(b => {
                            const item = state.antiques.find(a => a.id === b.antiqueId);
                            return `<tr><td class="table-title">${esc(item ? item.name : 'Lot')}<small>${item ? item.eraKey : ''}</small></td><td><strong>${money(b.amount)}</strong></td><td>${fmtTime(b.time)}</td><td><span class="badge ${b.status === 'Leading' ? 'badge-green' : 'badge-muted'}">${b.status}</span></td></tr>`;
                        }).join('') : '<tr><td colspan="4" class="text-center muted">No bids yet. <a class="gold" href="#/bidding">Explore live lots</a>.</td></tr>'}
                    </tbody></table></div>
                </div>
                <div class="dash-section">
                    <div class="dash-section-head"><h3>Watchlist</h3></div>
                    <div class="panel">
                        <div class="mini-list">
                            ${watching.length ? watching.map(a => `<div class="mini-item">${artImage(a, 0)}<div class="mi-body"><strong>${esc(a.name)}</strong><small>${money(a.currentBid)} · ${a.live ? 'Live now' : 'Available'}</small></div><a class="icon-btn" href="#/antique/${a.id}" aria-label="View"><i class="fa-solid fa-arrow-right"></i></a></div>`).join('') : '<p class="muted">Your watchlist is empty.</p>'}
                        </div>
                    </div>
                </div>
            </div>

            <div class="dash-section" style="margin-top:36px">
                <div class="dash-section-head"><h3>Won Items</h3><span class="muted" style="font-size:.8rem">Awaiting collection / delivery</span></div>
                <div class="grid grid-3">${won.length ? won.map(antiqueCard).join('') : '<p class="muted">No won items yet.</p>'}</div>
            </div>

            <div class="dash-section" style="margin-top:20px">
                <div class="dash-section-head"><h3>My Valuations</h3><a class="btn btn-outline btn-sm" href="#/valuation">Request a Valuation</a></div>
                <div class="mini-list">
                    ${state.valuations.slice(0, 3).map(v => `<div class="mini-item"><div class="stat-icon"><i class="fa-solid fa-scale-balanced"></i></div><div class="mi-body"><strong>${esc(v.antiqueName)}</strong><small>${esc(v.expert)} · ${v.confidence}% confidence</small></div><strong class="gold">${money(v.estimatedLow)}–${money(v.estimatedHigh)}</strong></div>`).join('')}
                </div>
            </div>
        </div>
    </section>`;
}

function viewAuthenticity() {
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Authenticity Verification</span></div>
            <span class="eyebrow">The Heritage Board</span>
            <h1>Authenticity Verification</h1>
            <p>Every verified lot is examined by our specialists and issued a numbered certificate. Search the register or request a new report.</p>
        </div>
    </section>
    <section class="section">
        <div class="container verify-hero">
            <div class="panel">
                <h3>Verify a Certificate</h3>
                <p class="muted" style="font-size:.85rem">Enter the certificate number printed on your document, e.g. AA-VER-2026-1042.</p>
                <form class="verify-search" data-form="verify">
                    <input name="number" placeholder="AA-VER-2026-XXXX" required aria-label="Certificate number">
                    <button class="btn btn-gold" type="submit"><i class="fa-solid fa-magnifying-glass"></i> Verify</button>
                </form>
                <div id="verifyResult"></div>
            </div>
            <div class="panel">
                <h3>Request a Verification Report</h3>
                <p class="muted" style="font-size:.85rem">Select a catalogued lot and our board will simulate an examination and issue a report.</p>
                <form data-form="certificate">
                    <div class="field"><label for="certAntique">Antique</label><select id="certAntique" name="antiqueId" required>${state.antiques.map(a => `<option value="${a.id}">${esc(a.name)}</option>`).join('')}</select></div>
                    <div class="field"><label for="certExpert">Verifying expert</label><select id="certExpert" name="expert"><option>Dr. R. Natarajan</option><option>Dr. Anjali Rao</option><option>S. Krishnamurthy</option></select></div>
                    <div class="field"><label for="certReport">Examination notes</label><textarea id="certReport" name="report" placeholder="Observations about materials, construction and provenance…"></textarea></div>
                    <button class="btn btn-dark btn-block" type="submit"><i class="fa-solid fa-file-circle-check"></i> Generate Certificate</button>
                </form>
            </div>
        </div>

        <div class="container" style="margin-top:60px">
            <div class="section-head"><span class="eyebrow">Public Register</span><h2>Verified Lots</h2><p>A live view of authenticity reports issued by the AntiqueAuction Heritage Board.</p></div>
            <div class="table-wrap"><table class="data-table">
                <thead><tr><th>Certificate No.</th><th>Antique</th><th>Verified By</th><th>Date</th><th>Status</th><th></th></tr></thead>
                <tbody>${state.certificates.slice().reverse().map(c => {
                    const a = state.antiques.find(x => x.id === c.antiqueId);
                    return `<tr><td class="cert-number">${c.number}</td><td class="table-title">${esc(a ? a.name : 'Lot')}</td><td>${esc(c.verifiedBy)}</td><td>${fmtDate(c.date)}</td><td><span class="badge badge-green">${c.status}</span></td><td><button class="btn btn-outline btn-sm" data-action="open-certificate" data-id="${c.id}">View</button></td></tr>`;
                }).join('')}</tbody>
            </table></div>
        </div>
    </section>`;
}

function viewCertificates() {
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Certificates</span></div>
            <span class="eyebrow">Proof of Provenance</span>
            <h1>Certificate of Authenticity</h1>
            <p>Each certificate records the item, the examining specialist and the basis of the opinion. Open one to view or print it.</p>
        </div>
    </section>
    <section class="section">
        <div class="container">
            <div class="cert-grid">
                ${state.certificates.slice().reverse().map(c => {
                    const a = state.antiques.find(x => x.id === c.antiqueId);
                    return `<div class="cert-card">
                        <div class="cert-seal"><i class="fa-solid fa-award"></i></div>
                        <span class="upper gold">Certificate of Authenticity</span>
                        <h3 style="margin:8px 0 4px;font-size:1.3rem">${esc(a ? a.name : 'Antique')}</h3>
                        <p class="muted" style="font-size:.8rem;min-height:44px">${esc(a ? a.era + ' · ' + a.origin : '')}</p>
                        <div class="cert-number">${c.number}</div>
                        <p class="muted" style="font-size:.74rem;margin:10px 0">Verified by ${esc(c.verifiedBy)} · ${fmtDate(c.date)}</p>
                        <button class="btn btn-outline btn-sm btn-block" data-action="open-certificate" data-id="${c.id}"><i class="fa-solid fa-print"></i> View &amp; Print</button>
                    </div>`;
                }).join('')}
            </div>
            <div class="text-center" style="margin-top:36px"><a class="btn btn-gold" href="#/authenticity"><i class="fa-solid fa-shield-halved"></i> Verify a Certificate</a></div>
        </div>
    </section>`;
}

function viewGallery() {
    const items = [state.antiques[5], state.antiques[1], state.antiques[0], state.antiques[2]];
    const angle = ui.galleryAngle * 8;
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Virtual Gallery</span></div>
            <span class="eyebrow">Walk the Collection</span>
            <h1>Virtual Gallery</h1>
            <p>A quiet room, a few remarkable objects. Click any framed piece to open its full catalogue record.</p>
        </div>
    </section>
    <section class="section-sm">
        <div class="container">
            <div class="gallery-stage ${ui.galleryNight ? 'night' : ''}" id="galleryStage">
                <div class="gallery-room" style="transform:rotateY(${angle}deg) translateX(${ui.galleryAngle * 6}px)">
                    <div class="gallery-wall"></div>
                    <div class="gallery-floor"></div>
                    <div class="gallery-frames">
                        ${items.map(a => `<button class="gallery-frame" data-action="open-gallery-item" data-id="${a.id}">${artImage(a, 0)}<span>${esc(a.name)}</span></button>`).join('')}
                    </div>
                </div>
            </div>
            <div class="gallery-controls">
                <button class="btn btn-outline btn-sm" data-action="gallery-rotate" data-dir="-1"><i class="fa-solid fa-arrow-left"></i> Rotate Left</button>
                <button class="btn btn-outline btn-sm" data-action="gallery-light"><i class="fa-${ui.galleryNight ? 'sun' : 'moon'}"></i> ${ui.galleryNight ? 'Day Light' : 'Evening Light'}</button>
                <button class="btn btn-outline btn-sm" data-action="gallery-rotate" data-dir="1">Rotate Right <i class="fa-solid fa-arrow-right"></i></button>
                <button class="btn btn-ghost btn-sm" data-action="gallery-reset"><i class="fa-solid fa-rotate"></i> Reset View</button>
            </div>
            <p class="text-center muted" style="font-size:.8rem;margin-top:16px">A CSS-only gallery experience — no 3D libraries required.</p>
        </div>
    </section>`;
}

function viewCurators() {
    const sets = [
        { title: 'The Victorian Study', cover: state.antiques[6], ids: [1, 7, 11], text: 'Dark woods, brass fittings and the quiet grandeur of a 19th-century gentleman’s study.', curator: 'Dr. R. Natarajan' },
        { title: 'Colour & Contrast', cover: state.antiques[5], ids: [6, 2, 8], text: 'Three works where pigment and gold do all the talking — from Mughal courts to the Riviera.', curator: 'Dr. Anjali Rao' },
        { title: 'Wearable History', cover: state.antiques[2], ids: [3, 4, 11], text: 'Estate jewelry and timepieces with provenance you can hold in your hand.', curator: 'S. Krishnamurthy' }
    ];
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>Curator's Picks</span></div>
            <span class="eyebrow">The Curatorial Eye</span>
            <h1>Curator's Recommendations</h1>
            <p>Our specialists build small, focused collections around a theme. Each pick includes a short note on why it earned a place.</p>
        </div>
    </section>
    <section class="section">
        <div class="container">
            ${sets.map((s, i) => `
                <article class="panel collection-block">
                    <div class="collection-cover">${artImage(s.cover, 0)}</div>
                    <div>
                        <span class="upper gold">Collection ${String(i + 1).padStart(2, '0')} · Curated by ${esc(s.curator)}</span>
                        <h2 style="font-size:2rem;margin-top:8px">${s.title}</h2>
                        <p class="muted">${s.text}</p>
                        <div class="grid grid-3" style="gap:12px;margin-top:16px">
                            ${s.ids.map(id => {
                                const a = state.antiques.find(x => x.id === id);
                                return a ? `<a class="mini-item" href="#/antique/${a.id}">${artImage(a, 0)}<div class="mi-body"><strong>${esc(a.name)}</strong><small>${money(a.currentBid)}</small></div></a>` : '';
                            }).join('')}
                        </div>
                    </div>
                </article>`).join('')}
        </div>
    </section>
    <section class="quote-banner">
        <div class="container"><blockquote>“Antiques are not just objects; they are storytellers of history and craft.”</blockquote><cite>— Curator's Note</cite></div>
    </section>`;
}

function viewAbout() {
    return `
    <section class="page-hero">
        <div class="container">
            <div class="breadcrumb"><a href="#/home">Home</a><i class="fa-solid fa-chevron-right"></i><span>About Us</span></div>
            <span class="eyebrow">Our House</span>
            <h1>About AntiqueAuction</h1>
            <p>Three decades of connecting remarkable objects with the people who will care for them next.</p>
        </div>
    </section>

    <section class="section">
        <div class="container about-story">
            <div class="main-image" style="aspect-ratio:4/4.2">${artImage(state.antiques[0], 0)}</div>
            <div>
                <span class="eyebrow">Since 1998</span>
                <h2>A house built on curiosity</h2>
                <p class="soft">AntiqueAuction began in a single room above a Chennai bookshop, where a handful of collectors gathered to swap stories — and occasionally, objects. That small circle grew into a dedicated auction house with a simple belief: every antique deserves a documented story and a worthy next custodian.</p>
                <p class="soft">Today our curators, conservators and specialists work with collectors across fourteen countries. We research provenance, examine condition, issue certificates of authenticity and bring carefully catalogued lots to an online audience.</p>
                <div class="grid grid-2" style="gap:16px;margin-top:24px">
                    <div><strong class="serif gold" style="font-size:2rem">28</strong><p class="muted" style="font-size:.8rem;margin:0">Years of expertise</p></div>
                    <div><strong class="serif gold" style="font-size:2rem">14</strong><p class="muted" style="font-size:.8rem;margin:0">Countries served</p></div>
                    <div><strong class="serif gold" style="font-size:2rem">2,400+</strong><p class="muted" style="font-size:.8rem;margin:0">Lots catalogued</p></div>
                    <div><strong class="serif gold" style="font-size:2rem">98%</strong><p class="muted" style="font-size:.8rem;margin:0">Verified authentic</p></div>
                </div>
            </div>
        </div>
    </section>

    <section class="section section-alt">
        <div class="container">
            <div class="section-head centered"><span class="eyebrow">What We Stand For</span><h2>Our Values</h2></div>
            <div class="about-values">
                ${[
                    ['fa-solid fa-shield-halved', 'Provenance First', 'No lot is listed without a documented history and a clear chain of ownership where available.'],
                    ['fa-solid fa-ruler-combined', 'Honest Condition', 'Every flaw, repair and restoration is recorded in plain language, with photographs.'],
                    ['fa-solid fa-handshake', 'Lasting Relationships', 'We serve collectors, not transactions — advice continues long after the hammer falls.']
                ].map(v => `<div class="panel value-card"><div class="value-icon"><i class="${v[0]}"></i></div><h3>${v[1]}</h3><p class="muted" style="font-size:.85rem;margin:0">${v[2]}</p></div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section">
        <div class="container">
            <div class="section-head centered"><span class="eyebrow">Our People</span><h2>The Experts Behind the Lots</h2></div>
            <div class="expert-grid">
                ${[
                    ['RN', 'Dr. R. Natarajan', 'Furniture & Decorative Arts'],
                    ['AR', 'Dr. Anjali Rao', 'Paintings & Manuscripts'],
                    ['SK', 'S. Krishnamurthy', 'Jewelry & Timepieces']
                ].map(e => `<div class="panel expert-card"><div class="expert-avatar">${e[0]}</div><h4>${e[1]}</h4><p>${e[2]}</p></div>`).join('')}
            </div>
        </div>
    </section>

    <section class="section section-alt">
        <div class="container">
            <div class="section-head centered"><span class="eyebrow">Milestones</span><h2>Our Journey</h2></div>
            <div class="timeline" style="max-width:640px;margin:auto">
                ${[
                    ['1998', 'The first collector’s meet is held above a bookshop in Chennai.'],
                    ['2007', 'The authentication board is formed and the first certificates issued.'],
                    ['2016', 'Our catalogue goes fully online, reaching collectors across India.'],
                    ['2026', 'The virtual gallery and live online bidding experience launches.']
                ].map(t => `<div class="timeline-item"><strong>${t[0]}</strong><span>${t[1]}</span></div>`).join('')}
            </div>
        </div>
    </section>
    <section class="quote-banner">
        <div class="container"><blockquote>“We do not sell the past. We look after it until the next chapter begins.”</blockquote><cite>— The AntiqueAuction Mission</cite></div>
    </section>`;
}

function viewNotFound() {
    return `
    <section class="section text-center" style="min-height:60vh;display:flex;align-items:center;justify-content:center">
        <div>
            <div style="font-size:5rem;color:var(--border-strong)">🏺</div>
            <h1>Lot Not Found</h1>
            <p class="muted">This page or antique doesn't exist in the catalogue.</p>
            <a class="btn btn-gold" href="#/home">Back to Home</a>
        </div>
    </section>`;
}
