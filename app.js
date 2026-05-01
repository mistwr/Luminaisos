// ═══════════════════════════════════════════════════════════════
// LUMIN AI · app.js
// Motor: WebLLM (DeepSeek R1 / Gemma 2) — 100% no dispositivo
// ═══════════════════════════════════════════════════════════════

import * as webllm from "https://esm.run/@mlc-ai/web-llm";
import { PROTOS, CRISES, KIT_ITENS } from "./data.js";

// ── MODELOS ─────────────────────────────────────────────────────
const MODELOS = {
  '30': {
    nome: 'LUMIN AI 3.0',
    completo: 'LUMIN AI 3.0 — DeepSeek R1',
    modelId: 'DeepSeek-R1-Distill-Qwen-1.5B-q4f32_1-MLC',
    cor: 'var(--c)', label: 'v3.0', lblClass: 'lbl-30', emoji: '⚡'
  },
  'pro': {
    nome: 'LUMIN AI Pro 10.0',
    completo: 'LUMIN AI Pro 10.0 — Gemma 2',
    modelId: 'gemma-2-2b-it-q4f16_1-MLC',
    cor: 'var(--cp)', label: 'Pro v10.0', lblClass: 'lbl-pro', emoji: '🔮'
  }
};

const SYSTEM_PROMPT = `És o LUMIN AI, assistente de emergência médica em Portugal.
Respondes SEMPRE em português europeu, claro e direto.
Em emergências: passos numerados concisos. Sem markdown, sem asteriscos.
Especialidades: RCP, hemorragia, AVC, enfarte, engasgamento, queimaduras, fraturas, hipotermia, choque, envenenamento.
Lembra sempre: em emergência grave ligar 112.
Máximo 200 palavras por resposta, salvo pedido explícito.
Lembras o contexto da conversa.`;

// ── ESTADO ───────────────────────────────────────────────────────
let engine = null, modeloAtivo = null, pronto = false;
let userLat = null, userLng = null;
let mapObj = null, mapMarker = null;
let voiceRec = null, aEscutar = false;
let historico = [];

const HIST_KEY = 'lumin_hist';
const MODEL_KEY = 'lumin_modelo';

// ── SERVICE WORKER ───────────────────────────────────────────────
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
    .then(r => console.log('SW registado:', r.scope))
    .catch(e => console.warn('SW falhou:', e));
}

// ── ARRANQUE ─────────────────────────────────────────────────────
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.style.opacity = '0';
    splash.style.transition = 'opacity .5s';
    setTimeout(() => {
      splash.style.display = 'none';
      const guardado = localStorage.getItem(MODEL_KEY);
      if (guardado && MODELOS[guardado]) {
        modeloAtivo = guardado;
        mostrarDownload(guardado);
      } else {
        document.getElementById('sel-screen').style.display = 'block';
      }
    }, 520);
  }, 2700);
});

// ── SELEÇÃO ──────────────────────────────────────────────────────
window.selectModel = (ver) => {
  document.querySelectorAll('.model-card').forEach(c => c.classList.remove('sel'));
  document.getElementById('card-' + ver).classList.add('sel');
  modeloAtivo = ver;
  const btn = document.getElementById('btn-avancar');
  btn.classList.add('show');
  btn.textContent = `➤ Instalar ${MODELOS[ver].nome}`;
};

window.iniciarDownload = () => {
  if (!modeloAtivo) return;
  localStorage.setItem(MODEL_KEY, modeloAtivo);
  mostrarDownload(modeloAtivo);
};

function mostrarDownload(ver) {
  document.getElementById('sel-screen').style.display = 'none';
  const dl = document.getElementById('dl-screen');
  dl.style.display = 'flex';
  const m = MODELOS[ver];
  document.getElementById('dl-emoji').textContent = m.emoji;
  document.getElementById('dl-title').textContent = 'A instalar ' + m.nome;
  document.getElementById('dl-model-name').textContent = m.completo;
  carregarModelo(ver);
}

