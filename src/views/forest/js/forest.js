/*
 * @ProjectName:webmap
 * @Author:12390
 * @Date: 2023/4/7 13:55:28
 * @LastEditors: 12390
 * @LastEditTime: 2023/4/7 13:55:28
 * @Description: HTML Page of Javascript
 * Copyright (c) 2022 by xybx, All Rights Reserved.
*/
import frestquery from "../components/forestquery.vue";
import frestdialog from "../components/forestdialog.vue";
import placeCodeDialog from "../components/placeCodeDialog";
import placeCodeTypeDialog from "../components/placeCodeTypeDialog";
import userIdentityDialog from "../components/userIdentityDialog";
import recordDialog from "../components/recordDialog";
import matterDialog from "../components/matterDialog";
import gatePassDialog from "../components/gatePassDialog";
import {
  delrule,
  deltask,
  getPlaceCodeList,
  delPlaceCode,
  getlastYearList,
  getmsgruleList,
  getPlaceCodeTypeList,
  delPlaceCodeType,
  queryUserList,
  delUser,
  delRecord,
  delMatter,
  queryMatterList,
  queryRecordList,
  getoverendList, getsendmsgList, putsendmsg, getAreaLevel
} from "@/views/forest/api/forest-api";
import {mapGetters} from "vuex";
import Record from "@/views/conven/record";

