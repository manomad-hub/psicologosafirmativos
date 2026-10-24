/* Contacto de la ficha: el teléfono y el correo no están en el HTML a la vista; se muestran al pulsar.
   Cuenta solo totales anónimos (PA-11): evento + ficha + día. Sin cookies, sin IP guardada, sin texto de búsqueda.
   Si la página no trae <meta name="pa-contador">, no se envía nada. */
(function(){
  var d=document, m=d.querySelector('meta[name="pa-contador"]');
  var url=m&&m.content, clave=m&&m.dataset.clave;
  window.paContar=function(evento,ficha){
    if(!url)return;
    try{fetch(url,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json',apikey:clave,Authorization:'Bearer '+clave},
      body:JSON.stringify({p_evento:evento,p_ficha:ficha||''})})}catch(e){}
  };
  paContar('visita');
  var ficha=d.querySelector('article[data-ficha]');
  if(ficha)paContar('ficha',ficha.dataset.ficha);
  d.addEventListener('click',function(e){
    var b=e.target.closest('[data-revelar]');
    if(b){
      // El dato va al revés en base64: no lo lee un robot que solo busca «@» o «+34» en el HTML.
      var v=decodeURIComponent(escape(atob(b.dataset.v))).split('').reverse().join('');
      var a=d.createElement('a');a.className=b.className;a.textContent=v;
      a.href=(b.dataset.revelar==='correo'?'mailto:':'tel:')+v.replace(/\s/g,'');
      b.replaceWith(a);a.focus();
      paContar(b.dataset.revelar,ficha&&ficha.dataset.ficha);
      return;
    }
    var c=e.target.closest('[data-contar]');
    if(c)paContar(c.dataset.contar,ficha&&ficha.dataset.ficha);
  });
})();
