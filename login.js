document.getElementById('login-btn').addEventListener('click', async () => {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const msg = document.getElementById('login-msg');

  msg.textContent = '';

  if (!email || !password) {
    msg.textContent = 'Completa todos los campos';
    return;
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      msg.textContent = 'Error: ' + error.message;
    } else {
      // Redirigir al admin
      window.location.href = 'admin.html';
    }
  } catch (err) {
    msg.textContent = 'Error inesperado: ' + err.message;
  }
});
