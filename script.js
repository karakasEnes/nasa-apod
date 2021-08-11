const imageContainer = document.querySelector(".images-container");
const savedConfirmed = document.querySelector(".save-confirmed");

const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];
let favorites = {};

function createCards() {
  resultArray.forEach((cardInfo) => {
    singleCard(cardInfo);
  });
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

function singleCard(cardInfo) {
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
  clickAble.textContent = "Add to Favorite";
  clickAble.setAttribute("onclick", `saveFavorite('${url}')`);

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

async function fetchNasaData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    resultArray = data;
    console.log(resultArray);
    createCards();
  } catch (err) {
    console.log(err);
  }
}

fetchNasaData();
