/* =================================================================== */
/* 0. VARIABLES & THÈME (Dark Mode)                                    */
/* =================================================================== */
:root {
  /* Couleurs de base */
  --primary: #4CAF50;
  --dark: #2E7D32;
  --success: #00897B; /* Teal */
  --danger: #D32F2F; /* Red */
  --info: #1976D2; /* Blue */
  
  /* Layout et Espacement */
  --gap: 1.5rem;
  --radius: 8px;
  --shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  /* Thème Clair (Par défaut) */
  --bg-color: #f7f9fc;
  --surface-color: #fff;
  --text-color: #333;
  --border-color: #e0e0e0;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

/* Thème Sombre */
body.dark-mode {
  --bg-color: #121212;
  --surface-color: #1e1e1e;
  --text-color: #e0e0e0;
  --border-color: #333;
  --shadow-color: rgba(255, 255, 255, 0.05);
}


/* =================================================================== */
/* 1. BASE LAYOUT ET TYPOGRAPHIE                                       */
/* =================================================================== */
body {
  margin: 0;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  background: var(--bg-color);
  color: var(--text-color);
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  transition: background-color .3s, color .3s;
}

#main {
  padding: var(--gap);
  overflow-y: auto;
}

h1, h2, h3 {
    color: var(--dark);
    transition: color .3s;
}
body.dark-mode h1, body.dark-mode h2, body.dark-mode h3 {
    color: var(--primary);
}

/* ------------------------------------------------------------------- */
/* 2. HEADER ET NAVIGATION                                             */
/* ------------------------------------------------------------------- */

header {
  /* Aligné sur le nouveau HTML injecté par renderHeader */
  background: var(--primary);
  color: #fff;
  padding: 0 var(--gap);
  box-shadow: 0 2px 4px var(--shadow-color);
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.header-branding {
    display: flex;
    align-items: center;
}

.logo {
    height: 40px;
    margin-right: 15px;
    border-radius: 50%;
}

.school-info {
    font-size: 0.9em;
}
.school-name {
    margin: 0;
    font-size: 1.2em;
    font-weight: 700;
    color: var(--text-color); /* Le h1 est dans header-branding et doit être géré */
}
.school-phone { margin: 0; opacity: 0.8; }


/* Navigation principale */
.main-nav a {
  color: #fff;
  margin: 0 10px;
  padding: 10px 5px;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 3px solid transparent;
  transition: border-bottom-color .3s;
}

.main-nav a:hover, .main-nav a.active {
  border-bottom-color: var(--surface-color); /* Ligne blanche sous le lien actif */
}

/* Actions d'en-tête (Mode Sombre, Profil) */
.header-actions {
    display: flex;
    gap: 10px;
}

.btn-icon {
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1.5em;
    color: #fff;
    padding: 5px;
    border-radius: 50%;
    transition: background-color .3s;
}
.btn-icon:hover {
    background-color: var(--dark);
}

/* ------------------------------------------------------------------- */
/* 3. CARTES ET FORMULAIRES                                            */
/* ------------------------------------------------------------------- */

.view-container {
    display: flex;
    flex-direction: column;
    gap: var(--gap);
}

.card {
    background: var(--surface-color);
    padding: var(--gap);
    border-radius: var(--radius);
    box-shadow: var(--shadow);
    border: 1px solid var(--border-color);
}
body.dark-mode .card {
    border-color: var(--border-color);
}

.form-grid, .form-grid-small {
    display: grid;
    gap: 10px;
    align-items: end;
}
.form-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}
.form-grid-small {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
}

input[type="text"], input[type="number"], select {
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 4px;
    background-color: var(--surface-color);
    color: var(--text-color);
    transition: border-color .3s, box-shadow .3s;
}
input:focus, select:focus {
    border-color: var(--primary);
    box-shadow: 0 0 5px rgba(76, 175, 80, 0.5);
    outline: none;
}


/* ------------------------------------------------------------------- */
/* 4. BOUTONS                                                          */
/* ------------------------------------------------------------------- */

button {
  padding: .6rem 1rem;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color .3s, opacity .3s, transform .1s;
}
button:hover {
    opacity: 0.9;
}
button:active {
    transform: translateY(1px);
}

/* Couleurs des boutons */
.btn.primary { background: var(--primary); color: #fff; }
.btn.success { background: var(--success); color: #fff; }
.btn.danger { background: var(--danger); color: #fff; }
.btn.secondary { 
    background: transparent; 
    border: 1px solid var(--primary); 
    color: var(--primary); 
}
.btn-icon.btn-delete { color: var(--danger); background: none; }
.btn-icon.btn-edit { color: var(--info); background: none; }

/* ------------------------------------------------------------------- */
/* 5. TABLEAUX DE DONNÉES (DATA-TABLE)                                 */
/* ------------------------------------------------------------------- */

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: .75rem 1rem;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

.data-table th {
    background-color: var(--border-color);
    color: var(--text-color);
    font-weight: 700;
    text-transform: uppercase;
    font-size: 0.9em;
}
body.dark-mode .data-table th {
    background-color: #2e2e2e;
}

.data-table tr:hover {
    background-color: var(--bg-color);
}
body.dark-mode .data-table tr:hover {
    background-color: #242424;
}

/* Styles pour les soldes dans les tableaux */
.solde-due { color: var(--danger); font-weight: 700; }
.solde-ok { color: var(--success); font-weight: 700; }
.solde-over { color: var(--info); font-weight: 700; } /* Paiement en excès */
.empty-list { text-align: center; color: #777; padding: 2rem !important; font-style: italic; }

.action-col {
    width: 100px;
    text-align: center;
}
.action-cell {
    display: flex;
    gap: 5px;
    justify-content: center;
    align-items: center;
}


/* ------------------------------------------------------------------- */
/* 6. TOASTS ET FEEDBACK                                               */
/* ------------------------------------------------------------------- */

.toast {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  padding: 15px 25px;
  border-radius: var(--radius);
  color: white;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 9999;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.5s, transform 0.5s;
}

/* Classes d'animation de utils.js */
.toast.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.toast.fade-out {
    opacity: 0;
    transform: translateY(50px);
}

/* Couleurs des Toasts */
.toast.info { background-color: var(--info); }
.toast.success { background-color: var(--success); }
.toast.error { background-color: var(--danger); }
.toast.warning { background-color: #FFC107; color: var(--text-color); } /* Jaune */


/* ------------------------------------------------------------------- */
/* 7. PRINT MEDIA QUERY (Amélioration du reçu)                         */
/* ------------------------------------------------------------------- */

@media print {
  /* Masquer tout sauf la zone d'impression */
  body * { visibility: hidden !important; }
  
  /* Rendre la zone d'impression visible et centrer */
  .printable-area, .printable-area * { visibility: visible !important; }
  .printable-area {
      position: absolute !important;
      left: 0;
      top: 0;
      width: 100%;
      height: auto;
      margin: 0;
      padding: 0;
      color: black !important;
      background: white !important;
      box-shadow: none !important;
  }
}

/* ------------------------------------------------------------------- */
/* 8. RESPONSIVITÉ (Minimale)                                          */
/* ------------------------------------------------------------------- */
@media (max-width: 768px) {
    /* Réduction de l'espace dans le header */
    .header-content {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }
    .main-nav {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
    }
    .main-nav a {
        margin: 5px;
        padding: 5px 8px;
        font-size: 0.9em;
    }
    .header-actions {
        width: 100%;
        justify-content: flex-end;
    }
    .school-info {
        display: none; /* Cache les détails de l'école sur petit écran pour économiser de la place */
    }
}
