var Game = {
    display: null,
    map: {},
    engine: null,
    player: null,
    pedro: null,
    ananas: null,
    gameText: null,
    gameState: 0,
    food: 0,
    gameRound: 0,
    timer: 0,
    songs: {},
    init: function() {
        $("#DedicationDiv").fadeOut(2000);
        $("#MainDiv").fadeOut(0);
        $("#MainDiv").fadeIn(2000);
        Game.display = new ROT.Display({spacing:1.1});
        document.body.appendChild(this.display.getContainer());
        
        this._drawMenu();
        //this._startGame();
    },
    _startGame: function ()  {
        $("#gameScreen").append(this.display.getContainer());
        //todo load these
        Game.display.clear();
        //$("#youTube").attr("src","http://www.youtube.com/embed/e-63LbM89MM?autoplay=1&modestbranding=1&rel=0&fs=0&disablekb=1");
        //$("#youTube").attr("src","http://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/154798838&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false&amp;visual=true");
        $("#youTube").attr("src","https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/175780874&amp;auto_play=true&amp;hide_related=false&amp;show_comments=false&amp;show_user=true&amp;show_reposts=false&amp;visual=false");
        this._generateMap();
        var time = 100;
        this.gameState = 1;
        var self = this;
        timer = window.setInterval(function() {

            if(time>0){
            time--;
            var timeString =  time.toString();
            $("#gameTime").text(timeString);
            }
            else
            {
                //alert("game over - time out")
                console.log("game over - time out");
            }
        }, 1000);

        var scheduler = new ROT.Scheduler.Simple();
        scheduler.add(this.player, true);
        scheduler.add(this.pedro, true);

        this.engine = new ROT.Engine(scheduler);
        this.engine.start();
    },
     _drawMenu: function () {
        //this.display.clear();
        Game.display.clear();
        var menuArray = GameText._menu();
        Game.display.drawText(1,1, menuArray[0]);
        Game.display.drawText(1,2, menuArray[1]);
        Game.display.drawText(1,3, menuArray[2]);
        Game.display.drawText(1,4, menuArray[3]);
        Game.display.drawText(1,5, menuArray[4]);
        Game.display.drawText(1,6, menuArray[5]);

        window.addEventListener("keydown", this);
        
    },
    _displayHelp: function () {
        //this.display.clear();
        //this.display.clear();
        //gameText = new GameText();
        Game.display.clear();
        Game.display.drawText(1,1, "%c{yellow}ROGUE1");
        Game.display.drawText(1,2, GameText._help());
        
        Game.display.drawText(1,4, "Press [4] to go back to Menu");
        
        //alert("hey");
        window.addEventListener("keydown", this);
        
    },
    _displayAbout: function () {
        //this.display.clear();
        //this.display.clear();
        Game.display.clear();
        Game.display.drawText(1,1, "%c{yellow}ROGUE1");
        Game.display.drawText(1,2, GameText._about());
       
        GGame.display.drawText(1,4, "Press [4] to go back to Menu");
        
        //alert("hey");
        window.addEventListener("keydown", this);
        
    },
    handleEvent: function (e) {

    //This is the game menu event handler
    //this.display.clear(); 
    var code = e.keyCode;
    //alert(code);
    console.log(code);
    switch(code)
        {
        case 49:
            //window.removeEventListener("keydown",this);
            this._startGame();
            break;
        case 50://2
            this._displayHelp();
            break;
        case 51://3
            this._displayAbout();
            break;
        case 52://4
            this._drawMenu();
            break;
        }
    },
    _sleep: function(milliseconds) {
      var start = new Date().getTime();
      for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds){
          break;
        }
      }
    },
    _update: function() {
        this.time--;
        var timeString =  this.time.toString();
        $("#gameTime").text(timeString);
    },
    _generateMap: function() {
        var digger = new ROT.Map.Digger();
        var freeCells = [];
        
        var digCallback = function(x, y, value) {
            if (value) { return; }
            
            var key = x+","+y;
            this.map[key] = ".";
            freeCells.push(key);
        }
        digger.create(digCallback.bind(this));
        
        this._generateBoxes(freeCells);
        this._generateWeapons(freeCells);
        this._drawWholeMap();
        
        this.player = this._createBeing(Player, freeCells);
        this.pedro = this._createBeing(Pedro, freeCells);
    },
    
    _createBeing: function(what, freeCells) {
        var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
        var key = freeCells.splice(index, 1)[0];
        var parts = key.split(",");
        var x = parseInt(parts[0]);
        var y = parseInt(parts[1]);
        return new what(x, y);
    },
    
    _generateBoxes: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "*";
            if (!i) { this.ananas = key; } /* first box contains an ananas */
        }
    },
    _generateWeapons: function(freeCells) {
        for (var i=0;i<10;i++) {
            var index = Math.floor(ROT.RNG.getUniform() * 100);
            var key = freeCells.splice(index, 1)[0];
            this.map[key] = "w";
            if (!i) { this.ananas = key; } /* first box contains an ananas */
        }
    },
    
    _drawWholeMap: function() {
        for (var key in this.map) {
            var parts = key.split(",");
            var x = parseInt(parts[0]);
            var y = parseInt(parts[1]);
            var tile = this.map[key];
            //todo based on tile draw the color unless we have the value from the map item
            this.display.draw(x, y, this.map[key]);
        }
    }
};

