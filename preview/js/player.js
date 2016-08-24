
function Player(){};

Player.KEY_UP = 38;
Player.KEY_DOWN = 40;
Player.KEY_RIGHT = 39;
Player.KEY_LEFT = 37;
Player.SPACE = 32;

Player.isMoving = 0; //Kelebek hareket halindemi
Player.activeStatus = 1;
Player.x = 4; //Kelebeğin kordinatları
Player.y = 12;
Player.tempX = 0;
Player.tempY = 0;
Player.life = 0; //kelebeğin tokluk durumu
Player.element = ""; //kelebeğin html deki elemen objesi
Player.haveKey = 0; //Sahip olduğu anahtar

Player.spacePressedWhenMoving = 0; //Oyuncu hareket halindeyken space tuşuna basıldı.


//Program çalıştığında ilk çalışacak fonksiyon
Player.init = function(){
    
    //Kelebeğin elementi
    Player.element = document.getElementById("player");
    
    //Oyuncunun değerlerini resetle
    Player.clear();
    
    // Listen to keyboard. 
    window.onkeydown = Player.listenToTheKey;
    window.addEventListener('objectArrived', Player.onCor, false);
    window.addEventListener('bugDamage', Player.bugDamage, false);
    
    //Oyuncunun hareketini durdur
    //Player.active(0);
    
};

Player.clear = function(){
    
    //Değişkenlerin başlangıç değeri
    Player.isMoving = 0; //Kelebek hareket halindemi
    Player.x = 4; //Kelebeğin kordinatları
    Player.y = 12;
    Global.playerX = Player.x;
    Global.playerY = Player.y;
    Player.tempX = 0;
    Player.tempY = 0;
    Player.life = 0; //kelebeğin tokluk durumu
    Player.haveKey = 0; //Sahip olduğu anahtar
    
    //Seçilen oyuncunun ilk resimini yükle
    Player.turnTo("up");
    
    //Başlangıç değeri
    Player.setLifeValue(60);
    
    //İlk kordinatlarına ışınla
    Player.element.style.top = Map.getYPXFromCor(Player.y) + "px";
    Player.element.style.left = Map.getXPXFromCor(Player.x) + "px";
    
};

//Oyuncunun hareketini durdur 1:hareket et 0:dur
Player.active = function($status) {
    
    if($status != 0) $status = 1;
    
    Player.activeStatus = $status;
    
};

//Bir tuşa basıldığında çalışacak fonksiyon
Player.listenToTheKey = function(e) {
    
    //Oyuncu hareket halindeyse
    if(Player.isMoving == 1 && Player.activeStatus == 1 && e.keyCode == Player.SPACE) {
        
        Player.spacePressedWhenMoving = 1;
        
    }
    
    if(Player.isMoving == 0 && Player.activeStatus == 1){

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

                //otomatik space tuşunu çalıştımayı temizle
                Player.spacePressedWhenMoving = 0;

                //Kordinatta besin var ise onu ye
                var _returnObject = Map.eat(Player.x, Player.y);
                
                if(_returnObject.foodValue) {
                    
                    //Besin değerini oyuncunun can değişkenine ekle
                    Player.setLifeValue(Player.getLifeValue() + _returnObject.foodValue);
                    
                    //Oyuncunun skoruna ekle
                    Board.addScore(_returnObject.foodValue);
                    
                    //Yenen yemek hakkında bilgi
                    //Board.showAlert("Besin değeri " + _returnObject.foodValue + " olan bir gıda tükettiniz.", "info");
                    
                    //Birşeyler yeme sesi çıkar
                    Sound.play(Sound.SOUND_NAMES.EAT);
                    
                }
                
                break;

        }
    
    }
    
};

//kelebeği istenilen yöne döndürür,  param: up, down, rigth, left
Player.turnTo = function($direction){
    
    //MODEL: <div id="player" style="top:352px;left:96px"><img src="asset/butterfly.up.png"></div>
    Player.element.children[0].setAttribute( 'src', 'asset/player/' + Global.selectedPlayerName + '.' +  $direction + '.png' );
    
};

