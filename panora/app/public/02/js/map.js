class panMap{
    constructor(url){
        this.imgUrl = url;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.guiControls = null;
        this.stats = this.initStats();
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.selectorMesh = null;
        this.options = new Object();
        this.topImgId = null;
        this.nowImgId = '00000000-01-20170107032411369';
        this.bgMesh = null;
        this.initAll();
    }

    //初始化
    init() {
        this.initScene();
        this.initCamera();
        this.initRender();
        this.initLight();
        this.initControls();
        this.initContent('image/1.png');
        //this.bgContent('image/1.png');
        this.initGui();
        this.arrows()
        /* 监听事件 */
        window.addEventListener('resize', this.onWindowResize, false);
    }

    //场景
    initScene(){
        this.scene = new THREE.Scene();
    }

    //相机
    initCamera(){
        this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 10000)
        this.camera.position.set(400,0,0);
        this.camera.rotation.set(0,0,0);
        this.camera.lookAt(new THREE.Vector3(0,0,0));
        this.camera.target = new THREE.Vector3( 0, 0, 0 );
        //this.camera.fov = 150
        console.log("查看相机的属性",this.camera)
    }

    //渲染器
    initRender(){
        this.renderer = new THREE.WebGLRenderer({antialias:true});
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
    }

    // 灯光
    initLight() {

    }

    //方向箭头
    arrows(){
        //创建三个贴图;
        var frontTex = new THREE.TextureLoader().load("../02/image/frontRow.png");
        var backTex  = new THREE.TextureLoader().load("../02/image/backRow.png");
        var leftTex  = new THREE.TextureLoader().load("../02/image/rightRow.png");
        var rightTex = new THREE.TextureLoader().load("../02/image/leftRow.png");
        //创建两种几何体，上，左右（公用一个)
        var frontGeometry = new THREE.BoxGeometry(60, 0.001, 40);
        var backtGeometry = new THREE.BoxGeometry(60, 0.001, 40);
        var leftRightGeometry = new THREE.BoxGeometry(60, 0.001, 40);
        //创建材质
        var frontMat = new THREE.MeshBasicMaterial({map: frontTex,blending: 1, transparent: true})
        var backMat  = new THREE.MeshBasicMaterial({map: backTex, blending: 1, transparent: true})
        var leftMat  = new THREE.MeshBasicMaterial({ map: leftTex,blending: 1, transparent: true})
        var rightMat = new THREE.MeshBasicMaterial({ map:rightTex,blending: 1, transparent: true})
        //创建图标模型
        var frontLabel = new THREE.Mesh(frontGeometry, frontMat);
        frontLabel.name = 'rightLabel';
        frontLabel.position.z -= 30;
        frontLabel.position.y -= 100;

        var backLabel = new THREE.Mesh(backtGeometry, backMat);
        backLabel.name = 'leftLabel';
        backLabel.position.z  += 30;
        backLabel.position.y -= 100;

        var leftLabel = new THREE.Mesh(leftRightGeometry, leftMat);
        leftLabel.name = 'backLabel';
        leftLabel.position.x  += 40;
        leftLabel.position.y -= 100;

        var rightLabel = new THREE.Mesh(leftRightGeometry, rightMat);
        rightLabel.name = 'frontLabel';
        rightLabel.position.x -= 40;
        rightLabel.position.y -= 100;

        this.scene.add(frontLabel)
        this.scene.add(backLabel)
        this.scene.add(leftLabel)
        this.scene.add(rightLabel)
    }

    //控制器
    initControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        //this.controls.minZoom = 0;
        //this.controls.maxZoom = 1000;
        //this.controls.noZoom = true;
        this.controls.noZoom = false;
        console.log(this.controls,this.controls.minZoom,this.controls.maxZoom)

        var that = this;
        window.addEventListener( 'wheel', that.onDocumentMouseWheel, false );
    }

    //调试插件
    initGui() {

    }

    //场景中的内容
    initContent(imgUrl) {
        var that = this;
        var texture = new THREE.TextureLoader().load(imgUrl);
        var sphereGeometry = new THREE.SphereGeometry(1000, 50, 50);
        sphereGeometry.scale(-1, 1, 1);
        var sphereMaterial = new THREE.MeshBasicMaterial({map: texture});
        var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        this.scene.add(sphere);

        setTimeout(()=>{
            $('.wrapper').css("z-index","-1");
            that.saveImg();
        },100)
    }

    //性能插件
    initStats() {
        var stats = new Stats();
        document.body.appendChild(stats.domElement);
        return stats;
    }

    //窗口变动触发
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    //数据更新
    update() {
        this.stats.update();
    }

    //循环渲染
    animate() {
        //var that = this;
        //requestAnimationFrame(that.animate());
        this.renderer.render(this.scene, this.camera);
        this.update();
    }

    //全部初始化
    initAll(){
        this.init();
        this.changeScene();
        //this.animate();
    }

    //场景切换
    changeScene(){
        var that = this;
        window.addEventListener( 'click',onMouseClick, false );


        //window.addEventListener( 'mousemove', this.onMouseOver, false );

        function onMouseClick(e){
            var options = {
                imgId:that.nowImgId
            }
            var intersects = that.rayFun(e);

            if(intersects.name == "frontLabel"){
                $('.wrapper').css("z-index","3");
                that.initContent('image/2.png')
                return;
            }else if(intersects.name == "backLabel"){
                $('.wrapper').css("z-index","3");
                that.initContent('image/1.png')
                return;
            }
            return;

            var info = that.getImgAjax(options);
            if(intersects == undefined)return;
            for(var i of info.direction){
                if(i.angle>0 && i.angle<190 && intersects.name == "frontLabel"){
                    var url = that.imgUrl+"/2/"+i.id;
                    that.nowImgId = i.id;
                    that.initContent(url)
                }else if(i.angle>190 && i.angle<360 && intersects.name == "backLabel"){
                    var url = that.imgUrl+"/2/"+i.id;
                    that.nowImgId = i.id;
                    that.initContent(url)
                }
            }
        }
    }

    onDocumentMouseWheel( event ) {
        console.log("滚轮事件")
        var fov = this.camera.fov + event.deltaY * 0.05;
        this.camera.fov = THREE.Math.clamp( fov, 10, 75 );
        this.camera.updateProjectionMatrix();
    }

    //颜色修改
    onMouseOver(e){
        var intersects = this.rayFun(e);
        if (intersects.name != '') {
            this.selectorMesh = intersects;
            this.selectorMesh.material.color = new THREE.Color(0x00ff00);
        }else {
            if(this.selectorMesh == null)return;
            this.selectorMesh.material.color = new THREE.Color(0xffffff);
        }
    }

    //射线检测
    rayFun(event) {
        this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        this.raycaster.setFromCamera(this.mouse,this.camera );
        var intersects = this.raycaster.intersectObjects(this.scene.children);
        return intersects[0].object;
    }


    //截图功能
    saveImg(){
        var image = new Image();
        this.renderer.render(this.scene, this.camera);
        var imgData = this.renderer.domElement.toDataURL("image/jpeg");
        $('.wrapper').attr("src",imgData);
    }

    getImgAjax(options){
        var info;
        if(!options.x||!options.y){
            options.x=104.71850395202637;
            options.y=31.51263400912285;
        }
        var url = options.imgId != undefined?this.imgUrl+"?id="+options.imgId:this.imgUrl+"?x="+options.y+"&y="+options.x;
        $.ajax({
            type: "POST",
            async:false,
            url: url,
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