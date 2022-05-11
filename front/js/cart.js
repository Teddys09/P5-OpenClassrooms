// Cart qui prend les items dans un tableau
const cart = [];

// on appel la function takeItemFromCache
takeItemFromCache();

// Pour chaque item tu joue la function displayItem
cart.forEach((item) => displayItem(item));
// Prend les éléments du tableau et les mets en objetJSON
function takeItemFromCache() {
  // On déclare la constante numberOfItems qui récupère la taille du localStorage
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));

    //JSON.parse est pour transformer en objet à l'inverse de .stringify
    const itemKanap = JSON.parse(item);
    // On envoie les éléments dans le tbleau cart
    cart.push(itemKanap);
  }
}
// Function qui appel nos function constructrice
function displayItem(item) {
  const article = makeArticle(item);
  displayArticle(article);

  const div = makeImageDiv(item);
  article.appendChild(div);

  const cardItemContent = makeCartContent(item);

  article.appendChild(cardItemContent);
  displayTotalQuantity(item);
  displayTotalPrice(item);
}

// Function qui calcul la quantity total de produit et l'affiche en html

function displayTotalQuantity(item) {
  const totalQuantity = document.querySelector('#totalQuantity');
  let total = 0;
  totalQuantity.textContent = item.quantity;
  cart.forEach((kanap) => {
    const totalUnitQuantity = total + kanap.quantity;

    total = totalUnitQuantity;

    totalQuantity.textContent = total;
  });
}

//Function qui calcul le prix total de produit et l'affiche en html

function displayTotalPrice(item) {
  const totalPrice = document.querySelector('#totalPrice');
  let total = 0,
    price = 0;
  totalPrice.textContent = item.quantity;

  cart.forEach((kanap) => {
    // appel api recup price

    fetch(`http://localhost:3000/api/products/${kanap.id}`, {
      method: 'GET',
    })
      .then((res) => res.json())
      .then((data) => {
        price = Number(data.price);
        makeDescription(item, price);
        // data.key > data.price + '€'

        document.getElementById(item.id + '-' + item.color).innerText =
          data.price + ' €';
        const totalUnitPrice = price * kanap.quantity;

        total += totalUnitPrice;
        totalPrice.textContent = total;
      })
      .catch((err) => console.error(err));
  });
}

/*Fabrique une div avec la class voulue puis appel les function 
constructice description et settings pour les appends child
 */

function makeCartContent(item) {
  const cardItemContent = document.createElement('div');
  cardItemContent.classList.add('cart__item__content');
  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

//Fabrique une div avec la classe voulue + appel les function souhaité

function makeSettings(item) {
  const settings = document.createElement('div');
  settings.classList.add('cart__item__content__settings');
  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

/* Fabrique une div avec la classe souhaitée puis écoute le click et 
lance la function deleteItem ensuite fabrique un paragraphe puis rend
 le p enfant de div et div enfant de settings */

function addDeleteToSettings(settings, item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  div.addEventListener('click', () => deleteItem(item));
  const p = document.createElement('p');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  settings.appendChild(div);
}

// définit l'item à delete et appel les function voulu

function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (kanap) => kanap.id === item.id && kanap.color === item.color
  );
  cart.splice(itemToDelete, 1);
  displayTotalPrice(item);
  displayTotalQuantity(item);
  deleteDataFromCache(item);
  deleteArticleFromPage(item);
}

//sélectionne l'article avec la bonne id et couleur puis la supprime

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove(item);
}

//sélectionne dans le cache un item avec la bonne id et couleur puis le supprime

function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

/* Fabrique une div avec la classe voulu  puis un p contenant "Qté"
 et le rend enfant de quantité 
  Puis fabrique un inpu  de type number avec la classe souhaité
  puis le nom souhaité puis les valeurs min et max souhaité
  et sa valur est égal à item.quantity
  Puis on écoute l'input et on lance la function updatePriceAndQuantity
  Puis input devient enfant de quantity 
  Et quantity devient enfant de settings  */

