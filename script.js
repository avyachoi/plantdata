console.log("✅ script.js loaded");

async function loadData() {
  console.log("✅ loadData started");

  // 1. Load CSV
  let data = await d3.csv("plantdata.csv", d3.autoType);
  console.log("raw data:", data);
  console.log("columns:", data.columns);

  // 2. Create a numeric field from "% of grief processed"
  data.forEach(d => {
    // d["% of grief processed"] is like "10.00%" or "0"
    let val = d["% of grief processed"];

    if (typeof val === "string") {
      val = val.replace("%", ""); // remove %
    }

    d.griefPercent = val === "" ? NaN : +val; // convert to Number
  });

  console.log("with griefPercent:", data);

  const numericField = "griefPercent"; // 👈 this is our numeric field now

  // 3. FILTER: only plants where griefPercent >= 20
  let filteredData = d3.filter(data, d => d[numericField] >= 20);
  console.log("filtered (griefPercent >= 20):", filteredData);

  // 4. SORT: sort descending by griefPercent
  let sortedData = d3.sort(filteredData, (a, b) =>
    d3.descending(a[numericField], b[numericField])
  );
  console.log("sorted descending:", sortedData);

  // 5. MEAN
  let mean = d3.mean(filteredData, d => d[numericField]);
  console.log("mean griefPercent:", mean);

  // 6. SUM
  let sum = d3.sum(filteredData, d => d[numericField]);
  console.log("sum griefPercent:", sum);

  // 7. MIN
  let min = d3.min(filteredData, d => d[numericField]);
  console.log("min griefPercent:", min);

  // 8. MAX
  let max = d3.max(filteredData, d => d[numericField]);
  console.log("max griefPercent:", max);

  // 9. MODE (most common griefPercent value)
  let mode;
  if (d3.mode) {
    mode = d3.mode(filteredData, d => d[numericField]);
  } else {
    const counts = {};
    filteredData.forEach(d => {
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
  console.log("mode griefPercent:", mode);

  // 10. Build an HTML table (so you see it on the page, not just console)
  let table = document.createElement("table");

  // Start with the original CSV columns
  let columns = data.columns.slice(); // copy
  // And add our new computed column
  columns.push("griefPercent");

  // Header row
  let header = "<tr>";
  columns.forEach(colName => {
    header += "<th>" + colName + "</th>";
  });
  header += "</tr>";

  // Body rows: use sortedData so the table reflects your transforms
  let rows = "";
  sortedData.forEach(rowObj => {
    rows += "<tr>";
    columns.forEach(colName => {
      rows += "<td>" + (rowObj[colName] ?? "") + "</td>";
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

