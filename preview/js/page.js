function Page() {};

Page.NAME = {};
Page.NAME.START = "start";
Page.NAME.GAME = "game";
Page.NAME.GAME_OVER = "gameover";
Page.NAME.GAME_WIN = "gamewin";

Page.startPageElement = "";
Page.gameOverPageElement = "";
Page.gameWinPageElement = "";


//başlangıçta çalışacak fonksiyonum
Page.init = function(){
    
    Page.startPageElement = document.getElementById("start-page");
    Page.gameOverPageElement = document.getElementById("game-over-page");
    Page.gameWinPageElement = document.getElementById("game-win-page");
    
};

//id si verilen sayfayı göster
Page.show = function($pageName){
    
    //Tüm sayfaları kapat
    Page.hideAll();
    
    //Değişkeni bulunduğumuz sayfa olarak güncelle
    Global.selectedPage = $pageName;
    
    //ismi verilen sayfayı görünür yap.
    switch($pageName){
        
        case Page.NAME.START:

            //Player oklar ile yönetilemesin
            Player.active(0);
            
            Page.startPageElement.style.display = "block";
            break;
            
        case Page.NAME.GAME_OVER:
            Page.gameOverPageElement.style.display = "block";
            break;
            
        case Page.NAME.GAME_WIN:
            document.getElementById("game-win-description").innerHTML = "Oyunu " + Global.playerScore + " puanla tamamladınız.";
            Page.gameWinPageElement.style.display = "block";
            break;
            
        case Page.NAME.GAME:
            //hiç bir iş yapma
            break;
        
    }
    
};

//Tüm sayfaları kapatır
Page.hideAll = function(){
    
    Page.startPageElement.style.display = "none";
    Page.gameOverPageElement.style.display = "none";
    Page.gameWinPageElement.style.display = "none";
    
};

//Start sayfasındaki oyuncu seçme butonları basıldığında çağırılacak fonksiyon
Page.playerSelectBtnClicked = function($playerName) {
    
    //Önceki seçilen butonun seçimini temizle
    document.getElementById(Global.selectedPlayerName + "-btn").setAttribute("class", "start-page-player-btn");
    
    //Yeni seçilen oyunucunun ismini değişkene kaydet
    Global.selectedPlayerName = $playerName;
    
    //Yeni oyuncunun butonunu seçilmiş hale getir.
    document.getElementById($playerName + "-btn").setAttribute("class", "start-page-player-btn selected");
    
};
