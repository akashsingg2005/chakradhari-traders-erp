const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");

const business = localStorage.getItem("businessId");

let expenses = [];

let filteredExpenses = [];

let editingExpense = null;

// =========================
// START
// =========================

window.onload = () => {

    loadExpenses();

};

// =========================
// LOAD
// =========================

async function loadExpenses(){

    try{

        const response = await fetch(

            `${API}/expense?business=${business}`,

            {

                headers:{

                    Authorization:`Bearer ${token}`

                }

            }

        );

        const result = await response.json();

        if(result.success){

            expenses = result.data;

            filteredExpenses = [...expenses];

            renderExpenses(filteredExpenses);

        }

    }

    catch(error){

        console.log(error);

    }

}

// =========================
// RENDER
// =========================

function renderExpenses(data){

    calculateSummary(data);

    const list = document.getElementById("expenseList");

    list.innerHTML = "";

    if(data.length===0){

        list.innerHTML = `

        <div class="expense-card">

            <h3>No Expenses Found</h3>

        </div>

        `;

        return;

    }

    const grouped = {};

    data.forEach(expense=>{

        const date = new Date(expense.createdAt);

        const month = date.toLocaleString(

            "default",

            {

                month:"long",

                year:"numeric"

            }

        );

        if(!grouped[month]){

            grouped[month]=[];

        }

        grouped[month].push(expense);

    });

    Object.keys(grouped).forEach((month,index)=>{

        let monthTotal = 0;

        grouped[month].forEach(exp=>{

            monthTotal += Number(exp.amount);

        });

        list.innerHTML += `

<div class="month-card">

<div

class="month-header"

onclick="toggleMonth('month${index}')">

<div class="month-left">

<i

class="fa-solid fa-chevron-down">

</i>

<h3>

${month}

</h3>

</div>

<div class="month-total">

₹${monthTotal.toLocaleString()}

</div>

</div>

<div

class="month-body"

id="month${index}">

${createExpenseCards(grouped[month])}

</div>

</div>

`;

    });

    
const firstMonth = document.querySelector(".month-body");

if(firstMonth){

    firstMonth.classList.add("show");

    const icon = firstMonth.previousElementSibling.querySelector("i");

    icon.classList.remove("fa-chevron-down");

    icon.classList.add("fa-chevron-up");

}

}


// =========================
// CREATE EXPENSE CARDS
// =========================

function createExpenseCards(expenses){

    let html="";

    expenses.forEach(expense=>{

        html += `

<div class="expense-card">

<div class="expense-top">

<div>

<div class="expense-title">

${expense.title}

</div>

<div class="expense-details">

<span class="badge ${expense.category.toLowerCase()}">

${expense.category}

</span>

<span>

${expense.paymentMethod}

</span>

</div>

<div class="expense-date">

${new Date(

expense.createdAt

).toLocaleDateString()}

</div>

</div>

<div class="expense-amount">

₹${Number(expense.amount).toLocaleString()}

</div>

</div>

${expense.notes ?

`<div class="notes">

${expense.notes}

</div>`

:""}

<div class="action-buttons">

<button

class="edit-btn"

onclick="editExpense('${expense._id}')">

<i class="fa-solid fa-pen"></i>

Edit

</button>

<button

class="delete-btn"

onclick="deleteExpense('${expense._id}')">

<i class="fa-solid fa-trash"></i>

Delete

</button>

</div>

</div>

`;

    });

    return html;

}

// =========================
// SUMMARY
// =========================

function calculateSummary(data){

    let total = 0;

    let monthly = 0;

    const now = new Date();

    data.forEach(expense=>{

        const amount = Number(expense.amount);

        total += amount;

        const d = new Date(expense.createdAt);

        if(

            d.getMonth()===now.getMonth() &&

            d.getFullYear()===now.getFullYear()

        ){

            monthly += amount;

        }

    });

    document.getElementById(

        "totalExpense"

    ).innerText =

    "₹"+total.toLocaleString();

    document.getElementById(

        "monthlyExpense"

    ).innerText =

    "₹"+monthly.toLocaleString();

}

// =========================
// EXPAND
// =========================

// =========================
// TOGGLE MONTH (Accordion)
// =========================

