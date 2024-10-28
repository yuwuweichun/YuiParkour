<template>
  <div id="game-over">
    <img src="@/assets/duzui.webp" alt="Game Over" />
  </div>
</template>

<script>
export default {};
</script>

<style scoped>
#game-over {
  /**显示在playArea中心 */
  display: flex;
  position: absolute;
  /**边框样式 */
  border-style: solid;
  border-width: 2px;
  border-radius: 4px;
  height: 60vh;
}
</style>
  