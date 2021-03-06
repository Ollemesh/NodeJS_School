# Тестовое задание для поступления в школу Node.JS

### Описание

Тестовое задание выполнено без использования каких-либо библиотек или фреймворков.
Только нативный JS(ES2015), применение дополнительных инструментов показалось мне избыточным.
(Ну и всегда приятно освежить навыки нативного JS).

### Запуск

У вас, скорей всего, написаны тетсы, но я решил на всякий случай
разместить инструкцию для запуска "приложения".  

Для обработки запросов "приложения" к статическим файлам потенциальных ответов, браузеру необходим сервер, 
я использовал `browser-sync`. Ниже инструкция по его установке и запуску.

Node.JS должен быть установлен, проверить это можно командой:
```sh
    node -v
```
Если команда не найдена, то следует установить [Node.JS](https://nodejs.org/en/download/)

Убедившись, что Node.JS у нас есть, устанавливаем `browser-sync` глобально 
(может потребоваться root-доступ):
```sh
    npm i -g browser-sync
```
После установки `browser-sync` запускаем сервер, для этого необходимо быть в дирректории приложения:
```sh
    browser-sync start --server --files '*'
```
Теперь должен открыться браузер на странице нашего задания.