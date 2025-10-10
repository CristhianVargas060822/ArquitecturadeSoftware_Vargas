// auth.js - controla acceso, login y cierre de sesión
document.addEventListener("DOMContentLoaded", async () => {
  const supabaseClient = window.supabase;

  if (!supabaseClient) {
    console.error("❌ Supabase no está inicializado.");
    return;
  }

  // Verificar sesión activa
  const { data, error } = await supabaseClient.auth.getSession();
  const session = data.session;

  // Redirecciones según el estado
  if (!session && window.location.pathname.endsWith("admin.html")) {
    window.location.href = "login.html";
  }
  if (session && window.location.pathname.endsWith("login.html")) {
    window.location.href = "admin.html";
  }

  // Botón de cerrar sesión
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      await supabaseClient.auth.signOut();
      window.location.href = "login.html";
    });
  }

  // --- LOGIN REAL ---
  const loginBtn = document.getElementById("login-btn");
  if (loginBtn && window.location.pathname.endsWith("login.html")) {
    loginBtn.addEventListener("click", async () => {
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value.trim();

      if (!email || !password) {
        alert("Por favor ingresa tu correo y contraseña.");
        return;
      }

      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("Error: " + error.message);
      } else {
        console.log("✅ Sesión iniciada correctamente:", data);
        window.location.href = "admin.html";
      }
    });
  }
});
