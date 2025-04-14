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
  <div class="fhome">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <i></i>
        <span>防火管理</span>
      </div>
      <el-container>
        <el-aside>
          <div class="vflex">
            <el-radio-group v-model="tabCard" class="radiogroup" @change="tabChange" size="—">
              <el-radio-button label="totask"><i class="iconfont icon-renwuchuli"></i>本年度进行任务</el-radio-button>
              <el-radio-button label="yetask"><i class="iconfont icon-renwuguanli"></i>往年度进行任务</el-radio-button>
              <el-radio-button label="tomsg"><i class="iconfont icon-jinxingzhong"></i>今日推送提醒任务</el-radio-button>
              <el-radio-button label="overtask"><i class="iconfont icon-gongzuorenwu"></i>已结束任务</el-radio-button>
              <el-radio-button label="msgrule"><i class="iconfont icon-yingxiaoguanli-dingdanguanli"></i>推送提醒规则</el-radio-button>
            </el-radio-group>
          </div>
        </el-aside>
        <el-main>
          <div class="text item">
            <firequery ref="fquery" @queryClick="queryClick" @addClick="addClick" :frule="tabCard"/>
            <el-table v-loading="tabloading" :data="tableData" border tooltip-effect="dark" :element-loading-text="loadingText">
              <el-table-column type="index" label="序号" align="center" width="60px"></el-table-column>
              <el-table-column v-for="item in tableColumns" :key="item.prop" align="center" show-overflow-tooltip :label="item.label">
                <template #default="{ row, $index }">
                  <template v-if="item.prop== 'sendmestype'">
                    {{ row[item.prop] == 1 ? '临期提醒' : '到期提醒'}}
                  </template>
                  <template v-else-if="item.prop== 'period'">
                    {{ row[item.prop] ? `${row['period']}${row['ruletype'] == 1 ? '年' : row['ruletype'] == 2 ? '周' : '日'}` : '暂无数据'}}
                  </template>
                  <template v-else>
                    {{ row[item.prop] ? row[item.prop] : '暂无数据'}}
                  </template>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="260px" align="center">
                <template #default="{row,$index}">
                  <el-button v-if="tabCard === 'tomsg'" type="warning" plain @click.stop="sendClick(row.pid)">推送提醒</el-button>
                  <el-button type="primary" plain @click.stop="lookClick(row.pid)">查看</el-button>
                  <el-button v-if="tabCard !== 'tomsg' && tabCard !== 'overtask'" type="success" plain @click.stop="editClick(row.pid)">编辑</el-button>
                  <el-button type="danger" plain @click.stop="delClick(row.pid)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination background :current-page="pageNo" :page-size="pageSize" :page-sizes="pageSizes" :layout="layout" :total="total" @size-change="SizeChange" @current-change="CurrentChange"></el-pagination>
          </div>
        </el-main>
      </el-container>
    </el-card>
    <firedialog ref="firelog" @getData="getData" :tcard="tabCard" />
  </div>
</template>

<script>
export { default } from './js/fhome'
</script>

<style lang="scss" scoped>
@import "./style/fhome.scss";
</style>
