document.addEventListener("DOMContentLoaded", () => {
  const loginBtn = document.getElementById("login-btn");
  const semanasContainer = document.getElementById("semanas-container");

  // ---- LOGIN ----
  loginBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  // ---- TARJETAS ----
  const cards = document.querySelectorAll(".card");
  let unidadAbierta = null;

  cards.forEach(card => {
    card.addEventListener("click", () => {
      const unidad = card.getAttribute("data-unidad");

      // Si se vuelve a hacer clic en la misma, se cierra
      if (unidadAbierta === unidad) {
        semanasContainer.innerHTML = "";
        unidadAbierta = null;
        return;
      }

      // Mostrar nuevas semanas
      unidadAbierta = unidad;
      semanasContainer.innerHTML = `
        <h3>Unidad ${unidad} - Semanas</h3>
        <div class="semanas-grid">
          ${[1, 2, 3, 4]
            .map(
              s => `
            <div class="semana-card">
              <h4>Semana ${s}</h4>
              <div class="btn-group">
                <button class="btn-ver">Ver PDF</button>
                <button class="btn-descargar">Descargar</button>
              </div>
            </div>
          `
            )
            .join("")}
        </div>
      `;
    });
  });
});
