<template>
  <div ref="bsdFrame" class="bsd-frame" :style="{ background: bgColor }">
    <slot></slot>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Frame',
  props: {
    width: Number,
    height: Number,
    bgColor: {
      type: String,
      default: '#fff'
    }
  },
  data() {
    return {
      frameWidth: 0,
      frameHeight: 0
    }
  },
  computed: {
    ...mapGetters({
      userType: 'userType'
    })
  },
  mounted() {
    this.setSize()
  },
  destroyed() {
    window.removeEventListener('resize', this.setScale)
  },
  methods: {
    setSize() {
      this.frameWidth = this.width || screen.width
      this.frameHeight = this.height || screen.height
      const frame = this.$refs.bsdFrame
      frame.style.width = this.frameWidth + 'px'
      frame.style.height = this.frameHeight + 'px'
      frame.style.width = '100vw'
      frame.style.height = '100vh'
      frame.style.overflow = 'hidden'
    },
    setScale() {
      this.setSize()
      const bodyWidth = document.body.clientWidth
      const bodyHeight = document.body.clientHeight
      const scaleX = bodyWidth / this.frameWidth
      const scaleY = bodyHeight / this.frameHeight
      this.$refs.bsdFrame.style.transform = `scale(${scaleX},${scaleY})`
    }
  }
}
</script>
<style>
.bsd-frame {
  position: fixed;
  transform-origin: left top;
}
</style>
