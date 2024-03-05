const information = document.querySelector(".information-container"),
  darkMode = document.querySelector(".darkMode"),
  filter = document.querySelector("#filter"),
  filter_item = document.querySelectorAll(".filter_item"),
  searchCont = document.querySelector("#searchCont"),
  errorText = document.querySelector("#errorText"),
  filterText = document.querySelector(".filterText"),
  filter_active = document.querySelector(".filter-active"),
  info = document.querySelector("#info");
function dark_mode() {
  const dark_mode = localStorage.getItem("darkMode") == "true";
  localStorage.setItem("darkMode", !dark_mode);
  document.body.classList.toggle("dark", !dark_mode);
}
function onload() {
  document.body.classList.toggle(
    "dark",
    localStorage.getItem("darkMode") == "true"
  );
}
document.addEventListener("DOMContentLoaded", onload);
darkMode.addEventListener("click", dark_mode);
function cards(cardArr) {
  let = create = "";
  cardArr.forEach((item, index) => {
    const { name, population, region, capital, flags } = item;
    if (index <= 7) {
      create += `
        <a href="information.html">
        <div class="card" id ="${index}">
        <img src="${flags.png}" alt="" />
        <div class="info">
        <h2>${name.common}</h2>
        <span>
        <p>population:</p>
        <p class="p">${population}</p>
        </span>
        <span>
        <p>region:</p>
        <p class="p">${region}</p>
        </span>
        <span>
        <p>capital:</p>
        <p class="p">${capital}</p>
        </span>
        </div>
        </div>
      </a>
        `;
    }
  });
  information.innerHTML = create;

  let card = document.querySelectorAll(".card");
  card.forEach((item) =>
    item.addEventListener("click", (e) => {
      localStorage.setItem("item", item.innerHTML);
    })
  );
}
async function countries(url = "all", index) {
  let req = await fetch(`https://restcountries.com/v3.1/${url}`);
  let data = await req.json();
  try {
    cards(data);
  } catch (e) {
    console.error(e);
  }
}
countries();
function infoContainer(card) {
  let box = ``;
  const {
    name,
    population,
    region,
    capital,
    flags,
    subregion,
    currencies,
    languages,
    borders,
    tld,
    border = "",
  } = card[0];
  console.log();
  box += `
  <div class="img-container">
  <img src="${flags.png}"" class="img">
</div>
<div class="infoText">
  <div class="wrap">

    <div>
      <h2>${name.common}</h2>
      <p>Native Name: <span>${
        Object.entries(name.nativeName)[0][1].official
      }</span></p>
      <p>Population: <span>${population}</span></p>
      <p>Region: <span>${region}</span></p>
      <p>Sub Region: <span>${subregion}</span></p>
      <p>Capital: <span>${capital}</span></p>
      
    </div>
    <div class="div">
      
      <p>Top Level Domain:<span>  ${tld[0]}</span></p>
      <p>Currencies: <span>${
        Object.entries(card[0].currencies)[0][1].name
      }</span></p>
      <p>Languages: <span>${Object.entries(
        card[0].languages
      ).reverse()}</span>,<span></span></p>
    </div>
  </div>
  <div class="border-countries">
   <p>Border Countries:</p>
        <div>
          <span>${borders ?? border}</span>
        </div>
   </div>
  </div>
    `;
  info.innerHTML = box;
}
async function infoCard(url = "all") {
  let urlCard = await fetch(`https://restcountries.com/v3.1/${url}  `);
  let newData = await urlCard.json();
  infoContainer(newData);
}

let count = localStorage.getItem("item"),
  result = count.slice(count.indexOf("<h2>") + 4, count.indexOf("</h2>"));
infoCard(`name/${result}`);

function search(e) {
  const target = e.target;
  let regex = new RegExp(/^[a-zA-Z]/);
  if (regex.test(target.value)) {
    countries(`name/${target.value}`);
  }
  if (target.value.length > 0 && !regex.test(target.value)) {
    errorText.innerHTML = "Error";
    document.querySelector(".input").style = "border:1px solid red;";
  } else {
    errorText.innerHTML = "";
    document.querySelector(".input").style = "border:none;";
  }
}

searchCont.addEventListener("input", search);
//filter
function filterActive() {
  filter_active.classList.toggle("show");
  document.querySelector("#filterImg").classList.toggle("img-active");
}
filter.addEventListener("click", filterActive);
filter_item.forEach((item) => {
  item.addEventListener("click", (e) => {
    filterText.textContent = item.textContent;
    filterActive();
  });
});
async function countriesFilter(url = "all", index) {
  let req = await fetch(`https://restcountries.com/v3.1/${url}`);
  let data = await req.json();
  try {
    cards(data);
    filter_item.forEach((item) => {
      item.addEventListener("click", (e) => {
        filterText.textContent = item.textContent;
        let region = item.textContent.toLowerCase();
        filterActive();
        countriesFilter(`region/${region}`);
      });
    });
  } catch (e) {
    console.error(e);
  }
}
countriesFilter();
