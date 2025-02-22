async function loadProfile() {
    const params = new URLSearchParams(window.location.search);
    const participantId = params.get("participant");

    const response = await fetch("data.json");
    const participants = await response.json();
    const participant = participants.find(p => p.participant_number == participantId);

    if (!participant) {
        document.getElementById("profileContainer").innerHTML = "<h2>Participant not found.</h2>";
        return;
    }

    document.getElementById("profileContainer").innerHTML = `
        <h2>${participant.name} (#${participant.participant_number})</h2>
        <p><strong>Age:</strong> ${participant.age}</p>
        <p><strong>Occupation:</strong> ${participant.occupation}</p>
        <p><strong>Location:</strong> ${participant.location}</p>
        <p><strong>Status:</strong> ${participant.status}</p>
        <p><strong>Rounds Survived:</strong> ${participant.rounds_survived}</p>
        <p><strong>Backstory:</strong> ${participant.backstory}</p>
        <button onclick="goBack()">Back to Dashboard</button>
    `;
}

// Function to navigate back
function goBack() {
    window.history.back();
}

// Initialize profile page
document.addEventListener("DOMContentLoaded", loadProfile);