function toggleMonth(id){

    const bodies = document.querySelectorAll(".month-body");

    const icons = document.querySelectorAll(".month-header i");

    bodies.forEach(body=>{

        if(body.id !== id){

            body.classList.remove("show");

        }

    });

    icons.forEach(icon=>{

        icon.classList.remove("fa-chevron-up");

        icon.classList.add("fa-chevron-down");

    });

    const current = document.getElementById(id);

    const icon = current.previousElementSibling.querySelector("i");

    if(current.classList.contains("show")){

        current.classList.remove("show");

        icon.classList.remove("fa-chevron-up");

        icon.classList.add("fa-chevron-down");

    }

    else{

        current.classList.add("show");

        icon.classList.remove("fa-chevron-down");

        icon.classList.add("fa-chevron-up");

    }

}

// =========================
// SEARCH
// =========================

function searchExpense(){

    const search = document
        .getElementById("searchExpense")
        .value
        .toLowerCase();

    filteredExpenses = expenses.filter(expense =>

        expense.title.toLowerCase().includes(search) ||

        expense.category.toLowerCase().includes(search) ||

        (expense.notes || "").toLowerCase().includes(search)

    );

    filterExpense();

}

// =========================
// FILTER
// =========================

function filterExpense(){

    const category = document
        .getElementById("categoryFilter")
        .value;

    let data = [...filteredExpenses];

    if(category !== "All"){

        data = data.filter(

            expense => expense.category === category

        );

    }

    renderExpenses(data);

}

// =========================
// OPEN FORM
// =========================

function openExpenseForm(){

    editingExpense = null;

    document.getElementById("expenseTitle").innerText =
        "Add Expense";

    document.getElementById("expenseBtn").innerText =
        "Save Expense";

    document.getElementById("title").value = "";
    document.getElementById("category").value = "Material";
    document.getElementById("amount").value = "";
    document.getElementById("paymentMethod").value = "Cash";
    document.getElementById("notes").value = "";

    document
        .getElementById("expenseModal")
        .classList.add("show");

}

// =========================
// CLOSE FORM
// =========================

function closeExpenseForm(){

    document
        .getElementById("expenseModal")
        .classList.remove("show");

    editingExpense = null;

    document.getElementById("expenseTitle").innerText =
        "Add Expense";

    document.getElementById("expenseBtn").innerText =
        "Save Expense";

}

// =========================
// EDIT
// =========================

function editExpense(id){

    editingExpense = expenses.find(

        expense => expense._id === id

    );

    if(!editingExpense){

        return;

    }

    document.getElementById("expenseTitle").innerText =
        "Edit Expense";

    document.getElementById("expenseBtn").innerText =
        "Update Expense";

    document.getElementById("title").value =
        editingExpense.title;

    document.getElementById("category").value =
        editingExpense.category;

    document.getElementById("amount").value =
        editingExpense.amount;

    document.getElementById("paymentMethod").value =
        editingExpense.paymentMethod;

    document.getElementById("notes").value =
        editingExpense.notes || "";

    document
        .getElementById("expenseModal")
        .classList.add("show");

}

// =========================
// SAVE / UPDATE
// =========================

async function saveExpense(){

    const expense = {

        business,

        title: document.getElementById("title").value,

        category: document.getElementById("category").value,

        amount: Number(
            document.getElementById("amount").value
        ),

        paymentMethod:
            document.getElementById("paymentMethod").value,

        notes:
            document.getElementById("notes").value

    };

    let url = `${API}/expense`;

    let method = "POST";

    if(editingExpense){

        url = `${API}/expense/${editingExpense._id}`;

        method = "PUT";

    }

    const response = await fetch(

        url,

        {

            method,

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(expense)

        }

    );

    const result = await response.json();

    alert(result.message);

    closeExpenseForm();

    loadExpenses();

}

// =========================
// DELETE
// =========================

async function deleteExpense(id){

    if(!confirm("Delete this expense?")){

        return;

    }

    const response = await fetch(

        `${API}/expense/${id}`,

        {

            method:"DELETE",

            headers:{

                Authorization:`Bearer ${token}`

            }

        }

    );

    const result = await response.json();

    alert(result.message);

    loadExpenses();

}