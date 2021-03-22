export default class GameModel {

    constructor(view) {
        // --------------------------------------- ПАРАМЕТРЫ -----------------------------------------------------------

        // вьюшка
        this.view = view;

        // размеры
        this.canvasWidth = 900;
        this.canvasHeight = 600;
        this.cellSize = 75; // ширина и высота ячейки сетки
        this.cellGap = 2.5; // отступ между ячейками

        // настройки
        this.enemiesInterval = 600; // интервал появления врагов
        this.frame = 0; // кадры - как долго идет игра
        this.frameBack = 0 // кадры - как долго открыто стартовое окно
        this.frameNextLevel = 0; // кадры - отсчет до запуска нового уровня
        this.numberOfResources = 300; // стартовое количество ресурсов игрока
        this.gameOver = false; // игрок проиграл
        this.levelComplete = false; // игрок прошёл уровень
        this.win = false; // игрок прошёл игру
        this.userName = null; // имя игрока
        this.score = 0; // очки игрока
        this.levelGame = 1; // уровень игры
        this.winningScore = 100; // кол-во очков что бы враги перестали появляться и для перехода на след лвл
        this.animateID = null; // id анимации игры
        this.gameStart = false; // для определения старта игры

        // изображения
        this.images = {};

        this.addImage = (name, src) => {
            this.images[name] = new Image();
            this.images[name].src = src;
        }

        this.addImage('clouds_2', 'img/game_background/clouds_2.png');
        this.addImage('clouds_2_1', 'img/game_background/clouds_2_1.png');
        this.addImage('clouds_2_2', 'img/game_background/clouds_2_2.png');
        this.addImage('ground_1', 'img/game_background/ground_1.png');
        this.addImage('ground_2', 'img/game_background/ground_2.png');
        this.addImage('ground_3', 'img/game_background/ground_3.png');
        this.addImage('plant', 'img/game_background/plant.png');
        this.addImage('rocks', 'img/game_background/rocks.png');
        this.addImage('sky', 'img/game_background/sky.png');

        this.addImage('background_1', 'img/battle-backgrounds/game_background_1.jpg');
        this.addImage('background_2', 'img/battle-backgrounds/game_background_2.jpg');
        this.addImage('background_3', 'img/battle-backgrounds/game_background_3.jpg');
        this.addImage('background_4', 'img/battle-backgrounds/game_background_4.jpg');

        this.addImage('spellsEffect_1', 'img/protecting_char/Spells-Effect_1.png');
        this.addImage('spellsEffect_2', 'img/protecting_char/Spells-Effect_2.png');
        this.addImage('spellsEffect_3', 'img/protecting_char/Spells-Effect_3.png');

        this.addImage('wraith_01', 'img/protecting_char/Wraith_01.png');
        this.addImage('wraith_02', 'img/protecting_char/Wraith_02.png');
        this.addImage('wraith_03', 'img/protecting_char/Wraith_03.png');

        this.addImage('fallen_Angels_01', 'img/attacking_char/Fallen_Angels_01.png');
        this.addImage('fallen_Angels_02', 'img/attacking_char/Fallen_Angels_02.png');
        this.addImage('fallen_Angels_03', 'img/attacking_char/Fallen_Angels_03.png');

        this.addImage('golem_01', 'img/attacking_char/Golem_01.png');
        this.addImage('golem_02', 'img/attacking_char/Golem_02.png');
        this.addImage('golem_03', 'img/attacking_char/Golem_03.png');

        this.addImage('reaper_Man_01', 'img/protecting_char/Reaper_Man_01.png');
        this.addImage('reaper_Man_02', 'img/protecting_char/Reaper_Man_02.png');
        this.addImage('reaper_Man_03', 'img/protecting_char/Reaper_Man_03.png');

        this.addImage('Orc_01', 'img/attacking_char/Orc_01.png');
        this.addImage('Orc_02', 'img/attacking_char/Orc_02.png');
        this.addImage('Orc_03', 'img/attacking_char/Orc_03.png');

        this.addImage('coin', 'img/coins/dark_coin.png');
        this.addImage('score', 'img/coins/score.png');
        this.addImage('up_01', 'img/coins/up_01.png');
        this.addImage('up_02', 'img/coins/up_02.png');

        this.addImage('nav_game_button', 'img/buttons/Nav_Game_Button.png');


        // массивы данных
        this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
        this.navGrid = []; // массив объектов (ячеек) навбара, с методом отрисовки
        this.defenders = []; // массив защитников
        this.dyingDefenders = []; // массив умирающих защитников
        this.enemies = []; // массив врагов
        this.dyingEnemies = []; // массив умирающийх врагов
        this.enemyPosition = []; // массив местоположения врагов Y
        this.enemyPositionX = []; // массив столкновения врагов с защитниками X
        this.projectiles = []; // массив снарядов для защитников
        this.resources = []; // массив ресурсов
        this.amounts = [20, 30, 40]; // массив данных для ресурсов
        this.gameBackground = null;
        this.gameBattleBackground = null;
        this.arrUsers = []; // массив данных об игроках

        // параметры выбранного защитника
        this.choiceDefender = "wraith";


        // параметры мышки
        this.mouse = {
            x: 10,
            y: 10,
            width: 0.07,
            height: 0.07,
        }

        // параметры статусбара
        this.controlsBar = { // Массив параметров поля управления
            width: this.canvasWidth,
            height: this.cellSize * 1.5,
            availableHeight: this.cellSize * 3,
        }

        // ------------------------------------------ РЫЧАГИ УПРАВЛЕНИЯ ----------------------------------------------------

        // ------игровое поле

        // функция очистки канваса
        this.blank = () => {
            // debugger
            // подмена арен в зависимости от уровня игры
            if (this.levelGame === 1 || this.levelGame === 2 || this.levelGame === 3) this.gameBattleBackground = this.images.background_1;
            if (this.levelGame === 4 || this.levelGame === 5 || this.levelGame === 6) this.gameBattleBackground = this.images.background_2;
            if (this.levelGame === 7 || this.levelGame === 8 || this.levelGame === 9) this.gameBattleBackground = this.images.background_4;

            this.view.blank(this.gameBattleBackground);
        }

        // функция отрисовки ячеек игрового поля
        this.handleGameGrid = () => {
            for (let i = 0; i < this.gameGrid.length; i++) {
                this.gameGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
            }
        }

        // функция отрисовки ячеек навбара
        this.handleNavGrid = () => {
            for (let i = 0; i < this.navGrid.length; i++) {
                this.navGrid[i].draw(); // вызываю метод отрисовки каждой ячейки
            }
        }

        // слежу за состоянием игры показываю в навбаре сколько у игрока бабла и очков // вызвать следующий лвл
        this.handleGameStatus = () => {

            // уровень пройден если очки больше планки и нет врагов, и игра еще не пройдена
            (this.score >= this.winningScore && this.enemies.length === 0 && this.levelGame !== "win") ? this.levelComplete = true: this.levelComplete = false;

            // если уровень пройден
            if (this.levelComplete) {
                this.frameNextLevel++; // увеличить счетчик до следующего уровня
                if (this.frameNextLevel !== 0 && this.frameNextLevel % 180 === 0 && this.levelGame < 10) {
                    this.score += Math.round(this.numberOfResources / 10); // добавить игроку очки в размере 10% от оставшегося ресурса
                    this.numberOfResources += 300; // дать игроку еще 300 ресурсов
                    this.nextLevelGame();
                }

            }

            if (this.levelComplete && this.levelGame === 10) {

                this.levelGame = "win"; // что бы не вошло в условие ктоторе ставит levelComplete (выше)
                this.levelComplete = false; // что бы не вошло в это условие повторно
                this.win = true; // что бы отрисовало что игрок победил
                let leader = false; // что бы не сработал или не сработал if ниже
                this.view.continueBlock(false) // задизейблить кнопку "продолжить"
                this.view.pause = false; // сообщаю вив о паузе что бы при ререндере в меню не сбрасывало кнопку продолжть

                for (let i = 0; i < this.arrUsers.length; i++) {
                    if (Math.round(this.score) > +this.arrUsers[i].points) { // если очки игрока превышают отчки хотябы одного игрока из таблицы лидеров тот это игрок попадает в таблицу лидеров
                        // debugger
                        this.deleteUser(this.arrUsers[9].id); // удалить с сервера игрока с самым маленьким кол-вом очков

                        // --> добавить инфу игрока на сервер
                        this.addUser(this.userName, Math.round(this.score));

                        // --> вызвать метод вью о том что попал в таблицу лидеров
                        this.view.thisUser = this.userName;
                        this.view.usersScore = Math.round(this.score);
                        this.view.renderContent("addLeader");

                        leader = true; // что бы не сработал if ниже

                        // --> закрыть игру
                        setTimeout(() => this.view.start(false), 3000);

                        break;
                    }
                }

                // --> закрыть игру если в лидеры не попал
                if (!leader) setTimeout(() => this.view.start(false), 3000);
            }

            // отрисовать инфу на странице
            this.view.drawGameStatus(this.score, this.numberOfResources, this.levelComplete, this.gameOver,
                this.images.coin, this.images.score, this.images.up_01, this.images.up_02, this.images.wraith_01, this.images.reaper_Man_01, this.win);

        }



        // ------------------------ враги

        // создание, смещение, логика врага (тут и логика конца игры)
        this.handleEnemies = () => {

            for (let i = 0; i < this.enemies.length; i++) { // перебор массива врагов

                this.enemies[i].draw(); //отрисовка врага
                this.enemies[i].update(); // обновление состояния врага

                if (this.enemies[i].x < 0) { // игра заканчивается если противник дошел то левого края поля
                    this.gameOver = true;
                }
                if (this.enemies[i].health <= 0) { // если здоровье меньше или равно 0 - враг убит

                    // если будет сложно замени тут 15 на 10 (будет давать в 0.5 раза больше золота за килл), легко - 15 на 20
                    let geinedResources = Math.ceil(this.enemies[i].maxHealth / 15); // игрок получает ресурс в кол-ве 0.05 часть от здоровья противника 
                    let geinedScore = this.enemies[i].maxHealth / 10;
                    this.numberOfResources += geinedResources;
                    this.score += geinedScore; // игрок получает очки в кол-ве 0.1 часть от здоровья противника 

                    const findThisIndex = this.enemyPosition.indexOf(this.enemies[i].y) // ищет позицию убитого врага

                    // для анимации смерти
                    this.dyingEnemies.push(this.newDyingEnemies(this.enemies[i].x, this.enemies[i].y, this.enemies[i].image[0], this)) // добавить врага в массив убитых врагов

                    this.enemyPosition.splice(findThisIndex, 1); // удаляет позицию убитого врага
                    this.enemies.splice(i, 1); // удаляет убитого врага
                    i--; // корректирует счетчик цикла
                }
            }

            // скорость появления врагов, место, вид врага
            // враг 1 ур
            if (this.frame % this.enemiesInterval === 0 && this.score < this.winningScore) {

                if (this.levelGame === 1 || this.levelGame === 2 || this.levelGame === 3) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_01, 110, 0.1)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 4 || this.levelGame === 5 || this.levelGame === 6) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_01, 130, 0.1)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 7 || this.levelGame === 8 || this.levelGame === 9) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_01, 150, 0.1)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }

                // скорость появления противников
                if (this.enemiesInterval > 200) this.enemiesInterval -= 50;
            }

            // враг 2 ур
            if (this.frame !== 0 && this.frame % 350 === 0 && this.score < this.winningScore) {

                if (this.levelGame === 2 || this.levelGame === 3) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_02, 160, 0.15)) // добавить врага в массив (позиция, модель, img, здоровье, сила удара (60раз в секунду))
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 5 || this.levelGame === 6) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_02, 180, 0.15)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 8 || this.levelGame === 9) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_02, 200, 0.15)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }

            }

            // враг 3 ур
            if (this.frame !== 0 && this.frame % 590 === 0 && this.score < this.winningScore) {

                if (this.levelGame === 3) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.Orc_03, 210, 0.2)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 6) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.fallen_Angels_03, 230, 0.2)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }
                if (this.levelGame === 9) {
                    let verticalPosition = Math.floor(Math.random() * 4 + 3) * this.cellSize + this.cellGap; // 3 - т.к. контролбар занимает 3 ячейки, 4 - т.к. нужно что бы движение шло только по 4 полосам после контролбара 
                    this.enemies.push(this.newEnemy(verticalPosition, this, this.images.golem_03, 250, 0.2)) // добавить врага в массив
                    this.enemyPosition.push(verticalPosition); // добавить в массив позиции появления врага
                }

            }

        }

        // умирающие враги
        this.handleDyingEnemies = () => {

            for (let i = 0; i < this.dyingEnemies.length; i++) {
                this.dyingEnemies[i].draw();
                this.dyingEnemies[i].update();

                if (this.dyingEnemies[i].animDying) {

                    this.dyingEnemies.splice(i, 1); // вырезать с позиции i умершего противника
                    i--; // для корректировки индекса цикла
                }
            }
        }


        // ----------------------- защитники

        // функция создания и логики защитников (тут и стрельба и атака)
        this.handleDefenders = () => {

            for (let i = 0; i < this.defenders.length; i++) {
                this.defenders[i].draw(); // вызываю метод отрисовки защитника
                this.defenders[i].update();

                if (this.enemyPosition.indexOf(this.defenders[i].y) !== -1) { // если положение по высоте зашитника будет найдено в массиве врагов вернет 1 - значит враги на этой строке есть
                    this.defenders[i].shooting = true; // начать стрельбу
                } else {
                    this.defenders[i].shooting = false; // остановить стрельбу
                }

                for (let j = 0; j < this.enemies.length; j++) {

                    if (this.defenders[i] && this.collision(this.defenders[i], this.enemies[j])) { // если защитник и враг сталкиваются то:

                        this.enemies[j].movement = 0; // враг останавливается
                        this.defenders[i].health -= this.enemies[j].power; // у защитника отнимается здоровье в зависимости от силы врага
                        if (this.defenders[i].nameDefender === "reaper_Man") this.enemies[j].health -= this.defenders[i].powerCloseAtack; // у врвга отнимается здоровье в зависимости от атаки защитника
                    }

                    if (this.defenders[i] && this.defenders[i].health <= 0) { // если здоровье защитника меньше или равно 0, то вырезаем его из массыва защитников

                        // для анимации смерти
                        this.dyingDefenders.push(this.newDyingDefender(this.defenders[i].x, this.defenders[i].y, this.defenders[i].image[0], this)) // добавить защитника в массив убитых защитников

                        this.defenders.splice(i, 1); // вырезать с позиции i один элемент
                        i--; // для корректировки индекса цикла

                        for (let k = 0; k < this.enemies.length; k++) { // все враги продолжают двигаться, что бы не застревали если оба врага убили одного защитника
                            this.enemies[k].movement = this.enemies[k].speed;
                        }


                    }
                }
            }
        }

        // умирающие защитники
        this.handleDyingDefenders = () => {

            for (let i = 0; i < this.dyingDefenders.length; i++) {
                this.dyingDefenders[i].draw();
                this.dyingDefenders[i].update();

                if (this.dyingDefenders[i].animDying) { // еcли флаг animDying = true, то анимация смерти закончилась и можно удалить труп

                    this.dyingDefenders.splice(i, 1); // вырезать с позиции i умершего противника
                    i--; // для корректировки индекса цикла
                }
            }
        }

        // ------------------------- снаряды

        this.handleProjectiles = () => {
            for (let i = 0; i < this.projectiles.length; i++) { // перебирает массив снарядов и вызывает их методы перерисовки и смещения
                this.projectiles[i].update();
                this.projectiles[i].draw();

                for (let j = 0; j < this.enemies.length; j++) { // пребор массива врагов
                    if (this.enemies[j] && this.projectiles[i] && this.collision(this.projectiles[i], this.enemies[j])) { // если существует враг и снаряд проверяет их столкновение

                        this.enemies[j].health -= this.projectiles[i].power; // если столкнулись онять здоровье у врага на силу снаряда
                        this.projectiles.splice(i, 1); // вырезать снаряд из массива снарядов
                        i--; // сделать поправку счетчика
                    }
                }

                if (this.projectiles[i] && this.projectiles[i].x > this.canvasWidth - this.cellSize) { // если снаряд ударился о край канваса
                    this.projectiles.splice(i, 1); // вырезать снаряд из массива снарядов
                    i--; // для корректировки индекса цикла
                }
            }
        }

        // -------------------------- ресурсы

        this.handleResources = () => {

            if (this.frame % 500 === 0 && this.score < this.winningScore) { // если еще не выйграли, и на каждом 500ом кадре сознает реурс
                this.resources.push(this.newResource(this));
            }

            for (let i = 0; i < this.resources.length; i++) {

                this.resources[i].draw(); // отрисовка ресурсов
                this.resources[i].update();

                if (this.resources[i] && this.mouse.x && this.mouse.y && this.collision(this.resources[i], this.mouse)) { // если есть ресурс, мышь на канвасом, и координаты мышки сталкиваются с ресурсом - то забрать его и удалить из массива
                    if (this.gameStart) this.createGameSound("audio/resourse.mp3"); // звук улучшения защитника
                    this.numberOfResources += this.resources[i].amount;
                    this.resources.splice(i, 1);
                    i--; // поправка счетчика
                }
            }
        }

        // ---------------------------------------- Задний фон (горы с тучами)

        this.handlegameBackground = () => {
            this.gameBackground.draw();
            this.gameBackground.update();
        }

        // --------------------------------------------- ЗАПУСК МАШИНЫ
        this.animate = () => {

            this.blank(); // задний фон игрового поля
            this.view.drawControlsBar(this.controlsBar.width, this.controlsBar.height); // контролбар
            this.handleGameGrid(); // сетка поля
            this.handleNavGrid(); // сетка навбара

            this.handleDefenders(); // защитники
            this.handleDyingDefenders();
            this.handleProjectiles(); // снаряды
            this.handleEnemies(); // враги
            this.handleDyingEnemies();
            this.handleResources(); // ресурсы
            this.handleGameStatus(); // статус (выиграл\проиграл)
            this.frame++; // увеличение счетчика кадров

            if (!this.gameOver) { // пока флаг gameOver = false - игра продолжается
                this.animateID = requestAnimationFrame(this.animate);
            } else { // иначе сравнивает кол-во очков игрока с рейтингом очков и добавляет или нет результат в таблицу

                cancelAnimationFrame(this.animateID);
                this.score += (Math.ceil(this.numberOfResources / 10)); // добавить очки от оставшейся энергии
                this.numberOfResources = 0; // обнулить энергию
                let leader = false; // что бы не сработал или не сработал if ниже
                this.view.continueBlock(false) // задизейблить кнопку "продолжить"
                this.view.pause = false; // сообщаю вив о паузе что бы при ререндере в меню не сбрасывало кнопку продолжть

                for (let i = 0; i < this.arrUsers.length; i++) {
                    if (this.score > +this.arrUsers[i].points) { // если очки игрока больше чем хоть у удного из списка лидеров
                        // debugger
                        this.deleteUser(this.arrUsers[9].id); // удалить с сервера игрока с самым маленьким кол-вом очков

                        // --> добавить инфу игрока на сервер
                        this.addUser(this.userName, this.score);

                        // --> вызвать метод вью о том что попал в таблицу лидеров
                        this.view.thisUser = this.userName;
                        this.view.usersScore = this.score;
                        this.view.renderContent("addLeader");

                        leader = true; // что бы не сработал if ниже

                        // --> закрыть игру
                        setTimeout(() => this.view.start(false), 2000);

                        break;
                    }
                }

                // --> закрыть игру если в лидеры не попал
                if (!leader) setTimeout(() => this.view.start(false), 2000);
            }
        }

        this.animateBackground = () => {

            this.handlegameBackground(); // задний фон страницы
            this.frameBack++; // увеличение счетчика кадров
            requestAnimationFrame(this.animateBackground);

        }
    };

    // --------инициализация

    init() {
        this.createGrid();
        this.gameBackground = this.newGameBackground(this);
        this.animateBackground();
    }
    // ------------------------------------------------ ВНУТРЕННОСТИ МАШИНЫ --------------------------------

    // -------------------------------------------------- игровое поле

    newCell(x, y, model) {
        class Cell { // Класс который создаст ячейку сетки
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.width = model.cellSize;
                this.height = model.cellSize;
            }
            draw() {
                if (model.mouse.x && model.mouse.y && model.collision(this, model.mouse)) { // если мышка над полем канвас и над сеткой поля, рисует борт яцейки (пока убрал цвет - не красиво)
                    model.view.drawCell(this.x, this.y, this.width, this.height)
                }
            }
        }
        return new Cell(x, y, model)
    }

    newNavCell(x, y, model, button, img) {
        class NavCell { // Класс который создаст ячейку сетки
            constructor(x, y, model, button, img) {
                this.x = x;
                this.y = y;
                this.width = 50;
                this.height = 50;
                this.choice = false;
                this.isButton = button; // menu или pause
                this.imgButton = img;
            }
            draw() {
                // debugger
                // ячейки выбора персонажа
                if (model.mouse.x && model.mouse.y && model.collision(this, model.mouse) && !this.isButton) { // если мышка над полем канвас и над сеткой поля, рисует
                    model.view.drawNavCell(this.x, this.y, this.width, this.height, "white");
                }
                if (this.choice && !this.isButton) {
                    model.view.drawNavCell(this.x, this.y, this.width, this.height, "gold");
                }
                // ячейки кнопки меню
                if (this.isButton === "menu") {
                    this.choice ? model.view.drawNavButton(img, 60, 0, 60, 60, this.x, this.y, this.width, this.height) : model.view.drawNavButton(img, 0, 0, 60, 60, this.x, this.y, this.width, this.height);
                }
                if (this.isButton === "pause") {
                    this.choice ? model.view.drawNavButton(img, 60, 60, 60, 60, this.x, this.y, this.width, this.height) : model.view.drawNavButton(img, 0, 60, 60, 60, this.x, this.y, this.width, this.height);
                }
            }
        }
        return new NavCell(x, y, model, button, img)
    }

    // Создание сетки поля и создание ячее навбара
    createGrid() {
        for (let y = this.cellSize * 3; y < this.canvasHeight - this.cellSize; y += this.cellSize) { // y = cellSize, т.к. начинаю не сначала поля, после поля управления
            for (let x = 0; x < this.canvasWidth; x += this.cellSize) {
                this.gameGrid.push(this.newCell(x, y, this)); // добавляю в массив объекты с параметрами их расположения и методом отрисовки
            }
        }

        this.navGrid.push(this.newNavCell(300, 3, this, false, false)); // две ячейки навбара выбора героя (индекс 0)
        this.navGrid.push(this.newNavCell(300, 56, this, false, false)); // (индекс 1)
        this.navGrid[0].choice = true; // что бы изначально игрок видел какой защитник выбран

        this.navGrid.push(this.newNavCell(840, 3, this, "menu", this.images.nav_game_button)); // две ячейки навбара меню и пауза (индекс 2)
        this.navGrid.push(this.newNavCell(840, 56, this, "pause", this.images.nav_game_button)); // (индекс 3)
    }

    // ------------------------------------------------------ враги

    newEnemy(verticalPosition, model, img, health, power) {
        class Enemy {
            constructor(verticalPosition, model, img, health, power) {
                this.x = model.canvasWidth; // что бы появлялись за пределами канваса
                this.y = verticalPosition; // параметр определяется рандомом выше по по коду
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.speed = Math.random() * 0.2 + 0.4; // у врага случайная скорость движения
                this.movement = this.speed; // переменная для того что бы мог остановить врага (устанавливается на 0 при взоимодествии с защитником и наоборот соответственно)
                this.health = health; // здоровье врага
                this.maxHealth = this.health; // сохранение максимального здоровья для расчетов очков и наград
                this.power = power;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 0;
                this.image = [img, 30, 0, this.frameX, this.frameY, this.x, this.y, 90, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawEnemy(this.image, this.health);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX) + 20;
                this.image[2] = this.frameY * this.charFrameY;
                this.image[5] = this.x;
                this.image[6] = this.y;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    if (model.gameStart && this.charFrameY === 1) model.createGameSound("audio/fight_2.mp3"); // звук сражения (удара) защитника
                    this.charFrameX = 0;
                }

                // проверка столкновения с врагом (это тут для того что бы каждый враг мог влк/выкл анимацию защитника а не только первый столкувшийся враг, т.к сталкиваться могут стра несколько)
                for (let i = 0; i < model.defenders.length; i++) {
                    if (this.health > 0 && model.collision(this, model.defenders[i])) {
                        model.defenders[i].fight = true; // включить анимацию защитника
                    }
                    if (this.health <= 0 && model.collision(this, model.defenders[i])) {
                        model.defenders[i].fight = false; // выключить анимацию защитника
                    }
                }

                //--- атака
                if (this.movement === 0) {

                    this.charFrameY = 1;
                } else this.charFrameY = 0;

                //--- смещение
                this.x -= this.movement; // смещает врага влево
            }

        }
        return new Enemy(verticalPosition, model, img, health, power);
    }

    newDyingEnemies(x, y, img, model) {
        class DyingEnemy {
            constructor(x, y, img, model) {
                this.x = x;
                this.y = y;
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.animDying = false;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 2;
                this.image = [img, 20, 0, this.frameX, this.frameY, this.x, this.y, 90, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawDyingEnemy(this.image);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX) + 20;
                this.image[2] = (this.frameY * this.charFrameY) + 10;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.animDying = true; // если прошла отрисовка смерти, то вешается фраг и когда функция выше будет проходится по массиву мервых врагов, то увидит это флаг и удалит этого мертвого защитника
                }
            }

        }
        return new DyingEnemy(x, y, img, model);
    }
    // ---------------------------------------------------- защитники

    newDefender(x, y, model, name) {
        class Defender { // класс создания защитников дальнего боя
            constructor(x, y, model, name) {
                this.x = x;
                this.y = y;
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ

                this.nameDefender = name;
                this.shooting = false; // стреляет или нет
                this.health = 50; // кол-во здоровья
                this.projectiles = []; // массив снарядов
                this.imgProjectil = model.images.spellsEffect_1;
                this.timer = 0; // таймер выстрела(скорость стрельбы)
                this.powerAtack = 5; // сила атаки (дальный бой)
                this.level = 1; // уровень защитника
                this.costUp = 25; // стоимость улучшения

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 0;
                this.image = [model.images.wraith_01, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                if (model.gameStart) model.createGameSound("audio/wicher.mp3"); // звук создания защитника
            }

            draw() { // отрисовка защаитника

                model.view.drawDefender(this.image, this.health);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = this.frameX * this.charFrameX;
                this.image[2] = this.frameY * this.charFrameY;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.charFrameX = 0;
                }

                //--- стрельба

                if (this.shooting) { // если true но начинает увеличивать таймер и по определенным значениям добавлять снаряды

                    this.charFrameY = 1;
                    this.timer++;

                    if (this.timer % 66 === 0) { // как только сменится фрейм, то должно пройти 66 кадров чтобы анимация была на месте выстрела
                        model.projectiles.push(model.newProjectile(this.x + 55, this.y + 35, this.imgProjectil, this.powerAtack, model));
                        if (model.gameStart) model.createGameSound("audio/atack.mp3"); // звук выстрела
                    }

                } else {

                    this.timer = 0;
                    this.charFrameY = 0;
                }


            }

            // апгрейд защитника
            up() {
                if (this.level === 1 && model.numberOfResources >= this.costUp) {
                    model.numberOfResources -= this.costUp;
                    this.health += 15;
                    this.imgProjectil = model.images.spellsEffect_2;
                    this.powerAtack = 10;
                    this.level++;
                    this.image = [model.images.wraith_02, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                    if (model.gameStart) model.createGameSound("audio/update.mp3"); // звук улучшения защитника
                    return;
                }
                if (this.level === 2 && model.numberOfResources >= this.costUp) {
                    model.numberOfResources -= this.costUp;
                    this.health += 25;
                    this.imgProjectil = model.images.spellsEffect_3;
                    this.powerAtack = 15;
                    this.level++;
                    this.image = [model.images.wraith_03, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                    if (model.gameStart) model.createGameSound("audio/update.mp3"); // звук улучшения защитника
                    return;
                }
            }
        }

        class Defender_Two { // класс создания защитников ближнего боя
            constructor(x, y, model, name) {
                this.x = x;
                this.y = y;
                this.width = model.cellSize - model.cellGap * 2; // ширина ячейки минус двойной отступ
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ

                this.nameDefender = name;
                this.fight = false; // ближняя атака
                this.health = 80; // кол-во здоровья
                this.powerCloseAtack = 0.1 // сила атаки (ближний бой)
                this.level = 1; // уровень защитника
                this.costUp = 25; // стоимость улучшения

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 0;
                this.image = [model.images.reaper_Man_01, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                if (model.gameStart) model.createGameSound("audio/reaper_man.mp3"); // звук создания защитника
            }

            draw() { // отрисовка защаитника

                model.view.drawDefender(this.image, this.health);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = this.frameX * this.charFrameX;
                this.image[2] = this.frameY * this.charFrameY;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    if (model.gameStart && this.charFrameY === 1) model.createGameSound("audio/fight_1.mp3"); // звук сражения (удара) защитника
                    this.charFrameX = 0;
                }

                //--- атака

                if (this.fight) {
                    this.charFrameY = 1;
                } else {
                    this.charFrameY = 0;
                }


            }

            // апгрейд защитника
            up() {
                if (this.level === 1 && model.numberOfResources >= this.costUp) {
                    model.numberOfResources -= this.costUp;
                    this.health += 30;
                    this.powerCloseAtack = 0.15
                    this.level++;
                    this.image = [model.images.reaper_Man_02, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                    if (model.gameStart) model.createGameSound("audio/update.mp3"); // звук улучшения защитника
                    return;
                }
                if (this.level === 2 && model.numberOfResources >= this.costUp) {
                    model.numberOfResources -= this.costUp;
                    this.health += 60;
                    this.powerCloseAtack = 0.2
                    this.level++;
                    this.image = [model.images.reaper_Man_03, 0, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
                    if (model.gameStart) model.createGameSound("audio/update.mp3"); // звук улучшения защитника
                    return;
                }
            }


        }

        if (name === "wraith") {
            return new Defender(x, y, model, name);
        } else {
            return new Defender_Two(x, y, model, name);
        }
        // return new Defender(x, y, model, name)
    }

    newDyingDefender(x, y, img, model) {
        class DyingDefender {
            constructor(x, y, img, model) {
                this.x = x;
                this.y = y;
                this.height = model.cellSize - model.cellGap * 2; // высота ячейки минус двойной отступ
                this.animDying = false;

                this.frameX = 267.916667;
                this.frameY = 170;
                this.charFrameX = 0;
                this.charFrameY = 2;
                this.image = [img, 20, 0, this.frameX, this.frameY, this.x, this.y, 100, this.height];
            }

            draw() { // рисует врага и его здоровье
                model.view.drawDyingDefender(this.image);
            }

            update() {
                //--- анимация персанажа
                this.image[1] = (this.frameX * this.charFrameX);
                this.image[2] = (this.frameY * this.charFrameY);

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.animDying = true;
                }
            }

        }
        return new DyingDefender(x, y, img, model);
    }

    // клик по канвасу
    click(clickPosition) {
        //------------------ новый защитник или апгрейд
        if (clickPosition.y > this.controlsBar.availableHeight && clickPosition.y < this.canvasHeight - this.cellSize && this.navGrid[3].choice === false) { // клик был на игровой сетке И игра не на паузе
            this.createDefender(); // новый защитник или апгрейд (там примет решение)

            // ---- клик по защитнику (выбор)
        } else if (clickPosition.x > 300 && clickPosition.x < 350 && this.navGrid[3].choice === false) { // выбран wraith
            if (clickPosition.y > 3 && clickPosition.y < 53) {
                this.navGrid[0].choice = true; // меняю флаг выделения выбранного защитника
                this.navGrid[1].choice = false;
                this.choiceDefender = "wraith";
                if (this.gameStart) this.createGameSound("audio/click.mp3"); // звук нажатия на кнопки
            }
            if (clickPosition.y > 56 && clickPosition.y < 106) { // выбран reaper_Man
                this.navGrid[1].choice = true; // меняю флаг выделения выбранного защитника
                this.navGrid[0].choice = false;
                this.choiceDefender = "reaper_Man";
                if (this.gameStart) this.createGameSound("audio/click.mp3"); // звук нажатия на кнопки
            }
            // ---------меню в игре
        } else if (clickPosition.x > 840 && clickPosition.x < 890) {

            // выбрана кнопка меню
            if (clickPosition.y > 3 && clickPosition.y < 53) {
                this.navGrid[2].choice == true ? this.navGrid[2].choice = false : this.navGrid[2].choice = true; // меняю флаг выделения
                if (this.gameStart) this.createGameSound("audio/click.mp3"); // звук нажатия на кнопки
                this.gameStart = false; // флаг что игра на паузе

                // поставить на пузу
                this.navGrid[3].choice = true; // меняю флаг выделения
                this.view.pause = true; // сообщаю вив о паузе что бы при ререндере в меню не сбрасывало кнопку продолжть
                cancelAnimationFrame(this.animateID); // остановить анимацию, игра на паузе
                this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в активном состоянии
                this.view.continueBlock(true) // раздизейблить кнопку "продолжить"
                this.view.start(false); // спрятать игру и показать главное меню
            }

            // выбрана кнопка пауза
            if (clickPosition.y > 56 && clickPosition.y < 106) {
                if (this.navGrid[3].choice === false) {

                    this.navGrid[3].choice = true; // меняю флаг выделения
                    this.view.pause = true; // сообщаю вив о паузе что бы при ререндере в меню не сбрасывало кнопку продолжть
                    cancelAnimationFrame(this.animateID); // остановить анимацию, игра на паузе
                    this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в активном состоянии
                    if (this.gameStart) this.createGameSound("audio/click.mp3"); // звук нажатия на кнопки
                    this.gameStart = false; // флаг что игра на паузе
                } else {

                    // debugger
                    this.navGrid[3].choice = false; // меняю флаг выделения
                    this.view.pause = false; // сообщаю вив о репаузе что бы при ререндере в меню не сбрасывало кнопку продолжть
                    this.animateID = requestAnimationFrame(this.animate); // возобновить анимацию, игра не на паузе
                    this.gameStart = true; // флаг что игра продолжается
                    if (this.gameStart) this.createGameSound("audio/click.mp3"); // звук нажатия на кнопки
                }
            }
        }
    }

    createDefender() { // тут и стоимость защитника
        // debugger
        const gridPositionX = this.mouse.x - (this.mouse.x % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на ширину ячуйки (получу точное положение Х по сетке)
        const gridPositionY = this.mouse.y - (this.mouse.y % this.cellSize) + this.cellGap; // беру позицию мышки и отмаю остаток от деления на высоту ячуйки (получу точное положение У по сетке)
        if (gridPositionY < this.controlsBar.height || gridPositionY > this.canvasHeight - this.cellSize) return; // что бы нельзя было размещать на выше и ниже игрового поля

        for (let i = 0; i < this.defenders.length; i++) {
            if (this.defenders[i].x === gridPositionX && this.defenders[i].y === gridPositionY) {
                this.defenders[i].up();
                return; // если есть защитник с такими координатами, то произойдет его улучшение не позволит поставить еще одного наверх этого
            }
        }

        let defenderCost = 50; // Стоимость защитника

        if (this.numberOfResources >= defenderCost) { // если денег хватает то его добовляет в массив защитников 
            this.defenders.push(this.newDefender(gridPositionX, gridPositionY, this, this.choiceDefender));
            this.numberOfResources -= defenderCost; // вычесть стоимость защитника
        }
    }
    // ------------------------------------------------------ снаряды

    newProjectile(x, y, img, power, model) {
        class Projectile {
            constructor(x, y, img, power, model) {
                // debugger
                this.x = x;
                this.y = y;
                this.width = 20;
                this.height = 20;
                this.power = power;
                this.speed = 5;
            }
            update() {
                this.x += this.speed;
            }
            draw() {
                model.view.drawProjectile(img, this.x, this.y, this.width, this.height);
            }
        }
        return new Projectile(x, y, img, power, model);
    }

    // ------------------------------------------------------ ресурсы

    newResource(model) {
        class Resource { // класс создания ресурсов
            constructor(model) {
                this.x = Math.random() * (model.canvasWidth - model.cellSize); // ширина канваса минус одна ячейка сетки, что бы не появлялись за краем
                this.y = (Math.floor(Math.random() * 4) + 3) * model.cellSize + 25;
                this.width = model.cellSize * 0.6;
                this.height = model.cellSize * 0.6;
                this.amount = model.amounts[Math.floor(Math.random() * model.amounts.length)]; // рандом умножить на длинну массива сумм наград (это округлится и выйдет индекс для массива величины ресурса)

                this.frameX = 90;
                this.frameY = 90;
                this.charFrameX = 0;
                this.image = [model.images.coin, 0, 0, this.frameX, this.frameY, this.x, this.y, this.width, this.height];
            }
            draw() {
                model.view.drawResource(this.image, this.amount);
            }
            update() {
                //--- анимация бабла
                this.image[1] = this.frameX * this.charFrameX;

                if (this.charFrameX < 11 && model.frame % 6 === 0) {
                    this.charFrameX++;
                }
                if (this.charFrameX >= 11) {
                    this.charFrameX = 0;
                }
            }
        }
        return new Resource(model);
    }

    // задний фон окна страницы

    newGameBackground(model) {
        class GameBackground {
            constructor(model) {
                this.clouds_2_1_x = 0.5; // стартовое положение тучки 1
                this.clouds_2_2_x = 0.5; // стартовое положение тучки 2
                this.image_clouds_2_1 = [model.images.clouds_2_1]; // массив с изображением тучки 1
                this.image_clouds_2_2 = [model.images.clouds_2_2]; // массив с изображением тучки 2
                this.speed_1 = 0.5; // скорость движения тучки 1
                this.speed_2 = -0.5; // скорость движения тучки 2
            }

            draw() {
                this.image_clouds_2_1[1] = this.clouds_2_1_x; // добавляю в массив с изображением тучки 1, ее новое положение по Х
                this.image_clouds_2_2[1] = this.clouds_2_2_x; // добавляю в массив с изображением тучки 2, ее новое положение по Х
                // передаю все данные изображений во вью для отрисовки
                model.view.drawBackground(model.images.sky, this.image_clouds_2_1, model.images.rocks, model.images.clouds_2, this.image_clouds_2_2,
                    model.images.ground_1, model.images.ground_2, model.images.ground_3, model.images.plant);
            };

            update() {
                if (model.frameBack % 2 === 0) {
                    this.clouds_2_1_x += this.speed_1;
                    this.clouds_2_2_x += this.speed_2;
                }

                if (model.frameBack !== 0 && model.frameBack % 3800 === 0) {
                    this.speed_1 = this.speed_1 * -1;
                    this.speed_2 = this.speed_2 * -1;
                }
            };

        }

        return new GameBackground(model);

    }

    // ------------------------------------------------ ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ -------------------------


    // убнуление параметров уровня (метод помогает методу nextLevelGame)
    zeroingLevel() {
        this.defenders.length = 0; // массив защитников
        this.dyingDefenders.length = 0; // массив умирающих защитников
        this.enemies.length = 0; // массив врагов
        this.dyingEnemies.length = 0; // массив умирающийх врагов
        this.enemyPosition.length = 0; // массив местоположения врагов Y
        this.enemyPositionX.length = 0; // массив столкновения врагов с защитниками X
        this.projectiles.length = 0; // массив снарядов для защитников
        this.resources.length = 0; // массив ресурсов
    }

    // следующий уровень 

    nextLevelGame() {
        this.levelGame++;
        if (this.levelGame < 10) {
            switch (this.levelGame) {
                case 2:
                    // убнуление параметров уровня
                    this.zeroingLevel(); // убнуление параметров уровня
                    this.frame = 0; // обнуление счетчика кадров, что бы враги правильно появлялись
                    this.winningScore = this.score + 150; // увеличить кол-во очков требуемое для прохождения уровня
                    break;

                case 3:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 200;
                    break;

                case 4:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 250;
                    break;

                case 5:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 300;
                    break;

                case 6:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 350;
                    break;

                case 7:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 400;
                    break;

                case 8:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 450;
                    break;

                case 9:
                    this.zeroingLevel();
                    this.frame = 0;
                    this.winningScore = this.score + 500;
                    break;

                default:
                    break;
            }
        }
    }

    // расчет коллизий
    collision(first, second) { // функция коллизии столкновения
        if (!(first.x > second.x + second.width ||
                first.x + first.width < second.x ||
                first.y > second.y + second.height ||
                first.y + first.height < second.y)) {
            return true;
        };
    };

    // при ресайзе окна
    resize() {
        this.view.resize(); // обновление параметров размера канваса при ресайзе страницы
    }

    // переход между вкладками меню
    updateState() {
        // debugger
        // ---> проверка локал сторадж
        if (window.localStorage.getItem("Funny_Defenders_Undead") === null) {
            window.location.hash = "#getName";
            this.view.renderContent("getName"); // если раньше не посещал эту страницу, то при старте спрашиваю имя
        } else {
            let storageInfo = JSON.parse(window.localStorage.getItem("Funny_Defenders_Undead"));
            this.userName = storageInfo.name; // достать и сохранить имя игрока
            const hashPageName = window.location.hash.slice(1).toLowerCase(); // находит хэш и отрезает решетку
            this.view.renderContent(hashPageName);
        }
    }

    // старт игры (сброс параметров прошлой игры)

    start() {

        // обнуление переметров игры перед новым стартом
        this.navGrid[2].choice = false; // сбрасываю флаг выделения меню в игре
        this.navGrid[3].choice = false; // сбрасываю флаг выделения пауза в игре
        this.view.continueBlock(false) // задизейблить кнопку "продолжить"

        cancelAnimationFrame(this.animateID); // останавливаю анимацию игры перед новым запуском
        this.enemiesInterval = 600; // интервал появления врагов
        this.frame = 0; // кадры - как долго идет игра
        this.frameNextLevel = 0; // кадры - отсчет до запуска нового уровня
        this.numberOfResources = 300; // стартовое количество ресурсов игрока
        this.gameOver = false; // игрок проиграл
        this.levelComplete = false; // игрок прошёл уровень
        this.win = false; // игрок прошёл игру
        this.score = 0; // очки игрока
        this.levelGame = 1;
        this.winningScore = 100; // кол-во очков что бы враги перестали появляться и для перехода на след лвл


        this.gameGrid = []; // массив объектов (ячеек) игрового поля, с методом отрисовки
        this.defenders = []; // массив защитников
        this.dyingDefenders = []; // массив умирающих защитников
        this.enemies = []; // массив врагов
        this.dyingEnemies = []; // массив умирающийх врагов
        this.enemyPosition = []; // массив местоположения врагов
        this.projectiles = []; // массив снарядов для защитников
        this.resources = []; // массив ресурсов

        this.blank(); // заранее отрисовать задний фон игры (канвас), что бы со старта игы окно плавно появилось уже с картинкой
        this.view.start(true); // плавно отобразить окно с игрой
        this.gameStart = true; // флаг что игра началась
        this.view.pause = false;
        setTimeout(this.animate(), 1000); // запустить игру через 1 сек (это время на появления окна с игрой)
    }

    // продолжить
    continue () {

        this.navGrid[2].choice = false; // меняю флаг у обьекта ячейки кнопки, что бы изменился внешний вид кнопки в игре
        this.handleNavGrid(); // сетка навбара рисую еще раз что бы отрисовалась кнопка в  неактивном состоянии
        this.view.start(true); // появится канвас с игрой
        this.gameStart = true; // флаг что игра началась
    }

    // ------------------------------------------- СЕРВЕРНАЯ ЧАСТЬ ------------------------------------------


    // Удалить с сервера худшего игрока из таблицы лидеров
    deleteUser(id) {
        myAppDB.ref('users/' + `user_${id}}`).remove()
            .then(function () {
                console.log("Пользователь удален из коллеции users");
            })
            .catch(function (error) {
                console.error("Ошибка удаления пользователя: ", error);
            });
    }

    // Добавить на сервер результат игрока (при добалении использую только уникальные id, что бы избежать ошибок чтения и записи на сервере)
    addUser(username, points) {
        let randomID = Math.round(Math.random() * 1000000);
        myAppDB.ref('users/' + `user_${randomID}}`).set({
                username: `${username}`,
                points: `${points}`,
                id: randomID
            })
            .then(function (username) {
                console.log("Пользователь добавлен в коллецию users");
            })
            .catch(function (error) {
                console.error("Ошибка добавления пользователя: ", error);
            });
    }

    // Получить с сервера данные об игроках-лидерах
    getUsersList(model) {
        myAppDB.ref("users/").on("value", function (snapshot) { // отслеживание изменений (на сервере) в реальном времени
            model.updateUsersData(snapshot.val()); // тут приходит объект данными с сервера
        }, function (error) {
            console.log("Error: " + error.code);
        });
    }

    // Преобразовать полученные с сервера данные об игроках-лидерах
    updateUsersData(userList) {
        // debugger
        let arrKey = Object.keys(userList); // получаю ключи объекта, что того что бы по ним потом перебрать объект и создать массив значений для сортировки
        let usersData = []; // массив с лидерами (данные с сервера)

        for (let i = 0; i < arrKey.length; i++) {
            usersData.push(userList[`${arrKey[i]}`]); // создаю массив значений для сортировки
        }

        usersData.sort(function (a, b) { // сортирует массив с лидерами по их очкам от большего к меньшему
            if (+a.points < +b.points) {
                return 1;
            }
            if (+a.points > +b.points) {
                return -1;
            }
            // a должно быть равным b
            return 0;
        });

        this.arrUsers = usersData;
        console.log(this.arrUsers)

        // передать this.arrUsers во въюшку дял отображения списка

        this.view.users = this.arrUsers;
        this.updateState(); // там примет решение спрашивать ли имя игрока и откроет начальную страницу с "меню"
    }


    // ------------------------------------------------- ЗВУКИ ------------------------------------------------

    playAudioBack() {
        this.view.playAudioBack();
    }

    mutedAudioBack(stay) {
        this.view.mutedAudioBack(stay);
    }

    playAudioGame() {
        this.view.playAudioGame();
    }

    isMuted(stay) {
        this.view.isMuted(stay);
        this.view.closeSaund(stay);
    }

    createGameSound(src) {
        this.view.createGameSound(src);
    }

    loadAudio() {
        this.view.loadAudio();
    }
}