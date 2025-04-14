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
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="tcard == 'msgrule' ? '32%' : '40%'" :top="tcard == 'msgrule' ? '10%' : '3%'" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-radio-group v-if="tcard !== 'msgrule' && keys!== 1" v-model="tabCard" class="radiogroup" @change="tabChange" size="-">
      <el-radio-button label="baseinfo">基本信息</el-radio-button>
      <el-radio-button label="flowover">办理流程</el-radio-button>
    </el-radio-group>
    <el-form ref="fireData" :model="fireData" :rules="rules" status-icon label-width="120px">
      <template v-if="tcard == 'msgrule'">
        <el-form-item label="规则名称" prop="rulename">
          <el-input v-model="fireData.rulename" placeholder="请输入规则名称"/>
        </el-form-item>
        <div class="vercail">
          <label class="el-form-item__label">间隔周期</label>
          <el-form-item prop="period">
            <el-input-number v-model="fireData.period" :min="0" placeholder="请输入间隔周期"></el-input-number>
          </el-form-item>
          <el-form-item prop="ruletype">
            <el-select v-model="fireData.ruletype" placeholder="请输入间隔周期类型">
              <el-option :value="1" label="年"></el-option>
              <el-option :value="2" label="周"></el-option>
              <el-option :value="3" label="日"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="临期提醒天数" prop="nearexpiredday">
          <el-input v-model="fireData.nearexpiredday" placeholder="请输入临期提醒天数">
            <template #suffix>
              <span>天</span>
            </template>
          </el-input>
        </el-form-item>
      </template>
      <template v-else>
        <template v-if="tabCard == 'baseinfo'">
          <div class="titlebox">
            <i></i>
            <span>基本信息</span>
          </div>
          <el-form-item label="所属村居" prop="villageid">
            <el-select v-model="fireData.villageid" placeholder="请选择所属村居" clearable :disabled="disabled">
              <el-option v-for="item in villdata" :key="item.pid" :value="item.pid" :label="item.areaname"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="逝者姓名" prop="personname">
            <el-input v-model="fireData.personname" placeholder="请输入逝者姓名" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="户主姓名" prop="familyname">
            <el-input v-model="fireData.familyname" placeholder="请输入户主姓名" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="户主身份证号" prop="familymemberid">
            <el-input v-model="fireData.familymemberid" placeholder="请输入户主身份证号" maxlength="18" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="户主电话" prop="familyphone">
            <el-input v-model="fireData.familyphone" placeholder="请输入户主电话" maxlength="11" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="家庭地址" prop="familyadress">
            <el-input v-model="fireData.familyadress" placeholder="请输入家庭地址" maxlength="11" :disabled="disabled"/>
          </el-form-item>
          <el-form-item label="日期" prop="diedate">
            <el-date-picker v-model="fireData.diedate" type="date" value-format="yyyy-MM-dd" :disabled="disabled" placeholder="请选择日期" clearable></el-date-picker>
          </el-form-item>
          <el-divider></el-divider>
          <div class="titlebox">
            <i></i>
            <span>选择信息提醒人</span>
          </div>
          <el-form-item label="选择主管人" prop="mainuserid">
            <el-cascader v-model="fireData.mainuserid" :options="poptions" :props="parprops" filterable placeholder="请选择主管人" clearable @change="changeParUser"></el-cascader>
          </el-form-item>
          <el-form-item label="选择协管人" prop="helpuserids">
            <el-cascader class="newper" v-model="fireData.helpuserids" :disabled="!fireData.mainuserid ? true : false" :options="soptions" :props="subprops" clearable filterable placeholder="请选择协管人" @remove-tag="removetag" @change="changeSubUser"></el-cascader>
          </el-form-item>
          <el-divider></el-divider>
          <div class="titlebox">
            <i></i>
            <span>选择消息提醒周期</span>
          </div>
          <el-checkbox-group v-model="ruleids" :disabled="disabled">
            <el-checkbox v-for="item in timeData" :label="item.pid" :key="item.pid" >{{item.rulename}}</el-checkbox>
          </el-checkbox-group>
        </template>
        <template v-if="tabCard == 'flowover'">
          <el-timeline v-if="flowData.length > 0">
            <el-timeline-item v-for="(item,index) in flowData" :key="index" placement="top" :timestamp="item.date ? item.date : ''">
              <div class='timehead'>
                <span>{{ item.name }}</span>
                <i :class='{blue:item.stage==1 ||item.stage==3,org:item.stage == 2,green:item.stage == 4 || item.stage ==5}'>{{ item.stage == 1 ? '发起' : item.stage == 2 ? '主办': item.stage == 3 ? '协办' : item.stage == 4 ? '转办' : '办理完成' }}</i>
                <i :class='{blue:item.state==0,org:item.state == 2,green:item.state == 1}'>{{ item.state==0 ? '未办理' : item.state == 1 ? '已办理' : '系统自动完成' }}</i>
              </div>
              <div class='timebody'>
                <span>{{ item.idea ? item.idea: '暂无办理意见' }}</span>
                <el-image v-if='item.imgs && item.imgs.length >0' v-for='(val,key) in item.imgs' :key='key' :src='val' :preview-src-list="item.imgs" :z-index="2999"></el-image>
              </div>
            </el-timeline-item>
          </el-timeline>
          <template v-else>
            <span class="noflow">暂无流程</span>
          </template>
        </template>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/firelog'
</script>

<style lang="scss" scoped>
@import '../style/firelog.scss';
</style>
