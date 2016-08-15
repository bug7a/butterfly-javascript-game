/* global Map */

function ButterFlyGame(){};

ButterFlyGame.init = function() {
    
    Board.init();
    Player.init();
    Level.createLevel(1);

};



window.addEventListener( 'load', ButterFlyGame.init, false );

