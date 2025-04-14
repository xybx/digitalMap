<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/7/31
 * @LastEditors: 12390
 * @LastEditTime: 2022/7/31
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="titlebox">
    <el-form ref="setData" :model="setData" :inline="true" :rules="rules" status-icon>
      <div class="onewarp">
        <el-form-item label="看板名称编辑" prop="gridname" label-width="120px">
          <el-input v-model="setData.gridname" placeholder="请输入看板名称" />
        </el-form-item>
        <el-form-item label="界面数据来源设置" prop="datacome" label-width="140px">
          <el-select v-model="setData.datacome" placeholder="请选择界面数据来源" clearable @change="changeClick">
            <el-option :value="0" label="系统数据"></el-option>
            <el-option :value="1" label="自定义"></el-option>
          </el-select>
        </el-form-item>
      </div>
      <template v-if="setData.datacome == 1">
        <dl class="tlist c1">
          <dt>
            <el-form-item>
              <el-input v-model="setData.peoname" placeholder="标题" />
            </el-form-item>
          </dt>
          <dd>
            <el-form-item>
              <el-input v-model="setData.peoname1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.peosumnum" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.peoname2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.peorealnum" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.peoname3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.peochnum" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.peoname4" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.peopartynum" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.peoname5" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.peopartyendnum" placeholder="数值" />
            </el-form-item>
          </dd>
        </dl>
        <dl class="tlist c2">
          <dt>
            <el-form-item>
              <el-input v-model="setData.ptypename" placeholder="标题" />
            </el-form-item>
          </dt>
          <dd>
            <el-form-item>
              <el-input v-model="setData.ptypename1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.ptypeyb" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.ptypename2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.ptypeyl" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.ptypename3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.ptypecj" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.ptypename4" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.ptypepk" placeholder="数值" />
            </el-form-item>
          </dd>
        </dl>
        <dl class="tlist c3">
          <dt>
            <el-form-item>
              <el-input v-model="setData.peoagename" placeholder="标题" />
            </el-form-item>
          </dt>
          <dd>
            <el-form-item>
              <el-input v-model="setData.householdname" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdone" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdtwo" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdthree" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname4" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdfour" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname5" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdfive" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.permanentname" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.permanentone" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.permanenttwo" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.permanentthree" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname4" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.permanentfour" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname5" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.permanentfive" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.outsidename" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.outsideone" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.outsidetwo" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.outsidethree" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname4" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.outsidefour" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.householdname5" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.outsidefive" placeholder="数值" />
            </el-form-item>
          </dd>
        </dl>
        <dl class="tlist c4">
          <dt>
            <el-form-item>
              <el-input v-model="setData.agename" placeholder="标题" />
            </el-form-item>
          </dt>
          <dd>
            <el-form-item>
              <el-input v-model="setData.agename1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.mannum" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.agethan1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.manthan" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.agename2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.womannum" placeholder="数值" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.agethan2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.womanthan" placeholder="数值" />
            </el-form-item>
          </dd>
        </dl>
        <dl class="tlist c5">
          <dt>
            <el-form-item>
              <el-input v-model="setData.mattername" placeholder="标题" />
            </el-form-item>
          </dt>
          <dd>
            <el-form-item>
              <el-input v-model="setData.mattername1" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.staymatter" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.mattername2" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.settlematter" placeholder="数值" />
            </el-form-item>
          </dd>
          <dd>
            <el-form-item>
              <el-input v-model="setData.mattername3" placeholder="名称" />
            </el-form-item>
            <el-form-item>
              <el-input v-model="setData.matterthan" placeholder="数值" />
            </el-form-item>
          </dd>
        </dl>
      </template>
    </el-form>
    <div class="btnboxs">
      <el-button type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </div>
  </div>
</template>

<script>
import {getByArea, putByArea} from "@/views/board/api/grid";

export default {
  name: 'titlebox',
  data() {
    return {
      setData:{},
      rules:{
        gridname:[{required: true, trigger: "blur", message: "请输入看板名称"}],
        datacome:[{required: true, trigger: "change", message: "请选择数据来源"}]
      },
    }
  },
  methods: {
    async getInfo(){
      let res = await getByArea()
      this.setData = res.data ? res.data : {}
    },
    getDefault(){
      let obj = {
        peoname:'人口概况', peoname1:'总户数', peoname2:'实际人口',peoname3:'常驻人口',
        peoname4:'党员人数',peoname5:'退役军人',ptypename:'人口类型统计', ptypename1:'医保缴纳', ptypename2:'养老缴纳',ptypename3:'残疾人',
        ptypename4:'贫困户',peoagename:'人口年龄分布情况:',householdname:'户籍人口', householdname1:'0-3岁', householdname2:'3-12岁',householdname3:'13-18岁',
        householdname4:'19-59岁',householdname5:'60岁以上',permanentname:'常驻人口',outsidename:'在外人口', agename:'性别比例',agename1:'男性数量',
        agethan1:'男性占比',agename2:'女性数量',agethan2:'女性占比',mattername:'事项概况',mattername1:'待办事项',mattername2:'办结事项',mattername3:'办结率'
      }
      let arr = Object.keys(this.setData)
      this.setData = arr.length == 1 ? Object.assign(this.setData,obj) : this.setData
    },
    saveData(){
      this.$refs.setData.validate(async (valid)=>{
        if(valid){
          let data = Object.assign({},this.setData)
          let res = await putByArea(data)
          if(res.code == 200){
            this.$message.success('保存成功')
            this.setData = res.data
          }
        }else {
          return false
        }
      })
    },
    changeClick(val){
      this.setData.datacome = val
      if(val == 1) this.getDefault()
    },
    handleClose(){
      this.$refs.setData.resetFields()
      this.setData = this.$options.data().setData
      this.$emit('handleClose')
    },
  }
}
</script>

<style scoped>

</style>
