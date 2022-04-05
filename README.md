# Веб-приложение для связи с MS SQL Server
Это мой курсовой проект. Цель проекта - установить соединение с базой
данных MS SQL Server 2008 и обеспечить корректное взаимодействие  с БД 
нескольких пользователей одновременно. Особенности:
 - Трехзвенная архитектура;
 - Возможность синхронного удаления, добавления и редактирования записей в бд в зависимости от уровня транзакций;
 - Возможность редактирования изображений непосредственно в интерфейсе
 - Работа как с таблицами, так и с триггерами и процедурами;
 - Возможно сформировать отчет в формате .xlsx и скачать его;
## Используемые библиотеки
 - tedious - Подключение к SQL Server;
 - xlsx - Импорт данных в виде Excel;
 - file-saver - Сохранение файла на клиенте;
 - sockjs - Сокеты на сервере;
 - sockjs-client - Сокеты на клиенте;
 - prop-types - Валидация props
 - react-Konva - Взаимодействие с Canvas
###
Я считаю, что это хорошее приложение. Но есть много чего, что можно было бы улучшить. Например:
 - В самом проекте присутствует часть библиотек, которая не используется. Их надо будет почистить. Когда-нибудь...
 - Основной упор делался на работу с бэкендом, поэтому внешний вид можно сильно улучшить;
 - Обрабатываются не все ошибки.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run serv-start`

Runs NodeJS