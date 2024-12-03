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
