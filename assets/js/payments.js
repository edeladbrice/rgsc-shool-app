import { loadData, saveData } from './storage.js';
import { formatCurrency, toast } from './utils.js';
import { printReceipt } from './print.js';

const mainContainer = document.getElementById('main');
const PAYMENT_TABLE_ID = 'payment-table';

// -------------------------------------------------------------------
// --- LOGIQUE DE GESTION DE L'ÉTAT ---
// -------------------------------------------------------------------

/**
 * Met à jour le montant payé d'un élève.
 * @param {object} app - L'état complet de l'application.
 * @param {string} studentId - L'ID de l'élève.
 * @param {number} amount - Le montant à ajouter ou soustraire.
 * @param {boolean} isAddition - Vrai pour ajouter, Faux pour soustraire.
 * @returns {object|null} L'objet élève mis à jour ou null si non trouvé.
 */
const updateStudentPayment = (app, studentId, amount, isAddition = true) => {
    const year = app.currentSchoolYear;
    const st = app.schoolYears[year]?.students?.find(s => s.id === studentId);

    if (st) {
        if (isAddition) {
            st.amountPaid += amount;
        } else {
            // S'assurer que le montant payé ne devienne pas négatif
            st.amountPaid = Math.max(0, st.amountPaid - amount);
        }
        return st;
    }
    return null;
};

// -------------------------------------------------------------------
// --- FONCTIONS PUBLIQUES (API du module) ---
// -------------------------------------------------------------------

/**
 * Enregistre un nouveau paiement et met à jour le montant dû de l'élève.
 */
export const recordPayment = (student, amount, type = 'Cash') => {
    const app = loadData();
    const year = app.currentSchoolYear;

    if (!year || !app.schoolYears[year] || !app.schoolYears[year].payments) {
        toast("Erreur: Année scolaire ou structure de paiement non initialisée.", 'error');
        return;
    }

    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
        toast("Veuillez saisir un montant de paiement valide.", 'error');
        return;
    }

    const pay = {
        id: crypto.randomUUID(),
        studentId: student.id,
        matricule: student.matricule,
        name: student.name,
        className: student.className,
        amount: numericAmount,
        type,
        date: new Date().toISOString()
    };
    
    app.schoolYears[year].payments.push(pay);
    
    const updatedStudent = updateStudentPayment(app, student.id, numericAmount, true);

    if (updatedStudent) {
        saveData(app);
        toast(`Paiement de ${formatCurrency(numericAmount)} enregistré pour ${student.name}.`, 'success');
        printReceipt(pay, updatedStudent);
        renderList();
    } else {
        toast(`Erreur: Élève avec ID ${student.id} non trouvé.`, 'error');
    }
};

/**
 * Annule un paiement et rembourse le montant à l'élève.
 */
const removePayment = (id, studentId, amount) => {
    if (!confirm(`Voulez-vous vraiment annuler ce paiement de ${formatCurrency(amount)} ?`)) return;

    const app = loadData();
    const year = app.currentSchoolYear;
    
    // 1. Suppression du paiement de la liste
    const initialLength = app.schoolYears[year].payments.length;
    app.schoolYears[year].payments = app.schoolYears[year].payments.filter(p => p.id !== id);
    
    if (app.schoolYears[year].payments.length === initialLength) {
        toast('Erreur: Paiement non trouvé.', 'error');
        return;
    }

    // 2. Mise à jour du montant payé de l'élève (soustraction)
    const updatedStudent = updateStudentPayment(app, studentId, amount, false);

    if (updatedStudent) {
        saveData(app);
        toast('Paiement annulé et compte de l\'élève mis à jour.', 'info');
        renderList();
    } else {
        // Le paiement a été supprimé, mais l'élève original n'existe plus
        console.warn(`Paiement annulé, mais élève ${studentId} introuvable pour mise à jour.`);
        saveData(app);
        renderList();
    }
};

// -------------------------------------------------------------------
// --- RENDU DE VUE ET GESTION DES ÉVÉNEMENTS ---
// -------------------------------------------------------------------

/**
 * Rend le corps du tableau des paiements.
 */
const renderList = () => {
    const app = loadData();
    const payments = app.schoolYears[app.currentSchoolYear]?.payments || [];
    const tbody = mainContainer.querySelector(`#${PAYMENT_TABLE_ID} tbody`);

    if (!tbody) return;

    if (payments.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="empty-list">Aucun paiement enregistré pour cette année.</td></tr>';
        return;
    }
    
    // Affichage des paiements du plus récent au plus ancien
    const sortedPayments = payments.slice().sort((a, b) => new Date(b.date) - new Date(a.date));

    tbody.innerHTML = sortedPayments.map(p => `
    <tr>
        <td>${new Date(p.date).toLocaleDateString('fr-FR', { dateStyle: 'short', timeStyle: 'short' })}</td>
        <td><a href="#students/view/${p.studentId}" title="Voir le profil">${p.name}</a></td>
        <td>${formatCurrency(p.amount)}</td>
        <td>${p.type}</td>
        <td class="action-cell">
            <button 
                class="btn-icon btn-delete" 
                data-action="delete-payment" 
                data-id="${p.id}" 
                data-studentid="${p.studentId}"
                data-amount="${p.amount}"
                title="Annuler ce paiement">
                🗑️
            </button>
        </td>
    </tr>`).join('');
};

