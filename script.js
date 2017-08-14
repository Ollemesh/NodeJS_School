let	maxPhoneNumberSum = 30,
	inputErrorClass = 'error',
	myForm, submitButton, resultContainer;

let patterns = {
	fio: /^((?:\S+\s+){2}\S+)$/i, // Ровно три слова
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:ya\.ru|yandex\.(?:ru|ua|by|kz|com))$/i, // Формат email-адреса, но только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com
	phone: /^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/ // Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99 
};

document.addEventListener('DOMContentLoaded', () => {
	myForm = document.getElementById('myForm');
	submitButton = document.getElementById('submitButton');
	resultContainer = document.getElementById('resultContainer');

	resultContainer = new ResultContainer(resultContainer);
	/**
	 * Глобальный Объект MyForm
	 * @global
	 * @implements {Form}
	 */
	window.MyForm = new Form(myForm);

	myForm.addEventListener('submit', event => {
		event.preventDefault();
		window.MyForm.submit();
	})
})

/** Представляет объект формы с методами валидации, сабмита и получения/установки значений полей. */
class Form {
	/**
	 * Создание объекта формы.
	 * @param {object} form - HTMLFormElement. 
	 */
	constructor(form) {
		this.form = form;
	}

	/**
	 * Возвращает объект с признаком результата валидации (isValid) и массивом названий полей, которые не прошли валидацию (errorFields).
	 * @return {object} { isValid: Boolean, errorFields: String[] }.
	 */
	validate() {
		let fieldData = this.getData(),
			isValid = true,
			errorFields = [];

		for (let fieldName in fieldData) {
			let fieldPattern = patterns[fieldName];

			if (
				(fieldPattern && !fieldPattern.test(fieldData[fieldName].trim())) ||
				(fieldName === 'phone' && this._getPhoneNumberSum(fieldData[fieldName]) > maxPhoneNumberSum)
			) {
				errorFields.push(fieldName);
				isValid = false
			}
		}

		console.log({
			isValid,
			errorFields
		})

		return {
			isValid,
			errorFields
		};
	}

	/**
	 * Возвращает объект с данными формы, где имена свойств совпадают с именами инпутов.
	 * @return {object} { inputName: inputValue, anotherInputName: anotherInputValue}.
	 */
	getData() {
		let formData = {};

		[...this.form.elements].forEach(element => {
			if (element.name) {
				formData[element.name] = element.value;
			}
		})

		return formData;
	}

	/**
	 * Принимает объект с данными формы и устанавливает их инпутам формы. Поля кроме phone, fio, email игнорируются.
	 * @param {object} formData - Объект с данными формы.
	 * @param {string} formData.phone - Значение поля phone.
	 * @param {string} formData.fio - Значение поля fio.
	 * @param {string} formData.email - Значение поля email.
	 */
	setData(formData) {
		for (let inputName in formData) {
			if (['phone', 'fio', 'email'].indexOf(inputName) >= 0) {
				document.querySelector(`[name=${inputName}]`).value = formData[inputName];
			}
		}
	}

	/**
	 * Выполняет валидацию полей и отправку ajax-запроса, если валидация пройдена.
	 */
	submit() {
		let validStatus = this.validate();
		if (validStatus.isValid) {
			submitButton.disabled = true;
			this._sendRequest(this.form.getAttribute('action'), this.getData())
				.then(resultContainer.setResultStatus.bind(resultContainer))
				.catch(error => {
					console.log(error)
				});
		} else {
			validStatus.errorFields.forEach(errorField => {
				document.querySelector(`[name=${errorField}]`).classList.add(inputErrorClass);
			})
		}
	}

	/**
	 * Получение суммы чисел, составляющих телефонный номер.
	 * @param {string} phone - Телефоный номер в любом формате.
	 * @return {number} Сумма чисел, составляющих телефонный номер.
	 */
	_getPhoneNumberSum(phone) {
		return phone.match(/\d/g).reduce((sum, digit) => parseInt(sum) + parseInt(digit))
	}

	/**
	 * Отправка запароса на сервер.
	 * @param {string} address - Адрес, на который требуется отправить запрос.
	 * @param {object} data - Отправляемый на сервер объект.
	 * @return {promise} Промис будет разрешён объектом ответа сервера.
	 */
	_sendRequest(address, data) {
		return new Promise((resolve, reject) => {
			let xhr = new XMLHttpRequest();

			xhr.onload = () => {
				if (xhr.status === 200) {
					resolve(JSON.parse(xhr.responseText));
				} else {
					reject(xhr.responseText);
				}
			}

			xhr.open('GET', address+'?'+this._serialize(data));
			xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
			xhr.send();
		});
	}

	/**
	 * Генерация строки запроса исходя из переданного объекта данных.
	 * @param {object} object - объект данных.
	 * @return {string} строка запроса.
	 */
	_serialize(object) {
		let string = [];
		for (let prop in object)
			if (object.hasOwnProperty(prop)) {
				string.push(encodeURIComponent(prop) + "=" + encodeURIComponent(object[prop]));
			}
		return string.join("&");
	}
}

/** Объект управления resultContainer-ом. */
class ResultContainer {
	/**
	 * Создание управления resultContainer-ом.
	 * @param {object} resultContainer - HTMLElement.
	 */
	constructor(resultContainer) {
		this.resultContainer = resultContainer;
	}

	/**
	 * Установка требуемых парметров и контента для resultContainer-а 
	 * @param {object} response ответ сервера
	 */
	setResultStatus(response) {
		console.log(response)
		if (!response) {
			throw new Error('Response is empty');
		}
		switch (response.status) {
			case 'success':
				this._setSuccess();
				break;
			case 'progress':
				this._setProgress(response.timeout, MyForm);
				break;
			case 'error':
				this._setError(response.reason);
				break;
		}

		this.resultContainer.classList.add(response.status);
	}

	_setSuccess() {
		this.resultContainer.innerHTML = 'Success';
	}

	_setProgress(timeout, formObject) {
		setTimeout(() => {
			formObject.submit();
		}, parseInt(timeout));
	}
	_setError(errorReason) {
		this.resultContainer.innerHTML = errorReason;
	}
}