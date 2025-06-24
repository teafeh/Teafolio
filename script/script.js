 const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Toggle mobile menu
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu on link click & smooth scroll
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Check if the link is an anchor link
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);

                    if (targetSection) {
                         // Smooth scroll to section
                        window.scrollTo({
                            top: targetSection.offsetTop - 70, // Adjust for header height
                            behavior: 'smooth'
                        });
                    }

                    // Close mobile menu if active
                    if (hamburger.classList.contains('active')) {
                        hamburger.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                }
            });
        });

        // --- NEW: PORTFOLIO CARD TAP-TO-REVEAL FOR MOBILE ---
        const projectCards = document.querySelectorAll('.project-card');

        // This function adds the reveal-on-tap functionality
        projectCards.forEach(card => {
            card.addEventListener('click', function (event) {
                // This media query checks if the primary input is 'coarse' (like a finger), i.e., a touch device.
                if (window.matchMedia("(pointer: coarse)").matches) {
                    
                    // If a link inside the card was clicked, let it navigate and do nothing else.
                    if (event.target.closest('.project-links a')) {
                        return;
                    }

                    // Check if the current card is already active
                    const isActive = this.classList.contains('mobile-active');

                    // First, remove the active class from all other cards
                    projectCards.forEach(c => {
                        if (c !== this) {
                            c.classList.remove('mobile-active');
                        }
                    });

                    // Then, toggle the active class on the card that was just tapped
                    if (!isActive) {
                        this.classList.add('mobile-active');
                    } else {
                        this.classList.remove('mobile-active');
                    }
                }
            });
        });

        // Optional but good UX: Close the active card when tapping anywhere else on the page
        document.addEventListener('click', function(event) {
            if (window.matchMedia("(pointer: coarse)").matches) {
                // If the click happened outside of a project card, remove the active class from all cards
                if (!event.target.closest('.project-card')) {
                    projectCards.forEach(card => {
                        card.classList.remove('mobile-active');
                    });
                }
            }
        });




        // === CONTACT FORM LOGIC ===

// 1. Get references to the form and the status message div
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

// 2. Add an event listener for the form's submit event
contactForm.addEventListener('submit', function(event) {
    // 3. Prevent the default form submission (which reloads the page)
    event.preventDefault();

    // 4. Create a FormData object from the form
    const formData = new FormData(contactForm);
    const object = {};
    formData.forEach((value, key) => {
        object[key] = value;
    });

    // 5. Add your Web3Forms Access Key
    // IMPORTANT: Replace with your actual Access Key
    object.access_key = 'ae840849-198d-48e6-a24b-4ddc769e57db'; 

    const json = JSON.stringify(object);

    // 6. Show a "sending" message
    formStatus.innerHTML = "Sending...";
    formStatus.classList.add('sending');
    formStatus.classList.remove('success', 'error');

    // 7. Send the data using fetch
    fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: json
        })
        .then(async (response) => {
            let jsonResponse = await response.json();
            if (response.status == 200) {
                // 8. Handle SUCCESS
                formStatus.innerHTML = jsonResponse.message;
                formStatus.classList.add('success');
                formStatus.classList.remove('sending');
            } else {
                // 9. Handle ERROR
                console.log(response);
                formStatus.innerHTML = jsonResponse.message;
                formStatus.classList.add('error');
                formStatus.classList.remove('sending');
            }
        })
        .catch(error => {
            // 10. Handle network errors
            console.log(error);
            formStatus.innerHTML = "Something went wrong! Please try again.";
            formStatus.classList.add('error');
            formStatus.classList.remove('sending');
        })
        .then(function() {
            // 11. Clear the form and hide the message after a few seconds
            contactForm.reset();
            setTimeout(() => {
                formStatus.innerHTML = "";
                formStatus.classList.remove('success', 'error');
            }, 6000); // 6 seconds
        });
});