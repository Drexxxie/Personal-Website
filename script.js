// Dark mode toggle
const themeToggle = document.getElementById("theme-toggle");
const mobileThemeToggle = document.getElementById("mobile-theme-toggle");
const html = document.documentElement;

// Check for saved theme preference or use system preference
if (
  localStorage.getItem("theme") === "dark" ||
  (!localStorage.getItem("theme") &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  html.classList.add("dark");
}

// Theme toggle handlers
function toggleTheme() {
  html.classList.toggle("dark");
  localStorage.setItem(
    "theme",
    html.classList.contains("dark") ? "dark" : "light"
  );
  updateThemeIcons();
}

function updateThemeIcons() {
  // Desktop
  if (themeToggle) {
    const moonIcon = themeToggle.querySelector(".fa-moon");
    const sunIcon = themeToggle.querySelector(".fa-sun");
    if (html.classList.contains("dark")) {
      moonIcon.classList.add("hidden");
      sunIcon.classList.remove("hidden");
    } else {
      moonIcon.classList.remove("hidden");
      sunIcon.classList.add("hidden");
    }
  }
  // Mobile
  if (mobileThemeToggle) {
    const moonIconMobile = mobileThemeToggle.querySelector(".fa-moon");
    const sunIconMobile = mobileThemeToggle.querySelector(".fa-sun");
    if (html.classList.contains("dark")) {
      moonIconMobile.classList.add("hidden");
      sunIconMobile.classList.remove("hidden");
    } else {
      moonIconMobile.classList.remove("hidden");
      sunIconMobile.classList.add("hidden");
    }
  }
}

// Call once on load to set correct icon
updateThemeIcons();

if (themeToggle) {
  themeToggle.addEventListener("click", toggleTheme);
}

if (mobileThemeToggle) {
  mobileThemeToggle.addEventListener("click", toggleTheme);
}

// Mobile menu toggle
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });

    // Close mobile menu only if it is visible
    if (mobileMenu && !mobileMenu.classList.contains("hidden")) {
      mobileMenu.classList.add("hidden");
    }
  });
});
const form = document.querySelector("form");
const popup = document.getElementById("popup-message");
const closePopup = document.getElementById("close-popup");

if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });
      if (response.ok) {
        popup.classList.remove("hidden");
        form.reset();
      } else {
        alert(
          "There was an error sending your message. Please try again."
        );
      }
    } catch (error) {
      alert("There was an error sending your message. Please try again.");
    }
  });
}

if (closePopup) {
  closePopup.addEventListener("click", () => {
    popup.classList.add("hidden");
  });
}
// Set current year in footer
const currentYear = document.getElementById("current-year")
if(currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Resume page dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}