const API = "http://localhost:5000/api/v1";

const token = localStorage.getItem("token");
const businessId = localStorage.getItem("businessId");

let report = {};

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