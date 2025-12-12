import { CircuitEngine } from './circuit_solver_engine.js';

let daltonMode = '';
let malhaCount = 0;
let dyslexicActive = false;
let mascotActive = true;

let colorPrimary, colorSecondary, colorBg, colorText, colorPanel;
let fontRange, brightRange, contrastRange, saturationRange;
let fontValue, brightValue, contrastValue, saturationValue;
let settingsPanel, malhasContainer, malhaForm, resultsInner, resultArea;
let previewName, activeThemeName;
let mascotImg, mascotContainer;

function applyAllFilters() {
  const b = brightRange ? parseInt(brightRange.value, 10) / 100 : 1;
  const c = contrastRange ? parseInt(contrastRange.value, 10) / 100 : 1;
  const s = saturationRange ? parseInt(saturationRange.value, 10) / 100 : 1;

  if (brightValue) brightValue.innerText = Math.round(b * 100) + '%';
  if (contrastValue) contrastValue.innerText = Math.round(c * 100) + '%';
  if (saturationValue) saturationValue.innerText = Math.round(s * 100) + '%';

  let filterString = `brightness(${b}) contrast(${c}) saturate(${s})`;

  if (daltonMode === 'protanopia') filterString += ' hue-rotate(10deg) sepia(0.3)';
  else if (daltonMode === 'deuteranopia') filterString += ' hue-rotate(330deg) sepia(0.2)';
  else if (daltonMode === 'tritanopia') filterString += ' hue-rotate(180deg) sepia(0.1)';

  document.documentElement.style.filter = filterString;
}

function setDalton(type) { daltonMode = type; applyAllFilters(); }

const DEFAULTS = {
  theme: {
      primary: '#29d9ff', secondary: '#006994', bg: '#010a12', panel: '#05263b', text: '#e0fbfc',
      name: 'Neon Gélido', mascot: 'mascot_standard.png'
  },
  gamer: {
      primary: '#00ff9d', secondary: '#061722', bg: '#02040a', panel: '#0b1e15', text: '#caffff',
      name: 'Gamer', mascot: 'mascot_gamer.png'
  },
  pink: {
      primary: '#ff8fa3', secondary: '#8a2b42', bg: '#1f0a12', panel: '#2d0f1b', text: '#ffdee8',
      name: 'Pink', mascot: 'mascot_pink.png'
  },
  grey: {
      primary: '#dcdcdc', secondary: '#6e6e6e', bg: '#0a0a0a', panel: '#1a1a1a', text: '#e0e0e0',
      name: 'Nier Grey', mascot: 'mascot_grey.png'
  }
};

function applyVars(vars) {
  if (vars.primary) document.documentElement.style.setProperty('--primary', vars.primary);
  if (vars.secondary) document.documentElement.style.setProperty('--secondary', vars.secondary);
  if (vars.bg) document.documentElement.style.setProperty('--bg', vars.bg);
  if (vars.panel) document.documentElement.style.setProperty('--panel', vars.panel);
  if (vars.text) document.documentElement.style.setProperty('--text', vars.text);
  if (vars.name && activeThemeName) activeThemeName.innerText = vars.name;
  if (vars.name && previewName) previewName.innerText = vars.name;

  if (vars.mascot) changeMascot(vars.mascot);
}

function changeMascot(filename) {
    if(!mascotImg) return;
    const newSrc = `static/img/${filename}`;
    if(mascotImg.getAttribute('src').includes(filename)) return;

    mascotImg.style.opacity = '0';
    setTimeout(() => {
        mascotImg.src = newSrc;
        mascotImg.onload = () => { mascotImg.style.opacity = '1'; };
        setTimeout(() => { mascotImg.style.opacity = '1'; }, 100);
    }, 400);
}

function applyPreset(name) {
  if (DEFAULTS[name]) applyVars(DEFAULTS[name]);
  setTimeout(() => {
    const styles = getComputedStyle(document.documentElement);
    if(colorPrimary) colorPrimary.value = styles.getPropertyValue('--primary').trim();
    if(colorSecondary) colorSecondary.value = styles.getPropertyValue('--secondary').trim();
    if(colorBg) colorBg.value = styles.getPropertyValue('--bg').trim();
    if(colorText) colorText.value = styles.getPropertyValue('--text').trim();
  }, 50);
}

