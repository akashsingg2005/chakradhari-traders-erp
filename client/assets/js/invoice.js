const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");

const workId = localStorage.getItem("workId");

// ===========================
// Load Invoice
// ===========================

window.onload = () => {

    if (!workId) {
        alert("No work selected for invoice.");
        history.back();
        return;
    }

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

    const business = data.business || {};

    const customer = data.customer || {};

    const work = data.work || {};

    const items = data.items || [];

    // Business Details
    const bizName = business.businessName || "Business Name";
    document.getElementById("businessName").innerText = bizName;
    document.getElementById("businessBadge").innerText = bizName.charAt(0).toUpperCase();

    if (document.getElementById("signatoryBusinessName")) {
        document.getElementById("signatoryBusinessName").innerText = bizName;
    }

    const ownerText = business.ownerName ? `Prop: ${business.ownerName}` : "";
    document.getElementById("businessOwner").innerText = ownerText;

    document.getElementById("businessAddress").innerText = business.address ? `📍 ${business.address}` : "";

    const contactParts = [];
    if (business.mobile) contactParts.push(`📞 ${business.mobile}`);
    if (business.email) contactParts.push(`✉️ ${business.email}`);
    document.getElementById("businessContact").innerText = contactParts.join("  |  ");

    if (business.gstNumber) {
        document.getElementById("businessGst").innerText = `GSTIN: ${business.gstNumber}`;
    } else {
        document.getElementById("businessGst").innerText = "";
    }

    // Invoice Meta
    document.getElementById("invoiceNumber").innerText = work.invoiceNumber || work.workNumber || "-";
    document.getElementById("workNumber").innerText = work.workNumber || "-";

    const invDate = new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });
    document.getElementById("invoiceDate").innerText = invDate;

    // Customer Details
    document.getElementById("customerName").innerText = customer.name || "Customer Name";
    document.getElementById("customerMobile").innerText = customer.mobile ? `📞 ${customer.mobile}` : "";
    document.getElementById("customerAddress").innerText = customer.address ? `📍 ${customer.address}` : "";

    // Work Details
    document.getElementById("workName").innerText = work.workName || "General Work";
    document.getElementById("workTypeLabel").innerText = work.workType ? `Type: ${work.workType}` : "";
    document.getElementById("customerRefLabel").innerText = work.customerReference ? `Ref: ${work.customerReference}` : "";

    // Status Badges
    const statusContainer = document.getElementById("statusBadges");
    if (statusContainer) {
        const pStatusClass = work.paymentStatus === "Completed" ? "badge-success" : (work.paymentStatus === "Partially Paid" ? "badge-warning" : "badge-danger");
        const wStatusClass = work.workStatus === "Completed" || work.workStatus === "Delivered" ? "badge-success" : "badge-info";

        statusContainer.innerHTML = `
            <span class="badge ${pStatusClass}">Payment: ${work.paymentStatus || "Pending"}</span>
            <span class="badge ${wStatusClass}">Status: ${work.workStatus || "Draft"}</span>
        `;
    }

    // Items Table (with Unit column!)
    const table = document.getElementById("itemTable");

    table.innerHTML = "";

    if (items.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center; padding: 20px; color: #6b7280;">No items found</td>
            </tr>
        `;
    } else {
        items.forEach((item, index) => {
            const descHtml = item.description ? `<div class="item-desc">${item.description}</div>` : "";
            const unitText = item.unit || "Nos";
            const qtyText = Number(item.quantity || 0).toLocaleString();
            const rateText = "₹" + Number(item.rate || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            const amountText = "₹" + Number(item.amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

            table.innerHTML += `
            <tr>
                <td class="col-sr">${index + 1}</td>
                <td class="col-item">
                    <div class="item-title">${item.itemName}</div>
                    ${descHtml}
                </td>
                <td class="col-qty">${qtyText}</td>
                <td class="col-unit"><span class="unit-tag">${unitText}</span></td>
                <td class="col-rate">${rateText}</td>
                <td class="col-amount">${amountText}</td>
            </tr>
            `;
        });
    }

    // Totals & Charges
    document.getElementById("subtotal").innerText = "₹" + Number(work.subtotal || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    toggleChargeRow("labourRow", "labour", work.labourCharge);
    toggleChargeRow("transportRow", "transport", work.transportCharge);
    toggleChargeRow("installationRow", "installation", work.installationCharge);
    toggleChargeRow("otherRow", "other", work.otherCharge);
    toggleChargeRow("discountRow", "discount", work.discountAmount, true);

    document.getElementById("grandTotal").innerText = "₹" + Number(work.finalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    document.getElementById("received").innerText = "₹" + Number(work.receivedAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 });

    const pendingVal = Number(work.pendingAmount || 0);
    const pendingElem = document.getElementById("pending");
    pendingElem.innerText = "₹" + pendingVal.toLocaleString(undefined, { minimumFractionDigits: 2 });

    if (pendingVal <= 0) {
        pendingElem.style.color = "#16a34a";
    } else {
        pendingElem.style.color = "#dc2626";
    }

    // Notes Container
    const notesContainer = document.getElementById("notesContainer");
    let notesHtml = "";
    if (work.description) {
        notesHtml += `<p><strong>Description:</strong> ${work.description}</p>`;
    }
    if (work.labourNote) {
        notesHtml += `<p><strong>Labour Note:</strong> ${work.labourNote}</p>`;
    }
    if (work.notes) {
        notesHtml += `<p><strong>Notes:</strong> ${work.notes}</p>`;
    }
    notesContainer.innerHTML = notesHtml;
}

function toggleChargeRow(rowId, valId, amount, isDiscount = false) {
    const row = document.getElementById(rowId);
    const elem = document.getElementById(valId);
    const val = Number(amount || 0);

    if (val > 0) {
        if (row) row.style.display = "flex";
        if (elem) elem.innerText = (isDiscount ? "- ₹" : "₹") + val.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    } else {
        if (row) row.style.display = "none";
    }
}