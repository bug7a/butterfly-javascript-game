
function Bug() {
    
    this.bugID = 0;
    this.bugType = "";
    this.element = "";
    this.x = 0; //böceğin bulunduğu kordinat
    this.y = 0;
    this.tempX = 0; //böceğin ulaştığı kordinat bulunduğu kordinatı güncellemek için
    this.tempY = 0;
    this.historyX = 0; //böceğin bir önceki adımda bulunduğu kordinat
    this.historyY = 0;
    this.life = 100; //böceğin life değeri başlangıçta random atanır (100-1000)
    this.maxLife = 100;
    this.isMoving = 0;
    this.bugTimeout = 0;
    this.direction = "";
    this.damage = 0; //random 1 - 4
    
    
    //böceği istenilen yöne döndürür,  param: up, down, rigth, left
    this.turnTo = function($direction){

        this.element.children[0].setAttribute( 'src', 'asset/bugs/' + this.bugType + '.' +  $direction + '.png' );
        this.direction = $direction;

    };
    
    //Böceğin hayat seviyesini değiştir
    this.setLifeValue = function($value){

        //$value 0 -- 1000 arasında olmalı

        if($value < 0) $value = 0;
        if($value > this.maxLife) $value = this.maxLife;
        
        //html nesnesindeki can barı değerini düzenle
        var _percent = parseInt(($value / this.maxLife) * 100);
        this.element.children[1].children[0].style.width = _percent + "%";

        this.life = $value;

        //Can kalmadığında oyunu bitir.
        if(this.life == 0) {

            //pasiv ol ve mezar taşına dönüş
            this.stopBug();
            
        }

    };

    //Böceğin hayat seviyesini al
    this.getLifeValue = function(){

        return this.life;

    };
    
    //Böceği istenilen yere hareket ettirir.
    this.moveTo = function($direction){

        //Oyuncunun yönünü çevir
        this.turnTo($direction);

            this.isMoving = 1; //Oyuncu hareket halinde, hareket tuşlarını pasif yap
            
            this.setLifeValue(this.getLifeValue() - 1); //Oyuncunun her hareketi +1 can azaltır
            if(this.life != 0) Animate.moveObjectTo(this.element, $direction, 10);

    };

    //Böcek düşünmeye başlar
    this.startThink = function(){
        
        var _that = this;
        
        window.addEventListener('objectArrived', function(e){
            
            _that.onCor(e);
            
        }, false);
        
        //ilk düşünmeyi başlat
        this.think();
        
        /*
        var _that = this;
                
        this.bugInterval = setInterval(function(){
            
            _that.think();
            
        }, 320 + 1500);
        */
        
    };
        
    this.stopBug = function(){
        
        //Böceğin resmini taş olarak değişir
        this.element.children[0].setAttribute( 'src', 'asset/bugs/' + this.bugType + '.stop.png' );
        this.element.children[1].style.display = 'none';
        this.damage = 0;

    };
    
    //Böcek bir sonraki hamlesine karar verir.
    this.think = function(){
        
        var _that = this;
        
        //if(this.isMoving == 1) Board.alert("hareket halindeyken düşünmeye başladı", "info");
        
        var _directionList = []; //Böceğin gidebileceği kordinatların listesi
        var _historyDirection = {}; //Böceğin bir önceki geldiği yer
        
        var _toX = this.x; //Böceğin gideceği x cordinatı
        var _toY = this.y; //Böceğin gideceği y kordinatı
        var _dontCheckOtherCor = 0; //Eğer öncelikli gidilecek bir yer bulunursa diğer kordinatları kontrol etme
        
        var _directionListIndex = 0; //Gidilebilecek kordinat listesinin index numarasını tutar
        
        
        //Gidilecek kordinatı kontrol et
        var _checkCor = function($toX, $toY, $direction){
            
            //Öncelikli bir hedef bulunmamış ise hedefleri listelemeye devam et
            if(_dontCheckOtherCor == 0) {

                _toX = $toX;
                _toY = $toY;

                var _itemObject = Map.getItemPropFromCor(_toX, _toY);

                if(_itemObject.canGo == 1 || _itemObject == 0) {

                    //Öncelikli bir hedef (oyuncu) bulundu
                    if(_toX == Global.playerX && _toY == Global.playerY){

                        _dontCheckOtherCor = 1;
                        _directionList = []; //bulunan tüm hedefleri yoksay

                    }
                    
                    //
                    if(_toX == this.historyX && _toY == this.historyY && _dontCheckOtherCor == 0) {
                        
                        //bir önceki kordinat bulundu
                        //Gidilebilecek en son kordinat
                        _historyDirection = {x:_toX, y:_toY, direction:$direction};
                        
                        //Gidilebilecek sadece geldiğimiz kordinat varsa ve orasıda bir böcek tarafından kapatılmış ise bekle
                        //_directionList boş ise ve historCor boş ise bekle
                        
                    }else{
                        
                        _directionList.push({x:_toX, y:_toY, direction:$direction});
                        
                        //Gidilebilen bu kordinat ileriye doğru bir yönde
                        if($direction == _that.direction) {
                        
                            for(var i = 0; i < 4; i++) {
                                _directionList.push({x:_toX, y:_toY, direction:$direction});
                            }
                            
                        }
                        
                    }

                }
            
            }
            
        };
        
        // Gidilebilecek kordinatı analiz et
        _checkCor(this.x + 1, this.y, "right"); //(RIGHT)
        _checkCor(this.x - 1, this.y, "left"); //(LEFT)
        _checkCor(this.x, this.y + 1, "down"); //(DOWN)
        _checkCor(this.x, this.y - 1, "up"); //(UP)
        _checkCor(this.x, this.y, "wait"); //(WAIT)
        
        //Board.showAlert(this.bugID + ": " + _directionList.length);
        
        //Gidilebilecek hiç biryer bulunamamış
        if(_directionList.length == 0) {
            
            //Bir önceki kordinatı kontrol et
            if(_historyDirection.direction) {
                
                //gidilebilecek yerlere bir önceki kordinatı ekle
                _directionList.push(_historyDirection);
                
            }else{
                
                //Gidilecek hiç bir yer yok ve önceki kordinat kapatılmış (BEKLE)
                _directionList.push({x:this.x, y:this.y, direction:"wait"});
                
                
            }
            
        }else{
            
            //if(_dontCheckOtherCor == 0) {
                
                //Beklemek için kayıt aç
                //_directionList.push({x:this.x, y:this.y, direction:"wait"});
                
            //}
            
        }
        
        //Eğer bir değeri üretili ise değeri yok say
        //TODO: Math.random komutunun 1 üretme olasılığını araştır.
        var _randomValue = Math.random();    
        if(_randomValue == 1) _randomValue = 0.7;
        
        _directionListIndex = parseInt(Math.random() * (_directionList.length));
        
        //İstenilen kordinata doğru hareket et
        if(_directionList[_directionListIndex].direction != "wait") {
            
            this.moveTo(_directionList[_directionListIndex].direction);
            
        }else {
            //Bekleme kodunu yaz TODO:Bu kodu kaldır
            //this.historyX = this.x; //Bir önceki kordinatları tut.
            //this.historyY = this.y;

            //Bir sonraki adımı düşün
            clearTimeout(this.bugTimeout);
            this.bugTimeout = setTimeout(function(){
                if(_that.life != 0) _that.think();
            }, 100 + parseInt(Math.random() * 2000));
            
        }

        this.tempX = _directionList[_directionListIndex].x;
        this.tempY = _directionList[_directionListIndex].y;

/*
        
        this.moveTo("right");
        */

        //Böceğin çevresindeki gidilebilecek kordinatların bir listesini çıkar
        //Bu listeden öncelikli hedef var ise oraya yönel yoksa random olarak yönel
        //Eğer 4 yönden gidilemeyecek (duvar, ağaç) yerler var ise onları hesaba katma
        //Böcekler eğer gidebilecekleri başka bir kordinat yok ise geldikleri yöne geri dönebilir.
        //Eğer oyuncu böceğin ulaşabileceği bir kordinatta ise; öncelik ona yönelmek olsun.
        //Böcek isterse hiç hareket etmemeyi de seçebilir.
        //Böcek oyuncunun üzerine geldiğinde random bir hasar vursun.
        //Böcek canı bittiğinde mezar taşına dönüşsün. ve hasarı 0 olsun.
        //böcek bir gıda üzerinden geçerken otomatik tüketsin.
        
        //Her hareketten sonra 0-200ms arası dinlen.
        //böcekler 320ms bir haret edecek
        
    };
    
    //Böcek kordinata ulaştı
    this.onCor = function(e) {
      
        if(e.objectID == this.bugID){ //this.bugID
            
            this.historyX = this.x; //Bir önceki kordinatları tut.
            this.historyY = this.y;
            this.x = this.tempX; //Yeni kordinatları güncelle
            this.y = this.tempY;

            this.isMoving = 0; //Böceğin hareketi bitti
            
            //Tekrar düşünmeye başlamadan önce bir gıda var ise onu tüket
            var _returnObject = Map.eat(this.x, this.y);

            if(_returnObject.foodValue) {

                //Besin değerini böceğin can değişkenine ekle
                this.setLifeValue(this.getLifeValue() + _returnObject.foodValue);

            }

            if(this.life != 0) this.think();
            
        }
        
    };
    
};

