// ── Cyberpunk Aurora Loader ──
      (function () {
        const loader       = document.getElementById("loader");
        const nameEl       = document.getElementById("loaderName");
        const taglineEl    = document.getElementById("loaderTagline");
        const progressFill = document.getElementById("progressFill");
        const progressPct  = document.getElementById("progressPct");
        const canvas       = document.getElementById("loaderCanvas");
        const ctx          = canvas.getContext("2d");

        // Size canvas
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;

        // Floating particles
        const COLORS = ["#00d4ff", "#8b00ff", "#00ffcc", "#ff00cc"];
        const particles = Array.from({ length: 90 }, () => ({
          x:     Math.random() * canvas.width,
          y:     Math.random() * canvas.height,
          r:     Math.random() * 1.6 + 0.3,
          vx:    (Math.random() - 0.5) * 0.35,
          vy:    -(Math.random() * 0.45 + 0.1),
          alpha: Math.random() * 0.55 + 0.1,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        }));

        let rafId;
        function drawParticles() {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -5)               { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
            if (p.x < -5)               p.x = canvas.width + 5;
            if (p.x > canvas.width + 5) p.x = -5;
          });
          ctx.globalAlpha = 1;
          rafId = requestAnimationFrame(drawParticles);
        }
        drawParticles();

        // Typewriter helper
        function typeText(el, text, speed, cb) {
          let i = 0;
          el.textContent = "";
          const t = setInterval(() => {
            el.textContent += text[i++];
            if (i >= text.length) { clearInterval(t); if (cb) cb(); }
          }, speed);
        }

        // Animated progress counter
        let pct = 0;
        const pctInterval = setInterval(() => {
          pct = Math.min(pct + Math.floor(Math.random() * 5) + 1, 100);
          progressFill.style.width = pct + "%";
          progressPct.textContent  = pct + "%";
          if (pct >= 100) clearInterval(pctInterval);
        }, 38);

        // Sequence
        setTimeout(() => typeText(nameEl,    "ERFAN.HM", 85), 250);
        setTimeout(() => typeText(taglineEl, "PORTFOLIO  •  DEVELOPER  •  DESIGNER", 30), 1050);

        // Fade out loader
        setTimeout(() => {
          cancelAnimationFrame(rafId);
          loader.style.opacity = "0";
          setTimeout(() => { loader.style.display = "none"; }, 600);
        }, 3900);
      })();

      // Hamburger menu functionality
      const hamburger = document.getElementById("hamburger");
      const sidebarMenu = document.getElementById("sidebarMenu");
      const menuOverlay = document.getElementById("menuOverlay");

      hamburger.addEventListener("click", function () {
        this.classList.toggle("open");
        sidebarMenu.classList.toggle("open");
        menuOverlay.classList.toggle("active");

        // Toggle body overflow when menu is open
        if (sidebarMenu.classList.contains("open")) {
          document.body.style.overflow = "hidden";
        } else {
          document.body.style.overflow = "";
        }
      });

      // Close menu when clicking on overlay
      menuOverlay.addEventListener("click", function () {
        hamburger.classList.remove("open");
        sidebarMenu.classList.remove("open");
        this.classList.remove("active");
        document.body.style.overflow = "";
      });

      // Close menu when clicking on a link (for mobile)
      const menuLinks = document.querySelectorAll(".sidebar-menu a");
      menuLinks.forEach((link) => {
        link.addEventListener("click", function () {
          hamburger.classList.remove("open");
          sidebarMenu.classList.remove("open");
          menuOverlay.classList.remove("active");
          document.body.style.overflow = "";
        });
      });

      // Form submission
      document
        .getElementById("contactForm")
        .addEventListener("submit", function (e) {
          e.preventDefault();

          const name = document.getElementById("name").value;
          const email = document.getElementById("email").value;
          const subject = document.getElementById("subject").value;
          const message = document.getElementById("message").value;

          // In a real implementation, you would send this data to a server
          // For this example, we'll just log it and show an alert
          console.log({ name, email, subject, message });

          // Construct mailto link
          const mailtoLink = `mailto:erfanhamidi077@gmail.com?subject=${encodeURIComponent(
            subject
          )}&body=${encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
          )}`;

          // Open mail client
          window.location.href = mailtoLink;

          // Show success message
          alert(
            "Your message has been prepared in your email client. Please send it to complete the process."
          );

          // Reset form
          this.reset();
        });

      // Button hover effects
      const buttons = document.querySelectorAll(".btn-hover-effect");
      buttons.forEach((button) => {
        button.addEventListener("mouseenter", function () {
          this.style.transform = "scale(1.05)";
          this.style.boxShadow = "0 10px 20px rgba(0, 0, 0, 0.1)";
        });

        button.addEventListener("mouseleave", function () {
          this.style.transform = "scale(1)";
          this.style.boxShadow = "none";
        });
      });

      // Smooth scrolling for navigation links
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
          e.preventDefault();

          const targetId = this.getAttribute("href");
          const targetElement = document.querySelector(targetId);

          if (targetElement) {
            window.scrollTo({
              top: targetElement.offsetTop - 80,
              behavior: "smooth",
            });
          }
        });
      });