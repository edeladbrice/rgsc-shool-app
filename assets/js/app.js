import { loadData, saveData, updateDataField } from './storage.js';
import { renderHeader } from './components/header.js';
import { router } from './router.js';
import { toggleDarkMode } from './utils.js';

// --- État Global de l'Application ---
let appState = {};
const main = document.getElementById('main');
const loadingSpinner = document.getElementById('loading-spinner');

/**
 * Retourne l'état actuel de l'application.
 * @returns {object} Les données RGSC.
 */
export const getState = () => appState;

/**
 * Met à jour l'état de l'application, le sauvegarde dans le stockage local,
 * et déclenche les re-rendus nécessaires (si besoin).
 * @param {string} keyPath - Le chemin de la propriété à mettre à jour (ex: 'settings.schoolName').
 * @param {*} value - La nouvelle valeur.
 */
export const updateState = (keyPath, value) => {
  // Utilisez la fonction updateDataField pour mettre à jour et sauvegarder les données
  const updatedData = updateDataField(keyPath, value);
  appState = updatedData;
  
  // Re-rendu spécifique basé sur le changement (à développer dans les composants)
  if (keyPath.startsWith('settings.')) {
    renderHeader(appState.settings); // Mettre à jour l'en-tête si les paramètres changent
  }
};

/**
 * Gère les actions globales déclenchées par les composants
 */
const handleGlobalActions = (e) => {
    const action = e.target.dataset.action;
    
    if (action === 'toggle-dark-mode') {
        const currentMode = appState.settings.darkMode;
        const newMode = !currentMode;
        
        toggleDarkMode(newMode); // Applique le changement
        updateState('settings.darkMode', newMode); // Sauvegarde le changement dans l'état
    }
    // Ajouter d'autres actions globales ici (ex: logout)
};

const init = () => {
  // 1. Charger l'état initial et initialiser la variable
  appState = loadData();
  
  // 2. Initialiser le Mode Sombre (à partir de l'état chargé)
  const isDarkMode = appState.settings.darkMode || false;
  toggleDarkMode(isDarkMode);
  
  // 3. Rendre les composants statiques (Header, etc.)
  renderHeader(appState.settings);
  
  // 4. Initialiser le Routeur
  router(window.location.hash || '#dashboard');
  window.addEventListener('hashchange', () => router(window.location.hash));
  
  // 5. Écouteurs d'événements globaux
  document.addEventListener('click', handleGlobalActions);

  // 6. Masquer l'écran de chargement une fois l'initialisation terminée
  if (loadingSpinner) {
      loadingSpinner.style.display = 'none';
  }
};

// Démarrer l'application
init();
