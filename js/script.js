// 全局变量
let currentPage = 0;
const totalPages = 6;
let animations = {};
let isAnimating = {
    color: true,
    shape: true,
    number: true
};
let currentCase = 0;
const totalCases = 4;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    init();
});

// 初始化函数
function init() {
    // 初始化Canvas动画
    initColorAnimation();
    initShapeAnimation();
    initNumberAnimation();
    
    // 初始化拖拽功能
    initDragAndDrop();
    
    // 初始化颜色混合器
    initColorMixer();
    
    // 初始化情景设计切换
    initScenarioSwitch();
    
    // 初始化进度条
    updateProgress();
    
    // 初始化步骤点击事件
    initStepClick();
    
    // 初始化颜色盒子
    updateColorBoxes();
    
    // 初始化案例导航
    initCaseNavigation();
}

// 页面导航功能
function goToPage(pageIndex) {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    
    // 隐藏当前页面
    document.querySelector(`.page.active`).classList.remove('active');
    
    // 显示目标页面
    document.querySelector(`.page[data-page="${pageIndex}"]`).classList.add('active');
    
    // 更新当前页码
    currentPage = pageIndex;
    
    // 更新进度条
    updateProgress();
    
    // 更新页面指示器
    document.getElementById('currentPage').textContent = currentPage + 1;
    
    // 更新步骤激活状态
    updateSteps();
}

// 案例导航功能
function initCaseNavigation() {
    // 初始化案例指示器点击事件
    const caseIndicators = document.querySelectorAll('.case-indicator');
    caseIndicators.forEach(indicator => {
        indicator.addEventListener('click', function() {
            const caseIndex = parseInt(this.dataset.case);
            showCase(caseIndex);
        });
    });
    
    // 初始化按钮文本
    updateCaseNavButtonText();
}

// 切换到指定案例
function showCase(caseIndex) {
    if (caseIndex < 0 || caseIndex >= totalCases) return;
    
    // 隐藏当前案例
    document.querySelector(`.case-slide.active`).classList.remove('active');
    
    // 显示目标案例
    document.querySelector(`.case-slide[data-case="${caseIndex}"]`).classList.add('active');
    
    // 更新当前案例索引
    currentCase = caseIndex;
    
    // 更新案例指示器
    updateCaseIndicators();
    
    // 更新幻灯片位置
    const sliderWrapper = document.querySelector('.case-slider-wrapper');
    sliderWrapper.style.transform = `translateX(-${caseIndex * 100}%)`;
    
    // 更新按钮文本
    updateCaseNavButtonText();
}

// 更新案例导航按钮文本
function updateCaseNavButtonText() {
    const nextButton = document.querySelector('.next-case');
    if (currentCase === 3) {
        // 第四页隐藏按钮
        nextButton.style.display = 'none';
    } else if (currentCase === 2) {
        // 第三页显示"总结"
        nextButton.textContent = '总结';
        nextButton.style.display = 'block';
    } else {
        // 其他页显示"下一个案例 →"
        nextButton.textContent = '下一个案例 →';
        nextButton.style.display = 'block';
    }
}

// 案例导航函数
function goToCase(direction) {
    const newCase = currentCase + direction;
    showCase(newCase);
}

// 更新案例指示器
function updateCaseIndicators() {
    const caseIndicators = document.querySelectorAll('.case-indicator');
    caseIndicators.forEach((indicator, index) => {
        if (index === currentCase) {
            indicator.classList.add('active');
        } else {
            indicator.classList.remove('active');
        }
    });
}

// 上一页
function goToPreviousPage() {
    goToPage(currentPage - 1);
}

// 下一页
function goToNextPage() {
    goToPage(currentPage + 1);
}

// 更新进度条
function updateProgress() {
    const progress = ((currentPage + 1) / totalPages) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// 更新步骤激活状态
function updateSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === currentPage) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// 初始化步骤点击事件
function initStepClick() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const pageIndex = parseInt(this.dataset.page);
            goToPage(pageIndex);
        });
    });
}

