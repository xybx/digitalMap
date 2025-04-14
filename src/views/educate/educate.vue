<template>
  <div class="educate">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>中小学报名管理</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
              <el-radio-button label="codest"><i class="iconfont icon-yonghujiluchaxun"></i>报名信息审核管理</el-radio-button>
              <el-radio-button label="codend"><i class="iconfont icon-shenfenma"></i>报名设置</el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <StemQuery ref="squery" :tcard="tabCard" @queryClick="queryClick" @addClick="addClick" @PassClick="PassClick" @FailClick="FailClick" @exportClick="exportClick" />
            <!--<el-upload :action="uploadUrl" class="uploadfile" ref="upload" name="file" :show-file-list="false" accept="*" :data="filedata" :on-success="handleSuccess" :file-list="fileLists"></el-upload>-->
            <el-table ref="multipTable" v-loading="tabloading" :data="tableData" border tooltip-effect="dark" element-loading-background="rgba(255, 255, 255, 1)" :element-loading-text="loadingText" :row-key="getRowKeys" @selection-change="selectionChange">
              <el-table-column type="selection" :reserve-selection="true" align="center" width="60px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
                  <template v-if="item.prop== 'type'">
                    {{ row[item.prop] == 1 ? '公办' : '民办'}}
                  </template>
                  <template v-else-if="item.prop== 'stype'">
                    {{ row[item.prop] == 1 ? '小学' : '初中'}}
                  </template>
                  <template v-else-if="item.prop== 'sw'">
                    {{ row[item.prop] == 0 ? '市内' : '市外'}}
                  </template>
                  <template v-else-if="item.prop== 'residentType'">
                    {{ row[item.prop] == 1 ? '博山本地户籍' : '非博山户籍'}}
                  </template>
                  <template v-else-if="item.prop== 'entranceType'">
                    {{ row[item.prop] == 1 ? '依据户籍入学' : '依据房产入学'}}
                  </template>
                  <template v-else-if="item.prop== 'specialType'">
                    {{ row[item.prop] == 1 ? '现役军人' :  row[item.prop] == 2 ? '公安英烈' : row[item.prop] == 3 ? '高层次人才' : row[item.prop] == 4 ? '援鄂一线医护人员' : '无特殊'}}
                  </template>
                  <template v-else-if="item.prop == 'status'">
                    <el-tag :type="row[item.prop] == 1 ? 'primary' : row[item.prop] == 2 ? 'danger':'success'">{{row[item.prop] == 1 ? '待审核': row[item.prop] == 2 ? '未通过': '已通过'}}</el-tag>
                  </template>
                  <template v-else>
                    {{ row[item.prop] ? row[item.prop] : '暂无数据' }}
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="240px" :align="tabCard == 'codest' ? 'left' : 'center'">
                <template #default="{row,$index}">
                  <el-button type="primary" plain @click.stop="lookClick(row.pid)">查看</el-button>
                  <el-button v-if="tabCard == 'codest' && row.status == 1" type="success" plain @click.stop="stemClick(row.pid)">审核</el-button>
                  <template v-if="tabCard == 'codend'">
                    <el-button type="success" plain @click.stop="editClick(row.pid)">编辑</el-button>
                    <el-button type="danger" plain @click.stop="delClick(row.pid)">删除</el-button>
                  </template>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <StemDialog ref="approveStem" @getData="getData" />
    <eduSignUp ref="signUpStem" @getData="getData" />
    <el-dialog :visible.sync="innerdialogVisible" :title="innertitle" width="36%" :before-close="innerClose" :append-to-body="true" :close-on-click-modal="false" center>
      <el-form ref="innerData" :model="innerData" :rules="inrules" status-icon label-width="60px">
        <el-form-item label="意见" prop="opinion">
          <el-input v-model="innerData.opinion" type="textarea" :rows="5" placeholder="请输入意见"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button type="primary" size="-" @click="saveData">确 定</el-button>
          <el-button size="-" @click="innerClose">取 消</el-button>
         </span>
    </el-dialog>
  </div>
</template>

<script>
export { default } from './js/educate'
</script>
<style scoped lang="scss">
@import "./style/educate.scss";
</style>
