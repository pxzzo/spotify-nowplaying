export function initTheme() {
  const body = document.body;
  const stored = localStorage.getItem('theme') || 'dark';
  body.classList.add(stored);
  const btn = document.createElement('button');
  btn.textContent = 'Theme';
  btn.className = 'p-2 border m-2';
  btn.onclick = () => {
    const next = body.classList.contains('dark') ? 'light' : 'dark';
    body.classList.remove('dark', 'light');
    body.classList.add(next);
    localStorage.setItem('theme', next);
  };
  document.body.prepend(btn);
}