// ------------------- Canvas动画 -------------------

// 颜色混合动画
function initColorAnimation() {
    const canvas = document.getElementById('colorCanvas');
    const ctx = canvas.getContext('2d');
    let frame = 0;
    
    // 获取滑动条元素
    const leftCircleRSlider = document.getElementById('leftCircleRSlider');
    const leftCircleGSlider = document.getElementById('leftCircleGSlider');
    const leftCircleBSlider = document.getElementById('leftCircleBSlider');
    const leftCircleASlider = document.getElementById('leftCircleASlider');
    const rightCircleRSlider = document.getElementById('rightCircleRSlider');
    const rightCircleGSlider = document.getElementById('rightCircleGSlider');
    const rightCircleBSlider = document.getElementById('rightCircleBSlider');
    const rightCircleASlider = document.getElementById('rightCircleASlider');
    
    // 获取显示元素
    const leftCircleR = document.getElementById('leftCircleR');
    const leftCircleG = document.getElementById('leftCircleG');
    const leftCircleB = document.getElementById('leftCircleB');
    const leftCircleA = document.getElementById('leftCircleA');
    const rightCircleR = document.getElementById('rightCircleR');
    const rightCircleG = document.getElementById('rightCircleG');
    const rightCircleB = document.getElementById('rightCircleB');
    const rightCircleA = document.getElementById('rightCircleA');
    
    // 添加滑动条事件监听器
    leftCircleRSlider.addEventListener('input', updateCircleColors);
    leftCircleGSlider.addEventListener('input', updateCircleColors);
    leftCircleBSlider.addEventListener('input', updateCircleColors);
    leftCircleASlider.addEventListener('input', updateCircleColors);
    rightCircleRSlider.addEventListener('input', updateCircleColors);
    rightCircleGSlider.addEventListener('input', updateCircleColors);
    rightCircleBSlider.addEventListener('input', updateCircleColors);
    rightCircleASlider.addEventListener('input', updateCircleColors);
    
    function updateCircleColors() {
        // 更新显示值
        leftCircleR.textContent = leftCircleRSlider.value;
        leftCircleG.textContent = leftCircleGSlider.value;
        leftCircleB.textContent = leftCircleBSlider.value;
        leftCircleA.textContent = leftCircleASlider.value;
        rightCircleR.textContent = rightCircleRSlider.value;
        rightCircleG.textContent = rightCircleGSlider.value;
        rightCircleB.textContent = rightCircleBSlider.value;
        rightCircleA.textContent = rightCircleASlider.value;
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, `rgba(10, 23, 78, 0.8)`);
        gradient.addColorStop(1, `rgba(10, 23, 78, 0.8)`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 获取当前滑动条值
        const leftR = leftCircleRSlider.value;
        const leftG = leftCircleGSlider.value;
        const leftB = leftCircleBSlider.value;
        const leftA = leftCircleASlider.value;
        const rightR = rightCircleRSlider.value;
        const rightG = rightCircleGSlider.value;
        const rightB = rightCircleBSlider.value;
        const rightA = rightCircleASlider.value;
        // 固定距离为60
        const distance = 60;
        
        // 计算两个圆的位置
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const halfDistance = distance / 2;
        const x1 = centerX - halfDistance;
        const y1 = centerY;
        const x2 = centerX + halfDistance;
        const y2 = centerY;
        
        // 绘制第一个圆
        ctx.globalAlpha = leftA;
        ctx.fillStyle = `rgba(${leftR}, ${leftG}, ${leftB}, ${leftA})`;
        ctx.beginPath();
        ctx.arc(x1, y1, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // 绘制第二个圆
        ctx.fillStyle = `rgba(${rightR}, ${rightG}, ${rightB}, ${rightA})`;
        ctx.beginPath();
        ctx.arc(x2, y2, 60, 0, Math.PI * 2);
        ctx.fill();
        
        // 显示混合结果说明
        ctx.globalAlpha = 1;
        ctx.fillStyle = 'white';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('颜色混合结果', canvas.width / 2, 30);
        
        frame++;
        animations.color = requestAnimationFrame(animate);
    }
    
    animate();
}

// 最优路径动画
function initShapeAnimation() {
    const canvas = document.getElementById('shapeCanvas');
    const ctx = canvas.getContext('2d');
    
    // 存储点击的点
    let points = [];
    
    // 绘制箭头的函数
    function drawArrow(from, to, color, label) {
        const dx = to.x - from.x;
        const dy = to.y - from.y;
        const angle = Math.atan2(dy, dx);
        const length = Math.sqrt(dx * dx + dy * dy);
        
        // 绘制箭头线
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.stroke();
        
        // 绘制箭头头部
        const arrowSize = 10;
        ctx.beginPath();
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(
            to.x - arrowSize * Math.cos(angle - Math.PI / 6),
            to.y - arrowSize * Math.sin(angle - Math.PI / 6)
        );
        ctx.moveTo(to.x, to.y);
        ctx.lineTo(
            to.x - arrowSize * Math.cos(angle + Math.PI / 6),
            to.y - arrowSize * Math.sin(angle + Math.PI / 6)
        );
        ctx.stroke();
        
        // 绘制标签
        ctx.fillStyle = color;
        ctx.font = '14px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            label,
            from.x + dx / 2,
            from.y + dy / 2 - 10
        );
    }
    
    // 绘制点的函数
    function drawPoint(point, index) {
        const labels = ['起点', '中间点', '终点'];
        const colors = ['rgba(0, 255, 0, 0.8)', 'rgba(255, 255, 0, 0.8)', 'rgba(255, 0, 0, 0.8)'];
        
        // 绘制点
        ctx.beginPath();
        ctx.arc(point.x, point.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 绘制点标签
        ctx.fillStyle = 'white';
        ctx.font = '12px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
            labels[index],
            point.x,
            point.y - 15
        );
    }
    
    // 绘制所有内容
    function draw() {
        // 清除画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = 'rgba(10, 23, 78, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制点
        points.forEach((point, index) => {
            drawPoint(point, index);
        });
        
        // 绘制路径
        if (points.length >= 2) {
            // 绘制起点到中间点的箭头
            drawArrow(points[0], points[1], 'rgba(0, 255, 255, 0.8)', '路径1');
        }
        
        if (points.length >= 3) {
            // 绘制中间点到终点的箭头
            drawArrow(points[1], points[2], 'rgba(0, 255, 255, 0.8)', '路径2');
            
            // 绘制起点到终点的最优路径（向量和）
            drawArrow(points[0], points[2], 'rgba(255, 165, 0, 0.8)', '最优路径');
            
            // 绘制向量加法说明
            ctx.fillStyle = 'white';
            ctx.font = '16px Orbitron, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(
                '最优路径 = 路径1 + 路径2',
                canvas.width / 2,
                30
            );
        }
    }
    
    // 点击事件处理
    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // 添加点，最多3个
        if (points.length < 3) {
            points.push({ x, y });
            draw();
        } else {
            // 重置，重新开始
            points = [{ x, y }];
            draw();
        }
    });
    
    // 初始化绘制
    draw();
}

