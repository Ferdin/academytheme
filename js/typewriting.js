document.addEventListener("DOMContentLoaded", function () {
  if (typeof NorbertAcademyTypeWriting === "undefined") return;

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

  // Loop through each instance
  NorbertAcademyTypeWriting.instances.forEach((instance) => {
    const { text, speed, delay, cursor } = instance;

    if (!rawEl || !text) return;

    const formattedText = text.replace(/\n/g, "<br>");

    // Animate the text
    gsap.to(rawEl, {
      duration: text.length * speed, // duration scales with text length
      text: formattedText,
      ease: "none",
      delay: delay,
      onUpdate: () => {
        // Get whatever has been typed so far
        const partial = rawEl.innerHTML;

        // Highlight and display it
        displayEl.innerHTML = wrapIncludeWithSpan(partial);
      },
      onComplete: () => {
        getElementStyled(displayEl);
      },
    });
  });
});
