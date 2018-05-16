<template>
    <div>
        <canvas id="canvas" width="1920" height="1080"
                style="position: absolute; display: block; background-color:rgba(255, 255, 255, 1.00);width:19.2rem;height:10.8rem"></canvas>
        <canvas id="canvas1" width="1920" height="1080"
                style="position: absolute; display: block; background-color:rgba(255, 255, 255, 0.1);width:19.2rem;height:10.8rem"></canvas>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        methods: {},
        mounted() {

            let canvas, stage, canvas1, stage1, position;
            let shape1, shape2, shape3;
            canvas = document.getElementById("canvas");
            stage = new createjs.Stage(canvas);
            canvas1 = document.getElementById("canvas1");
            stage1 = new createjs.Stage(canvas1);
            createjs.Touch.enable(stage);
            createjs.Ticker.setFPS(10);
            createjs.Ticker.addEventListener("tick", handleTicker);
            function transformOrigin(obj,x,y,width,height,rotate){
                // obj.regX = width/2;
                // obj.regY = height/2;
                // obj.x = x + width/2;
                // obj.y = y + width/2;
                // obj.rotation = rotate;
            }
            function handleTicker() {

                // shape1.setTransform(canvas.width / 2, canvas.height / 2);
                // shape1.x  = 200;
                // shape1.y  = 200;
                // transformOrigin(shape1,200,400,400,200,);
                shape1.x = 200;
                shape1.y = 200;
                shape1.regX  = 400;
                shape1.regY  = 300;
                shape1.rotation += 8;
                stage.update();
            }
            canvas1.addEventListener('mousewheel', function(e){

                let  moveX = e.clientX;
                let  moveY = e.clientY;
                document.title='x:'+moveX+','+'y:'+moveY;
            });
            //init
            let _this = this;
            //loader
            let loader = new createjs.LoadQueue(false);

            loader.addEventListener("fileload", handleFileLoad);
            loader.addEventListener("complete", completeHandler);
            loader.loadFile("static/gameConfig.json");

            let gameInfo = {};

            function drawLineFigure(arr) {
                let shape = new createjs.Shape();
                let graphics = shape.graphics;
                let newArr = [];
                graphics.beginStroke("#"+Math.floor(Math.random()*16777215).toString(16));
                graphics.setStrokeStyle(3);
                graphics.beginFill("#"+Math.floor(Math.random()*16777215).toString(16));
                for (let i = 0; i < arr.length; i++) {
                    if (i === 0) {
                        graphics.moveTo(arr[0].x, arr[0].y);
                        graphics.lineTo(arr[1].x, arr[1].y);
                    }
                    if (i === arr.length - 1) {
                        graphics.lineTo(arr[0].x, arr[0].y);
                        newArr.push({
                            start: {
                                x: arr[arr.length - 1].x,
                                y: arr[arr.length - 1].y,
                            },
                            end: {
                                x: arr[0].x,
                                y: arr[0].y,
                            }
                        })
                    } else {
                        graphics.lineTo(arr[i + 1].x, arr[i + 1].y);
                        newArr.push({
                            start: {
                                x: arr[i].x,
                                y: arr[i].y,
                            },
                            end: {
                                x: arr[i + 1].x,
                                y: arr[i + 1].y,
                            }
                        })
                    }

                }
                // stage.setChildIndex(shape,12);
                // stage.addChild(shape);
                // stage.update();
                return {arr: newArr, shape: shape};
            }

            let figurePosition = [
                {
                    x: 200,
                    y: 200
                },
                {
                    x: 600,
                    y: 200
                },
                {
                    x: 600,
                    y: 400
                },
                {
                    x: 200,
                    y: 400
                }
            ];


            function handleFileLoad(e) {
                gameInfo = e.result.gamePage;
            }

            function completeHandler(e) {
                position = drawLineFigure(figurePosition).arr;
                shape1 = drawLineFigure(figurePosition).shape;
                // shape1.x = 1000;
                // shape1.y = 1000;
                console.log(shape1)
                stage.addChild(shape1);
                stage.update();
            }
        }
    }
</script>


]}