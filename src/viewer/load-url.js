/** @type {HTMLDialogElement} */
const urlDialog = document.querySelector('.url-dialog');
function setupContent() {
  const selectedUrl = new URL(location.href).searchParams.get('demo');

  if (selectedUrl) {
    /** @type {HTMLInputElement} */
    const input = urlDialog.querySelector('#url');
    input.value = new URL(selectedUrl, location.href).href;
  }
}

for (const element of document.querySelectorAll(
  'button[aria-controls="urlModal"]'
)) {
  element.addEventListener('click', () => {
    if (urlDialog.open) {
      urlDialog.close();
    } else {
      setupContent();
      urlDialog.showModal();
    }
  });
}
