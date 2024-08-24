document.addEventListener('DOMContentLoaded', function () {
    // Ensure the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html'; // Redirect to login if not authenticated
    }

    // Set up event listeners
    document.getElementById('create-update-shop-form').addEventListener('submit', handleCreateOrUpdateShop);
    document.getElementById('view-shop-details-btn').addEventListener('click', handleViewShopDetails);
    document.getElementById('delete-shop-btn').addEventListener('click', handleDeleteShop);
    document.getElementById('update-queue-form').addEventListener('submit', handleUpdateQueue);
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    async function handleCreateOrUpdateShop(event) {
        event.preventDefault();

        const shopName = document.getElementById('shop-name').value;
        const location = document.getElementById('shop-location').value;
        const status = document.getElementById('shop-status').value;
        const estimatedTimePerCustomer = document.getElementById('shop-estimated-time').value;
        console.log(estimatedTimePerCustomer);
        const response = await fetch('http://localhost:5000/api/shop/manage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shopName, location, status, estimatedTimePerCustomer })
        });

        if (response.ok) {
            alert('Shop created/updated successfully!');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'An error occurred');
        }
    }

    async function handleViewShopDetails() {
        const response = await fetch('http://localhost:5000/api/shop/my-shop', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            const queuee= await fetch(`http://localhost:5000/api/queue/${data.shop}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // const shopDetails = JSON.stringify(data, null, 2);
            document.getElementById('shop-details').innerHTML =  `
            <h3>Shop: ${data.shopName}</h3>
            <p>Status: ${data.status}</p>
            <p>Location: ${data.location}</p>
            <p>Estimated Time per Customer: ${data.estimatedTimePerCustomer} minutes</p>
            <p>created At: ${data.createdAt} </p>
            <p>created At: ${data.updatedAt} </p>
        `;
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'An error occurred');
        }
    }

    async function handleDeleteShop() {
        const response = await fetch('http://localhost:5000/api/shop/delete', {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            alert('Shop deleted successfully!');
            document.getElementById('shop-details').textContent = ''; // Clear shop details
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'An error occurred');
        }
    }

    async function handleUpdateQueue(event) {
        event.preventDefault();

        const shopName = document.getElementById('queue-shop-name').value;
        const currentQueue = document.getElementById('current-queue').value;
        const status = document.getElementById('queue-status').value;

        const response = await fetch('http://localhost:5000/api/queue/manage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ shopName, currentQueue, status })
        });

        if (response.ok) {
            alert('Queue updated successfully!');
        } else {
            const errorData = await response.json();
            alert(errorData.message || 'An error occurred');
        }
    }

    function handleLogout() {
        localStorage.removeItem('token');
        window.location.href = 'login.html'; // Redirect to login
    }
});
