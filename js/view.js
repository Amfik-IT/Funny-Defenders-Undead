export default class GameView {

    constructor(container, canvas, canvasBack) {
        this.container = container;
        this.canvas = canvas;

        this.ctx = this.canvas.getContext('2d');
        this.canvasWidth = 900;
        this.canvasHeight = 600;

        this.canvasBack = canvasBack;
        this.ctx_2 = this.canvasBack.getContext('2d');
        this.canvasBackPozition = container.getBoundingClientRect();
        this.users = null;
        this.thisUser = null;
        this.usersScore = null;
        this.audioBack = null;
        this.audioGame = null;
        this.muted = false;
        this.pause = false;

        // страничка с меню (главная)
        this.HomeComponent = {
            id: "menu",
            title: "Funny Defenders Undead",
            render: (className = "menu", ...rest) => {
                return `
                <section class="${className}">
                    <ul class="mainmenu__list">
                        <li><a class="new__game">Новая игра</a></li>
                        <li><a id="continue" class="continue save__true">Продолжить</a></li>
                        <li><a class="mainmenu__link" href="#rules">Правила игры</a></li>
                        <li><a class="mainmenu__link" href="#leaders">Таблица лидеров</a></li>
                        <li><span class="saund__off-top"></span><a id="sound" class="sound">Звук</a><span class="saund__off-bottom"></span></li>
                    </ul>
                </section>
              `;
            }
        };

        // страничка с провилами игры
        this.RulesComponent = {
            id: "rules",
            title: "Правила игры",
            render: (className = "menu", ...rest) => {
                return `
                <section class="${className}">
                    <a class="mainmenu__link back" href="#menu">Назад</a>
                    <div class="rules__text">
                    <p>В начале игры у вас есть стартовое количество темной материи для строительства защитников, а в процессе она будет появляться в случайних местах на поле битвы, и даваться за каждое убийство врага.</p>
                    <p>Расходуйте темную материю с умом, её остаток переходит на следующий уровень и очень там пригодится ;)</p><br>
                    <p>Что бы установить защитника, выберите его на панели навигации и кликните левой кнопкой мыши на участок поля где вы хотите его разместить.</p>
                    <p>Защитников можно улучшать - это сделает их сильнее! Для этого кликните по нему левой кнопкой мыши.</p><br> 
                    <p>Wraith - имеет одиночную, дальнюю атаку</p>
                    <p>Reaper Man - массовую, но вблизи врага.</p><br> 
                    <p>Игра будет окончена если противник доберется до противополжного края арены.</p><br> 
                    Удачной игры =)</div>
                </section>
              `;
            }
        };

        // страничка таблицы лидеров
        this.LeadersComponent = {
            id: "leaders",
            title: "Таблица лидеров",
            render: (className = "menu", ...rest) => {
                return `
                <section class="${className}">
                    <a class="mainmenu__link back" href="#menu">Назад</a>
                    <ul class="users">
                        <li class="user1">
                            <span class="name">1) ${this.users[0].username}</span>
                            <span class="points">${this.users[0].points}</span>
                        </li>
                        <li class="user2">
                            <span class="name">2) ${this.users[1].username}</span>
                            <span class="points">${this.users[1].points}</span>
                        </li>
                        <li class="user3">
                            <span class="name">3) ${this.users[2].username}</span>
                            <span class="points">${this.users[2].points}</span>
                        </li>
                        <li class="user4">
                            <span class="name">4) ${this.users[3].username}</span>
                            <span class="points">${this.users[3].points}</span>
                        </li>
                        <li class="user5">
                            <span class="name">5) ${this.users[4].username}</span>
                            <span class="points">${this.users[4].points}</span>
                        </li>
                        <li class="user6">
                            <span class="name">6) ${this.users[5].username}</span>
                            <span class="points">${this.users[5].points}</span>
                        </li>
                        <li class="user7">
                            <span class="name">7) ${this.users[6].username}</span>
                            <span class="points">${this.users[6].points}</span>
                        </li>
                        <li class="user8">
                            <span class="name">8) ${this.users[7].username}</span>
                            <span class="points">${this.users[7].points}</span>
                        </li>
                        <li class="user9">
                            <span class="name">9) ${this.users[8].username}</span>
                            <span class="points">${this.users[8].points}</span>
                        </li>
                        <li class="user10">
                            <span class="name">10) ${this.users[9].username}</span>
                            <span class="points">${this.users[9].points}</span>
                        </li>
                    </ul>
                </section>
              `;
            }
        };

        // страничка запроса имени игрока
        this.getNameComponent = {
            id: "name",
            title: "Имя игрока",
            render: (className = "menu", ...rest) => {
                return `
                <section class="${className}">
                    <p>Твое имя, герой:</p>
                    <input type="text" class="input__name" id="newUserName" name="username" placeholder="Введите имя" maxlength="10" required>
                    <a class="add__name" href="#menu">Ок</a>
                </section>
              `;
            }
        };

        // страничка сообщения о том что игрок попал в таблицу лидеров
        this.addLeadersComponent = {
            id: "newLeader",
            title: "Новый лидер",
            render: (className = "menu", ...rest) => {
                return `
                <section class="${className}">
                    <p>Встречайте нового героя!!!  <span>${this.thisUser}</span>  вы набрали <span>${this.usersScore}</span> очков  и попали в таблицу лидеров!</p>
                    <a class="new__leaders" href="#leaders">Я лучший =)</a>
                </section>
              `;
            }
        };

        this.router = {
            menu: this.HomeComponent,
            rules: this.RulesComponent,
            leaders: this.LeadersComponent,
            default: this.HomeComponent,
            addLeader: this.addLeadersComponent,
            getName: this.getNameComponent
        };

    };

    init() {
        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;
        this.canvasBack.width = this.canvasBackPozition.width;
        this.canvasBack.height = this.canvasBackPozition.height;
        let main = document.createElement('main');
        main.setAttribute("id", "main");
        this.canvasBack.after(main);
    }


    // задний фон игрового поля (арены)
    blank(img) {
        this.ctx.drawImage(img, 0, 0, this.canvasWidth, this.canvasHeight);
    }

    // контролбар
    drawControlsBar(width, height) {
        this.ctx.fillStyle = '#7d7d7d80';
        this.ctx.fillRect(0, 0, width, height);
    }

    // элементы статуса игрока
    drawGameStatus(score, numberOfResources, levelComplete, gameOver,
        imgCoin, imgScore, imgUp_01, imgUp_02, imgWraith, imgMan_01, win) {

        this.ctx.drawImage(imgScore, 20, 10, 50, 50); // иконка кубка (очки)
        this.ctx.drawImage(imgCoin, 0, 0, 90, 90, 20, 60, 50, 50); // иконка энергии
        this.ctx.drawImage(imgWraith, 20, 0, 267.916667, 180, 300, 3, 60, 50); // иконка защитника дальнего боя
        this.ctx.drawImage(imgMan_01, 20, 0, 267.916667, 180, 300, 56, 60, 50); // иконка защитника ближнего боя
        this.ctx.drawImage(imgUp_01, 0, 0, 100, 100, 430, 3, 50, 50); // иконка апгрейд 1
        this.ctx.drawImage(imgUp_01, 0, 0, 100, 100, 430, 56, 50, 50); // иконка апгрейд 1
        this.ctx.drawImage(imgUp_02, 0, 0, 100, 100, 560, 3, 50, 50); // иконка апгрейд 2
        this.ctx.drawImage(imgUp_02, 0, 0, 100, 100, 560, 56, 50, 50); // иконка апгрейд 2

        this.ctx.save();
        this.ctx.shadowColor = 'white';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 7;
        this.ctx.fillStyle = 'black';
        this.ctx.font = '50.5px RUSNeverwinter';
        this.ctx.globalAlpha = 0.8;

        this.ctx.fillText(`${Math.round(score)}`, 100, 45);
        this.ctx.fillText(`${numberOfResources} $`, 100, 90);
        this.ctx.restore();

        this.ctx.save();
        this.ctx.shadowColor = 'white';
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 7;
        this.ctx.fillStyle = 'black';
        this.ctx.font = '25.5px RUSNeverwinter';

        this.ctx.fillText(`50 xp`, 360, 15);
        this.ctx.fillText(`5 atc`, 360, 30);
        this.ctx.fillText(`50 $`, 360, 45);

        this.ctx.fillText(`80 xp`, 360, 70);
        this.ctx.fillText(`6 atc/s`, 360, 85);
        this.ctx.fillText(`50 $`, 360, 100);

        this.ctx.fillText(`+15 xp`, 490, 15);
        this.ctx.fillText(`10 atc`, 490, 30);
        this.ctx.fillText(`25 $`, 490, 45);

        this.ctx.fillText(`+30 xp`, 490, 70);
        this.ctx.fillText(`9 atc/s`, 490, 85);
        this.ctx.fillText(`25 $`, 490, 100);

        this.ctx.fillText(`+25 xp`, 620, 15);
        this.ctx.fillText(`15 atc`, 620, 30);
        this.ctx.fillText(`25 $`, 620, 45);

        this.ctx.fillText(`+60 xp`, 620, 70);
        this.ctx.fillText(`12 atc/s`, 620, 85);
        this.ctx.fillText(`25 $`, 620, 100);

        this.ctx.restore();


        if (gameOver) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Lineage2Font';
            this.ctx.fillText(`Game Over`, 350, 330)
        }
        if (levelComplete && !win) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Lineage2Font';
            this.ctx.fillText(`Level Complete`, 300, 330)
        }
        if (win) {
            this.ctx.fillStyle = 'black';
            this.ctx.font = '50px Lineage2Font';
            this.ctx.fillText(`!!! You're a winner !!!`, 250, 330)
        }
    }

    // враги
    drawEnemy(i, health) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);

        // шкала здоровья
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.77)';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 80, i[6] + 60);
        this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 5)) + 10); // ПИШИ КОМЕНТЫ СРАЗУ!!!! (дичь)
        this.ctx.stroke();

        this.ctx.strokeStyle = 'red';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 80, i[6] + 60);
        this.ctx.lineTo(i[5] + 80, i[6] + (50 - (health / 5)) + 10);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // отрисовка анимации смерти врага
    drawDyingEnemy(i) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
    }

    // сетка игрового поля
    drawCell(x, y, width, height) {
        this.ctx.strokeStyle = 'transparent'; // пока убрал (не нравился цвет =\ )
        this.ctx.strokeRect(x, y, width, height);
    }

    // сетка навбара
    drawNavCell(x, y, width, height, color) {
        this.ctx.strokeStyle = `${color}`;
        this.ctx.strokeRect(x, y, width, height);
    }

    drawNavButton(img, sx, sy, sw, sh, wx, wy, ww, wh) {
        // debugger
        this.ctx.drawImage(img, sx, sy, sw, sh, wx, wy, ww, wh);
    }

    // защитники
    drawDefender(i, health) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);

        // шкала здоровья
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(0,0,0,0.77)';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 5.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 20, i[6] + 60);
        this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 5)) + 10);
        this.ctx.stroke();

        this.ctx.strokeStyle = 'green';
        this.ctx.lineCap = 'round';
        this.ctx.lineWidth = 3.5;
        this.ctx.beginPath();
        this.ctx.moveTo(i[5] + 20, i[6] + 60);
        this.ctx.lineTo(i[5] + 20, i[6] + (50 - (health / 5)) + 10);
        this.ctx.stroke();
        this.ctx.restore();
    }

    // отрисовка анимации смерти защитника
    drawDyingDefender(i) {
        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
    }

    // снаряды
    drawProjectile(img, x, y, width, height) {
        this.ctx.drawImage(img, x, y, width, height);
    }

    // ресурсы
    drawResource(i, amount) {

        this.ctx.drawImage(i[0], i[1], i[2], i[3], i[4], i[5], i[6], i[7], i[8]);
    }

    // отрисовка анимированного заднего фона стартовой страницы
    drawBackground(sky, arr_clouds_2_1, rocks, clouds_2, arr_clouds_2_2, ground_1,
        ground_2, ground_3, plant) {
        // debugger
        this.ctx_2.drawImage(sky, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(arr_clouds_2_1[0], arr_clouds_2_1[1], 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(rocks, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(clouds_2, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(arr_clouds_2_2[0], arr_clouds_2_2[1], 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(ground_1, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(ground_2, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(ground_3, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
        this.ctx_2.drawImage(plant, 0, 0, this.canvasBackPozition.width, this.canvasBackPozition.height);
    }

    // ------------------------------------------ звуки ------------------------------

    playAudioBack() {

        this.audioBack = new Audio();

        // проверка поддерживаемого формата браузером
        if (this.audioBack.canPlayType("audio/mp3") == "probably") {
            this.audioBack.src = "audio/rage-zone-k1.mp3"
        } else this.audioBack.src = "audio/rage-zone-k1.ogg"

        // this.audioBack.setAttribute('id', 'audioBack');
        this.audioBack.loop = true;
        this.audioBack.autoplay = true;
        this.audioBack.volume = 0.3;
        // console.log(this.audioBack.canPlayType("audio/mp3"));
    }

    mutedAudioBack(stay) {
        // debugger
        // this.audioBack.pause();
        // this.audioBack.currentTime = 0.0;
        this.audioBack.muted = stay;
    }

    playAudioGame() {

        if (!this.pause) { // если игра не на паузе, то начнет играть трек с нуля, если нет то продолжит не с нуля

            this.audioGame = new Audio();

            // проверка поддерживаемого формата браузером
            if (this.audioGame.canPlayType("audio/mp3") == "probably") {
                this.audioGame.src = "audio/rage-zone-hierarchy&quad&masterkey.mp3"
            } else this.audioGame.src = "audio/rage-zone-hierarchy&quad.ogg"

            // this.audioGame.setAttribute('id', 'audioGame');
            this.audioGame.loop = true;
            this.audioGame.autoplay = true;
            this.audioGame.volume = 0.3;
            if (this.muted) this.mutedAudioGame(true);
            if (!this.muted) this.mutedAudioBack(true);

        } else {
            this.mutedAudioGame(false);
            if (this.muted) this.mutedAudioGame(true);
            if (!this.muted) this.mutedAudioBack(true);
        }
    }

    mutedAudioGame(stay) {
        // this.audioGame.currentTime = 0.0;
        this.audioGame.muted = stay;
    }

    isMuted(stay) {
        this.muted = stay;
    }

    closeSaund(stay) {

        let closeButton = this.container.querySelector('.sound');
        let spanCloseTop = this.container.querySelector('.saund__off-top');
        let spanCloseBottom = this.container.querySelector('.saund__off-bottom');
        if (stay) {

            closeButton.classList.toggle('red');
            setTimeout(() => {
                spanCloseTop.style.opacity = '1';
                spanCloseTop.style.transform = "rotate(45deg) translateX(50%)";
            }, 700);
            setTimeout(() => {
                spanCloseBottom.style.opacity = '1';
                spanCloseBottom.style.transform = "rotate(-45deg) translateX(50%)";
            }, 700);
            spanCloseTop.animate([
                // keyframes
                {
                    transform: "rotate(0deg) translateX(50%)",
                    opacity: 0
                },
                {
                    transform: "rotate(45deg) translateX(50%)",
                    opacity: 1
                }
            ], {
                // timing options
                duration: 700,
                iterations: 1
            })

            spanCloseBottom.animate([
                // keyframes
                {
                    transform: "rotate(0deg) translateX(50%)",
                    opacity: 0
                },
                {
                    transform: "rotate(-45deg) translateX(50%)",
                    opacity: 1
                }
            ], {
                // timing options
                duration: 700,
                iterations: 1
            })

        } else if (!stay) {
            // debugger
            closeButton.classList.toggle('red');
            setTimeout(() => {
                spanCloseTop.style.opacity = '0';
                spanCloseTop.style.transform = "rotate(0deg) translateX(50%)";
            }, 700);
            setTimeout(() => {
                spanCloseBottom.style.opacity = '0';
                spanCloseBottom.style.transform = "rotate(0deg) translateX(50%)";
            }, 700);
            spanCloseTop.animate([
                // keyframes
                {
                    transform: "rotate(45deg) translateX(50%)",
                    opacity: 1
                },
                {
                    transform: "rotate(0deg) translateX(50%)",
                    opacity: 0
                }
            ], {
                // timing options
                duration: 700,
                iterations: 1
            })

            spanCloseBottom.animate([
                // keyframes
                {
                    transform: "rotate(-45deg) translateX(50%)",
                    opacity: 1
                },
                {
                    transform: "rotate(0deg) translateX(50%)",
                    opacity: 0
                }
            ], {
                // timing options
                duration: 700,
                iterations: 1
            })
        }
    }

    createGameSound(src) {
        if (!this.muted) {
            let audio = new Audio();
            audio.src = `${src}`;
            src === "audio/update.mp3" || src === "audio/wicher.mp3" ? audio.volume = 0.2 : audio.volume = 0.3;
            audio.autoplay = true;
            // audio.volume = 0.3;
        }
    }

    loadAudio() {
        let atack = new Audio('audio/atack.mp3');
        atack.preload = "auto";
        let click = new Audio('audio/click.mp3');
        click.preload = "auto";
        let fight_1 = new Audio('audio/fight_1.mp3');
        fight_1.preload = "auto";
        let fight_2 = new Audio('audio/fight_2.mp3');
        fight_2.preload = "auto";
        let rageZoneHierarchy = new Audio('audio/rage-zone-hierarchy&quad&masterkey.mp3');
        rageZoneHierarchy.preload = "auto";
        let rageZoneK1 = new Audio('audio/rage-zone-k1.mp3');
        rageZoneK1.preload = "auto";
        let reaperMan = new Audio('audio/reaper_man.mp3');
        reaperMan.preload = "auto";
        let resourse = new Audio('audio/resourse.mp3');
        resourse.preload = "auto";
        let update = new Audio('audio/update.mp3');
        update.preload = "auto";
        let wicher = new Audio('audio/wicher.mp3');
        wicher.preload = "auto";
    }

    // ------------------------------------------------- вспомогательные методы

    // обновление параметров размера канваса при ресайзе страницы
    resize() {
        this.canvasBackPozition = container.getBoundingClientRect();
        this.canvasBack.width = this.canvasBackPozition.width;
        this.canvasBack.height = this.canvasBackPozition.height;
    }

    // отобразить контент на странице(запрос имени, меню и т.д) SPA
    renderContent(hashPageName) {

        let routeName = "default";

        if (hashPageName.length > 0) {
            routeName = hashPageName in this.router ? hashPageName : "error"; // добавь страничку с ошибкой!!!
        }

        window.document.title = this.router[routeName].title;
        let main = document.querySelector("#main");
        main.innerHTML = this.router[routeName].render(`${routeName}-page menuWindow`);
        main.style.opacity = 1; // для палвного появления окна main

        // для палвного появления окон меню (выкидываю из стека задач, что бы сначало успело отрендерить вкладку)
        setTimeout(() => {
            // debugger
            let sectionСhoice = main.querySelector(`.${routeName}-page`);
            sectionСhoice !== null ? sectionСhoice.style.opacity = 1 : main.querySelector(`.addLeader-page`).style.opacity = 1;
            // if (routeName !== "default") {
            //     debugger
            //     let sectionСhoice = main.querySelector(`.${routeName}-page`);
            //     sectionСhoice.style.opacity = 1;
            // } else {
            //     debugger
            //     let sectionСhoice = main.querySelector(`.menu-page`);
            //     sectionСhoice.style.opacity = 1;
            // }
        }, 0);

        if (routeName === "menu" && this.muted) this.closeSaund(true); // для блока кнопки музыка при переходе между вкладками
        if (routeName === "menu" && this.pause) this.continueBlock(true); // для разблока кнопки продолжить при переходе между вкладками
    }

    // start / end 
    start(stay) {

        if (stay) {

            this.canvas.classList.toggle('show');
            setTimeout(this.canvas.style.opacity = '1', 1000);
            this.canvas.animate([
                // keyframes
                {
                    opacity: 0
                },
                {
                    opacity: 1
                }
            ], {
                // timing options
                duration: 1000,
                iterations: 1
            })

        } else {
            if (!this.muted) this.mutedAudioBack(false);
            if (!this.muted) this.mutedAudioGame(true);

            setTimeout(this.canvas.style.opacity = '0', 1000);
            this.canvas.animate([
                // keyframes
                {
                    opacity: 1
                },
                {
                    opacity: 0
                }
            ], {
                // timing options
                duration: 1000,
                iterations: 1
            })
            this.canvas.classList.toggle('show');
        }

    }

    // снять блок с кнопки "продолжить"
    continueBlock(stay) {
        let continueButton = this.container.querySelector(".continue");
        stay ? continueButton.classList.remove("save__true") : continueButton.classList.add("save__true");
    }

}