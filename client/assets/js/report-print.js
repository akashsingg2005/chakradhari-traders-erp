const report = JSON.parse(

    localStorage.getItem("report")

);

document.getElementById("businessName").innerText =
localStorage.getItem("businessName") || "Business";

document.getElementById("reportDate").innerText =
"Generated : " + new Date().toLocaleString();

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
"₹"+report.outstanding;

document.getElementById("todayIncome").innerText =
"₹"+report.todayIncome;

document.getElementById("monthlyIncome").innerText =
"₹"+report.monthlyIncome;

document.getElementById("monthlyExpense").innerText =
"₹"+report.monthlyExpense;

document.getElementById("income").innerText =
"₹"+report.totalIncome;

document.getElementById("expense").innerText =
"₹"+report.totalExpense;

const profit=document.getElementById("profit");

profit.innerText="₹"+report.profit;

profit.style.color=

report.profit>=0

? "#16a34a"

: "#dc2626";

document.getElementById("draft").innerText =
report.draftWorks;

document.getElementById("confirmed").innerText =
report.confirmedWorks;

document.getElementById("progress").innerText =
report.progressWorks;

document.getElementById("finishing").innerText =
report.finishingWorks;

document.getElementById("ready").innerText =
report.readyWorks;

document.getElementById("delivered").innerText =
report.deliveredWorks;

window.onload=()=>{

setTimeout(()=>{

window.print();

},500);

};