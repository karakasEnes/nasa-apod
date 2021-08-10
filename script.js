const count = 10;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultArray = [];

async function fetchNasaData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    resultArray = data;
    console.log(resultArray);
  } catch (err) {
    console.log(err);
  }
}

fetchNasaData();
