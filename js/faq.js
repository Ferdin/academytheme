document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".faq-item").forEach((item) => {
    const question = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    // Uncomment if you want multiple items open
    // let isOpen = false;

    let isOpen = false;
    let animating = false;

    question.addEventListener("click", () => {
      if (animating) return; // prevent spam clicking
      animating = true;

      if (!isOpen) {
        // OPEN
        gsap.fromTo(
          answer,
          { height: 0, opacity: 0, paddingTop: 0 },
          {
            height: answer.scrollHeight,
            opacity: 1,
            paddingTop: 10,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => (animating = false),
          }
        );
      } else {
        // CLOSE
        gsap.to(answer, {
          height: 0,
          opacity: 0,
          paddingTop: 0,
          duration: 0.3,
          ease: "power2.inOut",
          onComplete: () => (animating = false),
        });
      }

      isOpen = !isOpen;
    });
  });
});
