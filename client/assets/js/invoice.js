const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");

const workId = localStorage.getItem("workId");

// ===========================
// Load Invoice
// ===========================

window.onload = () => {

    loadInvoice();

};

// ===========================
// Get Invoice
// ===========================

async function loadInvoice(){

    try{

        const response = await fetch(

            `${API}/invoice/${workId}`,

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

        renderInvoice(result);

    }

    catch(error){

        console.log(error);

        alert("Unable to load invoice.");

    }

}

// ===========================
// Render Invoice
// ===========================

function renderInvoice(data){

    const business = data.business;

    const customer = data.customer;

    const work = data.work;

    const items = data.items;

    // Business

    document.getElementById("businessName").innerText =
        business.businessName;

    document.getElementById("businessAddress").innerText =
        business.address || "-";

    document.getElementById("businessMobile").innerText =
        business.mobile || "-";

    // Invoice

    document.getElementById("invoiceNumber").innerText =
        work.invoiceNumber || work.workNumber;

    document.getElementById("invoiceDate").innerText =
        new Date(work.createdAt).toLocaleDateString();

    // Customer

    document.getElementById("customerName").innerText =
        customer.name;

    document.getElementById("customerMobile").innerText =
        customer.mobile || "-";

    document.getElementById("customerAddress").innerText =
        customer.address || "-";

    // Items

    const table = document.getElementById("itemTable");

    table.innerHTML = "";

    items.forEach(item=>{

        table.innerHTML += `

        <tr>

            <td>${item.itemName}</td>

            <td>${item.quantity}</td>

            <td>₹${item.rate}</td>

            <td>₹${item.amount}</td>

        </tr>

        `;

    });

    // Totals

    document.getElementById("subtotal").innerText =
        "₹"+work.subtotal;

    document.getElementById("labour").innerText =
        "₹"+work.labourCharge;

    document.getElementById("transport").innerText =
        "₹"+work.transportCharge;

    document.getElementById("installation").innerText =
        "₹"+work.installationCharge;

    document.getElementById("other").innerText =
        "₹"+work.otherCharge;

    document.getElementById("discount").innerText =
        "- ₹"+work.discountAmount;

    document.getElementById("grandTotal").innerText =
        "₹"+work.finalAmount;

    document.getElementById("received").innerText =
        "₹"+work.receivedAmount;

    document.getElementById("pending").innerText =
        "₹"+work.pendingAmount;

}

// ===========================
// Download PDF
// ===========================

document.getElementById("downloadBtn").addEventListener("click", () => {

    const invoice = document.getElementById("invoice");

    const opt = {

        margin: [8, 8, 8, 8],

        filename: `Invoice-${document.getElementById("invoiceNumber").innerText}.pdf`,

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

    };

    html2pdf().set(opt).from(invoice).save();

});