<template>
    <div>
        <canvas id="canvas" width="1920" height="1080"
                style="position: absolute; display: block; background-color:rgba(255, 255, 255, 1.00);width:19.2rem;height:10.8rem"></canvas>
    </div>
</template>
<script>
    export default {
        data() {
            return {}
        },
        methods: {},
        mounted() {
            let canvas, stage;
            let shape1;
            let position, figurePosition;
            let cutNumber;
            let gameInfo = {};
            let moveX,
                moveY,
                toX,
                toY;
            let obj = {};
            let _this = this;

            canvas = document.getElementById("canvas");
            stage = new createjs.Stage(canvas);
            createjs.Touch.enable(stage);
            createjs.Ticker.setFPS(10);
            createjs.Ticker.addEventListener("tick", handleTicker);

            function handleTicker() {
                stage.update();
            }

            let loader = new createjs.LoadQueue(false);
            loader.addEventListener("fileload", handleFileLoad);
            loader.addEventListener("complete", completeHandler);
            loader.loadFile("static/gameConfig.json");

            function handleFileLoad(e) {
                gameInfo = e.result.gamePage;
                figurePosition = gameInfo.figurePositionList[0].positionList;
                cutNumber = gameInfo.figurePositionList[0].cutNumber;
            }

            function completeHandler(e) {
                let bitmap = new createjs.Bitmap(gameInfo.bgImage);
                position = drawLineFigure(figurePosition).arr;
                shape1 = drawLineFigure(figurePosition).shape;
                shape1.selected = true;
                shape1.types = 'shape';
                shape1.position = position;
                shape1.arr = figurePosition;
                // stage.addChild(bitmap);
                stage.addChild(shape1);
                stage.update();
            }

            function drawLineFigure(arr,item) {
                console.log(item);
                let shape = new createjs.Shape();
                let graphics = shape.graphics;
                let newArr = [];
                let bgImg = new createjs.Bitmap('static/imgs/rect.png');
                if(item)
                {
                    // bgImg.x = item.x;
                    // bgImg.y = item.y;
                }
                else{
                    // bgImg.x = 0;
                    // bgImg.y = 0;
                }
                bgImg.x = 560;
                bgImg.y = 310;
                let container = new createjs.Container();
                graphics.beginStroke("#" + Math.floor(Math.random() * 16777215).toString(16));
                graphics.setStrokeStyle(3);
                // graphics.beginFill("#" + Math.floor(Math.random() * 16777215).toString(16));
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
                bgImg.mask = shape;
                container.addChild(shape);
                container.addChild(bgImg);
                return {arr: newArr, shape: container};
            }

            function segmentsIntr(a, b, c, d) {
                let denominator = (b.y - a.y) * (d.x - c.x) - (a.x - b.x) * (c.y - d.y);
                if (denominator === 0) {
                    return false;
                }
                let x = ((b.x - a.x) * (d.x - c.x) * (c.y - a.y)
                    + (b.y - a.y) * (d.x - c.x) * a.x
                    - (d.y - c.y) * (b.x - a.x) * c.x) / denominator;
                let y = -((b.y - a.y) * (d.y - c.y) * (c.x - a.x)
                    + (b.x - a.x) * (d.y - c.y) * a.y
                    - (d.x - c.x) * (b.y - a.y) * c.y) / denominator;
                if (
                    (x - a.x) * (x - b.x) <= 0 && (y - a.y) * (y - b.y) <= 0
                    && (x - c.x) * (x - d.x) <= 0 && (y - c.y) * (y - d.y) <= 0
                ) {
                    return {
                        x: x,
                        y: y
                    }
                }
                return false
            }

            function drawNewFigure(elementPosition, dynamicLine) {
                let newArr = [];
                let indexArr = [];
                let newFigurePosition1 = [];
                let newFigurePosition2 = [];
                let newPosition = [];
                newPosition = figurePosition.map((item) => {
                    return item
                });
                elementPosition.map((item) => {
                    newArr.push(segmentsIntr(item.start, item.end, dynamicLine.start, dynamicLine.end));
                    return item;
                });
                let num = 0;
                newArr.map((item, index) => {
                    if (typeof(item) === 'object') {
                        ++num;
                        if (num === 1) {
                            newPosition.splice((index + 1), 0, item);
                            indexArr.push(index + 1);

                        } else {
                            newPosition.splice((index + 2), 0, item);
                            indexArr.push(index + 2);
                        }
                    } else {

                    }
                    return item
                });
                if (indexArr.length === 2) {
                    newFigurePosition1 = newFigurePosition1.concat(newPosition.slice(0, indexArr[0] + 1), newPosition.slice(indexArr[1], newPosition.length));
                    newFigurePosition2 = newFigurePosition2.concat(newPosition.slice(indexArr[0], indexArr[1] + 1));
                    return {
                        status: true,
                        shapeList: [newFigurePosition1, newFigurePosition2],
                        shapePositionList: [],
                        number: 1
                    };
                } else {
                    return false;
                }
            }

            function intersection(obj) {
                return Math.abs((parseInt(obj.end.y - obj.start.y)) / (parseInt(obj.end.x - obj.start.x)));
            }

            function copyArray(arr) {
                return arr.map((e) => {
                    if (typeof e === 'object') {
                        return JSON.parse(JSON.stringify(e));
                    } else {
                        return e;
                    }
                })
            }

            function addSharpEvent(shape) {
                let oldX;
                let oldY;
                shape.addEventListener("mousedown", function (eDown) {
                    eDown.target.status = 0;
                    oldX = eDown.stageX;
                    oldY = eDown.stageY;
                    shape.addEventListener("mouseup",function(x){
                    });
                    stage.addEventListener("pressmove", function (eMove) {
                        eDown.target.parent.status = 2;
                        shape.x += eMove.stageX - oldX;
                        shape.y += eMove.stageY - oldY;
                        oldX = eMove.stageX;
                        oldY = eMove.stageY;


                        stage.removeAllEventListeners('stagemousemove');
                        stage.removeAllEventListeners('stagemouseup');
                        stage.children.map((item, index) => {
                            if (item.types === 'lines') {
                                stage.removeChild(stage.children[index])
                            }
                        });
                    });
                    stage.addEventListener("pressup", function (eUp) {
                        shape.status = 1;
                        if(shape.status!==2){
                            shape.rotation += 10;
                            // shape.status = 1;
                        }
                        console.log(eUp);
                        let arr1 = copyArray(eDown.target.parent.arr);
                        let position1 = copyArray(eDown.target.parent.position);
                        arr1.map((item) => {
                            item.x += (shape.x);
                            item.y += (shape.y);
                            return item;
                        });
                        eDown.target.parent.x1 = eUp.nativeEvent.layerX;
                        eDown.target.parent.y1 = eUp.nativeEvent.layerY;
                        eDown.target.parent.x = shape.x;
                        eDown.target.parent.y = shape.y;
                        position1.map((item) => {
                            item.start.x += (shape.x);
                            item.start.y += (shape.y);
                            item.end.x += (shape.x);
                            item.end.y += (shape.y);
                        });
                        eDown.target.parent.arr1 = arr1;
                        eDown.target.parent.position1 = position1;
                        stage.removeAllEventListeners('pressmove');
                        stage.removeAllEventListeners('pressup');
                    });
                });

            }

            stage.addEventListener('stagemousedown', drawLineDown);

            function drawLineDown(e) {
                moveX = e.target.mouseX;
                moveY = e.target.mouseY;
                stage.addEventListener('stagemousemove', drawLineMove);
                stage.addEventListener('stagemouseup', drawLineUp);
                if (cutNumber <= 0) {
                    stage.removeAllEventListeners()
                }
            }

            function drawLineMove(e) {
                let line;
                line = new createjs.Shape();
                toX = e.target.mouseX;
                toY = e.target.mouseY;
                line.graphics.setStrokeStyle(6).beginStroke("red").moveTo(moveX, moveY).lineTo(toX, toY).closePath();
                line.types = 'lines';
                stage.children.map((item, index) => {
                    if (item.types === 'lines') {
                        stage.removeChild(stage.children[index])
                    }
                });
                stage.addChild(line);
                stage.update();
            }

            function drawLineUp(e) {
                stage.removeAllEventListeners('stagemousemove');
                stage.removeAllEventListeners('stagemouseup');
                if (cutNumber <= 0) {
                    return false;
                }
                stage.children.map((item, index) => {
                    if (item.types === 'lines') {
                        stage.removeChild(stage.children[index])
                    }
                });
                toX = e.target.mouseX;
                toY = e.target.mouseY;
                obj = {
                    start: {
                        x: moveX,
                        y: moveY
                    },
                    end: {
                        x: toX,
                        y: toY
                    }
                };
                let shapeChildren = stage.children;
                let statusArr = [];
                shapeChildren.map((item, index) => {
                    if (item.types === 'shape' && item.types) {
                        figurePosition = [];
                        position = [];
                        let position1 = [];
                        if (item.status === 2) {
                            figurePosition = item.arr1;
                            position1 = item.position1;
                            position = item.position1;

                        } else {
                            figurePosition = item.arr;
                            position1 = item.position;
                            position = item.position;
                        }
                        let {status, shapeList} = drawNewFigure(position1, obj);
                        item.selected = status;
                        statusArr.push(status);
                        if (status) {
                            console.log(item);
                            shapeList.map((item1) => {
                                let shape = drawLineFigure(item1,item).shape;
                                let position1 = drawLineFigure(item1,item).arr;
                                figurePosition = item1;
                                position = position1;
                                shape.arr = item1;
                                shape.types = 'shape';
                                shape.position = position1;
                                addSharpEvent(shape);
                                stage.addChild(shape);
                                stage.update();
                                return item1;
                            });
                        }
                    }
                    return item;
                });

                function removeChildren() {
                    stage.children.map((item, index) => {
                        if (item.selected) {
                            stage.removeChild(stage.children[index]);
                            removeChildren();
                        }
                        return item;
                    });
                }
                removeChildren();
                if (statusArr.indexOf(true) !== -1) {
                    --cutNumber;
                }
            }
        }
    }
</script>
