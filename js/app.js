// wait until DOM is ready
document.addEventListener("DOMContentLoaded", function (event) {
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
});
