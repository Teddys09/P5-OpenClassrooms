const urlParams = new URLSearchParams(window.location.search);
// On prend l'id de la page du kanap
const id = urlParams.get('_id');
console.log(id);
// On prend le contenu de l'API en format JSON
fetch(`http://localhost:3000/api/products/${id}`)
  .then((res) => res.json())
  .then((res) => lesKanaps(res))
  // On définit une action en cas d'erreur
  .catch((err) => {
    document.querySelector('#title').innerHTML = '<h1>erreur 404</h1>';
    console.log('erreur 404, sur ressource api:' + err);
  });
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
  makeImage(imageUrl, altTxt);
}

function makeImage(imageUrl, altTxt) {
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = altTxt;
  const parent = document.querySelector('.item__img');
  parent.appendChild(image);
  return image;
}
