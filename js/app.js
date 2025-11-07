// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
  const targets = document.querySelectorAll(".na-checker-background");

  targets.forEach((target) => {
    // Create the hover circle div
    const hoverCircle = document.createElement("div");
    hoverCircle.className = "hover-circle";

    // Create the cursor dot div
    const cursorDot = document.createElement("div");
    cursorDot.className = "cursor-dot";

    // Append both inside the target
    target.appendChild(hoverCircle);
    target.appendChild(cursorDot);

    let mouseX = 0;
    let mouseY = 0;

    // Track mouse position RELATIVE to this specific target element
    target.addEventListener("mousemove", (e) => {
      const rect = target.getBoundingClientRect();
      // Account for any scroll within the element
      mouseX = e.clientX - rect.left + target.scrollLeft;
      mouseY = e.clientY - rect.top + target.scrollTop;
    });

    // Show circle on mouse enter
    target.addEventListener("mouseenter", () => {
      gsap.to([hoverCircle, cursorDot], {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Hide circle on mouse leave
    target.addEventListener("mouseleave", () => {
      gsap.to([hoverCircle, cursorDot], {
        opacity: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    // Smooth follow animation using GSAP ticker for this specific element
    gsap.ticker.add(() => {
      gsap.to(hoverCircle, {
        left: mouseX + "px",
        top: mouseY + "px",
        duration: 0.5,
        ease: "power2.out",
      });

      gsap.to(cursorDot, {
        left: mouseX + "px",
        top: mouseY + "px",
        duration: 0.2,
        ease: "power2.out",
      });
    });
  });

  ScrollSmoother.create({
    wrapper: "#smooth-wrapper",
    content: "#smooth-content",
    smooth: 3,
    effects: true,
    smoothTouch: 0.1,
  });

  //wait until images, links, fonts, stylesheets, and js is loaded
  window.addEventListener(
    "load",
    function (e) {
      //custom GSAP code goes here
      gsap.from(".custom-logo", {
        opacity: 0,
        duration: 3,
        ease: "circ.out",
      });
    },
    false
  );
  const splitTextAnimation = SplitText.create(".na-split-text", {
    type: "words, chars",
  });

  gsap.from(splitTextAnimation.chars, {
    duration: 1,
    y: 20,
    autoAlpha: 0,
    stagger: 0.02,
  });
});
