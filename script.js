// Hide loader after 2 seconds
      setTimeout(() => {
        document.getElementById("loader").style.opacity = "0";
        setTimeout(() => {
          document.getElementById("loader").style.display = "none";
        }, 500);
      }, 2000);

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