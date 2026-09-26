(function(){
  "use strict";

  var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Sticky header background on scroll
  --------------------------------------------------------- */
  var header = document.getElementById("siteHeader");
  function onScrollHeader(){
    if (window.scrollY > 24) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------------------------------------------------------
     Mobile menu
  --------------------------------------------------------- */
  var menuToggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  var mobileLinks = document.querySelectorAll(".mobile-link");

  function openMenu(){
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    document.body.style.overflow = "hidden";
  }
  function closeMenu(){
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    document.body.style.overflow = "";
  }
  menuToggle.addEventListener("click", function(){
    if (mobileNav.classList.contains("is-open")) closeMenu();
    else openMenu();
  });
  mobileLinks.forEach(function(link){
    link.addEventListener("click", closeMenu);
  });
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && mobileNav.classList.contains("is-open")) closeMenu();
  });

  /* ---------------------------------------------------------
     Scroll-reveal via IntersectionObserver
  --------------------------------------------------------- */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach(function(el){ el.classList.add("is-visible"); });
  } else {
    var groups = {};
    revealEls.forEach(function(el){
      var parent = el.closest("section, article, .hero");
      var key = parent ? (parent.id || parent.className) : "default";
      if (!groups[key]) groups[key] = [];
      groups[key].push(el);
    });

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting){
          var el = entry.target;
          var group = null;
          for (var key in groups){
            if (groups[key].indexOf(el) !== -1){ group = groups[key]; break; }
          }
          var delay = group ? group.indexOf(el) * 90 : 0;
          setTimeout(function(){ el.classList.add("is-visible"); }, delay);
          io.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* ---------------------------------------------------------
     Education timeline progressive line fill
  --------------------------------------------------------- */
  var timelineFill = document.getElementById("timelineFill");
  var timelineSection = document.querySelector(".education");

  if (timelineFill && timelineSection){
    function updateTimelineFill(){
      var rect = timelineSection.getBoundingClientRect();
      var vh = window.innerHeight;
      var total = rect.height;
      var visible = Math.min(Math.max(vh * 0.7 - rect.top, 0), total);
      var pct = total > 0 ? (visible / total) * 100 : 0;
      timelineFill.style.height = pct + "%";
    }
    window.addEventListener("scroll", updateTimelineFill, { passive: true });
    window.addEventListener("resize", updateTimelineFill);
    updateTimelineFill();
  }

  /* ---------------------------------------------------------
     Active nav link on scroll
  --------------------------------------------------------- */
  var sections = ["home","about","education","skills","projects","experience","services","contact"]
    .map(function(id){ return document.getElementById(id); })
    .filter(Boolean);
  var navLinks = document.querySelectorAll(".nav-link");

  function setActiveNav(){
    var scrollPos = window.scrollY + window.innerHeight * 0.35;
    var currentId = sections[0] ? sections[0].id : null;
    sections.forEach(function(sec){
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    navLinks.forEach(function(link){
      link.classList.toggle("active-link", link.dataset.section === currentId);
    });
  }
  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  /* ---------------------------------------------------------
     Project detail modal
  --------------------------------------------------------- */
  var projectData = {
    "agris-ros2": {
      eyebrow: "Project 01 · August 2026",
      title: "AGRIS in ROS2",
      tags: ["Computer Vision", "Embedded Robotics"],
      description: "A modular ROS 2 and Gazebo robotics stack bringing AGRIS to a fully simulated environment. Features parametric URDF/Xacro models of a 4-wheel Mecanum rover with a 2-DOF pan/tilt turret, real-time RViz2 visualization with targeting lasers, and an autonomous OpenCV tracking and teleoperation pipeline.",
      tech: ["ROS2", "Gazebo", "RViz2", "URDF/Xacro", "OpenCV", "Python"]
    },
    "agris": {
      eyebrow: "Project 02 · Jan–May 2026 · Final Year Project 2026",
      title: "AGRIS",
      tags: ["Computer Vision", "Embedded Robotics"],
      description: "Autonomous laser targeting system — completed and defended as final-year project (2026). An ESP32-CAM streams MJPEG video to a Python/OpenCV desktop app which runs real-time shape detection and PID tracking, sending UDP servo commands to aim a laser mounted on a mecanum rover. Controlled wirelessly via DualShock 4 through Bluepad32.",
      tech: ["Python", "OpenCV", "Embedded", "Tkinter", "C++", "UDP", "PID"]
    }
  };

  var modal = document.getElementById("projectModal");
  var modalBody = document.getElementById("modalBody");
  var modalClose = document.getElementById("modalClose");
  var modalBackdrop = document.getElementById("modalBackdrop");
  var lastFocused = null;

  function renderProject(key){
    var data = projectData[key];
    if (!data) return;
    var tagsHtml = data.tags.map(function(t){ return "<span>" + t + "</span>"; }).join("");
    var techHtml = data.tech.map(function(t){ return "<span>" + t + "</span>"; }).join("");
    modalBody.innerHTML =
      '<span class="modal-eyebrow">' + data.eyebrow + '</span>' +
      '<h3>' + data.title + '</h3>' +
      '<div class="project-tags">' + tagsHtml + '</div>' +
      '<p style="margin-top:20px;">' + data.description + '</p>' +
      '<div class="modal-tech">' + techHtml + '</div>';
  }

  function openModal(key){
    renderProject(key);
    lastFocused = document.activeElement;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    modalClose.focus();
  }
  function closeModal(){
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll("[data-open]").forEach(function(btn){
    btn.addEventListener("click", function(e){
      e.stopPropagation();
      openModal(btn.dataset.open);
    });
  });
  document.querySelectorAll(".project[data-project]").forEach(function(card){
    card.addEventListener("click", function(){
      openModal(card.dataset.project);
    });
  });
  modalClose.addEventListener("click", closeModal);
  modalBackdrop.addEventListener("click", closeModal);
  document.addEventListener("keydown", function(e){
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  /* ---------------------------------------------------------
     Back to top
  --------------------------------------------------------- */
  var backToTop = document.getElementById("backToTop");
  backToTop.addEventListener("click", function(){
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  });

  /* ---------------------------------------------------------
     Scroll cue in hero
  --------------------------------------------------------- */
  var scrollCue = document.getElementById("scrollCue");
  if (scrollCue){
    scrollCue.addEventListener("click", function(){
      var about = document.getElementById("about");
      if (about) about.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  /* ---------------------------------------------------------
     Contact form -> mailto fallback (no backend)
  --------------------------------------------------------- */
  var contactForm = document.getElementById("contactForm");
  if (contactForm){
    contactForm.addEventListener("submit", function(e){
      e.preventDefault();
      var name = document.getElementById("name").value.trim();
      var email = document.getElementById("email").value.trim();
      var message = document.getElementById("message").value.trim();
      var subject = encodeURIComponent("Portfolio contact from " + (name || "website visitor"));
      var body = encodeURIComponent(message + "\n\n— " + name + " (" + email + ")");
      window.location.href = "mailto:atifsadiq273@gmail.com?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------------------------------------------------------
     Download CV placeholder (no CV file supplied)
  --------------------------------------------------------- */
  var downloadCv = document.getElementById("downloadCv");
  if (downloadCv){
    downloadCv.addEventListener("click", function(e){
      e.preventDefault();
      window.location.href = "mailto:atifsadiq273@gmail.com?subject=" + encodeURIComponent("CV Request") + "&body=" + encodeURIComponent("Hi Atif, could you please send me a copy of your CV?");
    });
  }

})();
