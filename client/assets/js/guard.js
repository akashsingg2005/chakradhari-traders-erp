// =======================================
// ERP Security Guard
// =======================================

(function () {

    const token = localStorage.getItem("token");

    // Pages that don't require login
    const publicPages = [
        "index.html",
        "login.html"
    ];

    const currentPage = window.location.pathname
        .split("/")
        .pop();

    // -----------------------------
    // Login Protection
    // -----------------------------

    if (!publicPages.includes(currentPage)) {

        if (!token) {

            localStorage.clear();

            window.location.replace("../index.html");

            return;

        }

    }

    

})();