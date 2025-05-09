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