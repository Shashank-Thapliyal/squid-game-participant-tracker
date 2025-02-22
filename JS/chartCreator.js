document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.getElementById("chart").getContext("2d");
    const filter = document.getElementById("filter");

    let chartInstance;

    fetch("./data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Data Loaded: ", data);  // Debugging step
            filter.addEventListener("change", () => updateChart(data));
            updateChart(data);
        })
        .catch(error => console.error("Error loading JSON:", error));

    function updateChart(data) {
        const selectedFilter = filter.value;

        let labels = [];
        let dataset = [];

        if (selectedFilter === "age") {
            labels = data.map(participant => participant.name);
            dataset = data.map(participant => participant.age);
        } else if (selectedFilter === "location") {
            const locationCounts = {};
            data.forEach(participant => {
                locationCounts[participant.location] = (locationCounts[participant.location] || 0) + 1;
            });
            labels = Object.keys(locationCounts);
            dataset = Object.values(locationCounts);
        } else if (selectedFilter === "eliminations") {
            const rounds = {};
            data.filter(p => p.status === "Eliminated").forEach(participant => {
                rounds[participant.rounds_survived] = (rounds[participant.rounds_survived] || 0) + 1;
            });
            labels = Object.keys(rounds).sort((a, b) => a - b);
            dataset = labels.map(key => rounds[key]);
        }

        if (chartInstance) {
            chartInstance.destroy();
        }

        console.log("Labels:", labels);
        console.log("Dataset:", dataset);

        chartInstance = new Chart(ctx, {
            type: "line",
            data: {
                labels: labels,
                datasets: [{
                    label: selectedFilter.replace(/^\w/, c => c.toUpperCase()),
                    data: dataset,
                    borderColor: "#e93e7d",
                    backgroundColor: "rgba(0, 0, 255, 0.1)",
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
});
