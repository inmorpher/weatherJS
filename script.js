let userCityInput = document.querySelector('.weather-input-value');
let mainContent = document.querySelector('#main-container');
let cardTemplate = document.querySelector('#main-card').content;
let dailyCardTemplate = document.querySelector('#daily-card').content;
let dayBlock = document.querySelector('#day-card').content;
let sunPosition = document.querySelector('#sun-position').content;
let dailyCardTemplateCloned = dailyCardTemplate.cloneNode(true);
let dayBlockSpace = dailyCardTemplateCloned.querySelector('.dayly-forecast');
let dailyGist = dailyCardTemplateCloned.querySelector('.gist-block');
let wrapperBlock = dailyCardTemplateCloned.querySelector('.more-info-block-wrap');
let clonedTemplate = cardTemplate.cloneNode(true);
// weatherJumper
let weatherJumper = document.querySelector('#weather-jumper').content;
let weatherBlock = document.querySelector('#more-info-daily-block').content;
// переменные основного блока
let submitUserCity = document.querySelector('.weather-input-value-button');
let toogleButton = document.querySelector('.toggle-theme');
let cityName = clonedTemplate.querySelector('.city-name');
let cityTime = clonedTemplate.querySelector('.city-time');
let tCurrent = clonedTemplate.querySelector('.tempereture-value');
let weatherMainCondition = clonedTemplate.querySelector('.weather-main-info');
let tMin = clonedTemplate.querySelector('.min-tempereture');
let tMax = clonedTemplate.querySelector('.max-tempereture');
let tComfort = clonedTemplate.querySelector('.t-comfort');
let wIcon = clonedTemplate.querySelector('.weather-icon');
let humidity = clonedTemplate.querySelector('.humidity');
let clouds = clonedTemplate.querySelector('.clouds');
let visibility = clonedTemplate.querySelector('.visibility');
let directionArrow = clonedTemplate.querySelector('.arrow');
let wInfo = clonedTemplate.querySelector('.wind-info');
let wMain = clonedTemplate.querySelector('.direction');
let wLogo = clonedTemplate.querySelector('.wind-direction');
let presure = clonedTemplate.querySelector('.presure');
let sunrise = clonedTemplate.querySelector('.sunrise');
let sunset = clonedTemplate.querySelector('.sunset');

