// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
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
