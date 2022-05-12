//Appel API GET
fetch('http://localhost:3000/api/products')
  .then((res) => res.json())
  .then((data) => addProducts(data));

//  Joues les function créatrice pour chaque kanap puis les donnes en enfant
function addProducts(kanap) {
  kanap.forEach((kanap) => {
    const { _id, imageUrl, altTxt, name, description } = kanap;
    const anchor = makeAnchor(_id);
    const article = document.createElement('article');
    const image = makeImageDiv(imageUrl, altTxt);
    const h3 = makeH3(name);
    const p = makeParagraph(description);

    appendElementsToArticle(article, [image, h3, p]);
    appendArticleToAnchor(anchor, article);
  });
}
//Donne en enfant les items a article
function appendElementsToArticle(article, array) {
  array.forEach((item) => {
    article.appendChild(item);
  });
}
// Fabrique un <a> puis lui donne comme href './product.html?_id=' + id;
function makeAnchor(id) {
  const anchor = document.createElement('a');
  anchor.href = './product.html?_id=' + id;
  return anchor;
}
//Sélectionne #items dans le DOM puis si items est différent de null les donne en enfant
function appendArticleToAnchor(anchor, article) {
  const items = document.querySelector('#items');
  if (items != null) {
    items.appendChild(anchor);
    anchor.appendChild(article);
  }
}
//Fabrique img avec src et alt et enlève les attribut titre et syle
function makeImageDiv(imageUrl, altTxt) {
  const image = document.createElement('img');
  image.src = imageUrl;
  image.alt = altTxt;
  image.removeAttribute('title');
  image.removeAttribute('style');
  return image;
}
//Fabrique un h3 avec name en textcontent puis ajoute une classe
function makeH3(name) {
  const h3 = document.createElement('h3');
  h3.textContent = name;
  h3.classList.add('productName');
  return h3;
}
//Fabrique un p avec une description et ajoute une classe
function makeParagraph(description) {
  const p = document.createElement('p');
  p.textContent = description;
  p.classList.add('productDescription');
  return p;
}
