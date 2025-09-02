document.addEventListener("click", function(event) {
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.getElementById("menuIcon");
    const navBar = document.getElementById("nav-bar"); // Get the main nav bar

    // Check if the sidebar is open
    if (sidebar.classList.contains("open")) {
        // Check if the clicked element is outside the sidebar and menu icon
        if (!sidebar.contains(event.target) && event.target !== menuIcon) {
            sidebar.classList.remove("open");
            // Show menu icon only if the main nav bar is hidden (i.e., on smaller screens)
            if (window.getComputedStyle(navBar).display === "none") {
                menuIcon.style.display = "block";
            }
        }
    }
});

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");
    const menuIcon = document.getElementById("menuIcon");
    const navBar = document.getElementById("nav-bar"); // Get the main nav bar

    sidebar.classList.toggle("open");
    // Hide menu icon if sidebar is open, show it only if main nav bar is hidden
    if (sidebar.classList.contains("open")) {
        menuIcon.style.display = "none";
    } else {
        if (window.getComputedStyle(navBar).display === "none") {
            menuIcon.style.display = "block";
        }
    }
}

// Open/close with click or keyboard
document.getElementById("menuIcon").addEventListener("click", toggleSidebar);
document.getElementById("menuIcon").addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent default scroll behavior for space key
        toggleSidebar();
    }
});
document.getElementById("closeBtn").addEventListener("click", toggleSidebar);
document.getElementById("closeBtn").addEventListener("keydown", function(e) {
    if (e.key === "Enter" || e.key === " ") {
        e.preventDefault(); // Prevent default scroll behavior for space key
        toggleSidebar();
    }
});

// Add a resize listener to adjust menu icon visibility if the screen size changes
window.addEventListener('resize', function() {
    const menuIcon = document.getElementById("menuIcon");
    const navBar = document.getElementById("nav-bar");
    const sidebar = document.getElementById("sidebar");

    // If the main nav bar is visible, hide the menu icon and close sidebar
    if (window.getComputedStyle(navBar).display !== "none") {
        menuIcon.style.display = "none";
        sidebar.classList.remove("open");
    } else {
        // If main nav bar is hidden, ensure menu icon is visible if sidebar is closed
        if (!sidebar.classList.contains("open")) {
            menuIcon.style.display = "block";
        }
    }
});
