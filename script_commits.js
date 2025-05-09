function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('addChangeBtn').addEventListener('click', function() {
        openModal('loginModal');
    });
    
    document.getElementById('loginSubmit').addEventListener('click', function() {
        if (document.getElementById('username').value === 'kitvic12') {
            closeModal('loginModal');
            openModal('passwordModal');
        } else {
            alert('Неверный логин');
        }
    });
    
    document.getElementById('passwordSubmit').addEventListener('click', function() {
        if (document.getElementById('password').value === '10092010') {
            closeModal('passwordModal');
            openModal('versionModal');
        } else {
            alert('Неверный пароль');
        }
    });
    
    document.getElementById('versionSubmit').addEventListener('click', function() {
        const version = document.getElementById('version').value;
        if (version) {
            closeModal('versionModal');
            openModal('changeModal');
        } else {
            alert('Введите версию');
        }
    });
    
    document.getElementById('changeSubmit').addEventListener('click', function() {
        const version = document.getElementById('version').value;
        const changeText = document.getElementById('changeText').value;
        
        if (changeText) {
            const now = new Date();
            const dateStr = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
            
            const changeCard = document.createElement('div');
            changeCard.className = 'change-card';
            changeCard.innerHTML = `
                <div class="change-header">
                    <strong>${changeText.split('\n')[0]}</strong>
                    <span class="version">${version}</span>
                </div>
                <p>${changeText.replace(/\n/g, '<br>')}</p>
                <span class="date">Добавлено: ${dateStr}</span>
            `;
            
            document.getElementById('changes-container').prepend(changeCard);
            
            // Очищаем поля
            document.getElementById('version').value = '';
            document.getElementById('changeText').value = '';
            
            closeModal('changeModal');
        } else {
            alert('Введите описание изменения');
        }
    });
});

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