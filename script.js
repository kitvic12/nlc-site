function toggleContent(button) {
    // Переключаем класс active для кнопки
    button.classList.toggle('active');
    
    // Получаем связанный контент
    const content = button.nextElementSibling;
    
    // Переключаем видимость контента
    if (content.style.display === 'block') {
      content.style.display = 'none';
      button.style.background = '#4285f4';
    } else {
      content.style.display = 'block';
      button.style.background = '#3367d6';
    }
    
    // Отменяем стандартное поведение (на всякий случай)
    return false;
  }