function addQuantityToSettings(settings, item) {
  const quantity = document.createElement('div');
  quantity.classList.add('cart__item__content__settings__quantity');
  const p = document.createElement('p');
  p.textContent = 'Qté : ';
  quantity.appendChild(p);
  const input = document.createElement('input');
  input.type = 'number';
  input.classList.add('itemQuantity');
  input.name = 'itemQuantity';
  input.min = Number('1');
  input.max = Number('100');
  input.value = item.quantity;
  input.addEventListener('input', () =>
    updatePriceAndQuantity(item.id, input.value, item, item.color)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

const inputSelector = document.getElementsByClassName('itemQuantity');
function inputMaxMin() {
  for (i = 0; i < inputSelector.length; i++) {
    if (inputSelector[i].value > 100) inputSelector[i].value = 100;
    else if (inputSelector[i].value < 0) inputSelector[i].value = 0;
  }
}
for (i = 0; i < inputSelector.length; i++) {
  inputSelector[i].addEventListener('keyup', inputMaxMin);
}

/* on va chercher dan le tableau item avec l'id voulu 
Puis on met à jour la nouvelle valeur en nombre 
Et on lance les function avec les nouvelles valeur plus la save  */

function updatePriceAndQuantity(id, newValue, item, color) {
  console.log(cart);

  console.log(item.color + item.id);
  const itemToUpdate = cart.find(
    (item) => item.id === id && item.color === color
  );
  console.log(itemToUpdate);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;
  displayTotalQuantity(item);
  displayTotalPrice(item);
  saveNewDataToCache(item);
}

/* On prend les item en string + l'id et la color et on les places
 dans le local storage */

function saveNewDataToCache(item) {
  const data = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, data);
}

/*Fabrique une div avec la classe souhaitée
Puis fabrique un h2 contenant le name 
Puis un p contenant color puis un p2 contenant le prix
Et on les rends enfant de description (la div) */

function makeDescription(item) {
  const description = document.createElement('div');
  description.classList.add('cart__item__content__description');

  const h2 = document.createElement('h2');
  h2.textContent = item.name;
  const p = document.createElement('p');
  p.textContent = item.color;
  // html : p id="key"
  const p2 = document.createElement('p');
  p2.id = item.id + '-' + item.color;
  p2.textContent = 'price' + ' €';

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

/*Fabrique un article puis lui ajoute la classe voulu
Puis l'article contenant l'id et la color dans le dom sont égal à
item.id et item.color */

function makeArticle(item) {
  const article = document.createElement('article');
  article.classList.add('card__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

//sélectionne l'id voulu puis lui donne en enfant article

function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article);
}

/*Fabrique une div avec la class voulu puis fabrique une img 
puis image.src et image.alt prenne item.imageUrl et item.alTxt
et rend image enfant de div
 */

function makeImageDiv(item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__img');
  const image = document.createElement('img');
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

//FORMULAIRE

/*Sélectionne l'id order puis écoute au click et lance la function submit
 */
const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', (e) => submitForm(e));

/*Prend en paramètre l'event écouté puis lui stop son 
utilisation par défaut
Si la longueur du tableau vaut 0 alors une alert apparait
si function validFrom tu la return
si function isEmailValid tu la return
 */

function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert('You need to purchase item ');
    return;
  }
  if (valideFrom()) return;
  if (isEmailValide()) return;

  // On appel la function
  const body = makeRequestBody();
  /* Requete fetch a l'api/order avec la method POST + tout les 
  prérequis demandé par l'API
  */
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    /* Prend la réponse de la requête puis la passe ne JSON
  Puis on défini la const qui = data.orderId
  Qui permet d'envoyer vers la page confirm avec le bon id de commande */
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      window.location.href = 'confirmation.html' + '?orderId=' + orderId;
    })
    .catch((err) => console.error(err));
}

/* Sélect la class voulu puis séléct tout les input
puis pour chaque input on vérifit si les champs sont vide 
et on retourne une alert et true 
Sinon on ne fait rien et retourne faut  */

function valideFrom() {
  const form = document.querySelector('.cart__order__form');
  const inputs = form.querySelectorAll('input');
  inputs.forEach((input) => {
    if (input.value === '') {
      alert('Veuillez remplir tout les champs du formulaire !');
      return true;
    }
    return false;
  });
}

/*On s'électionne l'id email avec sa valeur 
Puis vérifie si l'email respect la regex 
Si elle repect pas fait apparaitre une alerte 
Sinon ne fait rien*/

function isEmailValide() {
  const email = document.querySelector('#email').value;
  const regx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (regx.test(email) === false) {
    alert('Veuiller entré une adresse mail valide !');
    return true;
  }
  return false;
}

/* Sélectionne la classe voulu puis définit
 les constantes contenant les infos du form
 Puis products prend la function 
 */
function makeRequestBody() {
  const form = document.querySelector('.cart__order__form');
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdFromCache(),
  };
  return body;
}

/*la const vaut la taille du localStorage 
const ids = tableau
Pour i = 0  i inférieur à numberOfProducts    i prend +1
const key retourne localStorage.lenomdelaclef
la const id = const key.split '-'[0] qui veut dire :
sépare les 2 string ou il y a le -
Puis pousse les éléments de le array 
et return ids
 */

function getIdFromCache() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split('-')[0];
    ids.push(id);
    return ids;
  }
}
