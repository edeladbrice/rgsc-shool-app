// --- Constantes ---
const TOAST_DURATION = 4000; // Durée d'affichage (4 secondes)

/**
 * Formate un nombre en devise FCFA (Afrique Centrale/Ouest).
 * @param {number|string} n - Le nombre à formater.
 * @returns {string} Le montant formaté, ou une chaîne vide si l'entrée est invalide.
 */
export const formatCurrency = n => {
  const value = parseFloat(n);
  if (isNaN(value)) {
    console.warn(`formatCurrency: Entrée non valide: ${n}`);
    return '';
  }
  // Utilise un format plus précis (sans décimales) et la locale 'fr-FR'
  return `${value.toLocaleString('fr-FR', { 
    minimumFractionDigits: 0, 
    maximumFractionDigits: 0 
  })} FCFA`;
};

/**
 * Affiche une notification temporaire de type 'toast'.
 * @param {string} msg - Le message à afficher.
 * @param {'info' | 'success' | 'error' | 'warning'} [type='info'] - Le type de notification pour le style.
 * @returns {Promise<void>} Une promesse qui se résout lorsque le toast est retiré.
 */
export const toast = (msg, type = 'info') => {
  return new Promise(resolve => {
    // 1. Création de l'élément
    const box = document.createElement('div');
    box.className = `toast ${type}`;
    box.textContent = msg;

    // Ajout d'une classe pour l'animation d'entrée
    box.classList.add('fade-in'); 

    // 2. Injection dans le corps
    document.body.appendChild(box);

    // 3. Temporisation et suppression
    const removeToast = () => {
      // Lance l'animation de sortie
      box.classList.replace('fade-in', 'fade-out'); 
      
      // Retire l'élément après la durée de l'animation de sortie (ex: 500ms)
      setTimeout(() => {
        if (box.parentNode) {
          box.remove();
        }
        resolve(); // Résout la promesse
      }, 500); 
    };

    // Déclenche la suppression après la durée
    setTimeout(removeToast, TOAST_DURATION);
  });
};

/**
 * Bacsule le mode sombre sur l'élément body.
 * @param {boolean} active - Vrai pour activer le mode sombre, Faux pour le désactiver.
 */
export const toggleDarkMode = active => {
  // Utilise directement la classe 'dark-mode' qui est plus sémantique
  document.body.classList.toggle('dark-mode', active);
};


// -------------------------------------------------------------------
// NOTE: Vous aurez besoin du CSS associé pour les toasts
// (À ajouter à assets/css/app.css)
/*
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 15px 25px;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  opacity: 0;
  transition: opacity 0.5s, transform 0.5s;
}

.toast.fade-in {
    opacity: 1;
    transform: translateY(0);
}

.toast.fade-out {
    opacity: 0;
    transform: translateY(50px);
}

.toast.info { background-color: #2196F3; }
.toast.success { background-color: #4CAF50; }
.toast.error { background-color: #f44336; }
.toast.warning { background-color: #ff9800; }
*/
