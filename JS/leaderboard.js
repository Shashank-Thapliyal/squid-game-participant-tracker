document.addEventListener("DOMContentLoaded", () => {
    const leaderboardTable = document.querySelector("#leaderboard table");

    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded: ", data);

            // Sort participants based on rounds survived (descending order)
            data.sort((a, b) => b.rounds_survived - a.rounds_survived);

            // Limit to top 10
            const topParticipants = data.slice(0, 10);

            // Clear existing table rows
            leaderboardTable.innerHTML = "";

            // Add new rows dynamically
            topParticipants.forEach((participant, index) => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td class="number">${index + 1}</td>
                    <td class="name">${participant.name}</td>
                    <td class="points">${participant.rounds_survived}</td>
                `;

                leaderboardTable.appendChild(row);
            });
        })
        .catch(error => console.error("Error loading JSON:", error));
});