// 数字运算动画
function initNumberAnimation() {
    const canvas = document.getElementById('numberCanvas');
    const ctx = canvas.getContext('2d');
    let frame = 0;
    let num1 = 0;
    let num2 = 0;
    
    function animate() {
        if (!isAnimating.number) return;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // 绘制背景
        ctx.fillStyle = 'rgba(10, 23, 78, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 更新数字
        num1 = Math.floor(Math.sin(frame * 0.02) * 10 + 15);
        num2 = Math.floor(Math.cos(frame * 0.02) * 10 + 15);
        const result = num1 + num2;
        
        // 绘制数字和运算符
        ctx.fillStyle = 'rgba(0, 180, 216, 0.8)';
        ctx.font = '48px Orbitron, sans-serif';
        ctx.textAlign = 'center';
        
        ctx.fillText(num1.toString(), canvas.width / 3, canvas.height / 2);
        ctx.fillText('+', canvas.width / 2, canvas.height / 2);
        ctx.fillText(num2.toString(), canvas.width * 2 / 3, canvas.height / 2);
        
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.font = '36px Orbitron, sans-serif';
        ctx.fillText('=', canvas.width / 2, canvas.height / 2 + 50);
        
        ctx.fillStyle = 'rgba(255, 215, 0, 0.8)';
        ctx.font = '48px Orbitron, sans-serif';
        ctx.fillText(result.toString(), canvas.width / 2, canvas.height / 2 + 100);
        
        // 显示运算说明
        ctx.fillStyle = 'white';
        ctx.font = '16px Orbitron, sans-serif';
        ctx.fillText('运算: 加法', canvas.width / 2, 30);
        
        frame++;
        animations.number = requestAnimationFrame(animate);
    }
    
    animate();
}

