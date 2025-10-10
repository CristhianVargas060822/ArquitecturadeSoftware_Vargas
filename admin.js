// Espera que el DOM esté listo
document.addEventListener("DOMContentLoaded", async () => {
  const supabaseClient = window.supabase;

  // --- Verificar sesión ---
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    console.error("Error verificando sesión:", error);
    alert("Error verificando sesión. Intenta nuevamente.");
    window.location.href = "login.html";
    return;
  }

  if (!data.session) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "index.html";
    return;
  }

  console.log("Sesión activa:", data.session.user.email);

  // --- Cerrar sesión ---
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const { error } = await supabaseClient.auth.signOut();
        if (error) throw error;
        alert("Sesión cerrada correctamente 👋");
        window.location.href = "index.html";
      } catch (err) {
        console.error("Error cerrando sesión:", err);
        alert("No se pudo cerrar sesión.");
      }
    });
  }

  // --- Subir PDF ---
  const uploadForm = document.getElementById("upload-form");
  const pdfList = document.getElementById("pdf-list");

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre_pdf = document.getElementById("nombre_pdf").value;
    const comentario = document.getElementById("comentario").value;
    const unidad = parseInt(document.getElementById("unidad").value);
    const semana = parseInt(document.getElementById("semana").value);
    const file = document.getElementById("pdf_file").files[0];
    if (!file) return alert("Selecciona un archivo PDF");

    const filePath = `${Date.now()}_${file.name}`;

    // Subir al bucket "pdfs"
    const { data: uploadData, error: uploadError } = await supabaseClient.storage
      .from('pdfs')
      .upload(filePath, file);
    if (uploadError) return alert("Error al subir archivo: " + uploadError.message);

    const url_pdf = supabaseClient.storage.from('pdfs').getPublicUrl(filePath).data.publicUrl;

    // Insertar en tabla correcta: trabajos
    const { error: dbError } = await supabaseClient.from('trabajos').insert([{
      nombre_pdf,
      comentario,
      unidad,
      semana,
      url_pdf
    }]);
    if (dbError) return alert("Error al guardar en DB: " + dbError.message);

    alert("PDF subido correctamente");
    uploadForm.reset();
    listarPDFs();
  });

  // --- Listar PDFs ---
  async function listarPDFs() {
    const { data, error } = await supabaseClient.from('trabajos').select('*').order('created_at', { ascending: false });
    if (error) return console.error(error);

    pdfList.innerHTML = data.map(pdf => `
      <div class="semana-card">
        <h4>${pdf.nombre_pdf} (Unidad ${pdf.unidad} - Semana ${pdf.semana})</h4>
        <p>${pdf.comentario || ''}</p>
        <div class="btn-group">
          <button class="btn-ver" onclick="window.open('${pdf.url_pdf}', '_blank')">Ver</button>
          <button class="btn-descargar" onclick="window.location.href='${pdf.url_pdf}'">Descargar</button>
          <button class="btn-edit" data-id="${pdf.id}">Editar</button>
          <button class="btn-delete" data-id="${pdf.id}" data-path="${pdf.url_pdf}">Eliminar</button>
        </div>
      </div>
    `).join('');

    // --- Editar PDF ---
    document.querySelectorAll(".btn-edit").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const nuevoNombre = prompt("Nuevo nombre del PDF:");
        const nuevoComentario = prompt("Nuevo comentario:");
        if (!nuevoNombre) return;

        const { error } = await supabaseClient.from('trabajos').update({
          nombre_pdf: nuevoNombre,
          comentario: nuevoComentario
        }).eq('id', id);
        if (error) return alert("Error al actualizar: " + error.message);

        listarPDFs();
      });
    });

    // --- Eliminar PDF ---
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        const path = btn.dataset.path.split('/').pop();
        if (!confirm("¿Eliminar este PDF?")) return;

        const { error: delFileErr } = await supabaseClient.storage.from('pdfs').remove([path]);
        if (delFileErr) return alert("Error al eliminar archivo: " + delFileErr.message);

        const { error: delDbErr } = await supabaseClient.from('trabajos').delete().eq('id', id);
        if (delDbErr) return alert("Error al eliminar de DB: " + delDbErr.message);

        listarPDFs();
      });
    });
  }

  // --- Inicializar lista ---
  listarPDFs();
});
