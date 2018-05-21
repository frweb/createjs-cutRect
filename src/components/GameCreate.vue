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
            canvas = document.getElementById("canvas");
            stage = new createjs.Stage(canvas);
            createjs.Touch.enable(stage);
            createjs.Ticker.setFPS(10);
            createjs.Ticker.addEventListener("tick", handleTicker);

            function handleTicker() {
                stage.update();
            }
            canvas.addEventListener('mousewheel', function (e) {
                moveX = e.offsetX;
                moveY = e.offsetY;
                document.title = 'x:' + moveX + ',' + 'y:' + moveY;
            });
            let _this = this;
            let loader = new createjs.LoadQueue(false);

            loader.addEventListener("fileload", handleFileLoad);
            loader.addEventListener("complete", completeHandler);
            loader.loadFile("static/gameConfig.json");
            function handleFileLoad(e) {
                gameInfo = e.result.gamePage;
                figurePosition = gameInfo.figurePosition[0].position;
                cutNumber = gameInfo.figurePosition[0].cutNumber;
            }

            function completeHandler(e) {
                let bitmap = new createjs.Bitmap(gameInfo.bgImage);
                position = drawLineFigure(figurePosition).arr;
                shape1 = drawLineFigure(figurePosition).shape;
                shape1.selected = true;
                stage.addChild(bitmap);
                stage.addChild(shape1);
                stage.update();
            }
            let gameInfo = {};

            function drawLineFigure(arr) {
                let shape = new createjs.Shape();
                let graphics = shape.graphics;
                let newArr = [];
                graphics.beginStroke("#" + Math.floor(Math.random() * 16777215).toString(16));
                graphics.setStrokeStyle(3);
                graphics.beginFill("#" + Math.floor(Math.random() * 16777215).toString(16));
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
                return {arr: newArr, shape: shape};
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
                if (indexArr.length < 2) {
                    return false;
                } else {
                    newFigurePosition1 = newFigurePosition1.concat(newPosition.slice(0, indexArr[0] + 1), newPosition.slice(indexArr[1], newPosition.length));
                    newFigurePosition2 = newFigurePosition2.concat(newPosition.slice(indexArr[0], indexArr[1] + 1));
                    return {
                        status: true,
                        shapeList: [newFigurePosition1, newFigurePosition2],
                        shapePositionList: [],
                        number: 1
                    };
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
                shape.addEventListener("mousedown", function (e) {
                    e.target.status = 0;
                    oldX = e.stageX;
                    oldY = e.stageY;
                });
                shape.addEventListener("dblclick", function (e) {
                });
                shape.addEventListener("pressmove", function (e) {
                    e.target.status = 10;
                    e.target.x += e.stageX - oldX;
                    e.target.y += e.stageY - oldY;
                    oldX = e.stageX;
                    oldY = e.stageY;
                    stage.removeAllEventListeners('stagemousemove');
                    stage.removeAllEventListeners('stagemouseup');
                    stage.children.map((item, index) => {
                        if (item.status === 2) {
                            stage.removeChild(stage.children[index])
                        }
                    });
                });
                shape.addEventListener("pressup", function (e) {
                    let x = e.target.x;
                    let y = e.target.y;
                    let arr1 = copyArray(e.target.arr);
                    let position1 = copyArray(e.target.position);
                    arr1.map((item) => {
                        item.x += (x);
                        item.y += (y);
                        return item;
                    });
                    position1.map((item) => {
                        item.start.x += (x);
                        item.start.y += (y);
                        item.end.x += (x);
                        item.end.y += (y);
                    });
                    e.target.arr1 = arr1;
                    e.target.position1 = position1;
                });
            }

            let moveX,
                moveY,
                toX,
                toY;
            let obj = {};
            let line;
            stage.addEventListener('stagemousedown', drawLineDown);

            function drawLineDown(e) {
                moveX = e.target.mouseX;
                moveY = e.target.mouseY;
                stage.addEventListener('stagemousemove', drawLineMove);
                stage.addEventListener('stagemouseup', drawLineUp);
                if(cutNumber <= 0){
                    stage.removeAllEventListeners()
                }
            }

            function drawLineMove(e) {
                line = new createjs.Shape();
                toX = e.target.mouseX;
                toY = e.target.mouseY;
                line.graphics.setStrokeStyle(6).beginStroke("red").moveTo(moveX, moveY).lineTo(toX, toY).closePath();
                line.status = 2;
                stage.children.map((item, index) => {
                    if (item.status === 2) {
                        stage.removeChild(stage.children[index])
                    }
                });
                stage.addChild(line);
                stage.update();
            }

            function drawLineUp(e) {
                stage.removeAllEventListeners('stagemousemove');
                stage.removeAllEventListeners('stagemouseup');
                if(cutNumber <= 0)
                {
                    return false;
                }
                stage.children.map((item, index) => {
                    if (item.status === 2) {
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
                if (shapeChildren.length > 2) {

                    let statusArr = [];
                    shapeChildren.map((item, index) => {
                        if (item.type === 'shape' && item.type) {
                            figurePosition = [];
                            position = [];
                            let position1 =[];
                            if(item.status === 10)
                            {
                                figurePosition = item.arr1;
                                position1 = item.position1;
                                position = item.position1;

                            }else{
                                figurePosition = item.arr;
                                position1 = item.position;
                                position = item.position;
                            }
                            let {status, shapeList} = drawNewFigure(position1, obj);

                            item.selected = status;
                            statusArr.push(status);

                            if (status) {
                                shapeList.map((item1) => {
                                    let shape = drawLineFigure(item1).shape;
                                    let position1 = drawLineFigure(item1).arr;
                                    figurePosition = item1;
                                    position = position1;
                                    shape.arr = item1;
                                    shape.type = 'shape';
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
                        });
                    }
                    removeChildren();
                    if(statusArr.indexOf(true)!==-1)
                    {
                        --cutNumber;

                    }
                }
                else {
                    let {status, shapeList} = drawNewFigure(position, obj);
                    if (status) {
                        --cutNumber;
                        stage.children.map((item, index) => {
                            if (item.selected) {
                                stage.removeChild(stage.children[index])
                            }
                        });
                        position = [];
                        figurePosition = [];
                        shapeList.map((item) => {
                            let shape = drawLineFigure(item).shape;
                            let position = drawLineFigure(item).arr;
                            shape.arr = item;
                            shape.position = position;
                            shape.type = 'shape';
                            addSharpEvent(shape);
                            stage.addChild(shape);
                            stage.update();
                            return item;
                        });
                    } else {

                    }
                }
            }
        }
    }
</script>
