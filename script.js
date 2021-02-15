// select the elements
const inputText = document.querySelector('#inputText');
const btn = document.querySelector('#btn');
const weaherP = document.querySelector('#weaherP');
const time = document.querySelector('#currentTime');
const todaysDate = document.querySelector('#currentDate');
const list = document.querySelector('#list');
const liA = document.querySelectorAll('.ul__task-li');

// create variables
let LIST = [];
let id = 0;

// if data in localStorage
let data = localStorage.getItem('TODOS');
if (data) {
    LIST = JSON.parse(data);
    loadData(LIST);
    id = LIST.length;
}

// load data
function loadData(array) {
    for (let elem of array) {
        addTask(elem.text, elem.pd, elem.done, elem.trash);
    }
}

// date
time.innerHTML = new Date().getHours() + ':' + new Date().getMinutes();
todaysDate.innerHTML = new Date().toLocaleDateString('ua', {weekday : 'long', month : 'short' , day : 'numeric'});

let updateTime = setInterval((function() {
    time.innerHTML = new Date().getHours() + ':' + new Date().getMinutes() + ':' + new Date().getSeconds();
}), 1000);

// add a task
function addTask(inputValue, pd, done, trash) {

    if (trash) { return; }
    else {
    const DONE = done == true ? 'textThrough' : '';

    let item = `<div id="div">
                    <li style="overflow: auto" class="ul__task-li"><p id="pp" contenteditable="" class="${DONE}">${inputValue}</p></li>
                    <button job="deleted" pd="${pd}" id="btnDelete" class="ul__task-btn_delete">X</button>
                    <Button job="completed" pd="${pd}" id="btnComplete" class="ul__task-btn_complete">✔</Button>
                </div>`;
    list.insertAdjacentHTML('afterbegin', item);
    }
}

document.addEventListener('keyup', function(event) {
    if (event.keyCode == 13) {
        if (inputText.value) {
            addTask(inputText.value, id, false, false);

            LIST.push({
                text: inputText.value,
                pd : id,
                done: false,
                trash : false
            });

            id++;

            // add to localStorage(this code must be added when data in localStorage is updated)
            localStorage.setItem('TODOS', JSON.stringify(LIST));
        }
        inputText.value = '';
    }
})

btn.addEventListener('click', function(e) {
    if (inputText.value) {
        addTask(inputText.value);

        LIST.push({
            text: inputText.value,
            pd : id,
            done: false,
            trash : false
        });

        id++;

        // add to localStorage(this code must be added when data in localStorage is updated)
        localStorage.setItem('TODOS', JSON.stringify(LIST));
    }
    inputText.value = '';
})

// complete the task
function completed(eventTarget) {
    eventTarget.parentNode.querySelector('p').classList.toggle('textThrough');

    if (LIST[eventTarget.attributes.pd.value].done == false) {
        LIST[eventTarget.attributes.pd.value].done = true;
    } 
    else {
        LIST[eventTarget.attributes.pd.value].done = false;
    }
}

// delete the task
function deleted(eventTarget) {
    eventTarget.parentNode.parentNode.removeChild(eventTarget.parentNode);

    LIST[eventTarget.attributes.pd.value].trash = true;
}

// click to complete or delete
list.addEventListener('click', function(e) {
    if (e.target.attributes.job.value == 'completed') {
        completed(e.target); 
    }
    else if (e.target.attributes.job.value == 'deleted') {
        deleted(e.target);
    }

    // add to localStorage(this code must be added when data in localStorage is updated)
    localStorage.setItem('TODOS', JSON.stringify(LIST));
})

for (let p of document.querySelectorAll('#pp')) {
    console.log(p);
    p.addEventListener('blur', function(e) {
        let editText = p.textContent;
        LIST[p.parentNode.parentNode.querySelector('button').attributes.pd.value].text = editText;
        localStorage.setItem('TODOS', JSON.stringify(LIST));
    })
}

let t = setInterval(() => location.reload(), 200000);


// creating weather
const weather = {};
weather.temperature = {
    unit : 'celsius'
}

const KELVIN = 273;
const key = '4d8fb5b93d4af21d66a2948710284366';

if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(setPosition, showError);
}else {
    alert('doesnt support');
}

function setPosition(position) {
    let latitude = position.coords.latitude;
    let longitude = position.coords.longitude;

    getWeather(latitude, longitude);
}

function showError(error) {
    alert('error', error.message);
}

function getWeather(latitude, longitude) {
    let api = `http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`;

    console.log(api);

     fetch(api)
       .then(function(response) {
           let data = response.json();
           return data;
       })
       .then(function(data) {
           weather.temperature.value = Math.floor(data.main.temp - KELVIN);
           weather.temperature.feelsLike = Math.floor(data.main.feels_like - KELVIN);
           weather.description = data.weather[0].icon;
           weather.iconID = data.weather[0].icon
           weather.city = data.name;
           weather.country = data.sys.country;
       })
       .then(function() {
           displayWeather();
       })
}

function displayWeather() {
    document.querySelector('#currDate').innerHTML = new Date().toLocaleDateString('en-US', {day : 'numeric', month : 'short'}) + ' in '; 
    document.querySelector('#city').innerHTML = weather.city + ' is ';
    document.querySelector('#temp').innerHTML = weather.temperature.value + 'c ' + '(feels like ' + weather.temperature.feelsLike + ')';
}