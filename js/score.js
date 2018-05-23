'use strict';
// scoreboard
// object has name and scores (maybe times enemies got killed, bullets shot, etc)

var allPlayer = [];

function createTable() {
    function BaseScore(name, score) {
        this.name = name;
        this.score = score;
        allPlayer.push(this);
    }

    new BaseScore("bob", 1000000);
    new BaseScore("andy", 10000);
    new BaseScore("ryan", 100);
    new BaseScore("sarah", 10);
    new BaseScore("jill", 1);
    new BaseScore("mary", 20);
}
function fillTable() {
    var cells = document.getElementById('score');
    var newTr = document.createElement('tr');
    var th = document.createElement('th');
    var th2 = document.createElement('th');

    
    th.textContent = 'Name';
    th2.textContent = 'Score';
    newTr.append(th);
    newTr.append(th2);
    cells.append(newTr);
    
    for (var i = 0; i < 5; i++) {
        
        var newTr = document.createElement('tr');
        var newTd = document.createElement('td');
        var newTd2 = document.createElement('td');

        document.createElement('tr');
        newTd.textContent = allPlayer[i].name;
        newTd2.textContent = allPlayer[i].score;


        newTr.append(newTd);
        newTr.append(newTd2);

        cells.append(newTr);
    }
}
//Make sure to cal functions above
createTable();
fillTable();
//CREATE A FORM WITH EVENT LISTENER
