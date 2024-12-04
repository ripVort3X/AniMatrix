let animeData = [];
let currentPage = 1;
const itemsPerPage = 20;

function displayData(data, page) {
  const dataBody = document.getElementById("data-body");
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  dataBody.innerHTML = "";

  pageData.forEach((item) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${item.seriesTitle}</td>
      <td>${item.seriesEpisodes}</td>
      <td>${item.myStatus}</td>
      <td>${item.myScore}</td>
    `;
    dataBody.appendChild(row);
  });

  document.getElementById("page-number").textContent = `Page ${currentPage}`;
}

function filterData() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();

  if (searchQuery === "") {
    displayData(animeData, currentPage);
    return;
  }

  const filteredData = animeData.filter((item) =>
    item.seriesTitle.toLowerCase().includes(searchQuery)
  );

  displayData(filteredData, currentPage);
}

function sortData(option = "seriesTitleAZ") {
  const sortedData = [...animeData];

  if (option === "seriesTitleAZ") {
    sortedData.sort((a, b) => a.seriesTitle.localeCompare(b.seriesTitle));
  } else if (option === "seriesTitleZA") {
    sortedData.sort((a, b) => b.seriesTitle.localeCompare(a.seriesTitle));
  } else if (option === "myScoreHigh") {
    sortedData.sort((a, b) => b.myScore - a.myScore);
  } else if (option === "myScoreLow") {
    sortedData.sort((a, b) => a.myScore - b.myScore);
  } else if (option === "seriesEpisodesHigh") {
    sortedData.sort((a, b) => b.seriesEpisodes - a.seriesEpisodes);
  } else if (option === "seriesEpisodesLow") {
    sortedData.sort((a, b) => a.seriesEpisodes - b.seriesEpisodes);
  }

  displayData(sortedData, currentPage);
}

async function loadXML() {
  const response = await fetch("./animeList.xml");
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const animeList = xmlDoc.getElementsByTagName("anime");

  for (let i = 0; i < animeList.length; i++) {
    const seriesTitle =
      animeList[i].getElementsByTagName("series_title")[0]?.textContent ||
      "N/A";
    const seriesEpisodes =
      animeList[i].getElementsByTagName("series_episodes")[0]?.textContent ||
      "N/A";
    const myStatus =
      animeList[i].getElementsByTagName("my_status")[0]?.textContent || "N/A";
    const myScore =
      animeList[i].getElementsByTagName("my_score")[0]?.textContent || "N/A";

    animeData.push({
      seriesTitle,
      seriesEpisodes: parseInt(seriesEpisodes) || 0,
      myStatus,
      myScore: parseFloat(myScore) || 0,
    });
  }

  sortData();
}

loadXML();

document.getElementById("search-input").addEventListener("input", filterData);

const clearSearchButton = document.getElementById("clear-search");
clearSearchButton.addEventListener("click", () => {
  document.getElementById("search-input").value = "";
  currentPage = 1;
  sortData("seriesTitleAZ");
});

document.getElementById("sort-by").addEventListener("change", (event) => {
  const sortBy = event.target.value;
  sortData(sortBy);
});

document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage * itemsPerPage < animeData.length) {
    currentPage++;
    displayData(animeData, currentPage);
  }
});

document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayData(animeData, currentPage);
  }
});

const resetSortButton = document.getElementById("reset-sort");
resetSortButton.addEventListener("click", () => {
  document.getElementById("sort-by").selectedIndex = 0;
  currentPage = 1;
  sortData("seriesTitleAZ");
});

const scroll = new SmoothScroll("html", {
  speed: 300,
  speedAsDuration: true,
});

let timeout;
window.addEventListener(
  "wheel",
  (event) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      window.scrollBy({
        top: event.deltaY,
        left: 0,
        behavior: "smooth",
      });
    }, 50);
  },
  { passive: false }
);
