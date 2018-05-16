<template>
	<div class="hintBox" v-if ="question.content">
            <div class="hintBox">
                <img v-for="(img,index) in imgs" class="hintImg" @click ="showHint" :src=img v-if="index==ids" />
            </div>
            <div class="hintObj">
                <div class="hintTitle" :class="{'helpIn':isIn,'helpOut':isOut}">
                    {{question.content}}
                </div>
            </div>
    </div>
</template>
<script type="text/javascript">
let ids=0;
let imageInfo = [];
export default{
    name:'Title',
    data:function(){
        return {
            question:'',
            imgs:[
                    'static/imgs/dhint.png',
                    'static/imgs/shint.png'
                  ],
            ids:ids,
            isIn:false,
            isOut:false
        }
    },
    mounted(){
        let self = this;
        let loader = new createjs.LoadQueue(false);
        loader.addEventListener("fileload", handleFileLoad);
        loader.addEventListener("complete",completeHandler);
        loader.loadFile("static/gameConfig.json");
        function handleFileLoad(evt) {
            if (evt.item.type == "json") {
                imageInfo = evt.result.gamepage;
            }
        }
        function completeHandler(ev) {
            ev.currentTarget.removeEventListener("fileload", handleFileLoad);
            ev.currentTarget.removeEventListener("complete", completeHandler);

            self.question = imageInfo.tips;
        }
    },
    methods:{
       'showHint':function(){
            if(this.ids==0){
                this.ids=1;
                this.isIn=true;
                this.isOut=false;
            }else{
                this.ids=0;
                this.isIn=false;
                this.isOut=true;
            }
       }
    }
}
</script>
<style scoped>
    .hintImg{
        width:.86rem;
        height:.86rem;
        position:absolute;
        right:.5rem;
        top:.24rem;
        z-index:2;
    }
    .hintImg:hover{
        cursor:pointer;
}
    .hintObj{
        width:18rem;
        height:1rem;
        overflow:hidden;
        position:absolute;
        right:.8rem;
        top:.25rem;

}
    .hintTitle{
        padding:0rem 1rem 0rem .6rem;
        height:.76rem;
        line-height:.76rem;
        text-align:center;
        border-radius:5rem 5rem 5rem 5rem;
        background:rgba(37,37,37,.8);
        font-size:.34rem;
        font-family:Microsoft Yahei;
        color:#FFF;
        position:absolute;
        right:-15.5rem;
        top:0.06rem;
        vertical-align:top;
}
.helpIn{
    -moz-animation: helpIn 0.5s both ease-in;
    -wbkit-animation: helpIn 0.5s both ease-in;
    animation: helpIn 0.5s both ease-in;
}
@-webkit-keyframes helpIn{
    0% {
         right:-8.5rem;
    }
    100% {
        right:0rem;
    }
}
@-moz-keyframes helpIn{
    0% {
         right:-8.5rem;
    }
    100% {
        right:0rem;
    }
}
@keyframes helpIn{
    0% {
        right:-8.5rem;
    }
    100% {
        right:0rem;
    }
}
.helpOut{
    -moz-animation: helpOut 0.5s both ease-in;
    -wbkit-animation: helpOut 0.5s both ease-in;
    animation: helpOut 0.5s both ease-in;
}

@-webkit-keyframes helpOut{
    0% {
       right:0rem;
    }
    100% {
        right:-8.5rem;
    }
}
@-moz-keyframes helpOut{
    0% {
       right:0rem;
    }
    100% {
         right:-8.5rem;
    }
}
@keyframes helpOut{
    0% {
       right:0rem;
    }
    100% {
         right:-8.5rem;
    }
}
</style>