// Функция переключения темы
function toogleTheme() {
	let htmlAttr = document.documentElement;

	if (htmlAttr.hasAttribute('data-theme')) {
		htmlAttr.removeAttribute('data-theme');
		toogleButton.textContent = 'LIGHT MODE';
	} else {
		htmlAttr.setAttribute('data-theme', 'dark-mode');
		toogleButton.textContent = 'DARK MODE';
	}
}
toogleButton.addEventListener('click', toogleTheme);
// Запрос на API
function getCurrentWeather() {
	// погода сейчас
	fetch(`http://api.openweathermap.org/data/2.5/weather?q=${userCityInput.value}&units=metric&lang=ru&appid=8bf920eea1ae9d71a955d21514276060`)
		.then(function (resp) { return resp.json() })
		.then(function (data) {
			cardFeelUp(data);
			console.log(data);
		})
		.catch(function () {
			alert('а ну еще разок!');
			// catch any errors
		});
	//погода на 5 дней с шагом в 3 часа
	fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${userCityInput.value}&units=metric&lang=ru&appid=8bf920eea1ae9d71a955d21514276060`)
		.then(function (response) { return response.json() })
		.then(function (data) {
			console.log(data);
			feelUpDayCard(data);
			createMoreInfo(data);
		})
		.catch(function () {
			// catch any errors
			
		});
}

userCityInput.addEventListener('keydown', event => {

	if (event.keyCode == 13) {
		getCurrentWeather();
		userCityInput.value = '';
		showBlocks();


	}

})

submitUserCity.addEventListener('click', () => {
	getCurrentWeather();
	userCityInput.value = '';
	showBlocks();
});

function showBlocks() {
	document.querySelector('.navigation').style.paddingTop = '15px';
	userCityInput.style.cssText = 'width: 225px;height: 25px;border-bottom: 1px solid var(--main-title-color);font-size: 1em;letter-spacing: 1px;';
	submitUserCity.style.cssText = 'width: 26px;font-size: 1em;height: 26px;';
	toogleButton.style.cssText = 'width: 26px;font-size: 1em;height: 26px;font-size: 0.3em; border-radius: 7px 0 0 7px;';
	setTimeout(function () {
		mainContent.classList.add('visible');
	}, 300);
}

// Функция заполнения главной формы
function cardFeelUp(data) {
	cityName.textContent = data.name.toUpperCase();
	cityTime.textContent = getTime(data.dt, data.timezone);
	tCurrent.textContent = Math.round(data.main.temp) + '°';
	directionArrow.style.transform = `rotate(${data.wind.deg}deg)`;
	wIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
	wLogo.textContent = getWindInfo(data, 0);
	wInfo.textContent = getWindInfo(data, 1);
	weatherMainCondition.textContent = data.weather[0].description;
	tMin.textContent = Math.round(data.main.temp_min) + '°C';
	tMax.textContent = Math.round(data.main.temp_max) + '°C';
	tComfort.textContent = Math.round(data.main.feels_like) + '°C';
	clouds.textContent = `${data.clouds.all} %`;
	humidity.textContent = `${data.main.humidity} %`;
	visibility.textContent = `${data.visibility / 1000} км`;
	presure.textContent = `${data.main.pressure} гПа`;
	sunrise.textContent = getTime(data.sys.sunrise, data.timezone);
	sunset.textContent = getTime(data.sys.sunset, data.timezone);

	mainContent.appendChild(clonedTemplate);
}

// заполнение и изменения блока Day
function feelUpDayCard(data) {
	if (dayBlockSpace.children.length > 1) {
		let dayBlockList = document.querySelectorAll('.day-block');

		let dayTarget = new Date(data.list[0].dt * 1000);
		let counter = 0;

		for (let i = 0; i < 40; i++) {
			let dayValue = new Date(data.list[i].dt * 1000);
			if (dayTarget.getDay() != dayValue.getDay() && dayValue.getUTCHours() == 3 || dayTarget.getDay() != dayValue.getDay() && dayValue.getUTCHours() == 15) {

				dayBlockList[counter].querySelector('img').src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
				dayBlockList[counter].querySelector('.day-block-temp').textContent = Math.round(data.list[i].main.temp) + '°C';
				dayBlockList[counter].querySelector('.day-block-desc').textContent = data.list[i].weather[0].description;
				dayBlockList[counter].querySelector('.day-block-humidity').textContent = `влажность: ${data.list[i].main.humidity}%`;
				dayBlockList[counter].querySelector('.day-wind-info').children[0].textContent = getWindInfo(data.list[i], 0).toLocaleLowerCase();
				dayBlockList[counter].querySelector('.day-wind-info').children[1].style.transform = `rotate(${data.list[i].wind.deg}deg)`;
				dayBlockList[counter].querySelector('.day-wind-info').children[2].textContent = Math.round(data.list[i].wind.speed) + 'м/с';
				dayBlockList[counter].querySelector('.day-presure').textContent = data.list[i].main.pressure + ' гПа';

				counter++;
				console.log(dayValue.getUTCHours());
				console.log(data.list[i].dt_txt);
				i = i + 3;

			}

			if (counter == 6) {
				break;
			}
		}
	} else {
		let dayTarget = new Date(data.list[0].dt * 1000);

		let counter = 0;
		for (let i = 0; i < 40; i++) {
			let dayValue = new Date(data.list[i].dt * 1000);
			if (dayTarget.getDay() != dayValue.getDay() && dayValue.getUTCHours() == 3) {
				let clonedDayBlock = dayBlock.cloneNode(true);
				let nightContent = clonedDayBlock.querySelector('.day-wrapper').children[1];
				let dayContent = clonedDayBlock.querySelector('.day-wrapper').children[2];

				clonedDayBlock.querySelector('.date').textContent = dayValue.getUTCDate() + ' ' + getMonth(dayValue.getUTCMonth());
				nightContent.style.background = '#7e7e7e1c';
				nightContent.querySelector('.day-block-status').textContent = 'ночь';
				nightContent.querySelector('img').src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
				nightContent.querySelector('.day-block-temp').textContent = Math.round(data.list[i].main.temp) + '°C';
				nightContent.querySelector('.day-block-desc').textContent = data.list[i].weather[0].description;
				nightContent.querySelector('.day-block-humidity').textContent = `влажность: ${data.list[i].main.humidity}%`;
				nightContent.querySelector('.day-wind-info').children[0].textContent = getWindInfo(data.list[i], 0).toLocaleLowerCase();
				nightContent.querySelector('.day-wind-info').children[1].style.transform = `rotate(${data.list[i].wind.deg}deg)`;
				nightContent.querySelector('.day-wind-info').children[2].textContent = Math.round(data.list[i].wind.speed) + 'м/с';
				nightContent.querySelector('.day-presure').textContent = data.list[i].main.pressure + ' гПа';

				dayContent.querySelector('.day-block-status').textContent = 'день';
				dayContent.querySelector('img').src = `http://openweathermap.org/img/wn/${data.list[i + 3].weather[0].icon}@2x.png`;
				dayContent.querySelector('.day-block-temp').textContent = Math.round(data.list[i + 3].main.temp) + '°C';
				dayContent.querySelector('.day-block-desc').textContent = data.list[i + 3].weather[0].description;
				dayContent.querySelector('.day-block-humidity').textContent = `влажность: ${data.list[i + 3].main.humidity}%`;
				dayContent.querySelector('.day-wind-info').children[0].textContent = getWindInfo(data.list[i + 3], 0).toLocaleLowerCase();
				dayContent.querySelector('.day-wind-info').children[1].style.transform = `rotate(${data.list[i + 3].wind.deg}deg)`;
				dayContent.querySelector('.day-wind-info').children[2].textContent = Math.round(data.list[i + 3].wind.speed) + 'м/с';
				dayContent.querySelector('.day-presure').textContent = data.list[i + 3].main.pressure + ' гПа';

				dayBlockSpace.appendChild(clonedDayBlock);
				let dayDivider = document.createElement('div');
				dayDivider.classList.add('day-divider');
				dayBlockSpace.appendChild(dayDivider);

				counter++;
				i = i + 6;

			}

			if (counter == 3) {
				break;
			}
		}
	}
}

