document.addEventListener("DOMContentLoaded", function (event) {
  if (typeof NorbertAcademyHomeArticleData === "undefined") return;
  const posts = NorbertAcademyHomeArticleData.posts;
  const container = document.getElementById("na-post-grid-section");
  const textContainer = document.querySelector(".na-article-container-child-1");

  if (!container || !textContainer) return;

  container.innerHTML = posts
    .map(
      (post) => `
    <div class="na-post-card">
        ${
          post.thumb
            ? `<img src="${post.thumb}" alt="${post.title}" />`
            : `<div class="na-post-blank-img"></div>`
        }
    </div>
    `
    )
    .join("");

  let scrollCount = 0;
  let isScrolling = false;
  let scrollEndTimer;

  window.addEventListener("wheel", (event) => {
    // Detect direction
    const direction =
      event.deltaY > 0 ? "down" : event.deltaY < 0 ? "up" : null;
    if (!direction) return;

    // Only count once per scroll gesture
    if (!isScrolling) {
      isScrolling = true;
      if (direction === "down") {
        scrollCount++;
      } else {
        scrollCount--;
      }
      console.log(`Scroll ${direction}: ${scrollCount}`);
    }

    // Wait for scrolling to stop before allowing another count
    clearTimeout(scrollEndTimer);
    scrollEndTimer = setTimeout(() => {
      isScrolling = false;
    }, 200); // Adjust 200ms depending on how long typical scroll gestures last
  });

  window.addEventListener(
    "load",
    function (event) {
      const cards = gsap.utils.toArray(".na-post-card img");
      // Timeline controlling the highlight sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".home-article-section",
          start: "top top",
          end: "+=" + cards.length * 400, // scroll distance proportional to cards
          scrub: true,
          pin: true, // keeps the section pinned
        },
      });
      cards.forEach((img, i) => {
        // Update the text for this post at the start of this animation

        tl.call(() => {
          textContainer.innerHTML = `
          <h2>${posts[i].title}</h2>
          <p>${posts[i].excerpt}</p>
          <a href="${posts[i].link}" class="read-more-btn">Read More</a>
        `;
        });
        tl.to(
          img,
          {
            scale: 1.2,
            duration: 0.5,
            ease: "power1.inOut",
          },
          i
        );
        tl.to(
          img,
          {
            scale: 1,
            duration: 0.5,
            ease: "power1.inOut",
          },
          i + 0.5
        );
      });

      //   gsap.to("#home-article-heading", {
      //     scrollTrigger: {
      //       trigger: ".home-article-section",
      //       pin: true,
      //     },
      //   });
    },
    false
  );
});
