document.addEventListener("DOMContentLoaded", () => {

  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute('href')).scrollIntoView({
        behavior: 'smooth'
      });
    });
  });

  // Sticky nav
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    nav.classList.toggle('sticky', window.scrollY > 100);
  });

  // --- AUTO-DETECT NEXT STREAM TIME ---
  function getNextStreamDate() {
    const now = new Date();

    // Streaming schedule (0 = Sunday)
    const schedule = {
      0: { start: 12, end: 14 }, // Sunday
      1: { start: 12, end: 16 }, // Monday
      2: { start: 12, end: 16 }, // Tuesday
      3: { start: 12, end: 16 }, // Wednesday
      4: { start: 12, end: 16 }, // Thursday
      5: { start: 12, end: 16 }, // Friday
      6: { start: 12, end: 16 }  // Saturday
    };

    let day = now.getDay();
    let hour = now.getHours();

    // Check if stream is later today
    if (hour < schedule[day].start) {
      const next = new Date();
      next.setHours(schedule[day].start, 0, 0, 0);
      return next;
    }

    // If stream is currently live
    if (hour >= schedule[day].start && hour < schedule[day].end) {
      return "LIVE";
    }

    // Otherwise, find the next day with a stream
    for (let i = 1; i <= 7; i++) {
      const nextDay = (day + i) % 7;
      const next = new Date();
      next.setDate(now.getDate() + i);
      next.setHours(schedule[nextDay].start, 0, 0, 0);
      return next;
    }
  }

  function startCountdown() {
    const nextStream = getNextStreamDate();

    if (nextStream === "LIVE") {
      document.getElementById("timer").textContent = "🎮 Stream is LIVE!";
      return;
    }

    const countDownDate = nextStream.getTime();

    const timer = setInterval(function () {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance <= 0) {
        clearInterval(timer);
        document.getElementById("timer").textContent = "🎮 Stream is LIVE!";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("days").textContent = days.toString().padStart(2, '0');
      document.getElementById("hours").textContent = hours.toString().padStart(2, '0');
      document.getElementById("minutes").textContent = minutes.toString().padStart(2, '0');
      document.getElementById("seconds").textContent = seconds.toString().padStart(2, '0');
    }, 1000);
  }

  startCountdown();

  // Flash animation
  document.getElementById("countdown").classList.add("flash");

});
