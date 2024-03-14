let radius_val;
let effective_radius_val;
let height_val;
let weight_m0_val;
let weight_m1_val;

const gravitation = 9.806;
const pendulumInertion = 0.001;
const blockFriction = 0.1;

let deg = 0;
let startDeg = deg;

const minHeight = 70;
const maxHeight = 355;

let y;
let labEnd = true;

let timer;
const timerList = [];
const timeErrors = [];

function setup() {
    for (let i = 0; i < 5; i++) timerList.push(document.getElementById('timer_' + i));
}
setup();

// По нажатию на кнопку проводится опыт
startLab.onclick = function() {
    // Если предыдущий опыт не был закончен останавливаем его
    if (!labEnd){
        labEnd = true;
        clearInterval(timer);
        startLabButton();
        startDeg = deg;
        return;
    }
    labEnd = false;
    reset_values();
    let {acceleration, angleAcceleration} = calculateAcceleration();
    let ratioHeight = calculateRatioHeight();
    
    // запускаем таймер
    let time_start = Date.now();
    
    timer = setInterval(function() {
        
        let time_passed = (Date.now() - time_start) / 1000;
        
        // вычисляем и меняем координату блока (и веревки) для каждого момента времени
        updateY(acceleration, angleAcceleration, ratioHeight, time_passed);
        draw(y, time_passed);
        
        // как только блок оказался на земле выходим
        if (y >= maxHeight) {
            labEnd = true;
            y = maxHeight;
            startDeg = deg;
            
            draw(y, time_passed);
            clearInterval(timer);
            startLabButton();
            return;
        }
    }, 20);
}

function reset_values() {
    setHeight();
    setRadius();
    setWeightM0();
    setWeightM1();
    setEffectiveRadius();
    
    y = minHeight;

    for (let i = 0; i < 5; i++) timeErrors[i] = Math.random() / 4 - 0.125;
    stopLabButton();
}

function calculateAcceleration() {
    // Момент инерции блоков, шкива и спиц
    let inertion = 2 * weight_m0_val * Math.pow(radius_val, 2) + pendulumInertion;
    let weightForce = (weight_m1_val * gravitation - blockFriction);
    let square = effective_radius_val * effective_radius_val;

    // вычисляем линейное и угловое ускорения из выведеной формулы
    let acceleration = ( weightForce * square) / (inertion + square * weight_m1_val );
    let angleAcceleration = acceleration / effective_radius_val;
    return {acceleration, angleAcceleration};
}

function calculateRatioHeight() {
    return ratioHeight = height_val / (maxHeight - minHeight); // Коэффициент перевода высоты из метров в пиксели
}

// отрисовка кнопки "старта"
function startLabButton() {
    startLab.classList.remove('btn-danger');
    startLab.classList.add('btn-success');
    startLab.innerHTML = 'Провести опыт';
}

// отрисовка кнопки "стоп"
function stopLabButton() {
    startLab.classList.remove('btn-success');
    startLab.classList.add('btn-danger');
    startLab.innerHTML = 'Сбросить результат';
}

// вычисления высоты в каждый момент времени
function updateY(acceleration, angleAcceleration, ratioHeight, time_passed) {
    if (acceleration < 0) return; // Если блок не двигается -> выход
    
    let square_time = time_passed * time_passed;
    deg = startDeg + angleAcceleration * square_time / 2 / ratioHeight;
    while (deg > 360) deg -= 360;

    y = minHeight + acceleration * square_time / 2 / ratioHeight;
}

// отрисовка изменения координат блока(и веревки), угла маятника, времени
function draw(y, time_passed) {

    block_rope.style.height = y + 'px';
    main_block.style.top = y + 'px';
        
    line_1.style.transform = 'rotateZ(' + deg + 'deg )';
    
    for (let i = 0; i < 5; i++) {
        let real_time = time_passed + timeErrors[i];
        if (real_time > 0) timerList[i].innerHTML = real_time.toFixed(2) + 'с.';
    }
}

// Ввод только для цифр
function onlyDigits(event) {
    let val = event.target.value;
    if (event.data != null && (event.data[0] < '0' || event.data[0] > '9'))
        event.target.value = val.substr(0,val.length-1);
}

const height = document.getElementById('height');           height.addEventListener('input', onlyDigits);
const radius =  document.getElementById('radius');          radius.addEventListener('input', onlyDigits);
const weight_m0 = document.getElementById('weight_m0');     weight_m0.addEventListener('input', onlyDigits);
const weight_m1 = document.getElementById('weight_m1');     weight_m1.addEventListener('input', onlyDigits);
const effectiveRadius = document.getElementById('radius_effective');     effectiveRadius.addEventListener('input', onlyDigits);

function setHeight()    { height_val = parseInt(height.value) / 100; }
function setRadius()    { radius_val = parseInt(height.value) / 100; }
function setWeightM0()  { weight_m0_val = parseInt(weight_m0.value) / 1000; }
function setWeightM1()  { weight_m1_val = parseInt(weight_m1.value) / 1000; }
function setEffectiveRadius()    { effective_radius_val = parseInt(effectiveRadius.value) / 100; }