function updateThemeFromPickers() {
  document.documentElement.style.setProperty('--primary', colorPrimary.value);
  document.documentElement.style.setProperty('--secondary', colorSecondary.value);
  document.documentElement.style.setProperty('--bg', colorBg.value);
  document.documentElement.style.setProperty('--text', colorText.value);
  if (activeThemeName) activeThemeName.innerText = 'Personalizado';
}

function loadCircuit(type) {
    const container = document.getElementById('malhasContainer');
    container.innerHTML = '';
    malhaCount = 0; // Reseta o contador global
    document.getElementById('resultsInner').innerHTML = '';
    document.getElementById('resultArea').style.display = 'none';

    if (type === 'simple2') {

        createMeshWithData([10], [20]);
        createMeshWithData([10], [3]);
        addResToMesh(1, 5, 2);
    }
    else if (type === 'wheatstone') {
        createMeshWithData([100, 20], [10]);
        createMeshWithData([20, 50], []);
        createMeshWithData([50, 100], []);
        addResToMesh(1, 20, 2);
        addResToMesh(2, 50, 3);
        addResToMesh(1, 100, 3);
        addResToMesh(2, 5, 3);
    }
    else if (type === 'ladder') {
        createMeshWithData([10], [12]);
        createMeshWithData([10], []);
        createMeshWithData([10], []);
        addResToMesh(1, 20, 2);
        addResToMesh(2, 20, 3);
    }
}

function createMeshWithData(resistors, voltages) {
    addMalha();
    const currentId = malhaCount;
    const card = document.querySelectorAll('.malha')[currentId - 1];


    card.querySelector('.res-container').innerHTML = '';
    card.querySelector('.vol-container').innerHTML = '';

    resistors.forEach(val => addResToMesh(currentId, val, 0));
    voltages.forEach(val => addVoltToMesh(currentId, val, 0));
}

function addResToMesh(meshId, val, linkTo) {
    const card = document.querySelectorAll('.malha')[meshId - 1];
    const container = card.querySelector('.res-container');

    const div = document.createElement('div');
    div.className = 'field-row';
    div.innerHTML = `<input type="number" step="0.01" class="res-input" value="${val}" required>
                     <select class="mesh-selector"><option value="${linkTo}">Auto</option></select>
                     <button type="button" class="btn ghost" onclick="this.parentElement.remove()">🗑️</button>`;
    container.appendChild(div);
    updateMeshDropdowns(); // Atualiza para os selects funcionarem
    div.querySelector('select').value = linkTo; // Define a conexão
}

function addVoltToMesh(meshId, val, linkTo) {
    const card = document.querySelectorAll('.malha')[meshId - 1];
    const container = card.querySelector('.vol-container');

    const div = document.createElement('div');
    div.className = 'field-row';
    div.innerHTML = `<input type="number" step="0.01" class="vol-input" value="${val}" required>
                     <select class="mesh-selector"><option value="${linkTo}">Auto</option></select>
                     <button type="button" class="btn ghost" onclick="this.parentElement.remove()">🗑️</button>`;
    container.appendChild(div);
    updateMeshDropdowns();
    div.querySelector('select').value = linkTo;
}

function updateMeshDropdowns() {
  const allSelects = document.querySelectorAll('.mesh-selector');
  const cards = Array.from(document.querySelectorAll('.malha.panel'));

  allSelects.forEach(select => {
    const currentSelection = select.value;
    const myOwnerId = select.dataset.ownerId;

    select.innerHTML = '';
    const optGND = document.createElement('option');
    optGND.value = '0';
    optGND.text = '⏚ GND (Ref)';
    select.appendChild(optGND);

    cards.forEach((card, index) => {
        const meshNum = index + 1;
        if (String(meshNum) !== String(myOwnerId)) {
            const opt = document.createElement('option');
            opt.value = meshNum;
            opt.text = `Malha ${meshNum}`;
            select.appendChild(opt);
        }
    });

    if ([...select.options].some(o => o.value === currentSelection)) {
        select.value = currentSelection;
    } else {
        select.value = '0';
    }
  });

  cards.forEach((card, index) => {
      card.querySelector('h3').innerText = `Malha ${index + 1}`;
      const selects = card.querySelectorAll('.mesh-selector');
      selects.forEach(s => s.dataset.ownerId = index + 1);
  });
}

