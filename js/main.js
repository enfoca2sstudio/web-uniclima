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

      // theme toggle (decorative sun/moon flip, ready to wire to a real theme later)
      const themeToggle = document.getElementById("themeToggle");
      const themeIcon = document.getElementById("themeIcon");
      const sunPath =
        '<circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>';
      const moonPath =
        '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/>';
      let isDark = false;
      themeToggle.addEventListener("click", () => {
        isDark = !isDark;
        themeIcon.innerHTML = isDark ? moonPath : sunPath;
        themeToggle.classList.remove("spin");
        void themeToggle.offsetWidth;
        themeToggle.classList.add("spin");
        document.documentElement.classList.toggle("theme-dark", isDark);
      });

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
