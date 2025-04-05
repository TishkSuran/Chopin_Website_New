/**
 * Mailing List Form Handler
 * JavaScript for form validation and API submission
 */

document.addEventListener('DOMContentLoaded', function() {
    // Get form elements
    const form = document.getElementById('mailing-list-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const responseMessage = document.getElementById('response-message');
    
    if (form) {
        // Form submission handler
        form.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Reset error messages
            clearErrors();
            
            // Get input values
            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            
            // Validate inputs
            if (validateForm(name, email)) {
                // If validation passes, submit to server
                submitToServer(name, email);
            }
        });
    }
    
    /**
     * Clear all error messages
     */
    function clearErrors() {
        nameError.textContent = '';
        emailError.textContent = '';
        responseMessage.textContent = '';
        responseMessage.classList.remove('success', 'error');
        responseMessage.style.display = 'none';
    }
    
    /**
     * Validate form inputs
     * @param {string} name - User's name
     * @param {string} email - User's email
     * @returns {boolean} - Whether the form is valid
     */
    function validateForm(name, email) {
        let isValid = true;
        
        // Validate name
        if (name === '') {
            nameError.textContent = 'Please enter your name';
            isValid = false;
        } else if (name.length < 2) {
            nameError.textContent = 'Name must be at least 2 characters';
            isValid = false;
        }
        
        // Validate email
        if (email === '') {
            emailError.textContent = 'Please enter your email address';
            isValid = false;
        } else if (!isValidEmail(email)) {
            emailError.textContent = 'Please enter a valid email address';
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Check if email is valid using regex
     * @param {string} email - Email to validate
     * @returns {boolean} - Whether email is valid
     */
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    /**
     * Submit form data to server API
     * @param {string} name - User's name
     * @param {string} email - User's email
     */
    function submitToServer(name, email) {
        // Show loading state
        const submitButton = form.querySelector('.submit-btn');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';
        
        // Prepare data for API
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
            // Check if response is OK
            if (!response.ok) {
                // Check specific error types
                if (response.status === 400) {
                    throw new Error('Invalid email format. Please check your email address.');
                } else {
                    throw new Error('Server error. Please try again later.');
                }
            }
            return response.json();
        })
        .then(data => {
            // Handle successful response
            showSuccessMessage(data.message || 'Thank you for subscribing to our mailing list!');
            form.reset();
        })
        .catch(error => {
            // Handle error
            showErrorMessage(error.message);
        })
        .finally(() => {
            // Reset button state
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        });
    }
    
    /**
     * Display success message
     * @param {string} message - Success message
     */
    function showSuccessMessage(message) {
        responseMessage.textContent = message;
        responseMessage.classList.add('success');
        responseMessage.classList.remove('error');
        responseMessage.style.display = 'block';
    }
    
    /**
     * Display error message
     * @param {string} message - Error message
     */
    function showErrorMessage(message) {
        responseMessage.textContent = message;
        responseMessage.classList.add('error');
        responseMessage.classList.remove('success');
        responseMessage.style.display = 'block';
    }
});