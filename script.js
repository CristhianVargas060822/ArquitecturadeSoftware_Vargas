// Selección de elementos
const semanas = document.querySelectorAll(".semana");
const modal = document.getElementById("modal");
const visor = document.getElementById("visor");
const btnVer = document.getElementById("btn-ver");
const btnDescargar = document.getElementById("btn-descargar");
const cerrar = document.querySelector(".cerrar");
const extraButtonsContainer = document.getElementById("extra-buttons");

// Función para abrir un archivo en el visor
function abrirArchivo(archivo) {
  visor.src = archivo;
  btnVer.href = archivo;
  btnDescargar.href = archivo;
}

// Abrir modal
semanas.forEach(semana => {
  semana.addEventListener("click", () => {
    const archivosAttr = semana.getAttribute("data-files") || semana.getAttribute("data-file");
    if (!archivosAttr) return;

    const archivos = archivosAttr.split(",").map(a => a.trim());
    abrirArchivo(archivos[0]); // abre el primero por defecto

    // Si hay varios archivos, crear botones
    extraButtonsContainer.innerHTML = "";
    if (archivos.length > 1) {
      archivos.forEach((archivo, i) => {
        const btn = document.createElement("button");
        // Mostrar nombre corto en el botón
        btn.textContent = archivo.split("/").pop();
        btn.addEventListener("click", () => abrirArchivo(archivo));
        extraButtonsContainer.appendChild(btn);
      });
    }

    modal.style.display = "flex";
  });
});

// Cerrar modal
cerrar.addEventListener("click", () => {
  modal.style.display = "none";
  visor.src = "";
  extraButtonsContainer.innerHTML = "";
});

// Cerrar haciendo clic fuera del contenido
window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
    visor.src = "";
    extraButtonsContainer.innerHTML = "";
  }
});


