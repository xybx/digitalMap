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

      <el-form-item label="用户姓名" prop="name" v-if="(tcard == 'codend'&&keys!== 2)">
        <el-input v-model="frestData.name" placeholder="请输入用户姓名" clearable/>
      </el-form-item>
      <el-form-item label="身份证号" prop="memberid" v-if="(tcard == 'codend'&&keys!== 2)">
        <el-input v-model="frestData.memberid" placeholder="请输入用户姓名" :maxlength="18" clearable/>
      </el-form-item>
      <el-form-item label="手机号" prop="phonenum" v-if="(tcard == 'codend'&&keys!== 2)">
        <el-input v-model="frestData.phonenum" placeholder="请输入手机号" :maxlength="11" clearable/>
      </el-form-item>
      <el-form-item label="是否党员" prop="isparty" v-if="tcard == 'codend' &&keys!== 2">
        <el-select v-model="frestData.isparty" placeholder="请选择是否党员">
          <el-option label="否" :value="1"></el-option>
          <el-option label="是" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否吸烟" prop="issmoke" v-if="tcard == 'codend' &&keys!== 2">
        <el-select v-model="frestData.issmoke" placeholder="请选择是否吸烟">
          <el-option label="否" :value="1"></el-option>
          <el-option label="是" :value="0"></el-option>
          <el-option label="未知" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属镇" prop="areaid" v-if="tcard == 'codend' &&keys!== 2 && level == 2">
        <el-select v-model="frestData.areaid" @change="changeOption" filterable placeholder="请选择所属镇" clearable>
          <el-option v-for="item in vallageList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="村居" prop="villageid" v-if="tcard == 'codend' &&keys!== 2">
        <el-select v-model="frestData.villageid" placeholder="请选择村居">
          <el-option v-for="item in countryList" :key="item.pid" :label="item.areaname ? item.areaname : '无'" :value="item.pid"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="家庭地址" prop="address" v-if="tcard == 'codend' &&keys!== 2">
        <el-input v-model="frestData.address" type="textarea" :rows="5" placeholder="请输入详细地址"></el-input>
      </el-form-item>
      <el-form-item class="imgbox" v-if="keys == 2 && tcard == 'codend'">
        <el-image  :src="imgc"></el-image>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codend'" style="display: inline-block" @click="downloadImg()">下载图片</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codend'" style="display: inline-block" @click="print()">打印</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/userIdentityJs'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
