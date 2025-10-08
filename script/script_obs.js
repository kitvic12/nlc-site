const canvas = document.getElementById('myChart');
const ctx = canvas.getContext('2d');
const graphTitle = document.getElementById('graphTitle');
canvas.width = 1000;
canvas.height = 500;
let currentDataType = 'brightness';
let currentObservations = []; 

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
    drawGraph(); 
}

function drawGraph() {
    if (currentObservations.length === 0) {
        console.error('Нет данных для построения графика');
        return;
    }
    const points = getPointsFromObservations(currentObservations, currentDataType);
    if (points.length === 0) {
        console.error('Нет точек для построения графика');
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
    ctx.fillStyle = '#000';
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
    ctx.fillStyle = '#000';
    
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


function getPointsFromObservations(observations, dataType) {
    return observations.map(obs => {
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

async function loadObservationDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const date = urlParams.get('date');
    const user = urlParams.get('user');
    const place = urlParams.get('place');
    
    if (!date || !user) {
        alert('Неверные параметры');
        return;
    }
    
    try {
        const local = 'http://localhost:5000/api/data';
        const server = 'https://anttech.ddns.net/kitvic/api/data';
        const response = await fetch(server);
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
        

        currentObservations = userObservations;
        
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

window.addEventListener('load', async function() {
    await loadObservationDetails();
    drawGraph();
});