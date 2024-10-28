<template>
  <div id="playArea">
    <canvas id="playAreaCanvas" ref="playAreaCanvas"></canvas>
  </div>
</template>

<script>
export default {
  props: ['isGameOver', 'startGame'],
  methods: {
  },
  
  mounted() {
    this.startGame();
  },
};
</script>

<style scoped>
#playArea {
  width: 90vw;
  height: 80vh;
  border-style: solid;
  border-radius: 6px;
  border-width: 3px;
  border-color: black;
  margin-top: 20px;
}
</style>
