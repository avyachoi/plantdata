

console.log("✅ script.js loaded");

async function loadData() {
  console.log("✅ loadData started");

  // 1. Load the data
  let data = await d3.csv("plantdata.csv", d3.autoType);
  console.log("raw data:", data);

  let columns = data.columns;
  console.log("columns:", columns);

  // 🔢 choose your numeric column name here
  const numericField = "% of grief processed"; // change this if yours is different!

  // 2. FILTER: keep only rows where numericField <= 20
  let filteredData = d3.filter(data, (d) => d[numericField] <= 20);
  console.log("filtered (<= 20):", filteredData);

  // 3. SORT: sort filtered data descending by numericField
  let sortedData = d3.sort(filteredData, (a, b) =>
    d3.descending(a[numericField], b[numericField])
  );
  console.log("sorted descending:", sortedData);

  // 4. MEAN
  let mean = d3.mean(filteredData, (d) => d[numericField]);
  console.log("mean:", mean);

  // 5. SUM
  let sum = d3.sum(filteredData, (d) => d[numericField]);
  console.log("sum:", sum);

  // 6. MIN
  let min = d3.min(filteredData, (d) => d[numericField]);
  console.log("min:", min);

  // 7. MAX
  let max = d3.max(filteredData, (d) => d[numericField]);
  console.log("max:", max);

  // 8. MODE
  let mode;
  if (d3.mode) {
    mode = d3.mode(filteredData, (d) => d[numericField]);
  } else {
    const counts = {};
    filteredData.forEach((d) => {
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
    mode = modeVal;
  }
  console.log("mode:", mode);

  // 9. Build an HTML table from the sorted data
  let table = document.createElement("table");

  // Header row
  let header = "<tr>";
  columns.forEach((colName) => {
    header += "<th>" + colName + "</th>";
  });
  header += "</tr>";

  // Body rows: use all columns dynamically
  let rows = "";
  sortedData.forEach((rowObj) => {
    rows += "<tr>";
    columns.forEach((colName) => {
      rows += "<td>" + rowObj[colName] + "</td>";
    });
    rows += "</tr>";
  });

  table.innerHTML = header + rows;

  let body = document.querySelector("body");
  body.appendChild(table);
}

window.onload = function () {
  loadData();
};
