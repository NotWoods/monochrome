// @ts-check

/** @type {Map<string, HTMLInputElement>} */
const accessKeys = new Map();
/** @type {NodeListOf<HTMLInputElement>} */
const focusable = document.querySelectorAll('input[accesskey]');
focusable.forEach((input) => {
  accessKeys.set(input.accessKey, input);
});

document.addEventListener('keydown', (evt) => {
  if (evt.repeat) return; // Ignore holding down keys
  if (evt.target instanceof HTMLInputElement && evt.target.type === 'text') {
    // Ignore typing in text fields
    return;
  }

  const input = accessKeys.get(evt.key);

  if (input) {
    evt.preventDefault();
    input.click();
  }
});
