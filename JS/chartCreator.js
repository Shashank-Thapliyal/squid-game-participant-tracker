document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const filter = document.getElementById("filter");
    const remainingCountElement = document.getElementById("remainingCount");

    let chartInstance;

    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded: ", data);
            filter.addEventListener("change", () => updateChart(data));
            updateChart(data);
        })
        .catch(error => console.error("Error loading JSON:", error));

    function updateChart(data) {
        const selectedFilter = filter.value;

        let labels = [];
        let dataset = [];

        // Track eliminations per round
        const rounds = {};
        data.forEach(participant => {
            if (participant.status === "Eliminated") {
                rounds[participant.rounds_survived] = (rounds[participant.rounds_survived] || 0) + 1;
            }
        });

        // Get sorted round numbers
        labels = Object.keys(rounds).sort((a, b) => a - b);
        dataset = labels.map(round => rounds[round]);

        // Track remaining participants per round
        let totalParticipants = data.length;
        let remainingParticipants = totalParticipants;
        let remainingDataset = [];

        labels.forEach(round => {
            remainingParticipants -= rounds[round] || 0;
            remainingDataset.push(remainingParticipants);
        });

        // Update remaining participants count
        remainingCountElement.textContent = `Participants Remaining: ${remainingParticipants}`;

        // Destroy previous chart
        if (chartInstance) {
            chartInstance.destroy();
        }

        // Create new chart
        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Eliminations per Round",
                        data: dataset,
                        borderColor: "#e93e7d",
                        backgroundColor: "rgba(233, 62, 125, 0.2)",
                        fill: true
                    },
                    {
                        label: "Participants Remaining",
                        data: remainingDataset,
                        borderColor: "#007bff",
                        backgroundColor: "rgba(0, 123, 255, 0.2)",
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: "Rounds",
                            font: { size: 14 }
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: "Number of Participants",
                            font: { size: 14 }
                        }
                    }
                }
            }
        });
    }
});
