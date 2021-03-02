<!--
 * @Author: Wushiqi
 * @Descripttion: 快速选择日期（今天、本周、本月、本季、今年）
 * @Date: 2021-01-08 15:41:53
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-02 13:42:14
-->
<template>
  <div style="display:inline-block">
    <el-date-picker
      v-model="dates.startTime"
      clearable
      :style="{width:startWidth+'px'}"
      :picker-options="startOptions"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      @change="dateChange"
    />
    <span>&nbsp;至&nbsp;</span>
    <el-date-picker
      v-model="dates.endTime"
      clearable
      :style="{width:endWidth+'px'}"
      :picker-options="endOptions"
      type="date"
      placeholder="选择日期"
      format="yyyy-MM-dd"
      value-format="yyyy-MM-dd"
      @change="dateChange"
    />
    <el-select
      v-model="chooseDate"
      :style="{width:chooseWidth+'px'}"
      @change="chooseDateChange"
    >
      <el-option
        v-for="(item, key) in chooseDateList"
        :key="key"
        :value="item.value"
        :label="item.label"
      />
    </el-select>
  </div>
</template>

<script>
import chooseDate from './ChooseDate'

export default {
  props: {
    startWidth: {
      default: 200,
      type: Number
    },
    endWidth: {
      default: 200,
      type: Number
    },
    chooseWidth: {
      default: 200,
      type: Number
    }
  },
  data() {
    const _this = this
    return {
      dates: {
        startTime: '',
        endTime: ''
      },
      chooseDate: 1,
      // 快速选择日期下拉框
      chooseDateList: [{
        label: '今天',
        value: 1
      }, {
        label: '本周',
        value: 2
      }, {
        label: '本月',
        value: 3
      }, {
        label: '本季',
        value: 4
      }, {
        label: '今年',
        value: 5
      }],
      startOptions: {
        disabledDate(val) {
          if (_this.dates.endTime) {
            return val > new Date(_this.dates.endTime)
          } else {
            return
          }
        }
      },
      endOptions: {
        disabledDate(val) {
          return val < new Date(_this.dates.startTime) - 8.64e7
        }
      }
    }
  },
  methods: {
    // 快速选择日期变化
    chooseDateChange(val) {
      this.chooseDate = val
      const dates = chooseDate(val)
      this.dates = Object.assign({}, dates)
      this.$emit('change', dates)
    },
    // 重置为默认选中今天
    reset: function() {
      this.chooseDateChange(1)
    },
    // 清除日期
    clear: function() {
      this.dates = Object.assign({
        startTime: '',
        endTime: ''
      })
      this.chooseDate = ''
    },
    // 日期变化
    dateChange: function() {
      this.chooseDate = ''
      this.$emit('change', this.dates)
    }
  }
}
</script>
