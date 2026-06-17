// ════════════════════════════════════════════════════════════════
//  ACTIVITATS HOTEL CAMBRILS · Code.gs
//  Pestanyes: Config | Dia1 | Dia2 | Dia3 | Dia4
// ════════════════════════════════════════════════════════════════

var CONFIG_TAB   = 'Config';
var DIES         = ['Dia1','Dia2','Dia3','Dia4'];
var COLS_ACTS    = ['ID','Nom','Tipus','Equip','Hora','Ubicació','Descripció','Material','Observacions','Imatge'];
var COLS_CONFIG  = ['Clau','Valor'];

// ── MENÚ PERSONALITZAT ──────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🌊 Hotel Cambrils')
    .addItem('⚙️ Crear / Reinicialitzar pestanyes', 'setupSheets')
    .addItem('🔗 Obtenir URL de l\'app', 'showAppUrl')
    .addToUi();
}

// ── SETUP SHEETS ────────────────────────────────────────────────
// Executa manualment des del menú per crear o reinicialitzar totes les pestanyes.
// Si ja existeixen, les deixa tal com estan (no esborra dades).
function setupSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Config ──
  var cfg = ss.getSheetByName(CONFIG_TAB);
  if (!cfg) {
    cfg = ss.insertSheet(CONFIG_TAB);
    Logger.log('Creada pestanya Config');
  }
  if (cfg.getLastRow() === 0) {
    cfg.getRange('A1:B1').setValues([COLS_CONFIG]);
    cfg.getRange('A1:B1').setFontWeight('bold').setBackground('#1B4F72').setFontColor('#ffffff');
    cfg.getRange('A2:B7').setValues([
      ['data_dia_1', ''],
      ['data_dia_2', ''],
      ['data_dia_3', ''],
      ['data_dia_4',  ''],
      ['pass_admin',  'admin123'],
      ['icono',       '']
    ]);
    cfg.setColumnWidth(1, 160);
    cfg.setColumnWidth(2, 200);
    Logger.log('Config inicialitzada');
  }

  // ── Dia1..Dia4 ──
  DIES.forEach(function(nom) {
    var sh = ss.getSheetByName(nom);
    if (!sh) {
      sh = ss.insertSheet(nom);
      Logger.log('Creada pestanya ' + nom);
    }
    // Afegim capçalera si la pestanya és buida
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, COLS_ACTS.length).setValues([COLS_ACTS]);
      sh.getRange(1, 1, 1, COLS_ACTS.length)
        .setFontWeight('bold')
        .setBackground('#1B4F72')
        .setFontColor('#ffffff');
      sh.setFrozenRows(1);
      var widths = [60, 180, 90, 150, 80, 200, 280, 200, 200, 280];
      widths.forEach(function(w, i) { sh.setColumnWidth(i + 1, w); });
      Logger.log(nom + ' inicialitzada');
    }
  });

  SpreadsheetApp.getUi().alert(
    '✅ Pestanyes llestes!\n\n' +
    '• Config\n• Dia1\n• Dia2\n• Dia3\n• Dia4\n\n' +
    'Ara pots desplegar l\'app com a aplicació web.'
  );
}

function showAppUrl() {
  var url = ScriptApp.getService().getUrl();
  SpreadsheetApp.getUi().alert('URL de l\'app:\n\n' + url);
}