// заполнение и изменения блока Dayly
function createMoreInfo(data) {
	mainContent.appendChild(dailyCardTemplateCloned);

	let maxTemp = 0;
	for (let i = 0; i < 8; i++) {
		if (maxTemp < data.list[i].main.temp) {
			maxTemp = data.list[i].main.temp;
		}
	}

	let maxGist = 60 / maxTemp;

	if (dailyGist.children.length > 1 || wrapperBlock.children.length > 1) {
		// Обновление элементов
		let jumperList = document.querySelectorAll('.weather-jumper');
		let blockList = document.querySelectorAll('.content-info');
		let oldSunrise = wrapperBlock.querySelector('#sunrise');
		let oldSunset = wrapperBlock.querySelector('#sunset');
		let nodeJumperPaddingPosition = 0;
		// Удаляем старые блоки SunBuild

		if (oldSunset) {
			wrapperBlock.removeChild(oldSunset);
		}
		if (oldSunrise) {
			wrapperBlock.removeChild(oldSunrise);
		}

		for (let i = 0; i < jumperList.length; i++) {
			// Jumper
			jumperList[i].querySelector('.weather-jumper-temp').textContent = Math.round(data.list[i].main.temp) + '°C';
			jumperList[i].querySelector('.jumper-weather-img').src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
			// определяем высоту блока относительно температур
			if (maxTemp > -10 && maxTemp < 5) {
				nodeJumperPaddingPosition = 60 - data.list[i].main.temp * 4;
			} else {
				nodeJumperPaddingPosition = 100 - data.list[i].main.temp * maxGist;
			}

			jumperList[i].style.paddingTop = `${nodeJumperPaddingPosition}px`;
			// Block
			blockList[i].querySelector('.daily-weather-time').textContent = getTime(data.list[i].dt, 0);
			blockList[i].querySelector('.time-of-the-day').textContent = getDayStatus(data.list[i].dt);
			blockList[i].querySelector('.wind-text').textContent = getWindInfo(data.list[i], 0).toLocaleLowerCase();
			blockList[i].querySelector('.daily-arrow').style.transform = `rotate(${data.list[i].wind.deg}deg)`;
			blockList[i].querySelector('.wind-speed').textContent = Math.round(data.list[i].wind.speed) + 'м/с';
			blockList[i].querySelector('.daily-presure-value').textContent = data.list[i].main.pressure + ' гПа';
			// Пересоздание и наполнение элементов SunBlock
			sunBlockReBuild(data, i, blockList);
		}
	} else {
	
		for (let i = 0; i < 8; i++) {
			// jumper block
			let clonedWeatherJumper = weatherJumper.cloneNode(true);
			// clonedWeatherJumper.style.margin = `${16}px`;
			clonedWeatherJumper.querySelector('.weather-jumper-temp').textContent = Math.round(data.list[i].main.temp) + '°C';
			clonedWeatherJumper.querySelector('.jumper-weather-img').src = `http://openweathermap.org/img/wn/${data.list[i].weather[0].icon}@2x.png`;
			if (i != 0) {
				clonedWeatherJumper.querySelector('.weather-jumper').style.margin = '0 1px 0 1px';
			}
			// Block
			let clonedWeatherBlock = weatherBlock.cloneNode(true);

			clonedWeatherBlock.querySelector('.daily-weather-time').textContent = getTime(data.list[i].dt, 0);
			clonedWeatherBlock.querySelector('.time-of-the-day').textContent = getDayStatus(data.list[i].dt);
			clonedWeatherBlock.querySelector('.wind-text').textContent = getWindInfo(data.list[i], 0).toLocaleLowerCase();
			clonedWeatherBlock.querySelector('.daily-arrow').style.transform = `rotate(${data.list[i].wind.deg}deg)`;
			clonedWeatherBlock.querySelector('.wind-speed').textContent = Math.round(data.list[i].wind.speed) + 'м/с';
			clonedWeatherBlock.querySelector('.daily-presure-value').textContent = data.list[i].main.pressure + ' гПа';
			getTime(data.city.sunrise, data.city.timezone)
			if (i > 0 && i < 8) {
				let dividerBlock = document.createElement('div');
				dividerBlock.classList.add('dayly-divider');
				wrapperBlock.appendChild(dividerBlock);
			}
			// Создание и наполнение элементов SunBlock
			sunBlockFeelUp(data, i);

			if (maxTemp > -10 && maxTemp < 5) {
				nodeJumperPaddingPosition = 60 - data.list[i].main.temp * 4;
			} else {
				nodeJumperPaddingPosition = 120 - data.list[i].main.temp * maxGist;
			}

			clonedWeatherJumper.querySelector('.weather-jumper').style.paddingTop = `${nodeJumperPaddingPosition}px`;
			// Добавление элементов
			dailyGist.appendChild(clonedWeatherJumper);

			wrapperBlock.appendChild(clonedWeatherBlock);
		}
	}
}

