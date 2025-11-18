console.log("✅ script.js loaded");

async function loadData() {
  console.log("✅ loadData started");

  // 1. Load your plant CSV
  let data = await d3.csv("plantdata.csv", d3.autoType);
  console.log("raw data:", data);
  console.log("columns:", data.columns);

  // We'll use the 'Number' column as our numeric property
  const numericField = "Number";

  // 2. FILTER: keep only rows where Number >= 3 (just an example numeric filter)
  const filtered = data.filter(d => d[numericField] >= 3);
  console.log("filtered (Number >= 3):", filtered);

  // 3. SORT: sort descending by Number
  const sorted = d3.sort(filtered, (a, b) =>
    d3.descending(a[numericField], b[numericField])
  );
  console.log("sorted by Number (desc):", sorted);

  // 4. MEAN on Number
  const mean = d3.mean(filtered, d => d[numericField]);
  console.log("mean Number:", mean);

  // 5. SUM on Number
  const sum = d3.sum(filtered, d => d[numericField]);
  console.log("sum Number:", sum);

  // 6. MIN on Number
  const min = d3.min(filtered, d => d[numericField]);
  console.log("min Number:", min);

  // 7. MAX on Number
  const max = d3.max(filtered, d => d[numericField]);
  console.log("max Number:", max);

  // 8. MODE on Number
  const counts = {};
  filtered.forEach(d => {
    const v = d[numericField];
    counts[v] = (counts[v] || 0) + 1;
  });
  let maxCount = 0;
  let modeVal = null;
  for (const v in counts) {
    if (counts[v] > maxCount) {
      maxCount = counts[v];
      modeVal = Number(v);
    }
  }
  const mode = modeVal;
  console.log("mode Number:", mode);

  // 9. Build an HTML table so you see the data on the page

  const table = document.createElement("table");

  const columns = data.columns; // ['Number', 'Scientific Name', 'Plant Name', ...]

  // Header row
  let header = "<tr>";
  columns.forEach(colName => {
    header += "<th>" + colName + "</th>";
  });
  header += "</tr>";

  // Body rows – use sorted data so transforms are reflected visually
  let rows = "";
  sorted.forEach(rowObj => {
    rows += "<tr>";
    columns.forEach(colName => {
      rows += "<td>" + (rowObj[colName] ?? "") + "</td>";
    });
    rows += "</tr>";
  });

  console.log("number of rows in table:", sorted.length);

  table.innerHTML = header + rows;
  document.body.appendChild(table);
}

window.onload = function () {
  loadData();
};


window.onload = function () {
  loadData();
};