Bug.bugIDCount = 0;
Bug.bugList = [];

Bug.bugContainerElement = "";

Bug.init = function(){
    
    //ilk çalışan kod
    Bug.bugContainerElement = document.getElementById("bug-container");
    
    //myBug2ID =  Bug.createNewBug("bug2");
    //Bug.getBug(myBug2ID).turnTo("down");
    //Bug.getBug(myBug2ID).removeBug();
    
};

Bug.createNewBug = function($bugType){
    
    //Böceğin ID si
    var _bugID = Bug.bugIDCount;
    
    //Böceğin oluşturulacağı kordinatları tutar
    var _x = 0;
    var _y = 0;
    
    var _foundCor = 0; //kordinat bulunduğunda değer 1 olur
    var _whileCount = 0; //döngünün dönüş sayısını tutar
    
    while (_foundCor == 0) {
        
        _whileCount++;

        //Random bir kordinat bul
        _x = parseInt(1 + (Math.random()* (Map.maxXCor - 1)));
        _y = parseInt(1 + (Math.random()* (Map.maxYCor - 1)));
        
        //Bulduğum kordinattaki nesnenin bilgilerini getir
        var _itemObject = Map.getItemPropFromCor(_x, _y);
                
        //Müsait bir kordinat bulunduğunda döngüden çık
        if(_itemObject.canGo == 1 || _itemObject == 0){
            
            _foundCor = 1;
            
        }
        
        //Eğer 100 kere dönerse döngüden çık
        if(_whileCount > 100) break;
    
    }

    //Yeni bir böcek class ı oluştur.
    Bug.bugList.push(new Bug());
    
    //Sürekli kullanım için nesne ismini kısalt
    var _myBug = Bug.bugList[_bugID];
    
    _myBug.bugID = _bugID;
    _myBug.bugType = $bugType;
    _myBug.element = Bug.createBugElement(_bugID, _x, _y);
    _myBug.x = _x;
    _myBug.y = _y;
    _myBug.historyX = _x;
    _myBug.historyY = _y;
    
    //_myBug.maxLife = 100;
    _myBug.maxLife = 100 + parseInt(Math.random() * 900); //bir can seviyesi belirle
    _myBug.damage = 1 + parseInt(Math.random() * 5); //bir hasar belirle
    _myBug.life = _myBug.maxLife;
    _myBug.setLifeValue(_myBug.maxLife); //Böceğin can değerini bar a yansıt
    _myBug.turnTo("up"); //böceğin ilk resmini yükle
    
    Bug.bugContainerElement.appendChild(_myBug.element);
    
    //Böcek düşünmeye başlasın
    _myBug.startThink();
    
    //Bir sonraki böcek için id numrasını bir arttır.
    Bug.bugIDCount++;
    
    return _bugID;
    
};

