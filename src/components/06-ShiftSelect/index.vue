<template>
  <div class="page-container">
    <el-button @click="checkAll(true)">全选</el-button>
    <el-button @click="checkAll(false)">全不选</el-button>
    <el-button @click="checkInvert">反选</el-button>
    <el-checkbox-group v-model="selectData" class="checkbox-group" @change="selectionChange">
      <el-checkbox v-for="(val, key) in listData" :key="key" :label="val" @click.native="itemClick(val)">{{ val.name }}</el-checkbox>
    </el-checkbox-group>
  </div>
</template>

<script>
import { debounce } from '@/common/debounce' // 引入防抖函数
// 参考链接 https://blog.csdn.net/weixin_43734545/article/details/103582536
export default {
  props: {
    data: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      origin: -1, // 这里给一个变量作为起点
      pin: false, // 这里给一个变量，默认为false，不按住
      listData: [],
      selectData: [] // 勾选的数据
    }
  },
  watch: {
    origin(val) {
      console.log(val);
    },
    selectData(val) {
      this.$emit('change', val)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.listData = this.data
    })
    window.addEventListener('keydown', code => this.handleKeyDown(code)) // 监听键盘按下事件
    window.addEventListener('keyup', code => this.handleKeyUp(code)) // 监听键盘松开事件
  },
  beforeDestroy() {
    // 销毁监听键盘事件
    window.removeEventListener('keydown', code => this.handleKeyDown(code))
    window.removeEventListener('keyup', code => this.handleKeyUp(code))
  },
  created() {
    this.listData.forEach((item, index) => { // 遍历索引,赋值给data数据
      item.index = index
    })
  },
  methods: {
    // 多选框勾选触发
    selectionChange(item) {
      const data = this.listData // 获取所有数据
      const origin = this.origin // 起点数 从-1开始
      const endIdx = item.length === 0 ? -1 : item[item.length - 1].index // 终点数
      // console.log(origin);
      // console.log('是否批量', this.pin && item.includes(data[origin]));
      if (this.pin && item.includes(data[origin])) { // 判断按住
        const sum = Math.abs(origin - endIdx) + 1 // 这里记录终点
        const min = Math.min(origin, endIdx) // 这里记录起点
        let i = 0
        while (i < sum) {
          const index = min + i
          const flagIdx = this.selectData.indexOf(data[index]) // 判断区间内的数据是否已选中
          if (flagIdx === -1) { // 值为-1表示未选中
            this.selectData.push(data[index])
          }
          i++
        }
      } else {
        // this.origin = endIdx // 没按住记录起点
        // console.log(endIdx);
      }
    },
    itemClick(item) {
      if (!this.pin && !this.selectData.includes(item)) {
        this.origin = item.index // 没按住记录起点
      }
    },
    // 监听按下键盘事件
    handleKeyDown: debounce(function(code) {
      if (code.keyCode === 16 && code.shiftKey) { // 判断是否按住shift键，是就把pin赋值为true
        this.pin = true
      }
    }, 500, true),
    handleKeyUp: debounce(function(code) {
      if (code.keyCode === 16) { // 判断是否松开shift键，是就把pin赋值为false
        this.pin = false
      }
    }, 500, true),
    // 全选/全不选
    checkAll(all = true) {
      if (all) {
        this.listData.forEach(data => {
          const flag = this.selectData.indexOf(data)
          if (flag === -1) {
            this.selectData.push(data)
          }
        })
      } else {
        this.selectData = []
      }
    },
    // 反选
    checkInvert: function() {
      const newSelectData = [] // 记录当前未选中的
      this.listData.forEach(data => {
        const flag = this.selectData.indexOf(data)
        if (flag === -1) {
          newSelectData.push(data)
        }
      })
      this.selectData = newSelectData
    }
  }
}
</script>
<style scoped lang="scss">
.page-container {
  // width: 300px;
  border: 1px solid #ccc;
  margin: 20px auto;
  padding: 10px;
  overflow: auto;
}
</style>
<style lang="scss">
.page-container {
  .checkbox-group {
    margin: 10px;
    .el-checkbox {
      display: block;
    }
  }
  .el-input .el-input__count {
    position: relative;
    .el-input__count-inner {
      position: absolute;
      // background-color: coral;
      left: 10px;
    }
  }
  .el-input__icon {
    overflow: hidden;
  }
}
</style>
