      // header scroll state
      const header = document.getElementById("siteHeader");
      window.addEventListener(
        "scroll",
        () => {
          header.classList.toggle("scrolled", window.scrollY > 30);
        },
        { passive: true },
      );

      // dropdown toggles (mobile tap-to-expand, desktop uses hover via CSS)
      document.querySelectorAll(".dd-toggle").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          const parent = btn.closest(".has-dropdown");
          const wasOpen = parent.classList.contains("open");
          document
            .querySelectorAll(".has-dropdown.open")
            .forEach((el) => el.classList.remove("open"));
          if (!wasOpen) parent.classList.add("open");
        });
      });

      // ---------------- hero carousel ----------------
      (function initHeroCarousel() {
        const heroSection = document.querySelector(".hero");
        const slides = document.querySelectorAll(".hero-slide");
        const dots = document.querySelectorAll(".hero-dot");
        const prevBtn = document.getElementById("heroPrev");
        const nextBtn = document.getElementById("heroNext");
        if (!heroSection || slides.length === 0) return;

        const AUTOPLAY_MS = 7000;
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        let current = Math.max(
          0,
          [...slides].findIndex((s) => s.classList.contains("is-active")),
        );
        let timer = null;

        const goTo = (index) => {
          const next = (index + slides.length) % slides.length;
          if (next === current) return;
          slides[current].classList.remove("is-active");
          slides[current].setAttribute("aria-hidden", "true");
          dots[current]?.classList.remove("is-active");
          dots[current]?.setAttribute("aria-selected", "false");

          current = next;
          slides[current].classList.add("is-active");
          slides[current].setAttribute("aria-hidden", "false");
          dots[current]?.classList.add("is-active");
          dots[current]?.setAttribute("aria-selected", "true");
        };

        const start = () => {
          if (reducedMotion) return; // respect user preference: no autoplay
          stop();
          timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
        };
        const stop = () => {
          if (timer) clearInterval(timer);
          timer = null;
        };

        // user-triggered navigation also resets the autoplay clock
        const userGo = (index) => {
          goTo(index);
          start();
        };

        dots.forEach((dot, i) => {
          dot.addEventListener("click", () => userGo(i));
        });
        nextBtn?.addEventListener("click", () => userGo(current + 1));
        prevBtn?.addEventListener("click", () => userGo(current - 1));

        // pause on hover / keyboard focus, resume on leave / blur
        heroSection.addEventListener("mouseenter", stop);
        heroSection.addEventListener("mouseleave", start);
        heroSection.addEventListener("focusin", stop);
        heroSection.addEventListener("focusout", start);

        // pause when the tab isn't visible
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) stop();
          else start();
        });

        // swipe support on touch devices
        let touchStartX = null;
        heroSection.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.touches[0].clientX;
          },
          { passive: true },
        );
        heroSection.addEventListener(
          "touchend",
          (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(dx) < 40) return;
            userGo(current + (dx < 0 ? 1 : -1));
          },
          { passive: true },
        );

        start();
      })();

      // ---------------- somos carousel (2 diapositivas, mismo formato que el hero) ----------------
      (function initSomosCarousel() {
        const wrap = document.querySelector(".somos-right");
        const slides = document.querySelectorAll(".somos-slide");
        const dots = document.querySelectorAll(".somos-carousel-dot");
        const prevBtn = document.getElementById("somosPrev");
        const nextBtn = document.getElementById("somosNext");
        if (!wrap || slides.length === 0) return;

        const AUTOPLAY_MS = 7000;
        const reducedMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;

        let current = Math.max(
          0,
          [...slides].findIndex((s) => s.classList.contains("is-active")),
        );
        let timer = null;

        const goTo = (index) => {
          const next = (index + slides.length) % slides.length;
          if (next === current) return;
          slides[current].classList.remove("is-active");
          slides[current].setAttribute("aria-hidden", "true");
          dots[current]?.classList.remove("is-active");
          dots[current]?.setAttribute("aria-selected", "false");

          current = next;
          slides[current].classList.add("is-active");
          slides[current].setAttribute("aria-hidden", "false");
          dots[current]?.classList.add("is-active");
          dots[current]?.setAttribute("aria-selected", "true");
        };

        const start = () => {
          if (reducedMotion) return; // respect user preference: no autoplay
          stop();
          timer = setInterval(() => goTo(current + 1), AUTOPLAY_MS);
        };
        const stop = () => {
          if (timer) clearInterval(timer);
          timer = null;
        };

        // user-triggered navigation also resets the autoplay clock
        const userGo = (index) => {
          goTo(index);
          start();
        };

        dots.forEach((dot, i) => {
          dot.addEventListener("click", () => userGo(i));
        });
        nextBtn?.addEventListener("click", () => userGo(current + 1));
        prevBtn?.addEventListener("click", () => userGo(current - 1));

        // pause on hover / keyboard focus, resume on leave / blur
        wrap.addEventListener("mouseenter", stop);
        wrap.addEventListener("mouseleave", start);
        wrap.addEventListener("focusin", stop);
        wrap.addEventListener("focusout", start);

        // pause when the tab isn't visible
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) stop();
          else start();
        });

        // swipe support on touch devices
        let touchStartX = null;
        wrap.addEventListener(
          "touchstart",
          (e) => {
            touchStartX = e.touches[0].clientX;
          },
          { passive: true },
        );
        wrap.addEventListener(
          "touchend",
          (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            if (Math.abs(dx) < 40) return;
            userGo(current + (dx < 0 ? 1 : -1));
          },
          { passive: true },
        );

        start();
      })();

      // theme toggle (light/dark, persisted in localStorage, respects OS preference)
      const THEME_KEY = "uniclima-theme"; // stored value: "light" | "dark"
      const themeToggle = document.getElementById("themeToggle");
      const themeIcon = document.getElementById("themeIcon");
      const sunPath =
        '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
      const moonPath =
        '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>';

      const getStoredTheme = () => {
        try {
          return localStorage.getItem(THEME_KEY);
        } catch (err) {
          // localStorage can throw in private-browsing / restricted contexts;
          // fall back to no stored preference.
          return null;
        }
      };
      const storeTheme = (value) => {
        try {
          localStorage.setItem(THEME_KEY, value);
        } catch (err) {
          /* ignore write failures, theme just won't persist */
        }
      };

      const applyTheme = (isDark, { animate = false } = {}) => {
        document.documentElement.classList.toggle("theme-dark", isDark);
        themeIcon.innerHTML = isDark ? moonPath : sunPath;
        themeToggle.setAttribute(
          "aria-label",
          isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro",
        );
        themeToggle.setAttribute("aria-pressed", String(isDark));
        if (animate) {
          themeToggle.classList.remove("spin");
          void themeToggle.offsetWidth;
          themeToggle.classList.add("spin");
        }
      };

      // Initial theme: stored preference wins; otherwise fall back to the
      // OS-level color-scheme preference. (Note: index.html also sets the
      // "theme-dark" class on <html> as early as possible via an inline
      // script in <head>, so this just syncs the icon/labels on load and
      // avoids a flash of the wrong theme.)
      const prefersDark =
        window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      const storedTheme = getStoredTheme();
      let isDark = storedTheme ? storedTheme === "dark" : prefersDark;
      applyTheme(isDark);

      themeToggle.addEventListener("click", () => {
        isDark = !isDark;
        applyTheme(isDark, { animate: true });
        storeTheme(isDark ? "dark" : "light");
      });

      // Follow the OS theme live, but only while the user hasn't picked a
      // theme of their own on this site.
      if (window.matchMedia) {
        window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (e) => {
            if (getStoredTheme()) return; // user has an explicit preference
            isDark = e.matches;
            applyTheme(isDark);
          });
      }

      // mobile menu
      const toggle = document.getElementById("menuToggle");
      const links = document.getElementById("navLinks");
      toggle.addEventListener("click", () => links.classList.toggle("open"));
      links
        .querySelectorAll("a")
        .forEach((a) =>
          a.addEventListener("click", () => links.classList.remove("open")),
        );

      // scroll reveal
      const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");
      const revealNow = (el) => el.classList.add("in-view");

      if ("IntersectionObserver" in window) {
        const io = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                revealNow(entry.target);
                io.unobserve(entry.target);
              }
            });
          },
          // Small threshold + generous bottom margin: elements reveal as soon as
          // they start entering the viewport instead of waiting for 18% of them
          // to be visible. This avoids "stuck invisible" content in automated
          // full-page screenshots, slow devices, or fast scrolling.
          { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
        );
        revealEls.forEach((el) => io.observe(el));
      } else {
        // No IntersectionObserver support: show everything immediately.
        revealEls.forEach(revealNow);
      }

      // Safety net: whatever hasn't revealed itself shortly after the page is
      // fully loaded (e.g. a screenshot tool that captures before scrolling,
      // or a very slow layout/font load) gets force-revealed so nothing is
      // ever left permanently invisible.
      const forceRevealRemaining = () => {
        revealEls.forEach((el) => {
          if (!el.classList.contains("in-view")) revealNow(el);
        });
      };
      window.addEventListener("load", () => setTimeout(forceRevealRemaining, 800));
      // Extra fallback in case 'load' fires very late (slow images/fonts).
      setTimeout(forceRevealRemaining, 2500);

      // count-up stats
      const counters = document.querySelectorAll("[data-count]");
      const animateCount = (el) => {
        const target = parseInt(el.getAttribute("data-count"), 10);
        const duration = 1400;
        const start = performance.now();
        const step = (now) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target);
          if (progress < 1) requestAnimationFrame(step);
          else el.textContent = target;
        };
        requestAnimationFrame(step);
      };
      const countIO = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              countIO.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      counters.forEach((c) => countIO.observe(c));
