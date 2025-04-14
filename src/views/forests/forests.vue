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
  <div class="forest">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>森林防火管理</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
              <el-radio-button label="codest"><i class="iconfont icon-changsuoma"></i>防火场所码管理</el-radio-button>
              <el-radio-button label="codend"><i class="iconfont icon-shenfenma"></i>人员身份码管理</el-radio-button>
              <el-radio-button label="codeth"><i class="iconfont icon-yonghujiluchaxun"></i>人员记录查询</el-radio-button>
              <el-radio-button label="codefth"><i class="iconfont icon-goodsppecategory"></i>场所码类别</el-radio-button>
              <el-radio-button label="codevth"><i class="iconfont icon-pashan"></i>上山事项</el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <frestquery ref="fquery" @queryClick="queryClick" @addClick="addClick" :frule="tabCard"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
<!--                  <template v-if="item.prop== 'sendmestype'">-->
<!--                    {{ row[item.prop] == 1 ? '临期提醒' : '到期提醒'}}-->
<!--                  </template>-->
<!--                  <template v-else-if="item.prop== 'period'">-->
<!--                    {{ row[item.prop] ? `${row['period']}${row['ruletype'] == 1 ? '年' : row['ruletype'] == 2 ? '周' : '日'}` : '暂无数据'}}-->
<!--                  </template>-->
                    {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
<!--                  <template v-else>-->
<!--                  </template>-->
                </template>
              </el-table-column>
              <el-table-column label="操作" width="300px" align="center">
                <template #default="{row,$index}">
                  <el-button v-if="tabCard== 'codest'" type="warning" plain @click.stop="codeClick(row.pid)">生成场所码</el-button>
                  <el-button v-if="tabCard== 'codend'" type="warning" plain @click.stop="lookcode(row.pid)">查看人员身份码</el-button>
                  <el-button v-if="tabCard!== 'codest' && tabCard!== 'codend'" type="primary" plain @click.stop="lookClick(row.pid)">查看</el-button>
                  <el-button v-if="tabCard!== 'codeth'" type="success" plain @click.stop="editClick(row.pid)">编辑</el-button>
                  <el-button type="danger" plain @click.stop="delClick(row.pid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <frestdialog ref="frestlog" @getData="getData" :tcard="tabCard" />
  </div>
</template>

<script>
export { default } from './js/forests'
</script>

<style lang="scss" scoped>
@import "./style/forest.scss";
</style>