// 切换动画播放状态
function toggleAnimation(type) {
    isAnimating[type] = !isAnimating[type];
    if (isAnimating[type]) {
        // 重新启动动画
        switch(type) {
            case 'color':
                initColorAnimation();
                break;
            case 'shape':
                initShapeAnimation();
                break;
            case 'number':
                initNumberAnimation();
                break;
        }
    }
}

// 拖拽功能初始化
function initDragAndDrop() {
    const dragItems = document.querySelectorAll('.drag-item');
    const dropAreas = document.querySelectorAll('.drop-area');
    
    // 定义正确的匹配关系
    const correctMatches = {
        'set': 1,  // 集合 (S) 对应要素1
        'rule': 2, // 运算规则 (⊕) 对应要素2
        'closure': 3, // 封闭性对应要素3
        'set2': 1  // 集合 (S) 对应要素1（备用）
    };
    
    // 拖拽开始事件
    dragItems.forEach(item => {
        item.addEventListener('dragstart', function(e) {
            e.dataTransfer.setData('text/plain', this.dataset.item);
            this.style.opacity = '0.5';
            this.style.transform = 'scale(1.05)';
        });
        
        item.addEventListener('dragend', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
    });
    
    // 拖拽区域事件
    dropAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
            
            // 预览功能：显示拖拽元素是否匹配
            const itemType = e.dataTransfer.getData('text/plain');
            const zoneNumber = parseInt(this.closest('.drop-zone').dataset.zone);
            const isCorrect = correctMatches[itemType] === zoneNumber;
            
            this.classList.toggle('correct-preview', isCorrect);
            this.classList.toggle('incorrect-preview', !isCorrect);
        });
        
        area.addEventListener('dragleave', function() {
            this.classList.remove('drag-over', 'correct-preview', 'incorrect-preview');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over', 'correct-preview', 'incorrect-preview');
            
            const itemType = e.dataTransfer.getData('text/plain');
            const draggedItem = document.querySelector(`[data-item="${itemType}"]`);
            const zoneNumber = parseInt(this.closest('.drop-zone').dataset.zone);
            
            // 检查是否匹配正确
            const isCorrect = correctMatches[itemType] === zoneNumber;
            
            // 清空当前区域内容
            this.innerHTML = '';
            
            // 克隆拖拽元素并添加到区域
            const clone = draggedItem.cloneNode(true);
            clone.draggable = false;
            clone.style.cursor = 'default';
            clone.classList.toggle('correct-match', isCorrect);
            clone.classList.toggle('incorrect-match', !isCorrect);
            this.appendChild(clone);
            
            // 如果匹配正确，给区域添加正确样式
            this.closest('.drop-zone').classList.toggle('correct-zone', isCorrect);
            this.closest('.drop-zone').classList.toggle('incorrect-zone', !isCorrect);
        });
    });
}

