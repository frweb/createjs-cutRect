const tophp = require('../tophp');
export default {
  data() {
    return {
      time: 5,
      fadeIn:false,
    }
  },
  methods:{
    click(){
      tophp.postClose();
    }
  },
  mounted() {
    this.fadeIn=true;
    const time = setInterval(() => {
      this.time--;
      if (this.time === 0) {
        clearInterval(time);
        tophp.postClose();
      }
    }, 1000)
  }
}
