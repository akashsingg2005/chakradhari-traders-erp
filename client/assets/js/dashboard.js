const API = "http://localhost:5000/api/v1";

const token = localStorage.getItem("token");

let businesses = [];

let selectedBusiness = localStorage.getItem("businessId");

let editingBusiness = null;

// ==========================
// Notifications
// ==========================

let notifications = [];

// ==========================
// Load Dashboard
// ==========================

window.onload = async () => {

    await loadBusinesses();

    await loadNotifications();

};

// ==========================
// Logout
// ==========================

function logout(){

    localStorage.clear();

    window.location.replace("index.html");

}

// ==========================
// Load Businesses
// ==========================

async function loadBusinesses(){

    try{

        const response = await fetch(

            `${API}/business`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(!result.success){

            return;

        }

        businesses = result.data;

        // No business created yet
if (businesses.length === 0) {

    document.getElementById("businessName").innerText =
        "No Business";

    document.getElementById("businessType").innerText =
        "Tap 'Add New Business'";

    return;

}

// Select first business automatically
if (!selectedBusiness) {

    selectedBusiness = businesses[0]._id;

    localStorage.setItem(
        "businessId",
        selectedBusiness
    );

}

renderBusiness();

renderBusinessList();

loadDashboard();

    }

    catch(error){

        console.log(error);

    }

}

// ==========================
// Current Business
// ==========================

function renderBusiness(){

    const business = businesses.find(

        b => b._id === selectedBusiness

    );

    if(!business){

        return;

    }

    // Business Card
    document.getElementById("businessName").innerText =
        business.businessName;

    document.getElementById("businessType").innerText =
        business.businessType;

    // Greeting
    const hour = new Date().getHours();

    let greeting = "Good Evening 🌙";

    if(hour < 12){

        greeting = "Good Morning ☀️";

    }
    else if(hour < 17){

        greeting = "Good Afternoon 🌤️";

    }

    document.getElementById("greeting").innerText =
        greeting;

    document.getElementById("ownerName").innerText =
        business.ownerName;
    // Save business information for other pages
localStorage.setItem(
    "ownerName",
    business.ownerName
);

localStorage.setItem(
    "businessName",
    business.businessName
);

localStorage.setItem(
    "businessType",
    business.businessType
);

localStorage.setItem(
    "businessId",
    business._id
);    

}

// ==========================
// Business List
// ==========================

function renderBusinessList(){

    const list =
    document.getElementById("businessList");

    list.innerHTML = "";

    businesses.forEach(business=>{

        list.innerHTML += `

        <div class="business-item"
        onclick="switchBusiness('${business._id}')">

            <div class="business-info">

                <h3>
                    ${business.businessName}
                </h3>

                <p>
                    ${business.businessType}
                </p>

            </div>

            ${
                selectedBusiness===business._id
                ? `<i class="fa-solid fa-circle-check"
                     style="color:#2563eb;font-size:22px"></i>`
                : ""
            }

        </div>

        `;

    });

}

// ==========================
// Switch Business
// ==========================

function switchBusiness(id){

    selectedBusiness = id;

    localStorage.setItem(

        "businessId",

        id

    );

    closeBusinessSheet();

    loadBusinesses();

    loadDashboard();

}

// ==========================
// Bottom Sheet
// ==========================

function openBusinessSheet(){

    document.getElementById(

        "businessSheet"

    ).classList.add("show");

}

function closeBusinessSheet(){

    document.getElementById(

        "businessSheet"

    ).classList.remove("show");

}
// ===================================
// Load Dashboard Data
// ===================================

async function loadDashboard(){

    if(!selectedBusiness){

        return;

    }

    try{

        const response = await fetch(

            `${API}/dashboard?business=${selectedBusiness}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(!result.success){

            return;

        }

        updateSummary(result.summary);

        renderPayments(result.recentPayments);

        renderPendingWorks(result.pendingWorks);

        renderChart(result.monthlyRevenue);

    }

    catch(error){

        console.log(error);

    }

}

// ===================================
// Summary Cards
// ===================================

function updateSummary(summary){

    document.getElementById("outstanding").innerText =
    "₹"+(summary.outstanding || 0);

    document.getElementById("todayIncome").innerText =
    "₹"+(summary.todayIncome || 0);

    document.getElementById("monthlyIncome").innerText =
    "₹" + (summary.monthlyIncome || 0);

    document.getElementById("monthlyExpense").innerText =
    "₹" + (summary.monthlyExpense || 0);

    document.getElementById("customerCount").innerText =
    summary.customers || 0;

    document.getElementById("workCount").innerText =
    summary.activeWorks || 0;

    // Profit / Loss

document.getElementById("profitAmount").innerText =
"₹" + (summary.profit || 0);

const profitCard =
document.getElementById("profitCard");

profitCard.classList.remove("profit","loss");

if(summary.profit >= 0){

    profitCard.classList.add("profit");

}else{

    profitCard.classList.add("loss");

}

}

// ===================================
// Recent Payments
// ===================================

function renderPayments(payments){

    const container = document.getElementById("recentPayments");

    container.innerHTML = "";

    if(!payments || payments.length===0){

        container.innerHTML = `
            <div class="empty-card">
                No Payments Yet
            </div>
        `;

        return;
    }

    payments.forEach(payment=>{

        const customerName = payment.customer
            ? payment.customer.name
            : "Unknown Customer";

        const date = new Date(payment.createdAt)
            .toLocaleDateString();

        container.innerHTML += `

        <div class="payment-card">

            <div class="payment-left">

                <h4>${customerName}</h4>

                <small>${payment.paymentMethod}</small>

            </div>

            <div class="payment-right">

                <h3>₹${payment.amount}</h3>

                <small>${date}</small>

            </div>

        </div>

        `;

    });

}


// ===================================
// Pending Works
// ===================================

function renderPendingWorks(works){

    const container = document.getElementById("pendingWorks");

    container.innerHTML = "";

    if(!works || works.length===0){

        container.innerHTML = `
            <div class="empty-card">
                No Pending Work
            </div>
        `;

        return;
    }

    works.forEach(work=>{

        const customerName = work.customer
            ? work.customer.name
            : "Unknown Customer";

        container.innerHTML += `

        <div class="work-card">

            <h4>${work.workName}</h4>

            <p>${customerName}</p>

            <p>Pending ₹${work.pendingAmount}</p>

            <span class="status pending">

                ${work.workStatus}

            </span>

        </div>

        `;

    });

}

// ===================================
// Revenue Chart
// ===================================

let chart;

function renderChart(data){

    const ctx =
    document.getElementById("revenueChart");

    if(chart){

        chart.destroy();

    }

    chart = new Chart(ctx,{

        type:"line",

        data:{

            labels:[
                "Jan","Feb","Mar","Apr",
                "May","Jun","Jul","Aug",
                "Sep","Oct","Nov","Dec"
            ],

            datasets:[{

                label:"Revenue",

                data:data,

                borderWidth:3,

                tension:.4,

                fill:false

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    });

}

// ===================================
// Business Form
// ===================================

function openBusinessForm(){

    editingBusiness = null;

    document.getElementById(
        "businessFormTitle"
    ).innerText="Add Business";

    document.getElementById(
        "businessForm"
    ).classList.add("show");

}

function closeBusinessForm(){

    document.getElementById(
        "businessForm"
    ).classList.remove("show");

}

// ===================================
// Save Business
// ===================================

async function saveBusiness(){

    const business = {

        businessName: document.getElementById("businessNameInput").value,

        ownerName: document.getElementById("ownerNameInput").value,

        businessType: document.getElementById("businessTypeInput").value,

        mobile: document.getElementById("mobileInput").value,

        email: document.getElementById("emailInput").value,

        gstNumber: document.getElementById("gstInput").value,

        address: document.getElementById("addressInput").value

    };

    try{

        let response;

        if(editingBusiness){

            response = await fetch(

                `${API}/business/${editingBusiness}`,

                {

                    method:"PUT",

                    headers:{

                        "Content-Type":"application/json",

                        Authorization:`Bearer ${token}`

                    },

                    body:JSON.stringify(business)

                }

            );

        }

        else{

            response = await fetch(

                `${API}/business`,

                {

                    method:"POST",

                    headers:{

                        "Content-Type":"application/json",

                        Authorization:`Bearer ${token}`

                    },

                    body:JSON.stringify(business)

                }

            );

        }

        const result = await response.json();

        if(result.success){

            alert(result.message);

            if(!editingBusiness){

                selectedBusiness = result.data._id;

                localStorage.setItem(

                    "businessId",

                    selectedBusiness

                );

            }

            closeBusinessForm();

            loadBusinesses();

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to save business.");

    }

}

// ===================================
// Edit Business
// ===================================

function editBusiness(){

    const business = businesses.find(

        b=>b._id===selectedBusiness

    );

    if(!business){

        return;

    }

    editingBusiness = business._id;

    document.getElementById(
        "businessFormTitle"
    ).innerText="Edit Business";

    document.getElementById(
        "businessNameInput"
    ).value=business.businessName;

    document.getElementById(
        "ownerNameInput"
    ).value=business.ownerName;

    document.getElementById(
        "businessTypeInput"
    ).value=business.businessType;

    document.getElementById(
        "mobileInput"
    ).value=business.mobile;

    document.getElementById(
        "emailInput"
    ).value=business.email;

    document.getElementById(
        "gstInput"
    ).value=business.gstNumber;

    document.getElementById(
        "addressInput"
    ).value=business.address;

    openBusinessForm();

}

// ===================================
// Delete Business
// ===================================

function deleteBusiness(){

    document.getElementById(
        "deleteBusinessSheet"
    ).classList.add("show");

}

function closeDeleteSheet(){

    document.getElementById(
        "deleteBusinessSheet"
    ).classList.remove("show");

}

async function confirmDeleteBusiness(){

    if(businesses.length<=1){

        alert("At least one business is required.");

        return;

    }

    if(!confirm(
        "Delete this business permanently?"
    )){

        return;

    }

    try{

        const response =
        await fetch(

            `${API}/business/${selectedBusiness}`,

            {

                method:"DELETE",

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result =
        await response.json();

        alert(result.message);

        closeDeleteSheet();

        localStorage.removeItem("businessId");

        loadBusinesses();

    }

    catch(error){

        console.log(error);

    }

}

function viewAllPayments(){

    localStorage.setItem("ledgerMode","all");

    location.href="pages/ledger.html";

}

// ======================================
// Notifications
// ======================================

async function loadNotifications(){

    try{

        const response = await fetch(

            `${API}/dashboard/notifications?business=${selectedBusiness}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(result.success){

            notifications = result.data;

        }

        document.getElementById("notificationDot").style.display =

            notifications.length

            ? "block"

            : "none";

    }

    catch(error){

        console.log(error);

    }

}


function openNotification(){

    renderNotifications();

    document
    .getElementById("notificationModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

}

function closeNotification(){

    document
        .getElementById("notificationModal")
        .classList.remove("show");

    document
        .getElementById("overlay")
        .classList.remove("show");

}

function getTimeAgo(date){

    const seconds = Math.floor((new Date() - new Date(date)) / 1000);

    const minutes = Math.floor(seconds / 60);

    const hours = Math.floor(minutes / 60);

    const days = Math.floor(hours / 24);

    if(seconds < 60){

        return "Just now";

    }

    if(minutes < 60){

        return `${minutes} min ago`;

    }

    if(hours < 24){

        return `${hours} hour${hours > 1 ? "s" : ""} ago`;

    }

    if(days === 1){

        return "Yesterday";

    }

    return `${days} days ago`;

}


function renderNotifications(){

    const list = document.getElementById("notificationList");

    list.innerHTML = "";

    if(notifications.length === 0){

        list.innerHTML = `

        <div class="notification-card">

            <h3>No Notifications</h3>

            <p>You're all caught up 🎉</p>

        </div>

        `;

        return;

    }

    notifications.sort((a,b)=>{

        return new Date(b.time) - new Date(a.time);

    });

    notifications.forEach(notification=>{

        const time = notification.time

? getTimeAgo(notification.time)

: "Just now";

        list.innerHTML += `

        <div class="notification-card">

            <div class="notify-icon ${
    notification.title === "Payment"
        ? "success"
        : notification.title === "Expense"
        ? "danger"
        : notification.title === "Pending Work"
        ? "warning"
        : "primary"
}">

    <i class="fa-solid ${notification.icon}"></i>

</div>

            <div style="flex:1">

                <h4>${notification.title}</h4>

                <p>${notification.message}</p>

                <small>${time}</small>

            </div>

        </div>

        `;

    });

}

function clearNotifications(){

    notifications = [];

    renderNotifications();

    document.getElementById("notificationDot").style.display="none";

}

