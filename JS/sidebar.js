const showMenu = (toggleId, navbarId, bodyId) => {
    const toggle = document.getElementById(toggleId);
    const navbar = document.getElementById(navbarId);
    const body = document.getElementById(bodyId);

    if (toggle && navbar) {
        toggle.addEventListener('click', () => {
            navbar.classList.toggle('expander');
            body.classList.toggle('body-pd');
        });
    }
};

showMenu('nav-toggle', 'navbar', 'body-pd');

// Active link highlight
const linkColor = document.querySelectorAll('.nav-link');
function colorLink() {
    linkColor.forEach(l => l.classList.remove('active'));
    this.classList.add('active');
}
linkColor.forEach(l => l.addEventListener('click', colorLink));
