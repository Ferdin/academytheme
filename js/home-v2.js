document.addEventListener("DOMContentLoaded", function () {
  if (typeof NorbertAcademyHomeArticleData === "undefined") return;

  const posts = NorbertAcademyHomeArticleData.posts;
  const container = document.getElementById("na-post-grid-section");
  const textContainer = document.querySelector(".na-article-container-child-1");
  if (!container || !textContainer) return;

  // Render cards
  container.innerHTML = posts
    .map(
      (post, index) => `
      <div class="na-post-card">
        ${
          post.thumb
            ? `<img src="${post.thumb}" alt="${post.title}" />`
            : `<div class="na-post-blank-img" aria-hidden="true"></div>`
        }
      </div>
    `
    )
    .join("");

  const cards = gsap.utils.toArray(".na-post-card img");
  let scrollCount = 0;
  let isScrolling = false;
  let scrollEndTimer = null;
  let sectionActive = false;
  let releaseReady = false; // first extra scroll marks ready-to-unpin

  // register plugin if not already
  gsap.registerPlugin(ScrollTrigger);

  // Create a pin trigger and keep a reference so we can kill it later
  const st = ScrollTrigger.create({
    trigger: ".home-article-section",
    start: "top top",
    end: "+=99999", // effectively big - we will unpin manually
    pin: true,
    pinSpacing: true,
    onEnter: () => {
      sectionActive = true;
      releaseReady = false;
      scrollCount = 0; // optionally reset on re-enter
      showPost(0);
      console.log("Pinned: entered section");
    },
    onLeave: () => {
      // when user scrolls beyond the pinned region after we kill trigger,
      // onLeave may fire normally; we handle main unpin via st.kill()
      sectionActive = false;
      console.log("Trigger leave");
    },
    onLeaveBack: () => {
      sectionActive = false;
      console.log("Trigger leave back");
    },
    // optional markers: true
  });

  // Helper to display a post and animate its image
  function showPost(index) {
    // clamp index
    index = Math.max(0, Math.min(index, posts.length - 1));
    const p = posts[index];

    // Update text
    textContainer.innerHTML = `
      <h2>${p.title}</h2>
      <p>${p.excerpt}</p>
      <a href="${p.link}" class="read-more-btn">Read More</a>
    `;

    // Reset all images then scale the active one
    gsap.to(cards, { scale: 1, duration: 0.3, ease: "power2.out" });
    if (cards[index]) {
      gsap.to(cards[index], {
        scale: 1.2,
        duration: 0.45,
        ease: "power2.inOut",
      });
    }
  }

  // Call once to set initial state if the section is already pinned
  showPost(0);

  // Wheel listener: passive: false so we can preventDefault while pinned
  window.addEventListener(
    "wheel",
    function (e) {
      if (!sectionActive) return; // do nothing unless section is pinned

      // Prevent native page scroll while pinned
      e.preventDefault();

      const direction = e.deltaY > 0 ? "down" : e.deltaY < 0 ? "up" : null;
      if (!direction) return;

      // Debounce single gesture
      if (isScrolling) {
        // still within the same gesture, ignore
        clearTimeout(scrollEndTimer);
        scrollEndTimer = setTimeout(() => {
          isScrolling = false;
        }, 180);
        return;
      }

      isScrolling = true;
      scrollEndTimer = setTimeout(() => {
        isScrolling = false;
      }, 180);

      if (direction === "down") {
        // If not at last post, advance
        if (scrollCount < posts.length - 1) {
          scrollCount++;
          showPost(scrollCount);
          releaseReady = false; // reset release flag while moving through posts
        } else {
          // At last post: mark ready for release on first extra scroll, kill on next
          if (!releaseReady) {
            releaseReady = true;
            console.log("At last post — extra scroll will release pin");
            // optionally give a small UI hint that next scroll will release
            return;
          } else {
            // second extra scroll -> unpin
            // Kill ScrollTrigger to unpin and restore normal scrolling
            st.kill(true);
            sectionActive = false;
            console.log("Unpinned after extra scroll down");
            // optionally nudge the page to allow natural scroll continuation
            // window.scrollBy(0, 10);
            return;
          }
        }
      } else {
        // direction === 'up'
        if (releaseReady) {
          // If user scrolls up while releaseReady, cancel release
          releaseReady = false;
          console.log("Release canceled (user scrolled up)");
        } else if (scrollCount > 0) {
          scrollCount--;
          showPost(scrollCount);
        } else {
          // At first post and user scrolls up: allow a release behavior if desired
          // e.g., require extra up-scroll to unpin upward
          // For now: do nothing or implement symmetric release logic
          console.log("At first post — cannot go up further");
        }
      }
    },
    { passive: false }
  );

  // Optional: support touch swipes (mobile)
  let touchStartY = null;
  window.addEventListener(
    "touchstart",
    (e) => {
      if (!sectionActive) return;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );

  window.addEventListener(
    "touchend",
    (e) => {
      if (!sectionActive || touchStartY === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      const threshold = 30; // min px to be considered a swipe
      if (Math.abs(diff) < threshold) {
        touchStartY = null;
        return;
      }
      // emulate a wheel gesture
      const fakeEvent = { deltaY: diff, preventDefault: () => {} };
      // Reuse same logic by calling the wheel handler synchronously:
      // but we must not depend on e.preventDefault here; simply call main logic:
      // We can trigger the same actions used in the wheel listener:
      // (copy-paste the core logic into a small helper if needed).
      // For brevity, call window.dispatchEvent with a new WheelEvent:
      const we = new WheelEvent("wheel", { deltaY: diff });
      window.dispatchEvent(we);
      touchStartY = null;
    },
    { passive: true }
  );
});
