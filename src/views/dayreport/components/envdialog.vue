<template>
  <el-dialog :visible.sync="dialogVisible" :title="title" width="40%" top="2%" :before-close="handleClose"
    :append-to-body="true" :close-on-click-modal="false" center>
    <el-form ref="envData" :model="envData" :rules="rules" status-icon label-width="110px">
      <template v-if="cate & title != '查看类型'">
        <el-form-item label="类型名称" prop="typename" label-width="120px">
          <el-input v-model="envData.typename" placeholder="请输入类型名称" />
        </el-form-item>
        <el-form-item label="类别描述" label-width="120px">
          <el-input type="textarea" :rows="5" v-model="envData.description" placeholder="请输入类别描述" />
        </el-form-item>
      </template>
      <template v-else>
          <el-form-item label="类型名称" prop="typename" label-width="120px">
            <el-input v-model="envData.typename" placeholder="" readonly />
          </el-form-item>
          <el-form-item label="类别描述" label-width="120px">
            <el-input type="textarea" :rows="5" v-model="envData.description" placeholder="" readonly />
          </el-form-item>
        </template>
      <template v-if="!cate && tabCard == 'baseinfo'">
        <el-form-item label="村居名称">
          <el-input v-model="envData.villagename" placeholder="请输入村居名称" disabled />
        </el-form-item>
        <el-form-item label="上报类型">
          <el-input v-model="envData.typename" placeholder="请输入上报类型" disabled />
        </el-form-item>
        <el-form-item label="上报时间">
          <el-date-picker v-model="envData.inspectdate" type="date" value-format="yyyy-MM-dd" placeholder="请选择上报时间"
            disabled />
        </el-form-item>
        <el-form-item label="上报人">
          <el-input v-model="envData.inspectorname" placeholder="请输入上报人" disabled />
        </el-form-item>
        <el-form-item label="上报内容">
          <el-input v-model="envData.inspectcount" type="textarea" :rows="5" placeholder="请输入上报内容" disabled />
        </el-form-item>
        <el-form-item label="巡查地址">
          <el-input v-model="envData.inspectadress" placeholder="请输入巡查地址" disabled />
        </el-form-item>
        <el-form-item label="位置描述">
          <el-input v-model="envData.addressdes" placeholder="请输入位置描述" disabled />
        </el-form-item>
        <el-form-item label="上报图片">
          <div v-if="!envData.inspectimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <div v-for="item in imgdata" :key="item">
              <el-image :src="item" :preview-src-list="imgdata" :z-index="2999"></el-image>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="回复意见" v-if="envData.ideas">
          <el-input v-model="envData.ideas.currentreplay" type="textarea" :rows="5" placeholder="请输入意见回复" disabled />
        </el-form-item>
        <el-form-item label="回复图片" v-if="envData.ideas">
          <div v-if="!envData.ideas.currentimg" class="imagebox">
            <i class="el-icon-picture-outline"></i>
            <u>暂无图片</u>
          </div>
          <template v-else>
            <div v-for="item in urldata" :key="item">
              <el-image :src="item" :preview-src-list="urldata" :z-index="2999" />
            </div>
          </template>
        </el-form-item>
        <el-form-item label="巡查定位">
          <Amap :lng='envData.lng' :lat='envData.lat' />
        </el-form-item>
      </template>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button v-if="cate & title != '查看类型'" size="-" type="primary" @click="saveData">保 存</el-button>
      <el-button size="-" @click="handleClose">取 消</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getDruleManageDetail, getDruleTypeDetail, delerule, postSaveData } from "@/views/dayreport/api/envrule";