Bug.createBugElement = function($bugID, $x, $y){
    
    //MODEL: <div id="player" style="top:352px;left:96px"><img src="asset/player/player1.up.png"></div>
    
    //Eklenecek nesnenin elementi
    var _item = document.createElement('div');
    //_item.setAttribute('class', 'objects-style');
    _item.style.top = Map.getXPXFromCor($y) + 'px';
    _item.style.left = Map.getYPXFromCor($x) + 'px';
    _item.style.width = '32px';
    _item.style.height = '32px';
    _item.style.position = "absolute";
    _item.setAttribute( 'id', $bugID );

    //resim elementi
    var _itemImg = document.createElement( 'img' );
    //_itemImg.setAttribute( 'src', 'asset/bugs/bug1.up.png' );
    _itemImg.setAttribute( 'width', "32" );
    _itemImg.setAttribute( 'height', "32" );
    
    //can barını oluştur
    var _itemBar = document.createElement('div');
    _itemBar.setAttribute("class", "bug-life-bar");
    
    //can barı seviyesi
    var _itemBarStatus = document.createElement('div');
    _itemBarStatus.setAttribute("class", "bug-life-bar-status");
    
    //barstatus u bar ın içine ekle
    _itemBar.appendChild(_itemBarStatus);
    
    //Oluşturulan image element nesnesinin ust element nesnesine eklenmesi
    _item.appendChild(_itemImg);
    _item.appendChild(_itemBar);
    
    return _item;
    
};

Bug.getBug = function($bugID) {
    
    return Bug.bugList[$bugID];
    
};


/*


### KOD TASLAĞI ###


ClassName.PUBLIC_STATIC_CONST = "public-static-const";
ClassName.publicStaticVariable = "public-static-variable";
ClassName.publicStaticFunction = function($options){ 
    return "public-static-function";
};

function ClassName()
{

    var _privateVariable = "private-variable";
    var _that = this;

    this.publicVariable = "public-variable";

    var _init = function(){

    }

    var _privateFunction = function($options)  
    {
        alert(_that.publicVariable);
        alert(_privateVariable);

        return "private-function";
    }

    this.publicFunction = function($options)
    {
        alert(this.publicVariable);
        alert(_privateVariable);

        return "public-function";
    }

    // initial code
    _init();

}

// ClassName usage
alert(ClassName.PUBLIC_STATIC_CONST);
alert(ClassName.publicStaticVariable);
alert(ClassName.publicStaticFunction());

var className = new ClassName();
alert(className.publicVariable);
alert(className.publicFunction());


*/