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
        <el-form-item label="事项名称" prop="mattername">
          <el-input v-model="frestData.mattername"  placeholder="请输入类别名称"/>
        </el-form-item>

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
export {default} from '../js/matterJs'
</script>

<style lang="scss" scoped>
@import '../style/forestlog.scss';
</style>
