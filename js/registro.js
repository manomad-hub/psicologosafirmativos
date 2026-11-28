/* Alta de psicólogos (fase 1, 05/11/2026). La clave de abajo es la PÚBLICA (anon) de Supabase: solo puede llamar a las funciones del registro; las tablas no se leen desde aquí. */
(function () {
  var U = 'https://flbgknuxxoylppijukpj.supabase.co', K = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZsYmdrbnV4eG95bHBwaWp1a3BqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI2NjI5OTksImV4cCI6MjEwODIzODk5OX0.4Q98kJ8eBOhHJRAbIZ1sXAEBXk6eeVg2Gff_h-pGivk';
  var f = document.getElementById('rg-form'), msg = document.getElementById('rg-msg'), btn = document.getElementById('rg-enviar');
  if (!f) return;
  function h(extra) { var o = { apikey: K, Authorization: 'Bearer ' + K }; for (var k in extra) o[k] = extra[k]; return o; }
  function rpc(nombre, cuerpo) {
    return fetch(U + '/rest/v1/rpc/' + nombre, { method: 'POST', headers: h({ 'Content-Type': 'application/json' }), body: JSON.stringify(cuerpo) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok) throw new Error(j.message || 'error'); return j; }); });
  }
  function sube(id, tipo, file) {
    var ext = (file.name.split('.').pop() || 'pdf').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 4);
    var ruta = id + '/' + tipo + '-' + Date.now() + '.' + ext;
    return fetch(U + '/storage/v1/object/documentos/' + ruta, { method: 'POST', headers: h({ 'Content-Type': file.type || 'application/octet-stream' }), body: file })
      .then(function (r) { if (!r.ok) throw new Error('No se pudo subir el archivo «' + file.name + '» (PDF, JPG o PNG de hasta 5 MB).'); return ruta; });
  }
  function aviso(t, ok) { msg.textContent = t; msg.className = ok ? 'rg-ok' : 'rg-mal'; msg.hidden = false; msg.scrollIntoView({ block: 'center' }); }
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = new FormData(f), fc = d.get('colegiacion'), fk = d.get('curso');
    if (!fc || !fc.size || !fk || !fk.size) return aviso('Sube los dos documentos: el certificado de colegiación y el del curso.', false);
    if (fc.size > 5242880 || fk.size > 5242880) return aviso('Cada archivo puede pesar como máximo 5 MB.', false);
    var correos = String(d.get('correos') || '').split(/[\s,;]+/).filter(Boolean).slice(0, 5);
    btn.disabled = true; btn.textContent = 'Enviando…'; msg.hidden = true;
    var id;
    rpc('registrar_psicologo', { p_nombre: d.get('nombre'), p_email: d.get('email'), p_ciudad: d.get('ciudad'), p_num_colegiado: d.get('num'), p_colegio: d.get('colegio'), p_es_pgs: d.get('pgs') === 'on', p_google_url: d.get('google') || null })
      .then(function (r) { id = r; return sube(id, 'colegiacion', fc); })
      .then(function (ruta) { return rpc('registrar_documento', { p_psicologo: id, p_tipo: 'colegiacion', p_ruta: ruta }); })
      .then(function () { return sube(id, 'curso', fk); })
      .then(function (ruta) { return rpc('registrar_documento', { p_psicologo: id, p_tipo: 'curso', p_ruta: ruta, p_horas: parseInt(d.get('horas'), 10) || null, p_entidad: d.get('entidad') }); })
      .then(function () { return correos.length ? rpc('registrar_invitaciones', { p_psicologo: id, p_emails: correos }) : 0; })
      .then(function () { f.reset(); f.hidden = true; aviso('Recibido. Revisaremos tus documentos y te escribiremos al correo que nos has dado. Gracias por querer estar en la red.', true); })
      .catch(function (err) {
        btn.disabled = false; btn.textContent = 'Enviar mi solicitud';
        aviso(/duplicate|unique|psicologos_email/.test(err.message) ? 'Ese correo ya está registrado.' : err.message.indexOf('No se pudo') === 0 ? err.message : 'No hemos podido enviar la solicitud. Revisa los datos e inténtalo de nuevo.', false);
      });
  });
})();
