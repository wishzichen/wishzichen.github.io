// 智护银龄 - 遥控页面脚本
// 主应用 /control 页面使用

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// 调整canvas大小
function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// 状态
let state = {
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    speed: 1.2,
    mode: 'walk',
    moving: false,
    direction: 'idle'
};

// 发送控制命令
async function sendCommand(command, data = {}) {
    try {
        const response = await fetch('/api/control', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, ...data })
        });
        const result = await response.json();
        if (result.status === 'ok') {
            state = result.state;
            updateUI();
        }
    } catch (error) {
        console.error('控制命令失败:', error);
    }
}

// 更新UI
function updateUI() {
    // 更新位置显示
    document.getElementById('position').textContent =
        `X: ${state.position.x.toFixed(1)}, Z: ${state.position.z.toFixed(1)}`;

    // 更新旋转显示
    document.getElementById('rotation').textContent = `${Math.round(state.rotation)}°`;

    // 更新状态显示
    const statusText = {
        'forward': '前进中',
        'backward': '后退中',
        'left': '左转中',
        'right': '右转中',
        'idle': '空闲'
    };
    document.getElementById('status').textContent = statusText[state.direction] || '空闲';

    // 更新控制面板
    document.getElementById('mode-display').textContent = state.mode === 'walk' ? '步行' : '跑步';
    document.getElementById('speed-display').textContent = `${state.speed.toFixed(1)} m/s`;
    document.getElementById('direction-display').textContent = `${Math.round(state.rotation)}°`;
}

// 绘制场景
function draw() {
    // 清空画布
    ctx.fillStyle = '#0f1729';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 绘制网格
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
    ctx.lineWidth = 1;

    const gridSize = 50;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // 垂直线
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }

    // 水平线
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // 绘制原点
    ctx.fillStyle = 'rgba(34, 211, 238, 0.3)';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
    ctx.fill();

    // 绘制人物（简化为三角形）
    const personX = centerX + state.position.x * 10;
    const personY = centerY + state.position.z * 10;

    ctx.save();
    ctx.translate(personX, personY);
    ctx.rotate((state.rotation * Math.PI) / 180);

    // 绘制三角形（代表人物）
    ctx.fillStyle = state.moving ? '#22d3ee' : '#10b981';
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(-15, 20);
    ctx.lineTo(15, 20);
    ctx.closePath();
    ctx.fill();

    // 绘制方向指示线
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -30);
    ctx.stroke();

    ctx.restore();

    // 绘制轨迹（可选）
    // 这里可以添加轨迹绘制逻辑

    requestAnimationFrame(draw);
}

// 开始绘制
draw();

// 按钮事件
document.getElementById('btn-forward').addEventListener('click', () => sendCommand('forward'));
document.getElementById('btn-backward').addEventListener('click', () => sendCommand('backward'));
document.getElementById('btn-left').addEventListener('click', () => sendCommand('left'));
document.getElementById('btn-right').addEventListener('click', () => sendCommand('right'));
document.getElementById('btn-stop').addEventListener('click', () => sendCommand('stop'));

document.getElementById('mode-walk').addEventListener('click', function() {
    sendCommand('set_mode', { mode: 'walk' });
    document.getElementById('mode-walk').classList.add('active');
    document.getElementById('mode-run').classList.remove('active');
});

document.getElementById('mode-run').addEventListener('click', function() {
    sendCommand('set_mode', { mode: 'run' });
    document.getElementById('mode-run').classList.add('active');
    document.getElementById('mode-walk').classList.remove('active');
});

document.getElementById('speed-slider').addEventListener('input', function(e) {
    const speed = parseFloat(e.target.value);
    document.getElementById('speed-value').textContent = `${speed.toFixed(1)} m/s`;
    sendCommand('set_speed', { speed });
});

document.getElementById('reset-btn').addEventListener('click', () => sendCommand('reset'));

// 键盘控制
document.addEventListener('keydown', function(e) {
    switch(e.key.toLowerCase()) {
        case 'w':
            sendCommand('forward');
            break;
        case 's':
            sendCommand('backward');
            break;
        case 'a':
            sendCommand('left');
            break;
        case 'd':
            sendCommand('right');
            break;
        case ' ':
            e.preventDefault();
            sendCommand('stop');
            break;
    }
});

// 定期更新状态
setInterval(async () => {
    try {
        const response = await fetch('/api/state');
        const result = await response.json();
        if (result.status === 'ok') {
            state = result.state;
            updateUI();
        }
    } catch (error) {
        console.error('获取状态失败:', error);
    }
}, 100);

// 初始化UI
updateUI();
