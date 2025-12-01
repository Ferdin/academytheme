document.addEventListener("DOMContentLoaded", () => {
  // Check if GSAP is loaded
  if (typeof gsap === "undefined") {
    console.error("GSAP is not loaded!");
    return;
  }

  document.querySelectorAll(".learning-path-wrapper").forEach((wrapper) => {
    const items = JSON.parse(wrapper.dataset.items);

    const circle = wrapper.querySelector(".progress-ring__circle");
    const text = wrapper.querySelector(".progress-text");
    const heading = wrapper.querySelector(".lp-heading");
    const desc = wrapper.querySelector(".lp-description");

    const btnPlay = wrapper.querySelector(".lp-play");
    const btnPause = wrapper.querySelector(".lp-pause");
    const btnBack = wrapper.querySelector(".lp-back");
    const btnRestart = wrapper.querySelector(".lp-restart");

    // ---- Increase circle size here ----
    const radius = 75; // or read from shortcode
    const stroke = 10; // should match the shortcode stroke value
    const circumference = 2 * Math.PI * radius;

    circle.style.setProperty("--circle-circumference", circumference);
    circle.setAttribute("r", radius);

    // Center the circle properly
    const center = radius + stroke / 2;
    circle.setAttribute("cx", center);
    circle.setAttribute("cy", center);

    // Also update the background circle
    const bgCircle = wrapper.querySelector(".progress-ring__background");
    bgCircle.setAttribute("r", radius);
    bgCircle.setAttribute("cx", center);
    bgCircle.setAttribute("cy", center);

    // Update SVG size to match PHP calculation
    const svg = wrapper.querySelector("svg.progress-ring");
    const svgSize = radius * 2 + stroke;
    svg.setAttribute("width", svgSize);
    svg.setAttribute("height", svgSize);

    // ---- Setup stroke values ----
    circle.style.strokeDasharray = `${circumference}`;
    circle.style.strokeDashoffset = circumference;

    // Initial text
    heading.textContent = items[0].key;
    desc.textContent = items[0].value;

    let currentIndex = 0;

    function updateContent(percent) {
      const segmentSize = 100 / items.length;
      const index = Math.min(
        Math.floor(percent / segmentSize),
        items.length - 1
      );

      if (index !== currentIndex) {
        currentIndex = index;
        const { key, value } = items[index];

        gsap.to([heading, desc], {
          opacity: 0,
          y: -10,
          duration: 0.2,
          onComplete: () => {
            heading.textContent = key;
            desc.textContent = value;
            gsap.to([heading, desc], {
              opacity: 1,
              y: 0,
              duration: 0.3,
            });
          },
        });
      }
    }

    // ---- Main Animation Controller ----
    const progressObj = { p: 0 };

    const animation = gsap.to(progressObj, {
      p: 100,
      ease: "power2.inOut",
      duration: 5,
      paused: true, // starts paused
      onUpdate: () => {
        const percent = Math.floor(progressObj.p);
        circle.style.strokeDashoffset =
          circumference - (percent / 100) * circumference;

        text.textContent = percent + "%";
        updateContent(percent);
      },
    });

    // ---- CONTROL BUTTONS ----

    if (btnPlay) {
      btnPlay.addEventListener("click", () => {
        animation.play();
      });
    }

    if (btnPause) {
      btnPause.addEventListener("click", () => {
        animation.pause();
      });
    }

    if (btnBack) {
      btnBack.addEventListener("click", () => {
        // Move back one segment
        const segment = 100 / items.length;
        const newP = Math.max(0, progressObj.p - segment);

        animation.pause();
        gsap.to(progressObj, {
          p: newP,
          duration: 0.5,
          ease: "power2.out",
          onUpdate: animation.vars.onUpdate,
        });
      });
    }

    if (btnRestart) {
      btnRestart.addEventListener("click", () => {
        animation.restart(true); // true = restart from beginning
      });
    }
  });
});
