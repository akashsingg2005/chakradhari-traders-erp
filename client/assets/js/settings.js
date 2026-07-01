const API = "http://localhost:5000/api/v1";

const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user") || "{}");

window.onload = () => {

    document.getElementById("userName").innerText =
        localStorage.getItem("ownerName") || "User";

    document.getElementById("businessName").innerText =
        localStorage.getItem("businessName") || "Business";

    document.getElementById("businessType").innerText =
        localStorage.getItem("businessType") || "";

};

function editProfile(){

    document
    .getElementById("profileModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

    document.getElementById("editName").value =
        localStorage.getItem("ownerName") || "";

    document.getElementById("editEmail").value =
        localStorage.getItem("email") || "";

    document.getElementById("editPhone").value =
        localStorage.getItem("phone") || "";

}


async function editBusiness(){

    const businessId = localStorage.getItem("businessId");

    const response = await fetch(

        `${API}/business/${businessId}`,

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

    const business = result.data;

    document.getElementById("editBusinessName").value =
        business.businessName;

    document.getElementById("editOwnerName").value =
        business.ownerName;

    document.getElementById("editBusinessType").value =
        business.businessType;

    document.getElementById("editBusinessEmail").value =
        business.email;

    document.getElementById("editBusinessPhone").value =
        business.mobile;

    document.getElementById("editGST").value =
        business.gstNumber;

    document.getElementById("editAddress").value =
        business.address;

    document
        .getElementById("businessModal")
        .classList.add("show");

    document
        .getElementById("overlay")
        .classList.add("show");

}

function changePassword(){

    document
    .getElementById("passwordModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

}

function showNotifications(){

    document
    .getElementById("notificationModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

}

function closeNotification(){

    document
    .getElementById("notificationModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}

function aboutApp(){

    document
    .getElementById("aboutModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

}

function closeAbout(){

    document
    .getElementById("aboutModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}

function logout(){

    document
    .getElementById("logoutModal")
    .classList.add("show");

    document
    .getElementById("overlay")
    .classList.add("show");

}

function closeLogout(){

    document
    .getElementById("logoutModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}

function confirmLogout(){

    localStorage.clear();

    window.location.replace("../index.html");

}


function closeProfile(){

    document
    .getElementById("profileModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}


async function saveProfile(){

    const data = {

        fullName: document.getElementById("editName").value,

        email: document.getElementById("editEmail").value,

        phone: document.getElementById("editPhone").value

    };

    try{

        const response = await fetch(

            `${API}/auth/profile`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify(data)

            }

        );

        const result = await response.json();

        if(result.success){

            // Update Local Storage
            localStorage.setItem("ownerName", result.user.fullName);
            localStorage.setItem("email", result.user.email);
            localStorage.setItem("phone", result.user.phone);
            localStorage.setItem("user", JSON.stringify(result.user));

            // Update UI instantly
            document.getElementById("userName").innerText =
                result.user.fullName;

            closeProfile();

            alert("Profile Updated Successfully");

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Something went wrong.");

    }

}


function closeBusiness(){

    document
    .getElementById("businessModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}

async function saveBusiness(){

    const businessId = localStorage.getItem("businessId");

    const data={

        businessName:

        document.getElementById("editBusinessName").value,

        ownerName:

        document.getElementById("editOwnerName").value,

        businessType:

        document.getElementById("editBusinessType").value,

        email:

        document.getElementById("editBusinessEmail").value,

        mobile:

        document.getElementById("editBusinessPhone").value,

        gstNumber:

        document.getElementById("editGST").value,

        address:

        document.getElementById("editAddress").value

    };

    const response = await fetch(

        `${API}/business/${businessId}`,

        {

            method:"PUT",

            headers:{

                "Content-Type":"application/json",

                Authorization:`Bearer ${token}`

            },

            body:JSON.stringify(data)

        }

    );

    const result = await response.json();

    if(result.success){

        alert("Business Updated Successfully");

        // Update local storage
        localStorage.setItem("businessName", data.businessName);
        localStorage.setItem("businessType", data.businessType);
        localStorage.setItem("ownerName", data.ownerName);

        // Update profile card
        document.getElementById("userName").innerText =
            data.ownerName;

        document.getElementById("businessName").innerText =
            data.businessName;

        document.getElementById("businessType").innerText =
            data.businessType;

        closeBusiness();

    }else{

        alert(result.message);

    }

}



function closePassword(){

    document
    .getElementById("passwordModal")
    .classList.remove("show");

    document
    .getElementById("overlay")
    .classList.remove("show");

}

async function savePassword(){

    const currentPassword =
        document.getElementById("currentPassword").value;

    const newPassword =
        document.getElementById("newPassword").value;

    const confirmPassword =
        document.getElementById("confirmPassword").value;

    if(!currentPassword || !newPassword || !confirmPassword){

        alert("Please fill all fields.");

        return;

    }

    if(newPassword !== confirmPassword){

        alert("Passwords do not match.");

        return;

    }

    if(newPassword.length < 6){

        alert("Password should be at least 6 characters.");

        return;

    }

    try{

        const response = await fetch(

            `${API}/auth/password`,

            {

                method:"PUT",

                headers:{

                    "Content-Type":"application/json",

                    Authorization:`Bearer ${token}`

                },

                body:JSON.stringify({

                    currentPassword,

                    newPassword

                })

            }

        );

        const result = await response.json();

        if(result.success){

            alert("Password Updated Successfully");

            document.getElementById("currentPassword").value = "";
            document.getElementById("newPassword").value = "";
            document.getElementById("confirmPassword").value = "";

            closePassword();

        }

        else{

            alert(result.message);

        }

    }

    catch(error){

        console.log(error);

        alert("Unable to update password.");

    }

}



function togglePassword(inputId, icon){

    const input = document.getElementById(inputId);

    if(input.type === "password"){

        input.type = "text";

        icon.classList.remove("fa-eye");

        icon.classList.add("fa-eye-slash");

    }

    else{

        input.type = "password";

        icon.classList.remove("fa-eye-slash");

        icon.classList.add("fa-eye");

    }

}