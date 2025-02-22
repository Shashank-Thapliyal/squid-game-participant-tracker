document.addEventListener("DOMContentLoaded", loadDashboard);

let participants = [];
let eliminatedParticipants = [];
let currentRound = 0;
const maxRounds = 6;
const participantsContainer = document.getElementById("participantsContainer");
const startRoundBtn = document.getElementById("startRound");
const winnerModal = document.getElementById("winnerModal");
const winnerDetails = document.getElementById("winnerDetails");
const closeModal = document.getElementById("closeModal");

// Load Dashboard Data
async function loadDashboard() {
    try {
        const response = await fetch("dummy_data.json");
        const data = await response.json();

        if (data.length > 0) {
            participants = data;
        } else {
            await resetGameData(); // Reset if dummy_data.json is empty
        }

        renderParticipants(participants);
        updateChart();
    } catch (error) {
        console.error("Error loading participants:", error);
    }

    document.getElementById("search").addEventListener("input", (e) => {
        let query = e.target.value.trim();
        let filtered = participants.filter((p) =>
            p.participant_number.toString().includes(query)
        );
        renderParticipants(filtered);
    });

    document.getElementById("filter").addEventListener("change", (e) => {
        let status = e.target.value;
        if (status === "Eliminated") {
            renderParticipants(eliminatedParticipants);
        } else {
            let filtered = participants.filter(
                (p) => status === "All" || p.status === status
            );
            renderParticipants(filtered);
        }
    });

    startRoundBtn.addEventListener("click", startNextRound);
}

// **Reset Game Data (only when a new game starts)**
async function resetGameData() {
    try {
        const response = await fetch("data.json");
        const originalData = await response.json();

        await saveToDummyData(originalData);

        participants = originalData;
        eliminatedParticipants = [];
        currentRound = 0;

        console.log("Game data reset. New game started.");
    } catch (error) {
        console.error("Error resetting game data:", error);
    }
}

// **Save Data to dummy_data.json**
async function saveToDummyData(updatedData) {
    await fetch("dummy_data.json", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData, null, 2)
    });
}

// Function to Display Participants
function renderParticipants(participantsList) {
    participantsContainer.innerHTML = "";

    participantsList.forEach((p) => {
        let card = `
            <div class="participant-card ${p.status === "Eliminated" ? "eliminated" : ""}" onclick="viewProfile(${p.participant_number})">
                <h3>#${p.participant_number}</h3>
                <p>${p.name} - ${p.occupation}</p>
                <p>Status: ${p.status}</p>
                <p>Rounds Survived: ${p.rounds_survived}</p>
            </div>
        `;
        participantsContainer.innerHTML += card;
    });
}

async function startNextRound() {
    if (currentRound >= maxRounds) return;

    currentRound++;

    let eliminationCount;
    if (currentRound < maxRounds) {
        let eliminationRate = currentRound === 1 ? 0.5 : (1 / (maxRounds - currentRound + 2));
        eliminationCount = Math.floor(participants.length * eliminationRate);
        if (participants.length - eliminationCount < 1) {
            eliminationCount = participants.length - 1;
        }
    } else {
        eliminationCount = participants.length - 1;
    }

    let newlyEliminated = [];
    for (let i = 0; i < eliminationCount; i++) {
        let randomIndex = Math.floor(Math.random() * participants.length);
        let eliminatedParticipant = participants.splice(randomIndex, 1)[0];
        eliminatedParticipant.status = "Eliminated";
        newlyEliminated.push(eliminatedParticipant);
    }

    eliminatedParticipants.push(...newlyEliminated);

    if (participants.length === 1) {
        participants[0].rounds_survived = maxRounds;
        renderParticipants(participants);
        await saveToDummyData(participants.concat(eliminatedParticipants));
        updateChart();
        updateLeaderboard();  // <-- 🆕 Update leaderboard dynamically
        setTimeout(() => showWinner(participants[0]), 300);
        return;
    }

    participants.forEach(p => p.rounds_survived++);
    newlyEliminated.forEach(p => p.rounds_survived++);

    renderParticipants(participants);
    await saveToDummyData(participants.concat(eliminatedParticipants));

    updateChart();
    updateLeaderboard();  // <-- 🆕 Update leaderboard dynamically

    startRoundBtn.innerText = currentRound < maxRounds ? "Next Round" : "Final Round";
}

// Show Winner Modal
function showWinner(winner) {
    winnerDetails.innerHTML = `
        <h2>🏆 Winner Found! 🎉</h2>
        <p><strong>Participant #${winner.participant_number}</strong></p>
        <p>${winner.name} - ${winner.occupation}</p>
        <p>Rounds Survived: ${winner.rounds_survived}</p>
    `;
    winnerModal.style.display = "block";
    startRoundBtn.disabled = true;
    runConfetti();
}

closeModal.addEventListener("click", () => {
    winnerModal.style.display = "none";
});

// Confetti Effect
function runConfetti() {
    const confettiSettings = { target: "confetti-canvas" };
    const confetti = new ConfettiGenerator(confettiSettings);
    confetti.render();
}

// Navigate to Profile Page
function viewProfile(id) {
    window.location.href = `profile.html?participant=${id}`;
}

// **Chart Logic**
function updateChart() {
    let aliveCount = participants.length;
    let eliminatedCount = eliminatedParticipants.length;

    let chartData = {
        labels: ["Alive", "Eliminated"],
        datasets: [{
            data: [aliveCount, eliminatedCount],
            backgroundColor: ["#4CAF50", "#FF5733"]
        }]
    };

    let ctx = document.getElementById("chartCanvas").getContext("2d");

    if (window.myChart) {
        window.myChart.destroy();
    }

    document.getElementById('remainingCount').innerText = `Participants Remaining : ${456 - eliminatedParticipants.length}`

    window.myChart = new Chart(ctx, {
        type: "doughnut",
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}


// Function to open statistics modal
function openStatsModal() {
    document.getElementById('statsModal').style.display = 'block';
   
}

// Function to close statistics modal
function closeStatsModal() {
    document.getElementById('statsModal').style.display = 'none';
}

// Close modal if user clicks outside of it
window.onclick = function(event) {
    let modal = document.getElementById('statsModal');
    if (event.target === modal) {
        closeStatsModal();
    }
};

function updateLeaderboard() {
    const leaderboardTable = document.querySelector("#leaderboard table");

    // Combine participants and eliminatedParticipants for sorting
    let allParticipants = [...participants, ...eliminatedParticipants];

    // Sort based on rounds survived (descending)
    allParticipants.sort((a, b) => b.rounds_survived - a.rounds_survived);

    // Take the top 10 participants
    const topParticipants = allParticipants.slice(0, 10);

    // Clear the table
    leaderboardTable.innerHTML = "";

    // Populate leaderboard table
    topParticipants.forEach((participant, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="number" >${index + 1}</td>
            <td class="name">${index==1 && participant.rounds_survived == 6? `🏆${participant.name}`: participant.name }</td>
            <td class="points">${participant.rounds_survived}</td>
        `;
        leaderboardTable.appendChild(row);
    });
}