// ── CARREGAR WEBLLM ───────────────────────────────────────────────
async function carregarModelo(ver) {
  const m = MODELOS[ver];
  setFase('dl');
  try {
    engine = await webllm.CreateMLCEngine(m.modelId, {
      initProgressCallback: (prog) => {
        const pct = Math.round((prog.progress || 0) * 100);
        document.getElementById('dl-bar').style.width = pct + '%';
        document.getElementById('dl-pct').textContent = pct + '%';
        let s = (prog.text || 'A processar...')
          .replace('Loading model from cache', 'A carregar da cache...')
          .replace('Finish loading on WebGPU', 'Carregado no GPU!')
          .replace('Start to fetch params', 'A descarregar parâmetros...')
          .replace('Fetching param cache', 'A verificar cache...')
          .replace('Loading GPU shader modules', 'A compilar shaders...')
          .replace('Compiling shaders', 'A compilar GPU...')
          .replace(/\[(\d+)\/(\d+)\]/, 'Fragmento $1 de $2');
        document.getElementById('dl-status').textContent = s;
        if (pct > 55) setFase('load');
      }
    });
    setFase('ready');
    document.getElementById('dl-pct').textContent = '100%';
    document.getElementById('dl-status').textContent = m.nome + ' instalado!';
    pronto = true;
    await new Promise(r => setTimeout(r, 700));
    iniciarApp(ver);
  } catch (err) {
    console.error('WebLLM erro:', err);
    document.getElementById('dl-status').textContent = '⚠️ ' + (err.message || 'Erro. A continuar em modo protocolos.');
    document.getElementById('dl-pct').textContent = '⚠️';
    pronto = false;
    await new Promise(r => setTimeout(r, 2200));
    iniciarApp(ver);
  }
}

function setFase(f) {
  ['ph-dl','ph-load','ph-ready'].forEach(id => document.getElementById(id).className = 'dl-phase');
  const map = { dl:'ph-dl', load:'ph-load', ready:'ph-ready' };
  document.getElementById(map[f]).classList.add('active');
  if (f === 'load') document.getElementById('ph-dl').classList.add('done');
  if (f === 'ready') ['ph-dl','ph-load','ph-ready'].forEach(id => document.getElementById(id).classList.add('done'));
}

// ── INICIAR APP ───────────────────────────────────────────────────
function iniciarApp(ver) {
  document.getElementById('dl-screen').style.display = 'none';
  document.getElementById('app').classList.add('show');
  const m = MODELOS[ver];
  document.getElementById('h-ver').textContent = m.label;
  document.getElementById('h-ver').style.color = m.cor;
  document.getElementById('msg-lbl').textContent = '⬡ ' + m.nome;
  document.getElementById('msg-lbl').className = 'lbl ' + m.lblClass;
  document.getElementById('send').disabled = false;

  if (pronto) {
    setBarIA('ok', '✅ ' + m.nome + ' · On-device · Offline');
  } else {
    setBarIA('err', '⚠️ Modo protocolos offline · WebLLM não disponível');
  }

  // Restaura histórico
  try { historico = JSON.parse(localStorage.getItem(HIST_KEY) || '[]'); } catch { historico = []; }
  historico.slice(-6).forEach(h => addMsg(h.content, h.role === 'user' ? 'u' : 'a'));
  atualizarMem();

  construirMedico();
  construirCrises();
  construirKit();
  iniciarGPS();
}

window.trocarModelo = () => {
  if (!confirm('Trocar de modelo? Terás de reinstalar.')) return;
  localStorage.removeItem(MODEL_KEY);
  location.reload();
};

// ── ENVIAR ────────────────────────────────────────────────────────
window.enviar = async () => {
  const el = document.getElementById('ci');
  const txt = el.value.trim();
  if (!txt || document.getElementById('send').disabled) return;
  el.value = '';
  addMsg(txt, 'u');
  document.getElementById('send').disabled = true;
  setBarIA('think', '🧠 A pensar...');
  historico.push({ role: 'user', content: txt });
  guardarHist();
  atualizarMem();

  const gps = userLat
    ? `[GPS: ${userLat.toFixed(5)}, ${userLng.toFixed(5)}]`
    : '[GPS: indisponível]';

  if (pronto && engine) {
    await responderWebLLM(txt, gps);
  } else {
    responderOffline(txt);
    document.getElementById('send').disabled = false;
  }
};

async function responderWebLLM(txt, gps) {
  const m = MODELOS[modeloAtivo];
  const bubble = addMsg('', 'a', true);
  const msgs = [
    { role: 'system', content: SYSTEM_PROMPT + '\n' + gps },
    ...historico.slice(-10)
  ];
  let resposta = '';
  try {
    const stream = await engine.chat.completions.create({
      messages: msgs, stream: true, temperature: 0.65, max_tokens: 480
    });
    for await (const chunk of stream) {
      const d = chunk.choices[0]?.delta?.content || '';
      resposta += d;
      bubble.innerHTML = `<div class="lbl ${m.lblClass}">⬡ ${m.nome}</div>` +
        resposta.replace(/\n/g, '<br>');
      const cb = document.getElementById('chat-box');
      cb.scrollTop = cb.scrollHeight;
    }
    historico.push({ role: 'assistant', content: resposta });
    guardarHist();
    atualizarMem();
    setBarIA('ok', '✅ ' + m.nome + ' · On-device · Offline');
  } catch (e) {
    console.error(e);
    bubble.remove();
    responderOffline(txt);
  }
  document.getElementById('send').disabled = false;
}

