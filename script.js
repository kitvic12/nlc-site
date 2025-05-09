function toggleContent(button) {
    const content = button.nextElementSibling;
    content.style.display = content.style.display === 'block' ? 'none' : 'block';
    
    if (content.style.display === 'block') {
      button.style.background = '#367c39'; 
    } else {
      button.style.background = '#4CAF50'; 
    }
  }