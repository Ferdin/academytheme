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
      let currentIndex = -1; // Track current index

      function updateText(index) {
        if (index >= 0 && index < posts.length && index !== currentIndex) {
          currentIndex = index;

          gsap.to(textContainer, {
            opacity: 0,
            y: 10,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
              textContainer.innerHTML = `
          <h2 style="color:${posts[index].heading_color}">${posts[index].title}</h2>
          <p>${posts[index].excerpt}</p>
          <a href="${posts[index].link}" class="read-more-btn">Read More</a>
        `;
              gsap.fromTo(
                textContainer,
                { opacity: 0, y: -10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.3,
                  ease: "power2.out",
                }
              );
            },
          });
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

      const colorList = gsap.utils.wrap([
        "#ff0054",
        "#ff5400",
        "#6e2be1",
        "#9e0059",
        "#ffbd00",
      ]);

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
            backgroundColor: colorList(i),
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
