function highlightCurrentPageButton() {
    const currentPath = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        const buttonPath = button.getAttribute('data-href').split('/').pop();  
        if (buttonPath === currentPath) {
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        button.style.color = 'black';
        button.style.background = "white"
        } else {
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        button.style.color = 'white';
        button.style.background = "blue"
        }
    });
    }
    window.onload = highlightCurrentPageButton;