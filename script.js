window.dataLayer = window.dataLayer || [];

document.addEventListener('DOMContentLoaded', () => {
  const ctaButtons = document.querySelectorAll('[data-cta-location]');
  const form = document.getElementById('lead-form');
  const nameInput = document.getElementById('first-name');
  const emailInput = document.getElementById('email');
  const levelSelect = document.getElementById('math-level');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackBox = document.getElementById('form-feedback');

  const errorName = document.getElementById('error-name');
  const errorEmail = document.getElementById('error-email');
  const errorLevel = document.getElementById('error-level');

  let formStarted = false;
  let formSubmitted = false;

  // 1. Obsługa kliknięć w CTA (cta_click)
  ctaButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const location = btn.getAttribute('data-cta-location');
      window.dataLayer.push({
        event: 'cta_click',
        cta_location: location
      });
    });
  });

  // 2. Obsługa pierwszego rozpoczęcia formularza (form_start - raz na wyświetlenie)
  const handleFormStart = () => {
    if (!formStarted) {
      formStarted = true;
      window.dataLayer.push({
        event: 'form_start',
        form_id: 'lead-form'
      });
    }
  };

  [nameInput, emailInput, levelSelect].forEach((field) => {
    field.addEventListener('input', handleFormStart);
    field.addEventListener('change', handleFormStart);
  });

  // 3. Walidacja i wysłanie demonstracyjne (lead_success)
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // Blokuje wysłanie na serwer i dopisanie parametrów do URL

    if (formSubmitted) {
      return; // Ochrona przed podwójnym sukcesem
    }

    let isValid = true;

    // Reset komunikatów błędów
    errorName.textContent = '';
    errorEmail.textContent = '';
    errorLevel.textContent = '';
    nameInput.classList.remove('invalid');
    emailInput.classList.remove('invalid');
    levelSelect.classList.remove('invalid');

    // Walidacja imienia
    if (nameInput.value.trim().length < 2) {
      errorName.textContent = 'Podaj swoje imię (minimum 2 znaki).';
      nameInput.classList.add('invalid');
      isValid = false;
    }

    // Walidacja e-maila
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      errorEmail.textContent = 'Podaj poprawny adres e-mail (np. test@example.com).';
      emailInput.classList.add('invalid');
      isValid = false;
    }

    // Walidacja wyboru poziomu
    if (!levelSelect.value) {
      errorLevel.textContent = 'Wybierz poziom matury z matematyki.';
      levelSelect.classList.add('invalid');
      isValid = false;
    }

    // Jeśli walidacja nie przeszła – przerywamy, nie wysyłamy lead_success
    if (!isValid) {
      return;
    }

    // Sukces demonstracyjny
    formSubmitted = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Miejsce zarezerwowane';

    feedbackBox.textContent = 'Demonstracja zakończona – dane nie zostały wysłane. Potwierdzenie lekcji próbnej zostało zasymulowane.';
    feedbackBox.classList.add('success');

    // Sygnał do dataLayer (wyłącznie po pozytywnej walidacji, bez danych z pól)
    window.dataLayer.push({
      event: 'lead_success',
      form_id: 'lead-form'
    });
  });
});