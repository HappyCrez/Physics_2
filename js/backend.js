
let js_radius;
let js_radius_effective;
let js_height;
let js_weight_m0;
let js_weight_m1;


let acceleration;
let angleAcceleration;
let inertion;
let pendulumInertion = 0.001;


const gravitation = 9.806;
const blockFriction = 0.1;
let ratioHeight;
let velocity = 0;
let tensionForce;

let deg = 0;
let startDeg = deg;

let minHeight = 70;
let maxHeight = 355;

let y;

let incorrectValues = [true, true, true, true, true];

let labEnd = true;
let timer;

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
    else {
        labEnd = false;

        // Сброс значений и проверка введеных данных
        reset_values();
        if (check_incorrect_input()) {
            alert('Неверные данные, проверьте ввод');
            return;
        }
        
        // вычисляем основные силы действующие на тело
        setup(); 

        // рисуем кнопку остановки лабораторной
        stopLabButton();
        
        // запускаем таймер
        let time_start = Date.now();
        
        timer = setInterval(function() {
            
            let time_passed = Date.now() - time_start;
            
            // вычисляем и меняем координату блока (и веревки) для каждого момента времени
            calculate_y(time_passed / 1000);
            draw_result(y, time_passed / 1000);
            
            // как только блок оказался на земле выходим
            if (y >= maxHeight) {
                labEnd = true;
                y = maxHeight;
                startDeg = deg;
                draw_result(y, (time_passed / 1000) + Math.random() / 4 - 0.125);
                clearInterval(timer);
                startLabButton();
                return;
            }
        }, 20);
    }
}

// Для вычисления основных сил
function setup() {
    // Момент инерции блоков, шкива и спиц
    inertion = 2 * js_weight_m0 * Math.pow(js_radius, 2) + pendulumInertion;
    // Коэффициент перевода высоты из метров в пиксели 
    ratioHeight = js_height / (maxHeight - minHeight);

    // вычисляем линейное и угловое ускорения из выведеной формулы
    acceleration = ( (js_weight_m1 * gravitation - blockFriction) * Math.pow(js_radius_effective, 2) ) / (inertion + Math.pow(js_radius_effective, 2) * js_weight_m1 );
    angleAcceleration = acceleration / js_radius_effective;
}

// сброс высоты
function reset_values() {
    y = minHeight;
}

// Проверка неверного ввода
function check_incorrect_input() {
    if (js_radius == '' || js_radius == undefined) {
        radius_alert.classList.remove('visually-hidden');
        incorrectValues[0] = true;
    }
    if (js_weight_m0 == '' || js_weight_m0 == undefined) {
        weight_m0_alert.classList.remove('visually-hidden');
        incorrectValues[1] = true;
    }
    if (js_weight_m1 == '' || js_weight_m1 == undefined) {
        weight_m1_alert.classList.remove('visually-hidden');
        incorrectValues[2] = true;
    }
    if (js_radius_effective == '' || js_radius_effective == undefined) {
        radius_effective_alert.classList.remove('visually-hidden');
        incorrectValues[3] = true;
    }
    if (js_height == '' || js_height == undefined) {
        height_alert.classList.remove('visually-hidden');
        incorrectValues[4] = true;
    }

    for (let i = 0; i < incorrectValues.length; i++)
            if (incorrectValues[i])
                return true;
    return false;
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
function calculate_y(time_passed) {
    if (acceleration >= 0) { // отрисовка происходит только при положительном ускорении, иначе блок не может двигаться
        deg = startDeg + angleAcceleration * Math.pow(time_passed, 2) / 2 / ratioHeight / 10;
        y = minHeight + acceleration * Math.pow(time_passed, 2) / 2 / ratioHeight;
    }    
}

// отрисовка изменения координат блока(и веревки), угла маятника, времени
function draw_result(y, time_passed) {

    block_rope.style.height = y + 'px';
    main_block.style.top = y + 'px';
        
    line_1.style.transform = 'rotateZ(' + deg + 'deg )';
    
    lab_time.innerHTML = 'Время : ' + Number(time_passed).toFixed(2) + ' секунд';
}

// проверки по вводу, вызываются каждый раз при расфокусировка "input'а"
radius.onblur = function() {
    js_radius = Number(radius.value) / 100;
    if (js_radius < 0 || js_radius > 0.3) {
        radius_alert.classList.remove('visually-hidden');
        incorrectValues[0] = true;
    }
    else {
        incorrectValues[0] = false;
        radius_alert.classList.add('visually-hidden');
        block_1.style.right = (100 * js_radius) + 60 + '%';
        block_2.style.left = (100 * js_radius) + 60 + '%';
    }

}

radius_effective.onblur = function() {
    js_radius_effective = Number(radius_effective.value) / 100;
    if (js_radius_effective < 0 || js_radius_effective > 0.5) {
        incorrectValues[1] = true;
        radius_effective_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[1] = false;
        radius_effective_alert.classList.add('visually-hidden');
    }
}

height.onblur = function() {
    js_height = Number(height.value) / 100;
    if (js_height < 0 || js_height > 10) {
        incorrectValues[2] = true;
        height_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[2] = false;
        height_alert.classList.add('visually-hidden');
    }
}

weight_m0.onblur = function() {
    js_weight_m0 = Number(weight_m0.value) / 1000;
    if (js_weight_m0 < 0 || js_weight_m0 >= 1) {
        incorrectValues[3] = true;
        weight_m0_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[3] = false;
        weight_m0_alert.classList.add('visually-hidden');
    }
}

weight_m1.onblur = function() {
    js_weight_m1 = Number(weight_m1.value) / 1000;
    if (js_weight_m1 < 0 || js_weight_m1 >= 1) {
        incorrectValues[4] = true;
        weight_m1_alert.classList.remove('visually-hidden');
    }
    else {
        incorrectValues[4] = false;
        weight_m1_alert.classList.add('visually-hidden');
    }
}