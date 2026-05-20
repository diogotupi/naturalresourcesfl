(function () {
  "use strict";

  const motionOk = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year in footer
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      menuToggle.classList.toggle("active", open);
      menuToggle.setAttribute("aria-expanded", open);
      document.body.classList.toggle("nav-open", open);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.classList.remove("nav-open");
      });
    });
  }

  // Dropdown toggles (desktop + mobile)
  document.querySelectorAll(".nav__trigger").forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.stopPropagation();
      const item = trigger.closest(".nav__item");
      const wasOpen = item.classList.contains("nav__item--open");

      document.querySelectorAll(".nav__item--open").forEach((el) => {
        el.classList.remove("nav__item--open");
        el.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
      });

      if (!wasOpen) {
        item.classList.add("nav__item--open");
        trigger.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", () => {
    document.querySelectorAll(".nav__item--open").forEach((el) => {
      el.classList.remove("nav__item--open");
      el.querySelector(".nav__trigger")?.setAttribute("aria-expanded", "false");
    });
  });

  // Quote form steps
  const quoteForm = document.getElementById("quoteForm");
  if (quoteForm) {
    const steps = quoteForm.querySelectorAll(".form-step");
    const progress = document.querySelector(".quote-card__progress");
    let currentStep = 0;

    function goToStep(index) {
      steps.forEach((s, i) => s.classList.toggle("active", i === index));
      if (progress) {
        progress.querySelectorAll("span").forEach((dot, i) => {
          dot.classList.toggle("active", i <= index);
        });
      }
      currentStep = index;
    }

    quoteForm.querySelector("[data-next]")?.addEventListener("click", () => {
      const service = quoteForm.querySelector("#service");
      const size = quoteForm.querySelector("#size");
      if (!service.value || !size.value) {
        (service.value ? size : service).focus();
        return;
      }
      goToStep(1);
    });

    quoteForm.querySelector("[data-prev]")?.addEventListener("click", () => {
      goToStep(0);
    });

    quoteForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = quoteForm.querySelector("#name");
      const phone = quoteForm.querySelector("#phone");
      const email = quoteForm.querySelector("#email");
      if (!name.value || !phone.value || !email.value) return;

      steps.forEach((s) => s.classList.remove("active"));
      const success = quoteForm.querySelector('[data-step="3"]');
      success.hidden = false;
      success.classList.add("active");
      if (progress) progress.style.display = "none";
    });
  }

  // Contact form
  const contactForm = document.getElementById("contactForm");
  const contactSuccess = document.getElementById("contactSuccess");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }
      contactForm.reset();
      if (contactSuccess) contactSuccess.hidden = false;
      setTimeout(() => {
        if (contactSuccess) contactSuccess.hidden = true;
      }, 5000);
    });
  }

  // Reviews carousel
  const reviews = document.querySelectorAll(".review-card");
  const dots = document.querySelectorAll("#reviewDots span");
  const prevBtn = document.getElementById("reviewPrev");
  const nextBtn = document.getElementById("reviewNext");
  let reviewIndex = 0;

  function showReview(index) {
    if (!reviews.length) return;
    const next = (index + reviews.length) % reviews.length;
    const current = reviews[reviewIndex];
    const upcoming = reviews[next];

    if (motionOk && current && upcoming && current !== upcoming) {
      current.classList.remove("active");
      current.classList.add("review-card--exit");
      upcoming.classList.add("review-card--enter");
      requestAnimationFrame(() => {
        upcoming.classList.remove("review-card--enter");
        upcoming.classList.add("active");
      });
      setTimeout(() => current.classList.remove("review-card--exit"), 450);
    } else {
      reviews.forEach((r, i) => r.classList.toggle("active", i === next));
    }

    reviewIndex = next;
    dots.forEach((d, i) => d.classList.toggle("active", i === reviewIndex));
  }

  prevBtn?.addEventListener("click", () => showReview(reviewIndex - 1));
  nextBtn?.addEventListener("click", () => showReview(reviewIndex + 1));
  dots.forEach((dot, i) => dot.addEventListener("click", () => showReview(i)));

  // Auto-advance reviews
  let reviewTimer = setInterval(() => showReview(reviewIndex + 1), 6000);
  document.getElementById("reviewsCarousel")?.addEventListener("mouseenter", () => {
    clearInterval(reviewTimer);
  });
  document.getElementById("reviewsCarousel")?.addEventListener("mouseleave", () => {
    reviewTimer = setInterval(() => showReview(reviewIndex + 1), 6000);
  });

  // Mobile sticky CTA
  const mobileCta = document.getElementById("mobileCta");
  const hero = document.getElementById("hero");

  if (mobileCta && hero) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        mobileCta.classList.toggle("visible", !entry.isIntersecting);
        mobileCta.setAttribute("aria-hidden", entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "0px 0px -80px 0px" }
    );
    observer.observe(hero);
  }

  // Header + scroll progress
  const header = document.getElementById("header");
  const scrollProgress = document.getElementById("scrollProgress");

  function onScroll() {
    const y = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docH > 0 ? (y / docH) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = `${pct}%`;

    if (header) {
      header.classList.toggle("header--scrolled", y > 24);
      if (!motionOk) {
        header.style.boxShadow = y > 20 ? "var(--shadow-sm)" : "none";
      }
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  if (motionOk) {
    const revealConfig = [
      { sel: ".hero__content > *", parent: null, stagger: 90, hero: true },
      { sel: ".quote-card", variant: "scale", stagger: 0, hero: true },
      { sel: ".trust-item", stagger: 100 },
      { sel: ".section-header", stagger: 0 },
      { sel: ".mission__visual", variant: "left", stagger: 0 },
      { sel: ".mission__content", variant: "right", stagger: 0 },
      { sel: ".process-card", stagger: 120 },
      { sel: ".service-card", stagger: 70 },
      { sel: ".areas__list li", stagger: 40 },
      { sel: ".coupon-card", stagger: 150 },
      { sel: ".contact__info", variant: "left", stagger: 0 },
      { sel: ".contact-form", variant: "right", stagger: 0 },
      { sel: ".cta-band__inner", stagger: 0 },
    ];

    revealConfig.forEach(({ sel, variant, stagger, hero }) => {
      document.querySelectorAll(sel).forEach((el, i) => {
        el.classList.add("reveal");
        if (variant) el.classList.add(`reveal--${variant}`);
        el.style.setProperty("--reveal-delay", `${(stagger || 0) * i}ms`);

        if (hero) {
          requestAnimationFrame(() => {
            setTimeout(() => el.classList.add("is-visible"), 80 + (stagger || 0) * i);
          });
        }
      });
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      if (!el.closest(".hero__content") && !el.classList.contains("quote-card")) {
        revealObserver.observe(el);
      }
    });

    // 3D tilt on cards (mouse only)
    if (window.matchMedia("(hover: hover)").matches) {
    document
      .querySelectorAll(".service-card, .process-card, .coupon-card")
      .forEach((card) => {
        card.classList.add("tilt-card");
        card.addEventListener("mousemove", (e) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          card.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
        });
        card.addEventListener("mouseleave", () => {
          card.style.transform = "";
        });
      });
    }

    // Subtle hero parallax
    const heroSection = document.getElementById("hero");
    const heroVideo = document.querySelector(".hero__video");
    const heroContent = document.querySelector(".hero__content");
    const quoteCard = document.querySelector(".quote-card");

    if (heroSection) {
      window.addEventListener(
        "scroll",
        () => {
          const rect = heroSection.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > window.innerHeight) return;
          const progress = Math.min(1, Math.max(0, -rect.top / rect.height));
          if (heroVideo) {
            heroVideo.style.transform = `translateY(${progress * 40}px) scale(1.06)`;
          }
          if (heroContent) {
            heroContent.style.transform = `translateY(${progress * 18}px)`;
            heroContent.style.opacity = String(1 - progress * 0.35);
          }
          if (quoteCard) {
            quoteCard.style.transform = `translateY(${progress * -12}px)`;
          }
        },
        { passive: true }
      );
    }

    // Nav scroll spy
    const sections = ["about", "services", "areas", "reviews", "coupons", "contact"];
    const navLinks = document.querySelectorAll('.nav__link[href^="#"]');

    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navLinks.forEach((link) => {
            link.classList.toggle("nav__link--active", link.getAttribute("href") === `#${id}`);
          });
        });
      },
      { threshold: 0.35, rootMargin: "-20% 0px -55% 0px" }
    );

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (section) spyObserver.observe(section);
    });
  }

  // Hero background video (autoplay fallback)
  const heroVideoEl = document.querySelector(".hero__video");
  if (heroVideoEl) {
    const playVideo = () => {
      heroVideoEl.play().catch(() => {});
    };
    playVideo();
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) playVideo();
    });
  }
})();
