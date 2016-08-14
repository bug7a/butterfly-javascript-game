/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function Map(){};

Map.maxXCor = 26; //haritanın birim genişliği
Map.maxYCor = 14; //haritanın birim yüksekliği
Map.corSize = 32;

Map.corData = {}; //harita üzerindeki bir kordinattaki nesnenin idsini tutar.
Map.lastItemID = 0; //harita üzerine eklenen son itemin ID sini taşır.
Map.itemData = []; //idsi verilen bir itemin diğer bilgilerini taşır.

Map.init = function(){

    //bağlangıçta çalışması gerken kodların yazıldığı yer.

};

//harita üzerine bir nesne(ağaç, elma, taş, duvar vs..) ekleme kodu
Map.add = function($type, $x, $y, $param) {
    
    //MODEL: <div class="objects-style"><img src="asset/apple.png" alt="Apple"><div>20</div></div>
    
    //Sayılar noktalı geldiğine sorun oluşuyor.
    $x = parseInt($x);
    $y = parseInt($y);
    
    //Kordinat dolu ise nesneyi ekleme
    if( Map.getItemIDFromCor($x, $y) == 0 ) {
        
        //Yeni nesne için id oluştur
        Map.lastItemID++;

        //Eklenen object için özelliklerinin tutulduğu bir nesne oluştur.
        var _itemObject = Map.createItemPropObject($type);
        _itemObject.id = Map.lastItemID;
        _itemObject.x = $x;
        _itemObject.y = $y;
        
        //Standart dışı özelliklerin tanımlanması
        if($param.foodValue){ 
            _itemObject.foodValue = $param.foodValue;
        }

        //Tüm nesneleri taşıyan element
        var _objectContainer = document.getElementById( 'game-objects' );

        //Eklenecek nesnenin elementi
        var _item = document.createElement('div');
        _item.setAttribute('class', 'objects-style');
        _item.style.top = Map.getXPXFromCor($y) + 'px';
        _item.style.left = Map.getYPXFromCor($x) + 'px';
        _item.setAttribute( 'id', Map.lastItemID );

        //resim elementi
        var _itemImg = document.createElement( 'img' );
        _itemImg.setAttribute( 'src', _itemObject.image );

        //Oluşturulan elementin nesne özelliklerine kaydedilmesi
        _itemObject.element = _item; //TODO kontrol et çalışacakmı getElementByID ile tekrar çek.

        //Oluşturulan element nesnesinin html dosyasına eklenmesi
        _item.appendChild(_itemImg);
        
        if(_itemObject.foodValue) {
            
            //Besin değeri var ise göster
            var _itemFoodValue = document.createElement('div');
            _itemFoodValue.setAttribute('class', 'object-description-style');
            _itemFoodValue.innerHTML = _itemObject.foodValue;
            
            _item.appendChild(_itemFoodValue);
            
        }
        
        _objectContainer.appendChild(_item);

        //Elde edilen bilgilerin değişkenlere aktarılması
        Map.corData["c" + $x + "x" + $y] = Map.lastItemID;
        Map.itemData.push(_itemObject);

        return 1;
        
    }else{
        
        return 0;
        
    }

};

//tryTime da verilen sayı değeri kadar eklemeyi dene
Map.tryAdd = function($type, $x, $y, $param, $tryTime){
    
    var _status = 0;
    
    for(var i = 0; i < $tryTime; i++) {
        
        _status = Map.add($type, $x , $y, $param);
        
        if(_status == 1) {
            //if(i > 0) alert((i + 1) + ". denemede eklendi");
            break;
        }else{
            
            //Eğer eklenememiş ise farklı bir kordinat dene
            $x = Math.random()* Map.maxXCor;
            $y = Math.random()*Map.maxYCor;
        }
    }
    
    return _status;
    
};


//cordinattan px uzaklığını döndürür
Map.getXPXFromCor = function($x) {
    
    //$x = parseInt($x);
    
    return (($x - 1) * Map.corSize );
    
};

//Cordinattan px uzaklığını döndürür.
Map.getYPXFromCor = function($y) {
    
    //$y = parseInt($y);
    
    return (($y - 1) * Map.corSize );
    
};

//Cordinattan nesnenin özelliklerini getir
Map.getItemPropFromCor = function($x, $y){
    
    var _itemID = Map.getItemIDFromCor($x, $y);
    
    return Map.getItemPropFromID(_itemID);
    
};

//Nesnenin idsinden nesnenin özelliklerini getir
Map.getItemPropFromID = function($id) {
    
    var _itemIndex = Map.getItemIndexFromID($id);
    
    if(_itemIndex == -1){
        return 0;
    }else {
        return  Map.itemData[_itemIndex];
    }

};

