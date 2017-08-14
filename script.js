//Make Get request
//check comments

let inputErrorClass = 'error',
	resultContainerClasses = {
		success: 'success',
		progress: 'progress',
		error: 'error'
	},
	maxPhoneNumberSum = 30;

let patterns = {
	fio: /^((?:\S+\s+){2}\S+)$/i, // Ровно три слова
	email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(?:ya\.ru|yandex\.(?:ru|ua|by|kz|com))$/i, // Формат email-адреса, но только в доменах ya.ru, yandex.ru, yandex.ua, yandex.by, yandex.kz, yandex.com
	phone: /^\+7\(\d{3}\)\d{3}(?:-\d{2}){2}$/ // Номер телефона, который начинается на +7, и имеет формат +7(999)999-99-99 
};
