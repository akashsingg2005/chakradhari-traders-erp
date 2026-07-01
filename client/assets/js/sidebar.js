function openSidebar(){

document
.getElementById("sidebar")
.classList.add("show");

document
.getElementById("sidebarOverlay")
.classList.add("show");

document.getElementById("sideOwner").innerText =
localStorage.getItem("ownerName") || "User";

document.getElementById("sideBusiness").innerText =
localStorage.getItem("businessName") || "Business";

document.getElementById("sideBusinessType").innerText =
localStorage.getItem("businessType") || "";

}

function closeSidebar(){

document
.getElementById("sidebar")
.classList.remove("show");

document
.getElementById("sidebarOverlay")
.classList.remove("show");

}