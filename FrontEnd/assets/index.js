const displayWorks = (works) => {
	works.forEach((work, index) => {
	  // Création de <figure>
	  let myFigure = document.createElement("figure");
	  myFigure.setAttribute(
		"class",
		`work-item category-id-0 category-id-${work.categoryId}`
	  );
	  myFigure.setAttribute("id", `work-item-${work.id}`);
	  // Création de <img>
	  const myImg = document.createElement("img");
	  myImg.setAttribute("src", work.imageUrl);
	  myImg.setAttribute("alt", work.title);
	  myFigure.appendChild(myImg);
	  // Création de <figcaption>
	  const myFigCaption = document.createElement("figcaption");
	  myFigCaption.textContent = work.title;
	  myFigure.appendChild(myFigCaption);
	  // Ajout du nouveau <figure> dans la div.gallery
	  document.querySelector("div.gallery").appendChild(myFigure);
	});
  };
  
  const displayCategories = (categories) => {
	categories.unshift({ id: 0, name: "Tous" });
	categories.forEach((category, index) => {
	  // Création du <button> pour filtrer
	  let myButton = document.createElement("button");
	  myButton.classList.add("work-filter", "filters-design");
	  if (category.id === 0) myButton.classList.add("filter-active", "filter-all");
	  myButton.setAttribute("data-filter", category.id);
	  myButton.textContent = category.name;
	  // Ajout du nouveau <button> dans la div.filters
	  document.querySelector("div.filters").appendChild(myButton);
	  // Click event <buttton> pour filtrer
	  myButton.addEventListener("click", function (event) {
		// Traitement des filtres
		document.querySelectorAll(".work-filter").forEach((workFilter) => {
		  workFilter.classList.remove("filter-active");
		});
		event.target.classList.add("filter-active");
		// Traitement des works
		let categoryId = myButton.getAttribute("data-filter");
		document.querySelectorAll(".work-item").forEach((workItem) => {
		  workItem.style.display = "none";
		});
		document
		  .querySelectorAll(`.work-item.category-id-${categoryId}`)
		  .forEach((workItem) => {
			workItem.style.display = "block";
		  });
	  });
	});
  };
  
  const toggleFilters = () => {
	const filters = document.getElementById("all-filters");
	if (localStorage.getItem("token")) {
	  filters.style.display = "none"; // Cache les filtres si l'utilisateur est connecté
	} else {
	  filters.style.display = "flex"; // Affiche les filtres si l'utilisateur est déconnecté
	}
  };
  
  document.addEventListener("DOMContentLoaded", () => {
	// Vérification de l'état de connexion
	if (localStorage.getItem("token") && localStorage.getItem("userId")) {
	  document.querySelector("body").classList.add("connected");
	  let topBar = document.getElementById("top-bar");
	  topBar.style.display = "flex";
	  document.getElementById("all-filters").style.display = "none";
	  let space = document.getElementById("space-only-admin");
	  space.style.paddingBottom = "100px";
	} else {
	  document.querySelector("body").classList.remove("connected");
	}

	toggleFilters();
  
	// Gestionnaire d'événement pour la déconnexion
	const logoutButton = document.getElementById("nav-logout");
	if (logoutButton) {
	  logoutButton.addEventListener("click", (event) => {
		event.preventDefault();
		localStorage.removeItem("userId");
		localStorage.removeItem("token");
		toggleFilters();
		window.location.reload();
	  });
	}
  });
  
  // Fonction modifiée pour ouvrir la modal et afficher les travaux
  document
	.getElementById("update-works")
	.addEventListener("click", async function (event) {
	  event.preventDefault();
	  try {
		const works = await getWorks();
		displayWorksInModal(works);
	  } catch (error) {
		console.error('Erreur lors de la mise à jour des travaux:', error);
	  }
  
	  let modal = document.getElementById("modal");
	  modal.style.display = "flex";
	  let modalWorks = document.getElementById("modal-works");
	  modalWorks.style.display = "block";
	});
  
  // Fonction pour afficher les travaux dans la modal
  function displayWorksInModal(works) {
	const modalContent = document.querySelector("#modal-works .modal-content");
	modalContent.innerHTML = "";
	// Boucle sur chaque travail
	works.forEach(async (work, index) => {
	  // Création de <figure>
	  let myFigure = document.createElement("figure");
	  myFigure.setAttribute(
		"class",
		`work-item category-id-0 category-id-${work.categoryId}`
	  );
	  myFigure.setAttribute("id", `work-item-popup-${work.id}`);
	  // Création de <img>
	  let myImg = document.createElement("img");
	  myImg.setAttribute("src", work.imageUrl);
	  myImg.setAttribute("alt", work.title);
	  myFigure.appendChild(myImg);
	  // Création de l'icône poubelle
	  let trashIcon = document.createElement("i");
	  trashIcon.classList.add("fa-solid", "fa-trash-can", "trash");
	  myFigure.appendChild(trashIcon);
	  // Gestion de la suppression
	  trashIcon.addEventListener("click", async function (event) {
		event.preventDefault();


		// Fetch pour supprimer le travail dans la modal et dans la galerie du portfolio de la page
		await fetch(`http://localhost:5678/api/works/${work.id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + localStorage.getItem("token"),
			},
		})
		.then(function (response) {
			switch (response.status) {
				case 500:
				case 503:
					alert("Comportement inattendu!");
					break;
				case 401:
					alert("Suppression impossible!");
					break;
				case 200:
				case 204:
					console.log("Projet supprimé.");
					// Suppression du travail de la page
					document.getElementById(`work-item-${work.id}`).remove();
					console.log(`work-item-${work.id}`);
					// Suppression du travail de la popup
					document.getElementById(`work-item-popup-${work.id}`).remove();
					console.log(`work-item-popup-${work.id}`);
					break;
				default:
					alert("Erreur inconnue!");
					break;
			}
		})
		.catch(function (err) {
			console.log(err);
		});
	});
	  // Ajout du nouveau <figure> dans le div.modal-content existant
	  document.querySelector("div.modal-content").appendChild(myFigure);
	  // Ouverture de la modal de travail
	  let modal = document.getElementById("modal");
	  modal.style.display = "flex";
	  let modalWorks = document.getElementById("modal-works");
	  modalWorks.style.display = "block";
	});
  }


// Gestion de la fermeture de la modale en cliquant à l'extérieur
	// Le modal de travail ne peut pas se fermer si vous cliquez à l'intérieur de son contenu
	document.querySelectorAll('#modal-works').forEach(modalWorks => {
		modalWorks.addEventListener('click', function(event) {
			event.stopPropagation();
		}); // Fermeture de la fonction addEventListener
	});
	
	// L'édition de la modal ne peut pas se fermer si vous cliquez à l'intérieur de son contenu
	document.querySelectorAll('#modal-edit').forEach(modalEdit => {
		modalEdit.addEventListener('click', function(event) {
			event.stopPropagation();
		}); // Fermeture de la fonction addEventListener
	});
	
	// Fermer les deux fenêtres modales avec un clic extérieur
	document.getElementById('modal').addEventListener('click', function(event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
	
		// Réinitialiser tout le formulaire dans l'édition de la modale 
		// Supprimer l'image si elle existe
		if (document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		// Revenir à la conception originale du formulaire
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display = "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display = "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display = "block";
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
	});
	
	// Fermeture de la première fenêtre du modal avec le bouton "x"
	document.getElementById('button-to-close-first-window').addEventListener('click', function(event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
	});
	
	// Fermeture de la deuxième fenêtre modale avec le bouton x
	document.getElementById('button-to-close-second-window').addEventListener('click', function(event) {
		event.preventDefault();
		let modal = document.getElementById('modal');
		modal.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
	
		// Réinitialiser tout le formulaire dans l'édition de la modale 
		// Supprimer l'image si elle existe
		if (document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		// Revenir à la conception originale du formulaire
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display = "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display = "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display = "block";
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 199px 0";
		document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
	});
	
	// Ouverture deuxième fenêtre de modale avec le bouton "Ajouter photo"
	document.getElementById('modal-edit-add').addEventListener('click', function(event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "none";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "block";
	});
	
	// Retourner a la première fenêtre du modal avec la flèche
	document.getElementById('arrow-return').addEventListener('click', function(event) {
		event.preventDefault();
		let modalWorks = document.getElementById('modal-works');
		modalWorks.style.display = "block";
		let modalEdit = document.getElementById('modal-edit');
		modalEdit.style.display = "none";
	
		// Réinitialiser tout le formulaire dans l'édition de la modale 
		// Supprimer l'image si elle existe
		if (document.getElementById('form-image-preview') != null) {
			document.getElementById('form-image-preview').remove();
		}
		// Revenir à la conception originale du formulaire
		document.getElementById('modal-edit-work-form').reset();
		let iconNewPhoto = document.getElementById('photo-add-icon');
		iconNewPhoto.style.display = "block";
		let buttonNewPhoto = document.getElementById('new-image');
		buttonNewPhoto.style.display = "block";
		let photoMaxSize = document.getElementById('photo-size');
		photoMaxSize.style.display = "block";
		let modalEditPhoto = document.getElementById('modal-edit-new-photo');
		modalEditPhoto.style.padding = "30px 0 19px 0";
		document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
	});
	// Fetch pour ajouter des options de catégorie dans la modification modale
	fetch("http://localhost:5678/api/categories")
		.then(function(response) {
			if (response.ok) {
				return response.json();
			}
		})
		.then(function(data) {
			let categories = data;
			// Boucle sur chaque catégorie
			categories.forEach((category, index) => {
				// Création de <option> dans l'édition de la modale
				let myOption = document.createElement('option');
				myOption.setAttribute('value', category.id);
				myOption.textContent = category.name;
				// Ajout du nouveau <option> dans la catégorie select.choice-category
				document.querySelector("select.choice-category").appendChild(myOption);
			});
		})
		.catch(function(err) {
			console.log(err);
		});
	
	// Formulaire de traitement
	document.getElementById('modal-edit-work-form').addEventListener('submit', function(event) {
		event.preventDefault();
		let formData = new FormData();
		formData.append('title', document.getElementById('form-title').value);
		formData.append('category', document.getElementById('form-category').value);
		formData.append('image', document.getElementById('form-image').files[0]);
	
		// Nouveau fetch pour publier un nouveau travail
		fetch('http://localhost:5678/api/works', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer' + localStorage.getItem('token'),
			},
			body: formData
		})
		.then(function(response) {
			switch(response.status) {
				case 500:
				case 503:
					alert("Erreur inattendue!");
					break;
				case 400:
				case 404:
					alert("Impossible d'ajouter le nouveau projet!");
					break;
				case 200:
				case 201:
					console.log("Projet ajouté avec succès!");
					return response.json();
					break;
				default:
					alert("Erreur inconnue!");
					break;
			}
		})
		.then(function(json) {
			console.log(json);
			// Création d'un élément HTML
			// Création de <figure>
			let myFigure = document.createElement('figure');
			myFigure.setAttribute('class', `work-item category-id-0 category-id-${json.categoryId}`);
			myFigure.setAttribute('id', `work-item-${json.id}`);
			// Création de <img>
			let myImg = document.createElement('img');
			myImg.setAttribute('src', json.imageUrl);
			myImg.setAttribute('alt', json.title);
			myFigure.appendChild(myImg);
			// Création de <figcaption>
			let myFigCaption = document.createElement('figcaption');
			myFigCaption.textContent = json.title;
			myFigure.appendChild(myFigCaption);
			// Ajout du nouveau <figure> dans la div.gallery existante
			document.querySelector("div.gallery").appendChild(myFigure);
			// Fermture de l'éditon de la modal
			let modal = document.getElementById('modal');
			modal.style.display = "none";
			let modalEdit = document.getElementById('modal-edit');
			modalEdit.style.display = "none";
			// Réinitialiser tout le formulaire dans l'édition de la modale 
		// Supprimer l'image si elle existe
			if(document.getElementById('form-image-preview') != null) {
				document.getElementById('form-image-preview').remove();
			}
			// Revenir à la conception originale du formulaire
			document.getElementById('modal-edit-work-form').reset();
			let iconNewPhoto = document.getElementById('photo-add-icon');
			iconNewPhoto.style.display = "block";
			let buttonNewPhoto = document.getElementById('new-image');
			buttonNewPhoto.style.display = "block";
			let photoMaxSize = document.getElementById('photo-size');
			photoMaxSize.style.display = "block";
			let modalEditPhoto = document.getElementById('modal-edit-new-photo');
			modalEditPhoto.style.padding = "30px 0 19px 0";
			document.getElementById('submit-new-work').style.backgroundColor = "#A7A7A7";
		})
		.catch(function(err) {
			console.log(err);
		});
	});
	
	// Vérifiez la taille du fichier image
	document.getElementById('form-image').addEventListener('change', () => {
		let fileInput = document.getElementById('form-image');
		const maxFileSize = 4 * 1024 * 1024; // 4MB
		if (fileInput.files[0] && fileInput.files[0].size > maxFileSize) {
			alert("Le fichier sélectionné est trop volumineux. La taille maximale est de 4 Mo.");
			document.getElementById('form-image').value = '';
		} else {
			if (fileInput.files.length > 0) {
				// Création de l'aperçu de l'image
				let myPreviewImage = document.createElement('img');
				myPreviewImage.setAttribute('id', 'form-image-preview');
				myPreviewImage.src = URL.createObjectURL(fileInput.files[0]);
				document.querySelector('#modal-edit-new-photo').appendChild(myPreviewImage);
				myPreviewImage.style.display = "block";
				myPreviewImage.style.height = "169px";
				let iconNewPhoto = document.getElementById('photo-add-icon');
				iconNewPhoto.style.display = "none";
				let buttonNewPhoto = document.getElementById('new-image');
				buttonNewPhoto.style.display = "none";
				let photoMaxSize = document.getElementById('photo-size');
				photoMaxSize.style.display = "none"; 
				let modalEditPhoto = document.getElementById('modal-edit-new-photo');
				modalEditPhoto.style.padding = "0";
			}
		}
	});
	
	// Lier la fonction checkNewProjectFields() sur les 3 champs en écoutant les événements "input"
	document.getElementById('form-title').addEventListener('input', checkNewProjectFields);
	document.getElementById('form-category').addEventListener('input', checkNewProjectFields);
	document.getElementById('form-image').addEventListener('input', checkNewProjectFields);
	
	// Création de la fonction checkNewProjectFields() qui vérifie les champs image + titre + catégorie
	function checkNewProjectFields() {
		let title = document.getElementById('form-title');
		let category = document.getElementById('form-category');
		let image = document.getElementById('form-image');
		let submitWork = document.getElementById('submit-new-work');
		if (title.value.trim() === "" || category.value.trim() === "" || image.files.length === 0) {
			submitWork.style.backgroundColor = "#A7A7A7";
		} else {
			submitWork.style.backgroundColor = "#1D6154";
		}
	};
	

const init = async () => {
  console.log("init");
  const works = await getWorks();
  console.log(works);
  displayWorks(works);
  const categories = await getCategories();
  console.log(categories);
  displayCategories(categories);
};
init();