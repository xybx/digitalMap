<template>
  <div>
    <div class="switch-box">
      <el-button :icon="switchIcon" @click="switchBtn" circle></el-button>
    </div>
    <el-collapse-transition>
      <div class="map-control" v-show="!show">
          <button v-for="(item,index) in btnData" :key="index" type="button" class="el-button el-button--default" :class="{ active: sortIsActive == index }" @click="menuClick(index)">
            <i :class="item.classname"></i>
            <span>{{item.title}}</span>
          </button>
      </div>
    </el-collapse-transition>
    <!-- 图例 -->
    <el-dialog
      :visible.sync="dialogTuli"
      class="arcdialog"
      :modal="false"
      :close-on-click-modal="false"
      custom-class="tuli"
    >
      <template slot="title">
        <!-- 下拉选择框 -->
        <el-dropdown trigger="click" @command="dropdown">
          <span class="el-dropdown-link">
            {{ dropdownTitle }}
            <i class="el-icon-caret-bottom"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              v-for="item in dropList"
              :key="item.id"
              :command="item.name"
            >
              {{ item.name }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </template>
      <span>
        <el-collapse v-model="activeCollNames">
          <el-collapse-item
            :title="item.title"
            :name="'' + item.id"
            v-for="item in legendList"
            :key="item.id"
          >
            <ul class="legendUl">
              <li v-for="subItem in item.children" :key="subItem.id">
                <span
                  class="colorBox"
                  :style="{
                    backgroundColor: subItem.class,
                    border: subItem.border,
                  }"
                ></span>
                <span>{{ subItem.title }}</span>
              </li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  large,
  small,
  initextent,
  length_area,
  Attribute,
  clearmap,
  settool,
  Lenged,
  DrawGrid,
  DeleteGrid,
  toggleBasemap,
  mapSwitch
} from '@/utils/arcgis_map'
import {getMenuUrl} from "@/views/numtask/api/spetask";
import {mapGetters} from 'vuex'
export default {
  name: 'mapControl',
  props: ['showhight'],
  components: {},
  data() {
    return {
      dialogTuli: false,
      dialogGrid:false,
      gridForm:{},
      villdata:[],
      switchIcon: 'iconfont icon-tool-cabinet_icon',
      show: false,
      dropList: [
        { id: 1, name: '历史已批农转用红线【20-2000】' },
        { id: 2, name: '红线2' },
        { id: 3, name: '红线3' },
        { id: 4, name: '红线4' },
        { id: 5, name: '红线5' },
      ],
      activeCollNames: ['1', '2', '3', '4'],
      dropdownTitle: '请选择',
      legendList: [
        {
          id: 1,
          title: '允许建设区',
          name: '允许',
          children: [
            { title: '010', class: 'rgb(0,0,0,0)' },
            {
              title: '020',
              class: 'rgb(183,183,183,0.4)',
              border: '1px solid rgb(183,183,183)',
            },
            { title: '030', class: 'rgb(100,100,100)' },
            { title: '040', class: 'rgb(155,0,105)' },
          ],
        },
        {
          id: 2,
          title: '禁止建设区',
          name: '禁止',
          children: [
            { title: '010', class: 'red' },
            { title: '020', class: 'yellow' },
            { title: '030', class: 'lime' },
            { title: '040', class: 'green' },
          ],
        },
        {
          id: 3,
          title: '有条件建设区',
          name: '有条件',
          children: [
            { title: '010', class: 'red' },
            { title: '020', class: 'yellow' },
            { title: '030', class: 'lime' },
            { title: '040', class: 'green' },
          ],
        },
        {
          id: 4,
          title: '限制建设区',
          name: '限制',
          children: [
            { title: '010', class: 'red' },
            { title: '020', class: 'yellow' },
            { title: '030', class: 'lime' },
            { title: '040', class: 'green' },
          ],
        },
      ],
      sortIsActive:null,
      btnData:[],
      furl:'',
      islegend:false,//判断图例显示,
      isshowmap:true,//影像图显示控制
    }
  },
  computed:{
    ...mapGetters({
      userData:'user/userData'
    })
  },
  mounted() {
    this.getGridUrl()
    this.getmenu()
  },
  methods: {
    getmenu(){
      this.btnData = [
        // {classname:'el-icon-circle-close',title:'关闭'},
        {classname:'el-icon-zoom-in',title:'放大'},
        {classname:'el-icon-zoom-out',title:'缩小'},
        {classname:'el-icon-picture-outline',title:'全图'},
        {classname:'el-icon-scissors',title:'测距'},
        {classname:'el-icon-c-scale-to-original',title:'面积'},
        {classname:'el-icon-delete',title:'清除'},
        {classname:'el-icon-warning-outline',title:'属性'},
        {classname:'el-icon-coin',title:'图例'},
        {classname:'el-icon-thumb',title:'网格'},
        {classname:'el-icon-coin',title:'删网'},
        {classname:'el-icon-search',title:'查询'},
        {classname:'el-icon-sort',title:'影像图'},
      ]
    },
    async getGridUrl(){
      let json = await getMenuUrl({typeid:10})
      this.furl = json.data
    },
    menuClick(i){
      let arr = ['large','small',null,'length','area','','attr',undefined,'grid',"deletegrid",'query','mapSwitch']
      let krr = Object.keys(arr).map(item=> Number(item))
      if(krr.includes(i)){
        if(i!= 2 && i != 7){
          settool(arr[i])
        }

         if(i ==0) {large()}
        else if(i == 1) {small()}
        else if(i == 2) {initextent()}
        else if(i == 3 || i == 4) {length_area(arr[i])}
        else if(i == 5) {clearmap()}
        else if(i == 6) {Attribute()}
        else if(i == 7) {Lenged()}
        else if(i == 9) {DeleteGrid(this.furl,this.userData.pid)}
        else if(i==11){
          mapSwitch(this.isshowmap)
        this.isshowmap=!this.isshowmap
        }
      }
      this.showTab(i)
      this.sortIsActive = i == this.sortIsActive ? null : i
    },
    getShow(){
      this.sortIsActive = null
    },
    showTab(i){
     this.$emit('showtab',i == 10 || i == 8 ? true : false,i)
    },
    dropdown(command) {
      this.dropdownTitle = command
    },
    // 图例项默认全部展开
    getActiveCollNames() {
      this.activeCollNames = this.legendList.map((item, index) => {
        return item.id + ''
      })
    },
    switchBtn() {
      this.show = !this.show
      if (this.show) {
        this.switchIcon = 'iconfont icon-tool-cabinet_icon'
      } else {
        this.switchIcon = 'iconfont icon-tool-cabinet_icon'
      }
    },
  },
}
</script>

