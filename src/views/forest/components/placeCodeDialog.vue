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
  <el-dialog :visible.sync="dialogVisible" :title="title" top="1%" :width="keys == 2 ? '70%' : '40%'" :before-close="keys == 2 ? lookClose : handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="120px">
        <el-form-item label="所属镇街" prop="villageId" v-if="(tcard == 'codest'&&keys!== 2)">
          <el-select v-model="frestData.villageId" @change="changeOption" placeholder="请选择所属镇街" filterable clearable :disabled="disabled">
            <el-option v-for="item in vallageList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街镇编号" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.villageNumber" placeholder="请输入街镇编号" :disabled="disabled"/>
        </el-form-item>
      <el-form-item label="所属村居" prop="countryId" v-if="(tcard == 'codest'&&keys!== 2)">
        <el-select v-model="frestData.countryId" placeholder="请选择所属村居" clearable :disabled="disabled">
          <el-option v-for="item in countryList" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="场所名称" prop="placeName" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-input v-model="frestData.placeName" placeholder="请输入场所名称" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="经度" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.longitude" placeholder="请输入经度" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="纬度" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.latitude" placeholder="请输入纬度" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="包片领导" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.baopianLeader" placeholder="请输入包片领导" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="村书记" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.villageSecretary" placeholder="请输入村书记" :disabled="disabled"/>
        </el-form-item>
        <el-form-item :label="level == 2 ? '场所类别':'区级场所类别'" prop="typeId" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-select v-model="frestData.typeId" placeholder="请选择场所类别" filterable clearable :disabled="disabled">
            <el-option v-for="item in placeCodeType" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="镇街场所类别" prop="vtypeId" v-if="((tcard == 'codest'&&keys!== 2) || tcard == 'codeth') && level!== 2">
          <el-select v-model="frestData.vtypeId" placeholder="请选择镇街场所类别" filterable clearable :disabled="disabled">
            <el-option v-for="item in placeCodeVageType" :key="item.pid" :value="item.pid" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场所关联人员" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-cascader class="person" v-model="frestData.userids" :options="options" :props="props" :disabled="disabled" filterable placeholder="请选择场所关联人员" @change="perChange"></el-cascader>
        </el-form-item>
        <el-form-item label="登记规则" prop="codeRule" v-if="((tcard == 'codest'&&keys!== 2) || tcard == 'codeth')">
          <el-select v-model="frestData.codeRule" placeholder="请选择登记规则" clearable :disabled="disabled">
            <el-option :value="1" label="默认(进出)"></el-option>
            <el-option :value="2" label="单次记录"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="keys == 2 &&tcard == 'codest'">
          <el-image style="width: 400px; height: 450px;" :src="imga"></el-image>
          <el-image style="width: 400px; height: 450px; margin-left: 200px" :src="imgb"></el-image>
        </el-form-item>
        <div class="titlebox">
          <i></i>
          <span>配置字段信息</span>
        </div>
        <el-divider></el-divider>
        <el-form-item class="settings" prop="proaddressType">
          <el-input v-model="frestData.proaddressName" />
          <el-radio-group v-model="frestData.proaddressType" @change="proChange">
            <el-radio :label="0">填写形式</el-radio>
            <el-radio :label="1">选择形式</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="frestData.proaddressType == 1">
          <div class="selecthead">
            <span>选项名称</span>
          </div>
          <el-form-item class="selectbody" v-for="(item,index) in frestData.prodicList" :key="index">
            <i class="serialbox">{{index + 1}}</i>
            <el-input v-model="item.valuetext" />
            <el-button v-if="index==0" type="success" icon="el-icon-plus" plain circle @click="addproData"></el-button>
            <el-button v-if="index!=0" type="danger" icon="el-icon-minus" plain circle @click="delproData(item)"></el-button>
          </el-form-item>
        </div>
        <el-form-item class="settings" prop="outaddressType">
          <el-input v-model="frestData.outaddressName" />
           <el-radio-group v-model="frestData.outaddressType" @change="outChange">
            <el-radio :label="0">填写形式</el-radio>
            <el-radio :label="1">选择形式</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="frestData.outaddressType == 1">
            <div class="selecthead">
              <span>选项名称</span>
            </div>
            <el-form-item class="selectbody" v-for="(item,index) in frestData.outdicList" :key="index">
              <i class="serialbox">{{index + 1}}</i>
              <el-input v-model="item.valuetext" />
              <el-button v-if="index==0" type="success" icon="el-icon-plus" plain circle @click="addoutData"></el-button>
              <el-button v-if="index!=0" type="danger" icon="el-icon-minus" plain circle @click="deloutData(item)"></el-button>
            </el-form-item>
          </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codest'" type="primary" size="-" @click="downloadQrCode(0)">下载入口场所码</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codest'" type="primary" size="-" @click="downloadQrCode(1)">下载出口场所码</el-button>
      <template>
        <el-button v-if="keys== 2 &&tcard == 'codest'" size="-" @click="lookClose">取 消</el-button>
        <el-button v-else size="-" @click="handleClose">取 消</el-button>
      </template>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/placeCodeJs'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