//böceklerden bir hasar alındığında çalıştır
Player.bugDamage = function(e){
    
    Player.setLifeValue(Player.getLifeValue() - e.damage);

    //Oyuncunun skorundan çıkar
    Board.addScore(e.damage * -1);

    //Alınan hasarı söyle
    Board.showAlert("Böcek tarafından " + e.damage + " hasar aldınız.", "danger");

    //Hasar alma sesi çıkar
    Sound.play(Sound.SOUND_NAMES.ATTACK);
    
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

    }else{
        
        //Eğer üzerinden geçilemeyecek bir nesneden geçmeye çalışırsa uyar.
        Board.showAlert("Bir " + Map.getTurkishName(_itemObject.type) + " üzerinden geçemezsiniz.", "alert");
        
    }
        
};

Player.onCor = function(e){
    
    //başka bir canlı ile kesişebilir
    
    if(e.objectID == "player"){

        //Oyuncunun yeni kordinatlarını güncelle
        Player.x = Player.tempX;
        Player.y = Player.tempY;
        
        //Player kordinatlarını herkesin ulaşabilmesi için globale kopyala
        Global.playerX = Player.x;
        Global.playerY = Player.y;
        
        //Ulaşılan kordinatta meydana gelen olayların sonucu
        var _returnObject = Map.onPlayerArriveCor(Player.x, Player.y);
        Player.isMoving = 0; //Oyuncu tekrar hareket etmeye hazır
        
        if(Player.spacePressedWhenMoving == 1){
            
            //space tuşuna otomatik tekrar bas
            Player.listenToTheKey({keyCode:Player.SPACE});
            
        }
        
        //Eğer yeni kordinatta bir hasar alınmış ise;
        if(_returnObject.damage) {
            
            Player.setLifeValue(Player.getLifeValue() - _returnObject.damage);
            
            //Oyuncunun skorundan çıkar
            Board.addScore(_returnObject.damage * -1);
            
            //Alınan hasarı söyle
            Board.showAlert("Yüzde " + _returnObject.damage + " hasar aldınız.","danger");
            
            //Hasar alma sesi çıkar
            Sound.play(Sound.SOUND_NAMES.HURT);
            
        }
            
        
        if(_returnObject.key) {
            //anahtar ile ilgili işlemler
            Player.haveKey++; //Sahip olduğum anahtar sayısı
            Board.setKeyStatus(1); //Anahtara sahip olduğunu göster
            
            //Anahtar ile ilgili bilgi
            Board.showAlert("Artık bir anahtara sahipsin.", "info");
            
            //Anahtarın alınma sesini çıkar
            Sound.play(Sound.SOUND_NAMES.KEY);
            
        }
        
        if(_returnObject.enter){
            
            if(Player.haveKey > 0){
                
                Player.haveKey--; //Anahtarı bir eksilt
                Board.setKeyStatus(0);
                //Kapıyı aç
                Map.openDoor(_returnObject.doorID);
                
                //Oyuncuya kapının açıldığı bilgisini ver
                Board.showAlert("Anahtarını kullanarak bir kapıyı açtın.", "info");
                
            }else{
                
                Board.showAlert("Kapıdan geçebilmek için anahtara ihtiyacınız var.", "alert");
                //Kapıdan geçebilmek için anahtara ihtiyacınız var.
                
            }
            
        }
        
    }
   
    
};

Player.setLifeValue = function($value){
    
    //Oyun dışında bir sayfada ölümsüzlük modu açılsın.
    if(Global.selectedPage == "game"){
        
        //$value 0 -- 100 arasında olmalı

        if($value < 0) $value = 0;
        if($value > 100) $value = 100;

        Player.life = $value;

        Board.setPlayerLifeBar($value);

        //Can kalmadığında oyunu bitir.
        if(Player.life == 0) Page.show(Page.NAME.GAME_OVER);
        
    }

};

Player.getLifeValue = function(){
  
    return Player.life;
    
};