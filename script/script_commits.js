function highlightCurrentPageButton() {
    const currentPath = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        const buttonPath = button.getAttribute('data-href').split('/').pop();  
        if (buttonPath === currentPath) {
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        button.style.background = "white"
        } else {
        console.log("black")
        button.classList.remove('btn-light');
        button.classList.add('btn-success');
        button.style.color = 'white';
        button.style.background = "blue"
        }
    });
    }
    window.onload = highlightCurrentPageButton

const firebaseConfig = {
    apiKey: "AIzaSyC6VJP5KMoKlBPiKmZlada4sV7aypDxoSE",
    authDomain: "commits-for-nlc-site.firebaseapp.com",
    databaseURL: "https://commits-for-nlc-site-default-rtdb.firebaseio.com",
    projectId: "commits-for-nlc-site",
    storageBucket: "commits-for-nlc-site.firebasestorage.app",
    messagingSenderId: "30201732398",
    appId: "1:30201732398:web:86aa33a647a53621deaebf",
    measurementId: "G-YWFJ2FJT9Q"
  };




firebase.initializeApp(firebaseConfig);
const database = firebase.database();


function openModal(id) {
    document.getElementById(id).style.display = 'block';
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}


function loadChanges() {
    const changesRef = database.ref('changes');
    
    changesRef.on('value', (snapshot) => {
        const changesContainer = document.getElementById('changes-container');
        changesContainer.innerHTML = '';
        
        const changesData = snapshot.val();
        if (changesData) {
            Object.keys(changesData).forEach((key) => {
                const change = changesData[key];
                addChangeToDOM(change);
            });
        } else {
            changesContainer.innerHTML = '<p>Нет изменений для отображения</p>';
        }
    });
}


function addChangeToDOM(change) {
    const changesContainer = document.getElementById('changes-container');
    
    const changeCard = document.createElement('div');
    changeCard.className = 'change-card';
    changeCard.innerHTML = `
        <div>
            <strong>${change.text.split('\n')[0]}</strong>
            <span class="version">${change.version}</span>
        </div>
        <p>${change.text.replace(/\n/g, '<br>')}</p>
        <span class="date">Добавлено: ${new Date(change.timestamp).toLocaleString()}</span>
    `;
    
    changesContainer.prepend(changeCard);
}


function saveChange(version, text) {
    const changesRef = database.ref('changes');
    const newChangeRef = changesRef.push();
    
    newChangeRef.set({
        version: version,
        text: text,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    });
}


document.addEventListener('DOMContentLoaded', function() {
    loadChanges();
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
            saveChange(version, changeText);
            document.getElementById('version').value = '';
            document.getElementById('changeText').value = '';
            
            closeModal('changeModal');
        } else {
            alert('Введите описание изменения');
        }
    });
});