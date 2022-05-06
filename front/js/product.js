//On définit la méthode utilitaire pour traviller avec la chaine de requêtes
const urlParams = new URLSearchParams(window.location.search);
// On prend l'id de la page du kanap
// On fait une demande get qui retourne la première valeur associé
const id = urlParams.get('_id');
// On définit les variables globale pour les utiliser plus tard
let kanapPrice = 0;
let imgUrl, altText, articleName;
// On prend le contenu de l'API en format JSON
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((res) => lesKanaps(res))
  // On définit une action en cas d'erreur
  .catch((err) => {
    document.querySelector('#title').innerHTML = '<h1>erreur 404</h1>';
    console.log('erreur 404, sur ressource api:' + err);
  });
// On fait appel à la fonction lesKanaps qui est toujours dans fecth
/* On laisse la fonction dans fetch pour que si les infos demandé 
     Mettent beaucoup de temps à arriver la function lesKanaps ne se 
    déclenchera que quand get aura tout reçu*/
// Puis on lui passe les directives
function lesKanaps(kanap) {
  /* const altTxt = kanap.altTxt;
  const colors = kanap.colors;
  const description = kanap.description;
  const imageUrl = kanap.imageUrl;
  const name = kanap.name;
  const price = kanap.price;
  const _id = kanap._id;
  On déclare les constantes pour les différents attribut des kanaps .
  Pour un Dont repeat your self on peut faire comme ceci !
  */

  const { altTxt, colors, description, imageUrl, name, price, id } = kanap;
  // On appel les fonction make qui vont chercher et créer les éléments demandé
  kanapPrice = price;
  imgUrl = imageUrl;
  altText = altTxt;
  articleName = name;
  makeImage(imageUrl, altTxt);
  makeTitle(name);
  makePrice(price);
  makeDescription(description);
  makeColors(colors);
}
// Créer un element image
function makeImage(imageUrl, altTxt) {
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector('.item__img');
  parent.appendChild(image);
}
// Créer un element titre
function makeTitle(name) {
  document.querySelector('#title').textContent = name;
}
// Créer un element prix
function makePrice(price) {
  document.querySelector('#price').textContent = price;
}
// Créer un element description
function makeDescription(description) {
  document.querySelector('#description').textContent = description;
}
// Créer un element couleur + les choix d'options de couleurs
function makeColors(colors) {
  const colorPlace = document.querySelector('#colors');
  colors.forEach((color) => {
    const option = document.createElement('option');
    option.value = color;
    option.textContent = color;
    colorPlace.appendChild(option);
  });
}
// On sélectionne l'id addToCart
const button = document.querySelector('#addToCart');
// On écoute le click sur le bouton / si la couleur ou la quantité est null une alert pop
button.addEventListener('click', (e) => {
  const color = document.querySelector('#colors').value;
  const quantity = document.querySelector('#quantity').value;
  if (color == null || color === '' || quantity == null || quantity == 0) {
    alert('Selectionner une couleur et une quantité ');
    return;
  }

  const key = `${id}-${color}`;
  // définition const storage qui stock tout le contenu nécessaire
  const storage = {
    id: id,
    color: color,
    quantity: Number(quantity),
    price: kanapPrice,
    imageUrl: imgUrl,
    altTxt: altText,
    name: articleName,
  };
  // On met dans le localStorage la const key + on transforme en string json les élem du storage
  localStorage.setItem(key, JSON.stringify(storage));
  //ça nous redirige sur le panier après le click
  window.location.href = 'cart.html';
});
