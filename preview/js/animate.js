
function Animate() {};

Animate.init = function(){
    
    //ilk çalışan kod
    
};

//Bir nesnenin konumunu animasyonlu olarak değiştirir.
Animate.moveObjectTo = function($element, $direction, $delayTime){

    //standart değer
    //if($delayTime == null || $delayTime < 100) {
    //    $delayTime = 100;
    //}

    var _number = 0;
    var _startPX = 0;
    var _styleTitle = "";
    var _styleDirection = 1;

    var _objectArrivedEvent = document.createEvent("Event");
    _objectArrivedEvent.initEvent("objectArrived",true,true);

    _objectArrivedEvent.objectID = $element.getAttribute('id');

    switch($direction){

        case "up":
            _startPX = parseInt($element.style.top.substr(0, $element.style.top.length - 2));
            _styleTitle = "top";
            _styleDirection = -1;
            break;
        case "down":
            _startPX = parseInt($element.style.top.substr(0, $element.style.top.length - 2));
            _styleTitle = "top";
            _styleDirection = 1;
            break;
        case "right":
            _startPX = parseInt($element.style.left.substr(0, $element.style.left.length - 2));
            _styleTitle = "left";
            _styleDirection = 1;
            break;
        case "left":
            _startPX = parseInt($element.style.left.substr(0, $element.style.left.length - 2));
            _styleTitle = "left";
            _styleDirection = -1;
            break;

    }
    
    //alert(_startPX);
    //alert(_styleTitle);
    //alert(_styleDirection);

    //$direction parametresi yanlış girilmiş
    if(_styleTitle != ""){

        var _myInterval = setInterval(function(){

            _number++;

            //yapılması gereken işler
            $element.style[_styleTitle] = (_startPX + (_number * _styleDirection)) + "px";

            //animasyon sonlandı
            if(_number >= Map.corSize){

                document.dispatchEvent(_objectArrivedEvent);
                
                clearInterval(_myInterval);

            }

        }, $delayTime);

    }

};