// 答案展开/收起功能
function toggleAnswer(answerId) {
    const answerElement = document.getElementById(`answer${answerId}`);
    answerElement.classList.toggle('active');
}

// 数系验证工具
function verifyOperation(operation) {
    const resultElement = document.getElementById('verificationResult');
    let result = '';
    
    switch(operation) {
        case 'addition':
            result = '✅ 加法封闭：对于任意的 (a + b\sqrt{2}) 和 (c + d\sqrt{2})，\( (a+c) + (b+d)\sqrt{2} \) 仍属于该集合。';
            break;
        case 'subtraction':
            result = '✅ 减法封闭：对于任意的 (a + b\sqrt{2}) 和 (c + d\sqrt{2})，\( (a-c) + (b-d)\sqrt{2} \) 仍属于该集合。';
            break;
        case 'multiplication':
            result = '✅ 乘法封闭：对于任意的 (a + b\sqrt{2}) 和 (c + d\sqrt{2})，\( (ac + 2bd) + (ad + bc)\sqrt{2} \) 仍属于该集合。';
            break;
        case 'division':
            result = '✅ 除法封闭：对于任意非零元素 (a + b\sqrt{2}) 和 (c + d\sqrt{2})，(\frac{a + b\sqrt{2}}{c + d\sqrt{2}}) 仍属于该集合，因为可以通过有理化分母得到标准形式。';
            break;
    }
    
    resultElement.innerHTML = result;
    // 重新渲染MathJax
    if (window.MathJax) {
        MathJax.typeset([resultElement]);
    }
}

// 初始化颜色混合器
function initColorMixer() {
    const sliders = document.querySelectorAll('.slider');
    sliders.forEach(slider => {
        slider.addEventListener('input', function() {
            updateSliderValue(this);
            updateColorBoxes();
        });
    });
}

// 更新滑块值显示
function updateSliderValue(slider) {
    const id = slider.id;
    const value = slider.value;
    const displayElement = document.getElementById(id.replace('Slider', ''));
    displayElement.textContent = value;
}

// 更新颜色盒子
function updateColorBoxes() {
    // 获取上层颜色值
    const upperRSlider = document.getElementById('upperRSlider');
    if (!upperRSlider) return;
    
    const upperR = parseInt(upperRSlider.value);
    const upperG = parseInt(document.getElementById('upperGSlider').value);
    const upperB = parseInt(document.getElementById('upperBSlider').value);
    const upperA = parseFloat(document.getElementById('upperASlider').value);
    
    // 获取下层颜色值
    const lowerR = parseInt(document.getElementById('lowerRSlider').value);
    const lowerG = parseInt(document.getElementById('lowerGSlider').value);
    const lowerB = parseInt(document.getElementById('lowerBSlider').value);
    const lowerA = parseFloat(document.getElementById('lowerASlider').value);
    
    // 更新上层颜色盒子
    document.getElementById('upperColorBox').style.backgroundColor = 
        `rgba(${upperR}, ${upperG}, ${upperB}, ${upperA})`;
    
    // 更新下层颜色盒子
    document.getElementById('lowerColorBox').style.backgroundColor = 
        `rgba(${lowerR}, ${lowerG}, ${lowerB}, ${lowerA})`;
    
    // 计算混合颜色
    const mixedColor = mixColors(
        {r: upperR, g: upperG, b: upperB, a: upperA},
        {r: lowerR, g: lowerG, b: lowerB, a: lowerA}
    );
    
    // 更新混合颜色盒子
    document.getElementById('mixedColorBox').style.backgroundColor = 
        `rgba(${mixedColor.r}, ${mixedColor.g}, ${mixedColor.b}, ${mixedColor.a})`;
}

