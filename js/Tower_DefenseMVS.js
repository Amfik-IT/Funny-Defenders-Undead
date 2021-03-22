"use strict";

import GameView from './view.js';
import GameModel from './model.js';
import GameController from './controller.js';

function init() {
    // глобальная инициализация
    const containerElem = document.getElementById("container");

    const canvas = document.createElement('canvas');
    canvas.setAttribute("id", "canvas1");
    const canvasBack = document.createElement('canvas');
    canvasBack.setAttribute("id", "background");
    containerElem.append(canvasBack);
    containerElem.append(canvas);

    const appGameView = new GameView(containerElem, canvas, canvasBack);
    const appGameModel = new GameModel(appGameView);
    const appGameController = new GameController(appGameModel, containerElem, canvas, canvasBack);

    //вызвать init-методы...
    appGameView.init();
    appGameModel.init();
    appGameController.init();

}

document.addEventListener("DOMContentLoaded", init()); // инициализируем модуль как только DOM готов.