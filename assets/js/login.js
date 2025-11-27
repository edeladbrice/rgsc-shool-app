import { saveData, loadData } from './storage.js';
import { toggleDarkMode } from './utils.js';

// --- Constantes et Éléments DOM ---
const ANIM_DURATION = 1500; // Durée de l'animation CSS (à synchroniser avec le CSS)
const DELAY_MESSAGE = 3000; // Temps d'affichage de chaque message
const DELAY_FADE = 500;     // Temps entre les messages

const msgs = ['msg1', 'msg2', 'msg3'].map(id => document.getElementById(id));
const btns = document.getElementById('buttons');
const final = document.getElementById('final-message');
const authBox = document.getElementById('auth-container');
const body = document.body;

// --- Fonctions Utilitaires ---

/**
 * Gère l'affichage/masquage des éléments avec une classe d'animation.
 * Assurez-vous que le CSS définit la transition de 'hidden' ou 'show'.
 */
const toggleVisibility = (el, show = true) => {
    if (show) {
        el.classList.remove('hidden');
        // Ajoute un petit délai pour s'assurer que l'élément est dans le DOM avant d'appliquer l'animation
        setTimeout(() => el.classList.add('show'), 10); 
    } else {
        el.classList.remove('show');
        // Masque l'élément complètement après la durée de l'animation
        setTimeout(() => el.classList.add('hidden'), ANIM_DURATION);
    }
};

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// --- Séquence d'Introduction ---
const startSequence = async () => {
    // 1. Message 1
    toggleVisibility(msgs[0]); 
    await delay(DELAY_MESSAGE);
    toggleVisibility(msgs[0], false); 
    await delay(DELAY_FADE);
    
    // 2. Message 2
    toggleVisibility(msgs[1]); 
    await delay(DELAY_MESSAGE);
    toggleVisibility(msgs[1], false); 
    await delay(DELAY_FADE);

    // 3. Message 3 et Boutons
    toggleVisibility(msgs[2]); 
    toggleVisibility(btns);
};

// --- Actions Utilisateur ---

const enter = async () => {
    // Masquer les boutons et le message 3
    toggleVisibility(msgs[2], false);
    toggleVisibility(btns, false);
    
    // Afficher le message final "BIENVENUE"
    toggleVisibility(final);
    
    // Attendre la durée du message de bienvenue
    await delay(3000); 

    // Masquer le message final et afficher le formulaire
    toggleVisibility(final, false);
    
    // Attendre que l'animation de masquage soit terminée
    await delay(ANIM_DURATION); 

    loadLoginForm();
};

const exit = () => {
    // Enregistre peut-être une préférence avant de partir
    // saveData('lastAction', 'exit'); 
    
    // Remplace le contenu du corps avec le message de sortie
    body.innerHTML = '<h1 class="exit-message">😔 Si ainsi est votre choix... au revoir.</h1>';
};

const loadLoginForm = () => {
    // Afficher le conteneur d'authentification
    authBox.classList.remove('hidden');
    
    // Charger le formulaire (Injection plus propre)
    authBox.innerHTML = `
        <div class="auth-box">
            <h2>Connexion</h2>
            <form id="login-form" autocomplete="off">
                <p id="auth-status" class="hidden" aria-live="polite"></p>
                <input name="username" type="text" placeholder="Nom d'utilisateur (Ex: ${loadData('lastUsername') || 'Neo'})" required>
                <input name="password" type="password" placeholder="Mot de passe" required>
                <div class="form-actions">
                    <button type="submit" class="btn primary">Se connecter</button>
                    <button type="button" class="btn secondary" data-action="toggle-dark">🌙 Mode sombre</button>
                </div>
            </form>
            <button class="link-btn" data-action="register">Pas encore de compte ?</button>
        </div>`;

    // Attacher les écouteurs d'événements au nouveau contenu
    authBox.querySelector('#login-form').addEventListener('submit', handleLogin);
    authBox.querySelector('.form-actions').addEventListener('click', handleAuthActions);
};

const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.target;
    const username = form.elements.username.value;
    const password = form.elements.password.value;
    const authStatus = document.getElementById('auth-status');
    
    // Afficher l'état de l'authentification
    authStatus.textContent = 'Connexion en cours...';
    authStatus.classList.remove('hidden');
    
    // Désactiver le bouton pendant l'attente
    form.querySelector('button[type="submit"]').disabled = true;

    try {
        // --- SIMULATION d'appel API ---
        await delay(2000); 
        
        if (username === 'Neo' && password === 'matrix') { // Exemple de succès
            saveData('lastUsername', username);
            authStatus.textContent = 'Succès ! Redirection...';
            window.location.href = 'app.html';
        } else {
            throw new Error("Nom d'utilisateur ou mot de passe incorrect.");
        }
    } catch (error) {
        authStatus.textContent = `Erreur: ${error.message}`;
        authStatus.style.color = 'red';
        form.querySelector('button[type="submit"]').disabled = false;
    }
};

const handleAuthActions = (e) => {
    const action = e.target.dataset.action;
    
    if (action === 'toggle-dark') {
        toggleDarkMode(); // Utilise la fonction importée
    } else if (action === 'register') {
        alert('Afficher le formulaire d\'inscription ou rediriger vers /register');
    }
};

// --- Initialisation ---

// Ajout des écouteurs d'événements pour les boutons d'action (Entrer/Sortir)
btns.querySelector('[data-action="enter"]').addEventListener('click', enter);
btns.querySelector('[data-action="exit"]').addEventListener('click', exit);

// Lancer la séquence d'introduction au chargement
startSequence();
