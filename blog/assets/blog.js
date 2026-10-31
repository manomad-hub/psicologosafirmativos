(function () {
  var q = document.getElementById('blog-q');
  if (!q) return;
  var chips = [].slice.call(document.querySelectorAll('.chip'));
  var cards = [].slice.call(document.querySelectorAll('.grid .card-li'));
  var featured = document.getElementById('destacado');
  var heading = document.getElementById('h-art');
  var empty = document.querySelector('.empty');
  var emptyT = document.querySelector('.empty__t');
  var status = document.querySelector('.status');
  var clear = document.querySelector('.search__clear');
  var topic = '';
  var norm = function (s) { return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase(); };
  cards.forEach(function (c) { c._text = norm(c.dataset.title + ' ' + c.dataset.summary + ' ' + c.dataset.topic); });

  function update() {
    var raw = q.value.trim(), term = norm(raw), filtering = !!term || !!topic, n = 0;
    cards.forEach(function (c) {
      var ok = (!topic || c.dataset.topic === topic) && (!term || c._text.indexOf(term) > -1);
      if (!filtering && c.hasAttribute('data-featured')) ok = false;
      c.hidden = !ok;
      if (ok) n++;
    });
    featured.hidden = filtering;
    clear.hidden = !raw;
    heading.textContent = filtering ? 'Resultados' : heading.dataset.default;
    empty.hidden = n > 0;
    if (!n) emptyT.textContent = term
      ? 'No hemos encontrado artículos con «' + raw + '»' + (topic ? ' en ' + topic : '') + '.'
      : 'Todavía no hay artículos sobre ' + topic + '.';
    status.textContent = filtering && n
      ? n + (n === 1 ? ' artículo' : ' artículos') + (topic ? ' sobre ' + topic : '') + (term ? ' con «' + raw + '»' : '')
      : '';
  }

  chips.forEach(function (b) {
    b.addEventListener('click', function () {
      topic = b.dataset.topic;
      chips.forEach(function (o) { o.setAttribute('aria-pressed', String(o === b)); });
      update();
    });
  });
  q.form.addEventListener('submit', function (e) { e.preventDefault(); });
  q.addEventListener('input', update);
  q.addEventListener('keydown', function (e) { if (e.key === 'Escape') { q.value = ''; update(); } });
  clear.addEventListener('click', function () { q.value = ''; update(); q.focus(); });
  document.querySelector('[data-reset]').addEventListener('click', function () {
    q.value = ''; topic = '';
    chips.forEach(function (o, i) { o.setAttribute('aria-pressed', String(i === 0)); });
    update();
  });
})();