// ── FALLBACK OFFLINE ─────────────────────────────────────────────
const KW = {
  rcp: ['rcp','paragem cardíac','coração parou','não respira','desmaiou','inconsciente','ressuscit'],
  hemor: ['sangue','sangramento','hemorragia','ferida','corte','sangra'],
  queimadura: ['queimad','escaldão','fogo','chama'],
  engasgo: ['engasgad','sufoc','obstrução','engoliu','não consegue respirar'],
  avc: ['avc','derrame','boca torta','face torta','fala arrastada','paralisia'],
  enfarte: ['enfarte','ataque cardíaco','dor no peito'],
  fratura: ['frat','osso partido','torci','luxação'],
  hipotermia: ['hipotermia','congelamento','frio'],
  choque: ['choque','pálido','suado','pressão baixa'],
  veneno: ['veneno','intoxicação','tóxico','engoliu produto'],
};

function responderOffline(txt) {
  const t = txt.toLowerCase();
  let proto = null;
  for (const [id, kws] of Object.entries(KW)) {
    if (kws.some(k => t.includes(k))) { proto = id; break; }
  }
  const m = MODELOS[modeloAtivo];
  let resp;
  if (proto) {
    const p = PROTOS.find(x => x.id === proto);
    resp = p
      ? `${p.icon} <strong>${p.titulo}</strong>\n\n` +
        p.passos.map((s,i) => `${i+1}. <strong>${s.t}</strong>\n${s.d}`).join('\n\n') +
        (p.aviso ? `\n\n⚠️ ${p.aviso}` : '') +
        '\n\n📞 Emergência: <strong>112</strong>'
      : '📞 Liga 112 imediatamente.';
  } else if (t.includes('112') || t.includes('emergência')) {
    resp = '📞 O número de emergência em Portugal é <strong>112</strong>.';
  } else if (userLat) {
    resp = `📍 Localização: <strong>${userLat.toFixed(5)}, ${userLng.toFixed(5)}</strong>\nPartilha com os socorristas.`;
  } else {
    resp = 'Descreve melhor a situação de emergência.\n\n📞 Emergência: <strong>112</strong>';
  }
  addMsg(resp, 'a');
  historico.push({ role: 'assistant', content: resp.replace(/<[^>]+>/g,'') });
  guardarHist();
  atualizarMem();
  setBarIA('err', '⚠️ Modo offline · Protocolos guardados');
}

// ── CHAT ──────────────────────────────────────────────────────────
function addMsg(txt, role, streaming = false) {
  const box = document.getElementById('chat-box');
  const m = MODELOS[modeloAtivo] || MODELOS['30'];
  const div = document.createElement('div');
  div.className = 'msg ' + role;
  if (streaming) {
    div.innerHTML = `<div class="lbl ${m.lblClass}">⬡ ${m.nome}</div>
      <div class="typing"><span></span><span></span><span></span></div>`;
    box.appendChild(div);
    box.scrollTop = box.scrollHeight;
    return div;
  }
  div.innerHTML = role === 'a'
    ? `<div class="lbl ${m.lblClass}">⬡ ${m.nome}</div>` + txt.replace(/\n/g,'<br>')
    : '';
  if (role === 'u') div.textContent = txt;
  box.appendChild(div);
  box.scrollTop = box.scrollHeight;
  return div;
}

function setBarIA(estado, txt) {
  const b = document.getElementById('ai-bar');
  b.className = estado; b.textContent = txt;
}

// ── MEMÓRIA ───────────────────────────────────────────────────────
function guardarHist() {
  if (historico.length > 20) historico = historico.slice(-20);
  localStorage.setItem(HIST_KEY, JSON.stringify(historico));
}
function atualizarMem() {
  document.getElementById('mem-count').textContent =
    `${historico.length} mensagem${historico.length !== 1 ? 's' : ''} em memória`;
}
window.limparMemoria = () => {
  if (!confirm('Apagar memória da conversa?')) return;
  historico = [];
  localStorage.removeItem(HIST_KEY);
  document.getElementById('chat-box').innerHTML = '';
  addMsg('Memória apagada. Nova sessão.', 'a');
  atualizarMem();
};

