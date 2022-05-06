//Création constante url de l'API
const url = 'http://localhost:3000/api/products';

// On prend le contenu de l'API en format JSON
fetch(url)
  .then((res) => res.json())

  // On prend les éléments dans un tableau
  .then((objetProduits) => {
    // On appel la function kanap avec comme paramètre objetProduits
    lesKanaps(objetProduits);
  })
  // On définit une action si il y a une erreur avec l'API
  .catch((err) => {
    document.querySelector('.titles').innerHTML = '<h1>erreur 404</h1>';
    console.log('erreur 404, sur ressource api:' + err);
  });

// On déclare la function lesKanaps avec comme paramètre index
function lesKanaps(index) {
  /* On définit la variable zoneArticle du paramètre index qui est égal à 
  la séléction de l'ID #items */
  let zoneArticle = document.querySelector('#items');

  /* On déclare la boucle avec la variable article du paramètre index qui ajoute 
  dans le html les produits*/
  // on déclare article de l'index qui est le paramètre de lesKanaps
  for (let article of index) {
    // On ajoute dans la zoneArticle + le contenu des kanaps

    zoneArticle.innerHTML += `<a href="./product.html?_id=${article._id}">
    <article> 
    <img src="${article.imageUrl}" alt="${article.altTxt}">
    <h3 class="productName">${article.name}</h3>
    <p class="productDescription">${article.description}</p>
    </article>
    </a>`;
  }
}
