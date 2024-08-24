 // Function to handle search by location
 async function searchShopsByLocation(event) {
    event.preventDefault();

    const location = document.querySelector('#location-input').value;
    const shopList = document.querySelector('#shop-list');
    const queueDetailsSection = document.querySelector('#queue-details-section');

    // Clear previous results
    shopList.innerHTML = '';
    queueDetailsSection.style.display = 'none';

    if (location.trim() === '') {
        alert('Please enter a location');
        return;
    }

    try {
        const response = await fetch(`http://localhost:5000/api/shop/search?location=${location}`);
        const shops = await response.json();

        if (shops.length === 0) {
            shopList.innerHTML = '<p>No shops found for this location.</p>';
            return;
        }

        shops.forEach(shop => {
            const shopItem = document.createElement('li');
            shopItem.textContent = shop.shopName;
            shopItem.addEventListener('click', () => fetchQueueDetails(shop._id));
            shopList.appendChild(shopItem);
        });
    } catch (error) {
        console.error('Error fetching shops:', error);
        alert('An error occurred while fetching shops.');
    }
}

// Function to fetch queue details for a selected shop
async function fetchQueueDetails(shopId) {
    const queueDetailsSection = document.querySelector('#queue-details-section');
    const queueDetails = document.querySelector('#queue-details');

    try {
        const response = await fetch(`http://localhost:5000/api/queue/${shopId}`);
        const data = await response.json();

        // Update the queue details in the UI
        queueDetails.innerHTML = `
            <h3>Shop: ${data.shopName}</h3>
            <p>Status: ${data.status}</p>
            <p>Current Queue Length: ${data.currentQueue}</p>
            <p>Estimated Time per Customer: ${data.estimatedTimePerCustomer} minutes</p>
            <p>Estimated Wait Time: ${data.estimatedWaitTime} minutes</p>
        `;

        queueDetailsSection.style.display = 'block'; // Show the queue details section
    } catch (error) {
        console.error('Error fetching queue details:', error);
        alert('An error occurred while fetching queue details.');
    }
}

// Attach event listeners
document.querySelector('#search-form').addEventListener('submit', searchShopsByLocation);