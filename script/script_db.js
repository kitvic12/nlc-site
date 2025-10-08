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



async function loadObservations() {
    try {
        const local = 'http://localhost:5000/api/data';
        const server = 'https://anttech.ddns.net/kitvic/api/data'
        const response = await fetch(server);
        const data = await response.json();
        
        const app = document.getElementById('app');
        app.innerHTML = '';
        
        data.data.forEach(dateGroup => {
            const dateDiv = document.createElement('div');
            dateDiv.className = 'date-section';
            dateDiv.innerHTML = `<h2>📅 ${dateGroup.date}</h2>`;
            
            Object.entries(dateGroup.users).forEach(([user, observations]) => {
                const firstObs = observations[0];
                const obsDiv = document.createElement('a');
                obsDiv.className = 'observation-link';
                obsDiv.innerHTML = `
                    <strong>👤 ${user}</strong> | 
                    📍 ${firstObs.place} | 
                    🕒 ${firstObs.time}
                `;
                
                const obsId = btoa(`${dateGroup.date}_${user}`).replace(/=/g, '');
                obsDiv.href = `observation.html?id=${obsId}&date=${dateGroup.date}&user=${user}&place=${firstObs.place}`;
                
                dateDiv.appendChild(obsDiv);
            });
            
            app.appendChild(dateDiv);
        });
        
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('app').innerHTML = 'Ошибка загрузки';
    }
}

document.addEventListener('DOMContentLoaded', loadObservations);