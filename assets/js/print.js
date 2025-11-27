import { loadData } from './storage.js'; // Import pour obtenir les infos de l'école
import { formatCurrency } from './utils.js';

/**
 * Génère et imprime un reçu de paiement officiel.
 * @param {object} payment - L'objet de transaction (inclut ID, montant, date).
 * @param {object} student - L'objet élève mis à jour (inclut totalAmount, amountPaid).
 */
export const printReceipt = (payment, student) => {
  // 1. Charger les informations de l'école depuis l'état global
  const appData = loadData();
  const schoolSettings = appData.settings;
  
  // Calculer le solde après CE paiement (le solde enregistré dans 'student' est déjà après)
  // Montant dû initial = (Montant total dû) - (Montant total payé APRÈS ce paiement)
  const remainingAfterPayment = student.totalAmount - student.amountPaid;
  const totalPaid = student.amountPaid;

  // Formater la date et l'heure avec précision
  const formattedDate = new Date(payment.date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const html = `
    <div class="printable-area receipt">
      
      <header class="school-header">
          <img src="${schoolSettings.schoolLogo || 'assets/img/logo-placeholder.png'}" alt="Logo École" class="receipt-logo">
          <h2>${schoolSettings.schoolName || 'NOM DE L\'ÉTABLISSEMENT'}</h2>
          <p>${schoolSettings.schoolAddress || 'Adresse non spécifiée'}</p>
          <p>Tél : ${schoolSettings.schoolPhone || 'Non spécifié'}</p>
          <hr>
      </header>

      <h3 class="receipt-title">REÇU DE PAIEMENT N° ${payment.id.substring(0, 8).toUpperCase()}</h3>
      
      <section class="payment-details">
          <p><strong>Date et heure :</strong> ${formattedDate}</p>
          <p><strong>Type de paiement :</strong> ${payment.type}</p>
      </section>

      <section class="student-details">
          <h4>Détails de l'élève</h4>
          <p><strong>Nom complet :</strong> ${payment.name}</p>
          <p><strong>Matricule :</strong> ${payment.matricule}</p>
          <p><strong>Classe :</strong> ${payment.className}</p>
      </section>

      <section class="financial-summary">
          <h4>Sommaire Financier</h4>
          <table>
              <tr>
                  <td>Montant Total de la scolarité dû :</td>
                  <td class="amount">${formatCurrency(student.totalAmount)}</td>
              </tr>
              <tr>
                  <td><strong>Montant versé (ce reçu) :</strong></td>
                  <td class="amount received">${formatCurrency(payment.amount)}</td>
              </tr>
              <tr>
                  <td>Total cumulé payé :</td>
                  <td class="amount">${formatCurrency(totalPaid)}</td>
              </tr>
              <tr class="solde-row">
                  <td><strong>Reste à payer (Solde) :</strong></td>
                  <td class="amount remaining">${formatCurrency(remainingAfterPayment)}</td>
              </tr>
          </table>
      </section>

      <footer class="receipt-footer">
          <p>Merci pour votre paiement.</p>
          <div class="signature">
              <p>Signature/Cachet :</p>
              <br>
              <p>_________________________</p>
          </div>
      </footer>
    </div>`;

  // 2. Ouvrir une nouvelle fenêtre pour l'impression
  const win = window.open('', 'recu', 'width=450,height=650');
  
  if (win) {
    win.document.write(`
      <html>
        <head>
          <title>Reçu #${payment.id.substring(0, 8).toUpperCase()}</title>
          <link rel="stylesheet" href="assets/css/print.css">
        </head>
        <body>
          ${html}
        </body>
      </html>
    `);
    win.document.close();
    
    // Attendre un court instant que le CSS soit chargé avant d'imprimer
    // Ceci est crucial pour le rendu correct
    win.onload = () => {
        win.print();
        // Optionnel: win.close(); pour fermer automatiquement après l'impression
    };
  } else {
    // Mesure de secours si le blocage des popups empêche l'ouverture
    alert("Veuillez autoriser les fenêtres contextuelles (popups) pour imprimer le reçu.");
  }
};
