const API = "http://localhost:5000/api/v1";

const token = localStorage.getItem("token");
const workId = localStorage.getItem("workId");
const ledgerMode = localStorage.getItem("ledgerMode");

let payments = [];

// ===============================
// START
// ===============================

window.onload = () => {

    if(ledgerMode === "all"){

        loadPayments();

    }else{

        loadWork();

        loadPayments();

    }

};

// ===============================
// LOAD WORK SUMMARY
// ===============================

async function loadWork(){

    try{

        const response = await fetch(

            `${API}/work/ledger/${workId}`,

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

        const work = result.data;

        document.getElementById("finalAmount").innerText =
        "₹" + work.finalAmount;

        document.getElementById("receivedAmount").innerText =
        "₹" + work.receivedAmount;

        document.getElementById("pendingAmount").innerText =
        "₹" + work.pendingAmount;

    }

    catch(error){

        console.log(error);

    }

}

// ===============================
// LOAD PAYMENTS
// ===============================

async function loadPayments(){

    try{

        let url = "";

        if(ledgerMode === "all"){

            url = `${API}/payment/all?business=${localStorage.getItem("businessId")}`;

        }else{

            url = `${API}/payment/${workId}`;

        }

        const response = await fetch(url,{

            headers:{
                Authorization:`Bearer ${token}`
            }

        });

        const result = await response.json();

        payments = result.data || [];

        renderPayments();

    }

    catch(error){

        console.log(error);

    }

}

// ===============================
// SHOW PAYMENTS
// ===============================

function renderPayments(){

    const paymentList =
    document.getElementById("paymentList");

    paymentList.innerHTML = "";

    if(payments.length===0){

        paymentList.innerHTML = `

        <div class="payment-card">

            <h3>No Payments Yet</h3>

        </div>

        `;

        return;

    }

    payments.forEach(payment=>{

        paymentList.innerHTML += `

        <div class="payment-card">

            <div class="payment-top">

                <h3>

                    ${payment.paymentMethod}

                </h3>

                <div class="payment-amount">

                    ₹${payment.amount}

                </div>

            </div>

            <div class="payment-info">

                <p>

                    ${payment.notes || "-"}

                </p>

                <small>

                    ${new Date(payment.createdAt)
                    .toLocaleDateString()}

                </small>

            </div>

            <br>

            <div class="payment-actions">

    <button
    class="delete-btn"
    onclick="deletePayment('${payment._id}')">

        <i class="fa-solid fa-trash"></i>

        Delete

    </button>

    <button
    class="receipt-btn"
    onclick="printReceipt('${payment._id}')">

        <i class="fa-solid fa-receipt"></i>

        Receipt

    </button>

</div>

        </div>

        `;

    });

}

// ===============================
// OPEN MODAL
// ===============================

function openPaymentModal(){

    document
    .getElementById("paymentModal")
    .classList.add("show");

}

function closePaymentModal(){

    document
    .getElementById("paymentModal")
    .classList.remove("show");

}

// ===============================
// SAVE PAYMENT
// ===============================

async function savePayment(){

    const amount = Number(
    document.getElementById("paymentAmount").value
);

const pending = Number(
    document.getElementById("pendingAmount")
    .innerText.replace("₹","")
);

if(amount <= 0){

    alert("Please enter a valid amount.");

    return;

}

if(amount > pending){

    alert("Payment cannot be greater than pending amount.");

    return;

}

    const payment = {

        work: workId,

        amount: amount,

        paymentMethod:
        document.getElementById("paymentMethod").value,

        referenceNo:
        document.getElementById("referenceNo").value,

        notes:
        document.getElementById("paymentNotes").value,

        paymentType:"Received",

        business:
        localStorage.getItem("businessId"),

        customer:
        localStorage.getItem("customerId")

    };

    const response = await fetch(

        `${API}/payment`,

        {

            method:"POST",

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(payment)

        }

    );

    const result =
    await response.json();

    if(result.success){

    // Clear the form
    document.getElementById("paymentAmount").value = "";
    document.getElementById("referenceNo").value = "";
    document.getElementById("paymentNotes").value = "";
    document.getElementById("paymentMethod").value = "Cash";

    closePaymentModal();

    await loadPayments();
    await loadWork();

    alert("Payment Added Successfully");

}

    else{

        alert(result.message);

    }

}

// ===============================
// DELETE PAYMENT
// ===============================

async function deletePayment(id){

    if(!confirm("Delete Payment?"))

        return;

    await fetch(

        `${API}/payment/${id}`,

        {

            method:"DELETE",

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    loadPayments();

    loadWork();

}


function printReceipt(id){

    localStorage.setItem("paymentId", id);

    window.location.href = "payment-receipt.html";

}