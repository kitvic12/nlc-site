function toggleContent(button) {
    button.classList.toggle('active');
    const content = button.nextElementSibling;
    if (content.style.display === 'block') {
      content.style.display = 'none';
      button.style.background = '#79857d'; 
      button.style.borderColor = '#5a665e'; 
    } else {
      content.style.display = 'block';
      button.style.background = '#5a665e';
      button.style.borderColor = '#3d4741';
    }
    return false;
  }


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

// FileSystemDirectoryEntry;fs'd;