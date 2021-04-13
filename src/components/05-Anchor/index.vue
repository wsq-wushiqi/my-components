<!--
 * @Author: Wushiqi
 * @Descripttion: 
 * @Date: 2021-03-29 14:56:56
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-04-13 10:47:55
-->
<template>
  <div>
    <el-input v-model="searchVal" placeholder="输入内容快速定位" class="anchor-input" clearable @input="searchValIpt" />
    <div class="list">
      <el-checkbox-group v-model="selectData" @change="selectionChange">
        <ul>
          <li v-for="(item, key) in policyDatas" :key="key" :ref="'ref'+item.index">
            <el-checkbox :label="item" @click.native="itemClick(item)">{{ item.value }}</el-checkbox>
          </li>
        </ul>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/common/debounce' // 引入防抖函数

export default {
  props: {
    data: {
      default: () => [],
      type: Array
    }
  },
  data() {
    return {
      selectData: [], // 勾选的数据,
      policyDatas: [],
      searchVal: ''
    }
  },
  mounted() {
    // 从父组件获取数据
    this.$nextTick(() => {
      this.policyDatas = this.data
    })
  },
  methods: {
  	searchValIpt: debounce(function(val) {
      if (val) {
        for (let i = 0; i < this.policyDatas.length; i++) {
          const item = this.policyDatas[i]
          if (item.value.includes(val)) {
            this.scrollToAnchor(item.index)
            break
          }
        }
      }
    }, 500, false),
    scrollToAnchor: function(index) {
      const ref = `ref${index}`
      // scrollIntoView(true)参数值为true元素的顶端与所在滚动区的顶端对齐;为false表示元素的底端与滚动去底端对齐
      var auchor = this.$refs[ref][0]
      auchor.scrollIntoView(true)
      document.body.scrollTop = auchor.offsetTop // 当前元素距离滚动区域顶部内边距的距离
    },
    selectionChange(list) {
      this.$emit('change', list)
    },
    itemClick(item) {
      this.$emit('itemClick', item)
    }
  }
}

</script>

<style lang="scss" scoped>
.list {
  overflow: auto;
  width: 100%;
  height: calc(100% - 40px);
  ul {
    padding: 2px 5px;
    margin: 0;
  }
  ul li {
    list-style: none;
    width: 100%;
    height: 24px;
    line-height: 24px;
    margin-bottom: 2px;
  }
  .el-checkbox {
    width: 100%;
  }
}
</style>