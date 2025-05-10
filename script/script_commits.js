import {firebaseConfig} from "./fb_config";

  firebase.initializeApp(firebaseConfig);
  const database = firebase.database();

  const changesContainer = document.getElementById('changes-container');
  const adminPanel = document.getElementById('adminPanel');
  const adminToggle = document.getElementById('adminToggle');
  const addChangeBtn = document.getElementById('addChangeBtn');
  const versionInput = document.getElementById('versionInput');
  const changeText = document.getElementById('changeText');

  const ADMIN_PASSWORD = "10092010";

  function loadChanges() {
      const changesRef = database.ref('changes').orderByChild('timestamp');
      
      changesRef.on('value', (snapshot) => {
          const changesData = snapshot.val();
          renderChanges(changesData);
      }, (error) => {
          showError("Ошибка загрузки: " + error.message);
      });
  }

  function renderChanges(changesData) {
      if (!changesData) {
          changesContainer.innerHTML = '<div class="error">Нет данных об изменениях</div>';
          return;
      }

      let changesHTML = '';
      Object.keys(changesData).forEach((key) => {
          const change = changesData[key];
          changesHTML += `
              <div class="change-card">
                  <div>
                      <strong>${change.text.split('\n')[0]}</strong>
                      <span class="version">${change.version}</span>
                  </div>
                  <p>${change.text.replace(/\n/g, '<br>')}</p>
                  <span class="date">Добавлено: ${formatDate(change.timestamp)}</span>
              </div>
          `;
      });

      changesContainer.innerHTML = changesHTML || '<div class="error">Нет изменений для отображения</div>';
  }

  function formatDate(timestamp) {
      if (!timestamp) return 'Дата неизвестна';
      const date = new Date(timestamp);
      return date.toLocaleString();
  }

  function showError(message) {
      changesContainer.innerHTML = `<div class="error">${message}</div>`;
  }

  function addChange() {
      const version = versionInput.value.trim();
      const text = changeText.value.trim();

      if (!version || !text) {
          alert("Заполните все поля!");
          return;
      }

      const newChange = {
          version: version,
          text: text,
          timestamp: firebase.database.ServerValue.TIMESTAMP
      };

      database.ref('changes').push(newChange)
          .then(() => {
              versionInput.value = '';
              changeText.value = '';
          })
          .catch((error) => {
              alert("Ошибка при сохранении: " + error.message);
          });
  }


  document.addEventListener('DOMContentLoaded', function() {
      loadChanges();
      adminToggle.addEventListener('click', function() {
          const password = prompt("Введите пароль администратора:");
          if (password === ADMIN_PASSWORD) {
              adminPanel.style.display = 'block';
              adminToggle.textContent = 'Выйти из админки';
              adminToggle.onclick = function() {
                  adminPanel.style.display = 'none';
                  adminToggle.textContent = 'Режим администратора';
                  adminToggle.onclick = arguments.callee; 
              };
          } else if (password !== null) {
              alert("Неверный пароль!");
          }
      });

      addChangeBtn.addEventListener('click', addChange);
  });


function highlightCurrentPageButton() {
    const currentPath = window.location.pathname.split('/').pop();
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        const buttonPath = button.getAttribute('data-href').split('/').pop();  
        if (buttonPath === currentPath) {
        button.classList.remove('btn-success');
        button.classList.add('btn-light');
        console.log("dick")
        button.style.color = 'black';
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
    window.onload = highlightCurrentPageButton;