// ── SPREADSHEET ─────────────────────────────────────────────────
function getSS() {
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

function getTab(nom) {
  return getSS().getSheetByName(nom);
}

// ── ENTRADA WEB ─────────────────────────────────────────────────
function doGet() {
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Activitats · Hotel Cambrils')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ════════════════════════════════════════════════════════════════
//  FUNCIONS CRIDADES DES DEL FRONTEND (google.script.run)
// ════════════════════════════════════════════════════════════════

// ── LLEGIR CONFIG ────────────────────────────────────────────────
function getConfig() {
  var sh   = getTab(CONFIG_TAB);
  var rows = sh.getDataRange().getValues();
  var cfg  = {};
  for (var i = 1; i < rows.length; i++) {
    if (rows[i][0]) cfg[String(rows[i][0])] = String(rows[i][1] || '');
  }
  return cfg;
  // Retorna: { data_dia_1:'2025-07-10', data_dia_2:'', ... }
}

// ── DESAR CONFIG ─────────────────────────────────────────────────
function saveConfig(d1, d2, d3, d4) {
  var sh   = getTab(CONFIG_TAB);
  var rows = sh.getDataRange().getValues();
  var vals = { data_dia_1: d1||'', data_dia_2: d2||'', data_dia_3: d3||'', data_dia_4: d4||'' };
  for (var i = 1; i < rows.length; i++) {
    var k = String(rows[i][0]);
    if (vals.hasOwnProperty(k)) sh.getRange(i + 1, 2).setValue(vals[k]);
  }
  return true;
}

// ── LLEGIR TOTES LES ACTIVITATS ──────────────────────────────────
function getAllActivitats() {
  var result = [];
  for (var d = 1; d <= 4; d++) {
    var sh   = getTab('Dia' + d);
    if (!sh) continue;
    var rows = sh.getDataRange().getValues();
    for (var i = 1; i < rows.length; i++) {
      var r = rows[i];
      if (!r[0]) continue;
      result.push({
        id:       String(r[0]),
        nom:      String(r[1] || ''),
        tipus:    Number(r[2]) || 1,
        equip:    String(r[3] || ''),
        hora:     String(r[4] || ''),
        ubicacio: String(r[5] || ''),
        desc:     String(r[6] || ''),
        material: String(r[7] || ''),
        obs:      String(r[8] || ''),
        img:      String(r[9] || ''),
        dia:      d
      });
    }
  }
  return result;
  // Retorna array d'objectes
}

// ── CREAR ACTIVITAT ──────────────────────────────────────────────
function createActivitat(nom, tipus, equip, dia, hora, ubicacio, desc, material, obs, img) {
  var sh   = getTab('Dia' + dia);
  var rows = sh.getDataRange().getValues();
  // Generar ID (màxim existent + 1)
  var maxId = 0;
  for (var i = 1; i < rows.length; i++) {
    var n = parseInt(rows[i][0]) || 0;
    if (n > maxId) maxId = n;
  }
  var newId = maxId + 1;
  sh.appendRow([newId, nom, Number(tipus), equip, hora, ubicacio, desc, material||'', obs||'', img||'']);
  // Color zebra
  var lastRow = sh.getLastRow();
  if (lastRow % 2 === 0) {
    sh.getRange(lastRow, 1, 1, COLS_ACTS.length).setBackground('#F4F6F8');
  }
  return newId;
  // Retorna l'ID creat
}

// ── ACTUALITZAR ACTIVITAT ─────────────────────────────────────────
function updateActivitat(id, diaAntic, nom, tipus, equip, dia, hora, ubicacio, desc, material, obs, img) {
  diaAntic = Number(diaAntic);
  dia      = Number(dia);

  // Si ha canviat de dia → esborrar de l'antic, crear al nou
  if (diaAntic !== dia) {
    _deleteRow(diaAntic, String(id));
    return createActivitat(nom, tipus, equip, dia, hora, ubicacio, desc, material, obs, img);
  }

  // Mateix dia → actualitzar fila
  var sh   = getTab('Dia' + dia);
  var rows = sh.getDataRange().getValues();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(id)) {
      sh.getRange(i + 1, 1, 1, COLS_ACTS.length).setValues([[
        id, nom, Number(tipus), equip, hora, ubicacio, desc, material||'', obs||'', img||''
      ]]);
      return id;
    }
  }
  throw new Error('Activitat no trobada: ID=' + id + ' Dia=' + dia);
}

// ── ELIMINAR ACTIVITAT ────────────────────────────────────────────
function deleteActivitat(id, dia) {
  _deleteRow(Number(dia), String(id));
  return true;
}

function _deleteRow(dia, id) {
  var sh   = getTab('Dia' + dia);
  var rows = sh.getDataRange().getValues();
  for (var i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === id) {
      sh.deleteRow(i + 1);
      return;
    }
  }
}
