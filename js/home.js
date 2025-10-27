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
            ? `
            <div class="na-post-card-overlay"></div>
            <img src="${post.thumb}" alt="${post.title}" />`
            : `<div class="na-post-blank-img"></div>`
        }
    </div>
    `
    )
    .join("");

  window.addEventListener(
    "load",
    function (event) {
      const cards = gsap.utils.toArray(".na-post-card img");
      const cardsOverlay = gsap.utils.toArray(".na-post-card-overlay");
      // Helper function to update text content
      function updateText(index) {
        if (index >= 0 && index < posts.length) {
          textContainer.innerHTML = `
            <h2>${posts[index].title}</h2>
            <p>${posts[index].excerpt}</p>
            <a href="${posts[index].link}" class="read-more-btn">Read More</a>
          `;
        }
      }

      // Initialize with first post
      updateText(0);

      // Timeline controlling the highlight sequence
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".home-article-section",
          start: "top top",
          end: "+=" + cards.length * 400,
          scrub: true,
          pin: true,
          onUpdate: (self) => {
            // Calculate which post should be active based on progress
            const progress = self.progress;
            const activeIndex = Math.min(
              Math.floor(progress * cards.length),
              cards.length - 1
            );
            updateText(activeIndex);
          },
        },
      });

      cardsOverlay.forEach((overlay, i) => {
        tl.to(
          overlay,
          {
            opacity: 0,
          },
          i
        );
        tl.to(
          overlay,
          {
            opacity: 0.8,
          },
          i + 0.5
        );
      });

      cards.forEach((img, i) => {
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
    },
    false
  );
});
