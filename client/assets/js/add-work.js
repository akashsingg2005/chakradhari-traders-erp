const API = "https://chakradhari-traders-erp.onrender.com/api/v1";

const token = localStorage.getItem("token");
const businessId = localStorage.getItem("businessId");
const customerId = localStorage.getItem("customerId");
const editWorkId = localStorage.getItem("editWorkId");

let items = [];

// =============================
// START
// =============================

window.onload = () => {

    if(editWorkId){

        document.querySelector(".header h2").innerText =
        "Edit Work";

        document.querySelector(".save-btn").innerHTML =
        `<i class="fa-solid fa-floppy-disk"></i> Update Work`;

        loadWork();

    }

    else{

        addItem();

    }
    calculate();

};

// =============================
// LOAD WORK FOR EDIT
// =============================

async function loadWork(){

    try{

        const response = await fetch(

            `${API}/work/${editWorkId}`,

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

        const work = result.work;

        items = result.items;

        document.getElementById("workName").value =
        work.workName;

        document.getElementById("workType").value =
        work.workType;

        document.getElementById("customerReference").value =
        work.customerReference;

        document.getElementById("description").value =
        work.description;

        document.getElementById("priority").value =
        work.priority;

        if(work.expectedDeliveryDate){

            document.getElementById("deliveryDate").value =
            work.expectedDeliveryDate.substring(0,10);

        }

        document.getElementById("labourCharge").value =
        work.labourCharge;

        document.getElementById("labourNote").value =
        work.labourNote;

        document.getElementById("transportCharge").value =
        work.transportCharge;

        document.getElementById("installationCharge").value =
        work.installationCharge;

        document.getElementById("otherCharge").value =
        work.otherCharge;

        document.getElementById("discountType").value =
        work.discountType;

        document.getElementById("discountValue").value =
        work.discountValue;

        document.getElementById("notes").value =
        work.notes;

        renderItems();

    }

    catch(error){

        console.log(error);

    }

}

// =============================
// ADD ITEM
// =============================

function addItem(){

    items.push({

    itemName: "",

    quantity: 1,

    unit: "Nos",

    rate: 0

});

    renderItems();

}

// =============================
// REMOVE ITEM
// =============================

function removeItem(index){

    items.splice(index,1);

    if(items.length===0){

        addItem();

        return;

    }

    renderItems();

}

function renderItems(){

    const container = document.getElementById("itemContainer");

    container.innerHTML = "";

    items.forEach((item,index)=>{

        const amount = item.quantity * item.rate;

        container.innerHTML += `

        <div class="item-card">

            <div class="item-header">

                <h4>

                    Item ${index+1}

                </h4>

                <button
                    type="button"
                    class="delete-icon"
                    oninput="removeItem(${index})">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </div>

            <label class="field-label">

                Item Name <span>*</span>

            </label>

            <input

                value="${item.itemName}"

                placeholder="e.g. Main Gate"

                oninput="updateItem(${index},'itemName',this.value)">

            <div class="grid-2">

                <div>

                    <label class="field-label">

                        Quantity

                    </label>

                    <input

                        type="number"

                        value="${item.quantity}"

                        oninput="updateItem(${index},'quantity',this.value)">

                </div>

                <div>

                    <label class="field-label">

                        Unit

                    </label>

                    <select

                        oninput="updateItem(${index},'unit',this.value)">

                        <option ${item.unit=="Nos"?"selected":""}>Nos</option>

                        <option ${item.unit=="Feet"?"selected":""}>Feet</option>

                        <option ${item.unit=="Kg"?"selected":""}>Kg</option>

                        <option ${item.unit=="Meter"?"selected":""}>Meter</option>

                        <option ${item.unit=="Sq.ft"?"selected":""}>Sq.ft</option>

                        <option ${item.unit=="Hour"?"selected":""}>Hour</option>

                    </select>

                </div>

            </div>

            <div class="grid-2">

                <div>

                    <label class="field-label">

                        Rate (₹)

                    </label>

                    <input

                        type="number"

                        value="${item.rate}"

                        oninput="updateItem(${index},'rate',this.value)">

                </div>

                <div>

                    <label class="field-label">

                        Amount

                    </label>

                    <input

                        value="₹ ${amount}"

                        readonly>

                </div>

            </div>

        </div>

        `;

    });

    calculate();

}

// =============================
// UPDATE ITEM
// =============================

function updateItem(index,key,value){

    if(key==="quantity" || key==="rate"){

        value = Number(value);

    }

    items[index][key]=value;

    renderItems();

}

// =============================
// CALCULATE
// =============================

function calculate(){

    let materialTotal = 0;

    items.forEach(item=>{

        materialTotal += Number(item.quantity) * Number(item.rate);

    });

    const labour =
    Number(document.getElementById("labourCharge")?.value || 0);

    const transport =
    Number(document.getElementById("transportCharge")?.value || 0);

    const installation =
    Number(document.getElementById("installationCharge")?.value || 0);

    const other =
    Number(document.getElementById("otherCharge")?.value || 0);

    const extra = transport + installation + other;

    const subtotal = materialTotal + labour + extra;

    const discountType =
    document.getElementById("discountType").value;

    const discountValue =
    Number(document.getElementById("discountValue").value || 0);

    let final = subtotal;

    if(discountType === "Percentage"){

        final = subtotal - (subtotal * discountValue / 100);

    }else{

        final = subtotal - discountValue;

    }

    if(final < 0){

        final = 0;

    }

    document.getElementById("materialTotal").innerText =
    "₹" + materialTotal;

    document.getElementById("labourTotal").innerText =
    "₹" + labour;

    document.getElementById("extraTotal").innerText =
    "₹" + extra;

    document.getElementById("subtotal").innerText =
    "₹" + subtotal;

    document.getElementById("finalAmount").innerText =
    "₹" + final;

}


// =============================
// AUTO RECALCULATE
// =============================

document.getElementById("labourCharge")
.addEventListener("input", calculate);

document.getElementById("transportCharge")
.addEventListener("input", calculate);

document.getElementById("installationCharge")
.addEventListener("input", calculate);

document.getElementById("otherCharge")
.addEventListener("input", calculate);

document.getElementById("discountType")
.addEventListener("change", calculate);

document.getElementById("discountValue")
.addEventListener("input", calculate);

// =============================
// SAVE WORK
// =============================

async function saveWork(){

    const work = {

        business: businessId,

        customer: customerId,

        workName:
        document.getElementById("workName").value,

        workType:
        document.getElementById("workType").value,

        customerReference:
        document.getElementById("customerReference").value,

        description:
        document.getElementById("description").value,

        priority:
        document.getElementById("priority").value,

        expectedDeliveryDate:
        document.getElementById("deliveryDate").value,

        labourCharge:
        Number(document.getElementById("labourCharge").value) || 0,

        labourNote:
        document.getElementById("labourNote").value,

        transportCharge:
        Number(document.getElementById("transportCharge").value) || 0,

        installationCharge:
        Number(document.getElementById("installationCharge").value) || 0,

        otherCharge:
        Number(document.getElementById("otherCharge").value) || 0,

        discountType:
        document.getElementById("discountType").value,

        discountValue:
        Number(document.getElementById("discountValue").value) || 0,

        notes:
        document.getElementById("notes").value,

        items

    };

    try{

        let url = `${API}/work`;
        let method = "POST";

        if(editWorkId){

            url = `${API}/work/${editWorkId}`;
            method = "PUT";

        }

        const response = await fetch(url,{

            method,

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(work)

        });

        const result = await response.json();

        if(result.success){

            alert(

                editWorkId ?

                "Work Updated Successfully"

                :

                "Work Added Successfully"

            );

            localStorage.removeItem("editWorkId");

            history.back();

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to save work.");

    }

}
