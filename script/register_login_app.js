document.addEventListener('DOMContentLoaded', function () {
    // Check if the registration form exists on the page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        // Handle Registration
        registerForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('register-username').value;
            const password = document.getElementById('register-password').value;
            const role = document.getElementById('register-userType').value;

            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password, role })
            });

            if (response.ok) {
                alert('Registration successful!');
                const data = await response.json();
                 
            } else {
                const errorData = await response.json();
                document.getElementById('register-error-message').textContent = errorData.message || 'An error occurred';
            }
        });
    }

    // Check if the login form exists on the page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // Handle Login
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault();

            const username = document.getElementById('login-username').value;
            const password = document.getElementById('login-password').value;

            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                
                const data = await response.json();
                const token = data.token;
                const userType = data.role; // Assuming the response includes the user's type (user or shopOwner)
               console.log(userType);
                localStorage.setItem('token', token); // Store token for future requests
                alert(userType,' login successful');
        // Navigate based on userType
                if (userType === 'shopOwner') {
                    window.location.href = 'shop-owner-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                  }
                  } else {
                const errorData = await response.json();
                document.getElementById('login-error-message').textContent = errorData.message || 'An error occurred';
                  }
        });
    }
});
