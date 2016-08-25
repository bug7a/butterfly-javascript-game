
//Oyun üzerindeki böceklerin; topladıkları bilgiler doğrultusunda karar vererek hareket etmelerini sağlayan sınıf.
function Bug() {
    
    this.bugID = 0; //böceğin id si
    this.bugType = ""; //böceğin tipi bug1 veya bug2 olabilir (resim dosyaları eklenerek farklı canlılar yapılabilir)
    this.element = ""; //böceğin html deki nesnesi
    this.x = 0; //böceğin bulunduğu kordinat
    this.y = 0;
    this.tempX = 0; //böceğin ulaştığı kordinat bulunduğu kordinatı güncellemek için
    this.tempY = 0;
    this.historyX = 0; //böceğin bir önceki adımda bulunduğu kordinat
    this.historyY = 0;
    this.life = 100; //böceğin şu andaki can değeri
    this.maxLife = 100; //böceğin max life değeri başlangıçta random atanır
    this.isMoving = 0; //Böcek hareket halinde mi? 1:evet, 0:hayır
    this.bugTimeout = 0; //Böceğin beklemesinin tutulduğu değişken
    this.direction = ""; //Böceğin yönünü tutuyor
    this.damageToPlayer = 0; //Böcek bir oyuncu tespit etti ve ona yöneliyor (1:evet 0:hayır)
    this.stopMe = 0; //Eğer böcek durdurulmak isteniyor ise kordinata ulaştığında bunu yap
    
    
    //böceği istenilen yöne döndürür,  param: up, down, rigth, left
    this.turnTo = function($direction){

        this.element.children[0].setAttribute( 'src', 'asset/bugs/' + this.bugType + '.' +  $direction + '.png' );
        this.direction = $direction;

    };
    
    //Böceğin hayat seviyesini değiştir
    this.setLifeValue = function($value){

        //$value 0 -- ? arasında olmalı
        if($value < 0) $value = 0;
        if($value > this.maxLife) $value = this.maxLife;
        
        //html nesnesindeki can barı değerini düzenle
        var _percent = parseInt(($value / this.maxLife) * 100);
        this.element.children[1].children[0].style.width = _percent + "%";

        //değişkeni güncelle
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
        
        //Böceğin canından 1 düşür
        this.setLifeValue(this.getLifeValue() - 1); //Oyuncunun her hareketi +1 can azaltır

        //Eğer canı kalmış ise 
        if(this.life != 0) {
            
            this.isMoving = 1; //Oyuncu hareket halinde, hareket tuşlarını pasif yap
            
            //Gidilecek kordinatı rezerve et, diğer böcekler oraya gelmesin
            Bug.corData["c" + this.tempX + "x" + this.tempY] = 1;
            
            Animate.moveObjectTo(this.element, $direction, 10 + parseInt(Math.random()*10)); //default:10
            
        }

    };

    //Böcek düşünmeye başlar
    this.startThink = function(){
        
        var _that = this;
        
        //Böcek her yeni kordinata vardığında foksiyonu tetikle
        window.addEventListener('objectArrived', function(e){
            
            _that.onCor(e);
            
        }, false);
        
        //ilk düşünmeyi başlat
        this.think();
        
    };
    
    //Böceği mezar taşına çevir
    this.stopBug = function(){
        
        if(this.isMoving == 0){

            //Böceğin resmini taş olarak değişir
            this.element.children[0].setAttribute( 'src', 'asset/bugs/' + this.bugType + '.stop.png' );

            //Böceğin can barını görünmez yap
            this.element.children[1].style.display = 'none';

            //Böceğin can değerini 0 a çevir.
            this.life = 0;

            //Beklemenden sonra tekrar düşünmesini engelle
            clearTimeout(this.bugTimeout);

            return 1; //böcek durduruldu
            
        }else{
            
            //Böcek kordinata ulaştığında otomatik durdur.
            this.stopMe = 1;
            
            return 0; //durdurulamadı

        }
        
    };
    
    //Böcek bir sonraki hamlesine karar verir.
    this.think = function(){
        
        var _that = this; //farklı bir nesnenin içerisinden bug nesnesine ulaşmak için kullanılacak değişken.

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

                //Kordinattaki nesnenin özelliklerini al
                var _itemObject = Map.getItemPropFromCor(_toX, _toY);
                
                var _isAnotherBugThere = 0;
                
                //Eğer kendi bulunduğu kordinatı kontrol ediyor ise fonksiyonu çalıştırma
                if(_toX != _that.x || _toY != _that.y) {
                    _isAnotherBugThere = Bug.checkBugOnCor(_toX, _toY);
                }

                //Nesnenin üzerinden geçilebilirse veya kordinat boş ise devam et.
                if((_itemObject.canGo == 1 || _itemObject == 0) && _isAnotherBugThere == 0) {

                    //Öncelikli bir hedef (oyuncu) bulundu
                    if(_toX == Global.playerX && _toY == Global.playerY){

                        _dontCheckOtherCor = 1; //Değer kordinatlar kontrol edilirken öncelikli hedef bulunduğunu hatırlamak için kullan
                        _that.damageToPlayer = 1; //Kordinata ulaştığında oyuncunun bulunduğunu hatırlamak için değişkeni kullan

                        _directionList = []; //önceden bulunan tüm hedefleri yoksay

                    }
                    
                    //Böceğin bir önceki kordinatı tespit edildi bu kordinata öncelik verme
                    if(_toX == this.historyX && _toY == this.historyY && _dontCheckOtherCor == 0) {
                        
                        //bir önceki kordinat bulundu (Önceliği olmayan bir istikamet)
                        _historyDirection = {x:_toX, y:_toY, direction:$direction};
                        
                        // KURAL
                        // Gidilebilecek sadece geldiğimiz kordinat varsa ve orasıda bir böcek tarafından kapatılmış ise bekle
                        // _directionList boş ise ve historCor boş ise bekle
                        
                    }else{
                        
                        //Bulunan gidilebilir kordinatı daha sonra içinden seçmek üzere listeye ekle
                        _directionList.push({x:_toX, y:_toY, direction:$direction});
                        
                        //Gidilebilen bu kordinat ileriye doğru bir yönde
                        if($direction == _that.direction) {
                        
                            //Bu istikametin seçilme olasılığını arttır.
                            for(var i = 0; i < 4; i++) {
                                _directionList.push({x:_toX, y:_toY, direction:$direction});
                            }
                            
                            // KURAL
                            // Böcek ileriye doğru ilerlemeyi daha çok tercih etmeli seçilme olasılığını arttır.
                            
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
        
        //Gidilebilecek hiç bir yer bulunamamış ise
        if(_directionList.length == 0) {
            
            //Bir önceki kordinatı kontrol et gidilebilir mi?
            if(_historyDirection.direction) {
                
                //gidilebilecek başka yer olmadığı için bir önceki konum listeye eklenebilir.
                _directionList.push(_historyDirection);
                
            }else{
                
                //Gidilecek hiç bir yer yok ve önceki kordinat kapatılmış ise bekle (Bir böcek tarafından kapatılmış olabilir)
                _directionList.push({x:this.x, y:this.y, direction:"wait"});
 
            }
            
        }
        
        //Eğer 1 değeri üretili ise değeri yok say (1 değerinin üretilmesi dizi indeksinin dışına çıkacağı için hataya sebep olacaktır)

        //TODO: Math.random komutunun 1 üretme olasılığını araştır.
        var _randomValue = Math.random();    
        if(_randomValue == 1) _randomValue = 0.7;
        
        //Yapılabilecek iş listesinin içerisinden rasgele bir iş seç
        _directionListIndex = parseInt(Math.random() * (_directionList.length));
        
        //Kordinata vardığında konumu güncellemek için gidilecek kordinatları temp değişkende sakla
        this.tempX = _directionList[_directionListIndex].x;
        this.tempY = _directionList[_directionListIndex].y;
        
        //Seçilen iş bekleme değil ise
        if(_directionList[_directionListIndex].direction != "wait") {
            
            //Seçilen kordinata doğru hareket et
            this.moveTo(_directionList[_directionListIndex].direction);
            
        }else {

            //Seçilen iş bekleme ise raskele bir süre bekle ve tekrar düşünmeye başla
            clearTimeout(this.bugTimeout);
            this.bugTimeout = setTimeout(function(){
                
                //Bir sonraki hamle için düşünmeye başla
                if(_that.life != 0) _that.think();
                
            }, 100 + parseInt(Math.random() * 2000)); //rasgele bir süre bekle
            
        }
   
    };
    
    //Böcek kordinata ulaştı
    this.onCor = function(e) {
      
        if(e.objectID == this.bugID){ //Kordinata varmış olan bu böcek ise
            
            this.historyX = this.x; //Bir önceki kordinatları tut.
            this.historyY = this.y;
            
            Bug.corData["c" + this.x + "x" + this.y] = 0;
            
            this.x = this.tempX; //Yeni kordinatları güncelle
            this.y = this.tempY;
            
            Bug.corData["c" + this.x + "x" + this.y] = 1;

            this.isMoving = 0; //Böceğin hareketi bitti
            
            //Böceğin durdurulması istenmiyor ise
            if(this.stopMe == 0) {
                
                //Geldiği kordinatta oyuncu bulunmuş ise
                if(this.damageToPlayer == 1) {

                    //Oyuncu hala böceğin yeni ulaştığı kordinatta duruyor ise
                    if(Global.playerX == this.x && Global.playerY == this.y) {

                        this.damageToPlayer = 0; //Bana bu kordinatta oyuncunun olduğunu hatırlatan değişkeni temizle

                        //Böceğin oyuncuya hasar verme olayını tetikle
                        var _damageEvent = document.createEvent("Event");
                        _damageEvent.initEvent("bugDamage",true,true);

                        //Verilecek hasarın miktarını rasgele belirle
                        _damageEvent.damage = 1 + parseInt(Math.random() * 5);

                        document.dispatchEvent(_damageEvent); //Olayın gerçekleştiğini duyur

                    }

                }

                //Tekrar düşünmeye başlamadan önce bir gıda var ise onu tüket
                var _returnObject = Map.eat(this.x, this.y);

                //Bir besin değeri geri dönmüş ise
                if(_returnObject.foodValue) {

                    //Besin değerini böceğin can değişkenine ekle
                    this.setLifeValue(this.getLifeValue() + _returnObject.foodValue);

                }

                //Böcek hayatta ise; bir sonraki hamleyi düşün
                if(this.life != 0) this.think();
                
            }else {
                
                //Böceği durdur
                this.stopBug();
                
            }

        }
        
    };
    
};

Bug.bugIDCount = 0; //Her böcek eklendiğinde 1 artar
Bug.bugList = []; //Tüm böcek nesnelerinin tutulduğu dizi

Bug.bugContainerElement = ""; //Böceklerin bulunduğu html tag i
Bug.corData = {}; //Tüm böceklerin bulunduğu kordinatları tutar

Bug.init = function(){
    
    //ilk çalışan kod
    Bug.bugContainerElement = document.getElementById("bug-container");
    
};

//Kordinatta bir böcek var mı?
Bug.checkBugOnCor = function($x, $y){
    
    if(Bug.corData["c" + $x + "x" + $y]){
        
        return 1;
        
    }else {
        
        return 0;
        
    }

};

//Tüm böcek nesnelerini temizle
Bug.clear = function(){
    
    //tüm böcekleri durdur.
    for(var i = 0; i < Bug.bugList.length; i++) {
        
        Bug.bugList[i].stopBug();
        
    }
    
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
        
        //Eğer 100 kere dönerse döngüden çık (Hiç bir yer bulunmadığında kitlenmeye karşı koruma)
        if(_whileCount > 100) break;
    
    }

    //Yeni bir böcek sınıfı (class) ı oluştur.
    Bug.bugList.push(new Bug());
    
    //Sürekli kullanım için nesne ismini kısalt
    var _myBug = Bug.bugList[_bugID];
    
    //Yeni böcekle ilgili verileri düzenle
    _myBug.bugID = _bugID;
    _myBug.bugType = $bugType;
    _myBug.element = Bug.createBugElement(_bugID, _x, _y);
    _myBug.x = _x;
    _myBug.y = _y;
    _myBug.historyX = _x;
    _myBug.historyY = _y;
    _myBug.maxLife = 50 + parseInt(Math.random() * 100); //bir can seviyesi belirle
    _myBug.life = _myBug.maxLife;
    _myBug.setLifeValue(_myBug.maxLife); //Böceğin can değerini bar a yansıt
    _myBug.turnTo("up"); //böceğin ilk resmini yükle
    
    //Yeni böceğin elementini html dökümanına ekleyerek görünür olmasını sağla
    Bug.bugContainerElement.appendChild(_myBug.element);
    
    //Böcek düşünmeye başlasın
    _myBug.startThink();
    
    //Bir sonraki böcek için id numrasını bir arttır.
    Bug.bugIDCount++;
    
    return _bugID;
    
};

Bug.createBugElement = function($bugID, $x, $y){
    
    //MODEL: <div id="player" style="top:352px;left:96px"><img src="asset/player/player1.up.png"></div>
    
    //Eklenecek böcek nesnesinin ana elementi
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
    
    //Can barının taşıyıcı elementi
    var _itemBar = document.createElement('div');
    _itemBar.setAttribute("class", "bug-life-bar");
    
    //Can barı seviyesinin elementi
    var _itemBarStatus = document.createElement('div');
    _itemBarStatus.setAttribute("class", "bug-life-bar-status");
    
    //Can barı seviyesini can varının içine ekle
    _itemBar.appendChild(_itemBarStatus);
    
    //Oluşturulan alt elementleri ana elemente ekle ve html e eklemek üzere tamamlanmış nesneyi return et.
    _item.appendChild(_itemImg);
    _item.appendChild(_itemBar);
    
    return _item;
    
};

//ID si verilen böceğin yönetici sınıfını (classını) döndür.
Bug.getBug = function($bugID) {
    
    return Bug.bugList[$bugID];
    
};


/*


### KOD TASLAĞI ###

NOT: Bu proje için kullanılan standartları içerir. Global javascript standartları değildir.

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