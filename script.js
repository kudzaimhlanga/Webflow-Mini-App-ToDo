(() => {
	const form = document.querySelector('.form');
	const input = document.querySelector('.input');
	const tasksListsContainer = document.querySelector('.tasks-list');
	let tasks = [];

	function submitForm(e) {
		e.preventDefault();
		const task = input.value.toString();

		if (task.length > 0) {
			//generate card and store it in local storage
			const generatedCard = generateCard(task);
			if (generatedCard) {
				storeTask(
					generatedCard.dataset.taskname,
					generatedCard.dataset.taskdate
				);
				input.value = '';
			} else {
				showInputError();
			}
		} else {
			input.value = 'Please enter a task';
		}
	}

	//input settings
	function showInputError() {
		input.classList.add('is-error');
		input.value = 'Task already exists. Please enter a new task';
	}

	function resetInputState() {
		input.classList.remove('is-error');
	}

	//creating and adding tasks
	function generateCard(taskDesc, date) {
		//prevent duplicate tasks
		if (tasks.indexOf(taskDesc) >= 0) {
			return false;
		}

		tasks.push(taskDesc);

		//generate ui for task card
		const taskCard = document.createElement('div');
		taskCard.classList.add('task');

		const taskName = document.createElement('div');
		taskName.classList.add('text-size-regular', 'weight-600');

		const task = document.createTextNode(taskDesc);

		const dateCreated = document.createElement('div');
		dateCreated.classList.add('text-size-tiny');

		let taskDate;
		if (date) {
			taskDate = date;
			dateCreated.innerHTML = `
				Created On: <strong>${date}</strong>
			`;
		} else {
			const newDate = Date.now();
			const currDate = Intl.DateTimeFormat('default', {
				day: 'numeric',
				month: 'long',
				year: 'numeric',
			}).format(newDate);
			taskDate = currDate;
			dateCreated.innerHTML = `
			Created On: <strong>${currDate}</strong>
		`;
		}

		const deleteBtn = document.createElement('button');
		deleteBtn.classList.add('button', 'is-delete');
		deleteBtn.innerHTML = 'X';

		taskName.appendChild(task);
		taskCard.appendChild(taskName);
		taskCard.appendChild(dateCreated);
		taskCard.appendChild(deleteBtn);

		//append child to list
		taskCard.setAttribute('data-taskName', taskDesc);
		taskCard.setAttribute('data-taskDate', taskDate);
		document.querySelector('.tasks-list').appendChild(taskCard);
		return taskCard;
	}

	//store task in local storage
	function storeTask(task, date) {
		const tasksFromStorage = getTasksFromStorage();

		tasksFromStorage.push({ task, date });

		localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
	}

	//handle clicks on the tasks lists
	function handleClick(e) {
		if (e.target.classList.contains('button')) {
			deleteCard(e.target.parentNode);
			deleteTaskFromStorage(e.target.parentNode);
		}
	}

	function deleteCard(element) {
		element.remove();
	}

	function deleteTaskFromStorage(element) {
		let tasksFromStorage = getTasksFromStorage();
		tasksFromStorage = tasksFromStorage.filter(
			(n) => n.task !== element.dataset.taskname
		);
		localStorage.setItem('tasks', JSON.stringify(tasksFromStorage));
	}

	//load items when the app opens
	function loadTasks() {
		const tasksFromStorage = getTasksFromStorage();

		tasksFromStorage.forEach((task) => generateCard(task.task, task.date));
	}

	function getTasksFromStorage() {
		let tasksFromStorage;
		if (localStorage.getItem('tasks') === null) {
			tasksFromStorage = [];
		} else {
			tasksFromStorage = JSON.parse(localStorage.getItem('tasks'));
		}

		return tasksFromStorage;
	}

	function setDate() {
		const dateTextBlock = document.querySelector('.date-today');

		const date = Intl.DateTimeFormat('default', {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		}).format(Date.now());

		dateTextBlock.innerText = date.toString();
	}

	//initialize the application
	function init() {
		form.addEventListener('submit', submitForm);
		tasksListsContainer.addEventListener('click', handleClick);
		input.addEventListener('input', resetInputState);
		loadTasks();
		setDate();
	}

	init();
})();
