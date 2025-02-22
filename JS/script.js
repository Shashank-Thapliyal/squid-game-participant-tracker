document.addEventListener("DOMContentLoaded", () => {
    if (document.body.id === "dashboard") {
        loadDashboard();
    } else if (document.body.id === "profile") {
        loadProfile();
    }
});
 //sidebar bana