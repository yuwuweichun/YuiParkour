<template>
  <div id="score">得分：{{ score }} | 记录：{{ highScore }}</div>
</template>
  
<script>
export default {
  props: {
    score: Number,
    isGameOver: Boolean,
  },
  data() {
    return {
      highScore: 0,
    };
  },
  mounted() {
    this.highScore = this.score; // 初始化最高分
    this.startScoreUpdate(); // 启动得分更新
  },
  methods: {
    startScoreUpdate() {
      const updateScore = () => {
        if (!this.isGameOver) {
          this.$emit('update:score', this.score + 1);

          if(this.score + 1 > this.highScore) {
            this.highScore = this.score + 1; // 更新最高分
          }
          requestAnimationFrame(updateScore); // 使用 requestAnimationFrame 进行更新
        }
      };
      requestAnimationFrame(updateScore); // 启动更新
    },

    stopScoreUpdate() {
      clearInterval(this.scoreInterval);
    }
  },
  beforeUnmount() {
    this.stopScoreUpdate();
  },
};
</script>

<style scoped>
#score {
  position: absolute;
  top: 60px;
  right: 5%;
  font-size: 20px;
}
</style>
  