document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const filter = document.getElementById("filter");
    const remainingCountElement = document.getElementById("remainingCount");
    let chartInstance;

    function fetchLiveData() {
        return new Promise((resolve) => {
            const storedData = localStorage.getItem("participants");
            if (storedData) {
                resolve(JSON.parse(storedData));
            } else {
                fetch("./data.json")
                    .then(response => response.json())
                    .then(data => resolve(data))
                    .catch(error => {
                        console.error("Error loading JSON:", error);
                        resolve([]);
                    });
            }
        });
    }
    
    

    async function updateChart() {
        const data = await fetchLiveData();
        const selectedFilter = filter.value;

        let labels = [];
        let dataset = [];
        const rounds = {};

        data.forEach(participant => {
            if (participant.status === "Eliminated") {
                rounds[participant.rounds_survived] = (rounds[participant.rounds_survived] || 0) + 1;
            }
        });

        labels = Object.keys(rounds).sort((a, b) => a - b);
        dataset = labels.map(round => rounds[round]);

        let totalParticipants = data.length;
        let remainingParticipants = totalParticipants;
        let remainingDataset = [];

        labels.forEach(round => {
            remainingParticipants -= rounds[round] || 0;
            remainingDataset.push(remainingParticipants);
        });

        remainingCountElement.textContent = `Participants Remaining: ${remainingParticipants}`;

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Eliminations per Round",
                        data: dataset,
                        borderColor: "#ff4d6d",
                        backgroundColor: "rgba(255, 77, 109, 0.2)",
                        fill: true
                    },
                    {
                        label: "Participants Remaining",
                        data: remainingDataset,
                        borderColor: "#00c8ff",
                        backgroundColor: "rgba(0, 200, 255, 0.2)",
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

    filter.addEventListener("change", updateChart);

    // Update chart when clicking "Analytics" button
    document.getElementById("analyticsButton").addEventListener("click", updateChart);

    updateChart();
});
