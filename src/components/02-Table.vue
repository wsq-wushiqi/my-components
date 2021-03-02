<!--
 * @Author: Wushiqi
 * @Descripttion: 嵌套表格子表格（与主题样式不一样）
 * @Date: 2021-01-14 08:39:41
 * @LastEditor: Wushiqi
 * @LastEditTime: 2021-03-02 14:03:27
-->
<template>
  <div class="detail-table-container">
    <el-table
      ref="detailTable"
      v-loading="loading"
      :data="tableData"
      :header-cell-style="tabHeadStyle"
      :max-height="height+'px'"
      :size="size"
      class="detail-table"
      border
      stripe
      highlight-current-row
      @row-click="rowClick"
    >
      <el-table-column v-if="showRadio" label="选择" width="50"><template slot-scope="scoped"><el-radio v-model="tableRadio" :label="scoped.row" @click.native="rowClick"><i /></el-radio></template></el-table-column>
      <el-table-column v-for="(item, key) in tableColumns" :key="key" :prop="item.prop" :label="item.label" :min-width="item.minWidth" :width="item.width" align="center" :sortable="item.sortable" :show-overflow-tooltip="item.overflow">
        <template slot-scope="scope">
          <!-- 自定义操作按钮项 -->
          <slot v-if="item.slot" :name="item.prop" :row="scope.row" :index="scope.$index" />
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
// import '@/common/common'
export default {
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    tableData: {
      default: () => [],
      type: Array
    },
    columns: {
      default: () => [],
      type: Array
    },
    height: {
      default: null,
      type: [Number, String]
    },
    showRadio: {
      default: false,
      type: Boolean
    },
    size: {
      default: 'small',
      type: String
    }
  },
  data() {
    return {
      tableRadio: []
    }
  },
  computed: {
    tableColumns() {
      const columns = this.columns
      columns.map((val, i) => {
        if (val.hidden) {
          columns.splice(i, 1)
        }
        return val
      })
      return columns
    }
  },
  methods: {
    // 二级表头样式
    tabHeadStyle: function() {
      return {
        'background-color': '#5576BD',
        'color': '#F1F3F4'
      }
    },
    rowClick: function(row) {
      if (this.tableRadio === row) {
        this.$refs.detailTable.setCurrentRow(null)
        this.tableRadio = []
      } else {
        this.$refs.detailTable.setCurrentRow(row)
        this.tableRadio = row
      }
      this.$emit('rowClick', this.tableRadio)
    },
    // 表格重新计算高度
    doLayout: function() {
      this.$nextTick(() => {
        this.$refs.detailTable.doLayout()
      })
      this.$emit('doLayout')
    },
    setCurrentRow: function(row) {
      this.$nextTick(() => {
        this.tableRadio = row
        if (this.$refs.detailTable) {
          this.$refs.detailTable.setCurrentRow(row)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.detail-table-container {
  /* 鼠标覆盖样式 */
  .el-table tbody tr:hover>td {
    background-color: #E1E3F0!important;
    color: rgb(58, 61, 63);
  }
  .el-table :hover {
    cursor: default;
  }
  /* 表格选中行高亮颜色 */
  .el-table__body tr.current-row>td {
    background: #5576bda1 !important;
    color: rgb(255, 255, 255);
  }
}
</style>
