<!--
 * @Author: Wushiqi
 * @Descripttion: 大量数据的树形列表分段加载
 * @Date: 2021-03-31 15:57:30
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-04-13 09:59:11
-->
<template>
  <div ref="myPage" class="page-container">
    <el-tree
      ref="policyTree"
      :data="currentTreeData"
      :indent="10"
      default-expand-all
      node-key="id"
    >
      <span slot-scope="{data}">
        <span :title="data.text">{{ data.text }}</span>
      </span>
    </el-tree>
    <div v-if="currentTreeData && currentTreeData.length !== 0" class="tree-footer">
      <i :class="needLoad ? 'el-icon-loading' : ''" />
      <span>{{ needLoad ? '数据加载中' : '---到底啦---' }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    data: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      originTreeData: [], // 原始数据
      currentTreeData: [], // 显示的树形列表
      showNum: 0, // 加载节点的数量
      showNode: 1, // 当前切割组
      cutIndex: 0, // 当前切割节点
      loadingMore: false, // 当前正在加载
      needLoad: false, // 记录是否需要启用滚动加载
      lastShowNode: 0, // 上一切割组
      lastCutIndex: 0, // 子节点上一次切割点
      newLeftData: [], // 存放计算好节点的树形列表
      totalNumber: 0
    }
  },
  mounted() {
    // 造数据
    // this.originTreeData = []
    // for (let i = 0; i < 50; i++) {
      //   let children = []
    //   for (let j = 0; j < Math.ceil(Math.random()*10000); j++) {
      //     // children.push(String(j))
    //     children.push({
      //       children: [],
    //       text: `content${i} - ${j}`,
    //       id: `${i}-${j}`
    //     })
    //   }
    //   this.originTreeData.push({
      //     children,
    //     text: `parent - ${i}`,
    //     id: `${i}`
    //   })
    // }
    // 从父组件获取数据
    this.$nextTick(() => {
      this.originTreeData = this.data
      this.dataInit()
    })
    window.addEventListener('scroll', this.scroll, true)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.scroll, true)
  },
  methods: {
    dataInit() {
      const _this = this
      _this.totalNumber = 0
      // 清除子节点
      _this.newLeftData = Array.from(JSON.parse(JSON.stringify(_this.originTreeData)), val => {
        _this.totalNumber += val.children.length
        val.children = []
        return val
      })
      console.log('总的节点', _this.totalNumber);
      _this.loadingMore = false
      let numbers = 0
      _this.needLoad = false
      for (let i = 0; i < _this.originTreeData.length; i++) {
        const cur = _this.originTreeData[i]
        numbers += cur.children.length
        if (numbers >= 50) {
          _this.needLoad = true // 节点超过50个，启用分段
          break
        }
      }
      _this.showNum = 0
      _this.showNode = 1
      let showNum = 0
      if (_this.needLoad) { // 需要分段加载
        const originTreeData = JSON.parse(JSON.stringify(_this.originTreeData))
        for (let i = 0; i < originTreeData.length; i++) {
          const val = originTreeData[i]
          for (let j = 0; j < val.children.length; j++) {
            if (showNum < 20) { // 如果节点数小于20,则递加
              showNum++
            } else if (showNum === 20) { // 节点数量等于20时，记录当前的位置
              _this.showNum = showNum // 记录当前显示的节点数量
              _this.showNode = i // 记录当前组（父节点）数
              _this.cutIndex = j // 当前子节点分割点
              break
            }
          }
          if (_this.showNum === 20) { // 找到第20个节点后，结束循环
            break
          }
        }
        _this.lastCutIndex = _this.cutIndex // 首次加载后，上一次切割点等于当前切割点
        originTreeData.forEach((val, i) => {
          let data = [] // 获取待加载的子节点
          if (i < _this.showNode) { // 非待加载的组：已经加载了或节点数量不足20，直接将所有节点都拿到
            data = val.children
          } else if (i === _this.showNode) { // 待加载的组
            data = val.children.slice(0, _this.cutIndex) // 截取到第20个节点
          }
          _this.newLeftData[i].children.forEach(val1 => {
            data.map((item, j) => {
              if (item.text === val1.text) { // 防止重复添加节点，已存在的节点从data中删掉
                data.splice(j, 1)
              }
              return item
            })
          })
          _this.newLeftData[i].children.splice(_this.lastCutIndex, 0, ...data) // 从上一切割点后面加上新加载的节点
        })
        // 第一个组内数据超过20时，showNode值为0，这样执行slice没有效果
        // _this.showNode = _this.showNode || 1 // 将0置为1
        _this.currentTreeData = _this.newLeftData.slice(0, _this.showNode + 1) // 截取组
      } else { // 无需分段加载，直接显示所有节点
        _this.currentTreeData = _this.originTreeData
      }
      _this.lastShowNode = _this.showNode // 首次加载后，上一次切割点等于当前切割点
    },
    // 滚动触发事件
    scroll: function() {
      if (this.$refs.myPage) {
        const offsetHeight = this.$refs.myPage.offsetHeight
        const scrollTop = this.$refs.myPage.scrollTop
        const scrollHeight = this.$refs.myPage.scrollHeight
        let loadMore = offsetHeight + scrollTop >= scrollHeight // 判断滚动条是否接触盒子底部
        let endFlag = false // 是否是最后一组且最后一项,如总一组55条，前两次总加载40条，余15条凑不足20，则endFlag置为true
        if (loadMore && !this.loadingMore && this.needLoad) {
          this.loadingMore = true // 准备开始加载
          loadMore = false
          let numbers = 0 // 记录子节点数量
          this.showNum += 20 // 再多显示20条数据
          let stopFlag = false // 结束循环的标志
          for (let i = 0; i < this.originTreeData.length; i++) {
            const val = this.originTreeData[i]
            for (let j = 0; j < val.children.length; j++) {
              if (numbers < this.showNum) { // 节点数量不足，继续循环
                numbers++
                if (i === this.originTreeData.length - 1 && j === val.children.length - 1) { // 走到最后了
                  this.showNode = i // 记录当前组
                  this.cutIndex = j + 1 // 防止漏掉，加个1
                  endFlag = true // 结束标志
                  stopFlag = true // 走到最后一项了，结束循环
                  break
                }
              } else if (numbers === this.showNum) { // 节点数量等于需要加载的数量
                this.showNode = i // 记录当前组
                this.cutIndex = j // 记录分割点
                stopFlag = true // 找到分割点了，结束循环
                break
              }
            }
            if (numbers === this.showNum && stopFlag) { // 结束循环
              break
            }
          }
          if (this.cutIndex === 0) { // 切割点为0的时候，slice()没有效果,因此重置切割点
            this.lastCutIndex = 0
            this.cutIndex = 20
          }
          if (this.needLoad) {
            const originTreeData = JSON.parse(JSON.stringify(this.originTreeData))
            originTreeData.forEach((val, i) => {
              let data = [] // 获取待加载的子节点
              if (i < this.showNode) { // 已加载的或节点数量不足20的，直接拿到所有节点
                data = val.children
              } else if (i === this.showNode) { // 找到切割组
                if (this.lastShowNode === this.showNode) { // 同组内切割，针对一个分组里面有很多数据的情况
                  data = val.children.slice(this.lastCutIndex, this.cutIndex) // 从上次切割的位置开始截取到当前位置
                } else { // 异组切割，从头开始切到当前位置
                  data = val.children.slice(0, this.cutIndex)
                }
              }
              // 去除已添加的节点
              this.newLeftData[i].children.forEach(val => {
                data.map((item, j) => {
                  if (item.text === val.text) {
                    data.splice(j, 1)
                  }
                  return item
                })
              })
              this.newLeftData[i].children.splice(this.lastCutIndex, 0, ...data) // 往组内添加新节点
              if (this.cutIndex === 0) { // 切割点为0的时候，slice()没有效果,因此重置切割点
                this.lastCutIndex = 0
                this.cutIndex = 20
              }
            })
            // 因为添加新组的时候是添加到当前组的后一项的，所以添加的时候要往前删一项
            this.currentTreeData.splice(this.lastShowNode, 1, ...this.newLeftData.slice(this.lastShowNode, this.showNode + 1)) // 添加新组
            // this.loadingMore = false
            this.lastShowNode = this.showNode // 将当前切割组赋值给lastShowNode
            if (this.cutIndex === this.originTreeData[this.showNode].children.length) { // 如果当前切割位置等于组内节点长度，表示最后一项了
              this.lastCutIndex = 0 // 给lastCutIndex赋值为0
            } else {
              this.lastCutIndex = this.cutIndex // 否则将当前切割点赋值给lastCutIndex
            }
            console.time('渲染')
            this.$nextTick(() => {
              this.needLoad = !endFlag // 走到最后endFlag值为true，结束分段加载
              this.loadingMore = false // 渲染完毕
              console.timeEnd('渲染')
            })
          }
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.page-container {
  // width: 200px;
  // height: 350px;
  // margin: 50px auto;
  border: 1px solid rgb(97, 115, 167);
  overflow: auto;
  .tree-footer {
    font-size: 14px;
    text-align: center;
    color: #777;
    line-height: 28px;
    margin-bottom: 3px;
  }
}
</style>