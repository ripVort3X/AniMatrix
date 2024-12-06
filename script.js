let xmlDoc;

document
  .getElementById("xmlFileInput")
  .addEventListener("change", handleFileUpload);
document
  .getElementById("generateTable")
  .addEventListener("click", generateTable);
document.getElementById("resetButton").addEventListener("click", () => {
  location.reload(); // Hard refresh the page
});

const dropZone = document.getElementById("dropZone");
dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.classList.add("dragging");
});
dropZone.addEventListener("dragleave", () =>
  dropZone.classList.remove("dragging")
);
dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.classList.remove("dragging");
  const file = e.dataTransfer.files[0];
  if (file && file.type === "text/xml") {
    handleFile(file);
  } else {
    alert("Please upload a valid XML file.");
  }
});

function handleFile(file) {
  const reader = new FileReader();
  reader.onload = function () {
    const parser = new DOMParser();
    xmlDoc = parser.parseFromString(reader.result, "text/xml");
    displayElements(xmlDoc);
  };
  reader.readAsText(file);
}

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    handleFile(file);
  }
}

function displayElements(xmlDoc) {
  const uniqueElements = new Set();
  const elements = xmlDoc.getElementsByTagName("*");

  for (let element of elements) {
    uniqueElements.add(element.tagName);
  }

  const elementsContainer = document.getElementById("elementsContainer");
  elementsContainer.innerHTML = "";

  Array.from(uniqueElements).forEach((tag) => {
    const div = document.createElement("div");
    div.className = "element-item";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = tag;
    checkbox.id = `checkbox-${tag}`;

    const label = document.createElement("label");
    label.htmlFor = checkbox.id;
    label.textContent = tag;

    div.appendChild(checkbox);
    div.appendChild(label);
    elementsContainer.appendChild(div);
  });

  document.getElementById("elementSelection").style.display = "block";
}

function generateTable() {
  const selectedTags = Array.from(
    document.querySelectorAll("#elementsContainer input:checked")
  ).map((cb) => cb.value);

  if (selectedTags.length === 0) {
    alert("Please select at least one element to display.");
    return;
  }

  const tableContainer = document.getElementById("tableContainer");
  tableContainer.innerHTML = "";

  const table = document.createElement("table");
  table.className = "styled-table";
  const thead = document.createElement("thead");
  const headerRow = document.createElement("tr");

  selectedTags.forEach((tag) => {
    const th = document.createElement("th");
    th.textContent = tag;
    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");

  // Detect the top-level tag containing the rows (e.g., "anime", "book", etc.)
  const parentElement = detectParentElement(selectedTags);
  if (!parentElement) {
    alert("No matching elements found in the XML.");
    return;
  }

  const rows = Array.from(parentElement);

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    selectedTags.forEach((tag) => {
      const td = document.createElement("td");
      const data = row.getElementsByTagName(tag)[0];
      td.textContent = data ? data.textContent : "N/A";
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  tableContainer.appendChild(table);

  document.getElementById("uploadSection").style.display = "none";
  document.getElementById("tableSection").style.display = "block";
}

function detectParentElement(selectedTags) {
  for (const tag of selectedTags) {
    const elements = xmlDoc.getElementsByTagName(tag);
    if (elements.length > 0) {
      return elements[0].parentElement.parentElement.getElementsByTagName(
        elements[0].parentElement.tagName
      );
    }
  }
  return null;
}
