const API_URL = "http://localhost:5000/api/v1/business";

async function loadBusinesses() {

    const token = localStorage.getItem("token");

    try {

        const response = await fetch(API_URL, {

            headers: {
                Authorization: `Bearer ${token}`
            }

        });

        const result = await response.json();

        if (!result.success) {

            alert(result.message);

            return;

        }

        if (result.data.length === 0) {

            window.location.href = "pages/business.html";

            return;

        }

        // Select first business
        localStorage.setItem(
            "businessId",
            result.data[0]._id
        );

        localStorage.setItem(
            "businessName",
            result.data[0].businessName
        );

    } catch (error) {

        console.log(error);

    }

}

loadBusinesses();