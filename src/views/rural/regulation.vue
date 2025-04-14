<template>
  <div class="regulation">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>类型规则管理</span>
      </div>
      <div class="hflex">
        <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
          <el-radio-button label="country">乡村榜单类型管理</el-radio-button>
          <el-radio-button label="township">乡情圈积分管理</el-radio-button>
        </el-radio-group>
      </div>
      <div class="text item">
        <template v-if="tabCard == 'country'">
          <queryForm ref="query" @queryClick="queryClick" @addcateClick="addcateClick" :cate="true"/>
          <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
            <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
            <el-table-column prop="name" label="榜单类别" align="center"></el-table-column>
            <el-table-column prop="describe" label="描述" align="center"></el-table-column>
            <el-table-column prop="likedintegral" label="被赞积分" align="center"></el-table-column>
            <el-table-column prop="likedmaxintegral" label="被赞最大积分" align="center"></el-table-column>
            <el-table-column prop="likeintegral" label="点赞人积分值" align="center"></el-table-column>
            <el-table-column label="操作" align="center" width="300px">
              <template v-slot="scope">
                <el-button type="primary" plain @click.stop="editClick(scope.row.pid)">修改</el-button>
                <el-button type="warning" plain @click.stop="lookClick(scope.row.pid)">查看</el-button>
                <el-button type="danger" plain @click.stop="delClick(scope.row.pid)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
        </template>
        <template v-if="tabCard == 'township'">
          <el-form ref="townData" :model="townData" :rules="rules" status-icon label-width="120px">
<!--            <el-form-item label="发圈积分值" prop="likedmaxintegral">-->
<!--              <el-input v-model="townData.likedmaxintegral" placeholder="请输入发圈积分值"/>-->
<!--            </el-form-item>-->
            <el-form-item label="点赞人积分值" prop="likeintegral">
              <el-input v-model="townData.likeintegral" placeholder="请输入点赞人积分值"/>
            </el-form-item>
            <el-form-item label="被点赞人积分值" prop="likedintegral">
              <el-input v-model="townData.likedintegral" placeholder="请输入被点赞人积分值"/>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" size="-" @click="saveData">保 存</el-button>
              <el-button size="-" @click="resetData">重 置</el-button>
            </el-form-item>
          </el-form>
        </template>
      </div>
    </el-card>
    <coudialog ref="country" :cate="true" @getData="getData"/>
  </div>
</template>

<script>
import queryForm from "./components/queryForm";
import coudialog from "./components/coudialog";
import {getCateList,delCate} from "./api/country";
import {putTownScore,getcateTownId} from "./api/township";
export default {
  name: "regulation",
  data() {
    return {
      tabCard:'country',
      tableData:[],
      tabloading:true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      pageNo: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData:{},
      townData:{},
      rules:{
        likedmaxintegral:[{required: true, trigger: "blur", message: "请输入发圈积分值"}],
        likeintegral:[{required: true, trigger: "blur", message: "请输入点赞人积分值"}],
        likedintegral:[{required: true, trigger: "blur", message: "请输入被点赞人积分值"}]
      }
    }
  },
  components: {
    queryForm,
    coudialog
  },
  computed: {},
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getData()
  },
  methods: {
    async getData(){
      let data = {
        pagenum:this.pageNo,
        pagesize:this.pageSize
      }
      let obj = this.formData
      let arr = Object.keys(obj)
      for(let i in obj){
        if(arr.includes(i)){
          Object.assign(data,obj)
        }
      }
      let res = await getCateList(data)
      if(res.code ===200){
        this.tableData = res.data.list
        this.total = res.data.total
      }
      setTimeout(()=>{
        this.tabloading = false
      },200)
    },
    tabChange(val){
      this.tabCard = val
      if(val == 'country'){
        this.getData()
      }else {
        this.getTail()
      }
    },
    async getTail(){
      let res = await getcateTownId()
      if(res.code == 200){
        this.townData = res.data
      }
    },
    addcateClick(){
      this.$refs.country.showData()
    },
    editClick(pid){
      this.$refs.country.showData(pid,1)
    },
    lookClick(pid){
      this.$refs.country.showData(pid,2)
    },
    delClick(pid){
      this.$baseConfirm('你确定要删除吗？','删除提示',async ()=>{
        let res = await delCate({pid})
        if(res.code == 200){
          this.$message.success('删除成功')
          this.getData()
        }
      })
    },
    saveData(){
      this.$refs.townData.validate(async (valid)=>{
        if(valid){
          let res = await putTownScore(this.townData)
          if(res.code == 200){
            this.townData = res.data
            this.$message.success('已保存')
          }
        }else{
          return false
        }
      })
    },
    resetData(){
      this.$refs.townData.resetFields()
      this.townData = this.$options.data().townData
    },
    queryClick(form){
      this.formData = form
      this.pageNo = 1
      this.getData()
    },
    SizeChange(val){
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val){
      this.pageNo = val;
      this.getData();
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/vab/styles/scss/country.scss';
</style>