function addMalha() {
  malhaCount++;
  const visualIndex = document.querySelectorAll('.malha.panel').length + 1;
  const card = document.createElement('div');
  card.className = 'malha panel';

  card.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>Malha ${visualIndex}</h3>
      <button type="button" class="btn ghost" data-action="remove">❌ Remover</button>
    </div>
    
    <div class="muted">Resistores (Ω)</div>
    <div class="res-container"></div>
    <div style="margin-top:6px; margin-bottom:10px;">
      <button type="button" class="btn ghost" data-action="addRes" data-idx="${visualIndex}">+ Resistor</button>
    </div>

    <div class="muted">Fontes de Tensão (V)</div>
    <div class="vol-container"></div>
    <div style="margin-top:6px;">
      <button type="button" class="btn ghost" data-action="addVolt" data-idx="${visualIndex}">+ Fonte</button>
    </div>
  `;

  malhasContainer.appendChild(card);
  addRes(card.querySelector('.res-container'), visualIndex);
  addVolt(card.querySelector('.vol-container'), visualIndex);
  updateMeshDropdowns();

  card.addEventListener('click', (ev) => {
    const btn = ev.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'remove') {
        card.remove();
        updateMeshDropdowns();
    } else if (action === 'addRes') {
        const currentId = Array.from(malhasContainer.children).indexOf(card) + 1;
        addRes(card.querySelector('.res-container'), currentId);
    } else if (action === 'addVolt') {
        const currentId = Array.from(malhasContainer.children).indexOf(card) + 1;
        addVolt(card.querySelector('.vol-container'), currentId);
    }
  });
}

function addRes(container, ownerId) {
  const div = document.createElement('div');
  div.className = 'field-row';
  div.innerHTML = `
    <input type="number" step="0.01" class="res-input" placeholder="Valor (Ω)" required>
    <select class="mesh-selector" data-owner-id="${ownerId}">
        <option value="0">⏚ GND (Ref)</option>
    </select>
    <button type="button" class="btn ghost" onclick="this.parentElement.remove()">🗑️</button>
  `;
  container.appendChild(div);
  updateMeshDropdowns();
}

function addVolt(container, ownerId) {
  const div = document.createElement('div');
  div.className = 'field-row';
  div.innerHTML = `
    <input type="number" step="0.01" class="vol-input" placeholder="Valor (V)" required>
    <select class="mesh-selector" data-owner-id="${ownerId}">
        <option value="0">Pertence à Malha</option>
    </select>
    <button type="button" class="btn ghost" onclick="this.parentElement.remove()">🗑️</button>
  `;
  container.appendChild(div);
  updateMeshDropdowns();
}

function toggleMascot() {
  mascotActive = !mascotActive;
  if(mascotContainer) {
      mascotContainer.style.display = mascotActive ? 'block' : 'none';
  }
}

function handleSubmit(e) {
  e.preventDefault();
  const engine = new CircuitEngine();
  const cards = Array.from(document.querySelectorAll('.malha.panel'));

  if (cards.length === 0) { alert("Adicione pelo menos uma malha."); return; }

  cards.forEach(() => engine.addMesh());

  try {
      cards.forEach((card, index) => {
        const meshId = index + 1;
        const resRows = card.querySelectorAll('.res-container .field-row');
        resRows.forEach(row => {
            const val = parseFloat(row.querySelector('.res-input').value);
            const neighbor = parseInt(row.querySelector('.mesh-selector').value);
            if (isNaN(val)) throw new Error(`Valor inválido em Resistor na Malha ${meshId}`);
            engine.addResistor(val, meshId, neighbor);
        });

        const volRows = card.querySelectorAll('.vol-container .field-row');
        volRows.forEach(row => {
            const val = parseFloat(row.querySelector('.vol-input').value);
            const neighbor = parseInt(row.querySelector('.mesh-selector').value);
            if (isNaN(val)) throw new Error(`Valor inválido em Fonte na Malha ${meshId}`);
            engine.addVoltageSource(val, meshId, neighbor);
        });
      });

      const solution = engine.solve();
      renderResults(solution);

  } catch (err) {
    alert("Erro: " + err.message);
    console.error(err);
  }
}

function renderResults(sol) {
    const resDiv = document.getElementById('resultsInner');
    const area = document.getElementById('resultArea');

    resDiv.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <h3 style="margin:0;">Resultados Analíticos</h3>
            <button class="btn ghost" onclick="window.print()" title="Salvar como PDF" style="padding:5px 10px; font-size:0.8rem;">🖨️ Imprimir</button>
        </div>
    `;

    let tableHtml = `
        <table class="result-table">
            <thead>
                <tr>
                    <th>Malha</th>
                    <th>Corrente (I)</th>
                    <th>Sentido</th>
                </tr>
            </thead>
            <tbody>
    `;

    let totalPowerSource = 0;

    sol.currents.forEach((I, i) => {
        const sentido = I >= 0 ? "Horário (↻)" : "Anti-horário (↺)";
        const valorFormatado = Math.abs(I).toFixed(5);
        const sinal = I >= 0 ? "+" : "-";

        // Cálculo simplificado de potência fornecida pela malha (V_malha * I_malha)
        // Nota: Isso é uma aproximação didática para o método de inspeção
        const voltage = sol.vector[i];
        const power = voltage * I;
        totalPowerSource += power;

        tableHtml += `
            <tr>
                <td><strong>Malha ${i + 1}</strong></td>
                <td style="color:var(--text)">${sinal} ${valorFormatado} A</td>
                <td style="opacity:0.8; font-size:0.85rem;">${sentido}</td>
            </tr>
        `;
    });
    tableHtml += `</tbody></table>`;

    tableHtml += `
        <div style="margin-top:20px; padding:10px; background:rgba(0,0,0,0.2); border-radius:8px; border:1px solid var(--secondary);">
            <strong style="color:var(--primary); display:block; margin-bottom:5px;">⚡ Balanço de Potência (Malhas)</strong>
            <div style="display:flex; justify-content:space-between; font-size:0.9rem;">
                <span>Potência Líquida do Sistema:</span>
                <span style="font-family:monospace; color:${Math.abs(totalPowerSource) < 0.01 ? '#00ff9d' : '#ffeb3b'}">
                    ${Math.abs(totalPowerSource).toFixed(4)} W
                </span>
            </div>
            <div style="font-size:0.75rem; opacity:0.6; margin-top:5px;">
                *Valores próximos de zero indicam equilíbrio (Lei de Tellegen).
            </div>
        </div>
    `;

    resDiv.innerHTML += tableHtml;

    const btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.style.marginTop = '20px';
    btn.style.width = '100%';
    btn.innerText = '👁️ Ver Explicação Matemática';
    btn.onclick = () => {
        const d = document.getElementById('eqDetails');
        if(d.style.display === 'none') { d.style.display='block'; btn.innerText='🙈 Ocultar Explicação'; }
        else { d.style.display='none'; btn.innerText='👁️ Ver Explicação Matemática'; }
    };
    resDiv.appendChild(btn);

    const details = document.createElement('div');
    details.id = 'eqDetails';
    details.style.display = 'none';
    details.style.marginTop = '15px';
    details.style.padding = '15px';
    details.style.background = 'rgba(0,0,0,0.3)';
    details.style.borderRadius = '12px';

    let html = renderEquationsHTML(sol.matrix, sol.vector);
    html += generateDidacticExplanation(sol.matrix, sol.vector);
    details.innerHTML = html;
    resDiv.appendChild(details);

    if(typeof renderChart === "function") renderChart(sol.currents);

    area.style.display = 'block';
    area.scrollIntoView({ behavior: 'smooth' });
}
function renderEquationsHTML(M, b) {
    let html = '<div style="font-family:monospace; color:var(--text); font-size:0.9rem;">';
    html += '<div style="margin-bottom:8px; color:var(--secondary); font-weight:bold;">Sistema Linear: [R] · [i] = [V]</div>';
    M.forEach((row, i) => {
        let lineStr = "";
        row.forEach((val, j) => {
            let sign = val >= 0 ? "+" : "-";
            if (j === 0 && val >= 0) sign = "";
            if (j > 0 && val >= 0) sign = "+ ";
            if (val < 0) sign = "- ";
            let absVal = Math.abs(val).toFixed(2);
            lineStr += `${sign}${absVal}·i<sub>${j+1}</sub> `;
        });
        lineStr += `= ${b[i].toFixed(2)} V`;
        html += `<div style="padding:4px 0; border-bottom:1px dashed rgba(255,255,255,0.05);">${lineStr}</div>`;
    });
    html += '</div>';
    return html;
}

