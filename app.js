document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('btn-eliminar')) {
    const id = event.target.getAttribute('data-id');

    // Confirmación antes de eliminar
    if (!confirm('¿Estás seguro de eliminar este trabajo? Esta acción no se puede deshacer.')) {
      return;
    }

    // 1. Buscar el trabajo para obtener la URL del PDF
    const { data: trabajo, error: fetchError } = await supabase
      .from('trabajos')
      .select('url_pdf')
      .eq('id', id)
      .single();

    if (fetchError) {
      console.error('Error buscando trabajo:', fetchError.message);
      return;
    }

    // 2. Obtener ruta real del PDF desde la URL pública
    const fullUrl = trabajo.url_pdf;
    const urlPart = fullUrl.split('/storage/v1/object/public/pdfs/')[1];

    // 3. Borrar archivo del Storage
    const { error: storageError } = await supabase.storage
      .from('pdfs')
      .remove([urlPart]);

    if (storageError) {
      console.error('Error eliminando archivo del storage:', storageError.message);
      alert('No se pudo eliminar el archivo del storage.');
      return;
    }

    // 4. Borrar fila de la base de datos
    const { error: deleteError } = await supabase
      .from('trabajos')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error eliminando fila de la base de datos:', deleteError.message);
      alert('No se pudo eliminar el registro en la base de datos.');
    } else {
      alert('Trabajo eliminado correctamente ✅');
      location.reload(); // Recargar para actualizar lista
    }
  }
});
