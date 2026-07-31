// index.js
(function () {
  const navLinks = document.querySelectorAll(".nav-links a:not(.home-link)");
  const hiddenHomeLink = document.querySelector(".nav-links .home-link");
  const pages = document.querySelectorAll(".page");
  const navOverlay = document.getElementById("navOverlay");
  const menuToggle = document.getElementById("menuToggle");
  const closeMenuBtn = document.getElementById("closeMenuBtn");
  const navUl = document.getElementById("navLinks");

  function showPage(pageId) {
    pages.forEach((p) => p.classList.remove("active"));
    const target = document.getElementById(pageId);
    if (target) target.classList.add("active");
    else document.getElementById("home").classList.add("active");
    if (pageId && pageId !== "home") history.pushState(null, "", "#" + pageId);
    else history.pushState(null, "", "#");
    window.scrollTo({ top: 0, behavior: "smooth" });
    closeMobileMenu();
  }

  function openMobileMenu() {
    navUl.classList.add("open");
    navOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeMobileMenu() {
    navUl.classList.remove("open");
    navOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  function toggleMobileMenu() {
    if (navUl.classList.contains("open")) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleMobileMenu();
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener("click", closeMobileMenu);
  }

  if (navOverlay) {
    navOverlay.addEventListener("click", closeMobileMenu);
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        closeMobileMenu();
      }
    });
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const pageId = this.getAttribute("data-page");
      if (pageId) {
        e.preventDefault();
        showPage(pageId);
      }
    });
  });

  if (hiddenHomeLink) {
    hiddenHomeLink.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("home");
    });
  }

  window.addEventListener("hashchange", function () {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) showPage(hash);
    else showPage("home");
  });

  window.addEventListener("load", function () {
    const hash = window.location.hash.replace("#", "");
    if (hash && document.getElementById(hash)) showPage(hash);
    else {
      showPage("home");
      if (window.location.hash) history.pushState(null, "", "#");
    }
    if (memberData) {
      showProfileNav();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  const logoLink = document.getElementById("logoLink");
  if (logoLink) {
    logoLink.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("home");
    });
  }

  const startBtn = document.getElementById("startProgramBtn");
  if (startBtn) {
    startBtn.addEventListener("click", function (e) {
      e.preventDefault();
      showPage("membership");
    });
  }

  // ----- ENVIRONMENT SLIDER -----
  const slider = document.getElementById("envSlider");
  const prevBtn = document.getElementById("prevEnv");
  const nextBtn = document.getElementById("nextEnv");
  const dotsContainer = document.getElementById("envDots");
  let currentIndex = 0;
  let autoScrollInterval = null;

  function getCardWidth() {
    const card = slider?.querySelector(".env-card");
    if (card) {
      const gap = 24;
      return card.offsetWidth + gap;
    }
    return 280;
  }

  function getMaxIndex() {
    if (!slider) return 0;
    const totalCards = slider.querySelectorAll(".env-card").length;
    const containerWidth = slider.parentElement.offsetWidth - 40;
    const cardW = getCardWidth();
    const visible = Math.floor(containerWidth / cardW);
    return Math.max(0, totalCards - visible);
  }

  function updateDots() {
    if (!dotsContainer) return;
    const maxIndex = getMaxIndex();
    dotsContainer.innerHTML = "";
    for (let i = 0; i <= maxIndex; i++) {
      const dot = document.createElement("button");
      dot.className = "dot" + (i === currentIndex ? " active" : "");
      dot.dataset.index = i;
      dot.addEventListener("click", function () {
        currentIndex = parseInt(this.dataset.index);
        scrollToIndex();
        updateDots();
        resetAutoScroll();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function scrollToIndex() {
    if (!slider) return;
    const width = getCardWidth();
    slider.scrollTo({ left: currentIndex * width, behavior: "smooth" });
  }

  function updateSlider() {
    const maxIndex = getMaxIndex();
    if (currentIndex > maxIndex) currentIndex = maxIndex;
    if (currentIndex < 0) currentIndex = 0;
    scrollToIndex();
    updateDots();
  }

  function autoScroll() {
    const maxIndex = getMaxIndex();
    if (maxIndex <= 0) return;
    currentIndex++;
    if (currentIndex > maxIndex) {
      currentIndex = 0;
    }
    scrollToIndex();
    updateDots();
  }

  function startAutoScroll() {
    if (autoScrollInterval) clearInterval(autoScrollInterval);
    autoScrollInterval = setInterval(autoScroll, 3500);
  }

  function resetAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      startAutoScroll();
    }
  }

  if (slider && prevBtn && nextBtn) {
    setTimeout(() => {
      updateSlider();
      startAutoScroll();
    }, 500);

    slider.addEventListener("mouseenter", function () {
      if (autoScrollInterval) {
        clearInterval(autoScrollInterval);
        autoScrollInterval = null;
      }
    });

    slider.addEventListener("mouseleave", function () {
      if (!autoScrollInterval) {
        startAutoScroll();
      }
    });

    prevBtn.addEventListener("click", function () {
      if (currentIndex > 0) {
        currentIndex--;
        updateSlider();
        resetAutoScroll();
      }
    });

    nextBtn.addEventListener("click", function () {
      const maxIndex = getMaxIndex();
      if (currentIndex < maxIndex) {
        currentIndex++;
        updateSlider();
        resetAutoScroll();
      }
    });

    window.addEventListener("resize", function () {
      updateSlider();
    });

    slider.addEventListener("scroll", function () {
      const width = getCardWidth();
      const newIndex = Math.round(slider.scrollLeft / width);
      if (newIndex !== currentIndex && newIndex >= 0) {
        currentIndex = newIndex;
        updateDots();
      }
    });
  }

  // ----- TRAINER DATA -----
  const trainerData = {
    min: {
      name: "Trainer Ko Ko Htet Aung",
      title: "⚡ Strength & Conditioning",
      bio: "Trainer Ko Ko Htet Aung is a certified strength and conditioning specialist with over 10 years of experience. He has worked with collegiate athletes and recreational lifters alike, focusing on building raw power and injury prevention.",
      img: "images/Screenshot 2026-07-31 102211.png",
    },
    thiri: {
      name: "Trainer Sit Aung",
      title: "🥗 Nutrition & Mobility",
      bio: "Trainer Sit Aung is a nutrition coach and mobility expert. She helps members recover smarter, improve joint health, and fuel their bodies for peak performance — both in and out of the gym.",
      img: "images/Screenshot 2026-07-31 102219.png",
    },
    zaw: {
      name: "Trainer Chit Lin Phyu",
      title: "🏋️ Olympic & Powerlifting",
      bio: "Trainer Chit Lin Phyu is a former national-level competitor in Olympic weightlifting and powerlifting. He specializes in explosive strength, technique refinement, and competition preparation for athletes.",
      img: "images/Screenshot 2026-07-31 102235.png",
    },
    zumba: {
      name: "Coach Zumba",
      title: "💃 Zumba & Dance Fitness",
      bio: "Coach Zumba brings high-energy dance workouts to YFC. With a background in Latin dance and fitness instruction, she makes every session fun, rhythmic, and incredibly effective for burning calories and boosting mood.",
      img: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=200&h=200&fit=crop&crop=face",
    },
    hnin: {
      name: "Trainer Khant",
      title: "🧘 Fitness & Mindfulness",
      bio: "Trainer Khant is a certified yoga instructor with over 8 years of teaching experience. He specializes in Hatha and Vinyasa yoga, helping members improve flexibility, reduce stress, and find inner balance. His classes are suitable for all levels.",
      img: "images/Screenshot 2026-07-31 102241.png",
    },
  };

  const trainerCards = document.querySelectorAll(".trainer-card[data-trainer]");
  const modal = document.getElementById("trainerModal");
  const modalClose = document.getElementById("modalClose");
  const modalAvatar = document.getElementById("modalAvatar");
  const modalName = document.getElementById("modalName");
  const modalTitle = document.getElementById("modalTitle");
  const modalBio = document.getElementById("modalBio");

  function openTrainerModal(key) {
    const data = trainerData[key];
    if (!data) return;
    modalAvatar.innerHTML = `<img src="${data.img}" alt="${data.name}">`;
    modalName.textContent = data.name;
    modalTitle.textContent = data.title;
    modalBio.textContent = data.bio;
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    document
      .querySelectorAll(".modal-overlay")
      .forEach((m) => m.classList.remove("active"));
    document.body.style.overflow = "";
  }

  trainerCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      const key = this.getAttribute("data-trainer");
      if (key) openTrainerModal(key);
    });
  });

  modalClose.addEventListener("click", closeModal);
  modal.addEventListener("click", function (e) {
    if (e.target === modal) closeModal();
  });

  // ----- EQUIPMENT -----
  const equipData = {
    weights: {
      title: "🏋️ Free Weights Collection",
      items: [
        { name: "Dumbbells 5-120 lbs", icon: "fa-dumbbell" },
        { name: "Barbells (Olympic & Standard)", icon: "fa-weight-hanging" },
        { name: "Kettlebells 8-48 kg", icon: "fa-circle" },
        { name: "Adjustable Benches", icon: "fa-chair" },
        { name: "Squat Racks & Power Cages", icon: "fa-chess-queen" },
        { name: "Weight Plates & Collars", icon: "fa-circle-notch" },
      ],
    },
    cardio: {
      title: "❤️ Cardio Zone Equipment",
      items: [
        { name: "Woodway Treadmills", icon: "fa-running" },
        { name: "Assault Air Bikes", icon: "fa-bicycle" },
        { name: "Rowing Machines", icon: "fa-oars" },
        { name: "Ski Ergometers", icon: "fa-skiing-nordic" },
        { name: "Elliptical Trainers", icon: "fa-walking" },
        { name: "Stair Climbers", icon: "fa-arrow-up" },
      ],
    },
    machines: {
      title: "⚙️ Machine Selection",
      items: [
        { name: "Plate-Loaded Machines", icon: "fa-cogs" },
        { name: "Cable Crossovers", icon: "fa-project-diagram" },
        { name: "Smith Machines", icon: "fa-cubes" },
        { name: "Functional Trainers", icon: "fa-arrows-alt-h" },
        { name: "Leg Press & Hack Squat", icon: "fa-arrow-up" },
        { name: "Lat Pulldown & Seated Row", icon: "fa-arrows-alt-v" },
      ],
    },
  };

  const equipModal = document.getElementById("equipModal");
  const equipModalClose = document.getElementById("equipModalClose");
  const equipModalTitle = document.getElementById("equipModalTitle");
  const equipModalContent = document.getElementById("equipModalContent");

  document.querySelectorAll(".equip-card[data-equip]").forEach((card) => {
    card.addEventListener("click", function () {
      const key = this.getAttribute("data-equip");
      const data = equipData[key];
      if (!data) return;

      equipModalTitle.textContent = data.title;
      let html = "<ul>";
      data.items.forEach((item) => {
        html += `<li><i class="fas ${item.icon}"></i> ${item.name}</li>`;
      });
      html += "</ul>";
      equipModalContent.innerHTML = html;
      equipModal.classList.add("active");
      document.body.style.overflow = "hidden";
    });
  });

  equipModalClose.addEventListener("click", closeModal);
  equipModal.addEventListener("click", function (e) {
    if (e.target === equipModal) closeModal();
  });

  // ----- MEMBERSHIP -----
  const joinBtns = document.querySelectorAll(".join-btn");
  const checkoutModal = document.getElementById("checkoutModal");
  const checkoutClose = document.getElementById("checkoutClose");
  const checkoutForm = document.getElementById("checkoutForm");
  const checkoutPlanDisplay = document.getElementById("checkoutPlanDisplay");
  const checkoutPriceDisplay = document.getElementById("checkoutPriceDisplay");
  const checkoutFeedback = document.getElementById("checkoutFeedback");

  const profileNavLink = document.getElementById("profileNavLink");
  const profileName = document.getElementById("profileName");
  const profileEmail = document.getElementById("profileEmail");
  const profilePhone = document.getElementById("profilePhone");
  const profilePlan = document.getElementById("profilePlan");
  const profileCoach = document.getElementById("profileCoach");
  const profileDate = document.getElementById("profileDate");
  const logoutBtn = document.getElementById("logoutBtn");

  let memberData = null;

  const planData = {
    monthly: { name: "Monthly", price: "60,000 MMK" },
    quarterly: { name: "3 Months", price: "150,000 MMK" },
  };

  let selectedPlan = "monthly";

  function showProfileNav() {
    if (profileNavLink) {
      profileNavLink.style.display = "inline-block";
      if (window.innerWidth <= 768) {
        profileNavLink.classList.add("show-mobile");
      }
    }
  }

  function hideProfileNav() {
    if (profileNavLink) {
      profileNavLink.style.display = "none";
      profileNavLink.classList.remove("show-mobile");
    }
  }

  function updateProfile(data) {
    memberData = data;
    if (profileName) profileName.textContent = data.name;
    if (profileEmail) profileEmail.textContent = data.email;
    if (profilePhone) profilePhone.textContent = data.phone;
    if (profilePlan) profilePlan.textContent = planData[data.plan].name;
    if (profileCoach) profileCoach.textContent = data.coach;
    const now = new Date();
    if (profileDate)
      profileDate.textContent = now.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    showProfileNav();
  }

  function clearProfile() {
    memberData = null;
    if (profileName) profileName.textContent = "—";
    if (profileEmail) profileEmail.textContent = "—";
    if (profilePhone) profilePhone.textContent = "—";
    if (profilePlan) profilePlan.textContent = "—";
    if (profileCoach) profileCoach.textContent = "—";
    if (profileDate) profileDate.textContent = "—";
    hideProfileNav();
    if (document.getElementById("profile")?.classList.contains("active")) {
      showPage("home");
    }
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      if (confirm("Are you sure you want to logout?")) {
        clearProfile();
        showPage("home");
      }
    });
  }

  joinBtns.forEach((btn) => {
    btn.addEventListener("click", function (e) {
      e.stopPropagation();
      const plan = this.getAttribute("data-plan");
      selectedPlan = plan;
      const data = planData[plan];
      if (checkoutPlanDisplay) checkoutPlanDisplay.textContent = data.name;
      if (checkoutPriceDisplay) checkoutPriceDisplay.textContent = data.price;
      if (checkoutModal) checkoutModal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (checkoutFeedback) checkoutFeedback.style.display = "none";
      if (checkoutForm) checkoutForm.reset();
    });
  });

  checkoutClose.addEventListener("click", closeModal);
  checkoutModal.addEventListener("click", function (e) {
    if (e.target === checkoutModal) closeModal();
  });

  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const name = document.getElementById("checkoutName").value.trim();
    const email = document.getElementById("checkoutEmail").value.trim();
    const phone = document.getElementById("checkoutPhone").value.trim();
    const coach = document.getElementById("checkoutCoach").value;

    if (!name || !email || !phone) {
      showCheckoutFeedback("Please fill in all fields.", "error");
      return;
    }
    if (!isValidEmail(email)) {
      showCheckoutFeedback("Please enter a valid email address.", "error");
      return;
    }
    if (!coach) {
      showCheckoutFeedback("Please select a coach.", "error");
      return;
    }

    const submitBtn = this.querySelector(".btn-submit");
    submitBtn.disabled = true;
    submitBtn.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> Processing...';

    const newMemberData = {
      name: name,
      email: email,
      phone: phone,
      coach: coach,
      plan: selectedPlan,
    };

    setTimeout(() => {
      updateProfile(newMemberData);

      showCheckoutFeedback(
        `✅ Thank you ${name}! You've successfully joined the ${planData[selectedPlan].name} plan with ${coach}. We'll contact you shortly at ${email}.`,
        "success",
      );
      submitBtn.disabled = false;
      submitBtn.innerHTML =
        '<i class="fas fa-check-circle"></i> Confirm Membership';

      setTimeout(() => {
        closeModal();
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<i class="fas fa-check-circle"></i> Confirm Membership';
        showPage("profile");
      }, 3000);
    }, 1500);
  });

  function showCheckoutFeedback(message, type) {
    if (!checkoutFeedback) return;
    checkoutFeedback.textContent = message;
    checkoutFeedback.className = "form-feedback " + type;
    checkoutFeedback.style.display = "block";
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // ----- CONTACT FORM -----
  const contactForm = document.getElementById("contactForm");
  const formFeedback = document.getElementById("formFeedback");
  const OFFICIAL_EMAIL = "athenajneo2004@gmail.com";

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("userName").value.trim();
      const email = document.getElementById("userEmail").value.trim();
      const message = document.getElementById("userMessage").value.trim();

      if (!name || !email || !message) {
        showFeedback("Please fill in all fields.", "error");
        return;
      }
      if (!isValidEmail(email)) {
        showFeedback("Please enter a valid email address.", "error");
        return;
      }

      const submitBtn = this.querySelector(".btn-submit");
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      const subject = encodeURIComponent(`Message from ${name} - YFC Website`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      );
      window.location.href = `mailto:${OFFICIAL_EMAIL}?subject=${subject}&body=${body}`;

      showFeedback(
        `✅ Your email client has been opened. Please send the message to ${OFFICIAL_EMAIL} to complete.`,
        "success",
      );

      setTimeout(() => {
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      }, 2000);
    });
  }

  function showFeedback(message, type) {
    if (!formFeedback) return;
    formFeedback.textContent = message;
    formFeedback.className = "form-feedback " + type;
    formFeedback.style.display = "block";
    if (type === "error") {
      setTimeout(() => {
        formFeedback.style.display = "none";
      }, 5000);
    }
  }

  const formInputs = document.querySelectorAll(
    "#contactForm input, #contactForm textarea",
  );
  formInputs.forEach((input) => {
    input.addEventListener("input", function () {
      if (formFeedback) formFeedback.style.display = "none";
    });
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeModal();
  });

  window.memberData = memberData;
})();
