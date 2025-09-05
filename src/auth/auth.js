import { API_BASE } from '../config.js';

export function initAuth() {
  const form = document.createElement('form');
  form.className = 'm-2';
  form.innerHTML = '<input id="user" placeholder="User" class="border mr-2"/> <input id="pass" type="password" placeholder="Passwort" class="border mr-2"/> <button class="border px-2">Login</button>';
  form.onsubmit = async e => {
    e.preventDefault();
    const username = document.getElementById('user').value;
    const password = document.getElementById('pass').value;
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    }).then(r => r.json()).catch(() => null);
    if (res && res.token) {
      localStorage.setItem('token', res.token);
      alert('Logged in');
    } else {
      alert('Login fehlgeschlagen');
    }
  };
  document.body.prepend(form);
}
