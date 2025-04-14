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
  <el-dialog :visible.sync="dialogVisible" :title="title" :width="'32%'" :top="'3%'" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="frestData" :rules="rules" status-icon label-width="120px">
        <el-form-item label="类别名称" prop="name">
          <el-input v-model="frestData.name"  placeholder="请输入类别名称"/>
        </el-form-item>
        <template v-if="level == 2">
          <span class="textbox">(注释:人员在特殊情况（吸烟、疾病）的分类判定，需指定扫码后的登记界面颜色)</span>
          <el-form-item label="颜色设置" prop="usedefaultcolor">
            <el-radio-group v-model="frestData.usedefaultcolor">
              <el-radio :label="1">是</el-radio>
              <el-radio :label="0">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <div class="colorbox">
            <template v-if="frestData.usedefaultcolor== 1">
              <span class="textbox">(注释:至少有一个确定的分类)</span>
              <el-form-item label="是(特殊颜色)" prop="specialcolor">
                <el-color-picker v-model="frestData.specialcolor" show-alpha :predefine="predefineColors"></el-color-picker>
              </el-form-item>
            </template>
            <template v-if="frestData.usedefaultcolor== 1 || frestData.usedefaultcolor== 0">
              <span class="textbox">(注释:所有都是否)</span>
              <el-form-item label="否(默认颜色)" prop="defaultcolor">
                <el-color-picker v-model="frestData.defaultcolor" show-alpha :predefine="predefineColors"></el-color-picker>
              </el-form-item>
            </template>
            <template v-if="frestData.usedefaultcolor== 1">
              <span class="textbox">(注释:除上述两种情况之外的情况)</span>
              <el-form-item label="未知(未知颜色)" prop="unknowncolor">
                <el-color-picker v-model="frestData.unknowncolor" show-alpha :predefine="predefineColors"></el-color-picker>
              </el-form-item>
            </template>
          </div>
          <el-form-item label="登记事项" prop="matterids">
            <el-checkbox-group v-model="frestData.matterids">
              <el-checkbox v-for="item in maData" :key="item.pid" :label="item.pid">{{item.mattername}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </template>
        <el-form-item label="描述">
          <el-input v-model="frestData.description" type="textarea" :rows="5" placeholder="请输入描述"></el-input>
        </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="keys !== 2" type="primary" size="-" @click="saveData">确 定</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
export {default} from '../js/placeCodeTypeJs'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
