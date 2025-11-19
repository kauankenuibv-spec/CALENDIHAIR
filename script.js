// Sticky Header com sombra ao rolar
const header = document.getElementById("header");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }

  lastScroll = currentScroll;
});

// Smooth scroll para anchor links
function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    const headerHeight = header.offsetHeight;
    const sectionPosition = section.offsetTop - headerHeight - 20;

    window.scrollTo({
      top: sectionPosition,
      behavior: "smooth",
    });
  }
}

// Adicionar smooth scroll aos links do nav
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const targetId = this.getAttribute("href").substring(1);
    scrollToSection(targetId);
  });
});

// Intersection Observer para animações de scroll reveal
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observar elementos que devem animar
const animateElements = document.querySelectorAll(
  ".problem-card, .feature-card, .device-card, .pricing-card, .faq-item"
);

animateElements.forEach((el) => observer.observe(el));

// Parallax sutil no hero
const heroImage = document.querySelector(".mockup-img");

if (heroImage) {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const parallaxSpeed = 0.3;

    if (scrolled < window.innerHeight) {
      heroImage.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
    }
  });
}

// Carousel de depoimentos (resiliente a ausência de elementos)
const testimonialCards = document.querySelectorAll(".testimonial-card");
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");
const dotsContainer = document.querySelector(".carousel-dots");

let currentTestimonial = 0;
let autoplayInterval;
let dots = [];

if (testimonialCards.length > 0) {
  // Criar dots somente se container existir
  if (dotsContainer) {
    testimonialCards.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.classList.add("carousel-dot");
      dot.setAttribute("aria-label", `Ir para depoimento ${index + 1}`);
      if (index === 0) dot.classList.add("active");

      dot.addEventListener("click", () => {
        goToTestimonial(index);
        resetAutoplay();
      });

      dotsContainer.appendChild(dot);
    });

    dots = document.querySelectorAll(".carousel-dot");
  }

  function showTestimonial(index) {
    testimonialCards.forEach((card) => card.classList.remove("active"));
    if (dots.length) dots.forEach((dot) => dot.classList.remove("active"));

    // Safety: clamp index
    const safeIndex =
      ((index % testimonialCards.length) + testimonialCards.length) %
      testimonialCards.length;
    testimonialCards[safeIndex].classList.add("active");
    if (dots.length) dots[safeIndex].classList.add("active");
    currentTestimonial = safeIndex;
  }

  function goToTestimonial(index) {
    showTestimonial(index);
  }

  function nextTestimonial() {
    const next = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(next);
  }

  function prevTestimonial() {
    const prev =
      (currentTestimonial - 1 + testimonialCards.length) %
      testimonialCards.length;
    showTestimonial(prev);
  }

  function startAutoplay() {
    clearInterval(autoplayInterval);
    autoplayInterval = setInterval(nextTestimonial, 5000);
  }

  function resetAutoplay() {
    clearInterval(autoplayInterval);
    startAutoplay();
  }

  if (prevBtn)
    prevBtn.addEventListener("click", () => {
      prevTestimonial();
      resetAutoplay();
    });

  if (nextBtn)
    nextBtn.addEventListener("click", () => {
      nextTestimonial();
      resetAutoplay();
    });

  // Iniciar autoplay
  startAutoplay();

  // Pausar autoplay quando hover
  const carousel = document.querySelector(".testimonial-carousel");
  if (carousel) {
    carousel.addEventListener("mouseenter", () =>
      clearInterval(autoplayInterval)
    );
    carousel.addEventListener("mouseleave", startAutoplay);
  }
}

// Toggle de planos (Mensal/Anual) - Versão com transição de cards
const pricingToggle = document.getElementById("pricingToggle");
const monthlyCard = document.getElementById("monthlyCard");
const annualCard = document.getElementById("annualCard");

let isAnnual = false;

if (pricingToggle && monthlyCard && annualCard) {
  pricingToggle.addEventListener("click", () => {
    isAnnual = !isAnnual;
    pricingToggle.classList.toggle("active");

    if (isAnnual) {
      // Mostrar plano anual
      monthlyCard.classList.remove("active");
      setTimeout(() => {
        monthlyCard.style.display = "none";
        annualCard.style.display = "block";
        setTimeout(() => {
          annualCard.classList.add("active");
        }, 50);
      }, 300);
    } else {
      // Mostrar plano mensal
      annualCard.classList.remove("active");
      setTimeout(() => {
        annualCard.style.display = "none";
        monthlyCard.style.display = "block";
        setTimeout(() => {
          monthlyCard.classList.add("active");
        }, 50);
      }, 300);
    }
  });
}

// Accordion FAQ
const faqQuestions = document.querySelectorAll(".faq-question");

faqQuestions.forEach((question) => {
  question.addEventListener("click", () => {
    const faqItem = question.parentElement;
    const answer = faqItem.querySelector(".faq-answer");
    const isOpen = question.getAttribute("aria-expanded") === "true";

    // Fechar todos os outros FAQs
    faqQuestions.forEach((q) => {
      if (q !== question) {
        q.setAttribute("aria-expanded", "false");
        const otherAnswer = q.parentElement.querySelector(".faq-answer");
        otherAnswer.style.maxHeight = null;
      }
    });

    // Toggle do FAQ atual
    if (isOpen) {
      question.setAttribute("aria-expanded", "false");
      answer.style.maxHeight = null;
    } else {
      question.setAttribute("aria-expanded", "true");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });

  // Acessibilidade - abrir/fechar com Enter/Space
  question.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      question.click();
    }
  });
});

// Modal de cadastro/checkout
const modal = document.getElementById("modal");
const signupForm = document.getElementById("signupForm");

