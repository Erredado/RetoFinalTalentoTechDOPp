document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

 
        alert('Gracias por tu mensaje. Te contactaremos pronto.');
        form.reset();
    });
});
