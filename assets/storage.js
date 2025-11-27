const KEY = 'rgsc-data-v1';

/**
 * Initialise l'objet de données par défaut.
 * @returns {object} L'objet de données de base.
 */
const initBlank = () => ({
  settings: {
    schoolName: 'Nom de l’école',
    schoolPhone: '',
    schoolAddress: '',
    schoolLogo: '',
    signatureName: 'Le Directeur',
    signatureTitle: 'Directeur',
    schoolYearStartMonth: 9
  },
  currentSchoolYear: '',
  schoolYears: {}
});

// ------------------------------------------------------------------
// --- Fonctions de base (chargement et sauvegarde complètes) ---
// ------------------------------------------------------------------

/**
 * Charge l'objet de données complet depuis localStorage.
 * Retourne l'objet vierge en cas d'erreur ou d'absence de données.
 * @returns {object} Les données chargées ou les données par défaut.
 */
export const loadData = () => {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initBlank();
    
    const loadedData = JSON.parse(raw);
    
    // Assurez-vous que les données chargées incluent toutes les clés par défaut
    // Ceci est crucial pour les futures mises à jour du modèle de données
    return { ...initBlank(), ...loadedData }; 
    
  } catch (e) {
    console.error('Erreur lors du chargement ou du parsing localStorage:', e);
    return initBlank();
  }
};

/**
 * Sauvegarde l'objet de données complet dans localStorage.
 * @param {object} payload - L'objet de données à sauvegarder.
 */
export const saveData = payload => {
  try {
    localStorage.setItem(KEY, JSON.stringify(payload));
  } catch (e) {
    // Vérification du code d'erreur spécifique au dépassement de quota (QuotaExceededError)
    if (e.name === 'QuotaExceededError') {
      console.error('Espace de stockage local plein. Impossible de sauvegarder.', e);
      alert('Erreur de sauvegarde : Espace de stockage local plein.');
    } else {
      console.error('Erreur lors de la sauvegarde localStorage:', e);
    }
  }
};

// ------------------------------------------------------------------
// --- Fonctions utilitaires (pour des opérations ciblées) ---
// ------------------------------------------------------------------

/**
 * Supprime la clé de données principale de localStorage.
 */
export const clearData = () => {
  try {
    localStorage.removeItem(KEY);
    console.log('Données RGSC effacées de localStorage.');
  } catch (e) {
    console.error('Erreur lors de la suppression des données localStorage:', e);
  }
};

/**
 * Met à jour un champ spécifique dans le store sans écraser le reste.
 * @param {string} keyPath - Le chemin de la clé à mettre à jour (ex: 'settings.schoolName').
 * @param {*} value - La nouvelle valeur.
 */
export const updateDataField = (keyPath, value) => {
    const fullData = loadData();
    const parts = keyPath.split('.');
    let current = fullData;

    // Traverse le chemin pour atteindre l'objet parent
    for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part] || typeof current[part] !== 'object') {
            // Si le chemin n'existe pas, on l'initialise (pour la robustesse)
            current[part] = {};
        }
        current = current[part];
    }

    // Définit la valeur finale
    current[parts[parts.length - 1]] = value;

    saveData(fullData);
    return fullData;
};
