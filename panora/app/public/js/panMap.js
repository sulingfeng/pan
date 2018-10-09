class panoramicMap{
    constructor(idSelector,x,y,imgId){
        this.panoramicMapService = new serverUtil();
        this.panoramicMapMath = new MathUtil();
        this.map=null;
        this.selector = idSelector;
        this.x = x;
        this.y = y;
        this.imgId = imgId;
        this.directionIcons=new Array();
        this.options = this.initPan();
        this.sceneFromIdFN=null;
        this.init();
    }

    initPan(){
        return {
            container: this.selector||'photosphere',
            lon:this.x ||104.7191435416,//全景坐标经纬度104.729154,31.516288
            lat:this.y || 31.511629128,
            imgId:this.imgId || '00000000-01-20170107032411369',
            default_long:0.1,
            default_lat:-0.1,
            //loading_img: 'p/photosphere-logo.gif',
            time_anim: false,
            default_fov: 70,
            mousewheel: true,
            angle:0,
            size: {
                height: window.innerHeight//-20
            }
        }
    }

    init(){
        var that=this;
        var count=0;
        var panoramicMapService = this.panoramicMapService
        var intera=setInterval(function () {
            if(panoramicMapService){
                clearInterval(intera);
                //loadData();
                that.initPanorama();
                that.addRaw();
            }
            if(count>100){
                clearInterval(intera);
            }
            count++;
        },100);

        function loadData(){
            panoramicMapService.sceneFromLonLat({
                x:that.options.lon,
                y:that.options.lat,
                callback:function(data){
                    if(!that.sceneFromIdFN){
                        that.sceneFromIdFN=function(data){
                            if(that.map){
                                that.changeScene(data.id);
                                that.editDirectionIcon({
                                    direction:data.direction,
                                    x:data.x,
                                    y:data.y
                                });

                            }else{
                                //
                                that.initPanorama(data.id);
                                //加载方向箭头
                                var itera=setInterval(function(){
                                    if(that.map.scene){
                                        clearInterval(itera);
                                        $(".psv-hud").css("cursor","pointer");
                                        that.event();
                                        that.editDirectionIcon({
                                            direction:data.direction,
                                            x:data.x,
                                            y:data.y
                                        });
                                    }
                                },100);
                            }
                        }
                    }
                    data.callback=that.sceneFromIdFN;
                    panoramicMapService.sceneFromId(data);
                }
            })
        }
    }

    /**
     * 初始化全景地图
     */
    initPanorama(){
        this.map = new PhotoSphereViewer({
            panorama: panoramicMapServer+"/2/"+this.imgId,
            //panorama: 'http://'+ip+'/public/img/00000000-01-20170107032411369.png',
            container: this.options.container,
            default_long:0.1||this.options.default_long,
            default_lat:-0.1||this.options.default_lat,
            //loading_img: this.options.loading_img,
            time_anim: this.options.time_anim,
            default_fov: this.options.default_fov,
            mousewheel: this.options.mousewheel,
            size: {
                height: this.options.size.height
            }
        });
        window.testmap=this.map;
        console.log("查看相机的缩放阐述",this.map)
    }

    addRaw(){
        var that = this;
        var panoramicMapService = this.panoramicMapService;
        var topDot = new Array;
        function handleSelect(mesh) {
            var options = {
                imgId:that.options.imgId
            }
            var info = panoramicMapService.sceneFromLonLat(options);
            var nextDot = info.direction;
            if(nextDot.length == 2){
                sceneThat.remove(leftLabel)
                sceneThat.remove(rightLabel)
            }else if(nextDot.length == 3){
                console.log("十字路口",nextDot)
                for(var i of nextDot){
                    var type = new MathUtil().quadCount(i.angle)
                    if(type == 1){
                        sceneThat.add(rightLabel)
                    }else if(type == 3){
                        sceneThat.add(leftLabel)
                    }

                }

            }

            for(var i of nextDot){
                if(i.id != that.options.imgId){
                    if(mesh.name == "frontLabel" && i.id != topDot[0]){
                        topDot[0] = that.options.imgId
                        that.changeScene(i.id);
                        that.options.imgId = i.id;
                        that.options.lat = i.x;
                        that.options.lon = i.y;
                        console.log("向前向前向前")
                        //that.addDirectionIcon(that.options);
                        return
                    }else if(mesh.name == "backLabel" && i.angle >190){
                        topDot[0] = that.options.imgId
                        that.changeScene(i.id);
                        that.options.imgId = i.id;
                        that.options.lat = i.x
                        that.options.lon = i.y
                        console.log("向后向后向后")
                        return
                    }else if(mesh.name == "rightLabel" && i.angle >= 0 && i.angle >= 90){
                        topDot[0] = that.options.imgId
                        that.changeScene(i.id);
                        that.options.imgId = i.id;
                        that.options.lat = i.x
                        that.options.lon = i.y
                        console.log("向右右右右")
                        return
                    }
                }
            }
        }



        console.log("查看这个对象",this.map)
        /*this.map.hud.svgContainer.addEventListener('mousedown', function(e){
            alert("点击成功")
        })*/
        /*this.map.prototype._onMouseDown = function(evt) {
            alert("点击成功")
        };*/

        /*this.map.on('psv-markers-button', function(marker) {
            alert("点击成功")

            if (marker.data && marker.data.deletable) {
                PSV.removeMarker(marker);
            }
        });*/

        var sceneCreated=setInterval(function () {
            if(that.map.scene){
                clearInterval(sceneCreated);
                var scene = that.map.scene;
                var labelGroup = new LabelGroup({ position: that.map.point })
                that.map.updateLabel = function (direction) {
                    var camera = scene.children[0];
                    labelGroup.position.set(direction.x* 0.1, direction.y * 0.1 - 6, direction.z* 0.1);
                }
                labelGroup.changeColor(scene.children[0], document.getElementById('photosphere'), handleSelect)
                scene.add(labelGroup);
                that.map.run();
            }
        },100);

    }
    /**
     * 切换场景
     */
    changeScene(id){
        this.map.setPanorama(panoramicMapServer+"/2/"+id);
    }
    /**
     * 事件注册
     */
    event(){
        var that=this;

        this.map.hud.container.addEventListener('mousedown', function(e){
            that._directionEvent=function(e){

                if(that.map.prop.direction.y>30){
                    return;
                }

                var options=that.xyCalAngleOffset(that.directionCache);
                that.editDirectionIcon({
                    direction:options
                });
            }
            that.map.hud.container.addEventListener('mousemove',that._directionEvent);
        });
        that.map.hud.container.addEventListener('mouseup', function(e){
            that.map.hud.container.removeEventListener('mousemove',that._directionEvent);
        });
    }
    /**
     * 添加方向图标
     * @param options
     */
    addDirectionIcon(options){
        var that=this;
        var panoramicMapMath = this.panoramicMapMath
        options.direction=panoramicMapMath.angleCalDirection(options.angle);
        options.position=panoramicMapMath.xyToVector3(window.innerWidth/2+options.direction.calx,
            window.innerHeight*3/4+options.direction.caly,
            this.map.camera);
        options.sphericalPosition=this.map.vector3ToSphericalCoords(
            new THREE.Vector3(options.position.x,options.position.y,options.position.z)
        );
        options.viewPosition={
            x:window.innerWidth/2+options.direction.calx,
            y:window.innerHeight*3/4+options.direction.caly
        };
        /*options.icon.imgUrl='http://127.0.0.1:7001/public/img/pan.png';//default_imageList.getImage("alpha");
        options.icon.width = 200;
        options.icon.height = 200;
        options.icon.fontSize = 50;*/
        var angle=options._angle||options.angle;
        var direction=that.map.prop.direction;
        if(direction.x>=0){
            angle+=direction.x*2*0.947;
            /* if(direction.z<=-85){
             angle-=90;
             }
             angle+=direction.y;
             angle+=direction.z;
             if(direction.y>=0){
             angle-=direction.x*2;
             }
             if(direction.y<=-20){

             }*/
        }else{
            angle-=direction.x*2*0.947;
            /*if(direction.z<=-20){
             angle+=direction.y;
             }
             if(direction.z<=-60){
             angle-=60;
             }
             if(direction.z<=-80){
             angle-=30;
             }
             if(direction.z<=-90){
             angle-=30;
             }
             if(direction.z<=-96){
             angle-=30;
             }*/

        }

        options.directionIcon=this.map.addMarker({
            id: '#' + Math.random(),
            longitude: options.sphericalPosition.longitude,
            latitude: options.sphericalPosition.latitude,
            image:  'http://127.0.0.1:7001/public/img/alpha.png',//options.icon.imgUrl,
            width: 200,
            height: 200,
            anchor: 'bottom center',
            fontSize:50,
            rotate:" rotateX(50deg) rotateY(0deg) rotateZ("+angle+"deg)",
            direction:options.direction.text,
            data: {
                generated: true
            }
        });
        this.directionIcons.push(options.directionIcon);
        options.directionIcon.$el.onclick=function () {
            options.callback=that.sceneFromIdFN;
            panoramicMapService.sceneFromId(options);
        }
    }
    /**
     * 修改方向图标
     */
    editDirectionIconJ(options){
        var that=this;
        for(var j=0;j<that.directionIcons.length;j++){
            that.map.removeMarker(that.directionIcons[j]);
        }
        that.directionCache=options.direction;
        that.directionIcons=new Array();
        for(var i=0;options.direction&&
        i<options.direction.length;i++){
            that.addDirectionIcon(options.direction[i]);
        }
    }
    /**
     *根据屏幕坐标计算角度偏移
     * @param options
     */
    xyCalAngleOffset(options){
        var direction,that=this,angle;
        for(var i=0;i<options.length;i++){
            //direction=that.map.vector3ToViewerCoords(options[i].position);
            //console.log(options[i].viewPosition.x+"-"+options[i].viewPosition.y+"-"+direction.x+"-"+direction.y);
            //angle=panoramicMapMath.xyCalAngle(options[i].viewPosition.x,options[i].viewPosition.y,direction.x,direction.y);
            //console.log(angle);
            //if(angle==0)continue;
            direction=that.map.prop.direction;
            //options[i]._angle=options[i].angle+direction.x;
        }
        return options;
    }

}

