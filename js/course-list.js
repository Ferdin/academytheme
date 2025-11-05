document.addEventListener("DOMContentLoaded", function () {
  const courseItems = document.querySelectorAll(".na-home-course-item");
  courseItems.forEach((item) => {
    item.addEventListener("mouseover", function () {
      const image = item.querySelector("img");
      const excerpt = item.querySelector(".na-course-item-excerpt");
      gsap.to(item, {
        y: 50,
      });
      gsap.to(image, {
        y: -50,
      });
      gsap.to(excerpt, {
        y: 20,
      });
    });
    item.addEventListener("mouseleave", function () {
      const image = item.querySelector("img");
      const excerpt = item.querySelector(".na-course-item-excerpt");
      gsap.to(item, {
        y: 0,
      });
      gsap.to(image, {
        y: 0,
      });
      gsap.to(excerpt, {
        y: 0,
      });
    });
  });
});
