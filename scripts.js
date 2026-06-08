document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      document.querySelector(anchor.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Sticky nav
  window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('sticky', window.scrollY > 100);
  });

  // Cached DOM references
  const timerEl = document.getElementById("timer");
  const liveEl = document.getElementById("live-indicator");
  const offlineEl = document.getElementById("offline-indicator");
  const daysEl = document.getElementById("days");
  const hoursEl = document.getElementById("hours");
  const minutesEl = document.getElementById("minutes");
  const secondsEl = document.getElementById("seconds");

  // Streaming schedule
  const schedule = {
    0: { start: 12, end: 14 }, // Sunday
    1: { start: 12, end: 16 }, // Monday
    2: { start: 12, end: 16 }, // Tuesday
    3: { start: 12, end: 16 }, // Wednesday
    4: { start: 12, end: 16 }, // Thursday
    5: { start: 12, end: 16 }, // Friday
    6: { start: 12, end: 16 }  // Saturday
  };

  // FIXED: Proper next-stream detection
  function getNextStreamDate() {
    const now = new Date();
    const today = now.getDay();
    const hour = now.getHours();

    // 1. Stream later today
    if (hour < schedule[today].start) {
      const next = new Date(now);
      next.setHours(schedule[today].start, 0, 0, 0);
      return next;
    }

    // 2. Stream is live
    if (hour >= schedule[today].start && hour < schedule[today].end) {
      return "LIVE";
    }

    // 3. Find next valid stream day (corrected loop)
    for (let i = 1; i <= 7; i++) {
      const nextDay = (today + i) % 7;
      const next = new Date(now);
      next.setDate(now.getDate() + i);
      next.setHours(schedule[nextDay].start, 0, 0, 0);

      // Only return if the date is in the future
      if (next.getTime() > now.getTime()) {
        return next;
      }
    }
  }

  function showLive() {
    timerEl.textContent = "🎮 Stream is LIVE!";
    liveEl.classList.remove("hidden");
    offlineEl.classList.add("hidden");
  }

  function showOffline() {
    liveEl.classList.add("hidden");
    offlineEl.classList.remove("hidden");
  }

  function startCountdown() {
    const nextStream = getNextStreamDate();

    if (nextStream === "LIVE") {
      showLive();
      return;
    }

    showOffline();

    const target = nextStream.getTime();

    setInterval(() => {
      const now = Date.now();
      const distance = target - now;

      if (distance <= 0) {
        showLive();
        return;
      }

      const days = Math.floor(distance / 86400000);
      const hours = Math.floor((distance % 86400000) / 3600000);
      const minutes = Math.floor((distance % 3600000) / 60000);
      const seconds = Math.floor((distance % 60000) / 1000);

      daysEl.textContent = String(days).padStart(2, "0");
      hoursEl.textContent = String(hours).padStart(2, "0");
      minutesEl.textContent = String(minutes).padStart(2, "0");
      secondsEl.textContent = String(seconds).padStart(2, "0");
    }, 1000);
  }

  startCountdown();

  document.getElementById("countdown").classList.add("flash");
});
