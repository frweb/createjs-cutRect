//1. 大部分情况按照顺序答题，id依次累加
//2. 答题错误，需要告知正确答案


export class AnswerInfo {
    constructor() {

        if (typeof AnswerInfo.type === 'undefined' || AnswerInfo.type === null) {
            throw new Error('AnswerInfo.type is not defined!')
        }

        if (typeof AnswerInfo.testNum === 'undefined' || AnswerInfo.testNum === null) {
            throw new Error('AnswerInfo.testNum is not defined!')
        }

        this.id = 0;//第几题
        this.useranswer = -1;//学生答案
        this.answer = -1;//正确答案
        this.isright = 1;//已废弃，1：完成，2：未完成
        this.times = 1;//答了几次？超过1次就算错
        this.type = 0;//0：操作类或单选，1：多选，2：填空
        this.rightnum = 1;//填空题答对的个数，选择题跟填空题的"一个空"等价
        this.wrongnum = 0;//填空题答错的个数
    }


    /**
     * @protected
     * @param id
     * @param useranswer
     * @param answer    接受数组或者字符串
     * @param times
     * @param rightnum
     * @param wrongnum
     */
    _init(id, useranswer, answer, times = 1, rightnum = 1, wrongnum = 0) {
        if ((typeof useranswer === 'string' || Array.isArray(useranswer)) &&
            (typeof answer === 'string' || Array.isArray(answer))) {
            this.id = id;
            this.useranswer = useranswer;
            this.answer = answer;
            this.times = times;
            this.rightnum = rightnum;
            this.wrongnum = wrongnum;
        } else {
            throw new Error('useranswer and answer type of value is not support!');
        }
    }

    /**
     *
     * @param id
     * @param useranswer
     * @param answer
     * @param rightnum  正确答案个数    当为单选题或是操作题的时候在myConfig.json中的type参数为0  以此类推
     */
    success(id, useranswer, answer = "", times, rightnum = 1, wrongnum = 0) {
        switch (AnswerInfo.type) {
            //单选、操作
            case 0:
                this._init(id, useranswer, answer, 1, rightnum, wrongnum);
                break;
            //多选
            case 1:
                this._init(id, useranswer, answer, 1, rightnum, wrongnum);
                break;
            //填空
            case 2:
                this._init(id, useranswer, answer, 1, rightnum, wrongnum);
                break;
        }
    }

    /**
     *
     * @param id
     * @param useranswer
     * @param answer
     * @param times
     * @param rightnum
     * @param wrongnum
     */
    fail(id, useranswer, answer, times, rightnum = 0, wrongnum = 1) {
        switch (AnswerInfo.type) {
            //单选、操作
            case 0:
                this._init(id, useranswer, answer, times, 0, 1);
                break;
            //多选
            case 1:
                this._init(id, useranswer, answer, 1, rightnum, wrongnum);
                break;
            //填空
            case 2:
                this._init(id, useranswer, answer, 1, rightnum, wrongnum);
                break;
        }
    }
}


/**
 * 提交
 * @param postArr
 * @param testNum
 */
export function postAnswer(postArr, testNum) {

    let data = {
        type: 'submitAnswer',
        data: {
            testAnswer: postArr,
            testNum: testNum
        }
    };
    console.log('submitAnswer', data);
    window.parent.postMessage(data, '*');

}

/**
 * 关闭页面
 */
export function postClose() {
    let data = {type: 'close'};
    window.parent.postMessage(data, '*');
}


/**
 * 模拟后台返回数据
 */
export function resubmitAnswer() {
    let e = new Event('message');
    e.data = {
        type: 'resubmitAnswer'
    };
    window.dispatchEvent(e);
}

/**
 * 模拟后台返回数据
 */
export function answerResult() {
    let e = new Event('message');
    e.data = {
        type: 'answerResult',
        data: {
            goldnum: 999
        }
    };
    window.dispatchEvent(e);
}