class MapImage {
    constructor(id,url,w,h,fz){
        this.imgId=null;
        this.imgUrl=null;
        this.width=32;
        this.height=32;
        this.fontSize=16;
        if(id)this.imgId=id;
        if(url)this.imgUrl=url;
        if(w)this.width=w;
        if(h)this.height=h;
        if(fz)this.fontSize=fz;
    }
}

class MapImageList {
    constructor(u){
        this.url=u;
        this.imgList=new Array();
        this.init();
    }

    init(){
        this.imgList.push(new MapImage("alpha", this.url + "libs/p/alpha.png", 180, 180,16));
        this.imgList.push(new MapImage("pinBlue", this.url + "libs/p/pin-blue.png", 50, 50));
    }

    getImage(imgId){
        for(var i=0;i<this.imgList.length;i++){
            if(this.imgList[i].imgId==imgId){return this.imgList[i];}}
    }

    getImageUrl(imgId){
        for(var i=0;i<this.imgList.length;i++){
            if(this.imgList[i].imgId==imgId){return this.imgList[i].imagUrl;}}
    }

    addImage(id,url,w,h){
        this.imgList.push(new MapImage(id,url,w,h));
    }
}


class serverUtil{
    /*constructor(){
        this.init();
    }
    init(){
        panoramicMapService = new serverUtil()
    }*/
    /**
     * 根据经纬度获所有的全景点
     * @param options
     */
    getAll(dot1,dot2){
        console.log("查看请求的经纬度",dot1,dot2)
        $.ajax({
            type: "POST",
            url: allUrl,
            data: {
                x:dot1.x,
                y:dot1.y,
                x2:dot2.x,
                y2:dot2.y
            },
            dataType: "json",
            success:function(result){
                console.log("根据经纬度获所有的场景点",result)
                if(result.code==0&&result.data&&result.data.id){
                    options.callback&&options.callback(result.data);
                }else{
                    throw new Error("请求失败!");
                }
            }
        });
    }