function generateDidacticExplanation(M, b) {
    let html = '<div style="margin-top:20px; padding-top:10px; border-top:1px solid rgba(255,255,255,0.1);">';
    html += '<h4 style="color:var(--primary); margin:0 0 10px 0;">📝 Passo a Passo (Inspeção)</h4>';

    M.forEach((row, i) => {
        const meshNum = i + 1;
        const diagonalR = row[i];
        const voltage = b[i];

        html += `<div style="margin-bottom:15px; background:rgba(255,255,255,0.03); padding:10px; border-radius:8px;">`;
        html += `<strong style="color:var(--text); font-size:1rem;">Análise da Malha ${meshNum}:</strong>`;
        html += `<ul style="margin:5px 0 0 20px; color:#9fbfc6; font-size:0.9rem; line-height:1.5;">`;

        html += `<li><strong>Resistência Total (R<sub>${meshNum}${meshNum}</sub>):</strong> A soma de todos os resistores que tocam esta malha é <strong>${diagonalR.toFixed(2)} Ω</strong>. (Entra positivo na diagonal).</li>`;

        let hasNeighbors = false;
        row.forEach((val, j) => {
            if (i !== j && Math.abs(val) > 0.001) {
                hasNeighbors = true;
                html += `<li><strong>Conexão com Malha ${j+1}:</strong> Existe um resistor compartilhado de <strong>${Math.abs(val).toFixed(2)} Ω</strong>. (Entra subtraindo na equação).</li>`;
            }
        });

        if (!hasNeighbors) {
            html += `<li><em>Esta malha não compartilha resistores com ninguém (isolada).</em></li>`;
        }

        html += `<li><strong>Tensão Resultante (V<sub>${meshNum}</sub>):</strong> A soma das fontes nesta malha (considerando o sentido) é <strong>${voltage.toFixed(2)} V</strong>.</li>`;

        html += `</ul></div>`;
    });
    html += '</div>';
    return html;
}

