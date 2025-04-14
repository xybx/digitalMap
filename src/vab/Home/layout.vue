<template>
  <div class="home animate__animated animate__fadeInLeft" :class="classHome">
    <div class="bgbox" v-if="backData.level != 2 &&backData.style == 1">
      <i class="lightbox animate__animated animate__fadeInDown animate__delay-1s"></i>
      <i class="bgbox animate__animated animate__zoomIn animate__delay-3s"></i>
    </div>
    <el-container>
      <el-header>
        <levHeader v-if="backData.level==2"></levHeader>
        <vabHeader v-else :pages="pages" :sflex="backData.style"></vabHeader>
      </el-header>
      <el-main>
        <div v-if="level == 2 || backData.level==2" class="levmain">
          <h3 class="levtit animate__animated animate__zoomIn animate__delay-2s">{{ levtitle }}</h3>
          <div class="levnew animate__animated animate__fadeInUp animate__delay-2s" v-if="newsData.length > 0"
               @click="newsClick">
            <label>最新消息:</label>
            <el-carousel height="20px" direction="vertical" indicator-position="none">
              <el-carousel-item v-for="(item,index) in newsData" :key="index">
                <span>{{ item }}</span>
              </el-carousel-item>
            </el-carousel>
          </div>
          <ul class="levlist">
            <li v-for="(item,index) in navData" :key="index" @mouseenter="showbg(index+1)"
                @mouseleave="showout(index+1)">
              <div v-if="showsort[index]" class="iconbox animate__animated"
                   :class="showsort[index] ? 'animate__fadeIn' : 'animate__fadeOut'">
                <i></i>
                <span>{{ item }}</span>
              </div>
              <dl class="navmenu animate__animated" :class="showsort[index] ? 'animate__fadeOut' : 'animate__fadeIn'"
                  v-if="!showsort[index]">
                <dd v-for="val in menuData" :key="val.title" @click="menurouter(val.rindex)">{{ val.title }}</dd>
              </dl>
            </li>
          </ul>
          <ul class="timelist">
            <li>
              <h3>平台已安全运行(天)</h3>
              <div class="tfont">
                <template v-for="item in dlist">
                  <span class="bgfont">{{ item }}</span>
                </template>
                <span class="timebox">{{ second }}</span>
              </div>
            </li>
            <li>
              <h3>平台用户总数(人)</h3>
              <div class="tfont">
                <template v-for="item in ulist">
                  <span class="bgfont">{{ item }}</span>
                </template>
              </div>
            </li>
          </ul>
        </div>
        <div class="mainbox" v-else>
          <ul class="wlist animate__animated animate__bounceIn animate__delay-2s" v-if="backData.style == 3">
            <li v-for="(item,index) in navData" :key="index" :class="{ active: sortIsActive == index }"
                @click="navClick(index)" @mouseenter="mouseenter(index)">
              <span>{{ item }}</span>
              <i></i>
            </li>
          </ul>
          <logo v-if="backData.style == 1 || backData.style == 2" :sflex="backData.style"/>
          <global v-if="showarr[0]" :sflex="backData.style"/>
          <nation v-if="showarr[1]" :sflex="backData.style"/>
          <govern v-if="showarr[2]" :sflex="backData.style"/>
          <leader v-if="showarr[3]" :sflex="backData.style"/>
        </div>
      </el-main>
      <el-footer v-if="backData.level != 2 &&(backData.style == 1 || backData.style == 2)" :class="classObject">
        <ul class="navlist animate__animated animate__bounceIn animate__delay-2s">
          <li v-for="(item,index) in navData" :key="index" :class="{ active: sortIsActive == index }" @mouseenter="mouseenter(index)">
            <span>{{ item }}</span>
            <i></i>
          </li>
        </ul>
      </el-footer>
    </el-container>
  </div>
</template>
<script>
import vabHeader from '@/vab/components/VabHeader/index.vue';
import global from './components/global'
import nation from './components/nation'
import govern from "./components/govern";
import leader from "./components/leader";
import logo from "./components/logo";
import levHeader from "./components/levHeader";
import {getHome, getHomelist, getLevuserTime} from '@/api/user'
import {mapGetters, mapMutations} from "vuex";
import {timeSec} from "@/utils/timeDate";
import {getNewsList} from '@/views/levelmsg/api/news'
import {debounce, Ndebounce} from "@/utils/validate";

