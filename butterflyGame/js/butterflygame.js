/* global Map */

function ButterFlyGame(){};

ButterFlyGame.init = function() {
    
    Player.init();
    Level.createLevel(1);

 /*
  * 
    for(var i = 0; i <= 10; i++) {
        Map.add('apple', Math.random()* Map.maxXCor , Math.random()*Map.maxYCor, {});
    }
    
    Map.add('rock', 2, 2, {});
    Map.add('flower', 3, 2, {});
    Map.add('grass', 4, 2, {});
    Map.add('wall2', 5, 2, {});
    
    //alert(Map.getItemIDFromCor(4, 2));
    
    var _itemObject = Map.getItemPropFromCor(2, 2);
    alert(_itemObject.type);
    alert(_itemObject.id);
    alert(_itemObject.canEat);
    alert(_itemObject.foodValue);
    
    */

};



window.addEventListener( 'load', ButterFlyGame.init, false );