function openModal(plan = "") {
  modal.classList.add("active");
  document.body.style.overflow = "hidden";

  // Focar no primeiro input
  setTimeout(() => {
    const firstInput = modal.querySelector("input");
    if (firstInput) firstInput.focus();
  }, 100);

  // Armazenar plano selecionado (para uso futuro)
  if (plan) {
    modal.dataset.selectedPlan = plan;
  }
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Fechar modal com ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// Validação e envio do formulário
if (signupForm) {
  // Máscara de telefone
  const phoneInput = document.getElementById("phone");

  phoneInput.addEventListener("input", (e) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length <= 11) {
      value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
      value = value.replace(/(\d{5})(\d)/, "$1-$2");
    }

    e.target.value = value;
  });

  // Validação ao enviar
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      phone: document.getElementById("phone").value,
      salon: document.getElementById("salon").value,
      plan: modal.dataset.selectedPlan || "trial",
    };

    // Validações básicas
    if (!formData.name.trim()) {
      alert("Por favor, preencha seu nome completo.");
      return;
    }

    if (!validateEmail(formData.email)) {
      alert("Por favor, insira um email válido.");
      return;
    }

    if (formData.phone.replace(/\D/g, "").length < 10) {
      alert("Por favor, insira um telefone válido.");
      return;
    }

    if (!formData.salon.trim()) {
      alert("Por favor, preencha o nome do salão.");
      return;
    }

    // Simulação de envio (substituir por integração real)
    console.log("Dados do formulário:", formData);

    // Feedback de sucesso
    showSuccessMessage();

    // Resetar formulário
    signupForm.reset();

    // Fechar modal após 2 segundos
    setTimeout(() => {
      closeModal();
    }, 2000);
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showSuccessMessage() {
  const modalContent = document.querySelector(".modal-content");
  const originalContent = modalContent.innerHTML;

  modalContent.innerHTML = `
    <div style="text-align: center; padding: 40px 20px;">
      <svg width="80" height="80" viewBox="0 0 80 80" style="color: #00C853; margin-bottom: 24px;">
        <circle cx="40" cy="40" r="38" stroke="currentColor" stroke-width="4" fill="none"/>
        <path d="M25 40l12 12 18-24" stroke="currentColor" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <h2 style="margin-bottom: 16px;">Cadastro realizado!</h2>
      <p style="color: #6B7280;">Enviamos um email com as instruções de acesso. Verifique sua caixa de entrada.</p>
    </div>
  `;

  // Restaurar conteúdo original após fechar
  setTimeout(() => {
    modalContent.innerHTML = originalContent;
    attachFormListeners();
  }, 3000);
}

function attachFormListeners() {
  // Reattach form listeners após restaurar conteúdo
  const newSignupForm = document.getElementById("signupForm");
  if (newSignupForm) {
    const phoneInput = document.getElementById("phone");

    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.length <= 11) {
        value = value.replace(/^(\d{2})(\d)/g, "($1) $2");
        value = value.replace(/(\d{5})(\d)/, "$1-$2");
      }
      e.target.value = value;
    });
  }
}

// Mobile menu toggle
const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
const nav = document.querySelector(".nav");

if (mobileMenuToggle) {
  mobileMenuToggle.addEventListener("click", () => {
    nav.classList.toggle("active");
    mobileMenuToggle.classList.toggle("active");

    // Animação do ícone hamburger
    const spans = mobileMenuToggle.querySelectorAll("span");
    if (mobileMenuToggle.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translate(5px, 5px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translate(7px, -6px)";
    } else {
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    }
  });

  // Fechar menu ao clicar em um link
  const navLinks = nav.querySelectorAll("a");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("active");
      mobileMenuToggle.classList.remove("active");

      const spans = mobileMenuToggle.querySelectorAll("span");
      spans[0].style.transform = "";
      spans[1].style.opacity = "";
      spans[2].style.transform = "";
    });
  });
}

// Lazy loading de imagens (fallback para navegadores sem suporte nativo)
if ("loading" in HTMLImageElement.prototype) {
  // Navegador suporta lazy loading nativo
  console.log("Lazy loading nativo suportado");
} else {
  // Implementar lazy loading manual
  const images = document.querySelectorAll('img[loading="lazy"]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add("loaded");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Prevenção de scroll quando modal aberto
modal.addEventListener("click", (e) => {
  if (e.target === modal || e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
});

// Adicionar microfeedback aos botões (ripple effect)
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// CSS para ripple effect (adicionar dinamicamente)
const style = document.createElement("style");
style.textContent = `
  .btn { position: relative; overflow: hidden; }
  .ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    transform: scale(0);
    animation: ripple-animation 0.6s ease-out;
    pointer-events: none;
  }
  @keyframes ripple-animation {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  .nav.active {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    padding: 20px;
    box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    gap: 16px;
  }
`;
document.head.appendChild(style);

// Analytics de interação (opcional - substituir por Google Analytics real)
function trackEvent(category, action, label) {
  console.log("Event tracked:", { category, action, label });

  // Integração com GA4 quando disponível
  if (typeof gtag !== "undefined") {
    gtag("event", action, {
      event_category: category,
      event_label: label,
    });
  }
}

// Track clicks nos CTAs
document.querySelectorAll(".btn-primary").forEach((btn) => {
  btn.addEventListener("click", () => {
    trackEvent("CTA", "click", btn.textContent.trim());
  });
});

// Performance: adicionar will-change para elementos animados
const performanceElements = document.querySelectorAll(
  ".mockup-img, .testimonial-card, .pricing-card"
);

performanceElements.forEach((el) => {
  el.style.willChange = "transform, opacity";
});

console.log("🚀 Calendi Hair - Sistema carregado com sucesso!");
