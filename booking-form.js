(() => {
  const availabilityTriggers = [...document.querySelectorAll("a")].filter((link) =>
    link.textContent.replace(/\s+/g, " ").trim().toLowerCase().startsWith("check availability")
  );
  const triggers = [...new Set([
    ...document.querySelectorAll(".header-book-button"),
    ...availabilityTriggers,
  ])];
  if (!triggers.length) return;

  const modal = document.createElement("div");
  modal.className = "booking-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="booking-modal__backdrop" data-booking-close></div>
    <section class="booking-modal__panel" role="dialog" aria-modal="true" aria-labelledby="booking-modal-title">
      <button class="booking-modal__close" type="button" aria-label="Close booking form" data-booking-close>&times;</button>
      <p class="booking-modal__eyebrow">Check availability</p>
      <h2 class="booking-modal__title" id="booking-modal-title">Plan your royal arrival.</h2>
      <p class="booking-modal__intro">Share your event details and continue your enquiry directly on WhatsApp.</p>
      <form class="booking-form">
        <div class="booking-form__field">
          <label for="booking-date">Event date</label>
          <input id="booking-date" name="date" type="date" required>
        </div>
        <div class="booking-form__field">
          <label for="booking-occasion">Occasion</label>
          <select id="booking-occasion" name="occasion" required>
            <option value="" selected disabled>Select occasion</option>
            <option>Wedding / Baraat</option>
            <option>Bride entry</option>
            <option>Vidaai</option>
            <option>Pre-wedding shoot</option>
            <option>Reception</option>
            <option>Other event</option>
          </select>
        </div>
        <div class="booking-form__field">
          <label for="booking-city">City / Venue</label>
          <input id="booking-city" name="city" autocomplete="address-level2" placeholder="Enter city or venue" required>
        </div>
        <div class="booking-form__field">
          <label for="booking-car">Preferred car</label>
          <select id="booking-car" name="car" required>
            <option value="" selected disabled>Select a car</option>
            <option>The Ivory Imperial</option>
            <option>The Royal Maroon</option>
            <option>The Pearl Classic</option>
            <option>Help me choose</option>
          </select>
        </div>
        <div class="booking-form__field">
          <label for="booking-name">Name</label>
          <input id="booking-name" name="name" autocomplete="name" placeholder="Enter your full name" required>
        </div>
        <div class="booking-form__field">
          <label for="booking-phone">Phone</label>
          <input id="booking-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="Enter phone number" required>
        </div>
        <button class="button booking-form__submit booking-form__field--wide" type="submit">Continue on WhatsApp <span aria-hidden="true">&rarr;</span></button>
        <p class="booking-form__note booking-form__field--wide">No payment required. Availability and quotation will be confirmed on WhatsApp.</p>
      </form>
    </section>`;

  document.body.append(modal);

  const form = modal.querySelector(".booking-form");
  const panel = modal.querySelector(".booking-modal__panel");
  const dateInput = modal.querySelector("#booking-date");
  let previouslyFocused;

  const localToday = new Date();
  localToday.setMinutes(localToday.getMinutes() - localToday.getTimezoneOffset());
  dateInput.min = localToday.toISOString().slice(0, 10);

  const openModal = (event) => {
    event.preventDefault();
    previouslyFocused = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("booking-modal-open");
    panel.querySelector("input, select, button")?.focus();
  };

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove("booking-modal-open");
    previouslyFocused?.focus();
  };

  triggers.forEach((trigger) => trigger.addEventListener("click", openModal));
  modal.querySelectorAll("[data-booking-close]").forEach((control) => control.addEventListener("click", closeModal));

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const [year, month, day] = String(data.get("date")).split("-");
    const formattedDate = `${day}/${month}/${year}`;
    const message = `Hello ROYALS,

I am interested in booking a vintage car for my upcoming event. Please share the availability and quotation.

*Event Details*
Date: ${formattedDate}
Occasion: ${data.get("occasion")}
City / Venue: ${data.get("city")}
Preferred Car: ${data.get("car")}

*Contact Details*
Name: ${data.get("name")}
Phone: ${data.get("phone")}

Thank you.`;

    window.open(`https://wa.me/918830612287?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });
})();
