const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const filterButtons = document.querySelectorAll("[data-filter]");
const projectCards = document.querySelectorAll("[data-category]");
const contactForm = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");
const year = document.querySelector("[data-year]");
const staggerGroups = document.querySelectorAll(
  ".service-grid, .stack-cloud, .project-grid, .timeline, .credential-list, .contact-layout"
);

document.querySelectorAll(".reveal:not(.hero-content)").forEach((section) => {
  section.classList.add("animate-on-scroll");
});

staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((item, index) => {
    item.classList.add("animate-on-scroll");
    item.dataset.scrollDelay = String(Math.min(index * 0.07, 0.28));
  });
});

const scrollItems = document.querySelectorAll(".animate-on-scroll");

const heroTitle = document.querySelector(".hero-title");
const heroSubtitle = document.querySelector(".hero-subtitle");
const heroCta = document.querySelector(".hero-cta");
const heroElements = [heroTitle, heroSubtitle, heroCta].filter(Boolean);
const showHeroElements = () => {
  heroElements.forEach((element) => {
    element.style.visibility = "visible";
  });
};

const heroAnimationFallback = window.setTimeout(showHeroElements, 1200);

if (window.gsap && window.SplitText && heroTitle) {
  gsap.registerPlugin(SplitText);

  const splitTitle = SplitText.create(heroTitle, {
    type: "words",
    mask: "words",
    wordsClass: "hero-title-word",
  });

  window.clearTimeout(heroAnimationFallback);
  gsap.set(heroElements, { visibility: "visible" });

  const heroTimeline = gsap.timeline({ defaults: { ease: "power4.out" } });
  heroTimeline
    .from(splitTitle.words, {
      autoAlpha: 0,
      duration: 1.2,
      stagger: 0.06,
      yPercent: 115,
    })
    .from(heroSubtitle, { autoAlpha: 0, duration: 0.7, y: 20 }, ">0.08")
    .from(heroCta.children, { autoAlpha: 0, duration: 0.65, stagger: 0.08, y: 16 }, "-=0.42");
}

if (window.gsap && window.ScrollTrigger && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.registerPlugin(ScrollTrigger);

  scrollItems.forEach((item) => {
    gsap.fromTo(
      item,
      { autoAlpha: 0, y: 40 },
      {
        autoAlpha: 1,
        delay: Number(item.dataset.scrollDelay || 0),
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          once: true,
        },
        y: 0,
      }
    );
  });
} else if (window.gsap) {
  gsap.set(scrollItems, { autoAlpha: 1, y: 0 });
}

const magneticTargets = document.querySelectorAll(".magnetic-target");
const enableMagneticMotion =
  window.gsap &&
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (enableMagneticMotion) {
  magneticTargets.forEach((target) => {
    target.addEventListener("mousemove", (event) => {
      const bounds = target.getBoundingClientRect();
      const deltaX = event.clientX - (bounds.left + bounds.width / 2);
      const deltaY = event.clientY - (bounds.top + bounds.height / 2);
      const distance = Math.hypot(deltaX, deltaY);

      if (distance <= 50) {
        gsap.to(target, {
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
          x: Math.max(-15, Math.min(15, deltaX * 0.3)),
          y: Math.max(-15, Math.min(15, deltaY * 0.3)),
        });
      }
    });

    target.addEventListener("mouseleave", () => {
      gsap.to(target, {
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
        overwrite: "auto",
        x: 0,
        y: 0,
      });
    });
  });
}

const updateHeader = () => {
  if (header) {
    header.classList.toggle("scrolled", window.scrollY > 12);
  }
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if (year) {
  year.textContent = new Date().getFullYear();
}

const closeNavigation = () => {
  if (!nav || !navToggle || !header) return;

  nav.classList.remove("open");
  document.body.classList.remove("nav-open");
  header.classList.remove("nav-active");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open navigation");
};

if (navToggle && nav && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    document.body.classList.toggle("nav-open", isOpen);
    header.classList.toggle("nav-active", isOpen);
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
}

if (nav) {
  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      closeNavigation();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

const desktopNav = window.matchMedia("(min-width: 941px)");
desktopNav.addEventListener("change", (event) => {
  if (event.matches) {
    closeNavigation();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.toggle("active", item === button));
    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      const shouldShow = filter === "all" || categories.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();

    formStatus.textContent = `Thanks${name ? `, ${name}` : ""}. Your message has been noted.`;
    contactForm.reset();
  });
}
