function Board() {};

Board.playerLifeBarElement = "";
Board.keyElement = "";

Board.init = function(){
    
    Board.playerLifeBarElement = document.getElementById("player-life-bar-status");
    Board.keyElement = document.getElementById("player-key");
    
};

//Oyuncunun yukarıdaki hayat barını değiştirir
Board.setPlayerLifeBar = function($life){
    
    if($life < 0) $life = 0;
    if($life > 100) $life = 100;
    
    Board.playerLifeBarElement.style.width = $life + "%";
    
};

//Anahtarı gösterip/gizlemek için
Board.setKeyStatus = function($show){
  
    if($show == 1){
        //göster
        Board.keyElement.style.display = "block";
    }else{
        //gizle
        Board.keyElement.style.display = "none";
    }
    
};