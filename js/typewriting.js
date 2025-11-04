document.addEventListener("DOMContentLoaded", function () {
  if (typeof NorbertAcademyTypeWriting === "undefined") return;

  const colorSet = ["#ff0054", "#ff5400", "#6e2be1", "#9e0059", "#ffbd00"];
  const rawEl = document.querySelector(".typewriter-raw");
  const displayEl = document.querySelector(".typewriter-display");

  function wrapIncludeWithSpan(text) {
    return text
      .replace(
        /(#include)(\s+&lt;[^&]+&gt;)/g,
        '<span class="include-directive">$1</span>$2'
      )
      .replace(
        /\b(using)\b/g, // match "using" as a whole word
        '<span class="include-directive">$1</span>'
      )
      .replace(
        /(&lt;iostream+&gt;)/g,
        '<span class="ios-stream-directive">$1</span>'
      )
      .replace(
        /\b(namespace)\b/g, // match "using" as a whole word
        '<span class="blue-directive">$1</span>'
      )
      .replace(
        /\b(int)\b/g, // match "using" as a whole word
        '<span class="blue-directive">$1</span>'
      )
      .replace(
        /\b(std)\b/g, // match "using" as a whole word
        '<span class="s-directive">$1</span>'
      )
      .replace(
        /\b[a-zA-Z_]\w*\s*\([^)]*\)\s*/g,
        '<span class="yellow-directive">$&</span>'
      )
      .replace(/(\/\/[^\n<]*)/g, '<span class="comment-directive">$1</span>');
  }

  function getElementStyled(element) {
    let html = element.innerHTML;

    // Wrap #include directives
    html = html
      .replace(
        /(#include)(\s+&lt;[^&]+&gt;)/g,
        '<span class="include-directive">$1</span>$2'
      )
      .replace(/\b(using)\b/g, '<span class="include-directive">$1</span>')
      .replace(
        /(&lt;iostream+&gt;)/g,
        '<span class="ios-stream-directive">$1</span>'
      )
      .replace(/\b(namespace)\b/g, '<span class="blue-directive">$1</span>')
      .replace(/\b(int)\b/g, '<span class="blue-directive">$1</span>')
      .replace(/\b(std)\b/g, '<span class="s-directive">$1</span>')
      .replace(
        /\b[a-zA-Z_]\w*\s*\([^)]*\)\s*/g,
        '<span class="yellow-directive">$&</span>'
      )
      .replace(/(\/\/[^\n<]*)/g, '<span class="comment-directive">$1</span>');

    element.innerHTML = html;
  }
  const cursorEl = document.createElement("span");
  cursorEl.classList.add("typewriter-cursor");
  cursorEl.textContent = "|";
  displayEl.appendChild(cursorEl);
  // Animate the text
  gsap.to(cursorEl, {
    opacity: 0,
    yoyo: true,
    ease: "power1.inOut",
    duration: 1,
  });
  // Loop through each instance
  NorbertAcademyTypeWriting.instances.forEach((instance) => {
    const { text, speed, delay, cursor } = instance;

    if (!rawEl || !text) return;

    const formattedText = text.replace(/\n/g, "<br>");

    gsap.to(rawEl, {
      duration: text.length * speed, // duration scales with text length
      text: formattedText,
      ease: "none",
      delay: delay,
      onUpdate: () => {
        // Get whatever has been typed so far
        const partial = rawEl.innerHTML;

        // Highlight and display it
        displayEl.innerHTML =
          wrapIncludeWithSpan(partial) +
          '<span class="typewriter-cursor">|</span>';
      },
      onComplete: () => {
        getElementStyled(displayEl);
        gsap.to(".typewriter-cursor", {
          opacity: 0,
          repeat: -1,
          yoyo: true,
        });
      },
    });
  });

  const btnLink = document.querySelector(".btn-norbert-academy-right");
  let tl;

  btnLink.addEventListener("mouseenter", function () {
    if (tl) tl.kill();
    tl = gsap.timeline({ repeat: -1, yoyo: true });

    colorSet.forEach((c) => {
      tl.to(btnLink, { color: c, duration: 1, ease: "none" });
    });
  });

  btnLink.addEventListener("mouseleave", function () {
    if (tl) {
      tl.kill();
      gsap.set(btnLink, { clearProps: "color" });
    }
  });

  btnLink.addEventListener("click", function () {
    console.log("Button clicked");
  });
});