window.addMalha = addMalha;
window.restoreAll = () => {
    applyPreset('theme');
    fontRange.value=100; applyFont();
    brightRange.value=100; contrastRange.value=100; saturationRange.value=100;
    setDalton('');
    dyslexicActive=false; document.body.classList.remove('dyslexic');
    mascotActive = true; if(mascotContainer) mascotContainer.style.display='block';
};
window.applyPreset = applyPreset;
window.toggleSettings = () => settingsPanel.classList.toggle('show');
window.toggleDyslexic = () => { dyslexicActive = !dyslexicActive; document.body.classList.toggle('dyslexic', dyslexicActive); };
window.increaseFont = () => { fontRange.value = Math.min(180, +fontRange.value + 10); applyFont(); };
window.decreaseFont = () => { fontRange.value = Math.max(80, +fontRange.value - 10); applyFont(); };
window.applyDalton = setDalton;
window.resetDalton = () => setDalton('');
window.restoreTheme = () => applyPreset('theme');
window.restoreAccessibility = () => { fontRange.value = 100; applyFont(); };
window.restoreContrast = () => { brightRange.value = 100; contrastRange.value = 100; saturationRange.value = 100; applyAllFilters(); };
window.toggleMascot = toggleMascot;
window.loadCircuit = loadCircuit;
window.setMode = (mode) => {
    let targetBrightness = 100;
    if(mode === 'light') targetBrightness = 130;
    else if (mode === 'dark') targetBrightness = 70;
    else if (mode === 'auto') {
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        targetBrightness = prefersDark ? 100 : 120;
        const prefersContrast = window.matchMedia && window.matchMedia('(prefers-contrast: more)').matches;
        if(prefersContrast && contrastRange) contrastRange.value = 120;
    }
    if(brightRange) {
        brightRange.value = targetBrightness;
        applyAllFilters();
    }
};

