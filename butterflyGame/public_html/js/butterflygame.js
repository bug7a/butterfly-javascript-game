/* global Map */

function ButterFlyGame(){};

ButterFlyGame.init = function() {
    
    Page.init();
    Map.init();
    Sound.init();
    Board.init();
    Player.init();
    
    //Page.show(Page.NAME.GAME_OVER);

};

ButterFlyGame.startGame = function(){
    
    //Önce game sayfasına git
    Page.show(Page.NAME.GAME);
    
    //Oyuncunun değerlerini resetle
    Player.clear();
    
    //Bölümü oluştur
    Level.createLevel(1);
    
};

window.addEventListener( 'load', ButterFlyGame.init, false );