// ── GPS ───────────────────────────────────────────────────────────
function iniciarGPS() {
  if (!navigator.geolocation) return;
  navigator.geolocation.watchPosition(pos => {
    userLat = pos.coords.latitude; userLng = pos.coords.longitude;
    const acc = Math.round(pos.coords.accuracy);
    document.getElementById('loc-txt').textContent = `GPS ativo (±${acc}m)`;
    document.getElementById('loc-coord').textContent = `${userLat.toFixed(4)}, ${userLng.toFixed(4)}`;
    document.getElementById('h-gps').textContent = `📍 ${userLat.toFixed(3)},${userLng.toFixed(3)}`;
    document.getElementById('sos-coords').textContent = `📍 ${userLat.toFixed(6)}, ${userLng.toFixed(6)}`;
    if (mapObj) {
      mapObj.setView([userLat, userLng], 15);
      if (mapMarker) mapMarker.setLatLng([userLat, userLng]);
      else mapMarker = L.marker([userLat, userLng]).addTo(mapObj)
        .bindPopup('<b>A tua posição</b>').openPopup();
      buscarProximos();
    }
  }, () => { document.getElementById('loc-txt').textContent = 'GPS: permissão negada'; },
  { enableHighAccuracy: true, timeout: 15000, maximumAge: 8000 });
}

// ── MAPA ──────────────────────────────────────────────────────────
function iniciarMapa() {
  if (mapObj) return;
  mapObj = L.map('map', { zoomControl: true, attributionControl: false });
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(mapObj);
  mapObj.setView(userLat ? [userLat, userLng] : [38.7169, -9.1399], userLat ? 15 : 12);
  if (userLat) buscarProximos();
}

function buscarProximos() {
  if (!userLat) return;
  const grid = document.getElementById('near-grid');
  grid.innerHTML = '<div class="near-item" style="grid-column:1/-1;color:var(--sub)">🔍 A procurar...</div>';
  const q = `[out:json][timeout:8];(
    node["amenity"="hospital"](around:5000,${userLat},${userLng});
    node["amenity"="fire_station"](around:5000,${userLat},${userLng});
    node["amenity"="pharmacy"](around:2000,${userLat},${userLng});
    node["amenity"="police"](around:5000,${userLat},${userLng});
  );out body;`;
  fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST', body: q, signal: AbortSignal.timeout(7000)
  })
    .then(r => r.json())
    .then(data => {
      const icons = { hospital:'🏥', fire_station:'🚒', pharmacy:'💊', police:'🚔' };
      const found = {};
      data.elements.forEach(el => { if (!found[el.tags.amenity]) found[el.tags.amenity] = el; });
      grid.innerHTML = '';
      Object.entries(icons).forEach(([tipo, ico]) => {
        const el = found[tipo];
        const item = document.createElement('div');
        item.className = 'near-item';
        if (el) {
          const d = haversine(userLat, userLng, el.lat, el.lon);
          const nome = (el.tags.name || tipo).slice(0, 14);
          item.innerHTML = `${ico} <span>${nome}<br><small style="color:var(--c)">${d<1?(d*1000).toFixed(0)+'m':d.toFixed(1)+'km'}</small></span>`;
          item.onclick = () => window.open(`https://maps.google.com/?q=${el.lat},${el.lon}`, '_blank');
        } else {
          item.innerHTML = `${ico} <span style="color:var(--sub)">N/D</span>`;
        }
        grid.appendChild(item);
      });
    })
    .catch(() => {
      grid.innerHTML = '<div class="near-item" style="grid-column:1/-1;color:var(--sub);font-size:.6rem">⚠️ Sem ligação. Usa os contactos SOS.</div>';
    });
}

function haversine(a, b, c, d) {
  const R = 6371, x = (c-a)*Math.PI/180, y = (d-b)*Math.PI/180;
  const h = Math.sin(x/2)**2 + Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)**2;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1-h));
}

// ── TABS ──────────────────────────────────────────────────────────
window.tab = (id) => {
  document.querySelectorAll('.panel').forEach(p => p.classList.remove('on'));
  document.getElementById('p-map').classList.remove('on');
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('on'));
  ['ai','map','med','sos','kit'].forEach((t, i) => {
    if (t === id) document.querySelectorAll('nav button')[i].classList.add('on');
  });
  if (id === 'map') {
    document.getElementById('p-map').classList.add('on');
    setTimeout(() => { iniciarMapa(); if (mapObj) mapObj.invalidateSize(); }, 80);
  } else {
    document.getElementById('p-' + id)?.classList.add('on');
  }
};

