document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("na-contact-form");
  const responseBox = document.getElementById("na-form-response");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    responseBox.textContent = "Sending...";

    const formData = new FormData(form);
    formData.append("action", "na_contact_form");
    formData.append("nonce", naForm.nonce);

    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }

    try {
      const response = await fetch(naForm.ajax_url, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        responseBox.innerHTML = `<span style="color:green;">${result.data.message}</span>`;
        form.reset();
      } else {
        responseBox.innerHTML = `<span style="color:red;">${result.data.message}</span>`;
      }
    } catch (error) {
      responseBox.innerHTML = `<span style="color:red;">Request failed. Please try again.</span>`;
    }
  });
});
