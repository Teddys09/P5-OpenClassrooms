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
  addDeleteToSettings(settings);
  return settings;
}

function addDeleteToSettings(settings) {
  const div = document.createElement('div');
  div.classList.add('cart__item__content__settings__delete');
  const p = document.createElement('p');
  p.textContent = 'Supprimer';
  div.appendChild(p);
  settings.appendChild(div);
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
    updatePriceAndQuantity(item.id, input.value)
  );
  quantity.appendChild(input);
  settings.appendChild(quantity);
}
function updatePriceAndQuantity(id, newValue) {
  const itemToUpdate = cart.find((item) => item.id === id);
  itemToUpdate.quantity = Number(newValue);
  displayTotalQuantity(newValue);
  displayTotalPrice(newValue);
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
