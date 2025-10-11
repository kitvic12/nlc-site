const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');
const graphTitle = document.getElementById('graphTitle');


canvas.width = 1000;
canvas.height = 500;

let currentDataType = 'brightness';
function convertTimeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}


function sortObservationsByTime(observations) {
    return observations.sort((a, b) => {
        const timeA = convertTimeToMinutes(a.time);
        const timeB = convertTimeToMinutes(b.time);
        const adjustedA = timeA < 240 ? timeA + 1440 : timeA; 
        const adjustedB = timeB < 240 ? timeB + 1440 : timeB;
        
        return adjustedA - adjustedB;
    });
}


async function changeData(dataType) {
    currentDataType = dataType;
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    const titles = {
        'brightness': 'Яркость',
        'weather': 'Погода', 
        'intensity': 'Интенсивность'
    };
    graphTitle.textContent = titles[dataType];
    await drawGraph();
}


async function drawGraph() {
    const points = await getCurrentData(currentDataType);
    if (points.length === 0) {
        console.error('Нет данных для построения графика');
        return;
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const padding = 80;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;
    
    const values = points.map(p => p.value);
    const yAxisLabels = getYAxisLabels(currentDataType);
    const maxValue = yAxisLabels.length - 1;
    const minValue = 0;
    const valueRange = maxValue - minValue || 1;
    
    function toPixelX(index) {
        return padding + (index / (points.length - 1)) * chartWidth;
    }
    
    function toPixelY(value) {
        return padding + ((maxValue - value) / valueRange) * chartHeight;
    }
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.moveTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();
    ctx.fillStyle = '#ffffffff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    points.forEach((point, index) => {
        const x = toPixelX(index);
        ctx.fillText(point.time, x, canvas.height - padding + 30);
        ctx.beginPath();
        ctx.moveTo(x, canvas.height - padding - 8);
        ctx.lineTo(x, canvas.height - padding + 8);
        ctx.stroke();
    });
    

    ctx.textAlign = 'right';
    ctx.font = '14px Arial';
    ctx.fillStyle = '#ffffffff';
    
    yAxisLabels.forEach((label, index) => {
        const value = index;
        const y = toPixelY(value);
        ctx.fillText(label, padding - 15, y + 5);
        

        ctx.beginPath();
        ctx.moveTo(padding - 8, y);
        ctx.lineTo(padding + 8, y);
        ctx.stroke();
    });
    

    ctx.strokeStyle = '#007bff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    points.forEach((point, index) => {
        const x = toPixelX(index);
        const y = toPixelY(point.value);
        
        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });
    ctx.stroke();
    

    ctx.fillStyle = '#ff6b6b';
    points.forEach((point, index) => {
        const x = toPixelX(index);
        const y = toPixelY(point.value);
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, Math.PI * 2);
        ctx.fill();
    });
}


function getYAxisLabels(dataType) {
    switch(dataType) {
        case 'weather':
            return ['Д', 'Г', 'В', 'Б', 'А'];
        case 'brightness':
            return ['1', '2', '3', '4', '5']; 
        case 'intensity':
            return ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
        default:
            return ['1', '2', '3', '4', '5'];
    }
}

async function getCurrentData(dataType) {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const date = urlParams.get('date');
        const user = urlParams.get('user');
        
        if (!date || !user) {
            console.error('Неверные параметры для загрузки данных графика');
            return [];
        }
        
        const response = await fetch('https://anttech.ddns.net/kitvic/api/data');
        const data = await response.json();
        
        const dateGroup = data.data.find(d => d.date === date);
        if (!dateGroup) {
            console.error('Наблюдение не найдено для графика');
            return [];
        }
        
        const userObservations = dateGroup.users[user];
        if (!userObservations) {
            console.error('Пользователь не найден для графика');
            return [];
        }
        const sortedObservations = sortObservationsByTime(userObservations);
        const points = sortedObservations.map(obs => {
            let value;
            
            switch(dataType) {
                case 'brightness':
                    value = Math.max(0, Math.min(4, parseInt(obs.brightness) - 1));
                    break;
                case 'intensity':
                    value = Math.max(0, Math.min(9, parseInt(obs.intensity) - 1));
                    break;
                case 'weather':
                    const weatherValues = {
                        'а': 4,
                        'б': 3, 
                        'в': 2,
                        'г': 1, 
                        'д': 0  
                    };
                    value = weatherValues[obs.weather.toLowerCase()] || 0;
                    break;
                default:
                    value = 0;
            }
            
            return {
                time: obs.time,
                value: value
            };
        });
        
        return points;
        
    } catch (error) {
        console.error('Ошибка загрузки данных для графика:', error);
        return [];
    }
}


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
        const sortedObservations = sortObservationsByTime(userObservations);

        const tbody = document.getElementById('observations-table');
        tbody.innerHTML = sortedObservations.map(obs => `
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
window.addEventListener('load', async function() {
    await loadObservationDetails();
    await drawGraph();
});