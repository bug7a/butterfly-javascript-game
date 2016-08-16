function Board() {};

Board.playerLifeBarElement = "";
Board.keyElement = "";

Board.alertBoxElement = "";
Board.alertBoxTimeOut = "";

Board.init = function(){
    
    Board.playerLifeBarElement = document.getElementById("player-life-bar-status");
    Board.keyElement = document.getElementById("player-key");
    
    Board.alertBoxElement = document.getElementById("alert-box");
    
    Board.setKeyStatus(0); //Anahtarı görünmez yap.
    
};

//Oyuncunun yukarıdaki hayat barını değiştirir
Board.setPlayerLifeBar = function($life){
    
    if($life < 0) $life = 0;
    if($life > 100) $life = 100;
    
    Board.playerLifeBarElement.style.width = $life + "%";
    
    //brown 0-20, gold 21-50, mediumseagreen 51-100
    if($life > 50) {
        Board.playerLifeBarElement.style.backgroundColor = 'mediumseagreen';
    }else if($life > 20){
        Board.playerLifeBarElement.style.backgroundColor = 'darkorange';
    }else{
        Board.playerLifeBarElement.style.backgroundColor = 'brown';
    }
    
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

//Ekranda uyarı çıkarmak
Board.showAlert = function($text, $type){
    
    Board.alertBoxElement.innerHTML = $text;
    Board.alertBoxElement.style.display = "block";
    
    if(!$type){
        $type = "info";
    }
    
    //bilgi:white alert:aquamarine danger yellow
    switch($type){
        
        case "info":
            Board.alertBoxElement.style.backgroundColor = "white";
            break;
        case "alert":
            Board.alertBoxElement.style.backgroundColor = "aquamarine";
            break; 
        case "danger":
            Board.alertBoxElement.style.backgroundColor = "yellow";
            break; 
            
    }
    
    /*
    setTimeout(function(){
        Board.hideAlert();
    }, 3000);*/
    
    clearTimeout(Board.alertBoxTimeOut); //Daha önce eklenmiş olanı temizle
    Board.alertBoxTimeOut = setTimeout(Board.hideAlert, 3000); //alerti otomatik kapat
    
};

//Alert kutusunu sakla
Board.hideAlert = function(){
    
    Board.alertBoxElement.style.display = "none";
    
};