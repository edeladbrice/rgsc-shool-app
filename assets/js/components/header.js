// Dépendance : Aucune (utilise l'exportation globale 'router' pour l'écoute des changements)

const headerElement = document.getElementById('header');

/**
 * Met à jour l'état actif des liens de navigation basés sur le hachage actuel.
 */
const updateActiveLink = () => {
    const hash = window.location.hash || '#dashboard';
    const navLinks = headerElement.querySelectorAll('.main-nav a');
    
    // Supprime la classe active partout
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Ajoute la classe active au lien correspondant
    const activeLink = headerElement.querySelector(`.main-nav a[href="${hash.split('/')[0]}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
};

/**
 * Rend l'en-tête de l'application.
 * @param {object} settings - Les paramètres de l'école (nom, logo, téléphone, mode sombre).
 */
export const renderHeader = settings => {
  const { schoolLogo, schoolName, schoolPhone, darkMode } = settings;
  const logoSrc = schoolLogo || 'assets/img/logo-placeholder.png';
  
  headerElement.innerHTML = `
    <div class="header-content">
        <div class="header-branding">
            <img src="${logoSrc}" alt="Logo de ${schoolName}" class="logo">
            <div class="school-info">
                <h1 class="school-name">${schoolName || 'Gestion Scolaire RGSC'}</h1>
                <p class="school-phone">Tél : ${schoolPhone || 'Non renseigné'}</p>
            </div>
        </div>
        
        <nav class="main-nav" role="navigation">
            <a href="#dashboard" title="Tableau de bord">Tableau de bord</a>
            <a href="#students" title="Gestion des élèves">Élèves</a>
            <a href="#payments" title="Suivi des paiements">Paiements</a>
            <a href="#stats" title="Statistiques et rapports">Statistiques</a>
            <a href="#settings" title="Paramètres de l'application">Paramètres</a>
        </nav>

        <div class="header-actions">
            <button 
                class="btn-icon theme-toggle" 
                data-action="toggle-dark-mode" 
                title="Basculer le mode sombre"
            >
                ${darkMode ? '☀️' : '🌙'}
            </button>
            <button class="btn-icon user-profile">
                👤
            </button>
        </div>
    </div>
  `;

  // 1. Mettre à jour immédiatement le lien actif au premier chargement
  updateActiveLink();
  
  // 2. S'assurer que le lien actif est mis à jour à chaque changement de hachage
  window.removeEventListener('hashchange', updateActiveLink); // Évite les doublons
  window.addEventListener('hashchange', updateActiveLink);
};
