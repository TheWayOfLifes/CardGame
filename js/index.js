const menu = document.getElementById('menu');
const game = document.getElementById('game');

// Запуск программы
const start = document.querySelector('.start');
setTimeout(function () {
	start.classList.add('start-active');

	setTimeout(function () {
		start.classList.remove('start-active');
		start.style.opacity = 0;
	}, 4000);

	setTimeout(function () {
		start.style.display = 'none';
	}, 5000);
}, 1000);

function play(count) {
	let cardCount = count;
	const cardsNumberArray = [];
	let firstCard = null;
	let lastCard = null;

	for (let i = 1; i <= cardCount; i++) {
		cardsNumberArray.push(i, i);
	}

	// Перемешивание массива чисел
	for (let i = 0; i < cardsNumberArray.length; i++) {
		// Получаем случаный индекс: округление( (0-1)*длину )
		let randomIndex = Math.floor(Math.random() * cardsNumberArray.length);
		let temp = cardsNumberArray[i];
		cardsNumberArray[i] = cardsNumberArray[randomIndex];
		cardsNumberArray[randomIndex] = temp;
	}

	// Создание карточек
	for (const cardNumder of cardsNumberArray) {
		const card = document.createElement('div');
		card.classList.add('card');
		card.textContent = cardNumder;
		game.append(card);
	}

	// Запускаем таймер
	const startTime = performance.now();

	// Добавляем слушатель через делегирование
	game.addEventListener('click', function (event) {
		if (
			event.target.classList.contains('card') &&
			!event.target.classList.contains('active')
		) {
			// Проверка наличия двух соответсвий
			if (firstCard !== null && lastCard !== null) {
				firstCard.classList.remove('open');
				lastCard.classList.remove('open');
				firstCard = null;
				lastCard = null;
			}

			// Добавление классов
			if (firstCard == null) {
				firstCard = event.target;
				firstCard.classList.add('open');
			} else if (event.target != firstCard) {
				lastCard = event.target;
				lastCard.classList.add('open');
				// Обработка совпадения
				if (firstCard.textContent == lastCard.textContent) {
					firstCard.classList.add('active');
					lastCard.classList.add('active');
					const firstCardActive = firstCard;
					const lastCardActive = lastCard;
					setTimeout(function () {
						firstCardActive.classList.remove('open');
						lastCardActive.classList.remove('open');
					}, 1000);
				}
			}

			// Проверка на завершение игры
			if (
				document.querySelectorAll('.active').length == cardsNumberArray.length
			) {
				// ??????????????????????????????????????????????????
				game.removeEventListener('click', arguments.callee);
				// ??????????????????????????????????????????????????

				document.querySelector('.menu-title').textContent =
					'Победа! Сыграем снова?';
				document.querySelector('.play').style.filter = 'blur(5px)';
				document.querySelector('.menu').style.top = '20vh';

				// Останавливаем таймер и форматируем миллисекунды
				const endTime = performance.now();
				const milliseconds = Math.floor(endTime - startTime);

				const formattedTime = formatTime(milliseconds);

				function formatTime(milliseconds) {
					// Вычисляем минуты
					const minutes = Math.floor(milliseconds / (1000 * 60));
					milliseconds -= minutes * (1000 * 60);

					// Вычисляем секунды
					const seconds = Math.floor(milliseconds / 1000);
					milliseconds -= seconds * 1000;

					// Форматируем миллисекунды
					const formattedMilliseconds = milliseconds
						.toString()
						.padStart(3, '0');

					// Возвращаем строку в формате "МИНУТЫ:СЕКУНДЫ:МИЛЛИСЕКУНДЫ"
					return `${minutes}:${seconds
						.toString()
						.padStart(2, '0')}:${formattedMilliseconds}`;
				}

				const menuTime = document.querySelector('.menu-time');
				menuTime.style.display = 'block';
				menuTime.textContent = `Время: ${formattedTime}`;
			}
		}
	});
}

// Добавляем слушатель на меню
menu.addEventListener('click', function (event) {
	if (event.target.classList.contains('button-item')) {
		const choice = event.target.textContent;
		menu.style.top = '100vh';
		document.querySelector('.play').style.filter = 'none';

		// Очищаем поле
		while (game.firstChild) {
			game.removeChild(game.firstChild);
		}

		switch (choice) {
			case 'Легкий':
				play(4);
				break;
			case 'Средний':
				play(6);
				break;
			case 'Хард':
				play(8);
				break;
		}
	}
});
