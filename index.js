document.addEventListener("DOMContentLoaded", async () => {
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
    card.addEventListener("click", async () => {
      const unidad = parseInt(card.getAttribute("data-unidad"));

      // Si se vuelve a hacer clic en la misma, se cierra
      if (unidadAbierta === unidad) {
        semanasContainer.innerHTML = "";
        unidadAbierta = null;
        return;
      }

      unidadAbierta = unidad;

      // ---- Traer PDFs desde Supabase según la unidad ----
      const { data: trabajos, error } = await supabase
        .from("trabajos")
        .select("*")
        .eq("unidad", unidad)
        .order("semana", { ascending: true });

      if (error) {
        console.error("Error cargando PDFs:", error);
        semanasContainer.innerHTML = "<p>Error cargando PDFs</p>";
        return;
      }

      // Agrupar PDFs por semana
      const semanas = [1, 2, 3, 4].map(s => {
        const pdfsSemana = trabajos.filter(t => t.semana === s);

        const pdfsHTML = pdfsSemana.length
          ? pdfsSemana
              .map(
                pdf => `
            <div class="pdf-item">
              <strong>${pdf.nombre_pdf}</strong>
              <p>${pdf.comentario || ""}</p>
              <div class="btn-group">
                <button class="btn-ver" onclick="window.open('${pdf.url_pdf}', '_blank')">Ver PDF</button>
                <button class="btn-descargar" onclick="window.location.href='${pdf.url_pdf}'">Descargar</button>
              </div>
            </div>
          `
              )
              .join("")
          : "<p>No hay PDFs disponibles</p>";

        return `
          <div class="semana-card">
            <h4>Semana ${s}</h4>
            ${pdfsHTML}
          </div>
        `;
      });

      // Renderizar todo en el contenedor
      semanasContainer.innerHTML = `
        <h3>Unidad ${unidad} - Semanas</h3>
        <div class="semanas-grid">
          ${semanas.join("")}
        </div>
      `;
    });
  });
});
