<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="3%" :before-close="handleClose" :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="frestData" :model="kindData" :rules="rules" status-icon label-width="120px">

    </el-form>
  </el-dialog>
</template>
<script>
export default {
  name:'',
  data(){
    return {
      dialogVisible:false,
      title:'',
      kindData:{},
      rules:{}
    }
  },
  components:{},
  created() {
  },
  mounted() {
  },
  methods:{

    handleClose(){

    },
  },
}
</script>
<style scoped lang="scss">

</style>
