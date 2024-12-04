<<<<<<< HEAD
let animeData = []; // Store anime data globally
let currentPage = 1; // Current page for pagination
const itemsPerPage = 20; // Items to display per page

// Function to display data in the table with pagination
function displayData(data, page) {
  const dataBody = document.getElementById("data-body");
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = page * itemsPerPage;
  const pageData = data.slice(startIndex, endIndex);

  dataBody.innerHTML = ""; // Clear the table before rendering

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

// Function to filter data based on search query
function filterData() {
  const searchQuery = document
    .getElementById("search-input")
    .value.toLowerCase();

  if (searchQuery === "") {
    displayData(animeData, currentPage); // Show full data if search is empty
    return;
  }

  const filteredData = animeData.filter((item) =>
    item.seriesTitle.toLowerCase().includes(searchQuery)
  );

  displayData(filteredData, currentPage); // Display filtered data
}

// Function to sort data based on selected option or default to A-Z
function sortData(option = "seriesTitleAZ") {
  const sortedData = [...animeData]; // Copy to avoid mutating original data

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

  displayData(sortedData, currentPage); // Show sorted data
}

// Function to load and parse XML data
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

  sortData(); // Sort by A-Z initially
}

loadXML(); // Call to load the XML data

// Event listener for search input field
document.getElementById("search-input").addEventListener("input", filterData);

// Event listener for Clear Search button
const clearSearchButton = document.getElementById("clear-search");
clearSearchButton.addEventListener("click", () => {
  document.getElementById("search-input").value = ""; // Clear the search input
  currentPage = 1; // Reset to the first page
  sortData("seriesTitleAZ");
});

// Event listener for sorting dropdown
document.getElementById("sort-by").addEventListener("change", (event) => {
  const sortBy = event.target.value;
  sortData(sortBy); // Sort data based on the selected option
});

// Event listener for next page button
document.getElementById("next-page").addEventListener("click", () => {
  if (currentPage * itemsPerPage < animeData.length) {
    currentPage++;
    displayData(animeData, currentPage);
  }
});

// Event listener for previous page button
document.getElementById("prev-page").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    displayData(animeData, currentPage);
  }
});

// Event listener for Reset Sort button
const resetSortButton = document.getElementById("reset-sort");
resetSortButton.addEventListener("click", () => {
  document.getElementById("sort-by").selectedIndex = 0; // Reset dropdown
  currentPage = 1; // Reset to the first page
  sortData("seriesTitleAZ"); // Sort by A-Z
});

// Smooth scroll behavior on wheel events
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
    }, 50); // Adjust debounce time
  },
  { passive: false }
);
=======
let animeData = []; // Store the anime data globally for filtering

async function loadXML() {
  const response = await fetch("./animeList.xml");
  const xmlText = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(xmlText, "text/xml");

  const dataBody = document.getElementById("data-body");
  const animeList = xmlDoc.getElementsByTagName("anime");

  // Store data in an array for sorting, filtering, and pagination
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
      seriesEpisodes: parseInt(seriesEpisodes) || 0, // Ensure episodes is a number
      myStatus,
      myScore: parseFloat(myScore) || 0, // Ensure score is a number
    });
  }

  // Variables for Pagination
  let currentPage = 1;
  const itemsPerPage = 15;

  // Function to display data in the table (with pagination)
  function displayData(data, page) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = page * itemsPerPage;
    const pageData = data.slice(startIndex, endIndex);

    dataBody.innerHTML = ""; // Clear the table before rendering

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

    // Update the page number
    document.getElementById("page-number").textContent = `Page ${currentPage}`;
  }

  // Search functionality
  function filterData() {
    const searchQuery = document
      .getElementById("search-input")
      .value.toLowerCase();

    // Filter animeData based on the search query
    const filteredData = animeData.filter((item) =>
      item.seriesTitle.toLowerCase().includes(searchQuery)
    );

    // Re-display filtered data
    displayData(filteredData, currentPage);
  }

  // Initial sort data by Series Title (A to Z)
  function sortData(option) {
    const sortedData = [...animeData]; // Copy the data to avoid mutating the original

    if (option === "seriesTitleAZ") {
      sortedData.sort((a, b) => a.seriesTitle.localeCompare(b.seriesTitle)); // A to Z
    } else if (option === "seriesTitleZA") {
      sortedData.sort((a, b) => b.seriesTitle.localeCompare(a.seriesTitle)); // Z to A
    } else if (option === "myScoreHigh") {
      sortedData.sort((a, b) => b.myScore - a.myScore); // Highest scored
    } else if (option === "myScoreLow") {
      sortedData.sort((a, b) => a.myScore - b.myScore); // Lowest scored
    } else if (option === "seriesEpisodesHigh") {
      sortedData.sort((a, b) => b.seriesEpisodes - a.seriesEpisodes); // More episodes
    } else if (option === "seriesEpisodesLow") {
      sortedData.sort((a, b) => a.seriesEpisodes - b.seriesEpisodes); // Less episodes
    }

    // Re-display sorted data
    displayData(sortedData, currentPage);
  }

  // Initially sort data by Series Title (A to Z) and display
  sortData("seriesTitleAZ");

  // Add event listener to dropdown for sorting
  document.getElementById("sort-by").addEventListener("change", (event) => {
    const sortBy = event.target.value;
    sortData(sortBy);
  });

  // Add event listener for the search input field
  document.getElementById("search-input").addEventListener("input", filterData);

  // Add event listeners for pagination buttons
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
}

loadXML();

const clearSearchButton = document.getElementById("clear-search");
const searchInput = document.getElementById("search-input");

clearSearchButton.addEventListener("click", () => {
  searchInput.value = "";
  filterData(); // Reset the filtered data
});

const resetSortButton = document.getElementById("reset-sort");
const sortDropdown = document.getElementById("sort-by");

resetSortButton.addEventListener("click", () => {
  sortDropdown.selectedIndex = 0; // Set the dropdown back to the default option
  filterData(); // Reset the data after resetting the sort
});
>>>>>>> 71f8c3aa7690ff4615db2fc4b594f4e6f05cb9e1
