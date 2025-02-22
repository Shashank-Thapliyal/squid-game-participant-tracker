const ctx = document.getElementById('participantChart').getContext('2d');

// Sample participant data
const participants = [
 
];

Promise.resolve

// Function to filter and update the chart
function updateChart() {
    const ageFilter = document.getElementById("ageFilter").value;
    const cityFilter = document.getElementById("cityFilter").value;

    let filteredData = participants;

    // Filter by age
    if (ageFilter !== "all") {
        const [minAge, maxAge] = ageFilter.split("-").map(Number);
        filteredData = filteredData.filter(p => p.age >= minAge && p.age <= maxAge);
    }

    // Filter by city
    if (cityFilter !== "all") {
        filteredData = filteredData.filter(p => p.city === cityFilter);
    }

    // Prepare data for chart
    const labels = filteredData.map((p, index) => `Participant ${index + 1}`);
    const values = filteredData.map(p => p.value);

    // Update chart
    chart.data.labels = labels;
    chart.data.datasets[0].data = values;
    chart.update();
}

// Initialize Chart.js
const chart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Participant Score',
            data: [],
            borderColor: 'blue',
            borderWidth: 2,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

// Add event listeners to filters
document.getElementById("ageFilter").addEventListener("change", updateChart);
document.getElementById("cityFilter").addEventListener("change", updateChart);

// Initial chart render
updateChart();
