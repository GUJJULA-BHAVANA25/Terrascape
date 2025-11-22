// Signin functionality
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const signinBtn = document.querySelector('.SignIn-btn');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        signinBtn.textContent = 'Signing in...';
        signinBtn.disabled = true;

        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                // Store token in localStorage
                localStorage.setItem('token', result.token);
                localStorage.setItem('user', JSON.stringify(result.user));
                
                alert('Login successful! Redirecting...');
                // Redirect based on user role
                if (result.user.role === 'admin') {
                    window.location.href = '../Admin/dashboard.html';
                } else {
                    window.location.href = '../Main-Page.html';
                }
            } else {
                alert(result.message || 'Login failed. Please check your credentials.');
                signinBtn.textContent = 'SignIn';
                signinBtn.disabled = false;
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred. Please try again.');
            signinBtn.textContent = 'SignIn';
            signinBtn.disabled = false;
        }
    });
});

