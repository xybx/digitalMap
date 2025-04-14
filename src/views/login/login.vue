<template>
  <div class="login-container animate__animated animate__backInLeft animate__delay-1s" :style="{background:backData.background ?'url('+ baseurl + '/gridfs/artworkmaster/'+ backData.background +') center fixed no-repeat' : 'url('+ require('@/assets/backbg.png') +') center fixed no-repeat'}">
    <el-row class="login_bg">
      <div class="top">
        <div class="top_title animate__animated animate__backInDown animate__delay-2s" :style="{background:backData.title ? 'url('+ baseurl + '/gridfs/artworkmaster/'+ backData.title +') center no-repeat' : 'url('+ require('@/assets/logo.png') +') center no-repeat',width:redirect !='/'?'45%':'40%'}"></div>
        <div class="timebox animate__animated animate__fadeInDown animate__delay-3s">
          <span>{{datefont}}</span>
        </div>
      </div>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24" class="flbox">
        <div class="fontbox">
          <i class="iconlogo animate__animated animate__zoomInDown animate__delay-1s" :style="{background:backData.seal ? 'url('+ baseurl + '/gridfs/artworkmaster/'+ backData.seal +') center no-repeat' : 'url('+require('@/assets/icongolbal.png') +') center no-repeat'}"></i>
          <i class="iconfup animate__animated animate__bounceInLeft animate__delay-2s"></i>
          <i v-if="backData.level !== 2" class="iconfdown animate__animated animate__flipInX animate__delay-2s"></i>
        </div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form animate__animated animate__flipInY animate__delay-2s"
          label-position="left">

          <div class="title-tips">
            {{ translateTitle('用户登录') }}
          </div>
          <el-form-item prop="username" style="margin-top: 40px">
            <el-input
              v-model.trim="form.username"
              :placeholder="translateTitle('请输入手机号')"
              tabindex="1"
              type="text"
              maxlength="11"
            >
              <template #prefix>
                <!-- <vab-icon icon="user-line" />  -->
                <i class="iconfont icon-user-line"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model.trim="form.password"
              :placeholder="translateTitle('请输入密码')"
              :type="passwordType"
              tabindex="2"
            >
              <template #prefix>
                <!-- <vab-icon icon="lock-line" /> -->
                <i class="iconfont icon-lock-line"></i>
              </template>
              <template v-if="passwordType === 'password'" #suffix>
                <!-- <vab-icon
                  class="show-password"
                  icon="eye-off-line"
                  @click="handlePassword"
                /> -->
                <i class="iconfont icon-eye-off-line show-password" @click="handlePassword"></i>
              </template>
              <template v-else #suffix>
                <!-- <vab-icon
                  class="show-password"
                  icon="eye-line"
                  @click="handlePassword"
                /> -->
                <i class="iconfont icon-eye-line show-password" @click="handlePassword"></i>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-popover
              v-if="!validpass"
              placement="top"
              trigger="click">
              <slideverify @passClick="passClick" />
              <el-button slot="reference" :icon="picon">{{pmsg}}</el-button>
            </el-popover>
            <el-button v-if="validpass" class="pbtn" type="success" plain :icon="picon">{{pmsg}}</el-button>
          </el-form-item>
          <el-button
            :loading="loading"
            class="login-btn"
            type="primary"
            @click="handleLogin"
          >
            {{ translateTitle('登录') }}
          </el-button>
        </el-form>
      </el-col>
      <el-col :lg="1" :md="1" :sm="24" :xl="1" :xs="24" style="height:calc(100% - 100px)">
        <div style="color: transparent"></div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {isPassword} from "@/utils/validate";
import {timeDate, timeSecond} from "@/utils/timeDate";
import {mapActions, mapGetters} from "vuex";
import validcode from "@/components/ValidCode";
import {translateTitle} from "@/utils/i18n";
import slideverify from '@/components/SlideVerify'
import {getBack} from '@/api/user'
import {toLoginRoute} from "@/utils/routes";
import {getDecrypt, getEncrypt} from "@/utils/encryption";
export default {
  name: "login",
  directives: {
    focus: {
      inserted(el) {
        el.querySelector('input').focus()
      },
    },
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer)
    next()
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if ('' === value)
        callback(new Error(this.translateTitle('手机号不能为空')))
      else callback()
    }
    const validatePassword = (rule, value, callback) => {
      if (!isPassword(value))
        callback(new Error(this.translateTitle('密码不能少于2位')))
      else callback()
    }
    return {
      form: {
        username: '',
        password: '',
        validcode:''
      },
      rules: {
        username: [{required: true, trigger: 'blur', validator: validateUsername}],
        password: [{required: true, trigger: 'blur', validator: validatePassword}]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      areaid:undefined,
      token:null,
      level:null,
      timer: 0,
      datefont:timeDate(),
      second:timeSecond(),
      validpass:false,
      picon:'el-icon-info',
      pmsg:'点击完成拼图验证',
      baseurl:''
    }
  },
  computed: {
    ...mapGetters({
      title: 'settings/title',
      backData:'user/backData'
    }),
  },
  components:{
    validcode,
    slideverify
  },
  watch: {
    $route: {
      async handler(route) {
        this.redirect = (route.query && route.query.redirect) || '/'
        this.areaid = (route.query && route.query.areaid) || sessionStorage.getItem('areaid')
        await this.getBack(this.areaid)
        this.token = (route.query && route.query.token)
        this.level = (route.query && route.query.level)
        if(this.token && this.level){
          await this.getToken(this.token,this.level)
          await this.$router.push(this.handleRoute())
        }
      },
      immediate: true,
      deep:true,
    },
  },
  created() {
    this.baseurl = this.$baseUrl
  },
  mounted() {
  },
  methods: {
    ...mapActions({
      login: 'user/login',
      getBack:'user/getBack',
      getToken:'user/getToken',
    }),
    translateTitle,
    passClick(val,str){
      if(val){
        this.validpass = val
        this.picon = 'el-icon-success'
        this.pmsg = `验证通过，耗时${(str / 1000).toFixed(1)}s`
      }else {
        this.validpass = val
        this.pmsg = str
        if(str == '刷新成功'){
          this.picon = 'el-icon-circle-check'
        }else {
          this.picon = 'el-icon-error'
        }
        setTimeout(()=>{
          this.picon = 'el-icon-info'
          this.pmsg = '点击完成拼图验证'
        },2000)
      }
    },
    handlePassword() {
      this.passwordType === 'password'
        ? (this.passwordType = '')
        : (this.passwordType = 'password')
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleRoute() {
      return this.redirect === '/404' || this.redirect === '/403' ? '/' : this.redirect
    },
    handleLogin() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          if(!this.validpass){
            this.$message.error('请先验证拼图通过，再登录！')
            return false
          }
          try {
            this.loading = true
            let form = {
              username:getEncrypt(this.form.username),
              password:getEncrypt(this.form.password)
            }
            Object.assign(form,{areaid:this.areaid == '/' ? getEncrypt(0): getEncrypt(this.areaid)})
            await this.login(form)
            // this.$delete(this.form,'validcode')
            // Object.assign(this.form,{areaid:this.areaid == '/' ? 0: this.areaid})
            // await this.login(this.form)
            await this.$router.push(this.handleRoute())
            this.loading = false
          } catch {
            await this.$router.push(toLoginRoute(sessionStorage.getItem('areaid')))
            this.loading = false
          }
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
@import "@/vab/styles/scss/login.scss";
</style>