export default {
  name: 'forest',
  data() {
    return {
      tabCard: 'codest',
      tableColumns: [],
      tableData: [],
      tabloading: true,
      loadingText: "正在加载...",
      layout: "total, sizes, prev, pager, next, jumper",
      total: 0,
      page: 1,
      pageSize: 0,
      pageSizes: [10, 15, 20],
      formData: {},
    }
  },
  components: {
    Record,
    placeCodeDialog,
    placeCodeTypeDialog,
    userIdentityDialog,
    recordDialog,
    gatePassDialog,
    matterDialog,
    frestquery,
    frestdialog
  },
  computed: {
    ...mapGetters({
      userData: 'user/userData',
      backData: 'user/backData',
      routers: 'routes/routes',
      level: 'user/level'
    }),
  },
  created() {
    this.pageSize = this.pageSizes[0];
  },
  mounted() {
    this.getTableFields()
    this.getData()
  },
  methods: {
    async getTableFields() {
      if (this.tabCard == 'codest') {
        this.tableColumns = this.level == 2 ? [
          {prop: 'villageName', label: '所属镇街'},
          {prop: 'villageNumber', label: '镇街编号'},
          {prop: 'countryName', label: '所属村居'},
          {prop: 'placeName', label: '场所名称'},
          {prop: 'pid', label: '场所编码'},
          {prop: 'baopianLeader', label: '包片领导'},
          {prop: 'villageSecretary', label: '村书记'},
          {prop: 'typeName', label: '场所类别'}
        ] : [
          {prop: 'villageName', label: '所属镇街'},
          {prop: 'villageNumber', label: '镇街编号'},
          {prop: 'countryName', label: '所属村居'},
          {prop: 'placeName', label: '场所名称'},
          {prop: 'pid', label: '场所编码'},
          {prop: 'baopianLeader', label: '包片领导'},
          {prop: 'villageSecretary', label: '村书记'},
          {prop: 'typeName', label: '区级场所类别'},
          {prop: 'vtypeName', label: '镇街场所类别'}
        ]
      } else if (this.tabCard == 'codefth') {
        this.tableColumns = [
          {prop: 'name', label: '类型名称'},
          {prop: 'description', label: '描述'}
        ]
      } else if (this.tabCard == 'codevth') {
        this.tableColumns = [
          {prop: 'mattername', label: '事项名称'},
          {prop: 'description', label: '描述'}
        ]
      } else if (this.tabCard == 'codend') {
        this.tableColumns = [
          {prop: 'areaname', label: '所属镇街'},
          {prop: 'villagename', label: '所属村居'},
          {prop: 'name', label: '人员姓名'},
          {prop: 'memberid', label: '身份证号'},
          {prop: 'phonenum', label: '手机号'},
          {prop: 'address', label: '家庭住址'},
          {prop: 'issmoke', label: '是否吸烟'},
        ]
      } else if (this.tabCard == 'codeth') {
        this.tableColumns = this.level == 2 ? [
          {prop: 'incodeareaname', label: '所属镇街'},
          {prop: 'incodevillagename', label: '所属村居'},
          {prop: 'incodetype', label: '场所类别'},
          {prop: 'incode', label: '场所名称'},
          {prop: 'username', label: '人员姓名'},
          {prop: 'userphone', label: '手机号'},
          {prop: 'intime', label: '入口登记时间'},
          {prop: 'outtime', label: '出口登记时间'},
          {prop: 'duration', label: '停滞时长'},
          {prop: 'mattertype', label: '登记事项'},
        ]:[
          {prop: 'incodeareaname', label: '所属镇街'},
          {prop: 'incodevillagename', label: '所属村居'},
          {prop: 'incodetype', label: '区级场所类别'},
          {prop: 'incodevtype', label: '镇街场所类别'},
          {prop: 'incode', label: '场所名称'},
          {prop: 'username', label: '人员姓名'},
          {prop: 'userphone', label: '手机号'},
          {prop: 'intime', label: '入口登记时间'},
          {prop: 'outtime', label: '出口登记时间'},
          {prop: 'duration', label: '停滞时长'},
          {prop: 'mattertype', label: '登记事项'},
        ]
      }
    },
    async getData() {
      let res;
      if (this.tabCard == 'codest') {
        this.formData.page = this.page;
        this.formData.pageSize = this.pageSize;
        if (this.level != 2) {
          this.formData.villageId = this.userData.areaid;
        }
        res = await getPlaceCodeList(this.formData);
        if (res.code == 200 && res.data) {
          this.tableData = res.data.records ? res.data.records : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codend') {

        this.formData.pagenumber = this.page;
        this.formData.pagesize = this.pageSize;
        this.formData.page = undefined;
        this.formData.pageSize = undefined;
        if (this.level != 2) {
          this.formData.areaid = this.userData.areaid;
        }
        res = await queryUserList(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data ? res.data : []
          this.total = res.count
        } else {
          this.tableData = []
        }
      }  else if (this.tabCard == 'codefth') {
        this.formData.page = this.page;
        this.formData.pageSize = this.pageSize;
        res = await getPlaceCodeTypeList(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.records ? res.data.records : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      } else if (this.tabCard == 'codeth') {

        this.formData.pagenumber = this.page;
        this.formData.pagesize = this.pageSize;
        this.formData.page = undefined;
        this.formData.pageSize = undefined;
        res = await queryRecordList(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }

      } else if (this.tabCard == 'codevth') {
        this.formData.pagenumber = this.page;
        this.formData.pagesize = this.pageSize;
        this.formData.page = undefined;
        this.formData.pageSize = undefined;
        res = await queryMatterList(this.formData)
        if (res.code == 200 && res.data) {
          this.tableData = res.data.list ? res.data.list : []
          this.total = res.data.total
        } else {
          this.tableData = []
        }
      }

      setTimeout(() => {
        this.tabloading = false
      }, 200)
    },
    addClick() {
      if (this.tabCard == 'codest') {
        this.$refs.placeCodeRef.showEdit(null, 1)
      } else if (this.tabCard == 'codend') {
        this.$refs.userIdentityRef.showEdit(null, 1)
      } else if (this.tabCard == 'codeth') {
        this.$refs.recordRef.showEdit(null, 1)
      } else if (this.tabCard == 'codefth') {
        this.$refs.placeCodeTypeRef.showEdit(null, 1)
      } else if (this.tabCard == 'codevth') {
        this.$refs.matterRef.showEdit(null, 1)
      }

    },
    createGatePass(pid) {
      this.$refs.gatePassRef.show(pid)
    },
    lookClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.placeCodeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codend') {
        this.$refs.userIdentityRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codeth') {
        this.$refs.recordRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codefth') {
        this.$refs.placeCodeTypeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codevth') {
        this.$refs.matterRef.showEdit(pid, 2)
      }
    },
    editClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.placeCodeRef.showEdit(pid, 3)
      } else if (this.tabCard == 'codend') {
        this.$refs.userIdentityRef.showEdit(pid, 3)
      } else if (this.tabCard == 'codeth') {
        this.$refs.recordRef.showEdit(pid, 3)
      } else if (this.tabCard == 'codefth') {
        this.$refs.placeCodeTypeRef.showEdit(pid, 3)
      } else if (this.tabCard == 'codevth') {
        this.$refs.matterRef.showEdit(pid, 3)
      }
    },
    codeClick(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.placeCodeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codend') {
        this.$refs.userIdentityRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codeth') {
        this.$refs.recordRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codefth') {
        this.$refs.placeCodeTypeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codevth') {
        this.$refs.matterRef.showEdit(pid, 2)
      }
    },
    lookcode(pid) {
      if (this.tabCard == 'codest') {
        this.$refs.placeCodeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codend') {
        this.$refs.userIdentityRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codeth') {
        this.$refs.recordRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codefth') {
        this.$refs.placeCodeTypeRef.showEdit(pid, 2)
      } else if (this.tabCard == 'codevth') {
        this.$refs.matterRef.showEdit(pid, 2)
      }
    },
    sendClick(pid) {
      this.$baseConfirm('你确定要推送提醒吗？', '推送信息', async () => {
        let res = await putsendmsg({matterid: pid})
        if (res.code == 200) {
          this.$message.success('推送提醒成功')
          this.getData()
        }
      }, () => {
        this.$message.info('已取消推送提醒')
      })
    },
    delClick(pid) {
      this.$baseConfirm('你确定要删除吗？', '删除提示', async () => {
        let res;
        if (this.tabCard == 'codest') {
          res = await delPlaceCode(pid);
        } else if (this.tabCard == 'codend') {
          res = await delUser({pid: pid});
        } else if (this.tabCard == 'codeth') {
          res = await delRecord({pid: pid});
        } else if (this.tabCard == 'codefth') {
          res = await delPlaceCodeType(pid);
        } else if (this.tabCard == 'codevth') {
          res = await delMatter({pid: pid});
        }
        if (res.code == 200) {
          this.$message.success('删除成功')
          this.getData()
        }
      }, () => {
        this.$message.info('已取消删除')
      })
    },
    tabChange(val) {
      this.tabloading = true
      this.tabCard = val
      this.page = 1
      this.$refs.fquery.clearform()
      this.formData = {}
      this.getTableFields()
      this.getData()
      setTimeout(()=>{
        this.tabLoading = false
      },1500)
    },
    queryClick(form) {
      this.formData = form
      this.page = 1
      this.getData()
    },
    SizeChange(val) {
      this.pageSize = val;
      this.getData();
    },
    CurrentChange(val) {
      this.page = val;
      this.getData();
    }
  }
}
