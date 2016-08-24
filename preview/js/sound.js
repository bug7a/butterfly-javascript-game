
function Sound() {};

Sound.keySoundElement = "";
Sound.hurtSoundElement = "";
Sound.eatSoundElement = "";
Sound.attackSoundElement = "";

Sound.SOUND_NAMES = {};
Sound.SOUND_NAMES.KEY = "key";
Sound.SOUND_NAMES.HURT = "hurt";
Sound.SOUND_NAMES.EAT = "eat";
Sound.SOUND_NAMES.ATTACK = "attack";

//Başlangıçta çalışacak fonksiyon
Sound.init = function(){
    
    Sound.keySoundElement = document.getElementById("key-sound");
    Sound.hurtSoundElement = document.getElementById("hurt-sound");
    Sound.eatSoundElement = document.getElementById("eat-sound");
    Sound.attackSoundElement = document.getElementById("attack-sound");
    
};

Sound.play = function($soundName) {
    
    switch($soundName){
        
        case "key":
            Sound.keySoundElement.play();
            break;
            
        case "hurt":
            Sound.hurtSoundElement.play();
            break;
            
        case "eat":
            Sound.eatSoundElement.play();
            break;
            
        case "attack":
            Sound.attackSoundElement.play();
            break;
        
    }
    
};