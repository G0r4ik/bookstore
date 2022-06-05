export function cartFocusTrap(e) {
  if (e.keyCode !== 9) return;
  const focusable = document
    .querySelector('.cart')
    .querySelectorAll('input,button,select,textarea,svg');
  let last = focusable[focusable.length - 1];
  if (last.getAttribute('disabled') == '') {
    last = focusable[focusable.length - 2];
  }
  if (e.target === focusable[0] && e.shiftKey) {
    last.focus();
    e.preventDefault();
  } else if (e.target === last && !e.shiftKey) {
    focusable[0].focus();
    e.preventDefault();
  }
}
