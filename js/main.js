/* ═══════════════════════════════════════
   MAIN.JS — Alluring Occasions by Bianca
   GSAP Animations + Calendar + UI Logic
═══════════════════════════════════════ */

(function () {
    'use strict';

    // ── WAIT FOR GSAP ──────────────────────────────────
    function initAll() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            setTimeout(initAll, 80);
            return;
        }
        gsap.registerPlugin(ScrollTrigger);

        initHeroAnimation();
        initScrollReveal();
        initParallaxBanner();
        initServicesSection();
        initGallery();
        initCounters();
        initTestimonialMarquee();
        initTestimonialsSlider();
        initFAQ();
        initCalendar();
        initTextFlipAnimations();
        initMobileNav();
        initContactForm();
        setFooterYear();
    }

    // ── MANUAL SPLIT TEXT ──────────────────────────────
    function splitChars(el) {
        const text = el.textContent;
        el.textContent = '';
        return text.split('').map(char => {
            const span = document.createElement('span');
            span.className = 'char';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.display = 'inline-block';
            el.appendChild(span);
            return span;
        });
    }

    function splitWords(el) {
        const text = el.textContent;
        el.innerHTML = '';
        return text.split(' ').map((word, i, arr) => {
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'bottom';
            wrapper.style.padding = '0.2em 0.3em';
            wrapper.style.margin = '-0.2em -0.3em';
            const inner = document.createElement('span');
            inner.className = 'word-inner';
            inner.style.display = 'inline-block';
            inner.textContent = word + (i < arr.length - 1 ? '\u00A0' : '');
            wrapper.appendChild(inner);
            el.appendChild(wrapper);
            return inner;
        });
    }

    // ── HERO ANIMATION ─────────────────────────────────
    function initHeroAnimation() {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        // Split each hero-line into words
        const lines = document.querySelectorAll('.hero-line');
        const allWords = [];
        lines.forEach(line => {
            const words = splitWords(line);
            allWords.push(...words);
        });

        // Eyebrow
        tl.from('.hero-eyebrow', { y: 20, opacity: 0, duration: 0.7 }, 0);

        // Heading words cascade up
        tl.from(allWords, {
            y: '110%',
            opacity: 0,
            duration: 0.85,
            stagger: 0.04,
            ease: 'power4.out',
        }, 0.3);

        // Sub + CTA + scroll hint
        tl.to('.hero-sub', { opacity: 1, y: 0, duration: 0.7 }, 0.9);
        tl.to('.hero-cta-group', { opacity: 1, y: 0, duration: 0.6 }, 1.1);
        tl.to('.hero-scroll-hint', { opacity: 1, duration: 0.6 }, 1.4);

        // Subtle endless parallax on the hero image
        gsap.to('.hero-img', {
            yPercent: 18,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1.2,
            },
        });
    }

    // ── SCROLL REVEAL HELPERS ──────────────────────────
    function revealFrom(selector, fromVars, scrollTriggerOpts) {
        const els = document.querySelectorAll(selector);
        if (!els.length) return;

        // Use fromTo pattern to avoid ScrollTrigger initialization bugs where elements pop off screen
        const toVars = {
            duration: fromVars.duration,
            ease: fromVars.ease,
            stagger: fromVars.stagger,
            clearProps: "transform,opacity",
            scrollTrigger: {
                trigger: null, // will be overridden
                start: 'top 88%',
                toggleActions: 'play none none none',
                ...scrollTriggerOpts,
            }
        };

        if (fromVars.x !== undefined) toVars.x = 0;
        if (fromVars.y !== undefined) toVars.y = 0;
        if (fromVars.opacity !== undefined) toVars.opacity = 1;

        els.forEach(el => {
            gsap.set(el, fromVars);
            const instanceToVars = { ...toVars };
            instanceToVars.scrollTrigger.trigger = el;
            gsap.to(el, instanceToVars);
        });
    }

    function initScrollReveal() {
        revealFrom('.js-reveal-up', { y: 55, opacity: 0, duration: 0.9, ease: 'power3.out' });
        revealFrom('.js-reveal-left', { x: -60, opacity: 0, duration: 0.9, ease: 'power3.out' });
        revealFrom('.js-reveal-right', { x: 60, opacity: 0, duration: 0.9, ease: 'power3.out' });
        revealFrom('.js-reveal-fade', { opacity: 0, duration: 0.8, ease: 'power2.out' });

        // Section headings — split on scroll
        document.querySelectorAll('.section .js-split-heading').forEach(el => {
            const words = splitWords(el);
            gsap.set(words, { y: '100%', opacity: 0 });
            gsap.to(words, {
                y: '0%',
                opacity: 1,
                duration: 0.75,
                stagger: 0.05,
                ease: 'power3.out',
                clearProps: "transform,opacity",
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            });
        });
    }

    // ── PARALLAX BANNER ────────────────────────────────
    function initParallaxBanner() {
        const bg = document.getElementById('parallaxBg');
        if (!bg) return;

        // Scrub the background image opposite to scroll for depth
        gsap.to(bg, {
            yPercent: 22,
            ease: 'none',
            scrollTrigger: {
                trigger: '#parallaxBanner',
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1.2,
            },
        });

        // Fade + slide the text content in (fromTo to prevent FOUC)
        gsap.fromTo('.parallax-eyebrow',
            { opacity: 0, y: 25 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: '#parallaxBanner',
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            }
        );
        gsap.fromTo('.parallax-quote',
            { opacity: 0, y: 35 },
            {
                opacity: 1, y: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.15,
                scrollTrigger: {
                    trigger: '#parallaxBanner',
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            }
        );
        gsap.fromTo('.parallax-content .btn',
            { opacity: 0, y: 20 },
            {
                opacity: 1, y: 0,
                duration: 0.7,
                ease: 'power3.out',
                delay: 0.3,
                scrollTrigger: {
                    trigger: '#parallaxBanner',
                    start: 'top 70%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }

    // ── SERVICES SECTION ANIMATION ─────────────────────
    function initServicesSection() {
        const servicesTitlesContainer = document.querySelector(".services-titles");
        const servicesImagesContainer = document.querySelector(".services-images");
        const servicesHeader = document.querySelector(".services-header");
        const servicesTitlesContainerElement = document.querySelector(".services-titles-container");
        const servicesIntroTextElements = document.querySelectorAll(".services-intro-text");

        if (!servicesTitlesContainer || !servicesImagesContainer || !servicesTitlesContainerElement) return;

        const servicesTitleElements = servicesTitlesContainer.querySelectorAll("p");
        let servicesImageElements = Array.from(
            servicesImagesContainer.querySelectorAll(".services-img")
        );

        if (servicesImageElements.length < servicesTitleElements.length) {
            const originalImages = [...servicesImageElements];
            while (servicesImageElements.length < servicesTitleElements.length) {
                originalImages.forEach(img => {
                    if (servicesImageElements.length < servicesTitleElements.length) {
                        const clone = img.cloneNode(true);
                        clone.style.opacity = "0";
                        servicesImagesContainer.appendChild(clone);
                        servicesImageElements.push(clone);
                    }
                });
            }
        }

        const servicesItems = Array.from(servicesTitleElements).map(title => ({
            name: title.textContent,
            img: title.getAttribute('data-img')
        }));

        const itemCount = servicesItems.length;
        const servicesConfig = {
            gap: Math.min(0.12, 1 / (itemCount * 2)),
            speed: 0.3,
            arcRadius: 500
        };

        const totalAnimationDuration = (itemCount - 1) * servicesConfig.gap + servicesConfig.speed;
        const dynamicScrollHeight = Math.max(
            window.innerHeight * (2 + itemCount * 0.8),
            window.innerHeight * 5
        );

        let servicesCurrentActiveIndex = 0;
        const bgImgEl = document.querySelector(".services-bg-img img");
        if (bgImgEl && servicesItems[0] && servicesItems[0].img) {
            bgImgEl.loading = "eager";
            bgImgEl.src = servicesItems[0].img;
        }

        const servicesContainerWidth = window.innerWidth * 0.3;
        const servicesContainerHeight = window.innerHeight;
        const servicesArcStartX = servicesContainerWidth - 220;
        const servicesArcStartY = -200;
        const servicesArcEndY = servicesContainerHeight + 200;
        const servicesArcControlPointX = servicesArcStartX + servicesConfig.arcRadius;
        const servicesArcControlPointY = servicesContainerHeight / 2;

        function getServicesBezierPosition(t) {
            const x = (1 - t) * (1 - t) * servicesArcStartX +
                2 * (1 - t) * t * servicesArcControlPointX +
                t * t * servicesArcStartX;
            const y = (1 - t) * (1 - t) * servicesArcStartY +
                2 * (1 - t) * t * servicesArcControlPointY +
                t * t * servicesArcEndY;
            return { x, y };
        }

        function getServicesImgProgressState(index, overallProgress) {
            const startTime = index * servicesConfig.gap;
            const endTime = startTime + servicesConfig.speed;
            if (overallProgress < startTime) return -1;
            if (overallProgress > endTime) return 2;
            return (overallProgress - startTime) / servicesConfig.speed;
        }

        // Progress proxy for smooth interpolation of scroll-wheel jumps
        const servicesProxy = { value: 0 };
        function applyServicesProgress(progress) {
                if (progress <= 0.2) {
                    const animProg = progress / 0.2;
                    const moveDist = window.innerWidth * 0.35;
                    gsap.set(servicesIntroTextElements[0], { x: -animProg * moveDist, opacity: 1 });
                    gsap.set(servicesIntroTextElements[1], { x: animProg * moveDist, opacity: 1 });
                    gsap.set(".services-bg-img", { transform: `scale(${animProg})` });
                    gsap.set(".services-bg-img img", { transform: `scale(${1.5 - animProg * 0.5})` });
                    servicesImageElements.forEach(img => gsap.set(img, { opacity: 0 }));
                    if (servicesHeader) servicesHeader.style.opacity = "0";
                    gsap.set(servicesTitlesContainerElement, { "--services-before-opacity": "0", "--services-after-opacity": "0" });
                } else if (progress <= 0.25) {
                    const fadeProg = (progress - 0.2) / 0.05;
                    gsap.set(".services-bg-img", { transform: "scale(1)" });
                    gsap.set(".services-bg-img img", { transform: "scale(1)" });
                    servicesIntroTextElements.forEach(el => gsap.set(el, { opacity: 1 - fadeProg }));
                    servicesImageElements.forEach(img => gsap.set(img, { opacity: 0 }));
                    if (servicesHeader) servicesHeader.style.opacity = fadeProg;
                    gsap.set(servicesTitlesContainerElement, { "--services-before-opacity": fadeProg, "--services-after-opacity": fadeProg });
                } else if (progress <= 0.95) {
                    gsap.set(".services-bg-img", { transform: "scale(1)" });
                    gsap.set(".services-bg-img img", { transform: "scale(1)" });
                    servicesIntroTextElements.forEach(el => gsap.set(el, { opacity: 0 }));
                    if (servicesHeader) servicesHeader.style.opacity = "1";
                    gsap.set(servicesTitlesContainerElement, { "--services-before-opacity": "1", "--services-after-opacity": "1" });

                    const switchProg = (progress - 0.25) / 0.7;
                    const normalizedProgress = switchProg * totalAnimationDuration;

                    const viewportHeight = window.innerHeight;
                    const titlesHeight = servicesTitlesContainer.scrollHeight;
                    const startY = viewportHeight;
                    const endY = -titlesHeight;
                    const totalDist = startY - endY;
                    const currentY = startY - switchProg * totalDist;
                    gsap.set(".services-titles", { transform: `translateY(${currentY}px)` });

                    servicesImageElements.forEach((img, index) => {
                        const imgProg = getServicesImgProgressState(index, normalizedProgress);
                        if (imgProg < 0 || imgProg > 1) {
                            gsap.set(img, { opacity: 0 });
                        } else {
                            const pos = getServicesBezierPosition(imgProg);
                            gsap.set(img, { x: pos.x - 100, y: pos.y - 75, opacity: 1 });
                        }
                    });

                    const viewportMid = viewportHeight / 2;
                    let closestIndex = 0, closestDist = Infinity;
                    servicesTitleElements.forEach((title, i) => {
                        const rect = title.getBoundingClientRect();
                        const titleCenter = rect.top + rect.height / 2;
                        const dist = Math.abs(titleCenter - viewportMid);
                        if (dist < closestDist) {
                            closestDist = dist;
                            closestIndex = i;
                        }
                    });
                    if (closestIndex !== servicesCurrentActiveIndex) {
                        if (servicesTitleElements[servicesCurrentActiveIndex]) {
                            servicesTitleElements[servicesCurrentActiveIndex].style.opacity = "0.25";
                            servicesTitleElements[servicesCurrentActiveIndex].classList.remove('active');
                        }
                        servicesTitleElements[closestIndex].style.opacity = "1";
                        servicesTitleElements[closestIndex].classList.add('active');
                        if (bgImgEl && servicesItems[closestIndex].img) {
                            bgImgEl.src = servicesItems[closestIndex].img;
                        }
                        servicesCurrentActiveIndex = closestIndex;
                    }
                } else {
                    if (servicesHeader) servicesHeader.style.opacity = "0";
                    gsap.set(servicesTitlesContainerElement, { "--services-before-opacity": "0", "--services-after-opacity": "0" });
                }
        }

        ScrollTrigger.create({
            trigger: ".services-section",
            start: "top top",
            end: `+=${dynamicScrollHeight}px`,
            pin: true,
            pinSpacing: true,
            scrub: 1,
            onUpdate: (self) => {
                gsap.to(servicesProxy, {
                    value: self.progress,
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: true,
                    onUpdate: () => applyServicesProgress(servicesProxy.value)
                });
            }
        });
    }

    // ── GALLERY STAGGER (batch reveals as items enter viewport) ──
    function initGallery() {
        const items = document.querySelectorAll('.js-gallery-item');
        if (!items.length) return;
        // Set initial hidden state
        gsap.set(items, { scale: 0.92, opacity: 0 });
        // Batch-trigger as items scroll into view
        ScrollTrigger.batch(items, {
            onEnter: (batch) => gsap.to(batch, {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                clearProps: 'transform,opacity'
            }),
            start: 'top 88%',
            once: true
        });
    }

    // ── ANIMATED COUNTERS ──────────────────────────────
    function initCounters() {
        document.querySelectorAll('.js-counter').forEach(el => {
            const numEl = el.querySelector('.stat-number');
            const target = parseInt(el.dataset.target, 10);

            ScrollTrigger.create({
                trigger: el,
                start: 'top 85%',
                once: true,
                onEnter() {
                    gsap.to({ val: 0 }, {
                        val: target,
                        duration: 2,
                        ease: 'power2.out',
                        onUpdate() {
                            numEl.textContent = Math.round(this.targets()[0].val);
                        },
                    });
                },
            });
        });
    }

    // ── TESTIMONIAL MARQUEE ────────────────────────────
    function initTestimonialMarquee() {
        const marqueeWrapper = document.querySelector('.testimonial-marquee-images');
        if (!marqueeWrapper) return;

        // Clone elements for a seamless infinite loop
        const elements = Array.from(marqueeWrapper.children);
        elements.forEach(el => {
            const clone = el.cloneNode(true);
            marqueeWrapper.appendChild(clone);
        });

        // Calculate proper width: each original set is 100%, so with clones we need 200%
        // The translate(-50%) in xPercent will seamlessly reset
        const totalChildren = marqueeWrapper.children.length;
        const childWidth = 100 / elements.length; // % per original child
        gsap.set(marqueeWrapper, { width: (totalChildren * childWidth) + "%" });

        gsap.to(marqueeWrapper, {
            xPercent: -50,
            ease: "none",
            duration: 40,
            repeat: -1
        });
    }

    // ── TESTIMONIALS SLIDER ────────────────────────────
    function initTestimonialsSlider() {
        const track = document.getElementById('testimonialsTrack');
        const cards = document.querySelectorAll('.js-testimonial');
        const dotsWrap = document.getElementById('sliderDots');
        const prevBtn = document.getElementById('testimonialPrev');
        const nextBtn = document.getElementById('testimonialNext');
        if (!track || !cards.length) return;

        let current = 0;
        const total = cards.length;

        // Build dots
        const dots = Array.from({ length: total }, (_, i) => {
            const b = document.createElement('button');
            b.className = 'slider-dot' + (i === 0 ? ' active' : '');
            b.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            b.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(b);
            return b;
        });

        function goTo(index) {
            current = (index + total) % total;
            const targetX = -cards[current].offsetLeft;
            gsap.to(track, {
                x: targetX,
                duration: 0.55,
                ease: 'power3.inOut',
            });
            dots.forEach((d, i) => d.classList.toggle('active', i === current));
        }

        prevBtn.addEventListener('click', () => goTo(current - 1));
        nextBtn.addEventListener('click', () => goTo(current + 1));

        // Keyboard navigation
        track.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') goTo(current - 1);
            if (e.key === 'ArrowRight') goTo(current + 1);
        });

        // Resize updates
        window.addEventListener('resize', () => {
            gsap.set(track, { x: -cards[current].offsetLeft });
        });

        // Auto-advance
        let autoplay = setInterval(() => goTo(current + 1), 5500);
        [prevBtn, nextBtn].forEach(btn => {
            btn.addEventListener('click', () => {
                clearInterval(autoplay);
                autoplay = setInterval(() => goTo(current + 1), 5500);
            });
        });

        // Reveal animation (fromTo to prevent FOUC)
        gsap.fromTo(cards,
            { opacity: 0, y: 40 },
            {
                opacity: 1, y: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: track,
                    start: 'top 88%',
                    toggleActions: 'play none none none',
                },
            }
        );
    }

    // ── FAQ ACCORDION ──────────────────────────────────
    function initFAQ() {
        document.querySelectorAll('.faq-question').forEach(btn => {
            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('aria-expanded') === 'true';
                const answer = btn.nextElementSibling;

                // First, collapse all other items
                document.querySelectorAll('.faq-question').forEach(otherBtn => {
                    if (otherBtn !== btn && otherBtn.getAttribute('aria-expanded') === 'true') {
                        otherBtn.setAttribute('aria-expanded', 'false');
                        const otherAns = otherBtn.nextElementSibling;
                        gsap.to(otherAns, {
                            height: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
                            onComplete: () => otherAns.setAttribute('hidden', '')
                        });
                    }
                });

                // Toggle logic for clicked item
                if (isExpanded) {
                    btn.setAttribute('aria-expanded', 'false');
                    gsap.to(answer, {
                        height: 0, opacity: 0, duration: 0.3, ease: 'power2.in',
                        onComplete: () => answer.setAttribute('hidden', '')
                    });
                } else {
                    btn.setAttribute('aria-expanded', 'true');
                    answer.removeAttribute('hidden');
                    gsap.set(answer, { height: 'auto', opacity: 1 });
                    const h = answer.offsetHeight;
                    gsap.from(answer, { height: 0, opacity: 0, duration: 0.35, ease: 'power2.out' });
                }
            });
        });
    }

    // ── TEXT FLIP ANIMATION (Contact & Calendar) ────────
    function initTextFlipAnimations() {
        if (typeof Flip === 'undefined') return;
        gsap.registerPlugin(Flip);

        const headings = document.querySelectorAll('.js-flip-heading');
        headings.forEach(heading => {
            const textWrappers = heading.querySelectorAll('.js-flip-text');
            const allChars = [];

            textWrappers.forEach(wrapper => {
                const chars = splitChars(wrapper);
                allChars.push(...chars);
            });

            // Set base styling for Flip
            gsap.set(allChars, { position: "relative", display: "inline-block" });

            ScrollTrigger.create({
                trigger: heading,
                start: "top 80%",
                once: true,
                onEnter: () => {
                    // 1. Force the elements into a scattered, invisible state
                    gsap.set(allChars, {
                        x: () => gsap.utils.random(-200, 200),
                        y: () => gsap.utils.random(-150, 150),
                        rotation: () => gsap.utils.random(-90, 90),
                        opacity: 0
                    });

                    // 2. Record this invisible, scattered state
                    const state = Flip.getState(allChars);

                    // 3. Clear transforms but keep opacity 0 so they fade in via tween
                    gsap.set(allChars, { clearProps: "transform" });

                    // 4. Calculate total animation time for cleanup
                    const totalFlipTime = 1.4 + (allChars.length * 0.03);

                    // 5. Use Flip to animate FROM scattered state TO natural position
                    Flip.from(state, {
                        duration: 1.4,
                        ease: "elastic.out(1, 0.5)",
                        stagger: 0.03
                    });

                    // 6. Fade in opacity independently (Flip doesn't animate opacity)
                    gsap.to(allChars, {
                        opacity: 1,
                        duration: 0.5,
                        stagger: 0.03,
                        ease: "power2.out"
                    });

                    // 7. After ALL animations are done, lock in final visible state permanently
                    gsap.delayedCall(totalFlipTime + 0.2, () => {
                        allChars.forEach(c => {
                            c.style.opacity = "1";
                            c.style.transform = "none";
                            c.style.display = "inline-block";
                            c.style.position = "relative";
                        });
                    });
                }
            });
        });
    }

    // ── AVAILABILITY CALENDAR ──────────────────────────
    async function initCalendar() {
        let blockedDates = [];

        // Try to fetch blocked dates from CMS data file
        try {
            const res = await fetch('_data/blocked_dates.json');
            if (res.ok) {
                const data = await res.json();
                blockedDates = data.blocked_dates || [];
            }
        } catch (e) {
            // No data file yet — that's fine
        }

        const monthLabel = document.getElementById('calMonthLabel');
        const daysGrid = document.getElementById('calendarDays');
        const prevBtn = document.getElementById('calPrev');
        const nextBtn = document.getElementById('calNext');
        if (!monthLabel || !daysGrid) return;

        const today = new Date();
        let viewY = today.getFullYear();
        let viewM = today.getMonth(); // 0-indexed

        const MONTHS = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        function isBlocked(y, m, d) {
            const str = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            return blockedDates.includes(str);
        }

        function isPast(y, m, d) {
            const date = new Date(y, m, d);
            const t = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            return date < t;
        }

        function isToday(y, m, d) {
            return y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
        }

        function renderMonth() {
            monthLabel.textContent = `${MONTHS[viewM]} ${viewY}`;
            daysGrid.innerHTML = '';

            const firstDay = new Date(viewY, viewM, 1).getDay(); // 0=Sun
            const totalDays = new Date(viewY, viewM + 1, 0).getDate();

            // Empty cells before first day
            for (let i = 0; i < firstDay; i++) {
                const empty = document.createElement('div');
                empty.className = 'cal-day cal-day--empty';
                empty.setAttribute('aria-hidden', 'true');
                daysGrid.appendChild(empty);
            }

            // Day cells
            for (let d = 1; d <= totalDays; d++) {
                const cell = document.createElement('button');
                cell.className = 'cal-day';
                cell.textContent = d;
                cell.setAttribute('aria-label', `${MONTHS[viewM]} ${d}, ${viewY}`);

                if (isToday(viewY, viewM, d)) {
                    cell.classList.add('cal-day--today');
                    cell.setAttribute('aria-current', 'date');
                } else if (isBlocked(viewY, viewM, d)) {
                    cell.classList.add('cal-day--booked');
                    cell.setAttribute('aria-disabled', 'true');
                    cell.setAttribute('aria-label', `${MONTHS[viewM]} ${d}, ${viewY} — Booked`);
                } else if (isPast(viewY, viewM, d)) {
                    cell.classList.add('cal-day--past');
                    cell.setAttribute('aria-disabled', 'true');
                } else {
                    cell.addEventListener('click', () => {
                        document.querySelectorAll('.cal-day--selected').forEach(el => el.classList.remove('cal-day--selected'));
                        cell.classList.add('cal-day--selected');
                        // Pre-fill the contact form date
                        const dateInput = document.getElementById('contactDate');
                        if (dateInput) {
                            dateInput.value = `${viewY}-${String(viewM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                        }
                        // Smooth scroll to contact
                        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    });
                }

                daysGrid.appendChild(cell);
            }

            // Animate day cells in
            gsap.from(daysGrid.querySelectorAll('.cal-day:not(.cal-day--empty)'), {
                scale: 0.7,
                opacity: 0,
                duration: 0.35,
                stagger: { amount: 0.45, from: 'start' },
                ease: 'back.out(1.5)',
                clearProps: 'all',
            });
        }

        prevBtn.addEventListener('click', () => {
            viewM--;
            if (viewM < 0) { viewM = 11; viewY--; }
            renderMonth();
        });

        nextBtn.addEventListener('click', () => {
            viewM++;
            if (viewM > 11) { viewM = 0; viewY++; }
            renderMonth();
        });

        renderMonth();
    }

    // ── MOBILE NAV ─────────────────────────────────────
    function initMobileNav() {
        const header = document.getElementById('site-header');
        const toggle = document.getElementById('navToggle');
        if (!toggle || !header) return;

        toggle.addEventListener('click', () => {
            const open = header.classList.toggle('nav-open');
            toggle.setAttribute('aria-expanded', open);
            document.body.style.overflow = open ? 'hidden' : '';
        });

        // Close on nav link click
        document.querySelectorAll('.nav-links a').forEach(a => {
            a.addEventListener('click', () => {
                header.classList.remove('nav-open');
                toggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    // ── CONTACT FORM ───────────────────────────────────
    function initContactForm() {
        const form = document.getElementById('contactForm');
        const submitBtn = document.getElementById('formSubmitBtn');
        const successMsg = document.getElementById('formSuccessMsg');
        if (!form) return;

        form.addEventListener('submit', async e => {
            e.preventDefault();
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            submitBtn.disabled = true;
            submitBtn.querySelector('.btn-text').textContent = 'Sending…';

            // Simulate async send (replace with your form backend / Netlify Forms)
            await new Promise(r => setTimeout(r, 1400));

            form.reset();
            submitBtn.disabled = false;
            submitBtn.querySelector('.btn-text').textContent = 'Send My Inquiry';
            successMsg.removeAttribute('hidden');
            gsap.from(successMsg, { opacity: 0, y: 10, duration: 0.4 });
            setTimeout(() => successMsg.setAttribute('hidden', ''), 6000);
        });
    }

    // ── FOOTER YEAR ────────────────────────────────────
    function setFooterYear() {
        const el = document.getElementById('footerYear');
        if (el) el.textContent = new Date().getFullYear();
    }

    // ── KICK OFF ───────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAll);
    } else {
        initAll();
    }
})();