// ── VOZ ───────────────────────────────────────────────────────────
window.toggleVoz = () => {
  if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    addMsg('⚠️ Reconhecimento de voz não disponível neste browser.', 'a'); return;
  }
  if (aEscutar) { voiceRec.stop(); return; }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  voiceRec = new SR();
  voiceRec.lang = 'pt-PT';
  voiceRec.onresult = e => { document.getElementById('ci').value = e.results[0][0].transcript; enviar(); };
  voiceRec.onend = () => { aEscutar = false; document.getElementById('vbtn').classList.remove('on'); };
  voiceRec.start(); aEscutar = true; document.getElementById('vbtn').classList.add('on');
};

// ── SOS ───────────────────────────────────────────────────────────
window.abrirSOS = () => {
  document.getElementById('sos-ov').classList.add('show');
  if (navigator.vibrate) navigator.vibrate([200,100,200,100,200]);
};
window.fecharSOS = () => document.getElementById('sos-ov').classList.remove('show');
window.partilharLocalizacao = () => {
  if (!userLat) { alert('Localização ainda indisponível.'); return; }
  const url = `https://maps.google.com/?q=${userLat},${userLng}`;
  const txt = `🆘 EMERGÊNCIA · LUMIN AI\nLocalização: ${userLat.toFixed(6)}, ${userLng.toFixed(6)}\n${url}`;
  if (navigator.share) navigator.share({ title: 'LUMIN AI SOS', text: txt });
  else navigator.clipboard.writeText(txt).then(() => alert('Localização copiada!'));
};

// ── CONSTRUÇÃO UI ─────────────────────────────────────────────────
function construirMedico() {
  const panel = document.getElementById('p-med');
  PROTOS.forEach(p => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="ch"><span class="ci2">${p.icon}</span>
        <div><div class="ct">${p.titulo}</div><div class="cs">${p.sub}</div></div>
      </div>
      <div class="cb">
        ${p.passos.map((s,i) => `<div class="step"><strong>${i+1}. ${s.t}</strong>${s.d}</div>`).join('')}
        ${p.aviso ? `<div class="warn">⚠️ ${p.aviso}</div>` : ''}
        <button class="call-btn" onclick="event.stopPropagation();location.href='tel:112'">📞 Ligar 112</button>
      </div>`;
    card.onclick = () => card.classList.toggle('open');
    panel.appendChild(card);
  });
}

function construirCrises() {
  const el = document.getElementById('crise-list');
  CRISES.forEach(c => {
    const card = document.createElement('div');
    card.className = 'card';
    card.style.marginTop = '.3rem';
    card.innerHTML = `
      <div class="ch"><span class="ci2">${c.icon}</span><div class="ct">${c.titulo}</div></div>
      <div class="cb">${c.passos.map((s,i) => `<div class="step"><strong>${i+1}. ${s.t}</strong>${s.d}</div>`).join('')}</div>`;
    card.onclick = () => card.classList.toggle('open');
    el.appendChild(card);
  });
}

function construirKit() {
  const el = document.getElementById('kit-list');
  const g = JSON.parse(localStorage.getItem('lumin_kit') || '{}');
  KIT_ITENS.forEach((cat, ci) => {
    const sec = document.createElement('div');
    sec.innerHTML = `<div class="sec">${cat.cat}</div>`;
    cat.itens.forEach((item, ii) => {
      const key = `${ci}_${ii}`;
      const chk = g[key] || false;
      const div = document.createElement('div');
      div.className = 'kit-item' + (chk ? ' done' : '');
      div.id = 'k_' + key;
      div.innerHTML = `<input type="checkbox" id="cb_${key}" ${chk?'checked':''} onchange="toggleKit('${key}',this.checked)"><label for="cb_${key}">${item}</label>`;
      sec.appendChild(div);
    });
    el.appendChild(sec);
  });
}

window.toggleKit = (key, val) => {
  const g = JSON.parse(localStorage.getItem('lumin_kit') || '{}');
  g[key] = val;
  localStorage.setItem('lumin_kit', JSON.stringify(g));
  document.getElementById('k_' + key).className = 'kit-item' + (val ? ' done' : '');
};

window.resetKit = () => {
  localStorage.removeItem('lumin_kit');
  document.getElementById('kit-list').innerHTML = '';
  construirKit();
};
