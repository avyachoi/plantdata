console.log("✅ script.js loaded");

async function loadData() {
  console.log("✅ loadData started");

  // 1. Load your plant CSV
  let data = await d3.csv("plantdata.csv", d3.autoType);
  console.log("raw plant data:", data);
  console.log("columns from d3:", data.columns);

  // 2. Create a numeric field from "% of grief processed"
  data.forEach(d => {
    let val = d["% of grief processed"];

    if (val === null || val === undefined || val === "") {
      d.griefPercent = NaN;
      return;
    }

    if (typeof val === "string") {
      // parseFloat("10.00%") → 10
      d.griefPercent = parseFloat(val);
    } else {
      d.griefPercent = val;
    }
  });

  console.log("griefPercent values:", data.map(d => d.griefPercent));

  const numericField = "griefPercent"; // 👈 our chosen numeric property

  // 3. FILTER: keep only rows where griefPercent is a real number
  const filtered = data.filter(d => Number.isFinite(d[numericField]));
  console.log("filtered (finite griefPercent):", filtered);

  // 4. SORT: descending by griefPercent
  const sorted = d3.sort(filtered, (a, b) =>
    d3.descending(a[numericField], b[numericField])
  );
  console.log("sorted by griefPercent (desc):", sorted);

  // 5. MEAN
  const mean = d3.mean(filtered, d => d[numericField]);
  console.log("mean griefPercent:", mean);

  // 6. SUM
  const sum = d3.sum(filtered, d => d[numericField]);
  console.log("sum griefPercent:", sum);

  // 7. MIN
  const min = d3.min(filtered, d => d[numericField]);
  console.log("min griefPercent:", min);

  // 8. MAX
  const max = d3.max(filtered, d => d[numericField]);
  console.log("max griefPercent:", max);

  // 9. MODE (most common griefPercent value)
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
  console.log("mode griefPercent:", mode);

  // 10. OPTIONAL: build a table so you see it on the page

  const table = document.createElement("table");

  // Start with original CSV columns
  let columns = data.columns.slice();
  // Add our computed numeric field at the end
  if (!columns.includes("griefPercent")) {
    columns.push("griefPercent");
  }

  // Header row
  let header = "<tr>";
  columns.forEach(colName => {
    header += "<th>" + colName + "</th>";
  });
  header += "</tr>";

  // Rows: use sorted data so the table matches the transforms
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

