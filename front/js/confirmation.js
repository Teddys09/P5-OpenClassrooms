// la const = lance la function getOrderId

const orderId = getOrderId();

// lance la function displayOrderId
displayOrderId(orderId);

//Lance la function removeAllCache

removeAllCache();

/* la const queryString prend l'url
Puis la const urlParams permet de faire une nouvelle url par id
Puis retourne urlParams.get en prenant la première valeur associé à la recherche
*/

function getOrderId() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get('orderId');
}

//la const sélectionne l'id orderId puis ajoute du texte via orderId

function displayOrderId(orderId) {
  const orderIdElement = document.getElementById('orderId');
  orderIdElement.textContent = orderId;
}

//Permet de vider le localStorage après la validation de commande

function removeAllCache() {
  const cache = window.localStorage;
  cache.clear();
}
