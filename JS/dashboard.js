async function loadDashboard() {
    // Fetch data
    const response = await fetch('data.json');
    const participants = await response.json();
    
    renderParticipants(participants);

    // Search functionality
    document.getElementById("search").addEventListener("input", (e) => {
        let query = e.target.value.trim();
        let filtered = participants.filter(p => p.participant_number.includes(query));
        renderParticipants(filtered);
    });

    // Filter functionality
    document.getElementById("filter").addEventListener("change", (e) => {
        let status = e.target.value;
        let filtered = participants.filter(p => status === "All" || p.status === status);
        renderParticipants(filtered);
    });
}

// Function to display participants
function renderParticipants(participants) {
    const container = document.getElementById("participantsContainer");
    container.innerHTML = ""; // Clear existing content

    participants.forEach(p => {
        let card = `
            <div class="participant-card ${p.status === 'Eliminated' ? 'eliminated' : ''}" onclick="viewProfile(${p.participant_number})">
                <h3>#${p.participant_number}</h3>
                <p>${p.name} - ${p.occupation}</p>
                <p>Status: ${p.status}</p>
                <p>Rounds Survived: ${p.rounds_survived}</p>
            </div>
        `;
        container.innerHTML += card;
    });
}

// Navigate to profile page
function viewProfile(id) {
    window.location.href = `profile.html?participant=${id}`;
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", loadDashboard);
