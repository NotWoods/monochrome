/** @type {HTMLFormElement} */
const colorForm = document.querySelector('#foregroundColor');
/** @type {NodeListOf<HTMLInputElement>} */
const colorInputs = document.querySelectorAll('input[name="fill"]');

colorForm.addEventListener('input', function handleColorInput(event) {
  const input = /** @type {HTMLInputElement} */ (event.target);
  const color = input.value;
  colorInputs.forEach((input) => {
    input.value = color;
  });

  document.body.style.setProperty('--foreground-color', color);
});
colorForm.addEventListener('submit', (event) => {
  event.preventDefault();
});
colorForm.addEventListener('reset', () => {
  document.body.style.removeProperty('--foreground-color');
});

if (window.EyeDropper) {
  /** @type {HTMLButtonElement} */
  const eyeDropperButton = document.querySelector(`button[name="eyedropper"]`);
  eyeDropperButton.hidden = false;
  const eyeDropper = new window.EyeDropper();

  eyeDropperButton.addEventListener('click', () => {
    eyeDropperButton.style.fill = '#0a214d';
    eyeDropper
      .open()
      .then((result) => {
        colorInputs[0].value = result.sRGBHex;
        colorInputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      })
      .finally(() => {
        eyeDropperButton.style.fill = 'currentColor';
      });
  });
}