// 颜色混合函数
function mixColors(c1, c2) {
    // 使用标准的Alpha混合公式
    const a = c1.a + c2.a * (1 - c1.a);
    let r, g, b;
    
    if (a === 0) {
        r = 0;
        g = 0;
        b = 0;
    } else {
        r = Math.round((c1.r * c1.a + c2.r * c2.a * (1 - c1.a)) / a);
        g = Math.round((c1.g * c1.a + c2.g * c2.a * (1 - c1.a)) / a);
        b = Math.round((c1.b * c1.a + c2.b * c2.a * (1 - c1.a)) / a);
    }
    
    return { r, g, b, a };
}

// 情景设计切换功能
function initScenarioSwitch() {
    const scenarioBtns = document.querySelectorAll('.scenario-btn');
    const scenarioContent = document.getElementById('scenarioContent');
    
    scenarioBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除所有按钮的active类
            scenarioBtns.forEach(b => b.classList.remove('active'));
            
            // 添加当前按钮的active类
            this.classList.add('active');
            
            // 更新内容
            const scenarioType = this.dataset.scenario;
            updateScenarioContent(scenarioType);
        });
    });
}

// 更新情景内容
function updateScenarioContent(scenarioType) {
    const scenarioContent = document.getElementById('scenarioContent');
    let content = '';
    
    switch(scenarioType) {
        case 'life':
            content = `
                <h4>生活情景：</h4>
                <p>设计一个在日常生活中有用的二元运算，例如：</p>
                <ul>
                    <li>购物时的折扣计算</li>
                    <li>烹饪时的配料比例</li>
                    <li>出行时的路线规划</li>
                </ul>
            `;
            break;
        case 'science':
            content = `
                <h4>科学情景：</h4>
                <p>设计一个在科学领域应用的二元运算，例如：</p>
                <ul>
                    <li>物理中的矢量运算</li>
                    <li>化学中的物质反应</li>
                    <li>生物中的遗传组合</li>
                </ul>
            `;
            break;
        case 'art':
            content = `
                <h4>艺术情景：</h4>
                <p>设计一个在艺术创作中使用的二元运算，例如：</p>
                <ul>
                    <li>颜色混合与调色</li>
                    <li>音乐中的和弦组合</li>
                    <li>图形设计中的形状变换</li>
                </ul>
            `;
            break;
    }
    
    scenarioContent.innerHTML = content;
}

// 更新进度条
function updateProgress() {
    const progress = ((currentPage + 1) / totalPages) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
}

// 更新步骤激活状态
function updateSteps() {
    const steps = document.querySelectorAll('.step');
    steps.forEach((step, index) => {
        if (index === currentPage) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// 初始化步骤点击事件
function initStepClick() {
    const steps = document.querySelectorAll('.step');
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const pageIndex = parseInt(this.dataset.page);
            goToPage(pageIndex);
        });
    });
}

// 保存记录功能
function saveRecord() {
    const observations = document.querySelectorAll('.observation-form textarea');
    const record = {
        timestamp: new Date().toISOString(),
        observations: Array.from(observations).map(textarea => textarea.value)
    };
    
    // 保存到localStorage
    let records = JSON.parse(localStorage.getItem('observationRecords') || '[]');
    records.push(record);
    localStorage.setItem('observationRecords', JSON.stringify(records));
    
    // 显示保存成功提示
    alert('记录保存成功！');
}

// 测试封闭性功能
function testClosure() {
    const testResult = document.getElementById('testResult');
    testResult.textContent = '正在测试...';
    
    // 模拟测试过程
    setTimeout(() => {
        const results = ['✅ 运算满足封闭性！', '❌ 运算不满足封闭性！'];
        const randomResult = results[Math.floor(Math.random() * results.length)];
        testResult.textContent = randomResult;
    }, 1000);
}

