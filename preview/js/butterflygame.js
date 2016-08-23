
/* 
    Created on : Aug 2, 2016, 1:42:18 PM
    Author     : bug7a
*/

function ButterFlyGame(){};

ButterFlyGame.init = function() {
    
    Page.init();
    Map.init();
    Sound.init();
    Board.init();
    Player.init();
    Bug.init();

    //Start page in arka planını oyun olarak göster
    //Oyuncunun değerlerini resetle
    Player.clear();
    
    //Bölümü oluştur
    Level.createLevel(1);
    
    //Başlangıç sayfasını aç
    Page.show(Page.NAME.START);
    
    //Page.show(Page.NAME.GAME_WIN);
    ButterFlyGame.startGame();

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

    //for(var i = 0; i < 2; i++) {
        
        //böcekleri burada oluştur.
        myBug1ID =  Bug.createNewBug("bug1");
        myBug2ID =  Bug.createNewBug("bug2");
        
    //}


    //Bug.getBug(myBug1ID).moveTo("right");
    
};

window.addEventListener( 'load', ButterFlyGame.init, false );

