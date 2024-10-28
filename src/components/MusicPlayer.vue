<template>
  <div id="music-player">
    <div id="record" @click="toggleMusic">
      <img :class="{ spinning: isPlaying }" src="../assets/record.png" alt="唱片" />
    </div>
  </div>
</template>

<script>
import music from '../assets/huahuadan.mp3'; // 导入音乐文件

export default {
  data() {
    return {
      isPlaying: false, // 音乐播放状态
      audio: new Audio(music), // 创建音频对象
    };
  },
  mounted() {
    // 组件挂载后自动播放音乐并设置播放状态为 true
    this.audio.play();
    this.isPlaying = true;

    // 添加事件监听器，音乐播放结束后重新播放
    this.audio.addEventListener('ended', () => {
      this.audio.currentTime = 0; // 将当前时间重置为 0
      this.audio.play(); // 重新播放音乐
    });
  },
  methods: {
    toggleMusic() {
      if (this.isPlaying) {
        this.audio.pause(); // 暂停音乐
      } else {
        this.audio.play(); // 播放音乐
      }
      this.isPlaying = !this.isPlaying; // 切换播放状态
    },
  },
};
</script>

<style scoped>
#music-player {
  position: absolute; /* 绝对定位 */
  top: 20px; 
  left: 5%;
}

#record {
  cursor: pointer; /* 鼠标悬停时显示为手型 */
  margin-right: 10px; /* 唱片与按钮之间的间距 */
}

#record img {
  width: 70px; 
  height: 70px; 
}

.spinning {
  animation: spin 8s linear infinite; /* 添加旋转动画 */
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
