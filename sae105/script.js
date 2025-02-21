let currentVinyleIndex = 0; // Index du vinyle actuel

// Afficher ou masquer un élément
function toggleDisplay(element, condition) {
    element.style.display = condition ? "block" : "none";
}

// Mettre à jour l'affichage des boutons
function updateButtons() {
    const prevButton = document.getElementById("prevButton");
    const nextButton = document.getElementById("nextButton");
    const buttonsContainer = document.getElementById("buttonsContainer");

    const isVinylePage = document.getElementById("vinyle-container").style.display === "flex";

    // Affiche ou masque les boutons uniquement si la page des vinyles est active
    toggleDisplay(prevButton, isVinylePage && currentVinyleIndex > 0);
    toggleDisplay(nextButton, isVinylePage && currentVinyleIndex < data.length - 1);

    if (isVinylePage) {
        buttonsContainer.style.justifyContent = currentVinyleIndex === 0 || currentVinyleIndex === data.length - 1 ? "center" : "space-between";
    } else {
        buttonsContainer.style.justifyContent = "center";
    }
}

// Démarrer la page
function startPage() {
    changeBackground(data[currentVinyleIndex].background);
    document.querySelector(".welcome-container").style.display = "none";
    document.getElementById("vinyle-container").style.display = "flex";
    document.getElementById("backButton").style.display = "block";
    document.getElementById("addMusicButton").style.display = "block";
    loadVinyle(currentVinyleIndex);
    updateButtons();
}

// Changer de vinyle
function changeVinyle(direction) {
    const newIndex = currentVinyleIndex + direction;
    if (newIndex >= 0 && newIndex < data.length) {
        currentVinyleIndex = newIndex;
        loadVinyle(currentVinyleIndex);
        changeBackground(data[currentVinyleIndex].background);
        updateButtons();
    }
}

// Revenir à la page d'accueil
function goToWelcomePage() {
    document.querySelector(".welcome-container").style.display = "block";
    document.getElementById("vinyle-container").style.display = "none";
    document.getElementById("backButton").style.display = "none";
    document.getElementById("addMusicButton").style.display = "none";
    document.getElementById("nextButton").style.display = "none";
    document.getElementById("prevButton").style.display = "none";
    currentVinyleIndex = 0;
    changeBackground('image/accueil.jpg');
    updateButtons();
}

// Charger un vinyle spécifique
function loadVinyle(index) {
    const vinyle = data[index];
    document.getElementById("vinyle-container").innerHTML = `
        <div class="vinyle-content">
            <div class="vinyle-item">
                <img src="${vinyle.image}" alt="${vinyle.titre}" class="vinyle-image" />
                <audio id="audioPlayer" class="audio-player" controls>
                    <source src="${vinyle.audio}" type="audio/mp3">
                    Votre navigateur ne prend pas en charge l'élément audio.
                </audio>
            </div>
            <div class="vinyle-info">
                <h2>${vinyle.titre}</h2>
                <h3>Par : ${vinyle.artiste}</h3>
                <p>${vinyle.description}</p>
                <a href="${vinyle.lien}" target="_blank">Écouter sur Spotify</a>
            </div>
        </div>`;
    
    const audioPlayer = document.getElementById("audioPlayer");
    const vinyleImage = document.querySelector(".vinyle-image");
    audioPlayer.addEventListener("play", () => vinyleImage.style.animation = "rotation 5s infinite linear");
    audioPlayer.addEventListener("pause", () => vinyleImage.style.animation = "none");
}

// Changer le fond de la page
function changeBackground(imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
}

// Afficher le formulaire d'ajout de musique
function showAddMusicForm() {
    const overlay = document.createElement("div");
    overlay.id = "backgroundOverlay";
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background:  url('image/accueil.jpg') center/cover; 
        z-index: 999;
    `;

    const modal = document.createElement("div");
    modal.id = "addMusicModal";
    modal.style.cssText = `
        position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        background: white; padding: 20px; border-radius: 10px; z-index: 1000;
    `;

    modal.innerHTML = `
        <h2>Ajouter une musique</h2>
        <form id="addMusicForm">
            <label>Titre :</label>
            <input type="text" id="titre" required /><br />
            <label>Artiste :</label>
            <input type="text" id="artiste" required /><br />
            <label>Lien :</label>
            <input type="url" id="lien" required /><br />
            <label>Description (minimum de 150 caractères):</label>
            <textarea id="description" required></textarea><br />
            <button type="submit">Ajouter</button>
            <button type="button" id="cancelAddMusic">Annuler</button>
        </form>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(modal);

    document.getElementById("addMusicForm").addEventListener("submit", addMusic);
    document.getElementById("cancelAddMusic").addEventListener("click", toggleAddMusicForm);
}

// Fermer le formulaire
function toggleAddMusicForm() {
    document.getElementById("addMusicModal")?.remove();
    document.getElementById("backgroundOverlay")?.remove();
}

// Ajouter une musique
function addMusic(event) {
    event.preventDefault();

    const titre = document.getElementById("titre").value;
    const artiste = document.getElementById("artiste").value;
    const description = document.getElementById("description").value;
    const url = document.getElementById("lien").value;

    if (description.length < 149) {
        alert("La description doit contenir au moins 150 caractères.");
        return;
    }

    alert("Merci d'avoir ajouté une musique. À bientôt !");

    const urlVisitee = `https://perso-etudiant.u-pem.fr/~gambette/portrait/api.php?login=tahi&format=json&courriel=philippe.gambette@univ-eiffel.fr&message=${encodeURIComponent(description)}&musique=${encodeURIComponent(titre)}&artiste=${encodeURIComponent(artiste)}&url=${encodeURIComponent(url)}`;

    fetch(urlVisitee).then(response => response.json().then(data => console.log(data)))
        .catch(error => console.error("Erreur lors de l'appel à l'API :", error));

    toggleAddMusicForm();
}

// Initialisation
function init() {
    document.getElementById("startButton").addEventListener("click", startPage);
    document.getElementById("nextButton").addEventListener("click", () => changeVinyle(1));
    document.getElementById("prevButton").addEventListener("click", () => changeVinyle(-1));
    document.getElementById("backButton").addEventListener("click", goToWelcomePage);
    
    const addMusicButton = document.createElement("button");
    addMusicButton.id = "addMusicButton";
    addMusicButton.textContent = "Ajouter une musique";
    addMusicButton.style.cssText = "position: absolute; top: 10px; right: 10px; z-index: 1000; display: none;";
    addMusicButton.addEventListener("click", showAddMusicForm);
    document.body.appendChild(addMusicButton);
}

init();

document.getElementById('credits-toggle').addEventListener('click', () => {
    const creditsContent = document.getElementById('credits-content');
    creditsContent.style.display = creditsContent.style.display === 'none' ? 'block' : 'none';
});
