const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");
const customerId = localStorage.getItem("customerId");

let works = [];
let selectedWork = null;

// =====================================
// START
// =====================================

window.onload = async () => {

    if(!token){

        window.location.href="../login.html";
        return;

    }

    if(!customerId){

        alert("Customer not selected");
        localStorage.removeItem("editWorkId");
        history.back();
        return;

    }

    await loadCustomer();

    await loadWorks();

};

// =====================================
// LOAD CUSTOMER
// =====================================

async function loadCustomer(){

    try{

        const response = await fetch(

            `${API}/party/${customerId}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(!result.success){

            alert(result.message);

            return;

        }

        const customer = result.customer || result.data;

        document.getElementById("customerName").innerText =
            customer.name;

        document.getElementById("customerMobile").innerHTML = `
            📞
            <a href="tel:${customer.mobile}">
                ${customer.mobile}
            </a>
        `;

        document.getElementById("totalBusiness").innerText =
            "₹" + Number(customer.totalBusiness).toLocaleString();

        document.getElementById("receivedAmount").innerText =
            "₹" + Number(customer.received).toLocaleString();

        document.getElementById("pendingAmount").innerText =
            "₹" + Number(customer.outstanding).toLocaleString();

        document.getElementById("workCount").innerText =
            customer.workCount;

    }

    catch(error){

        console.log(error);

        alert("Unable to load customer.");

    }

}

// =====================================
// LOAD WORKS
// =====================================

async function loadWorks(){

    try{

        const response = await fetch(

            `${API}/work/customer/${customerId}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(!result.success){

            alert(result.message);

            return;

        }

        works = result.data || [];

        renderWorks();

        updateSummary();

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// RENDER WORKS
// =====================================

function renderWorks(){

    const workList =
    document.getElementById("workList");

    workList.innerHTML = "";

    if(works.length===0){

        workList.innerHTML = `

        <div class="work-card">

            <h3>

                No Work Added Yet

            </h3>

        </div>

        `;

        return;

    }

    works.forEach(work=>{

        let statusClass = "pending";

        if(work.workStatus==="Completed"){

            statusClass="completed";

        }

        else if(

            work.workStatus==="Confirmed" ||

            work.workStatus==="Designing" ||

            work.workStatus==="Printing" ||

            work.workStatus==="Finishing" ||

            work.workStatus==="Ready"

        ){

            statusClass="progress";

        }

        workList.innerHTML += `

        <div class="work-card">

            <div class="work-top">

                <div
                class="work-info"
                onclick="openLedger('${work._id}')">

                    <h3>

                        ${work.workName || "Untitled Work"}

                    </h3>

                    <small>

                        ${work.workType || "-"}

                    </small>

                </div>

                <button

                class="menu-btn"

                onclick="event.stopPropagation();openWorkMenu('${work._id}')">

                    <i class="fa-solid fa-ellipsis-vertical"></i>

                </button>

            </div>

            <span class="status ${statusClass}">

                ${work.workStatus}

            </span>

            <div class="work-bottom">

                <div class="work-box">

                    <small>

                        Final

                    </small>

                    <h4>

                        ₹${Number(work.finalAmount || 0).toLocaleString()}

                    </h4>

                </div>

                <div class="work-box">

                    <small>

                        Received

                    </small>

                    <h4 style="color:#16a34a">

                        ₹${Number(work.receivedAmount || 0).toLocaleString()}

                    </h4>

                </div>

                <div class="work-box">

                    <small>

                        Pending

                    </small>

                    <h4 style="color:#dc2626">

                        ₹${Number(work.pendingAmount || 0).toLocaleString()}

                    </h4>

                </div>

            </div>

        </div>

        `;

    });

}
// =====================================
// SUMMARY
// =====================================

function updateSummary(){

    let total = 0;
    let received = 0;
    let pending = 0;

    works.forEach(work=>{

        total += Number(work.finalAmount || 0);

        received += Number(work.receivedAmount || 0);

        pending += Number(work.pendingAmount || 0);

    });

    document.getElementById("totalBusiness").innerText =
    "₹" + total;

    document.getElementById("receivedAmount").innerText =
    "₹" + received;

    document.getElementById("pendingAmount").innerText =
    "₹" + pending;

    document.getElementById("workCount").innerText =
    works.length;

}

// =====================================
// OPEN LEDGER
// =====================================

function openLedger(id){

    localStorage.setItem("workId", id);

    window.location.href = "ledger.html";

}

// =====================================
// WORK MENU
// =====================================

function openWorkMenu(id){

    selectedWork =
    works.find(work => work._id === id);

    if(!selectedWork){

        return;

    }

    document
    .getElementById("workMenu")
    .classList.add("show");

}

function closeWorkMenu(){

    document
    .getElementById("workMenu")
    .classList.remove("show");

}

// =====================================
// MENU BUTTONS
// =====================================

function openLedgerFromMenu(){

    if(!selectedWork) return;

    localStorage.setItem(

        "workId",

        selectedWork._id

    );

    closeWorkMenu();

    window.location.href = "ledger.html";

}

function addPayment(){

    if(!selectedWork) return;

    localStorage.setItem(

        "workId",

        selectedWork._id

    );

    closeWorkMenu();

    window.location.href = "ledger.html";

}

function editWork(){

    if(!selectedWork) return;

    localStorage.setItem(

        "editWorkId",

        selectedWork._id

    );

    closeWorkMenu();

    window.location.href = "add-work.html";

}

function printInvoice(){

    if(!selectedWork){

        alert("Please select a work.");

        return;

    }

    // Save selected work ID
    localStorage.setItem("workId", selectedWork._id);

    closeWorkMenu();

    // Open Invoice Page
    window.location.href = "invoice.html";

}

function uploadPhoto(){

    if(!selectedWork) return;

    alert(

        "Photo upload module coming next."

    );

    closeWorkMenu();

}
// =====================================
// DELETE WORK
// =====================================

async function deleteWork(){

    if(!selectedWork) return;

    const confirmDelete = confirm(

        `Delete "${selectedWork.workName}" ?`

    );

    if(!confirmDelete) return;

    try{

        const response = await fetch(

            `${API}/work/${selectedWork._id}`,

            {

                method:"DELETE",

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(result.success){

            closeWorkMenu();

            loadWorks();

            alert("Work Deleted Successfully");

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to delete work.");

    }

}

// =====================================
// CLOSE MENU WHEN CLICKING OUTSIDE
// =====================================

document.addEventListener("click",(e)=>{

    const menu =
    document.getElementById("workMenu");

    if(

        menu.classList.contains("show") &&

        e.target === menu

    ){

        closeWorkMenu();

    }

});

// =====================================
// ESC KEY SUPPORT
// =====================================

document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        closeWorkMenu();

    }

});

// =====================================
// REFRESH AFTER RETURNING
// =====================================

window.addEventListener("focus",()=>{

    loadWorks();
    loadCustomer();

});

// =====================================
// STATUS
// =====================================

function openStatusModal(){

    if(!selectedWork) return;

    document.getElementById("workStatus").value =
        selectedWork.workStatus;

    document
        .getElementById("statusModal")
        .classList.add("show");

}

function closeStatusModal(){

    document
        .getElementById("statusModal")
        .classList.remove("show");

}

async function saveStatus(){

    try{

        const workStatus =
        document.getElementById("workStatus").value;

        const response = await fetch(

            `${API}/work/status/${selectedWork._id}`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify({

                    workStatus

                })

            }

        );

        const result = await response.json();

        if(result.success){

            closeStatusModal();

            closeWorkMenu();

            loadWorks();

            alert("Status Updated Successfully");

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

    }

}

function addNewWork(){

    // Clear previous edit mode
    localStorage.removeItem("editWorkId");

    // Open Add Work page
    window.location.href = "add-work.html";

}

// =====================================
// FUTURE FEATURES
// =====================================

// Edit Work
// Print Invoice
// Upload Photos
// Share Invoice
// Duplicate Work

// =====================================
// END
// =====================================