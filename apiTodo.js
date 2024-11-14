export function createTable(tasks) {
    const table = document.createElement("table");
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const headers = ["ID", "Titre", "Description", "Etat"];
    const headerRow = document.createElement("tr");

    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    tasks.forEach(task => {
        const row = document.createElement("tr");

        const idCell = document.createElement("td");
        idCell.textContent = task.id;
        row.appendChild(idCell);

        const titleCell = document.createElement("td");
        titleCell.textContent = task.title;
        row.appendChild(titleCell);

        const descriptionCell = document.createElement("td");
        descriptionCell.textContent = task.description;
        row.appendChild(descriptionCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = task.status;
        row.appendChild(statusCell);

        tbody.appendChild(row);
    });

    table.appendChild(thead);
    table.appendChild(tbody);


    
    return table;
}