// создание блока sunblock
function sunBlockFeelUp(data, i) {
	// Sunrise
	let timeSunrise = new Date((data.city.sunrise + data.city.timezone) * 1000);
	let sunrise = timeSunrise.getUTCHours();
	if (i > 0 && i < 8 && sunrise >= getTime(data.list[i - 1].dt, 0, 1) && sunrise < getTime(data.list[i].dt, 0, 1)) {
		let clonedSunPosition = sunPosition.cloneNode(true);
		console.log(clonedSunPosition);
		clonedSunPosition.querySelector('.sun-position-time').textContent = getTime(data.city.sunrise, data.city.timezone);
		clonedSunPosition.querySelector('.sun-position-status').textContent = 'рассвет';
		clonedSunPosition.querySelector('.sun-img-postion').src = 'img/sunrise.png';
		clonedSunPosition.querySelector('.sun-position').setAttribute('id', 'sunrise');
		wrapperBlock.appendChild(clonedSunPosition);
	}
	// Sunset
	let timeSunset = new Date((data.city.sunset + data.city.timezone) * 1000);
	let sunset = timeSunset.getUTCHours();
	if (i > 0 && i < 8 && sunset >= getTime(data.list[i - 1].dt, 0, 1) && sunset < getTime(data.list[i].dt, 0, 1) || i > 0 && i < 8 && sunset >= getTime(data.list[i - 1].dt, 0, 1) && getTime(data.list[i].dt, 0, 1) == 0) {
		let clonedSunPosition = sunPosition.cloneNode(true);
		clonedSunPosition.querySelector('.sun-position-time').textContent = getTime(data.city.sunset, data.city.timezone);
		clonedSunPosition.querySelector('.sun-position-status').textContent = 'закат';
		clonedSunPosition.querySelector('.sun-img-postion').src = 'img/sundown.png';
		clonedSunPosition.querySelector('.sun-position').setAttribute('id', 'sunset');
		wrapperBlock.appendChild(clonedSunPosition);
	}
}

