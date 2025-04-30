document.addEventListener("click", function(event) {
    let sidebar = document.getElementById("sidebar");
    let menuIcon = document.getElementById("menuIcon");

    // Check if the sidebar is open
    if (sidebar.classList.contains("open")) {
        // Check if the clicked element is outside the sidebar and menu icon
        if (!sidebar.contains(event.target) && event.target !== menuIcon) {
            sidebar.classList.remove("open");
            menuIcon.style.display = "block"; // Show the menu icon again
        }
    }
});

function toggleSidebar() {
    let sidebar = document.getElementById("sidebar");
    let menuIcon = document.getElementById("menuIcon");

    sidebar.classList.toggle("open");
    menuIcon.style.display = sidebar.classList.contains("open") ? "none" : "block";
}