    /**
     * 根据经纬度获取场景信息
     * @param options
     */
    sceneFromLonLat(options){
        var info;
        if(!options.x||!options.y){
            options.x=104.71850395202637;
            options.y=31.51263400912285;
        }
        var url = options.imgId != undefined?panoramicMapServer+"?id="+options.imgId:panoramicMapServer+"?x="+options.y+"&y="+options.x;
        $.ajax({
            type: "POST",
            async:false,
            url: url,//panoramicMapServer+"?x="+options.y+"&y="+options.x,
            data: {
                //x:options.x,
                //y:options.y
            },
            dataType: "json",
            success:function(result){
                if(result.code==0&&result.data&&result.data.id){
                    //options.callback&&options.callback(result.data);
                    info = result.data;
                }else{
                    //throw new Error("请求失败!");
                    console.log("没有没有没有没有数据这里没有数据")
                }
            }
        });
        return info;
    }
    /**
     * 根据场景id获取场景信息
     * @param options.id
     */
    sceneFromId(options){
        var info;
        if(!options.id){
            options.id="00000000-01-20170107032411369";
        }
        $.ajax({
            type: "POST",
            async:false,
            url: panoramicMapServer+"/2/"+options.id,
            data: {
                //id:options.id,
                //type:"2"
            },
            dataType: "json",
            success:function(result){
                console.log("根据场景id获取场景信息",result)
                if(result.code==0&&result.data&&
                    result.data.direction&&result.data.direction.length>0){
                    //options.callback&&options.callback(result.data);
                    info =  result.data;
                }else{
                    throw new Error("没有获取到数据!");
                }
            }
        });
        return info;
    }
    /**
     * 根据x、y获取全景散片
     * @param x
     * @param y
     */
    xyGetImg(x,y){
        var info;
        $.ajax({
            type: "POST",
            async:false,
            url: panoramicMapServer+"?x="+x+"&y="+y,
            data: {},
            dataType: "json",
            success:function(result){
                if(result.code==0&&result.data&&result.data.id){
                    info = result.data;
                }else{
                    //throw new Error("请求失败!");
                    console.log("没有没有没有没有数据这里没有数据")
                }
            }
        });
        return info;
    }


}

