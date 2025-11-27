import { renderDashboard } from './dashboard.js';
import { renderStudents } from './student.js';
import { renderPayments } from './payment.js';
import { renderStats } from './stats.js';
import { renderSettings } from './settings.js';

const mainContainer = document.getElementById('main');

/**
 * Analyse le hash de l'URL pour extraire la route de base et les paramètres.
 * Ex: '#students/view/123' -> { route: '#students', params: ['view', '123'] }
 * Ex: '#settings' -> { route: '#settings', params: [] }
 */
const parseHash = (hash) => {
    // Supprime le '#' initial et divise par '/'
    const parts = hash.substring(1).split('/').filter(p => p.length > 0);
    
    // La route de base est le premier segment, préfixé de '#'
    const baseRoute = parts.length > 0 ? `#${parts[0]}` : null;
    
    // Les paramètres sont les segments restants
    const params = parts.slice(1);

    return { baseRoute, params };
};

// Mappage des routes de base vers les fonctions de rendu
const routes = {
  '#dashboard': renderDashboard,
  '#students': renderStudents,
  '#payments': renderPayments,
  '#stats': renderStats,
  '#settings': renderSettings
  // Ajoutez plus de routes de base ici (ex: #teachers, #classes)
};

/**
 * Fonction de rendu pour les routes non trouvées (404).
 */
const render404 = () => {
    mainContainer.innerHTML = `
        <div class="error-page">
            <h2>⚠️ Erreur 404 : Page Non Trouvée</h2>
            <p>La ressource demandée n'existe pas. Veuillez vérifier l'URL.</p>
            <button onclick="window.location.hash='#dashboard'" class="btn primary">
                Retour au Tableau de Bord
            </button>
        </div>
    `;
};

/**
 * Fonction principale du routeur. 
 * Rend la vue basée sur le hachage de l'URL, en passant les paramètres.
 * @param {string} hash - Le hachage complet de la fenêtre (ex: '#students/view/123').
 */
export const router = (hash) => {
  const { baseRoute, params } = parseHash(hash);
  const renderFunction = routes[baseRoute];
  
  // 1. Afficher un état de chargement et effacer l'ancienne vue
  mainContainer.innerHTML = '<div class="loading-state">Chargement de la vue...</div>';

  if (renderFunction) {
    try {
      // 2. Exécuter la fonction de rendu, en passant les paramètres extraits
      renderFunction(params);
    } catch (error) {
      console.error(`Erreur lors du rendu de la route ${baseRoute}:`, error);
      mainContainer.innerHTML = `
        <div class="error-page">
            <h2>❌ Erreur de Rendu</h2>
            <p>Un problème est survenu lors du chargement de cette page. Détails : ${error.message}</p>
        </div>
      `;
    }
  } else {
    // 3. Gérer les routes non définies
    render404();
  }
};