// 保存设计功能
function saveDesign() {
    const formInputs = document.querySelectorAll('.creation-form input, .creation-form textarea');
    const design = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        name: formInputs[0].value || '未命名运算',
        set: formInputs[1].value,
        rule: formInputs[2].value,
        closure: formInputs[3].value
    };
    
    // 保存到localStorage
    let designs = JSON.parse(localStorage.getItem('binaryOperations') || '[]');
    designs.push(design);
    localStorage.setItem('binaryOperations', JSON.stringify(designs));
    
    // 更新保存的设计列表
    updateSavedDesigns();
    
    // 显示保存成功提示
    alert('设计保存成功！');
}

// 更新保存的设计列表
function updateSavedDesigns() {
    const scenarioList = document.getElementById('scenarioList');
    if (!scenarioList) return;
    
    const designs = JSON.parse(localStorage.getItem('binaryOperations') || '[]');
    
    if (designs.length === 0) {
        scenarioList.innerHTML = '<p>暂无保存的设计</p>';
        return;
    }
    
    scenarioList.innerHTML = designs.map(design => `
        <div style="margin-bottom: 1rem; padding: 1rem; background: rgba(10, 23, 78, 0.4); border-radius: 8px;">
            <h5 style="color: #0099B9; margin-bottom: 0.5rem;">${design.name}</h5>
            <p style="font-size: 0.9rem; margin: 0.3rem 0;"><strong>集合：</strong>${design.set}</p>
            <button style="margin-top: 0.5rem; padding: 0.3rem 0.8rem; font-size: 0.8rem;">查看详情</button>
        </div>
    `).join('');
}

// 复制代码功能
function copyCode() {
    const codeElement = document.querySelector('.code-content code');
    const codeText = codeElement.textContent;
    
    navigator.clipboard.writeText(codeText).then(() => {
        alert('代码复制成功！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    });
}

// 提交反思功能
function submitReflection() {
    const reflectionInputs = document.querySelectorAll('.reflection-form textarea');
    const reflection = {
        timestamp: new Date().toISOString(),
        learned: reflectionInputs[0].value,
        difficulties: reflectionInputs[1].value,
        ideas: reflectionInputs[2].value
    };
    
    // 保存到localStorage
    localStorage.setItem('courseReflection', JSON.stringify(reflection));
    
    // 显示提交成功提示
    alert('反思提交成功！');
}

// 初始化绘图画布
function initDrawingCanvas() {
    const canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // 获取画笔设置
    const penColor = document.getElementById('penColor');
    const penSize = document.getElementById('penSize');
    
    // 绘制函数
    function draw(e) {
        if (!isDrawing) return;
        
        ctx.strokeStyle = penColor.value;
        ctx.lineWidth = penSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    // 鼠标事件监听器
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });
    
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
    
    // 触摸事件支持
    canvas.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        isDrawing = true;
        [lastX, lastY] = [x, y];
        e.preventDefault();
    });
    
    canvas.addEventListener('touchmove', (e) => {
        if (!isDrawing) return;
        
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        const x = touch.clientX - rect.left;
        const y = touch.clientY - rect.top;
        
        ctx.strokeStyle = penColor.value;
        ctx.lineWidth = penSize.value;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(x, y);
        ctx.stroke();
        
        [lastX, lastY] = [x, y];
        e.preventDefault();
    });
    
    canvas.addEventListener('touchend', () => isDrawing = false);
    canvas.addEventListener('touchcancel', () => isDrawing = false);
    
    // 清图按钮
    const clearBtn = document.getElementById('clearCanvas');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        });
    }
}

