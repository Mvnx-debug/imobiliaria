document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;
      const email = document.getElementById('email').value;
      const phone = document.getElementById('phone').value;
      const password = document.getElementById('password').value;
      const messageDiv = document.getElementById('message');

      try {
        const response = await fetch('/api/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.innerText = 'Usuário cadastrado com sucesso!';
          registerForm.reset();
        } else {
          messageDiv.innerText = data.error || 'Erro ao cadastrar.';
        }
      } catch (err) {
        messageDiv.innerText = 'Erro ao conectar ao servidor.';
      }
    });
  }
});
document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await fetch('/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
          // Salva o token no localStorage
          localStorage.setItem('token', data.token);
          // Redireciona para o dashboard
          window.location.href = 'dashboard.html';
        } else {
          alert(data.error || 'Erro ao fazer login');
        }
      } catch (err) {
        alert('Erro ao conectar ao servidor.');
      }
    });
  }
});