<style scoped lang="scss">
.switch-box {
  position: absolute;
  top: 20px;
  right: 40px;
  .el-button{
    background:rgba(30, 99, 151, .6)!important;
    border-color:#2F9DF2;
  }
  .el-button--small.is-circle {
    padding: 12px;
  }
  ::v-deep {
    .iconfont {
      font-size: 22px;
      color:#2F9DF2;
    }
  }
}
.map-control {
  position: absolute;
  top: 70px;
  right: 28px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 4px;
  .el-button {
    padding: 10px 8px;
    border-radius: 0;
    background:rgba(30, 99, 151, .8);
    color: #fff;
    border-color:#2F9DF2;
    &.active{
      background:linear-gradient(left,rgba(0, 241, 255,.8),rgba(30, 99, 151, .8));
      background:-webkit-linear-gradient(left,rgba(0, 241, 255,.8),rgba(2, 171, 255,.2));
    }
  }
  .el-button + .el-button {
    margin-left: 0;
  }
}
::v-deep {
  .tuli {
    margin: 0 !important;
    position: absolute;
    bottom: 20px;
    right: 20px;
    width: 430px !important;
    height: 250px;
    .el-dialog__header {
      padding: 3px !important;
      border-bottom: 1px solid #d7d7d7;
      .el-dialog__headerbtn {
        top: 10px !important;
      }
    }
    .el-dialog__body {
      padding: 5px 10px !important;
      height: 200px;
      overflow-y: auto;
      .el-input__inner {
        height: 35px !important;
      }
    }
    .redline-select {
      width: 90%;
      .el-icon-arrow-up:before {
        content: '\e78f';
      }
      .el-input__inner {
        border: 0;
      }
      .el-input__inner:hover {
        color: #409eff;
      }
    }
    .el-collapse {
      border-top: 0;
      border-bottom: 0;
      .el-collapse-item__header {
        height: 30px;
      }
      .el-collapse-item__content {
        padding-bottom: 0;
      }
      .legendUl {
        display: flex;
        justify-content: space-around;
        padding-inline-start: 0;
        margin-block-start: 0;
        margin-block-end: 0;
        margin-bottom: 10px;
        li {
          display: flex;
          align-items: center;
        }
      }
      ::v-deep {
        .colorBox {
          display: inline-block;
          width: 20px;
          height: 20px;
          margin-right: 10px;
          // border: 1px solid #000;
        }
      }
      .red {
        background-color: #dc6278;
      }
      .yellow {
        background-color: #fdd183;
      }
      .lime {
        background-color: #98fe7e;
      }
      .green {
        background-color: #2ab451;
      }
    }
  }
}
.el-dialog__wrapper {
  position: inherit !important;
}
</style>
