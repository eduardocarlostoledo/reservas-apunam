const fs = require('fs');
const path = require('path');

const CSV_PATH = path.join(__dirname, '..', '..', 'data', 'afiliados.csv');

function loadAfiliadosFromCSV() {
  if (!fs.existsSync(CSV_PATH)) return [];

  const content = fs.readFileSync(CSV_PATH, 'utf-8');
  const lines = content.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const dniIdx = headers.indexOf('dni');
  const numAfiliadoIdx = headers.indexOf('numero_afiliado');

  return lines.slice(1).map(line => {
    const cols = line.split(',').map(c => c.trim());
    return {
      dni: dniIdx >= 0 ? cols[dniIdx] : null,
      numero_afiliado: numAfiliadoIdx >= 0 ? cols[numAfiliadoIdx] : null,
    };
  });
}

let cachedAfiliados = null;

function getAfiliados() {
  if (!cachedAfiliados) {
    cachedAfiliados = loadAfiliadosFromCSV();
  }
  return cachedAfiliados;
}

function reloadAfiliados() {
  cachedAfiliados = null;
}

function validarAfiliado(dni, numero_afiliado) {
  const afiliados = getAfiliados();

  if (afiliados.length === 0) return true;

  return afiliados.some(
    a => a.dni === dni || a.numero_afiliado === numero_afiliado
  );
}

module.exports = { validarAfiliado, reloadAfiliados };