function applyFont() {
  const scale = parseInt(fontRange.value, 10) / 100;
  document.documentElement.style.setProperty('--font-scale', scale);
  fontValue.innerText = fontRange.value + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  settingsPanel = document.getElementById('settingsPanel');
  malhasContainer = document.getElementById('malhasContainer');
  malhaForm = document.getElementById('malhaForm');
  resultsInner = document.getElementById('resultsInner');
  resultArea = document.getElementById('resultArea');
  previewName = document.getElementById('previewName');
  activeThemeName = document.getElementById('activeThemeName');

  mascotContainer = document.getElementById('mascotContainer');
  mascotImg = document.getElementById('mascotImg');

  colorPrimary = document.getElementById('colorPrimary');
  colorSecondary = document.getElementById('colorSecondary');
  colorBg = document.getElementById('colorBg');
  colorText = document.getElementById('colorText');

  fontRange = document.getElementById('fontRange');
  fontValue = document.getElementById('fontValue');
  brightRange = document.getElementById('brightRange');
  contrastRange = document.getElementById('contrastRange');
  saturationRange = document.getElementById('saturationRange');
  brightValue = document.getElementById('brightValue');
  contrastValue = document.getElementById('contrastValue');
  saturationValue = document.getElementById('saturationValue');

  if(colorPrimary) {
      colorPrimary.addEventListener('input', updateThemeFromPickers);
      colorSecondary.addEventListener('input', updateThemeFromPickers);
      colorBg.addEventListener('input', updateThemeFromPickers);
      colorText.addEventListener('input', updateThemeFromPickers);
  }
  if(fontRange) fontRange.addEventListener('input', applyFont);
  if(brightRange) {
      brightRange.addEventListener('input', applyAllFilters);
      contrastRange.addEventListener('input', applyAllFilters);
      saturationRange.addEventListener('input', applyAllFilters);
  }

  if(malhaForm) malhaForm.addEventListener('submit', handleSubmit);

  document.addEventListener('click', (e) => {
      const openBtn = document.getElementById('openSettingsBtn');

      const isPanelOpen = settingsPanel && settingsPanel.classList.contains('show');

      if (!isPanelOpen) return; // Se já está fechado, não faz nada

      const clickedInsidePanel = settingsPanel.contains(e.target);
      const clickedOnButton = openBtn && openBtn.contains(e.target);

      if (!clickedInsidePanel && !clickedOnButton) {
          settingsPanel.classList.remove('show');
      }
  });

  applyPreset('theme');
  addMalha();
  addMalha();
  applyAllFilters();
});

let myChart = null; // Variável global para guardar o gráfico

function renderChart(currents) {
    const ctx = document.getElementById('currentChart').getContext('2d');

    if (myChart) {
        myChart.destroy();
    }

    const labels = currents.map((_, i) => `Malha ${i + 1}`);
    const data = currents.map(i => Math.abs(i)); // Usa valor absoluto para altura da barra

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Corrente (Amperes)',
                data: data,
                backgroundColor: 'rgba(0, 229, 255, 0.5)', // Cor Primária Transparente
                borderColor: '#00e5ff', // Cor Primária Sólida
                borderWidth: 2,
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#dffaff' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#dffaff' }
                }
            },
            plugins: {
                legend: { labels: { color: '#dffaff' } }
            }
        }
    });
}