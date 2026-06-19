// Google Apps Script para sincronizar con la App HTML
// Coloca este código en Google Apps Script (no en el index.html)

// ID de la hoja de cálculo
const SPREADSHEET_ID = "1Ftku5jJGwbAK1DYrGKYQ25KeGaM1al07yMZMROtC1bA";

// ── LEER TODAS LAS ACTIVIDADES ──
function doGet(e) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  
  // Leer pestaña Config
  const configSheet = ss.getSheetByName("Config");
  const configData = configSheet.getDataRange().getValues();
  const config = {};
  for (let i = 1; i < configData.length; i++) {
    config[configData[i][0]] = configData[i][1];
  }
  
  // Leer actividades de cada día
  const activities = [];
  const days = ["Dia1", "Dia2", "Dia3", "Dia4"];
  
  days.forEach((dayName, dayIndex) => {
    const sheet = ss.getSheetByName(dayName);
    if (!sheet) return;
    
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    
    for (let i = 1; i < data.length; i++) {
      if (!data[i][0]) continue; // Salta filas vacías
      
      const activity = {
        id: parseInt(data[i][0]) || i,
        day: dayIndex,
        nom: data[i][1] || "",
        tipus: data[i][2] || "esportiva",
        equip: data[i][3] || "",
        hora: data[i][4] || "",
        ubicacio: data[i][5] || "",
        descripcio: data[i][6] || "",
        material: data[i][7] || "",
        observacions: data[i][8] || "",
        imatge: data[i][9] || ""
      };
      
      activities.push(activity);
    }
  });
  
  return ContentService.createTextOutput(JSON.stringify({
    success: true,
    config: config,
    activities: activities
  })).setMimeType(ContentService.MimeType.JSON);
}

// ── GUARDAR CAMBIOS ──
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    
    // Guardar configuración
    if (data.type === "saveConfig") {
      const configSheet = ss.getSheetByName("Config");
      configSheet.getRange(2, 2).setValue(data.password); // Guardar contraseña en Config
      configSheet.getRange(3, 2).setValue(data.logo); // Guardar logo en Config
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Configuración guardada"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Guardar actividad
    if (data.type === "saveActivity") {
      const dayName = ["Dia1", "Dia2", "Dia3", "Dia4"][data.day];
      const sheet = ss.getSheetByName(dayName);
      
      const allData = sheet.getDataRange().getValues();
      let rowIndex = -1;
      
      // Buscar la fila con el ID
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] == data.id) {
          rowIndex = i + 1;
          break;
        }
      }
      
      if (rowIndex === -1) {
        // Insertar nueva fila
        sheet.appendRow([
          data.id,
          data.nom,
          data.tipus,
          data.equip,
          data.hora,
          data.ubicacio,
          data.descripcio,
          data.material,
          data.observacions,
          data.imatge
        ]);
      } else {
        // Actualizar fila existente
        sheet.getRange(rowIndex, 1, 1, 10).setValues([[
          data.id,
          data.nom,
          data.tipus,
          data.equip,
          data.hora,
          data.ubicacio,
          data.descripcio,
          data.material,
          data.observacions,
          data.imatge
        ]]);
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Actividad guardada"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Eliminar actividad
    if (data.type === "deleteActivity") {
      const dayName = ["Dia1", "Dia2", "Dia3", "Dia4"][data.day];
      const sheet = ss.getSheetByName(dayName);
      
      const allData = sheet.getDataRange().getValues();
      
      for (let i = 1; i < allData.length; i++) {
        if (allData[i][0] == data.id) {
          sheet.deleteRow(i + 1);
          break;
        }
      }
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Actividad eliminada"
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