class MathUtil{

    /**
     * 经纬度转xyz
     * @param longitude 经度
     * @param latitude 纬度
     * @param radius 半径
     */
    lonlatToXYZ(lng, lat, alt){
        var phi = (90-lat)*(Math.PI/180),
            theta = (lng+180)*(Math.PI/180),
            radius = alt+100,
            x = -(radius * Math.sin(phi) * Math.cos(theta)),
            z = (radius * Math.sin(phi) * Math.sin(theta)),
            y = (radius * Math.cos(phi));
        return {x: x, y: y, z: z};
    }
    /**
     * 屏幕坐标转换世界坐标
     * @param x
     * @param y
     */
    xyToVector3(x,y,camera){
        var mv = new THREE.Vector3(
            (x / window.innerWidth) * 2 - 1,
            -(y / window.innerHeight) * 2 + 1,
            0.5);
        mv.unproject(camera);
        return mv;
    }
    /**
     * 两点经纬度计算角度
     */
    lonlatCalAngle(lon1,lat1,lon2,lat2){
        var x1 = lon1;
        var y1 = lat1;

        var x2 = lon2;
        var y2 = lat2;

        var pi = Math.PI;
        var w1 = y1 / 180 * pi;
        var j1 = x1 / 180 * pi;
        var w2 = y2 / 180 * pi;
        var j2 = x2 / 180 * pi;
        var ret;
        if (j1 == j2)
        {
            if (w1 > w2) return 270; //北半球的情况，南半球忽略
            else if (w1 < w2) return 90;
            else return -1;//位置完全相同
        }
        ret = 4 * Math.pow(Math.sin((w1 - w2) / 2), 2) - Math.pow(Math.sin((j1 - j2) / 2) * (Math.cos(w1) - Math.cos(w2)), 2);
        ret = Math.sqrt(ret);
        var temp = (Math.sin(Math.abs(j1 - j2) / 2) * (Math.cos(w1) + Math.cos(w2)));
        ret = ret / temp;
        ret = Math.atan(ret) / pi * 180;
        if (j1 > j2) // 1为参考点坐标
        {
            if (w1 > w2) ret += 180;
            else ret = 180 - ret;
        }
        else if (w1 > w2) ret = 360 - ret;
        return ret;
    }
    /**
     * 角度计算方向
     * @param angle
     */
    angleCalDirection(angle){
        if((angle <= 10 ) || (angle > 350)) return {text:"北",calx:-50,caly:0};
        if ((angle > 10) && (angle <= 80)) return {text:"东北",calx:-50,caly:-50};
        if ((angle > 80) && (angle <= 100)) return {text:"东",calx:0,caly:-50};
        if ((angle > 100) && (angle <= 170)) return {text:"东南",calx:-50,caly:-50};
        if ((angle > 170) && (angle <= 190)) return {text:"南",calx:50,caly:0};
        if ((angle > 190) && (angle <= 260)) return {text:"西南",calx:-50,caly:50};
        if ((angle > 260) && (angle <= 280)) return {text:"西",calx:0,caly:50};
        if ((angle > 280) && (angle <= 350)) return {text:"西北",calx:-50,caly:50};
    }