// пересоздание блока sunblock
function sunBlockReBuild(data, i, blockList) {
	let timeSunrise = new Date((data.city.sunrise + data.city.timezone) * 1000);
	let sunrise = timeSunrise.getUTCHours();
	// Sunrise rebuild
	if (i > 0 && i < 8 && sunrise >= getTime(data.list[i - 1].dt, 0, 1) && sunrise < getTime(data.list[i].dt, 0, 1)) {
		let clonedSunPosition = sunPosition.cloneNode(true);
		clonedSunPosition.querySelector('.sun-position-time').textContent = getTime(data.city.sunrise, data.city.timezone);
		clonedSunPosition.querySelector('.sun-position-status').textContent = 'рассвет';
		clonedSunPosition.querySelector('.sun-img-postion').src = 'img/sunrise.png';
		clonedSunPosition.querySelector('.sun-position').setAttribute('id', 'sunrise');
		wrapperBlock.insertBefore(clonedSunPosition, blockList[i]);
	}
	let timeSunset = new Date((data.city.sunset + data.city.timezone) * 1000);
	let sunset = timeSunset.getUTCHours();
	// Sunset rebuild
	if (i > 0 && i < 8 && sunset >= getTime(data.list[i - 1].dt, 0, 1) && sunset < getTime(data.list[i].dt, 0, 1) || i > 0 && i < 8 && sunset >= getTime(data.list[i - 1].dt, 0, 1) && getTime(data.list[i].dt, 0, 1) == 0) {
		let clonedSunPosition = sunPosition.cloneNode(true);
		clonedSunPosition.querySelector('.sun-position-time').textContent = getTime(data.city.sunset, data.city.timezone);
		clonedSunPosition.querySelector('.sun-position-status').textContent = 'закат';
		clonedSunPosition.querySelector('.sun-img-postion').src = 'img/sundown.png';
		clonedSunPosition.querySelector('.sun-position').setAttribute('id', 'sunset');
		wrapperBlock.insertBefore(clonedSunPosition, blockList[i]);
	}
}

// узнаем утром/день/вечер/ночь
function getDayStatus(data) {
	let date = new Date(data * 1000);

	if (date.getUTCHours() == 6 || date.getUTCHours() == 9) {
		return 'утро';
	}
	else if (date.getUTCHours() == 12 || date.getUTCHours() == 15) {
		return 'день';
	}
	else if (date.getUTCHours() == 18) {
		return 'вечер';
	}
	else if (date.getUTCHours() == 21 || date.getUTCHours() == 0 || date.getUTCHours() == 3) {
		return 'ночь';
	}
}

// функция получения месяца
function getMonth(date) {
	switch (date) {
		case 0:
			return 'января';
		case 1:
			return 'февраля';
		case 2:
			return 'марта';
		case 3:
			return 'апреля';
		case 4:
			return 'мая';
		case 5:
			return 'июня';
		case 6:
			return 'июля';
		case 7:
			return 'августа';
		case 8:
			return 'сентября';
		case 9:
			return 'октября';
		case 10:
			return 'ноября';
		case 11:
			return 'декабря';
	}
}

// Функция определения стороны ветра
function getWindInfo(data, param) {
	let windValue = [];

	if (data.wind.deg >= 350 || data.wind.deg < 10) {
		windValue[0] = 'С';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 80 && data.wind.deg <= 100) {
		windValue[0] = 'В';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 170 && data.wind.deg < 190) {
		windValue[0] = 'Ю';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 260 && data.wind.deg < 280) {
		windValue[0] = 'З';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 10 && data.wind.deg < 80) {
		windValue[0] = 'СВ';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 100 && data.wind.deg < 170) {
		windValue[0] = 'ЮВ';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 190 && data.wind.deg < 260) {
		windValue[0] = 'ЮЗ';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	} else if (data.wind.deg >= 280 && data.wind.deg < 350) {
		windValue[0] = 'СЗ';
		windValue[1] = `${wLogo.textContent.toLocaleLowerCase()} ${data.wind.speed} м/с`;
		windValue[2] = `${data.wind.speed}`
	}

	switch (param) {
		case 0:
			return windValue[0];

		case 1:
			return windValue[1];

		case 2:
			return windValue[2];
	}
}

// Получаем время рассвета и заката
function getTime(time, timezone, hours) {
	if (hours) {
		let date = new Date((time + timezone) * 1000);
		return date.getUTCHours();
	}

	let date = new Date((time + timezone) * 1000);

	if (date.getUTCHours() < 10 && date.getUTCMinutes() < 10) {
		return `0${date.getUTCHours()} : 0${date.getUTCMinutes()}`;
	} else if (date.getUTCHours() < 10) {
		return `0${date.getUTCHours()} : ${date.getUTCMinutes()}`;
	} else if (date.getUTCMinutes() < 10) {
		return `${date.getUTCHours()} : 0${date.getUTCMinutes()}`;
	} else {
		return `${date.getUTCHours()} : ${date.getUTCMinutes()}`;
	}
}