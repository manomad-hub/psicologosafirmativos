/* Buscador y filtros de la landing de ciudad. Vanilla; la página se lee entera sin esto. */
(function(){
  var d=document;
  d.documentElement.classList.remove('pg-sin-js');
  // Estado vacío de demostración (?estado=vacio). En producción lo decide build.py.
  if(new URLSearchParams(location.search).get('estado')==='vacio'){
    d.querySelectorAll('[data-estado="con-resultados"]').forEach(function(n){n.hidden=true});
    d.querySelectorAll('[data-estado="vacio"]').forEach(function(n){n.hidden=false});
  }
  // Orden aleatorio
  d.querySelectorAll('[data-orden-aleatorio]').forEach(function(l){
    var it=[].slice.call(l.children);
    for(var i=it.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=it[i];it[i]=it[j];it[j]=t}
    it.forEach(function(n){l.appendChild(n)});
  });
  var form=d.getElementById('pg-buscador');if(!form)return;
  var chips=form.querySelectorAll('.pg-chip');
  function activos(g){return [].slice.call(form.querySelectorAll('[data-grupo="'+g+'"] .pg-chip[aria-pressed="true"]')).map(function(c){return c.value})}
  function filtrar(){
    var f={temas:activos('tema'),modalidad:activos('modalidad'),idiomas:activos('idioma')};
    var lista=[].filter.call(d.querySelectorAll('[data-orden-aleatorio]'),function(l){return !l.closest('[hidden]')})[0];
    if(!lista)return;
    var n=0;
    [].forEach.call(lista.children,function(c){
      var ok=Object.keys(f).every(function(k){var v=(c.dataset[k]||'').split(' ');return !f[k].length||f[k].some(function(x){return v.indexOf(x)>-1})});
      c.hidden=!ok;if(ok)n++;
    });
    var r=d.getElementById('pg-recuento');if(r)r.textContent=n===1?'1 profesional':n+' profesionales';
    var s=d.getElementById('pg-sin-resultados');if(s)s.hidden=n>0;
  }
  chips.forEach(function(c){c.addEventListener('click',function(){c.setAttribute('aria-pressed',c.getAttribute('aria-pressed')==='true'?'false':'true');filtrar()})});
  form.addEventListener('submit',function(e){
    e.preventDefault();var p=new URLSearchParams(new FormData(form));
    ['tema','modalidad','idioma'].forEach(function(g){activos(g).forEach(function(v){p.append(g,v)})});
    location.href=form.action+'?'+p.toString();
  });
  filtrar();
})();
