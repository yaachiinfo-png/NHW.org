
// Mobile menu toggle
(() => {
    const burger = document.getElementById('burgerBtn');
    const mobileNav = document.getElementById('mobileNav');
    if (burger && mobileNav) {
        burger.addEventListener('click', () => mobileNav.classList.toggle('open'));
        // close when a mobile link is clicked
        mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileNav.classList.remove('open')));
    }

    // Smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = Math.max(0, target.getBoundingClientRect().top + window.pageYOffset - 70);
                window.scrollTo({ top: offset, behavior: 'smooth' });
            }
        });
    });
})();

/* Gallery: load images from images/ folder, populate thumbnails, and provide prev/next controls */
(function(){
    const images = [
        'IMG-20250906-WA0008.jpg',
        'IMG-20250906-WA0013.jpg',
        'IMG-20250906-WA0021.jpg',
        'IMG-20250906-WA0033.jpg',
        'IMG-20250906-WA0038.jpg',
        'IMG-20250906-WA0039.jpg',
        'IMG-20250906-WA0040.jpg',
        'IMG-20250906-WA0042.jpg',
        'IMG-20250906-WA0043.jpg',
        'IMG-20250906-WA0044.jpg',
        'IMG-20250906-WA0045.jpg',
        'IMG-20250906-WA0046.jpg',
        'IMG-20250906-WA0047.jpg',
        'IMG-20250906-WA0048.jpg',
        'IMG-20250906-WA0049.jpg',
        'IMG-20250906-WA0050.jpg',
        'IMG-20250906-WA0051.jpg',
        'IMG-20250906-WA0052.jpg',
        'IMG-20250906-WA0053.jpg',
        'IMG-20250906-WA0054.jpg',
        'IMG-20250906-WA0055.jpg',
        'IMG-20250906-WA0056.jpg',
        'IMG-20250906-WA0057.jpg',
        'IMG-20250906-WA0058.jpg',
        'IMG-20250906-WA0059.jpg',
        'IMG-20250906-WA0060.jpg',
        'IMG-20250906-WA0061.jpg',
        'IMG-20250906-WA0062.jpg',
        'IMG-20250906-WA0063.jpg',
        'IMG-20250906-WA0064.jpg',
        'IMG-20250906-WA0065.jpg',
        'IMG-20250906-WA0066.jpg',
        'IMG-20250906-WA0067.jpg',
        'IMG-20250906-WA0068.jpg',
        'IMG-20250906-WA0069.jpg',
        'IMG-20250906-WA0070.jpg'
    ];

    const main = document.getElementById('galleryMain');
    const thumbs = document.getElementById('galleryThumbs');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');
    const lightbox = document.getElementById('lightbox');
    const lightImg = document.getElementById('lightboxImg');
    if(!main || !thumbs) return;

    let idx = 0;

    function show(i){
        idx = (i + images.length) % images.length;
        const tryPath1 = encodeURI('images/' + images[idx]);
        const tryPath2 = encodeURI(images[idx]);
        main.onerror = null;
        // try images/ first, fall back to root filename if loading fails
        main.src = tryPath1;
        main.onerror = function(){ main.onerror = null; if(main.src !== tryPath2) main.src = tryPath2; };
        // highlight thumb
        thumbs.querySelectorAll('img').forEach((t,ti)=> t.classList.toggle('active', ti===idx));
    }

    // populate thumbnails
    images.forEach((src, i)=>{
        const t = document.createElement('img');
        const tryThumb1 = encodeURI('images/' + src);
        const tryThumb2 = encodeURI(src);
        t.onerror = null;
        t.src = tryThumb1;
        t.onerror = function(){ t.onerror = null; if(t.src !== tryThumb2) t.src = tryThumb2; };
        t.alt = `thumb ${i+1}`;
        t.loading = 'lazy';
        t.style.width = '96px';
        t.style.height = '64px';
        t.style.objectFit = 'cover';
        t.style.borderRadius = '6px';
        t.style.cursor = 'pointer';
        t.addEventListener('click', ()=> show(i));
        thumbs.appendChild(t);
    });

    // prev/next
    if(prevBtn) prevBtn.addEventListener('click', ()=> show(idx-1));
    if(nextBtn) nextBtn.addEventListener('click', ()=> show(idx+1));

    // open lightbox on main click
    main.addEventListener('click', ()=>{
        if(!lightbox || !lightImg) return;
        lightImg.src = images[idx];
        lightbox.style.display = 'flex';
        lightbox.setAttribute('aria-hidden','false');
    });

    // lightbox close
    if(lightbox){
        lightbox.addEventListener('click', ()=>{ lightbox.style.display='none'; lightbox.setAttribute('aria-hidden','true'); lightImg.src=''; });
        document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') { lightbox.style.display='none'; lightbox.setAttribute('aria-hidden','true'); lightImg.src=''; } });
    }

    // keyboard nav left/right
    document.addEventListener('keydown', (e)=>{
        if(e.key==='ArrowLeft') show(idx-1);
        if(e.key==='ArrowRight') show(idx+1);
    });

    // init
    show(0);
})();

    /* Media tabs (Images / Videos / Sermons) - show/hide panels */
    (function(){
        const tabs = Array.from(document.querySelectorAll('.tab'));
        const panels = {
            images: document.getElementById('imagesPanel'),
            videos: document.getElementById('videosPanel'),
            sermons: document.getElementById('sermonsPanel')
        };
        if(!tabs.length) return;

        function showPanel(name){
            Object.keys(panels).forEach(k=>{
                const el = panels[k]; if(!el) return;
                el.style.display = (k === name) ? 'block' : 'none';
            });
            tabs.forEach(t=> t.classList.toggle('active', t.dataset.tab === name));
        }

        tabs.forEach(t=> t.addEventListener('click', (e)=>{
            e.preventDefault();
            const name = t.dataset.tab || 'images';
            showPanel(name);
        }));

        // initialize: show the panel for the active tab or default to images
        const active = tabs.find(t=> t.classList.contains('active'));
        showPanel(active ? active.dataset.tab : 'images');
    })();

