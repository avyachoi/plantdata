

async function loadData() {
	// 1. Load the data
	let data = await d3.csv("plantdata.csv", d3.autoType); 
	console.log("raw data:", data);

	let columns = data.columns;
	console.log("columns:", columns);

	// 👇 choose the numeric field you want to use for transforms
	// If your column is called "height" or "ranking", change this string
	const numericField = "size";

	// 2. FILTER: keep only rows where numericField <= 20
	let filteredData = d3.filter(data, (d) => {
		return d[numericField] <= 20;
	});
	console.log("filtered (<= 20):", filteredData);

	// 3. SORT: sort filtered data descending by numericField
	let sortedData = d3.sort(filteredData, (a, b) => {
		return d3.descending(a[numericField], b[numericField]);
	});
	console.log("sorted descending:", sortedData);

	// 4. MEAN: average numericField
	let mean = d3.mean(filteredData, (d) => d[numericField]);
	console.log("mean:", mean);

	// 5. SUM: total numericField
	let sum = d3.sum(filteredData, (d) => d[numericField]);
	console.log("sum:", sum);

	// 6. MIN: smallest numericField
	let min = d3.min(filteredData, (d) => d[numericField]);
	console.log("min:", min);

	// 7. MAX: largest numericField
	let max = d3.max(filteredData, (d) => d[numericField]);
	console.log("max:", max);

	// 8. MODE: most common numericField value
	let mode;
	if (d3.mode) {
		// if your d3 version has d3.mode
		mode = d3.mode(filteredData, (d) => d[numericField]);
	} else {
		// fallback manual mode calculation
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
	console.log("mode:", mode);

	// ✅ This prints all transformed values to the console,
	// which is exactly what your assignment asks for.

	// 9. Build a table from the *sorted* data
	let table = document.createElement("table");

	// Header row
	let header = "<tr>";
	columns.forEach((colName) => {
		header += "<th>" + colName + "</th>";
	});
	header += "</tr>";

	// Body rows: now use ALL columns dynamically, not just cat fields
	let rows = "";
	sortedData.forEach((rowObj) => {
		rows += "<tr>";
		columns.forEach((colName) => {
			rows += "<td>" + rowObj[colName] + "</td>";
		});
		rows += "</tr>";
	});

	let tableHTML = header + rows;
	table.innerHTML = tableHTML;

	let body = document.querySelector("body");
	body.appendChild(table);
}

window.onload = function() {
	loadData();
};