import Amap from '@/components/Amap'
import indialog from "./indialog";
let app;
export default {
  name: "envdialog",
  data() {
    return {
      tabCard: 'baseinfo',
      dialogVisible: false,
      title: '',
      envData: {},
      rules: {
        typename: [{ required: true, trigger: "blur", message: "请填写类型名称" }],
      },
      imgdata: [],
      urldata: [],
      flowData: [],
    }
  },
  props: ['cate', 'myself', 'need'],
  components: {
    Amap,
    indialog
  },
  computed: {},
  created() {
  },
  mounted() {
    app = this;
  },
  methods: {
    async showData(pid, index) {
      if (this.cate) {
        this.title = !pid ? '新建类型' : index == 2 ? '编辑类型' : '查看类型'
      } else {
        this.title = '详情'
      }
      if (pid) {
        let res
        if (this.cate) {
          res = await getDruleTypeDetail({ pid })
          this.envData = res.data ? res.data : {}
        } else {
          res = await getDruleManageDetail({ pid })
          this.envData = res.data ? res.data : {}
          this.imgdata = res.data.inspectimg && res.data.inspectimg != '' ? res.data.inspectimg.split(',').map(item => { return `${this.$baseUrl}/gridfs/image/${item}` }) : []
          this.urldata = res.data.ideas && res.data.ideas.currentimg ? res.data.ideas.currentimg.split(',').map(item => { return `${this.$baseUrl}/gridfs/image/${item}` }) : []
          this.envData.lng = res.data.coordinate && res.data.coordinate != '' ? res.data.coordinate.split(',')[0] : ''
          this.envData.lat = res.data.coordinate && res.data.coordinate != '' ? res.data.coordinate.split(',')[1] : ''
        }
      }
      this.dialogVisible = true
    },

    getData() {
      this.$emit('getData')
    },
    //编辑和新增保存按钮
    saveData() {
      this.$refs.envData.validate(async (valid) => {
        if (valid) {
          let data = Object.assign({}, this.envData)
          const loading = this.$loading({
            lock: true,
            text: 'Loading',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });
          let res = await postSaveData(data)
          if (res.code == 200) {
            loading.close();
            this.$message.success(this.envData.pid ? '编辑成功' : '添加成功')
            this.handleClose()
            this.getData()
          }
        } else {
          return false
        }
      })
    },
    handleClose() {
      this.title = '';
      this.tabCard = 'baseinfo';
      this.$refs.envData.resetFields();
      this.envData = this.$options.data().envData;
      this.dialogVisible = false;
    },
  }
}
</script>


<style lang="scss" scoped>
.el-dialog__body {

  .radiogroup {
    display: block;
    text-align: center;
    margin-bottom: 25px;
  }

  .el-form {
    .el-form-item {

      .el-input,
      .el-select,
      .el-textarea,
      .el-cascader {
        width: 100%;
      }

      ::v-deep {
        .el-input--small .el-input__inner {
          height: 38px;
          line-height: 38px;
        }

        .map-show {
          width: 100%;
          height: 210px;

          #mapShow {
            width: 100%;
            height: 100%;
          }
        }

        .imagebox {
          width: 150px;
          height: 150px;
          background-color: #f3f3f3;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          border-radius: 5px;

          i {
            font-size: 30px;
            color: #999;
          }

          u {
            text-decoration: none;
            font-size: 15px;
            color: #999;
          }
        }

        .el-image {
          width: 150px;
          height: 150px;
          float: left;
          border-radius: 5px;
          box-shadow: 0 1px 3px 1px rgba(0, 0, 0, .1);
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
    }
  }

  .el-timeline {
    .el-timeline-item {
      .el-timeline-item__timestamp.is-top {
        display: inline-block;
      }

      .el-timeline-item__content {
        .timehead {
          position: absolute;
          top: -1px;
          left: 170px;
          display: flex;
          flex-direction: row;
          align-items: center;

          span {
            font-size: 16px;
            color: #333;
          }

          i {
            margin-left: 20px;
            font-size: 15px;
            border: 1px solid;
            border-radius: 25px;
            padding: 2px 12px;
            color: #FD7837;
            font-style: inherit;

            &.blue {
              color: #2E8CFF;
              border-color: rgba(46, 140, 255, .3);
            }

            &.org {
              color: #FD7837;
              border-color: rgba(253, 120, 55, .3);
            }

            &.red {
              color: #ea373b;
              border-color: rgba(234, 5, 59, .3);
            }

            &.green {
              color: #66ecb7;
              border-color: rgba(102, 236, 183, .3);
            }
          }
        }

        .timebody {
          background-color: #EBEEF5;
          padding: 10px 15px;
          margin-top: 15px;

          span {
            color: #666;
            font-size: 15px;
            display: block;
            margin-bottom: 12px;
          }

          .el-image {
            width: 120px;
            height: 120px;
            margin-right: 12px;
          }
        }
      }
    }
  }

  .noflow {
    font-size: 16px;
    color: #999;
    display: block;
    text-align: center;
  }
}

.el-dialog__footer {
  .el-button {
    padding: 11px 25px;
    font-size: 15px;
  }
}
</style>
