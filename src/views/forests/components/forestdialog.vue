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
        <el-form-item label="类别名称" prop="rulename" v-if="tcard == 'codefth'">
          <el-input v-model="frestData.rulename" placeholder="请输入类别名称"/>
        </el-form-item>
        <el-form-item label="事项名称" prop="evtname" v-if="tcard == 'codevth'">
          <el-input v-model="frestData.evtname" placeholder="请输入事项名称"/>
        </el-form-item>
        <el-form-item label="描述" v-if="tcard == 'codefth' || tcard == 'codevth'">
          <el-input v-model="frestData.desc" type="textarea" :rows="5" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <div class="titlebox" v-if="tcard == 'codeth'">
          <i></i>
          <span>场所信息</span>
        </div>
        <el-form-item label="所属镇街" prop="areaid" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-select v-model="frestData.areaid" placeholder="请选择所属镇街" clearable :disabled="disabled">
            <el-option v-for="item in areadata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="街镇编号" prop="personname" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.personname" placeholder="请输入街镇编号" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="所属村居" prop="villageid" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-select v-model="frestData.villageid" placeholder="请选择所属村居" clearable :disabled="disabled">
            <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="场所名称" prop="familyname" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-input v-model="frestData.familyname" placeholder="请输入场所名称" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="经度" prop="familymemberid" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.familymemberid" placeholder="请输入经度" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="纬度" prop="familyphone" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.familyphone" placeholder="请输入纬度" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="包片领导" prop="familyadress" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.familyadress" placeholder="请输入包片领导" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="村书记" prop="familyadress" v-if="tcard == 'codest'&&keys!== 2">
          <el-input v-model="frestData.familyadress" placeholder="请输入村书记" :disabled="disabled"/>
        </el-form-item>
        <el-form-item label="场所类别" prop="diedate" v-if="(tcard == 'codest'&&keys!== 2) || tcard == 'codeth'">
          <el-select v-model="frestData.villageid" placeholder="请选择场所类别" clearable :disabled="disabled">
            <el-option v-for="item in catedata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <div class="titlebox" v-if="tcard == 'codeth'">
          <i></i>
          <span>人员信息</span>
        </div>
        <el-form-item label="所属镇街" v-if="tcard == 'codeth'">
          <el-select v-model="frestData.uareaid" placeholder="请选择所属镇街" clearable :disabled="disabled">
            <el-option v-for="item in areadata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属村居" v-if="tcard == 'codeth'">
          <el-select v-model="frestData.uvillageid" placeholder="请选择所属村居" clearable :disabled="disabled">
            <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户姓名" prop="names" v-if="(tcard == 'codend'&&keys!== 2) || tcard == 'codeth'">
          <el-input v-model="frestData.names" placeholder="请输入用户姓名" clearable/>
        </el-form-item>
        <el-form-item label="身份证号" prop="memberid" v-if="(tcard == 'codend'&&keys!== 2) || tcard == 'codeth'">
          <el-input v-model="frestData.memberid" placeholder="请输入用户姓名" :maxlength="18" clearable/>
        </el-form-item>
        <el-form-item label="手机号" prop="phonenum" v-if="(tcard == 'codend'&&keys!== 2) || tcard == 'codeth'">
          <el-input v-model="frestData.phonenum" placeholder="请输入手机号" :maxlength="11" clearable/>
        </el-form-item>
        <el-form-item label="是否党员" prop="partyid" v-if="tcard == 'codend' &&keys!== 2">
          <el-select v-model="frestData.partyid" placeholder="请选择是否党员">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否吸烟" prop="smoke" v-if="tcard == 'codend' &&keys!== 2">
          <el-select v-model="frestData.smoke" placeholder="请选择是否吸烟">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="村居" prop="village" v-if="tcard == 'codend' &&keys!== 2">
          <el-select v-model="frestData.villageid" placeholder="请选择村居">
            <el-option v-for="item in villdata" :key="item.pid" :label="item.areaname" :value="item.pid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="家庭地址" v-if="tcard == 'codend' &&keys!== 2">
          <el-input v-model="frestData.address" type="textarea" :rows="5" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item v-if="keys == 2 &&tcard == 'codest'">
<!--          <el-image :src="frestData.imgs" :z-index="2999"></el-image>-->
<!--          <el-image :src="frestData.img" :z-index="2999"></el-image>-->
        </el-form-item>
        <el-form-item v-if="keys == 2 && tcard == 'codend'">
<!--          <el-image :src="frestData.imgs" :z-index="2999"></el-image>-->
        </el-form-item>
        <template v-if="tcard == 'codeth'">
          <div class="titlebox">
            <i></i>
            <span>通行信息</span>
          </div>
          <el-form-item label="入口登记时间">
            <el-date-picker v-model="frestData.entrytime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择入口登记时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="出口登记时间">
            <el-date-picker v-model="frestData.outtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="请选择出口登记时间" clearable></el-date-picker>
          </el-form-item>
          <el-form-item label="上山时长" prop="logtime">
            <el-input v-model="frestData.logtime" placeholder="请输入用户姓名" clearable/>
          </el-form-item>
          <el-form-item label="上山事项" prop="events">
            <el-select v-model="frestData.events" placeholder="请选择上山事项" clearable :disabled="disabled">
              <el-option v-for="item in catedata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
        </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codest'" type="primary" size="-" @click="saveData">下载入口场所码</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codest'" type="primary" size="-" @click="saveData">下载出口场所码</el-button>
      <el-button v-if="keys== 2 &&tcard == 'codend'" type="primary" size="-" @click="saveData">下载人员身份码</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/forestlog'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
