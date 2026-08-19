const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");
const businessId = localStorage.getItem("businessId");

let report = {};
let allIncomePayments = [];

// ==============================
// START
// ==============================

window.onload = () => {

    loadReport();

};

// ==============================
// LOAD REPORT
// ==============================

async function loadReport(){

    try{

        const response = await fetch(

            `${API}/report?business=${businessId}`,

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

        report = result.report;

        // =========================
        // SUMMARY
        // =========================

        document.getElementById("customers").innerText =
        report.totalCustomers;

        document.getElementById("works").innerText =
        report.totalWorks;

        document.getElementById("activeWorks").innerText =
        report.activeWorks;

        document.getElementById("completedWorks").innerText =
        report.completedWorks;

        document.getElementById("cancelledWorks").innerText =
        report.cancelledWorks;

        document.getElementById("outstanding").innerText =
        "₹" + report.outstanding;

        document.getElementById("todayIncome").innerText =
        "₹" + report.todayIncome;

        document.getElementById("monthlyIncome").innerText =
        "₹" + report.monthlyIncome;

        document.getElementById("monthlyExpense").innerText =
        "₹" + report.monthlyExpense;

        document.getElementById("income").innerText =
        "₹" + report.totalIncome;

        document.getElementById("expense").innerText =
        "₹" + report.totalExpense;

        document.getElementById("profit").innerText =
        "₹" + report.profit;

        // =========================
        // WORK STATUS
        // =========================

        document.getElementById("draftWorks").innerText =
        report.draftWorks;

        document.getElementById("confirmedWorks").innerText =
        report.confirmedWorks;

        document.getElementById("progressWorks").innerText =
        report.progressWorks;

        document.getElementById("finishingWorks").innerText =
        report.finishingWorks;

        document.getElementById("readyWorks").innerText =
        report.readyWorks;

        document.getElementById("deliveredWorks").innerText =
        report.deliveredWorks;

        allIncomePayments = report.incomePayments || [];

        renderMonthlyIncome(allIncomePayments);

        createChart();

    }

    catch(error){

        console.log(error);

        alert("Unable to load report.");

    }

}

// ==============================
// CHART
// ==============================

function createChart(){

    const canvas = document.getElementById("reportChart");

    if(!canvas) return;

    const ctx = canvas.getContext("2d");

    if(window.reportChart){

        try{

            window.reportChart.destroy();

        }

        catch(e){

            console.log("Old chart removed.");

        }

    }

    window.reportChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:[

                "Income",

                "Expense",

                "Profit"

            ],

            datasets:[{

                label:"Amount",

                data:[

                    report.totalIncome,

                    report.totalExpense,

                    report.profit

                ],

                backgroundColor:[

                    "#16a34a",

                    "#dc2626",

                    "#2563eb"

                ],

                borderRadius:10

            }]

        },

        options:{

            responsive:true,

            maintainAspectRatio:false,

            plugins:{

                legend:{

                    display:false

                }

            },

            scales:{

                y:{

                    beginAtZero:true

                }

            }

        }

    });

}
// ==============================
// DOWNLOAD REPORT
// ==============================

function downloadReport(){

    localStorage.setItem(

        "report",

        JSON.stringify(report)

    );

    window.open(

        "report-print.html",

        "_blank"

    );

}

// ==============================
// MONTHLY INCOME BREAKDOWN
// ==============================

function renderMonthlyIncome(payments){
    const container = document.getElementById("monthlyIncomeList");
    const filterSelect = document.getElementById("monthIncomeFilter");
    if(!container) return;

    container.innerHTML = "";

    if(!payments || payments.length === 0){
        container.innerHTML = `
            <div class="month-card" style="padding: 20px; text-align: center; color: #6b7280;">
                No Income Payments Found
            </div>
        `;
        return;
    }

    const grouped = {};
    payments.forEach(payment => {
        const date = new Date(payment.createdAt);
        const monthKey = date.toLocaleString("en-IN", { month: "long", year: "numeric" });
        if(!grouped[monthKey]){
            grouped[monthKey] = [];
        }
        grouped[monthKey].push(payment);
    });

    if(filterSelect && filterSelect.options.length <= 1){
        filterSelect.innerHTML = `<option value="All">All Months</option>`;
        Object.keys(grouped).forEach(mKey => {
            filterSelect.innerHTML += `<option value="${mKey}">${mKey}</option>`;
        });
    }

    const selectedFilter = filterSelect ? filterSelect.value : "All";

    Object.keys(grouped).forEach((month, index) => {
        if(selectedFilter !== "All" && selectedFilter !== month){
            return;
        }

        let monthTotal = 0;
        grouped[month].forEach(p => {
            monthTotal += Number(p.amount || 0);
        });

        let itemsHtml = "";
        grouped[month].forEach(p => {
            const custName = (p.customer && p.customer.name) ? p.customer.name : "Customer";
            const workName = (p.work && p.work.workName) ? p.work.workName : "";
            const pDate = new Date(p.createdAt).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric"
            });

            itemsHtml += `
                <div class="income-item-card">
                    <div class="income-item-info">
                        <h4>${custName} ${workName ? `• ${workName}` : ""}</h4>
                        <p>${p.paymentMethod || "Cash"} • ${pDate} ${p.notes ? `• ${p.notes}` : ""}</p>
                    </div>
                    <div class="income-item-amount">
                        +₹${Number(p.amount || 0).toLocaleString()}
                    </div>
                </div>
            `;
        });

        container.innerHTML += `
            <div class="month-card">
                <div class="month-header" onclick="toggleIncomeMonth('incMonth${index}')">
                    <div class="month-left">
                        <i class="fa-solid fa-chevron-down"></i>
                        <h3>${month}</h3>
                    </div>
                    <div class="month-total-income">
                        ₹${monthTotal.toLocaleString()}
                    </div>
                </div>
                <div class="month-body" id="incMonth${index}">
                    ${itemsHtml}
                </div>
            </div>
        `;
    });

    const firstMonthBody = container.querySelector(".month-body");
    if(firstMonthBody){
        firstMonthBody.classList.add("show");
        const icon = firstMonthBody.previousElementSibling.querySelector("i");
        if(icon){
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        }
    }
}

function toggleIncomeMonth(id){
    const current = document.getElementById(id);
    if(!current) return;
    const parentContainer = document.getElementById("monthlyIncomeList");
    const bodies = parentContainer.querySelectorAll(".month-body");
    const icons = parentContainer.querySelectorAll(".month-header i");

    bodies.forEach(b => {
        if(b.id !== id){
            b.classList.remove("show");
        }
    });

    icons.forEach(ic => {
        ic.classList.remove("fa-chevron-up");
        ic.classList.add("fa-chevron-down");
    });

    const icon = current.previousElementSibling.querySelector("i");
    if(current.classList.contains("show")){
        current.classList.remove("show");
        if(icon){
            icon.classList.remove("fa-chevron-up");
            icon.classList.add("fa-chevron-down");
        }
    } else {
        current.classList.add("show");
        if(icon){
            icon.classList.remove("fa-chevron-down");
            icon.classList.add("fa-chevron-up");
        }
    }
}

function filterMonthlyIncome(){
    renderMonthlyIncome(allIncomePayments);
}