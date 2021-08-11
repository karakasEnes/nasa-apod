const imageContainer = document.querySelector(".images-container");
const savedConfirmed = document.querySelector(".save-confirmed");
const loader = document.querySelector(".loader");
const resultsNav = document.getElementById("resultsNav");
const favoritesNav = document.getElementById("favoritesNav");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function createCards(page) {
  changeNavBar(page);
  const currentArray =
    page === "favorites" ? Object.values(favorites) : resultArray;
  imageContainer.textContent = "";
  currentArray.forEach((cardInfo) => {
    singleCard(cardInfo, page);
  });
}

function showContent() {
  loader.classList.add("hidden");
}

function fetchLocalStorage() {
  const localNasa = localStorage.getItem("nasaFavoriteItems");
  if (localNasa) {
    favorites = JSON.parse(localNasa);
  }
}

function removeFavorite(url) {
  delete favorites[url];
  localStorage.setItem("nasaFavoriteItems", JSON.stringify(favorites));
  imageContainer.textContent = "";
  createCards("favorites");
}

function saveFavorite(url) {
  resultArray.forEach((item) => {
    if (item.url.includes(url) && !favorites[url]) {
      favorites[url] = item;

      // added logo show 2 sec
      savedConfirmed.hidden = false;

      setTimeout(() => {
        savedConfirmed.hidden = true;
      }, 2000);
    }

    localStorage.setItem("nasaFavoriteItems", JSON.stringify(favorites));
  });
}

function singleCard(cardInfo, page) {
  const { url, title, hdurl, copyright, date, explanation } = cardInfo;
  // createCardElement add append it to "image-container"

  // card element
  const card = document.createElement("div");
  card.classList.add("card");

  //link element
  const link = document.createElement("a");
  link.href = hdurl;
  link.title = title;

  // image element
  const image = document.createElement("img");
  image.classList.add("card-img-top");
  image.src = url;

  //cardBody
  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");

  //cardTitle
  const cardTitle = document.createElement("h5");
  cardTitle.classList.add("card-title");
  cardTitle.textContent = title;

  //clickAbleParag
  const clickAble = document.createElement("p");
  clickAble.classList.add("clickable");
  if (page === "favorites") {
    clickAble.textContent = "Remove Favorite";
    clickAble.setAttribute("onclick", `removeFavorite('${url}')`);
  } else {
    clickAble.textContent = "Add to Favorite";
    clickAble.setAttribute("onclick", `saveFavorite('${url}')`);
  }

  //cardText
  const cardText = document.createElement("p");
  cardText.classList.add("card-text");
  cardText.textContent = explanation;

  //footer
  const footer = document.createElement("small");
  footer.classList.add("text-muted");

  //footer date
  const dateEl = document.createElement("strong");
  dateEl.textContent = date;

  //footer copyright
  const copyRightEl = document.createElement("span");
  const copyrightText = copyright === undefined ? "" : copyright;
  copyRightEl.textContent = copyrightText;

  //appendingStuff
  footer.append(dateEl, copyRightEl);
  cardBody.append(cardTitle, clickAble, cardText);
  link.appendChild(image);
  card.append(link, cardBody, footer);

  //imageContainer
  imageContainer.appendChild(card);
}

function changeNavBar(page) {
  if (page === "favorites") {
    favoritesNav.classList.remove("hidden");
    resultsNav.classList.add("hidden");
  } else {
    resultsNav.classList.remove("hidden");
    favoritesNav.classList.add("hidden");
  }
}

async function fetchNasaData(page) {
  loader.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "instant" });

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    showContent();
    resultArray = data;
    createCards(page);
  } catch (err) {
    console.log(err);
  }
}

fetchLocalStorage("nasa");
fetchNasaData();
