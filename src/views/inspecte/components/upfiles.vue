<!--
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2022/9/16
 * @LastEditors: 12390
 * @LastEditTime: 2022/9/16
 * @Description: VUE Single Page
 * Copyright (c) 2022 by xybx, All Rights Reserved.
-->
<template>
  <div class="upfiles">
    <el-upload
      ref="upload"
      :class="{noshow:limit && fileLists.length==1}"
      :action="uploadUrl"
      :limit="limit ? limit : 5"
      name="files"
      accept=".jpg,.png,.gif,.jpeg"
      :data="{ type }"
      :show-file-list="showfile"
      :auto-upload="false"
      :on-exceed="handleExceed"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleChange"
      :file-list="fileLists"
      :disabled="disabled">
      <i class="el-icon-plus"></i>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'upfiles',
  data() {
    return {}
  },
  components: {},
  computed: {},
  created() {
  },
  mounted() {
  },
  methods: {}
}
</script>

<style scoped>

</style>
