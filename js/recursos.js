/* Filtros de /recursos/. Sin JS se ven las 78 fichas y los filtros se esconden. */
(function(){
  var f=document.getElementById('rc-filtros');if(!f)return;
  f.hidden=false;
  var rs=[].slice.call(document.querySelectorAll('.r')),n=document.getElementById('rc-n');
  function filtra(){
    var v={},k=0;new FormData(f).forEach(function(x,c){v[c]=x});
    rs.forEach(function(r){
      var ok=Object.keys(v).every(function(c){var x=v[c];return !x||(r.dataset[c]||'').split(' ').indexOf(x)>-1||(c==='ccaa'&&r.dataset.ccaa==='ES')});
      r.hidden=!ok;if(ok)k++;
    });
    n.textContent=k===1?'1 recurso':k+' recursos';
  }
  f.addEventListener('change',filtra);filtra();
})();
