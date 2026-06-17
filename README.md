# 🌊 Activitats Hotel Cambrils

Aplicació web per gestionar el programa d'activitats d'un hotel turístic a Cambrils. Construïda amb **Google Apps Script** + **Google Sheets** com a base de dades.

---

## 📋 Estructura del projecte

```
hotel-cambrils-activitats/
├── Code.gs          → Backend (Google Apps Script)
├── Index.html       → Frontend (HTML + CSS + JS)
├── appsscript.json  → Manifest del projecte GAS
├── .clasp.json      → Configuració de clasp (CLI)
├── .gitignore
└── README.md
```

---

## 🗂️ Estructura del Google Sheets

El Sheets es crea automàticament en executar `setupSheets()`.

| Pestanya | Contingut |
|----------|-----------|
| **Config** | Configuració general (dates, contrasenya, icono) |
| **Dia1** | Activitats del dia 1 |
| **Dia2** | Activitats del dia 2 |
| **Dia3** | Activitats del dia 3 |
| **Dia4** | Activitats del dia 4 |

### Pestanya Config

| Fila | Columna A | Columna B |
|------|-----------|-----------|
| 1 | Clau *(capçalera)* | Valor *(capçalera)* |
| 2 | `data_dia_1` | Data del dia 1 (ex: `2025-07-10`) |
| 3 | `data_dia_2` | Data del dia 2 |
| 4 | `data_dia_3` | Data del dia 3 |
| 5 | `data_dia_4` | Data del dia 4 |
| 6 | `pass_admin` | Contrasenya del panell admin (ex: `admin123`) |
| 7 | `icono` | URL de la imatge del logo de la web |

### Pestanyes Dia1–Dia4

Cada fila és una activitat amb les columnes:
`ID | Nom | Tipus | Equip | Hora | Ubicació | Descripció | Material | Observacions | Imatge`

- **Tipus**: `1` = Esportiva · `2` = Cultural · `3` = Show

---

## 🚀 Desplegament (primera vegada)

### Opció A — Des de l'editor web de GAS (recomanat)

1. Ves a [script.google.com](https://script.google.com) → **Nou projecte**
2. Canvia el nom del projecte (ex: *Activitats Hotel Cambrils*)
3. Copia el contingut de `Code.gs` al fitxer `Code.gs` de l'editor
4. Crea un fitxer HTML: **+** → *Fitxer HTML* → nom: `Index` → enganxa el contingut de `Index.html`
5. A *Configuració del projecte* activa **"Mostra el fitxer manifest appsscript.json"** i copia el contingut de `appsscript.json`
6. **Desa** (Ctrl+S)
7. Al menú de l'editor: **Desplegar → Nova implementació**
   - Tipus: **Aplicació web**
   - Executar com: **Jo**
   - Qui té accés: **Tothom** (o *Tothom dins de l'organització*)
   - Clica **Desplegar** i copia la URL generada
8. Obre el Google Sheets associat al projecte (o crea'n un de nou i vincula'l)
9. Des del Sheets: menú **🌊 Hotel Cambrils → Crear / Reinicialitzar pestanyes**

### Opció B — Amb clasp (línia de comandes)

Requereix [Node.js](https://nodejs.org) instal·lat.

```bash
# 1. Instal·lar clasp globalment
npm install -g @google/clasp

# 2. Autenticar-se amb Google
clasp login

# 3. Clonar aquest repositori
git clone https://github.com/EL_TEU_USUARI/hotel-cambrils-activitats.git
cd hotel-cambrils-activitats

# 4. Crear un nou projecte GAS vinculat a un Sheets
clasp create --type sheets --title "Activitats Hotel Cambrils"
# Això actualitza .clasp.json amb el scriptId real

# 5. Pujar els fitxers al projecte GAS
clasp push

# 6. Obrir l'editor GAS per desplegar
clasp open
# → Desplegar → Nova implementació → Aplicació web
```

---

## 🔄 Actualitzar el codi (després de canvis)

### Des de l'editor web
Edita els fitxers directament a [script.google.com](https://script.google.com) i fes:
**Desplegar → Gestionar implementacions → ✏️ editar → Nova versió → Desplegar**

### Amb clasp
```bash
# Modificar els fitxers localment, després:
clasp push

# Crear nova versió del desplegament
clasp deploy --description "v1.1 - descripció del canvi"
```

---

## ⚙️ Configuració

### Canviar la contrasenya d'admin
Edita directament la cel·la **B6** de la pestanya **Config** del Sheets.

### Canviar el logo
Posa la URL de la imatge a la cel·la **B7** de la pestanya **Config**. La imatge substituirà la 🌊 del header.

### Canviar les dates dels dies
Des del panell d'admin de la web (icona ⚙️) o editant les cel·les **B2–B5** del Sheets.

---

## 🗃️ Tipus d'activitats

| Codi | Nom | Color |
|------|-----|-------|
| `1` | 🏃 Esportiva | Taronja |
| `2` | 🎭 Cultural | Porpra |
| `3` | 🎉 Show | Turquesa |

---

## 🛠️ Tecnologies

- **Backend**: Google Apps Script (V8)
- **Base de dades**: Google Sheets
- **Frontend**: HTML5 + CSS3 + JavaScript (vanilla)
- **Fonts**: Google Fonts (Playfair Display + Inter)
- **Desplegament**: Google Apps Script Web App

---

## 📝 Notes tècniques

- No hi ha `localStorage` ni cap estat persistent al client. Totes les dades es llegeixen i escriuen directament al Sheets via `google.script.run`.
- El `scriptId` de `.clasp.json` s'ha d'actualitzar amb l'ID real del projecte GAS (visible a *Configuració del projecte* a l'editor).
- La contrasenya d'admin **no està xifrada** al Sheets. No utilitzis contrasenyes sensibles.
