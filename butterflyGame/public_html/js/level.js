
function Level(){};

//standart kenar duvarlarının oluşturulması
Level.createWall = function(){
    
    for(var i = 1; i <= Map.maxXCor; i++){
        
        Map.add('wall1', i, 1, {});
        Map.add('wall1', i, Map.maxYCor, {});
        
    }
    
    for(var i = 2; i <= (Map.maxYCor - 1); i++){
        
        Map.add('wall1', 1, i, {});
        Map.add('wall1', Map.maxXCor, i, {});
        
    }

};

//numarası verilen levelı oluşturur
Level.createLevel = function($levelNum){
    
    //Level ı oluşturmadan önce map i temizle
    Map.clear();
    
    //Board u temiz
    Board.clear();
    
    var _tryTime = 3; //Nesnenin oluşturmak için denenme saysı
    
    Map.add("enter", 20, 13, {});
    Map.add("door", 20, 14, {});
    
    Level.createWall();
    
    //Sol orta duvar
    var _wallStartCor = (Math.random()*4)+7;
    
    for(var i = 2; i <= 6; i++ ){
        Map.add('wall2', i, _wallStartCor, {});
    }
    
    //Üst sağ duvar
    for(var i = 2; i <= 4; i++ ){
        Map.add('wall2', 12, i, {});
    }
    for(var i = 11; i >= 8; i-- ){
        Map.add('wall2', i, 4, {});
    }

    //Alt orta duvar
    _wallStartCor = (Math.random()*10) + 10;
    
    for(var i = 9; i <= Map.maxYCor - 1; i++ ){
        Map.add('wall2', _wallStartCor, i, {});
    }
    
    //Sol duvar
    for(var i = 18; i <= Map.maxXCor - 1; i++ ){
        Map.add('wall2', i, 6, {});
    }
    Map.add('wall2', 21, 5, {});
    Map.add('wall2', 21, 4, {});
    
    Map.add("key", 22, 5, {});
    
    //Kelebek için bir kordinat ayır.
    Map.corData.c4x12 = 1;

    //Ekrandaki nesneleri oluştur
    for(var i = 0; i < 10; i++) {
        
        if(i < 4) {
            Map.tryAdd('trap', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {}, 6);
        }

        Map.tryAdd('apple', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {foodValue:parseInt(10+(Math.random()*20))}, _tryTime);
        Map.tryAdd('flower', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {foodValue:parseInt(5+(Math.random()*15))}, _tryTime);
        Map.tryAdd('rock', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {}, _tryTime);
        Map.tryAdd('grass', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {}, _tryTime);
        Map.tryAdd('tree1', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {}, _tryTime);
        Map.tryAdd('tree2', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {}, _tryTime);
 
    }
    
    Map.corData.c4x12 = 0;
    
    
    //özel

};