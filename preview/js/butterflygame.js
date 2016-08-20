/* global Map */

function ButterFlyGame(){};

ButterFlyGame.init = function() {
    
    Page.init();
    Map.init();
    Sound.init();
    Board.init();
    Player.init();

    //Start page in arka planını oyun olarak göster
    //Oyuncunun değerlerini resetle
    Player.clear();
    
    //Bölümü oluştur
    Level.createLevel(1);
    
    //Başlangıç sayfasını aç
    Page.show(Page.NAME.START);
    
    //Page.show(Page.NAME.GAME_WIN);
    

};

ButterFlyGame.startGame = function(){
    
    //Önce game sayfasına git
    Page.show(Page.NAME.GAME);
    
    //Oyuncunun değerlerini resetle
    Player.clear();
    
    //Bölümü oluştur
    Level.createLevel(1);
    
    //Oyuncunun ok tuşlarını aktif yap
    Player.active(1);
    
};

window.addEventListener( 'load', ButterFlyGame.init, false );