//Item listesinden id si verilen itemin index numarasını döndürür
Map.getItemIndexFromID = function($id){
    
    var _itemIndex = -1;
    
    for( var i = 0; i < Map.itemData.length; i++) {
        if(Map.itemData[i].id == $id) {
            _itemIndex = i;
        }
    }
    
    return _itemIndex;
    
};

//Verilen kordinattaki nesnenin id sini döndürür nesne yoksa 0 değeri döner
Map.getItemIDFromCor = function($x, $y){
    
    if(Map.corData["c" + $x + "x" + $y] > 0) {
        return Map.corData["c" + $x + "x" + $y];
        
    }else{
        return 0;
        
    }
    
};

//Oyuncu kordinata vardığında olacak işler için (trap, key)
Map.onPlayerArriveCor = function($x, $y){
    
    var _returnObject = {};
    
    //Varılan kordinattaki nesnenin bilgilerini al
    var _itemProp = Map.getItemPropFromCor($x, $y);
    
    //Kordinat boş değilse
    if(_itemProp != 0){
        
        switch(_itemProp.type){
            
            case "trap":
            case "diken":
                _returnObject.damage = _itemProp.damage;
                Map.changeItemImage(_itemProp.element, _itemProp.passiveImage );
                break;
            case "key":
                
                break;
            case "useKey":
                
                break;
            
        }
        
    }
    
    return _returnObject;
    
};

//Harita üzerindeki bir besini tüketmek
Map.eat = function($x, $y){
    
    var _returnObject = {};
    
    //Varılan kordinattaki nesnenin bilgilerini al
    var _itemProp = Map.getItemPropFromCor($x, $y);
    
    //Kordinat boş değilse
    if(_itemProp != 0){
        
        switch(_itemProp.type){
            
            case "apple":
            case "flower":
                
                if(_itemProp.foodValue != 0){
                
                    _returnObject.foodValue = _itemProp.foodValue;
                    Map.changeItemImage(_itemProp.element, _itemProp.passiveImage );

                    var _itemIndex = Map.getItemIndexFromID(_itemProp.id);
                    Map.itemData[_itemIndex].foodValue = 0;
                    
                    Map.changeItemDescValue(_itemProp.element, 0);
                
                }
                
                break;
            
        }
        
    }
    
    return _returnObject;
    
};

//Besin değerini değiştirme (Ekran üzerinde)
Map.changeItemDescValue = function($element, $foodValue){
    
    if($foodValue < 0) $foodValue = 0;
    
    if($element){
        $element.children[1].innerHTML = $foodValue;
    }
    
};

//Itemin görünen resmini değiştir.
Map.changeItemImage = function($element, $imagePath){

    if($imagePath && $element){
        $element.children[0].setAttribute( 'src', $imagePath );
    }
      
};

//Nesne objesi oluştur
Map.createItemPropObject = function($type) {
    
    var _itemObject = {};
    
    switch($type) {
    case "apple":
        
        _itemObject.id = 0;
        _itemObject.element = null;
        _itemObject.type = $type;
        _itemObject.x = 0;
        _itemObject.y = 0;
        _itemObject.image = "asset/apple.png";
        _itemObject.canGo = 1;
        _itemObject.canEat = 1;
        _itemObject.foodValue = 15;
        _itemObject.passiveImage = "asset/apple.passive.png";
        _itemObject.needKey = 0;
        break;
    case "flower":

        _itemObject.type = $type;
        _itemObject.image = "asset/flower.png";
        _itemObject.canGo = 1;
        _itemObject.canEat = 1;
        _itemObject.foodValue = 7;
        _itemObject.passiveImage = "asset/flower.passive.png";
        break;
        
    case "grass":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/grass.png";
        _itemObject.canGo = 1;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        break;
        
    case "rock":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/rock.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        break;
        
    case "tree1":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/tree1.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        break;
        
    case "tree2":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/tree2.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        break;
        
    case "wall1":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/wall1.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        break;
        
    case "wall2":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/wall2.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        break;
        
    case "door":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/door.png";
        _itemObject.canGo = 0;
        _itemObject.canEat = 0;
        _itemObject.foodValue = 0;
        _itemObject.needKey = 1;
        break;
        
    case "trap":
        
        _itemObject.type = $type;
        _itemObject.image = "asset/trap.png";
        _itemObject.canGo = 1;
        _itemObject.canEat = 0;
        _itemObject.damage = 40;
        _itemObject.passiveImage = "asset/trap.passive.png";
        break;
    
    case "key":
        _itemObject.type = $type;
        _itemObject.image = "asset/key.png";
        _itemObject.canGo = 1;
        _itemObject.canEat = 0;
        _itemObject.canTake = 1;
        break;
    
        
    }
    
    return _itemObject;
    
};