export default {
  name: 'layout',
  data() {
    return {
      pages: true,
      fullYear: new Date().getFullYear(),
      navData: [],
      showarr: [true, false, false, false],
      sortIsActive: 0,
      levtitle: '',
      newsData: [],
      showsort: [true, true, true, true],
      menuData: [],
      dlist: [],
      ulist: [],
      second: '',
      activeSorts: null,
      indexs: null,
      timer: null,
      times: null,
      baseurl:''
    }
  },
  components: {
    vabHeader,
    global,
    nation,
    govern,
    leader,
    logo,
    levHeader
  },
  computed: {
    ...mapGetters({
      userData: 'user/userData',
      backData: 'user/backData',
      routers: 'routes/routes',
      level: 'user/level'
    }),
    classObject() {
      return {
        intel: this.backData.style == 1,
        land: this.backData.style == 2
      }
    },
    classHome() {
      return {
        inter: this.backData.level != 2 && this.backData.style == 1,
        local: this.backData.level != 2 && this.backData.style == 2,
        frash: this.backData.level != 2 && this.backData.style == 3,
        level: this.level == 2 || this.backData.level == 2
      }
    }
  },
  created() {
    this.baseurl = this.$baseUrl
    localStorage.removeItem('showMenuIndex')
    localStorage.removeItem('childMenuIndex')
    this.getTime();
  },
  mounted() {
    this.getnav()
    if (this.level == 2 || this.backData.level == 2) {
      this.getNews()
      this.getNums()
    }
  },
  methods: {
     ...mapMutations({
      setCollapse:'settings/setCollapse'
    }),
    async getnav() {
      let areaid = this.userData.areaid
      let res = await getHome({areaid})
      if (res.data) {
        let arr = res.data.map(item => {
          return item.newtitle ? item.newtitle : item.title
        })
        this.navData = arr
      }
    },
    mouseenter(i) {
      let arr = [[true, false, false, false], [false, true, false, false], [false, false, true, false], [false, false, false, true]]
      let crr = Object.keys(arr).map(item => Number(item))
      if (crr.includes(i)) {
        this.showarr = arr[i]
      }
      this.sortIsActive = i
    },
    navClick(i) {
      // if (i == 3) {
      //   let url = this.$router.resolve({
      //     path: '/leader',
      //   })
      //   window.open(url.href, '_blank')
      // }
    },
    async getNews() {
      this.levtitle = '共建共治，数字赋能'
      let res = await getNewsList({uid: this.userData.pid, pagenumber: 1, pagesize: 10})
      this.newsData = res.data.length > 0 ? res.data.map(item => item.title) : []
    },
    async getNums() {
      let {data} = await getLevuserTime()
      let str1 = data.yunxingtianshu.toString(), str2 = data.yonghushu.toString()
      this.dlist = str1.split('')
      this.ulist = str2.split('')
    },
    showbg(index) {
      this.showsort[index - 1] = false;
      this.menuData = []
      if (this.timer) {
        clearTimeout(this.timer)
      }
      this.timer = setTimeout(() => {
        this.showNav(index)
      }, 300)
    },
    async showNav(index) {
      let trr = [6, 7, 8, 9]
      let params = {areaid: this.userData.areaid, typeid: trr[index - 1]}
      let res = await getHomelist(params)
      this.menuData = res.data.length > 0 ? res.data.map(item => {
        return {
          title: item.newtitle ? item.newtitle : item.title,
          rindex: item.rindex
        }
      }) : []
    },
    showout(index) {
      this.showsort[index - 1] = true;
    },
    menurouter(key) {
      localStorage.setItem('showMenuIndex', key)
      if(key ==40) this.setCollapse(true)
      else this.setCollapse(false)
      let arr = this.routers.filter(item => {
        return item.showMenuIndex === key
      })
      if (arr.length > 0) {
        let url = arr[0].path
        this.$router.push({path: url})
      } else {
        this.$baseConfirm('你暂无权限查看此栏目，请联系管理员！', '信息提示', () => {
          return false
        })
      }
    },
    newsClick() {
      localStorage.setItem('showMenuIndex', 24)
      let arr = this.routers.filter(item => {
        return item.showMenuIndex == 24
      })
      this.$router.push({path: arr[0].path})
    },
    getTime() {
      setInterval(() => {
        this.second = timeSec()
      }, 1000)
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/vab/styles/home/layout.scss";
</style>