/**
 * Gère les événements clics dans le conteneur principal (délégation).
 */
const handlePaymentActions = (e) => {
    const target = e.target.closest('[data-action="delete-payment"]');
    if (target) {
        const id = target.dataset.id;
        const studentId = target.dataset.studentid;
        const amount = parseFloat(target.dataset.amount);
        removePayment(id, studentId, amount);
    }
    // Gérer les autres actions ici (ex: impression)
};

/**
 * Fonction de rendu principale appelée par le routeur.
 */
export const renderPayments = () => {
    mainContainer.innerHTML = `
        <section class="view-container">
            <h2>Suivi des Paiements</h2>

            <div class="card form-card">
                <h3>Enregistrer un nouveau paiement</h3>
                <p>Pour enregistrer un paiement, veuillez d'abord rechercher l'élève.</p>
                <form id="search-form" class="form-grid">
                    <input name="search-term" placeholder="Rechercher par Matricule ou Nom de l'élève" required>
                    <button type="submit" class="btn primary">Rechercher</button>
                </form>
                
                <div id="payment-input-area" class="hidden">
                    </div>
            </div>

            <div class="card table-card">
                <h3>Historique des Transactions</h3>
                <table id="${PAYMENT_TABLE_ID}" class="data-table">
                    <thead>
                        <tr>
                            <th>Date & Heure</th>
                            <th>Élève</th>
                            <th>Montant</th>
                            <th>Type</th>
                            <th class="action-col">Action</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        </section>`;

    // Écouteur d'événement pour le tableau (délégation pour la suppression)
    const table = mainContainer.querySelector(`#${PAYMENT_TABLE_ID}`);
    table.addEventListener('click', handlePaymentActions);

    // Écouteur d'événement pour la recherche d'élève
    mainContainer.querySelector('#search-form').addEventListener('submit', handleSearchSubmit);
    
    // Rendu initial de la liste
    renderList();
};

// --- LOGIQUE DE RECHERCHE D'ÉLÈVE (Simplifié pour l'exemple) ---
const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchTerm = e.target.elements['search-term'].value.trim().toLowerCase();
    
    const app = loadData();
    const students = app.schoolYears[app.currentSchoolYear]?.students || [];

    const foundStudent = students.find(s => 
        s.matricule.toLowerCase() === searchTerm || 
        s.name.toLowerCase().includes(searchTerm)
    );

    const paymentInputArea = document.getElementById('payment-input-area');
    paymentInputArea.classList.remove('hidden');

    if (foundStudent) {
        // Afficher le formulaire d'enregistrement
        renderPaymentForm(foundStudent);
    } else {
        paymentInputArea.innerHTML = `<p class="error-message">Aucun élève trouvé correspondant à "${searchTerm}".</p>`;
    }
};

const renderPaymentForm = (student) => {
    const paymentInputArea = document.getElementById('payment-input-area');
    const solde = student.totalAmount - student.amountPaid;
    
    paymentInputArea.innerHTML = `
        <div class="student-result-card">
            <h4>Élève trouvé : ${student.name} (${student.matricule})</h4>
            <p>Classe : ${student.className}</p>
            <p class="${solde > 0 ? 'solde-due' : 'solde-ok'}">
                Solde restant dû : <strong>${formatCurrency(solde)}</strong>
            </p>
        </div>
        
        <form id="record-payment-form" class="form-grid-small">
            <input name="amount" type="number" step="100" min="1" placeholder="Montant du paiement" required>
            <select name="type">
                <option value="Cash">Espèces</option>
                <option value="MobileMoney">Mobile Money</option>
                <option value="BankTransfer">Virement Bancaire</option>
            </select>
            <button type="submit" class="btn success">Enregistrer le paiement</button>
        </form>
    `;

    document.getElementById('record-payment-form').addEventListener('submit', e => {
        e.preventDefault();
        const amount = e.target.elements.amount.value;
        const type = e.target.elements.type.value;
        recordPayment(student, amount, type);
        
        // Cacher la zone d'input après succès
        paymentInputArea.classList.add('hidden');
        document.getElementById('search-form').reset();
    });
};
