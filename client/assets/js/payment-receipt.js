const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");
const paymentId = localStorage.getItem("paymentId");

// ===========================
// START
// ===========================

window.onload = () => {

    loadReceipt();

};

// ===========================
// LOAD RECEIPT
// ===========================

async function loadReceipt(){

    try{

        const response = await fetch(

            `${API}/payment/receipt/${paymentId}`,

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

        renderReceipt(result);

    }

    catch(error){

        console.log(error);

        alert("Unable to load receipt.");

    }

}

// ===========================
// RENDER RECEIPT
// ===========================

function renderReceipt(data){

    const business = data.business;

    const customer = data.customer;

    const payment = data.payment;

    document.getElementById("businessName").innerText =
        business.businessName;

    document.getElementById("businessAddress").innerText =
        business.address || "-";

    document.getElementById("businessMobile").innerText =
        business.mobile || "-";

    document.getElementById("receiptNo").innerText =
        payment._id.slice(-6).toUpperCase();

    document.getElementById("receiptDate").innerText =
        new Date(payment.createdAt).toLocaleDateString();

    document.getElementById("customerName").innerText =
        customer.name;

    document.getElementById("customerMobile").innerText =
        customer.mobile || "-";

    document.getElementById("paymentMethod").innerText =
        payment.paymentMethod;

    document.getElementById("referenceNo").innerText =
        payment.referenceNo || "-";

    document.getElementById("amount").innerText =
        "₹" + Number(payment.amount).toLocaleString();

    document.getElementById("notes").innerText =
        payment.notes || "-";

}

// ===========================
// DOWNLOAD PDF
// ===========================


document.getElementById("downloadBtn").addEventListener("click", () => {

    const element = document.getElementById("receipt");

    html2pdf()
        .set({

            margin: 10,

            filename: "Payment-Receipt.pdf",

            image: {
                type: "jpeg",
                quality: 1
            },

            html2canvas: {
                scale: 3,
                useCORS: true,
                scrollY: 0
            },

            jsPDF: {
                unit: "mm",
                format: "a4",
                orientation: "portrait"
            },

            pagebreak: {
                mode: ["avoid-all", "css", "legacy"]
            }

        })
        .from(element)
        .save();

});