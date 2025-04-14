<template>
  <div class="digital-container animate__animated animate__fadeInLeft">
      <el-container>
        <el-header>
          <div class="headerbox">
            <el-row>
              <el-col :span="8">
<!--                <el-select v-model="village">-->
<!--                  <el-option value="" label=""></el-option>-->
<!--                </el-select>-->
<!--                <el-select v-model="village">-->
<!--                  <el-option value="" label=""></el-option>-->
<!--                </el-select>-->
              </el-col>
              <el-col :span="8">
                <i></i>
              </el-col>
              <el-col :span="8"></el-col>
            </el-row>
          </div>
        </el-header>
        <el-main>
          <el-row :gutter="8">
            <el-col :span="6">
              <div class="itembox animate__animated animate__backInUp animate__delay-1s">
                <Aritail :atail="atail" />
              </div>
              <div class="itembox animate__animated animate__zoomIn animate__delay-1s">
                <Airtemper :atemperDate="atemperDate" :airTemperData="airTemperData" />
              </div>
              <div class="itembox animate__animated animate__backInLeft animate__delay-1s">
                <Aircompost :airCompost="airCompost" />
              </div>
            </el-col>
            <el-col :span="12">
              <div class="itembox mapitem animate__animated animate__zoomIn">
                <Mapbox />
              </div>
              <div class="itembox suritem animate__animated animate__flipInX animate__delay-1s">
                <Airsurvey :asurveyDate="asurveyDate" :asurveypm2="asurveypm2" :asurveypm10="asurveypm10" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="itembox soilitem animate__animated animate__flipInY animate__delay-1s">
                <Soildata :soildata="soildata" />
              </div>
              <div class="itembox voltitem animate__animated animate__fadeInUp animate__delay-1s">
                <Voltage :volt="volt" />
              </div>
              <div class="itembox animate__animated animate__delay-1s animate__backInDown">
                <Soilsurvey :soilsurveyDate="soilsurveyDate" :soilsurveywd="soilsurveywd" :soilsurveysd="soilsurveysd" />
              </div>
            </el-col>
          </el-row>
        </el-main>
      </el-container>
  </div>
</template>

<script>
import Aritail from "./components/Aritail";
import Airtemper from "./components/Airtemper";
import Aircompost from "./components/Aircompost";
import Mapbox from './components/Mapbox';
import Airsurvey from "./components/Airsurvey";
import Soildata from "./components/Soildata";
import Voltage from "./components/Voltage";
import Soilsurvey from "./components/Soilsurvey";
export default {
  name: "index",
  data() {
    return {
      login_scale:[],
      atail:[],
      atemperDate:[],
      airTemperData:[],
      airCompost:[],
      asurveypm2:[],
      asurveypm10:[],
      asurveyDate:[],
      soildata:[],
      volt:{},
      soilsurveyDate:[],
      soilsurveywd:[],
      soilsurveysd:[],
      village:''
    }
  },
  components: {
    Aritail,
    Airtemper,
    Aircompost,
    Mapbox,
    Airsurvey,
    Soildata,
    Voltage,
    Soilsurvey
  },
  computed: {},
  created() {
    this.getData()
  },
  mounted() {
    this.getLoginScale()
    window.onresize = this.getLoginScale()
  },
  methods: {
    getLoginScale(){
      let {clientHeight,clientWidth} = document.documentElement
      this.login_scale = [clientWidth / 1920 ,clientHeight / 970]
    },
    getData(){
      this.$http({
        url:`/sensor/getSensorRxd`,
        method:'post'
      }).then(res=>{
        let json = res.data
        this.atail = json.illuminationIntensity
        this.atemperDate = json.airTemperatureTime
        this.airTemperData = json.airTemperatureData
        this.airCompost = json.airComposition
        this.asurveypm2 = json.airCompositionData_pm2
        this.asurveypm10 = json.airCompositionData_pm10
        this.asurveyDate = json.airCompositionTime
        this.soildata = json.soilData
        this.volt = json.voltageStatistics
        this.soilsurveyDate = json.soilDataTime
        this.soilsurveywd = json.soilDataData_wd
        this.soilsurveysd = json.soilDataData_sd
      })
    },
  }
}
</script>

<style lang="scss" scoped>
@import './style/szdp.scss';
</style>