// 事件监听器绑定
document.addEventListener('DOMContentLoaded', function() {
    // 保存记录按钮
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', saveRecord);
    }
    
    // 测试封闭性按钮
    const testBtn = document.querySelector('.test-btn');
    if (testBtn) {
        testBtn.addEventListener('click', testClosure);
    }
    
    // 保存设计按钮
    const saveDesignBtn = document.querySelector('.save-scenario-btn');
    if (saveDesignBtn) {
        saveDesignBtn.addEventListener('click', saveDesign);
    }
    
    // 复制代码按钮
    const copyCodeBtn = document.querySelector('.copy-code-btn');
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', copyCode);
    }
    
    // 提交反思按钮
    const submitReflectionBtn = document.querySelector('.submit-reflection-btn');
    if (submitReflectionBtn) {
        submitReflectionBtn.addEventListener('click', submitReflection);
    }
    
    // 初始化保存的设计列表
    updateSavedDesigns();
    
    // 初始化绘图画布
    initDrawingCanvas();
});

// AI提示词生成功能
function generateAITemplate() {
    const template = `请帮我实现一个二元运算，具体要求如下：
1. 集合S：{集合描述}
2. 运算规则：{运算规则}
3. 封闭性：{封闭性说明}
4. 实现语言：JavaScript
5. 功能：输入两个元素，返回运算结果`;
    
    return template;
}

// 分享设计功能
function shareDesign() {
    const designs = JSON.parse(localStorage.getItem('binaryOperations') || '[]');
    if (designs.length === 0) {
        alert('暂无保存的设计可分享！');
        return;
    }
    
    // 生成分享链接（简化版）
    const latestDesign = designs[designs.length - 1];
    const shareText = `我设计了一个二元运算：${latestDesign.name}\n集合：${latestDesign.set}\n规则：${latestDesign.rule}`;
    
    // 复制到剪贴板
    navigator.clipboard.writeText(shareText).then(() => {
        alert('分享内容已复制到剪贴板！');
    }).catch(err => {
        console.error('复制失败:', err);
        alert('分享失败，请手动复制');
    });
}

// 导出设计功能
function exportDesigns() {
    const designs = JSON.parse(localStorage.getItem('binaryOperations') || '[]');
    if (designs.length === 0) {
        alert('暂无设计可导出！');
        return;
    }
    
    // 生成JSON文件
    const dataStr = JSON.stringify(designs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    // 创建下载链接
    const link = document.createElement('a');
    link.href = url;
    link.download = 'binary_operations.json';
    document.body.appendChild(link);
    link.click();
    
    // 清理
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// 重置表单功能
function resetForm() {
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.value = '';
    });
    
    alert('表单已重置！');
}

// 学习成就解锁功能
function unlockAchievement(achievementId) {
    let achievements = JSON.parse(localStorage.getItem('achievements') || '[]');
    if (!achievements.includes(achievementId)) {
        achievements.push(achievementId);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        
        // 更新成就显示
        const achievementElement = document.querySelector(`.achievement-item:nth-child(${achievementId + 1})`);
        if (achievementElement) {
            achievementElement.classList.add('unlocked');
        }
        
        alert('恭喜你解锁了新成就！');
    }
}

// 页面可见性变化时暂停/恢复动画
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // 页面隐藏时暂停所有动画
        Object.keys(isAnimating).forEach(key => {
            isAnimating[key] = false;
        });
    } else {
        // 页面显示时恢复所有动画
        Object.keys(isAnimating).forEach(key => {
            isAnimating[key] = true;
            // 重新启动动画
            switch(key) {
                case 'color':
                    initColorAnimation();
                    break;
                case 'shape':
                    initShapeAnimation();
                    break;
                case 'number':
                    initNumberAnimation();
                    break;
            }
        });
    }
});

// 添加键盘导航支持
document.addEventListener('keydown', function(e) {
    switch(e.key) {
        case 'ArrowLeft':
            goToPreviousPage();
            break;
        case 'ArrowRight':
            goToNextPage();
            break;
        case ' ': // 空格键
            e.preventDefault();
            // 可以添加暂停/播放所有动画的功能
            break;
    }
});

// 添加触摸滑动支持
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // 向左滑动，下一页
            goToNextPage();
        } else {
            // 向右滑动，上一页
            goToPreviousPage();
        }
    }
}