<template>
  <div class="kindern">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>幼儿园招生管理</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
              <el-radio-button label="codest">
                <i class="iconfont icon-changsuoma"></i>
                幼儿园管理
              </el-radio-button>
              <el-radio-button label="codend">
                <i class="iconfont icon-shenfenma"></i>
                年度招生管理
              </el-radio-button>
              <el-radio-button label="codeth">
                <i class="iconfont icon-yonghujiluchaxun"></i>
                报名信息&审核管理
              </el-radio-button>
              <el-radio-button label="codefth">
                <i class="iconfont icon-goodsppecategory"></i>
                入学资格系统抽号
              </el-radio-button>
              <el-radio-button label="codeftf">
                <i class="iconfont icon-changsuoma"></i>
                社区管理
              </el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <kindquery ref="fquery" @queryClick="queryClick" @addClick="addClick" @exportClick="exportClick" :frule="tabCard" />
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" element-loading-background="rgba(255, 255, 255, 1)" :element-loading-text="loadingText">
              <el-table-column type="index" prop="pid" label="序号" align="center" width="90px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
                  <template v-if="item.prop == 'issmoke'">
                    {{ row[item.prop] == 0 ? '是' : '否' }}
                  </template>
                  <template v-else-if="item.prop == 'enrollsum'|| item.prop == 'hasfillsum' || item.prop == 'hasenrollsum'">
                    {{ row[item.prop] ? row[item.prop] : 0 }}
                  </template>
                  <template v-else-if="item.prop == 'applystage'">
                    <el-tag :type="row[item.prop] == 1 ? 'primary' : row[item.prop] == 2 ?'success':'warning'">{{row[item.prop] == 1 ? '第一阶段': row[item.prop] == 2 ? '第二阶段':'补录阶段'}}</el-tag>
                  </template>
                  <template v-else>
                    {{ row[item.prop] ? row[item.prop] : '暂无数据' }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column v-if="tabCard == 'codest'" type="index" prop="type" label="办学性质" align="center"
                width="100px">
                <template slot-scope="scope">
                  {{ scope.row.type == 1 ? '公办' : '民办' }}
                </template>
              </el-table-column>
              <el-table-column v-if="tabCard == 'codend'" type="index" prop="type" label="第一阶段报名时间" align="center"
                width="300px">
                <template slot-scope="scope">
                  {{ scope.row.onestarttime }}--{{ scope.row.oneendtime }}
                </template>
              </el-table-column>
              <el-table-column v-if="tabCard == 'codend'" type="index" prop="type" label="第二阶段报名时间" align="center"
                width="300px">
                <template slot-scope="scope">
                  {{ scope.row.twostarttime }}--{{ scope.row.twoendtime }}
                </template>
              </el-table-column>
              <el-table-column label="操作" width="350px" fixed="right">
                <template #default="{ row, $index }">
                  <el-button v-if="tabCard != 'codefth'" type="primary" plain @click.stop="lookClick(row.pid)">
                    查看
                  </el-button>
                  <el-button v-if="tabCard != 'codeth' && tabCard != 'codefth'" type="success" plain
                    @click.stop="editClick(row.pid)">
                    编辑
                  </el-button>
                  <el-button v-if="tabCard == 'codeth' && row.status == 0" type="success" plain @click.stop="editClick(row.pid)">审核</el-button>
                  <el-button v-if="tabCard == 'codefth' && row.chouhaostate == 0" type="success" plain @click.stop="kschClick(row.pid, row.annual, row.chouhaostate)">开始抽号</el-button>
                  <el-button v-if="tabCard == 'codefth'" type="primary" plain @click.stop="infoClick(row.pid, row.annual, row.chouhaostate)">录取信息</el-button>
                  <el-button v-if="tabCard == 'codefth'" type="warning" plain @click.stop="ckjgClick(row.pid, row.annual)">查看结果</el-button>
                  <el-button v-if="tabCard != 'codeth' && tabCard != 'codefth'" type="danger" plain @click.stop="delClick(row.pid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pagenum" :page-size="pagesize" :page-sizes="pageSizes"
              :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <kindernlog ref="kinds" />
    <youerDialog ref="youer" @getData="getData" :tcard="tabCard" />
    <zhaoDialog ref="zhao" @getData="getData" :tcard="tabCard" />
    <shenheDialog ref="shenhe" @getData="getData" :tcard="tabCard" />
    <choujiangDialog ref="choujiang" @getData="getData" :tcard="tabCard" />
    <jieguoDialog ref="jieguo" @getData="getData" :tcard="tabCard" />
    <shequDialog ref="shequ" @getData="getData" :tcard="tabCard" />
    <lookchoujDialog ref="lookinfo" @getData="getData" :tcard="tabCard" />
  </div>
</template>
<script>
import choujiangDialog from './components/choujiangDialog.vue'
import lookchoujDialog from "./components/lookchoujDialog.vue";
import jieguoDialog from './components/jieguoDialog.vue'
import shenheDialog from './components/shenheDialog.vue'
import zhaoDialog from './components/zhaoDialog.vue'
import youerDialog from './components/youerDialog.vue'
import shequDialog from './components/shequDialog.vue'
import kindernlog from './components/kindernlog.vue'
import kindquery from './components/kindquery.vue'
import {
  getkinderlist,
  getbaominglist,
  getzhaolist,
  getkinderdel,
  getzhaoshenglist,
  getzhaoshengdel,
  postDrawingList,
  getAllDrawing,
  getShequlist,
  getshequDel, getFileUrl
} from '@/views/kindern/api/kind'
import {mapGetters} from "vuex";
export default {
  name: 'kindern',
  data() {
    return {
      tabCard: 'codest',
      tableColumns: [],
      tableData: [],
      tabloading: false,
      loadingText: '正在加载...',
      layout: 'total, sizes, prev, pager, next, jumper',
      total: 0,
      pagenum: 1,
      pagesize: 10,
      pageSizes: [10, 15, 20],
      formData: {},
      shstatus: '',
    }
  },
  components: {
    kindquery,
    kindernlog,
    youerDialog,
    zhaoDialog,
    shenheDialog,
    choujiangDialog,
    jieguoDialog,
    shequDialog,
    lookchoujDialog
  },
  computed:{
    ...mapGetters({
      token:'user/token'
    })
  },
  created() { },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods: {
    async getTableFields() {
      if (this.tabCard == 'codest') {
        this.tableColumns = [
          { prop: 'schoolname', label: '幼儿园名称' },
          { prop: 'address', label: '地址' },
          { prop: 'phonenumber', label: '联系电话' },
          // { prop: 'type', label: '办学性质' },
          // {prop: 'communityids', label: '社区名称'},
          // {prop: 'sili', label: '配套小区'},
        ]
      } else if (this.tabCard == 'codend') {
        this.tableColumns = [
          { prop: 'annual', label: '招生年度' },
          // { prop: 'onestarttime', label: '第一阶段报名时间' },
          // { prop: 'twostarttime', label: '第二阶段报名时间' },
          { prop: 'state', label: '当前报名阶段' },
        ]
      } else if (this.tabCard == 'codeth') {
        this.tableColumns = [
          { prop: 'annual', label: '招生年度' },
          { prop: 'schoolname', label: '幼儿园名称' },
          { prop: 'babyname', label: '幼儿姓名' },
          { prop: 'babycard', label: '身份证号' },
          { prop: 'createttime', label: '提交时间' },
          { prop: 'applystage', label: '报名阶段' },

        ]
      } else if (this.tabCard == 'codefth') {
        this.tableColumns = [
          { prop: 'annual', label: '招生年度' },
          { prop: 'schoolname', label: '幼儿园名称' },
          { prop: 'enrollsum', label: '计划招生人数' },
          { prop: 'hasenrollsum', label: '第一阶段已录取' },
          { prop: 'hasfillsum', label: '第二阶段已通过' },
          { prop: 'onestatedate', label: '第一阶段报名时间' },
          { prop: 'twostatedate', label: '第二阶段报名时间' },
        ]
      } else if (this.tabCard == 'codeftf') {
        this.tableColumns = [
          { prop: 'communityname', label: '社区名称' },
        ]
      }
    },
    async getData() {
      let res
      if (this.tabCard == 'codest') {
        this.formData.pagenum = this.pagenum
        this.formData.pagesize = this.pagesize
        res = await getkinderlist(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codend') {
        this.formData.pagenum = this.pagenum
        this.formData.pagesize = this.pagesize
        this.formData.annual = Number(this.formData.annual)
        res = await getzhaoshenglist(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codeth') {
        this.formData.pagenum = this.pagenum
        this.formData.pagesize = this.pagesize
        res = await getbaominglist(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codefth') {
        this.formData.pagenum = this.pagenum
        this.formData.pagesize = this.pagesize
        this.formData.annual = Number(this.formData.annual)
        res = await postDrawingList(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codeftf') {
        this.formData.pagenum = this.pagenum
        this.formData.pagesize = this.pagesize
        res = await getShequlist(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      }
    },
    tabChange(val) {
      // this.tabloading = true
      this.tabCard = val
      this.pagenum = 1
      this.formData = {}
      this.getTableFields()
      this.getData()
      this.$refs.fquery.clearform()
    },
    SizeChange(val) {
      this.pagesize = val
      this.getData()
    },
    CurrentChange(val) {
      this.pagenum = val
      this.getData()
    },
    queryClick(form) {
      this.formData = form
      this.pagenum = 1
      this.getData()
    },
    addClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.youer.showEdit(null, 1)
      } else if (this.tabCard == 'codend') {
        this.$refs.zhao.showEdit(null, 1)
      } else if (this.tabCard == 'codeth') {
        this.$refs.zhao.showEdit(null, 1)
      } else if (this.tabCard == 'codeftf') {
        this.$refs.shequ.showEdit(null, 1)
      }
    },
    lookClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.youer.showEdit(pid, 2)
      } else if (this.tabCard == 'codend') {
        this.$refs.zhao.showEdit(pid, 2)
      } else if (this.tabCard == 'codeth') {
        this.$refs.shenhe.showEdit(pid, 2)
      } else if (this.tabCard == 'codeftf') {
        this.$refs.shequ.showEdit(pid, 2)
      }
    },
    editClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.youer.showEdit(pid, 3)
      } else if (this.tabCard == 'codend') {
        this.$refs.zhao.showEdit(pid, 3)
      } else if (this.tabCard == 'codeth') {
        this.$refs.shenhe.showEdit(pid, 3)
      } else if (this.tabCard == 'codefth') {
        // this.$refs.placeCodeTypeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codeftf') {
        this.$refs.shequ.showEdit(pid, 3)
      }
    },
    infoClick(schoolid, annual, drawingState){
      if (this.tabCard == 'codefth') {
        this.$refs.lookinfo.showEdit(schoolid, annual, drawingState)
      }
    },
    async exportClick(){
      let _this = this
      const loading = _this.$loading({
          lock: true,
          text: '文件下载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.6)'
      });
      axios({
        headers: {Authorization:this.token},
        type: 'application/ json; charset = utf-8',
        method: 'GET',
        url:  `${window.apiURL}/kindergartensfilllog/exportfill`,
        responseType: 'arraybuffer',
      }).then(function (res) {
        const fileName = '人员报名信息.xls';
        const blob = new Blob([res.data]);
        //创建一个a标签并设置href属性，之后模拟人为点击下载文件
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click(); //模拟点击
        //释放资源并删除创建的a标签
        URL.revokeObjectURL(link.href);
        setTimeout(() => {
          loading.close();
          _this.$message.success('文件下载成功！')
        }, 2000);
      });
    },
    kschClick(schoolid, annual, drawingState) {
      if (this.tabCard == 'codefth') {
        this.$refs.choujiang.showEdit(schoolid, annual, drawingState)
      }
    },
    ckjgClick(schoolid, annual) {
      if (this.tabCard == 'codefth') {
        this.$refs.jieguo.showEdit(schoolid, annual)
      }
    },
    delClick(pid) {
      this.$baseConfirm(
        '你确定要删除吗？',
        '删除提示',
        async () => {
          let res
          if (this.tabCard == 'codest') {
            res = await getkinderdel({ pid: pid })
          } else if (this.tabCard == 'codend') {
            res = await getzhaoshengdel({ pid: pid })
          } else if (this.tabCard == 'codeftf') {
            res = await getshequDel({ pid: pid })
          }
          if (res.code == 200) {
            this.$message.success('删除成功')
            this.getData()
          }
        },
        () => {
          this.$message.info('已取消删除')
        }
      )
    },
  },
}
</script>
<style scoped lang="scss">
@import './style/kind.scss';
</style>
