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

    cart.push(itemKanap);
  }
}

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

function displayTotalPrice(item) {
  const totalPrice = document.querySelector('#totalPrice');
  let total = 0;
  totalPrice.textContent = item.quantity;
  cart.forEach((kanap) => {
    const totalUnitPrice = kanap.price * kanap.quantity;
    total += totalUnitPrice;
    totalPrice.textContent = total;
  });
}

function makeCartContent(item) {
  const cardItemContent = document.createElement('div');
  cardItemContent.classList.add('cart__item__content');
  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}
function makeSettings(item) {
  const settings = document.createElement('div');
  settings.classList.add('cart__item__content__settings');
  addQuantityToSettings(settings, item);
  addDeleteToSettings(settings, item);
  return settings;
}

function addDeleteToSettings(settings, item) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  div.addEventListener('click', () => deleteItem(item));
  const p = document.createElement('p');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  settings.appendChild(div);
}

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

function deleteArticleFromPage(item) {
  const articleToDelete = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  articleToDelete.remove(item);
}

function deleteDataFromCache(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}
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
  input.min = '1';
  input.max = '100';
  input.value = item.quantity;
  input.addEventListener('input', () =>
    updatePriceAndQuantity(item.id, input.value, item)
  );
  quantity.appendChild(input);
  settings.appendChild(quantity);
}
function updatePriceAndQuantity(id, newValue, item) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  item.quantity = itemToUpdate.quantity;
  displayTotalQuantity(newValue);
  displayTotalPrice(newValue);
  saveNewDataToCache(item);
}

function saveNewDataToCache(item) {
  const data = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, data);
}

function makeDescription(item) {
  const description = document.createElement('div');
  description.classList.add('cart__item__content__description');

  const h2 = document.createElement('h2');
  h2.textContent = item.name;
  const p = document.createElement('p');
  p.textContent = item.color;
  const p2 = document.createElement('p');
  p2.textContent = item.price + ' €';

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

function makeArticle(item) {
  const article = document.createElement('article');
  article.classList.add('card__item');
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

function displayArticle(article) {
  document.querySelector('#cart__items').appendChild(article);
}

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

const orderButton = document.querySelector('#order');
orderButton.addEventListener('click', (e) => submitForm(e));

function submitForm(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert('You need to purchase item ');
    return;
  }
  if (valideFrom()) return;
  if (isEmailValide()) return;

  const body = makeRequestBody();
  fetch('http://localhost:3000/api/products/order', {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      const orderId = data.orderId;
      window.location.href =
        '/P5-Dev-Web-Kanap/front/html/confirmation.html' +
        '?orderId=' +
        orderId;
    })
    .catch((err) => console.error(err));
}

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

function isEmailValide() {
  const email = document.querySelector('#email').value;
  const regx = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
  if (regx.test(email) === false) {
    alert('Veuiller entré une adresse mail valide !');
    return true;
  }
  return false;
}

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
