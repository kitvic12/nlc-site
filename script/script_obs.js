        async function loadObservationDetails() {
            const urlParams = new URLSearchParams(window.location.search);
            const date = urlParams.get('date');
            const user = urlParams.get('user');
            const place = urlParams.get('place')
            
            if (!date || !user) {
                alert('Неверные параметры');
                return;
            }
            
            try {
                const response = await fetch('https://anttech.ddns.net/kitvic/api/data');
                const data = await response.json();
                
                const dateGroup = data.data.find(d => d.date === date);
                if (!dateGroup) {
                    alert('Наблюдение не найдено');
                    return;
                }
                
                const userObservations = dateGroup.users[user];
                if (!userObservations) {
                    alert('Пользователь не найден');
                    return;
                }
                

                document.getElementById('user-name').textContent = user;
                document.getElementById('observation-date').textContent = date;
                document.getElementById('observation-place').textContent = place;

                const tbody = document.getElementById('observations-table');
                tbody.innerHTML = userObservations.map(obs => `
                    <tr>
                        <td>${obs.time}</td>
                        <td>${obs.weather}</td>
                        <td>${obs.brightness}</td>
                        <td>${obs.intensity}</td>
                    </tr>
                `).join('');
                
            } catch (error) {
                console.error('Error:', error);
                alert('Ошибка загрузки данных');
            }
        }

        document.addEventListener('DOMContentLoaded', loadObservationDetails);