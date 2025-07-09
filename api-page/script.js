// Ensure DOM is fully loaded before running script
document.addEventListener("DOMContentLoaded", async () => {
  // Main DOM Element Selectors
  const DOM = {
    loadingScreen: document.getElementById("loadingScreen"),
    body: document.body,
    sideNav: document.querySelector("#sideNavigation"),
    mainWrapper: document.querySelector(".lg\\:ml-64"),
    menuToggle: document.querySelector("#menuToggle"),
    themeToggle: document.getElementById("themeToggle"),
    searchInput: document.getElementById("searchInput"),
    clearSearchBtn: document.getElementById("clearSearch"),
    apiContent: document.getElementById("apiContent"),
    notificationToast: document.getElementById("notificationToast"),
    notificationBell: document.getElementById("notificationBell"),
    notificationBadge: document.getElementById("notificationBadge"),
    modal: {
      instance: null,
      element: document.getElementById("apiResponseModal"),
      label: document.getElementById("apiResponseModalLabel"),
      desc: document.getElementById("apiResponseModalDesc"),
      content: document.getElementById("apiResponseContent"),
      container: document.getElementById("responseContainer"),
      endpoint: document.getElementById("apiEndpoint"),
      spinner: document.getElementById("apiResponseLoading"),
      queryInputContainer: document.getElementById("apiQueryInputContainer"),
      submitBtn: document.getElementById("submitQueryBtn"),
      copyEndpointBtn: document.getElementById("copyEndpoint"),
      copyResponseBtn: document.getElementById("copyResponse"),
      closeBtn: document.getElementById("modalCloseBtn"),
    },
    pageTitle: document.getElementById("page"),
    wm: document.getElementById("wm"),
    appName: document.getElementById("name"),
    sideNavName: document.getElementById("sideNavName"),
    versionBadge: document.getElementById("version"),
    versionHeaderBadge: document.getElementById("versionHeader"),
    appDescription: document.getElementById("description"),
    dynamicImage: document.getElementById("dynamicImage"),
    apiLinksContainer: document.getElementById("apiLinks"),
  }

  let settings = {}
  let currentApiData = null
  let allNotifications = []

  // Category icon mapping
  const categoryIcons = {
    "artificial intelligence": "fas fa-brain",
    ai: "fas fa-robot",
    downloader: "fas fa-download",
    "all in one downloader": "fas fa-cloud-download-alt",
    random: "fas fa-dice",
    "random images": "fas fa-images",
    tools: "fas fa-tools",
    utilities: "fas fa-wrench",
    social: "fas fa-share-alt",
    media: "fas fa-photo-video",
    text: "fas fa-font",
    image: "fas fa-image",
    video: "fas fa-video",
    audio: "fas fa-music",
    converter: "fas fa-exchange-alt",
    generator: "fas fa-magic",
    api: "fas fa-code",
    database: "fas fa-database",
    search: "fas fa-search",
    weather: "fas fa-cloud-sun",
    news: "fas fa-newspaper",
    finance: "fas fa-chart-line",
    crypto: "fab fa-bitcoin",
    game: "fas fa-gamepad",
    fun: "fas fa-smile",
    meme: "fas fa-laugh",
    joke: "fas fa-grin-squint",
  }

  // Category color schemes
  const categoryColors = {
    "artificial intelligence": "category-ai",
    ai: "category-ai",
    downloader: "category-downloader",
    "all in one downloader": "category-downloader",
    random: "category-random",
    "random images": "category-random",
    tools: "category-tools",
    utilities: "category-tools",
    social: "category-social",
    media: "category-social",
  }

  // Get category icon
  const getCategoryIcon = (categoryName) => {
    const name = categoryName.toLowerCase()
    for (const [key, icon] of Object.entries(categoryIcons)) {
      if (name.includes(key)) {
        return icon
      }
    }
    return "fas fa-layer-group" // default icon
  }

  // Get category color class
  const getCategoryColorClass = (categoryName) => {
    const name = categoryName.toLowerCase()
    for (const [key, colorClass] of Object.entries(categoryColors)) {
      if (name.includes(key)) {
        return colorClass
      }
    }
    return "category-tools" // default color
  }

  // --- Scroll Reveal Animation ---
  const observeScrollReveal = () => {
    const scrollRevealElements = document.querySelectorAll(".scroll-reveal")

    const scrollRevealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed")
            // Ensure element is visible
            entry.target.style.opacity = "1"
            entry.target.style.transform = "translateY(0)"
            scrollRevealObserver.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.05, // Lower threshold
        rootMargin: "0px 0px -20px 0px", // Reduced margin
      },
    )

    scrollRevealElements.forEach((el) => {
      scrollRevealObserver.observe(el)
    })
  }

  // --- Smooth Page Transitions ---
  const initPageTransitions = () => {
    // Add page transition class to body
    document.body.classList.add("page-transition")

    // Handle link clicks for smooth transitions
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="/"]')
      if (link && !link.target) {
        e.preventDefault()
        const href = link.getAttribute("href")

        // Add exit animation
        document.body.style.opacity = "0"
        document.body.style.transform = "translateY(-20px)"

        setTimeout(() => {
          window.location.href = href
        }, 300)
      }
    })
  }

  // --- Enhanced Ripple Effect ---
  const createAdvancedRipple = (e) => {
    const button = e.currentTarget
    const ripple = document.createElement("span")
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = e.clientX - rect.left - size / 2
    const y = e.clientY - rect.top - size / 2

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: radial-gradient(circle, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.1) 70%, transparent 100%);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple-effect 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      pointer-events: none;
      z-index: 1;
    `

    // Ensure button has relative positioning
    if (getComputedStyle(button).position === "static") {
      button.style.position = "relative"
    }
    button.style.overflow = "hidden"

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 800)
  }

  // Add ripple effect CSS
  const rippleStyle = document.createElement("style")
  rippleStyle.textContent = `
    @keyframes ripple-effect {
      0% {
        transform: scale(0);
        opacity: 1;
      }
      100% {
        transform: scale(2);
        opacity: 0;
      }
    }
  `
  document.head.appendChild(rippleStyle)

  // --- URL Parameter Functions ---
  const getUrlParameter = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  const updateUrlParameter = (key, value) => {
    const url = new URL(window.location)
    if (value) {
      url.searchParams.set(key, value)
    } else {
      url.searchParams.delete(key)
    }
    window.history.replaceState({}, "", url)
  }

  const removeUrlParameter = (key) => {
    const url = new URL(window.location)
    url.searchParams.delete(key)
    window.history.replaceState({}, "", url)
  }

  // --- Utility Functions ---
  const showToast = (message, type = "info", title = "Notification") => {
    if (!DOM.notificationToast) return

    const toastBody = DOM.notificationToast.querySelector(".toast-body")
    const toastTitleEl = DOM.notificationToast.querySelector(".toast-title")
    const toastIcon = DOM.notificationToast.querySelector(".toast-icon")

    toastBody.textContent = message
    toastTitleEl.textContent = title

    const typeConfig = {
      success: { color: "text-green-500", icon: "fa-check-circle" },
      error: { color: "text-red-500", icon: "fa-exclamation-circle" },
      info: { color: "text-primary-500", icon: "fa-info-circle" },
      notification: { color: "text-accent-500", icon: "fa-bell" },
    }

    const config = typeConfig[type] || typeConfig.info
    toastIcon.className = `toast-icon fas ${config.icon} ${config.color} mt-1`

    // Show toast with animation
    DOM.notificationToast.classList.remove("translate-x-full")
    DOM.notificationToast.classList.add("translate-x-0")

    // Auto hide after 5 seconds
    setTimeout(() => {
      DOM.notificationToast.classList.add("translate-x-full")
      DOM.notificationToast.classList.remove("translate-x-0")
    }, 5000)
  }

  const copyToClipboard = async (text, btnElement) => {
    if (!navigator.clipboard) {
      showToast("Browser does not support copying to clipboard.", "error")
      return
    }
    try {
      await navigator.clipboard.writeText(text)
      const originalIcon = btnElement.innerHTML
      btnElement.innerHTML = '<i class="fas fa-check text-green-500"></i>'
      showToast("Successfully copied to clipboard!", "success")

      setTimeout(() => {
        btnElement.innerHTML = originalIcon
      }, 1500)
    } catch (err) {
      showToast("Failed to copy text: " + err.message, "error")
    }
  }

  const debounce = (func, delay) => {
    let timeout
    return (...args) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func.apply(this, args), delay)
    }
  }

  // --- Notification Functions ---
  const loadNotifications = async () => {
    try {
      const response = await fetch("/api/notifications")
      if (!response.ok) throw new Error(`Failed to load notifications: ${response.status}`)
      allNotifications = await response.json()
      updateNotificationBadge()
    } catch (error) {
      console.error("Error loading notifications:", error)
    }
  }

  const getSessionReadNotificationIds = () => {
    const ids = sessionStorage.getItem("sessionReadNotificationIds")
    return ids ? JSON.parse(ids) : []
  }

  const addSessionReadNotificationId = (id) => {
    const ids = getSessionReadNotificationIds()
    if (!ids.includes(id)) {
      ids.push(id)
      sessionStorage.setItem("sessionReadNotificationIds", JSON.stringify(ids))
    }
  }

  const updateNotificationBadge = () => {
    if (!DOM.notificationBadge || !allNotifications.length) {
      if (DOM.notificationBadge) DOM.notificationBadge.classList.add("hidden")
      return
    }

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const sessionReadIds = getSessionReadNotificationIds()

    const unreadNotifications = allNotifications.filter((notif) => {
      const notificationDate = new Date(notif.date)
      notificationDate.setHours(0, 0, 0, 0)
      return !notif.read && notificationDate <= today && !sessionReadIds.includes(notif.id)
    })

    if (unreadNotifications.length > 0) {
      DOM.notificationBadge.classList.remove("hidden")
      DOM.notificationBell.setAttribute("aria-label", `Notifications (${unreadNotifications.length} unread)`)
    } else {
      DOM.notificationBadge.classList.add("hidden")
      DOM.notificationBell.setAttribute("aria-label", "No new notifications")
    }
  }

  const handleNotificationBellClick = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const sessionReadIds = getSessionReadNotificationIds()

    const notificationsToShow = allNotifications.filter((notif) => {
      const notificationDate = new Date(notif.date)
      notificationDate.setHours(0, 0, 0, 0)
      return !notif.read && notificationDate <= today && !sessionReadIds.includes(notif.id)
    })

    if (notificationsToShow.length > 0) {
      notificationsToShow.forEach((notif) => {
        showToast(notif.message, "notification", `Notification (${new Date(notif.date).toLocaleDateString("en-US")})`)
        addSessionReadNotificationId(notif.id)
      })
    } else {
      showToast("No new notifications at this time.", "info")
    }

    updateNotificationBadge()
  }

  // Fix visibility issues - ensure API content is visible
  const ensureVisibility = () => {
    // Remove any hidden states that might prevent API items from showing
    const apiItems = document.querySelectorAll(".api-item")
    apiItems.forEach((item) => {
      item.style.opacity = "1"
      item.style.transform = "translateY(0)"
      item.style.visibility = "visible"
    })

    // Ensure API content container is visible
    if (DOM.apiContent) {
      DOM.apiContent.style.opacity = "1"
      DOM.apiContent.style.visibility = "visible"
    }
  }

  // --- Main Initialization and Event Listeners ---
  const init = async () => {
    setupEventListeners()
    initTheme()
    initSideNav()
    initModal()
    initPageTransitions()
    observeScrollReveal()
    await loadNotifications()

    try {
      const response = await fetch("/api/settings")
      if (!response.ok) throw new Error(`Failed to load settings: ${response.status}`)
      settings = await response.json()
      populatePageContent()
      renderApiCategories()
      observeApiItems()
    } catch (error) {
      console.error("Error loading settings:", error)
      showToast(`Failed to load settings: ${error.message}`, "error")
      displayErrorState("Could not load API configuration.")
    } finally {
      console.log("Settings loaded:", settings)
      console.log("Categories found:", settings.categories?.length || 0)
      hideLoadingScreen()
      forceContentVisibility() // Add this line
    }
  }

  // Fallback to ensure content visibility
  const forceContentVisibility = () => {
    setTimeout(() => {
      // Force show API content
      const apiContent = document.getElementById("apiContent")
      if (apiContent) {
        apiContent.style.display = "block"
        apiContent.style.opacity = "1"
        apiContent.style.visibility = "visible"
      }

      // Force show all API items
      const apiItems = document.querySelectorAll(".api-item")
      apiItems.forEach((item, index) => {
        item.style.display = "block"
        item.style.opacity = "1"
        item.style.visibility = "visible"
        item.style.transform = "translateY(0)"
        item.style.animationDelay = `${index * 0.1}s`
        item.classList.add("animate-slide-up")
      })

      console.log("Forced visibility for", apiItems.length, "API items")
    }, 2000) // Fallback after 2 seconds
  }

  const setupEventListeners = () => {
    if (DOM.menuToggle) DOM.menuToggle.addEventListener("click", toggleSideNavMobile)
    if (DOM.themeToggle) DOM.themeToggle.addEventListener("change", handleThemeToggle)
    if (DOM.searchInput) {
      DOM.searchInput.addEventListener("input", debounce(handleSearch, 300))
      DOM.searchInput.addEventListener("input", () => {
        DOM.clearSearchBtn.classList.toggle("opacity-100", DOM.searchInput.value.length > 0)
        DOM.clearSearchBtn.classList.toggle("pointer-events-auto", DOM.searchInput.value.length > 0)
      })
    }
    if (DOM.clearSearchBtn) DOM.clearSearchBtn.addEventListener("click", clearSearch)
    if (DOM.notificationBell) DOM.notificationBell.addEventListener("click", handleNotificationBellClick)
    if (DOM.apiContent) DOM.apiContent.addEventListener("click", handleApiGetButtonClick)
    if (DOM.modal.copyEndpointBtn)
      DOM.modal.copyEndpointBtn.addEventListener("click", () =>
        copyToClipboard(DOM.modal.endpoint.textContent, DOM.modal.copyEndpointBtn),
      )
    if (DOM.modal.copyResponseBtn)
      DOM.modal.copyResponseBtn.addEventListener("click", () =>
        copyToClipboard(DOM.modal.content.textContent, DOM.modal.copyResponseBtn),
      )
    if (DOM.modal.submitBtn) DOM.modal.submitBtn.addEventListener("click", handleSubmitQuery)

    // Modal close functionality - FIX THE BUG HERE
    if (DOM.modal.closeBtn) {
      DOM.modal.closeBtn.addEventListener("click", closeModal)
    }

    DOM.modal.element.addEventListener("click", (e) => {
      if (e.target === DOM.modal.element) {
        closeModal()
      }
    })

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !DOM.modal.element.classList.contains("hidden")) {
        closeModal()
      }
    })

    window.addEventListener("scroll", handleScroll)
    document.addEventListener("click", closeSideNavOnClickOutside)

    // Add enhanced ripple effects
    document.addEventListener("click", (e) => {
      if (e.target.closest(".ripple")) {
        createAdvancedRipple(e)
      }
    })

    // Add smooth scroll for anchor links
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]')
      if (link) {
        e.preventDefault()
        const targetId = link.getAttribute("href").substring(1)
        const targetElement = document.getElementById(targetId)
        if (targetElement) {
          targetElement.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }
    })
  }

  // --- Loading Screen Management ---
  const hideLoadingScreen = () => {
    if (!DOM.loadingScreen) return

    setTimeout(() => {
      DOM.loadingScreen.style.opacity = "0"
      DOM.loadingScreen.style.transform = "scale(0.9)"
      setTimeout(() => {
        DOM.loadingScreen.style.display = "none"
        DOM.loadingScreen.style.visibility = "hidden"
        DOM.loadingScreen.remove() // Completely remove from DOM
        DOM.body.classList.remove("overflow-hidden")

        // Ensure main content is visible
        document.querySelector(".lg\\:ml-64").style.opacity = "1"
        document.querySelector(".lg\\:ml-64").style.visibility = "visible"
      }, 500)
    }, 800) // Reduced delay
  }

  // --- Theme Management ---
  const initTheme = () => {
    const modeParam = getUrlParameter("mode")

    if (modeParam === "dark") {
      document.documentElement.classList.add("dark")
      if (DOM.themeToggle) DOM.themeToggle.checked = true
      localStorage.setItem("darkMode", "true")
      showToast("Dark mode activated from URL parameter", "info")
    } else if (modeParam === "light") {
      document.documentElement.classList.remove("dark")
      if (DOM.themeToggle) DOM.themeToggle.checked = false
      localStorage.setItem("darkMode", "false")
      showToast("Light mode activated from URL parameter", "info")
    } else {
      const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      const savedTheme = localStorage.getItem("darkMode")

      if (savedTheme === "true" || (savedTheme === null && prefersDark)) {
        document.documentElement.classList.add("dark")
        if (DOM.themeToggle) DOM.themeToggle.checked = true
      }
    }
  }

  const handleThemeToggle = () => {
    document.documentElement.classList.toggle("dark")
    const isDarkMode = document.documentElement.classList.contains("dark")
    localStorage.setItem("darkMode", isDarkMode)

    updateUrlParameter("mode", isDarkMode ? "dark" : "light")
    showToast(`Switched to ${isDarkMode ? "dark" : "light"} mode`, "success")

    // Add theme transition effect
    document.body.style.transition = "all 0.5s ease"
    setTimeout(() => {
      document.body.style.transition = ""
    }, 500)
  }

  // --- Side Navigation Management ---
  const initSideNav = () => {
    // Initialize navigation active states
    const navLinks = DOM.sideNav.querySelectorAll("a[href^='#']")
    navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        navLinks.forEach((l) =>
          l.classList.remove(
            "active",
            "bg-primary-100",
            "dark:bg-primary-900/30",
            "text-primary-600",
            "dark:text-primary-400",
          ),
        )
        link.classList.add(
          "active",
          "bg-primary-100",
          "dark:bg-primary-900/30",
          "text-primary-600",
          "dark:text-primary-400",
        )
      })
    })
  }

  const toggleSideNavMobile = () => {
    if (!DOM.sideNav || !DOM.menuToggle) return
    DOM.sideNav.classList.toggle("-translate-x-full")
    DOM.sideNav.classList.toggle("translate-x-0")
    const isActive = !DOM.sideNav.classList.contains("-translate-x-full")
    DOM.menuToggle.setAttribute("aria-expanded", isActive)
  }

  const closeSideNavOnClickOutside = (e) => {
    if (!DOM.sideNav || !DOM.menuToggle) return
    if (
      window.innerWidth < 1024 &&
      !DOM.sideNav.contains(e.target) &&
      !DOM.menuToggle.contains(e.target) &&
      !DOM.sideNav.classList.contains("-translate-x-full")
    ) {
      DOM.sideNav.classList.add("-translate-x-full")
      DOM.sideNav.classList.remove("translate-x-0")
      DOM.menuToggle.setAttribute("aria-expanded", "false")
    }
  }

  const handleScroll = () => {
    const scrollPosition = window.scrollY
    const sections = document.querySelectorAll("section[id]")
    const navLinks = DOM.sideNav.querySelectorAll("a[href^='#']")

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 100
      const sectionHeight = section.offsetHeight
      const sectionId = section.getAttribute("id")

      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach((link) => {
          link.classList.remove(
            "active",
            "bg-primary-100",
            "dark:bg-primary-900/30",
            "text-primary-600",
            "dark:text-primary-400",
          )
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add(
              "active",
              "bg-primary-100",
              "dark:bg-primary-900/30",
              "text-primary-600",
              "dark:text-primary-400",
            )
          }
        })
      }
    })
  }

  // --- Modal Management ---
  const initModal = () => {
    // Modal is now handled with Tailwind classes
  }

  const showModal = () => {
    DOM.modal.element.classList.remove("hidden")
    DOM.modal.element.classList.add("flex")
    document.body.classList.add("overflow-hidden")

    // Add entrance animation
    const modalContent = DOM.modal.element.querySelector("div")
    modalContent.style.transform = "scale(0.8) translateY(20px)"
    modalContent.style.opacity = "0"

    setTimeout(() => {
      modalContent.style.transform = "scale(1) translateY(0)"
      modalContent.style.opacity = "1"
    }, 50)
  }

  const closeModal = () => {
    const modalContent = DOM.modal.element.querySelector("div")
    modalContent.style.transform = "scale(0.8) translateY(20px)"
    modalContent.style.opacity = "0"

    setTimeout(() => {
      DOM.modal.element.classList.add("hidden")
      DOM.modal.element.classList.remove("flex")
      document.body.classList.remove("overflow-hidden")
    }, 200)
  }

  // --- Page Content Population ---
  const setPageContent = (element, value, fallback = "") => {
    if (element) element.textContent = value || fallback
  }

  const populatePageContent = () => {
    if (!settings || Object.keys(settings).length === 0) return

    const currentYear = new Date().getFullYear()

    setPageContent(DOM.pageTitle, settings.name, "Zizz API")
    setPageContent(DOM.wm, `© ${currentYear} Zizz API Corp. All rights reserved.`)
    setPageContent(DOM.appName, settings.name, "Zizz API")
    setPageContent(DOM.sideNavName, settings.name || "Zizz API")
    setPageContent(DOM.versionBadge, settings.version, "v1.0")
    setPageContent(DOM.versionHeaderBadge, settings.header?.status, "Active")
    setPageContent(
      DOM.appDescription,
      settings.description,
      "A simple and easily customizable API documentation interface with modern design and powerful features.",
    )

    if (DOM.dynamicImage) {
      if (settings.bannerImage) {
        DOM.dynamicImage.src = settings.bannerImage
        DOM.dynamicImage.alt = settings.name ? `${settings.name} Banner` : "Zizz API Banner"
      } else {
        DOM.dynamicImage.src = "/src/banner.jpg"
        DOM.dynamicImage.alt = "Zizz API Banner"
      }
      DOM.dynamicImage.onerror = () => {
        DOM.dynamicImage.src = "/src/banner.jpg"
        DOM.dynamicImage.alt = "Zizz API Banner Fallback"
        showToast("Failed to load banner image, using default image.", "error")
      }
    }
  }

  // --- Enhanced Render API Categories and Items ---
  const renderApiCategories = () => {
    console.log("Rendering API categories...")
    console.log("DOM.apiContent:", DOM.apiContent)
    console.log("Categories:", settings.categories)

    if (!DOM.apiContent) {
      console.error("API Content container not found!")
      return
    }

    if (!settings.categories || !settings.categories.length) {
      console.error("No categories found in settings!")
      displayErrorState("No API categories found.")
      return
    }

    DOM.apiContent.innerHTML = ""

    settings.categories.forEach((category, categoryIndex) => {
      const sortedItems = category.items.sort((a, b) => a.name.localeCompare(b.name))
      const categoryIcon = getCategoryIcon(category.name)
      const categoryColorClass = getCategoryColorClass(category.name)

      const categorySection = document.createElement("section")
      categorySection.className = `space-y-8 animate-slide-up ${categoryColorClass}`
      categorySection.style.animationDelay = `${categoryIndex * 0.1}s`

      // Enhanced Category Header
      const categoryHeader = document.createElement("div")
      categoryHeader.className =
        "category-header relative overflow-hidden rounded-3xl p-8 mb-8 category-card neon-border"

      categoryHeader.innerHTML = `
        <!-- Background Pattern -->
        <div class="absolute inset-0 opacity-5">
          <div class="absolute inset-0" style="background-image: radial-gradient(circle at 25% 25%, var(--category-color) 2px, transparent 2px), radial-gradient(circle at 75% 75%, var(--category-color-light) 1px, transparent 1px); background-size: 50px 50px;"></div>
        </div>
        
        <!-- Floating Elements -->
        <div class="absolute top-4 right-4 w-20 h-20 rounded-full opacity-10 animate-category-float" style="background: var(--category-color);"></div>
        <div class="absolute bottom-4 left-4 w-16 h-16 rounded-full opacity-10 animate-category-float" style="background: var(--category-color-light); animation-delay: 2s;"></div>
        <div class="absolute top-1/2 right-1/3 w-12 h-12 rounded-full opacity-10 animate-category-float" style="background: var(--category-color); animation-delay: 4s;"></div>
        
        <!-- Content -->
        <div class="relative z-10 flex items-center justify-between">
          <div class="flex items-center gap-6">
            <div class="category-icon-container w-20 h-20 rounded-2xl flex items-center justify-center shadow-2xl animate-neon-pulse" style="color: var(--category-color);">
              <i class="${categoryIcon} text-3xl text-white"></i>
            </div>
            <div>
              <h3 class="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white mb-2 animate-gradient" style="background: linear-gradient(135deg, var(--category-color), var(--category-color-light)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
                ${category.name}
              </h3>
              <p class="text-lg text-gray-600 dark:text-gray-300 flex items-center gap-2">
                <i class="fas fa-cube text-sm" style="color: var(--category-color);"></i>
                ${sortedItems.length} ${sortedItems.length === 1 ? "endpoint" : "endpoints"} available
              </p>
            </div>
          </div>
          
          <div class="hidden lg:flex items-center gap-4">
            <div class="px-4 py-2 rounded-full text-sm font-semibold" style="background: var(--category-bg); color: var(--category-color);">
              <i class="fas fa-rocket mr-2"></i>
              Ready to Use
            </div>
          </div>
        </div>
      `

      categorySection.appendChild(categoryHeader)

      // Enhanced Items Grid
      const itemsGrid = document.createElement("div")
      itemsGrid.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"

      sortedItems.forEach((item, itemIndex) => {
        const itemCard = document.createElement("article")
        itemCard.className = `
          api-card bg-white/95 dark:bg-dark-800/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl hover:shadow-2xl 
          transition-all duration-500 border border-gray-200/50 dark:border-dark-700/50 api-item scroll-reveal 
          group relative overflow-hidden transform hover:scale-105 hover:-translate-y-2
        `
        itemCard.dataset.name = item.name
        itemCard.dataset.desc = item.desc
        itemCard.dataset.category = category.name
        itemCard.style.animationDelay = `${itemIndex * 0.1 + 0.3}s`

        // Enhanced shimmer effect
        const shimmer = document.createElement("div")
        shimmer.className = `
          absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent 
          via-white/20 dark:via-white/10 to-transparent group-hover:translate-x-full 
          transition-transform duration-1000 pointer-events-none
        `
        itemCard.appendChild(shimmer)

        // Gradient border effect
        const gradientBorder = document.createElement("div")
        gradientBorder.className =
          "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        gradientBorder.style.background = `linear-gradient(135deg, var(--category-color), var(--category-color-light))`
        gradientBorder.style.padding = "2px"
        gradientBorder.style.mask = "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)"
        gradientBorder.style.maskComposite = "exclude"
        itemCard.appendChild(gradientBorder)

        const cardContent = document.createElement("div")
        cardContent.className = "space-y-4 relative z-10"

        const itemHeader = document.createElement("div")
        itemHeader.className = "flex items-start justify-between mb-4"

        const itemTitleContainer = document.createElement("div")
        itemTitleContainer.className = "flex-1"

        const itemTitle = document.createElement("h4")
        itemTitle.className = `
          text-xl font-bold text-gray-900 dark:text-white mb-2 
          group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r 
          transition-all duration-300
        `
        itemTitle.style.setProperty(
          "--hover-gradient",
          `linear-gradient(135deg, var(--category-color), var(--category-color-light))`,
        )
        itemTitle.textContent = item.name

        const itemDesc = document.createElement("p")
        itemDesc.className = "text-gray-600 dark:text-gray-300 text-sm leading-relaxed"
        itemDesc.textContent = item.desc

        itemTitleContainer.appendChild(itemTitle)
        itemTitleContainer.appendChild(itemDesc)

        const status = item.status || "ready"
        const statusConfig = {
          ready: {
            class: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
            icon: "fa-circle",
            text: "Ready",
          },
          error: {
            class: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
            icon: "fa-exclamation-triangle",
            text: "Error",
          },
          update: {
            class: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
            icon: "fa-arrow-up",
            text: "Update",
          },
        }
        const currentStatus = statusConfig[status] || statusConfig.ready

        const statusIndicator = document.createElement("div")
        statusIndicator.className = `
          px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 
          ${currentStatus.class} transition-all duration-300 group-hover:scale-105 
          shadow-lg group-hover:shadow-xl
        `
        statusIndicator.innerHTML = `<i class="fas ${currentStatus.icon} animate-pulse"></i><span>${currentStatus.text}</span>`

        itemHeader.appendChild(itemTitleContainer)
        itemHeader.appendChild(statusIndicator)

        const cardFooter = document.createElement("div")
        cardFooter.className = `
          flex items-center justify-between pt-4 border-t border-gray-200/50 
          dark:border-dark-700/50 group-hover:border-opacity-100 transition-all duration-300
        `

        const getBtn = document.createElement("button")
        getBtn.className =
          status === "error" || status === "update"
            ? "px-6 py-3 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-xl font-semibold cursor-not-allowed flex items-center gap-2 transition-all duration-300"
            : `px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 
             transition-all duration-300 flex items-center gap-2 get-api-btn ripple group/btn
             text-white relative overflow-hidden`

        if (status !== "error" && status !== "update") {
          getBtn.style.background = `linear-gradient(135deg, var(--category-color), var(--category-color-light))`

          // Add animated background
          const animatedBg = document.createElement("div")
          animatedBg.className =
            "absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"
          animatedBg.style.background = `linear-gradient(135deg, var(--category-color-light), var(--category-color))`
          getBtn.appendChild(animatedBg)
        }

        getBtn.innerHTML =
          status === "error" || status === "update"
            ? '<i class="fas fa-ban"></i> <span class="relative z-10">Unavailable</span>'
            : '<i class="fas fa-play group-hover/btn:scale-110 group-hover/btn:animate-bounce transition-transform relative z-10"></i> <span class="relative z-10">Try API</span>'

        getBtn.dataset.apiPath = item.path
        getBtn.dataset.apiName = item.name
        getBtn.dataset.apiDesc = item.desc
        if (item.params) getBtn.dataset.apiParams = JSON.stringify(item.params)
        if (item.innerDesc) getBtn.dataset.apiInnerDesc = item.innerDesc

        if (status === "error" || status === "update") {
          getBtn.disabled = true
          getBtn.title = `This API is in '${status}' status, temporarily unavailable.`
        }

        const apiInfo = document.createElement("div")
        apiInfo.className = "flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400"
        apiInfo.innerHTML = `
          <i class="fas fa-code" style="color: var(--category-color);"></i>
          <span>REST API</span>
          <span class="w-1 h-1 rounded-full" style="background: var(--category-color);"></span>
          <span>JSON Response</span>
        `

        cardFooter.appendChild(getBtn)
        cardFooter.appendChild(apiInfo)

        cardContent.appendChild(itemHeader)
        cardContent.appendChild(cardFooter)
        itemCard.appendChild(cardContent)
        itemsGrid.appendChild(itemCard)
      })

      console.log(`Rendered category: ${category.name} with ${sortedItems.length} items`)
      categorySection.appendChild(itemsGrid)
      DOM.apiContent.appendChild(categorySection)
    })

    // Add this at the very end of renderApiCategories function, after the forEach loop
    setTimeout(() => {
      ensureVisibility()
    }, 100)
  }

  const displayErrorState = (message) => {
    if (!DOM.apiContent) return
    DOM.apiContent.innerHTML = `
      <div class="text-center py-16 space-y-6 animate-bounce-in">
        <div class="w-24 h-24 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-exclamation-triangle text-3xl text-red-500"></i>
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">${message}</h3>
          <p class="text-gray-600 dark:text-gray-400">Please try reloading the page or contact the administrator.</p>
        </div>
        <button class="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto ripple" onclick="location.reload()">
          <i class="fas fa-sync-alt"></i>
          Reload
        </button>
      </div>
    `
  }

  // --- Search Functionality ---
  const handleSearch = () => {
    if (!DOM.searchInput || !DOM.apiContent) return
    const searchTerm = DOM.searchInput.value.toLowerCase().trim()

    const apiItems = DOM.apiContent.querySelectorAll(".api-item")
    const visibleCategories = new Set()

    apiItems.forEach((item) => {
      const name = (item.dataset.name || "").toLowerCase()
      const desc = (item.dataset.desc || "").toLowerCase()
      const category = (item.dataset.category || "").toLowerCase()
      const matches = name.includes(searchTerm) || desc.includes(searchTerm) || category.includes(searchTerm)

      if (matches) {
        item.style.display = ""
        item.style.opacity = "1"
        item.style.transform = "translateY(0)"
        visibleCategories.add(item.closest("section"))
      } else {
        item.style.opacity = "0"
        item.style.transform = "translateY(20px)"
        setTimeout(() => {
          item.style.display = "none"
        }, 300)
      }
    })

    DOM.apiContent.querySelectorAll("section").forEach((section) => {
      section.style.display = visibleCategories.has(section) ? "" : "none"
    })

    const noResultsMsg = DOM.apiContent.querySelector("#noResultsMessage") || createNoResultsMessage()
    const allHidden = Array.from(visibleCategories).length === 0 && searchTerm.length > 0

    if (allHidden) {
      noResultsMsg.querySelector("span").textContent = `"${searchTerm}"`
      noResultsMsg.style.display = "block"
    } else {
      noResultsMsg.style.display = "none"
    }
  }

  const clearSearch = () => {
    if (!DOM.searchInput) return
    DOM.searchInput.value = ""
    DOM.searchInput.focus()
    handleSearch()
    DOM.clearSearchBtn.classList.remove("opacity-100", "pointer-events-auto")
  }

  const createNoResultsMessage = () => {
    let noResultsMsg = document.getElementById("noResultsMessage")
    if (!noResultsMsg) {
      noResultsMsg = document.createElement("div")
      noResultsMsg.id = "noResultsMessage"
      noResultsMsg.className = "text-center py-16 space-y-6 animate-fade-in"
      noResultsMsg.style.display = "none"
      noResultsMsg.innerHTML = `
        <div class="w-24 h-24 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mx-auto">
          <i class="fas fa-search text-3xl text-gray-400"></i>
        </div>
        <div class="space-y-2">
          <h3 class="text-2xl font-bold text-gray-900 dark:text-white">No results for <span class="text-primary-500"></span></h3>
          <p class="text-gray-600 dark:text-gray-400">Try adjusting your search terms or browse all APIs below.</p>
        </div>
        <button id="clearSearchFromMsg" class="px-6 py-3 bg-gradient-to-r from-primary-500 to-accent-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto ripple">
          <i class="fas fa-times"></i>
          Clear Search
        </button>
      `
      DOM.apiContent.appendChild(noResultsMsg)
      document.getElementById("clearSearchFromMsg").addEventListener("click", clearSearch)
    }
    return noResultsMsg
  }

  // --- API Button Click Handling ---
  const handleApiGetButtonClick = (event) => {
    const getApiBtn = event.target.closest(".get-api-btn")
    if (!getApiBtn || getApiBtn.disabled) return

    getApiBtn.style.transform = "scale(0.95)"
    setTimeout(() => {
      getApiBtn.style.transform = ""
    }, 150)

    currentApiData = {
      path: getApiBtn.dataset.apiPath,
      name: getApiBtn.dataset.apiName,
      desc: getApiBtn.dataset.apiDesc,
      params: getApiBtn.dataset.apiParams ? JSON.parse(getApiBtn.dataset.apiParams) : null,
      innerDesc: getApiBtn.dataset.apiInnerDesc,
    }

    setupModalForApi(currentApiData)
    showModal()
  }

  const setupModalForApi = (apiData) => {
    DOM.modal.label.textContent = apiData.name
    DOM.modal.desc.textContent = apiData.desc
    DOM.modal.content.innerHTML = ""
    DOM.modal.endpoint.textContent = `${window.location.origin}${apiData.path.split("?")[0]}`

    DOM.modal.spinner.classList.add("hidden")
    DOM.modal.content.classList.add("hidden")
    DOM.modal.container.classList.add("hidden")

    DOM.modal.queryInputContainer.innerHTML = ""
    DOM.modal.submitBtn.classList.add("hidden")
    DOM.modal.submitBtn.disabled = true

    const paramsFromPath = new URLSearchParams(apiData.path.split("?")[1])
    const paramKeys = Array.from(paramsFromPath.keys())

    if (paramKeys.length > 0) {
      const paramContainer = document.createElement("div")
      paramContainer.className =
        "space-y-6 bg-gray-50 dark:bg-dark-800 rounded-xl p-6 border border-gray-200 dark:border-dark-700"

      const formTitle = document.createElement("h4")
      formTitle.className = "text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2"
      formTitle.innerHTML = '<i class="fas fa-sliders-h text-primary-500"></i> Parameters'
      paramContainer.appendChild(formTitle)

      paramKeys.forEach((paramKey) => {
        const paramGroup = document.createElement("div")
        paramGroup.className = "space-y-2"

        const label = document.createElement("label")
        label.className = "block text-sm font-medium text-gray-700 dark:text-gray-300"
        label.textContent = paramKey
        label.htmlFor = `param-${paramKey}`

        const requiredSpan = document.createElement("span")
        requiredSpan.className = "text-red-500 ml-1"
        requiredSpan.textContent = "*"
        label.appendChild(requiredSpan)

        const inputField = document.createElement("input")
        inputField.type = "text"
        inputField.className =
          "w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100"
        inputField.id = `param-${paramKey}`
        inputField.placeholder = `Enter ${paramKey}...`
        inputField.dataset.param = paramKey
        inputField.required = true
        inputField.addEventListener("input", validateModalInputs)

        paramGroup.appendChild(label)
        paramGroup.appendChild(inputField)
        paramContainer.appendChild(paramGroup)
      })

      if (apiData.innerDesc) {
        const innerDescDiv = document.createElement("div")
        innerDescDiv.className =
          "bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-xl p-4 flex items-start gap-3"
        innerDescDiv.innerHTML = `<i class="fas fa-info-circle text-blue-500 mt-1"></i><p class="text-blue-800 dark:text-blue-300 text-sm">${apiData.innerDesc.replace(/\n/g, "<br>")}</p>`
        paramContainer.appendChild(innerDescDiv)
      }

      DOM.modal.queryInputContainer.appendChild(paramContainer)
      DOM.modal.submitBtn.classList.remove("hidden")
      DOM.modal.submitBtn.disabled = true
    } else {
      handleApiRequest(`${window.location.origin}${apiData.path}`, apiData.name)
    }
  }

  const validateModalInputs = () => {
    const inputs = DOM.modal.queryInputContainer.querySelectorAll("input[required]")
    const allFilled = Array.from(inputs).every((input) => input.value.trim() !== "")
    DOM.modal.submitBtn.disabled = !allFilled

    inputs.forEach((input) => {
      if (input.value.trim()) {
        input.classList.remove("border-red-500")
        input.classList.add("border-gray-200", "dark:border-dark-600")
      }
    })
  }

  const handleSubmitQuery = async () => {
    if (!currentApiData) return

    const inputs = DOM.modal.queryInputContainer.querySelectorAll("input")
    const newParams = new URLSearchParams()
    let isValid = true

    inputs.forEach((input) => {
      if (input.required && !input.value.trim()) {
        isValid = false
        input.classList.add("border-red-500")
        input.classList.remove("border-gray-200", "dark:border-dark-600")
      } else {
        input.classList.remove("border-red-500")
        input.classList.add("border-gray-200", "dark:border-dark-600")
        if (input.value.trim()) newParams.append(input.dataset.param, input.value.trim())
      }
    })

    if (!isValid) {
      showToast("Please fill in all required fields.", "error")
      return
    }

    DOM.modal.submitBtn.disabled = true
    DOM.modal.submitBtn.innerHTML = `
      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
      <span>Processing...</span>
    `

    const apiUrlWithParams = `${window.location.origin}${currentApiData.path.split("?")[0]}?${newParams.toString()}`
    DOM.modal.endpoint.textContent = apiUrlWithParams

    await handleApiRequest(apiUrlWithParams, currentApiData.name)
  }

  const handleApiRequest = async (apiUrl, apiName) => {
    DOM.modal.spinner.classList.remove("hidden")
    DOM.modal.container.classList.add("hidden")
    DOM.modal.content.innerHTML = ""

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 20000)

      const response = await fetch(apiUrl, { signal: controller.signal })
      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: response.statusText }))
        throw new Error(`HTTP error! Status: ${response.status} - ${errorData.message || response.statusText}`)
      }

      const contentType = response.headers.get("Content-Type")
      if (contentType && contentType.includes("image/")) {
        const blob = await response.blob()
        const imageUrl = URL.createObjectURL(blob)
        const img = document.createElement("img")
        img.src = imageUrl
        img.alt = apiName
        img.className = "w-full h-auto rounded-xl shadow-lg animate-fade-in"
        DOM.modal.content.appendChild(img)
      } else if (contentType && contentType.includes("application/json")) {
        const data = await response.json()
        const formattedJson = JSON.stringify(data, null, 2)
        DOM.modal.content.textContent = formattedJson
        DOM.modal.content.className =
          "bg-gray-50 dark:bg-dark-800 p-4 rounded-xl text-sm font-mono overflow-x-auto border border-gray-200 dark:border-dark-700 max-h-96 whitespace-pre text-gray-900 dark:text-gray-100"
      } else {
        const textData = await response.text()
        DOM.modal.content.textContent = textData || "Response has no content or unknown format."
        DOM.modal.content.className =
          "bg-gray-50 dark:bg-dark-800 p-4 rounded-xl text-sm font-mono overflow-x-auto border border-gray-200 dark:border-dark-700 max-h-96 text-gray-900 dark:text-gray-100"
      }

      DOM.modal.container.classList.remove("hidden")
      DOM.modal.content.classList.remove("hidden")
      showToast(`Successfully retrieved data for ${apiName}`, "success")

      if (DOM.modal.submitBtn) {
        DOM.modal.submitBtn.disabled = false
        DOM.modal.submitBtn.innerHTML = `
          <span>Send Again</span>
          <i class="fas fa-paper-plane"></i>
        `
      }
    } catch (error) {
      console.error("API Request Error:", error)
      const errorHtml = `
        <div class="text-center py-8 space-y-4 animate-bounce-in">
          <div class="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto">
            <i class="fas fa-exclamation-triangle text-2xl text-red-500"></i>
          </div>
          <div class="space-y-2">
            <h4 class="text-lg font-semibold text-red-600 dark:text-red-400">An Error Occurred</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm">${error.message || "Could not retrieve data from server."}</p>
          </div>
        </div>`
      DOM.modal.content.innerHTML = errorHtml
      DOM.modal.container.classList.remove("hidden")
      DOM.modal.content.classList.remove("hidden")
      showToast("Failed to retrieve data. Check details in modal.", "error")
    } finally {
      DOM.modal.spinner.classList.add("hidden")
      if (DOM.modal.submitBtn) {
        DOM.modal.submitBtn.disabled = false
        DOM.modal.submitBtn.innerHTML = `
          <span>Send Again</span>
          <i class="fas fa-paper-plane"></i>
        `
      }
    }
  }

  // --- Observe API Items for Animation ---
  const observeApiItems = () => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-slide-up")
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1 },
    )

    document.querySelectorAll(".api-item").forEach((item) => {
      observer.observe(item)
    })
  }

  // Run main initialization
  init()
})
