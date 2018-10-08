/*引用外部文件*/
document.writeln("<link rel='stylesheet' type='text/css' href='/public/css/photo-sphere-viewer.min.css'>");
document.writeln("<script type='text/javascript' src='js/libs/three.min.js'></script>");
document.writeln("<script type='text/javascript' src='js/libs/D.min.js'></script>");
document.writeln("<script type='text/javascript' src='js/libs/doT.min.js'></script>");
document.writeln("<script type='text/javascript' src='js/libs/uevent.min.js'></script>");
document.writeln("<script type='text/javascript' src='js/libs/photo-sphere-viewer.js'></script>");
document.writeln("<script type='text/javascript' src='js/LabelGroup.js'></script>");
document.writeln("<script type='text/javascript' src='js/panMap.js'></script>");

var panoramicMapPath=""
var panoramicMapServer="http://192.168.3.253:5200/pano";
var allUrl="http://192.168.3.253:5200/pano/point";
var default_imageList=null;
var ip = window.location.host;


var count=0;
var ieterval=setInterval(function(){
    var MapImageList = MapImageList ||'';
    if(MapImageList){
        clearInterval(ieterval);
        MapImageList.prototype.init=function(){
            console.log("查看这里的连接",this.url)
            this.imgList.push(new MapImage("alpha", this.url + "/public/img/alpha.png", 120, 120));
            this.imgList.push(new MapImage("pinBlue", this.url + "/public/img/pin-blue.png", 50, 50));
            this.imgList.push(new MapImage("pinRed", this.url + "/public/img/pin-red.png", 50, 50));
        }
        default_imageList = new MapImageList(panoramicMapPath);
    }
    if(count>100){
        clearInterval(ieterval);
    }
    count++;
},100);



