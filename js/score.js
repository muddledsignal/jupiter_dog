'use strict';
// scoreboard
// object has name and scores (maybe times enemies got killed, bullets shot, etc)

var allPlayer = [];


function BaseScore(name, score) {
    this.name = name;
    this.score =score;
    allPlayer.push(this);
}

new BaseScore("bob", 1000000);
new BaseScore("andy", 10000);
new BaseScore("ryan", 100);
new BaseScore("sarah", 10);
new BaseScore("jill", 1);
new BaseScore("mary", 20);

var cells = document.getElementById('score');

for (var i = 0; i < 5; i++){
    var newTr = document.createElement('tr');
    var newTd = document.createElement('td');
    var newTd2 = document.createElement('td');

    newTd.textContent = allPlayer[i].name;
    newTd2.textContent = allPlayer[i].score;

    newTr.appendChild(newTd);
    newTr.appendChild(newTd2);

    cells.appendChild(newTr);
}
