const API_URL = "http://localhost:5000/api/v1/auth/login";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.getElementById("loginError").innerText = "";

    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

localStorage.setItem("ownerName", data.user.fullName);
localStorage.setItem("email", data.user.email);
localStorage.setItem("phone", data.user.phone);

            const btn = document.getElementById("loginBtn");

btn.innerHTML = `
<i class="fa-solid fa-spinner fa-spin"></i>
 Logging In...
`;

btn.disabled = true;

setTimeout(()=>{

    window.location.href = "dashboard.html";

},1000);

        } else {

            document.getElementById("loginError").innerText = data.message;

document.getElementById("loginBtn").disabled = false;

document.getElementById("loginBtn").innerHTML = `
<i class="fa-solid fa-right-to-bracket"></i>
Login
`;

        }

    } catch (err) {

        console.error(err);

        document.getElementById("loginError").innerText =
"Unable to connect to server.";

document.getElementById("loginBtn").disabled = false;

document.getElementById("loginBtn").innerHTML = `
<i class="fa-solid fa-right-to-bracket"></i>
Login
`;

    }

});