// Invert colors toggle: persists to localStorage and updates aria-pressed
(() => {
    const invertBtn = document.getElementById('invertBtn');
    const KEY = 'site_inverted_v1';
    function setInverted(val){
        try {
            if(val){ document.documentElement.classList.add('inverted'); }
            else { document.documentElement.classList.remove('inverted'); }
            if(invertBtn) invertBtn.setAttribute('aria-pressed', String(Boolean(val)));
        } catch(e){ /* silent */ }
    }

    // initialize from stored value
    try{
        const stored = localStorage.getItem(KEY);
        if(stored === '1') setInverted(true);
    }catch(e){}

    if(invertBtn){
        invertBtn.addEventListener('click', ()=>{
            const currently = document.documentElement.classList.contains('inverted');
            const next = !currently;
            setInverted(next);
            try{ localStorage.setItem(KEY, next ? '1' : '0'); }catch(e){}
        });
    }
})();

/* Populate local videos from videos/ folder */
(function(){
    const videoContainer = document.getElementById('localVideoGrid');
    if(!videoContainer) return;

    const videos = [
        'v7 (1).mp4','v7 (2).mp4','v7 (3).mp4','v7 (4).mp4','v7 (5).mp4','v7 (6).mp4','v7 (7).mp4','v7 (8).mp4','v7 (9).mp4','v7 (10).mp4','v7 (11).mp4'
    ];

    videos.forEach(src=>{
        const wrap = document.createElement('div');
        wrap.style.marginBottom = '12px';
        const box = document.createElement('div');
        box.style.aspectRatio = '16/9';
        box.style.background = 'var(--card)';
        box.style.borderRadius = '8px';
        box.style.overflow = 'hidden';

        const v = document.createElement('video');
        v.controls = true;
        v.preload = 'metadata';
        v.style.width = '100%';
        v.style.height = '100%';
        v.style.objectFit = 'cover';

        // provide two possible source locations so files work either in `videos/` or at site root
    const s1 = document.createElement('source');
    s1.src = encodeURI('videos/' + src);
    s1.type = 'video/mp4';
    const s2 = document.createElement('source');
    s2.src = encodeURI(src);
    s2.type = 'video/mp4';
        v.appendChild(s1);
        v.appendChild(s2);

        // if the video element errors, log useful debug info
        v.addEventListener('error', (e)=>{
            console.warn('Video load error for', src, e);
            // show a simple inline fallback message
            const errNote = document.createElement('div');
            errNote.textContent = 'Unable to load video: ' + src;
            errNote.style.color = 'var(--page-text)';
            errNote.style.padding = '8px 0';
            wrap.appendChild(errNote);
        });

        box.appendChild(v);
        wrap.appendChild(box);

        const caption = document.createElement('div');
        caption.textContent = src.split('/').pop();
    caption.style.marginTop = '6px';
    caption.style.fontSize = '13px';
    caption.style.color = 'var(--page-text)';
        wrap.appendChild(caption);

        const dl = document.createElement('a');
        dl.href = src; dl.download = ''; dl.textContent = 'Download'; dl.className = 'btn'; dl.style.marginLeft='8px'; dl.style.display='inline-block';
        wrap.appendChild(dl);

        videoContainer.appendChild(wrap);
    });
})();
