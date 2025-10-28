document.addEventListener("DOMContentLoaded", function (event) {
  if (typeof NorbertAcademyTypeWriting === "undefined") return;
  const text = NorbertAcademyTypeWriting.instances[0].text;
  const speed = NorbertAcademyTypeWriting.instances[0].speed;
  const delay = NorbertAcademyTypeWriting.instances[0].delay;

  if (text.length === 0) return;

  //   const cursor = document.querySelector(".typewriter-cursor");
  //   // Create text container
  //   const textSpan = document.createElement("span");
  //   if (cursor) {
  //     element.insertBefore(textSpan, cursor);
  //   } else {
  //     element.appendChild(textSpan);
  //   }
  // GSAP typing animation
  gsap.to(textSpan, {
    duration: text.length * speed,
    text: text,
    ease: "none",
    delay: delay,
  });

  // Cursor blink animation
  if (cursor) {
    gsap.to(cursor, {
      opacity: 0,
      duration: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "steps(1)",
    });
  }
});
