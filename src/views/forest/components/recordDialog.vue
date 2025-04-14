<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="tcard == 'codefth' || tcard == 'codevth' ? '32%' : '40%'" :top="tcard == 'msgrule' ? '10%' : '3%'" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="120px">
      <div class="titlebox" v-if="tcard == 'codeth'">
        <i></i>
        <span>场所信息</span>
      </div>
      <el-form-item label="所属镇街" prop="areaid" v-if="tcard == 'codeth'">
<!--        <el-select v-model="frestData.incodeareaid" placeholder="请选择所属镇街" clearable :disabled="disabled">-->
<!--          <el-option v-for="(item,index) in vallageList" :key="index" :value="item.pid" :label="item.areaname"></el-option>-->
<!--        </el-select>-->
        <el-input v-model="frestData.incodeareaname" clearable :disabled="disabled" placeholder="请选择所属镇街"/>
      </el-form-item>
      <el-form-item label="所属村居" prop="villageid" v-if="tcard == 'codeth'">
<!--        <el-select v-model="frestData.incodevillageid" placeholder="请选择所属村居" clearable :disabled="disabled">-->
<!--          <el-option v-for="(item,index) in countryList" :key="index" :value="item.pid" :label="item.areaname"></el-option>-->
<!--        </el-select>-->
        <el-input v-model="frestData.incodevillagename" clearable :disabled="disabled" placeholder="请选择所属村居"/>
      </el-form-item>
      <el-form-item label="场所名称" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.incode"/>
      </el-form-item>
      <el-form-item label="场所类别" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.incodetype"/>
      </el-form-item>
<!--      <el-form-item label="下山场所名称" v-if="tcard == 'codeth'">-->
<!--        <el-input :disabled="disabled" v-model="frestData.outcode"/>-->
<!--      </el-form-item>-->
<!--      <el-form-item label="下山场所类别" v-if="tcard == 'codeth'">-->
<!--        <el-input :disabled="disabled" v-model="frestData.outcodetype"/>-->
<!--      </el-form-item>-->
      <div class="titlebox" v-if="tcard == 'codeth'">
        <i></i>
        <span>人员信息</span>
      </div>
      <el-form-item label="所属镇街" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.uareaname"/>
      </el-form-item>
      <el-form-item label="所属村居" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.uvillagename"/>
      </el-form-item>
      <el-form-item label="姓名" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.username"/>
      </el-form-item>
      <el-form-item label="身份证号" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.umemberid"/>
      </el-form-item>
      <el-form-item label="手机号" v-if="tcard == 'codeth'">
        <el-input :disabled="disabled" v-model="frestData.userphone"/>
      </el-form-item>

      <template v-if="tcard == 'codeth'">
        <div class="titlebox">
          <i></i>
          <span>通行信息</span>
        </div>
        <el-form-item label="入口登记时间">
          <el-date-picker v-model="frestData.intime" type="datetime" :disabled="disabled" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择入口登记时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="出口登记时间">
          <el-date-picker v-model="frestData.outtime" type="datetime" :disabled="disabled" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择出口登记时间" clearable></el-date-picker>
        </el-form-item>
        <el-form-item label="停滞时长">
          <el-input :disabled="disabled" v-model="frestData.duration" clearable/>
        </el-form-item>
        <el-form-item label="登记事项">
          <el-input :disabled="disabled" v-model="frestData.mattertype"/>
        </el-form-item>
        <el-form-item label="来访者单位(地址)">
          <el-input :disabled="disabled" v-model="frestData.useraddress"/>
        </el-form-item>
        <el-form-item label="受访者单位(部门)">
          <el-input :disabled="disabled" v-model="frestData.outaddress"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :disabled="disabled" v-model="frestData.remark"/>
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/recordJs'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
