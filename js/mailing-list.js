/**
 * Mailing List Form Handler
 * JavaScript for form validation and API submission
 */

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('mailing-list-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const responseMessage = document.getElementById('response-message');
    
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            clearErrors();

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();

            if (validateForm(name, email)) {
                submitToServer(name, email);
            }
        });
    }

    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        responseMessage.textContent = '';
        responseMessage.classList.remove('success', 'error');
        responseMessage.style.display = 'none';
    }
    

    function validateForm(name, email) {
        let isValid = true;
        
        if (name === '') {
            nameError.textContent = 'Please enter your name';
            isValid = false;
        } else if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        }

        if (email === '') {
            emailError.textContent = 'Please enter your email address';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        return isValid;
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function submitToServer(name, email) {
        const submitButton = form.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        const data = {
            name: name,
            email: email
        };
        
        // Send POST request to server
        fetch('https://mudfoot.doc.stu.mmu.ac.uk/ash/api/mailinglist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                if (response.status === 400) {
                    throw new Error('Invalid email format. Please check your email address.');
                } else {
                    throw new Error('Server error. Please try again later.');
                }
            }
            return response.json();
        })
        .then(data => {
            showSuccessMessage(data.message || 'Thank you for subscribing to our mailing list!');
            form.reset();
        })
        .catch(error => {
            showErrorMessage(error.message);
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    }
    

    function showSuccessMessage(message) {
        responseMessage.textContent = message;
        responseMessage.classList.add('success');
        responseMessage.classList.remove('error');
        responseMessage.style.display = 'block';
    }
    

    function showErrorMessage(message) {
        responseMessage.textContent = message;
        responseMessage.classList.add('error');
        responseMessage.classList.remove('success');
        responseMessage.style.display = 'block';
    }
});