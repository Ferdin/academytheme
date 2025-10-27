document.addEventListener("DOMContentLoaded", function () {
  if (typeof NorbertAcademyHomeArticleData === "undefined") return;

  const posts = NorbertAcademyHomeArticleData.posts;
  const container = document.getElementById("na-post-grid-section");
  const textContainer = document.querySelector(".na-article-container-child-1");
  const perPostScroll = 400; // Same value used in end: () => `+=${posts.length * 400}`

  if (!container || !textContainer) return;

  // Render posts
  container.innerHTML = posts
    .map(
      (post) => `
      <div class="na-post-card">
        ${
          post.thumb
            ? `<img src="${post.thumb}" alt="${post.title}"/>`
            : `<div class="na-post-blank-img"></div>`
        }
      </div>`
    )
    .join("");

  const cards = gsap.utils.toArray(".na-post-card img");
  let scrollCount = 0;
  let isScrolling = false;
  let scrollEndTimer;
  let sectionActive = false;
  let releaseScroll = false; // <-- new flag

  const imageCards = document.querySelectorAll(".na-post-card");

  imageCards.forEach((card, index) => {
    card.addEventListener("click", function () {
      scrollCount = index;
      showPost(index);

      // scrollCount is less than posts.length and greater than or equal to 0
      // st.enable
      // sectionActive = true;
      //releaseScroll = false;

      // if (scrollCount >= 0 || scrollCount < posts.length) {
      //   st.enable;
      //   sectionActive = true;
      //   releaseScroll = false;
      // }
      const sectionStart =
        ScrollTrigger.getById("homeSection")?.start ||
        document.querySelector(".home-article-section").offsetTop;

      const targetScroll = sectionStart + index * perPostScroll;

      gsap.to(window, {
        scrollTo: targetScroll,
        duration: 0.8,
        ease: "power2.inOut",
      });
    });
  });

  // --- Setup ScrollTrigger for pinning ---
  ScrollTrigger.create({
    id: "homeSection",
    trigger: ".home-article-section",
    start: "top top",
    end: () => `+=${posts.length * 400}`,
    pin: true,
    markers: true,
    onEnter: () => {
      sectionActive = true;
      releaseScroll = false;
      console.log("Entered pinned section");
    },
    onLeave: () => {
      sectionActive = false;
      console.log("Left pinned section");
    },
    onLeaveBack: () => {
      sectionActive = false;
      console.log("Scrolled back above section");
    },
  });

  // --- Helper to update text and image animation ---
  function showPost(index) {
    if (index < 0 || index >= posts.length) return;

    textContainer.innerHTML = `
      <h2>${posts[index].title}</h2>
      <p>${posts[index].excerpt}</p>
      <a href="${posts[index].link}" class="read-more-btn">Read More</a>
    `;

    gsap.to(cards, { scale: 1, duration: 0.4, ease: "power2.out" });
    gsap.to(cards[index], { scale: 1.2, duration: 0.6, ease: "power2.inOut" });
  }

  // Initialize first post
  showPost(0);

  // --- Wheel listener ---
  window.addEventListener("wheel", (event) => {
    if (!sectionActive) return;

    const direction =
      event.deltaY > 0 ? "down" : event.deltaY < 0 ? "up" : null;
    if (!direction) return;

    if (!isScrolling) {
      isScrolling = true;

      if (direction === "down") {
        if (scrollCount < posts.length - 1) {
          scrollCount++;
          showPost(scrollCount);
        } else if (scrollCount === posts.length - 1) {
          // If at last post, wait for one more scroll before unpinning
          if (releaseScroll) {
            ScrollTrigger.getAll().forEach((st) => {
              if (st.trigger.classList.contains("home-article-section")) {
                st.disable(); // unpin
                sectionActive = false;
                console.log("Section unpinned after extra scroll");
              }
            });
          } else {
            releaseScroll = true;
            console.log("Ready to unpin on next scroll down");
          }
        }
      } else if (direction === "up") {
        if (releaseScroll) {
          releaseScroll = false; // reset if user scrolls up again
        }
        scrollCount = Math.max(scrollCount - 1, 0);
        showPost(scrollCount);
      }

      console.log(`Scroll ${direction}: index ${scrollCount}`);
    }

    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrolling = false;
    }, 200);
  });
});
