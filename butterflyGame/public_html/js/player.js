
function Player(){};

Player.KEY_UP = 38;
Player.KEY_DOWN = 40;
Player.KEY_RIGHT = 39;
Player.KEY_LEFT = 37;
Player.SPACE = 32;

Player.isMoving = 0; //Kelebek hareket halindemi
Player.x = 4; //Kelebeğin kordinatları
Player.y = 12;
Player.tempX = 0;
Player.tempY = 0;
Player.life = 0; //kelebeğin tokluk durumu
Player.element = ""; //kelebeğin html deki elemen objesi


//Program çalıştığında ilk çalışacak fonksiyon
Player.init = function(){
    
    //Kelebeğin elementi
    Player.element = document.getElementById("player");
    
    Player.setLifeValue(60);
    
    //Animate.moveObjectTo();
    
    // Listen to keyboard. 
    window.onkeydown = Player.listenToTheKey;
    window.addEventListener('objectArrived', Player.onCor, false);
    
};

//Bir tuşa basıldığında çalışacak fonksiyon
Player.listenToTheKey = function(e) {
    
    if(Player.isMoving == 0){

        switch(e.keyCode) {

            case Player.KEY_UP:
                //up tuşuna basıldı
                Player.moveTo("up");
                break;

            case Player.KEY_DOWN:
                //up tuşuna basıldı
                Player.moveTo("down");
                break;

            case Player.KEY_RIGHT:
                //up tuşuna basıldı
                Player.moveTo("right");
                break;

            case Player.KEY_LEFT:
                //up tuşuna basıldı
                Player.moveTo("left");
                break;

            case Player.SPACE:
                
                //Kordinatta besin var ise onu ye
                var _returnObject = Map.eat(Player.x, Player.y);
                
                if(_returnObject.foodValue) {
                    
                    //Besin değerini oyuncunun can değişkenine ekle
                    Player.setLifeValue(Player.getLifeValue() + _returnObject.foodValue);
                    
                }
                
                break;

        }
    
    }
    
};

//kelebeği istenilen yöne döndürür,  param: up, down, rigth, left
Player.turnTo = function($direction){
    
    //MODEL: <div id="player" style="top:352px;left:96px"><img src="asset/butterfly.up.png"></div>
    Player.element.children[0].setAttribute( 'src', 'asset/butterfly.' +  $direction + '.png' );
    
};

Player.moveTo = function($direction){

    //Oyuncunun ulaşacağı yeni kordinatlar
    var _toX = Player.x;
    var _toY = Player.y;

    //Oyuncunun yönünü çevir
    Player.turnTo($direction);
    
    //yeni kordinatın hesaplanması
    switch($direction){
        case "up":
            _toY = Player.y - 1;
            break;
        case "down":
            _toY = Player.y + 1;
            break;
        case "right":
            _toX = Player.x + 1;
            break;
        case "left":
            _toX = Player.x - 1;
            break;
    }
    
    //gideceğimiz kordinattaki nesnenin özellik objesini al.
    var _itemObject = Map.getItemPropFromCor(_toX, _toY);
    
    //Gidilecek konum gidilebilir mi?
    if(_itemObject.canGo == 1 || _itemObject == 0){
        
        //alert(parseInt(Player.element.style.left.substr(0, Player.element.style.left.length - 2)));

        Player.isMoving = 1; //Oyuncu hareket halinde, hareket tuşlarını pasif yap
        Player.setLifeValue(Player.getLifeValue() - 1); //Oyuncunun her hareketi +1 can azaltır
        Animate.moveObjectTo(Player.element, $direction, 5 + parseInt((100 - Player.getLifeValue())/10));

        //Oyuncunun ulaşacağı kordinatları ulaştığında konum değişkenlerini güncellemek için hafızada tut.
        Player.tempX = _toX;
        Player.tempY = _toY;

    }
        
};

Player.onCor = function(e){
    
    //tuzak olabilir.
    //anahtar alınabilir
    //başka bir canlı ile kesişebilir
    //kapının önüne gelmiş olabilir. Anahtar var ise kapı açılacak.
    
    if(e.objectID == "player"){

        //Oyuncunun yeni kordinatlarını güncelle
        Player.x = Player.tempX;
        Player.y = Player.tempY;
        
        //Ulaşılan kordinatta meydana gelen olayların sonucu
        var _returnObject = Map.onPlayerArriveCor(Player.x, Player.y);
        Player.isMoving = 0; //Oyuncu tekrar hareket etmeye hazır
        
        //Eğer yeni kordinatta bir hasar alınmış ise;
        if(_returnObject.damage)
            Player.setLifeValue(Player.getLifeValue() - _returnObject.damage);
        
    }
   
    
};

Player.setLifeValue = function($value){
    
    //$value 0 -- 100 arasında olmalı
    
    if($value < 0) $value = 0;
    if($value > 100) $value = 100;
    
    Player.life = $value;
    
    Board.setPlayerLifeBar($value);
    
};

Player.getLifeValue = function(){
  
    return Player.life;
    
};