import { loadData, saveData } from './storage.js';
import { formatCurrency, toast } from './utils.js';
// NOTE: Dans une application plus grande, vous importeriez getState et updateState de './app.js'
// import { getState, updateState } from './app.js'; 

const mainContainer = document.getElementById('main');
const STUDENT_TABLE_ID = 'student-table';

/**
 * Gestionnaire d'ajout d'élève.
 */
const addStudent = (data) => {
  // Remplacer loadData() par getState() dans l'application finale
  const app = loadData(); 
  const year = app.currentSchoolYear;
  
  // 1. Validation de l'année scolaire
  if (!year || !app.schoolYears[year]) {
    toast('Année scolaire actuelle non définie ou inexistante.', 'error');
    return false;
  }
  
  // 2. Validation de l'existence du matricule
  const students = app.schoolYears[year].students || [];
  const exists = students.find(s => s.matricule === data.matricule);
  if (exists) { 
    toast(`Le matricule "${data.matricule}" est déjà utilisé.`, 'error'); 
    return false; 
  }
  
  const newStudent = {
    id: crypto.randomUUID(),
    matricule: data.matricule,
    name: data.name.trim(),
    className: data.class.trim(),
    totalAmount: parseFloat(data.total),
    amountPaid: 0,
    // Ajout d'une date de création pour le suivi
    createdAt: new Date().toISOString() 
  };
  
  // 3. Ajout et Sauvegarde
  app.schoolYears[year].students.push(newStudent);
  // Remplacer saveData() par updateState() dans l'application finale
  saveData(app); 
  
  toast('Élève ajouté avec succès !', 'success');
  return true;
};

/**
 * Supprime un élève par son ID.
 * @param {string} id - L'ID unique de l'élève.
 */
const removeStudent = (id) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet élève ?')) return;

  const app = loadData();
  const year = app.currentSchoolYear;
  
  app.schoolYears[year].students = app.schoolYears[year].students.filter(s => s.id !== id);
  
  saveData(app);
  toast('Élève supprimé.', 'info');
  renderList();
};

/**
 * Gère les actions sur les lignes du tableau (supprimer, modifier).
 * Utilise la délégation d'événements.
 */
const handleTableActions = (e) => {
    const action = e.target.dataset.action;
    const studentId = e.target.dataset.id;
    
    if (studentId) {
        if (action === 'delete') {
            removeStudent(studentId);
        } else if (action === 'edit') {
            // NOTE: Ceci redirigerait vers une page d'édition ou ouvrirait une modale
            window.location.hash = `#students/edit/${studentId}`; 
        }
    }
};

/**
 * Rend le corps du tableau des élèves.
 */
const renderList = () => {
  const app = loadData();
  const students = app.schoolYears[app.currentSchoolYear]?.students || [];
  const tbody = mainContainer.querySelector(`#${STUDENT_TABLE_ID} tbody`);
  
  if (!tbody) return; // Sécurité si le conteneur n'est pas là

  if (students.length === 0) {
      tbody.innerHTML = '<tr><td colspan="7" class="empty-list">Aucun élève enregistré pour cette année.</td></tr>';
      return;
  }

  tbody.innerHTML = students.map(s => {
    const solde = s.totalAmount - s.amountPaid;
    const soldeClass = solde > 0 ? 'solde-due' : (solde < 0 ? 'solde-over' : 'solde-ok');
    
    return `
      <tr>
        <td>${s.matricule}</td>
        <td>${s.name}</td>
        <td>${s.className}</td>
        <td>${formatCurrency(s.totalAmount)}</td>
        <td class="amount-paid">${formatCurrency(s.amountPaid)}</td>
        <td class="${soldeClass}">${formatCurrency(solde)}</td>
        <td class="action-cell">
          <button class="btn-icon btn-edit" data-action="edit" data-id="${s.id}" title="Modifier l'élève">📝</button>
          <button class="btn-icon btn-delete" data-action="delete" data-id="${s.id}" title="Supprimer l'élève">🗑️</button>
        </td>
      </tr>`;
  }).join('');
};

/**
 * Fonction de rendu principale appelée par le routeur.
 */
export const renderStudents = () => {
  mainContainer.innerHTML = `
    <section class="view-container">
      <h2>Gestion des Élèves</h2>
      
      <div class="card form-card">
        <h3>Ajouter un nouvel élève</h3>
        <form id="student-form" class="form-grid">
          <input name="matricule" placeholder="Matricule (unique)" required>
          <input name="name" placeholder="Nom complet" required>
          <input name="class" placeholder="Classe (Ex: 6ème A)" required>
          <input name="total" type="number" min="0" placeholder="Montant total dû (Ex: 150000)" required>
          <button type="submit" class="btn primary">Ajouter l'élève</button>
        </form>
      </div>

      <div class="card table-card">
        <h3>Liste des élèves inscrits</h3>
        <table id="${STUDENT_TABLE_ID}" class="data-table">
          <thead>
            <tr>
              <th>Matricule</th>
              <th>Nom</th>
              <th>Classe</th>
              <th>Montant dû</th>
              <th>Payé</th>
              <th>Solde</th>
              <th class="action-col">Actions</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>
      </div>
    </section>`;

  // 1. Écouteur d'événement pour l'ajout
  const form = mainContainer.querySelector('#student-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (addStudent(data)) { 
      form.reset(); 
      renderList(); 
    }
  });
  
  // 2. Écouteur d'événement pour le tableau (délégation)
  const table = mainContainer.querySelector(`#${STUDENT_TABLE_ID}`);
  table.addEventListener('click', handleTableActions);
  
  // 3. Rendu initial de la liste
  renderList();
};
