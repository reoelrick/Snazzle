(function () {
  var PRODUCTS = [
    { id:'breeze-slip', cat:'Day', name:'Breeze Slip', price:3200, tone:'#131311',
      desc:'A bias-cut midi that follows you through the afternoon. Light, fluid and easy to layer.',
      d:'M82 14 L88 14 L92 56 Q100 66 108 56 L112 14 L118 14 L116 70 L128 240 Q100 250 72 240 L84 70 Z', k:'M86 96 Q100 104 114 96' },
    { id:'midnight-gown', cat:'Evening', name:'Midnight Gown', price:8900, tone:'#181816',
      desc:'A fitted bodice and a skirt that opens like a sail. Made for long rooms and late light.',
      d:'M84 16 L90 16 L96 50 Q100 54 104 50 L110 16 L116 16 L114 80 Q150 150 176 244 Q100 258 24 244 Q50 150 86 80 Z', k:'M92 78 Q100 84 108 78' },
    { id:'gust-wrap', cat:'Day', name:'Gust Wrap', price:4600, tone:'#151513',
      desc:'A soft wrap dress with a tied waist and relaxed sleeves. Easy to wear from morning to night.',
      d:'M70 22 L94 14 Q100 30 106 14 L130 22 L150 70 L132 78 L126 60 L130 236 Q100 244 70 236 L74 60 L68 78 L50 70 Z', k:'M72 112 L128 108' },
    { id:'spark-mini', cat:'Festive', name:'Spark Mini', price:3900, tone:'#191917',
      desc:'A short babydoll cut for lights, music and a late night. Light enough to dance in.',
      d:'M80 14 L88 14 L94 44 Q100 48 106 44 L112 14 L120 14 L118 54 Q148 90 156 150 Q100 162 44 150 Q52 90 82 54 Z', k:'M74 74 Q100 82 126 74' },
    { id:'column-noir', cat:'Evening', name:'Column Noir', price:7400, tone:'#121210',
      desc:'A long, clean column with a high neckline and a quiet drape. Nothing extra, nothing missing.',
      d:'M76 16 L124 16 L130 60 L122 100 L132 250 Q100 258 68 250 L78 100 L70 60 Z', k:'M76 118 Q100 126 124 118' },
    { id:'tier-swing', cat:'Festive', name:'Tier Swing', price:5800, tone:'#171715',
      desc:'Three tiers of movement that swing with every step. Made for celebrations.',
      d:'M82 14 L90 14 L96 46 Q100 50 104 46 L110 14 L118 14 L116 70 L134 110 L146 170 L162 244 Q100 256 38 244 L54 170 L66 110 L84 70 Z', k:'M70 102 Q100 112 130 102' }
  ];
  var SIZES = ['XS','S','M','L','XL'];
  var CATS = ['All','Day','Evening','Festive'];
  var state = { cat:'All', sort:'featured', cart:[] };

  try { var saved = JSON.parse(localStorage.getItem('snazzle-bag') || '[]'); if (Array.isArray(saved)) state.cart = saved; } catch (e) {}
  function persist(){ try { localStorage.setItem('snazzle-bag', JSON.stringify(state.cart)); } catch (e) {} }
  function money(n){ return 'BDT ' + n.toLocaleString('en-US'); }
  function byId(id){ return PRODUCTS.filter(function(p){ return p.id === id; })[0]; }
  function art(p, fill){ return '<svg viewBox="0 0 200 270" aria-hidden="true"><path d="'+p.d+'" fill="'+(fill||'#eeeae2')+'"></path><path d="'+p.k+'" fill="none" stroke="'+p.tone+'" stroke-width="3.5" stroke-linecap="round"></path></svg>'; }
  var $ = function(id){ return document.getElementById(id); };

  /* shop */
  function renderTabs(){
    $('tabs').innerHTML = CATS.map(function(c){
      return '<button class="tab" type="button" data-cat="'+c+'" aria-pressed="'+(state.cat===c)+'">'+c+'</button>';
    }).join('');
  }
  function renderGrid(){
    var list = PRODUCTS.filter(function(p){ return state.cat==='All' || p.cat===state.cat; });
    if (state.sort==='low') list = list.slice().sort(function(a,b){ return a.price-b.price; });
    if (state.sort==='high') list = list.slice().sort(function(a,b){ return b.price-a.price; });
    $('count').textContent = list.length;
    $('grid').innerHTML = list.map(function(p){
      return '<button class="card" type="button" data-id="'+p.id+'" aria-label="View '+p.name+'">' +
        '<div class="plate" style="background:'+p.tone+'">'+art(p)+'<span class="tag">'+p.cat+'</span><span class="view">Quick view</span></div>' +
        '<div class="meta"><h3>'+p.name+'</h3><span class="price">'+money(p.price)+'</span></div></button>';
    }).join('');
  }
  $('tabs').addEventListener('click', function(e){
    var b = e.target.closest('[data-cat]'); if (!b) return;
    state.cat = b.getAttribute('data-cat'); renderTabs(); renderGrid();
  });
  $('sort').addEventListener('change', function(e){ state.sort = e.target.value; renderGrid(); });

  /* lookbook */
  $('look').innerHTML = [['Look 01','night-gown'],['Look 02','column'],['Look 03','tier']].map(function(x,i){
    var p = [PRODUCTS[1], PRODUCTS[4], PRODUCTS[5]][i];
    return '<figure><div class="plate" style="background:'+p.tone+'">'+art(p)+'</div><figcaption>'+x[0]+' &middot; Photo goes here</figcaption></figure>';
  }).join('');

  /* quick view */
  var qv = $('qv'), current = null, lastFocus = null;
  function openQV(id){
    current = byId(id); if (!current) return;
    lastFocus = document.activeElement;
    $('qvImg').style.background = current.tone; $('qvImg').innerHTML = art(current);
    $('qvCat').textContent = current.cat; $('qvName').textContent = current.name;
    $('qvPrice').textContent = money(current.price); $('qvDesc').textContent = current.desc;
    $('qvSizes').innerHTML = SIZES.map(function(s){
      return '<span><input type="radio" name="size" id="sz-'+s+'" value="'+s+'"'+(s==='M'?' checked':'')+'><label for="sz-'+s+'">'+s+'</label></span>';
    }).join('');
    if (qv.showModal) qv.showModal(); else qv.setAttribute('open','');
  }
  function closeQV(){ if (qv.close) qv.close(); else qv.removeAttribute('open'); if (lastFocus) lastFocus.focus(); }
  $('grid').addEventListener('click', function(e){ var c = e.target.closest('[data-id]'); if (c) openQV(c.getAttribute('data-id')); });
  $('qvClose').addEventListener('click', closeQV);
  qv.addEventListener('click', function(e){ if (e.target === qv) closeQV(); });
  $('qvAdd').addEventListener('click', function(){
    var size = (document.querySelector('input[name="size"]:checked') || {}).value || 'M';
    addToCart(current.id, size);
    if (qv.close) qv.close(); else qv.removeAttribute('open');
    openDrawer();
  });

  /* cart */
  function addToCart(id, size){
    var hit = state.cart.filter(function(l){ return l.id===id && l.size===size; })[0];
    if (hit) hit.qty += 1; else state.cart.push({ id:id, size:size, qty:1 });
    persist(); renderCart();
  }
  function renderCart(){
    var n = state.cart.reduce(function(a,l){ return a + l.qty; }, 0);
    var total = state.cart.reduce(function(a,l){ return a + byId(l.id).price * l.qty; }, 0);
    $('bagCount').textContent = '(' + n + ')';
    $('sub').textContent = money(total);
    $('coNote').textContent = 'Demo only. Payment is not connected.';
    $('checkout').disabled = n === 0;
    $('checkout').style.opacity = n === 0 ? '.4' : '1';
    $('drBody').innerHTML = n === 0
      ? '<div class="empty">Your bag is empty.</div>'
      : state.cart.map(function(l, i){
          var p = byId(l.id);
          return '<div class="line"><div class="th" style="background:'+p.tone+'">'+art(p)+'</div>' +
            '<div><h4>'+p.name+'</h4><div class="m">Size '+l.size+'</div>' +
            '<div class="qty"><button type="button" data-q="-1" data-i="'+i+'" aria-label="Decrease quantity">&minus;</button><span>'+l.qty+'</span><button type="button" data-q="1" data-i="'+i+'" aria-label="Increase quantity">+</button></div></div>' +
            '<div><div class="p">'+money(p.price*l.qty)+'</div><button class="rm" type="button" data-rm="'+i+'">Remove</button></div></div>';
        }).join('');
  }
  $('drBody').addEventListener('click', function(e){
    var q = e.target.closest('[data-q]'), r = e.target.closest('[data-rm]');
    if (q){ var l = state.cart[+q.getAttribute('data-i')]; l.qty += +q.getAttribute('data-q'); if (l.qty < 1) state.cart.splice(+q.getAttribute('data-i'),1); }
    else if (r){ state.cart.splice(+r.getAttribute('data-rm'),1); }
    else return;
    persist(); renderCart();
  });
  function openDrawer(){ $('drawer').classList.add('on'); $('scrim').classList.add('on'); $('drawer').setAttribute('aria-hidden','false'); $('drClose').focus(); }
  function closeDrawer(){ $('drawer').classList.remove('on'); $('scrim').classList.remove('on'); $('drawer').setAttribute('aria-hidden','true'); }
  $('bagBtn').addEventListener('click', openDrawer);
  $('drClose').addEventListener('click', closeDrawer);
  $('scrim').addEventListener('click', closeDrawer);
  $('checkout').addEventListener('click', function(){ $('coNote').textContent = 'This is a demo. Connect a payment provider to take real orders.'; });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') closeDrawer(); });

  /* nav + form */
  $('menuBtn').addEventListener('click', function(){
    var open = $('mobileNav').classList.toggle('open'); this.setAttribute('aria-expanded', open);
  });
  $('mobileNav').addEventListener('click', function(e){ if (e.target.tagName === 'A') { $('mobileNav').classList.remove('open'); $('menuBtn').setAttribute('aria-expanded','false'); } });
  $('signup').addEventListener('submit', function(e){
    e.preventDefault();
    if (!$('email').value || $('email').value.indexOf('@') < 1) { $('email').focus(); return; }
    $('signup').hidden = true; $('ok').hidden = false;
  });

  renderTabs(); renderGrid(); renderCart();
})();