var Player = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
    
Player.prototype.getSpeed = function() { return 100; }
Player.prototype.getX = function() { return this._x; }
Player.prototype.getY = function() { return this._y; }

Player.prototype.act = function() {
    Game.engine.lock();
    window.addEventListener("keydown", this);
}
    
Player.prototype.handleEvent = function(e) {
    if (this.gameState == 2)
        return;

    var code = e.keyCode;
    if (code == 13 || code == 32) {
        this._checkBox();
        return;
    }

    $("#gameText").text(this.food);
    this.gameRound++;
    //Game.display.draw(10,10,this.food);
    if (this.gameRound%10==0)
    {
        this.food--;
        if (this.food < 0)
        {
            $("#gameText").text("You ran out of food.");
            this.gameState = 2;
        }
        else
        {
            $("#gameText").text("food"+this.food);
        }
    }
    
    var code = e.keyCode;
    //alert(code);
    if (code == 52) {
        if (confirm("Do you want to quit?")){
        //alert(quit);
        Game._drawMenu();
        }
        //return;
    }

    var keyMap = {};
    keyMap[38] = 0;
    keyMap[33] = 1;
    keyMap[39] = 2;
    keyMap[34] = 3;
    keyMap[40] = 4;
    keyMap[35] = 5;
    keyMap[37] = 6;
    keyMap[36] = 7;

    /* one of numpad directions? */
    if (!(code in keyMap)) { return; }

    /* is there a free space? */
    var dir = ROT.DIRS[8][keyMap[code]];
    var newX = this._x + dir[0];
    var newY = this._y + dir[1];
    var newKey = newX + "," + newY;
    if (!(newKey in Game.map)) { return; }

    Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
    this._x = newX;
    this._y = newY;
    this._draw();

    window.removeEventListener("keydown", this);
    Game.engine.unlock();
}

Player.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "@", "#ff0");
}
    
Player.prototype._checkBox = function() {
    var key = this._x + "," + this._y;
    this.gameRound
    if (Game.map[key] == "w") {
        $("#gameText").text("Food");
        this.food++;
    }else if (Game.map[key] != "*") {
        $("#gameText").text("There is no box here!");
    } else if (key == Game.ananas) {
        $("#gameText").text("Hooray! You found an ananas and won this game.");
        this.gameState = 2;
        Game.engine.lock();
        window.removeEventListener("keydown", this);
    } 
    else {
        $("#gameText").text("This box is empty :-(");
    }
}
    
var Pedro = function(x, y) {
    this._x = x;
    this._y = y;
    this._draw();
}
    
Pedro.prototype.getSpeed = function() { return 100; }
    
Pedro.prototype.act = function() {
    var x = Game.player.getX();
    var y = Game.player.getY();

    var passableCallback = function(x, y) {
        return (x+","+y in Game.map);
    }
    var astar = new ROT.Path.AStar(x, y, passableCallback, {topology:4});

    var path = [];
    var pathCallback = function(x, y) {
        path.push([x, y]);
    }
    astar.compute(this._x, this._y, pathCallback);

    path.shift();
    if (path.length == 1) {
        Game.engine.lock();

        console.log("game over - time out Game over - you were captured by Pedro!");
        clearInterval(timer);
        //this._sleep(1000);
        Game._drawMenu();
        this.gameState = 2;
    } else {
        x = path[0][0];
        y = path[0][1];
        Game.display.draw(this._x, this._y, Game.map[this._x+","+this._y]);
        this._x = x;
        this._y = y;
        this._draw();
    }
}
    
Pedro.prototype._draw = function() {
    Game.display.draw(this._x, this._y, "P", "red");
}    


window.onload = function () {
    // Check if rot.js can work on this browser
    if (!ROT.isSupported()) {
        $("#gameText").text("The rot.js library isn't supported by your browser.");
    }
    else {
        Game.init();
    }
}
//todo next branch lets get the color into the map so instead of "*" we used "*,red" etc...
    