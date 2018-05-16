<template>
  <div id="app">
    <!--<img src="static/logo.png" class="logo"/>-->
    <router-view/>
  </div>
</template>

<script>
    const {AnswerInfo, postAnswer, resubmitAnswer, answerResult} = require('./tophp');
    const config = require('../myConfig.json');
    export default {
        name: 'app',
        mounted() {
            const self = this;
            const ANSWER_RESULT = 'answerResult';
            const RESUBMIT_ANSWER = 'resubmitAnswer';

            //todo:必须定义好题目的类型以及总题目数，在config.json中定义。0：单选或操作类，1：多选，2：填空。根据项目情况修改
            AnswerInfo.type = config.answerInfo.type;
            AnswerInfo.testNum = config.answerInfo.testNum;


            //test start==================

            // let answer=new AnswerInfo();
            // answer.success(1,'a');
            // self.$store.dispatch('pushToPostArr', answer);
            //
            // answer=new AnswerInfo();
            // answer.fail(2, 'a', 'b');
            // self.$store.dispatch('pushToPostArr', answer);

            //test end====================


            //测试用，可以在浏览器控制台输入
            //window.resubmitAnswer模拟强制提交，在控制台中会打印提交的数据，页面不会跳转
            //window.answerResult模拟后台返回结果，跳转到金币也，金币数显示为999
            window.resubmitAnswer = resubmitAnswer;
            window.answerResult = answerResult;

            window.addEventListener('message', function (e) {
                //php反馈金币信息
                if (e.data.type === ANSWER_RESULT) {
                    self.$store.state.goldnum = e.data.data.goldnum;
                    self.$router.push('/end');
                }
                //php主动收卷
                else if (e.data.type === RESUBMIT_ANSWER) {
                    if (!self.$store.state.isPost) {
                        self.$store.commit('setIsPost', true);
                        self.$store.dispatch('postAnswer');
                    }
                }
            });
        }
    }
</script>

<style>
  #app {
    position: absolute;
    /*transform: translate(-50%, -50%);*/
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    width: 19.2rem;
    height: 10.8rem;
  }

  .logo {
    position: absolute;
    z-index: 999;
    left: .5rem;
    bottom: .3rem;
    width: 1.9rem;
    /*height: 0.37rem;*/
  }
</style>
