// =====================================
// CUSTOMER MODULE
// =====================================

const API = "https://chakradhari-traders-erp.onrender.com/api/v1/party";

const token = localStorage.getItem("token");
const businessId = localStorage.getItem("businessId");
const businessName = localStorage.getItem("businessName");

const customerList = document.getElementById("customerList");
const search = document.getElementById("search");

const customerModal = document.getElementById("customerModal");
const actionSheet = document.getElementById("actionSheet");

let customers = [];
let selectedCustomer = null;
let editId = null;

// =====================================
// START
// =====================================

window.onload = () => {

    document.getElementById("businessName").innerText =
        businessName || "Business";

    loadCustomers();

};

// =====================================
// LOAD CUSTOMERS
// =====================================

async function loadCustomers(){

    try{

        const response = await fetch(

            `${API}?business=${businessId}`,

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

        customers = result.data;

        renderCustomers(customers);

        updateStatistics();

    }

    catch(error){

        console.log(error);

        alert("Unable to load customers.");

    }

}

// =====================================
// SEARCH
// =====================================

search.addEventListener("keyup",()=>{

    const value = search.value.toLowerCase().trim();

    const filtered = customers.filter(customer=>{

        return (

            customer.name.toLowerCase().includes(value)

            ||

            customer.mobile.includes(value)

            ||

            (customer.email || "")
            .toLowerCase()
            .includes(value)

        );

    });

    renderCustomers(filtered);

});

// =====================================
// UPDATE STATISTICS
// =====================================

function updateStatistics(){

    document.getElementById("customerCount").innerText =
    customers.length;

    let outstanding = 0;
    let received = 0;
    let works = 0;

    customers.forEach(customer=>{

        outstanding += customer.outstanding || 0;

        received += customer.received || 0;

        works += customer.workCount || 0;

    });

    document.getElementById("pendingTotal").innerText =
    "₹" + outstanding.toLocaleString();

    document.getElementById("receivedTotal").innerText =
    "₹" + received.toLocaleString();

    document.getElementById("workCount").innerText =
    works;

}


// =====================================
// RENDER CUSTOMERS
// =====================================

function renderCustomers(list){

    customerList.innerHTML = "";

    if(list.length === 0){

        customerList.innerHTML = `

        <div class="customer-card empty">

            <i class="fa-solid fa-users"></i>

            <h3>No Customers Found</h3>

            <p>Add your first customer</p>

        </div>

        `;

        return;

    }

    list.forEach(customer=>{

        const statusClass =
customer.outstanding > 0
? "pending"
: "advance";

        customerList.innerHTML += `

<div class="customer-card">

    <div class="customer-header">

        <div class="avatar">

            ${customer.name.charAt(0).toUpperCase()}

        </div>

        <div class="customer-info">

            <h3>${customer.name}</h3>

            <p>
                <i class="fa-solid fa-phone"></i>
                ${customer.mobile}
            </p>

        </div>

        <button
            class="menu-btn"
            onclick="event.stopPropagation();openActionSheet('${customer._id}')">

            <i class="fa-solid fa-ellipsis-vertical"></i>

        </button>

    </div>

    <div
        class="customer-summary"
        onclick="openCustomer('${customer._id}')">

        <div>

            <small>Outstanding</small>

            <h3>₹${Number(customer.outstanding || 0).toLocaleString()}</h3>

        </div>

        <div>

            <small>Works</small>

            <h3>${customer.workCount || 0}</h3>

        </div>

    </div>

    <div class="customer-actions">

        <button onclick="event.stopPropagation();window.location.href='tel:${customer.mobile}'">

            <i class="fa-solid fa-phone"></i>

        </button>

        <button onclick="event.stopPropagation();window.open('https://wa.me/91${customer.mobile}')">

            <i class="fa-brands fa-whatsapp"></i>

        </button>

        <button onclick="event.stopPropagation();openCustomer('${customer._id}')">

            <i class="fa-solid fa-eye"></i>

        </button>

    </div>

</div>

`;

    });

}

// =====================================
// ACTION SHEET
// =====================================

function openActionSheet(id){

    selectedCustomer = customers.find(

        customer => customer._id === id

    );

    if(!selectedCustomer){

        return;

    }

    document.getElementById(

        "actionCustomerName"

    ).innerText = selectedCustomer.name;

    actionSheet.classList.add("show");

}

function closeActionSheet(){

    actionSheet.classList.remove("show");

}

// =====================================
// CALL CUSTOMER
// =====================================

function callCustomerById(id){

    const customer = customers.find(

        c => c._id === id

    );

    if(!customer){

        return;

    }

    window.location.href = `tel:${customer.mobile}`;

}

function callCustomer(){

    if(!selectedCustomer){

        return;

    }

    window.location.href =

    `tel:${selectedCustomer.mobile}`;

}

// =====================================
// WHATSAPP
// =====================================

function whatsappCustomerById(id){

    const customer = customers.find(

        c => c._id === id

    );

    if(!customer){

        return;

    }

    window.open(

        `https://wa.me/91${customer.mobile}`,

        "_blank"

    );

}

function whatsappCustomer(){

    if(!selectedCustomer){

        return;

    }

    window.open(

        `https://wa.me/91${selectedCustomer.mobile}`,

        "_blank"

    );

}

// =====================================
// COPY NUMBER
// =====================================

function copyNumber(){

    if(!selectedCustomer){

        return;

    }

    navigator.clipboard.writeText(

        selectedCustomer.mobile

    );

    alert("Phone number copied.");

}
// =====================================
// VIEW CUSTOMER
// =====================================

function viewLedger(){

    if(!selectedCustomer) return;

    localStorage.setItem(

        "customerId",

        selectedCustomer._id

    );

    closeActionSheet();

    window.location.href = "customer-details.html";

}

// =====================================
// CREATE WORK
// =====================================

function createWork(){

    // Remove previous edit mode
    localStorage.removeItem("editWorkId");

    // Save selected customer
    localStorage.setItem("customerId", selectedCustomer._id);

    closeActionSheet();

    // Open Add Work page
    window.location.href = "add-work.html";

}

// =====================================
// OPEN CUSTOMER
// =====================================

function openCustomer(id){

    localStorage.setItem(

        "customerId",

        id

    );

    window.location.href =

    "customer-details.html";

}

// =====================================
// OPEN FORM
// =====================================

function openForm(){

    editId = null;

    clearForm();

    document.getElementById(

        "formTitle"

    ).innerText = "Add Customer";

    document.getElementById(

        "saveText"

    ).innerText = "Add Customer";

    customerModal.classList.add("show");

}

// =====================================
// CLOSE FORM
// =====================================

function closeForm(){

    customerModal.classList.remove("show");

    editId = null;

    clearForm();

}

// =====================================
// CLEAR FORM
// =====================================

function clearForm(){

    document.getElementById("name").value = "";

    document.getElementById("mobile").value = "";

    document.getElementById("email").value = "";

    document.getElementById("address").value = "";

    document.getElementById("notes").value = "";

}

// =====================================
// EDIT CUSTOMER
// =====================================

function editSelectedCustomer(){

    if(!selectedCustomer) return;

    closeActionSheet();

    editId = selectedCustomer._id;

    document.getElementById(

        "formTitle"

    ).innerText = "Edit Customer";

    document.getElementById(

        "saveText"

    ).innerText = "Update Customer";

    document.getElementById("name").value =
        selectedCustomer.name;

    document.getElementById("mobile").value =
        selectedCustomer.mobile;

    document.getElementById("email").value =
        selectedCustomer.email || "";

    document.getElementById("address").value =
        selectedCustomer.address || "";


    document.getElementById("notes").value =
        selectedCustomer.notes || "";

    customerModal.classList.add("show");

}

// =====================================
// SAVE CUSTOMER
// =====================================

async function saveCustomer(){

    const customer = {

        business: businessId,

        partyType: "Customer",

        name: document.getElementById("name").value.trim(),

        mobile: document.getElementById("mobile").value.trim(),

        email: document.getElementById("email").value.trim(),

        address: document.getElementById("address").value.trim(),

        
        notes:

        document.getElementById("notes").value.trim()

    };

    if(

        customer.name === "" ||

        customer.mobile === ""

    ){

        alert("Name and Mobile are required.");

        return;

    }

    try{

        const response = await fetch(

            editId

            ? `${API}/${editId}`

            : API,

            {

                method: editId ? "PUT" : "POST",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify(customer)

            }

        );

        const result = await response.json();

        if(!result.success){

            alert(result.message);

            return;

        }

        alert(result.message);

        closeForm();

        loadCustomers();

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// DELETE CUSTOMER
// =====================================

async function deleteSelectedCustomer(){

    if(!selectedCustomer) return;

    if(

        !confirm(

            "Delete this customer?"

        )

    ) return;

    try{

        const response = await fetch(

            `${API}/${selectedCustomer._id}`,

            {

                method:"DELETE",

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        alert(result.message);

        closeActionSheet();

        loadCustomers();

    }

    catch(error){

        console.log(error);

    }

}

// =====================================
// CLOSE ACTION SHEET ON OUTSIDE CLICK
// =====================================

window.onclick = function(event){

    if(event.target === customerModal){

        closeForm();

    }

    if(event.target === actionSheet){

        closeActionSheet();

    }

};