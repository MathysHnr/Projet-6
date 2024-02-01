document.addEventListener("DOMContentLoaded", async function () {
    document.getElementById("user-login-form").addEventListener("submit", async function (event) {
        event.preventDefault();
        document.getElementById('error-message').textContent = ''; // Efface les messages d'erreur précédents

        // Récupération des données du formulaire
        const email = document.querySelector("#email").value;
        const password = document.querySelector("#password").value;

        try {
            // Envoi de la requête pour l'authentification
            const response = await fetch("http://localhost:5678/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            // Gestion des différents statuts de réponse
            await handleResponse(response);
        } catch (err) {
            console.error(err);
            showAlertServerError();
        }
    });
});

async function handleResponse(response) {
    if (response.ok) {
        // Réponse réussie
        await handleSuccessfulAuthentication(response);
    } else {
        // Réponse d'erreur
        handleErrorResponse(response);
    }
}

async function handleSuccessfulAuthentication(response) {
    console.log("Authentification réussie.");
const data = await response.json();
localStorage.setItem("token", data.token);
localStorage.setItem("userId", data.userId);
window.location.href = "index.html";
}

async function handleErrorResponse(response) {
if (response.status === 0) {
// Erreur de réseau ou réponse non reçue
showAlertNetworkError();
} else {
// Autres erreurs HTTP
showAlertHttpError(response.status);
}
}

function showAlertServerError() {
alert("Erreur côté serveur!");
}

function showAlertNetworkError() {
alert("Erreur de réseau ou aucun réponse du serveur!");
}

function showAlertHttpError(statusCode) {
    const errorMessageDiv = document.getElementById('error-message');
    if (statusCode === 401) {
        errorMessageDiv.textContent = "Les identifiants ne sont pas corrects.";
    } else {
        errorMessageDiv.textContent = "Authentification invalide. Vérifiez si les données saisies sont correctes.";
    }
}