    /**
     * 象限计算
     */
    quadCount(angle){
        if((angle >= 0 ) && (angle < 90))    return 1;
        if((angle >= 90 ) && (angle < 180))  return 2;
        if((angle >= 180 ) && (angle < 270)) return 3;
        if((angle >= 270 ) && (angle < 360)) return 4;
    }

    /**
     * 屏幕坐标计算旋转角度
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     */
    xyCalAngle(x1,y1,x2,y2){
        /* function cal() {
         var dRotateAngle = Math.atan2(Math.abs(x1 - x2), Math.abs(y1 - y2));
         //如果下一点的横坐标大于前一点(在第一和第四象限)
         if (x2 >= x1) {
         //在第一象限(0<=dRotateAngle<=90)
         if (y2 >= y1){
         //不做任何处理
         dRotateAngle = dRotateAngle;
         }else{
         dRotateAngle=Math.PI-dRotateAngle;
         }
         }else//(在第二和第三象限)
         {
         //第二象限
         if (y2 >= y1){
         dRotateAngle=2*Math.PI-dRotateAngle;
         }else{
         //第三象限
         dRotateAngle=Math.PI+dRotateAngle;
         }
         }
         return dRotateAngle;
         }

         function getAngle(px,py,mx,my){//获得人物中心和鼠标坐标连线，与y轴正半轴之间的夹角
         var x = Math.abs(px-mx);
         var y = Math.abs(py-my);
         var z = Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
         var cos = y/z;
         var radina = Math.acos(cos);//用反三角函数求弧度
         var angle = Math.floor(180/(Math.PI/radina));//将弧度转换成角度

         //console.log(angle);

         if(mx>px&&my>py){//鼠标在第四象限
         angle = 180 - angle;
         }

         if(mx==px&&my>py){//鼠标在y轴负方向上
         angle = 180;
         }

         if(mx>px&&my==py){//鼠标在x轴正方向上
         angle = 90;
         }

         if(mx<px&&my>py){//鼠标在第三象限
         angle = 180+angle;
         }

         if(mx<px&&my==py){//鼠标在x轴负方向
         angle = 270;
         }

         if(mx<px&&my<py){//鼠标在第二象限
         angle = 360 - angle;
         }



         return angle;
         }

         var v=panomap.map.vector3ToViewerCoords(
         new THREE.Vector3(0,1,0)
         );
         return getAngle(v.x,v.y,x1,y1)-getAngle(v.x,v.y,x2,y2);*/
        var x =x1 - x2;
        var y = Math.abs(y1 - y2);
        var z = Math.sqrt(x*x + y*y);
        //console.log(Math.round((Math.acos(y / z) / Math.PI*360))-90);
        return Math.round((Math.acos(y / z) / Math.PI*360));
        //return 360*Math.atan(x2-x1/y2-y1)/(2*Math.PI);
        //return  Math.round((Math.acos(y / z) / Math.PI*360));
    }
    /**
     * 世界坐标系转换屏幕坐标
     * @param x
     * @param y
     * @param z
     */
    vector3ToXY(){
        var world_vector = new THREE.Vector3(x,y,z);

        var vector=world_vector.project(PSV.camera);

        var halfWidth = window.innerWidth / 2;
        var halfHeight = window.innerHeight / 2;

        return {
            x: Math.round(vector.x * halfWidth + halfWidth),
            y: Math.round(-vector.y * halfHeight + halfHeight)
        }
    }
}






