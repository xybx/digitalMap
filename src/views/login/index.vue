<template>
  <div class="login-container animate__animated animate__backInLeft animate__delay-1s">
    <el-row class="login_bg">
      <div class="top">
        <div class="top_title animate__animated animate__backInDown animate__delay-2s"></div>
        <div class="timebox animate__animated animate__fadeInDown animate__delay-3s">
          <span>{{datefont}}</span>
        </div>
      </div>
      <el-col :lg="14" :md="11" :sm="24" :xl="14" :xs="24" style="height:calc(100% - 100px)">
        <div class="fontbox">
          <i class="iconfup animate__animated animate__bounceInLeft animate__delay-2s"></i>
          <i class="iconfdown animate__animated animate__flipInX animate__delay-3s"></i>
        </div>
      </el-col>
      <el-col :lg="9" :md="12" :sm="24" :xl="9" :xs="24">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form animate__animated animate__flipInY animate__delay-2s"
          label-position="left"
        >

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
              <template #prefix><i class="iconfont icon-user-line"></i></template>
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
          <el-form-item prop="validcode">
            <el-input
              v-model.trim="form.validcode"
              class="codebox"
              :placeholder="translateTitle('请输入验证码')"
              tabindex="3"
              type="text"
              maxlength="4"
              @keyup.enter.native="handleLogin"
            >
              <template #prefix><i class="iconfont icon-yanzhengma" /></template>
              <template #suffix><validcode :value.sync="validCode" ref="vcode" /></template>
            </el-input>
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
        <div style="color: transparent">占位符</div>
      </el-col>
    </el-row>
  <!--    <el-row>-->
  <!--      <el-col :lg="24" :md="24" :sm="24" :xl="24" :xs="24">-->
  <!--        <div class="footer">技术支持：洛阳鸿业迪普信息技术有限公司</div>-->
  <!--      </el-col>-->
  <!--    </el-row>-->
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex'
  import { translateTitle } from '@/utils/i18n'
  import { isPassword } from '@/utils/validate'
  import {timeDate,timeSecond} from '@/utils/timeDate'
  import validcode from '@/components/ValidCode'
  export default {
    name: 'index',
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
      const validateCode = (rule, value, callback) => {
        if ('' === value)
          callback(new Error(this.translateTitle('验证码不能为空')))
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
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
          validcode:[{ required: true, trigger: 'blur',validator:validateCode}]
        },
        loading: false,
        passwordType: 'password',
        redirect: undefined,
        timer: 0,
        datefont:timeDate(),
        second:timeSecond(),
        validCode:''
      }
    },
    computed: {
      ...mapGetters({
        title: 'settings/title',
      }),
    },
    components:{
      validcode
    },
    watch: {
      $route: {
        handler(route) {
          this.redirect = (route.query && route.query.redirect) || '/'
        },
        immediate: true,
      },
      validCode(e){
        this.validCode = e.toLowerCase();
      }
    },
    mounted() {
    },
    methods: {
      ...mapActions({
        login: 'user/login',
      }),
      translateTitle,
      handlePassword() {
        this.passwordType === 'password'
          ? (this.passwordType = '')
          : (this.passwordType = 'password')
        this.$nextTick(() => {
          this.$refs.password.focus()
        })
      },
      handleRoute() {
        return this.redirect === '/404' || this.redirect === '/403'
          ? '/'
          : this.redirect
      },
      handleLogin() {
        this.$refs.form.validate(async (valid) => {
          if (valid) {
            if(this.form.validcode !== this.validCode){
              this.$message.error('验证码错误，请重新输入')
              this.form.validcode = '';
              this.$refs.vcode.refreshCode()
              return false
            }
            try {
              this.loading = true
              this.$delete(this.form,'validcode')
              await this.login(this.form)
              await this.$router.push(this.handleRoute())
            } finally {
              this.loading = false
            }
          }
        })
      },
    },
  }
</script>

<style lang="scss" scoped>
  .login-container {
    height: 100vh;
    background: url('~@/assets/backbg.png') center center fixed no-repeat;
    background-size: 100% 100%;
  }
  .top{
    height: 100px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    .top_title{
      line-height: 100px;
      width: 35%;
      height: 50px;
      background: url('~@/assets/logo.png') center no-repeat;
      background-size: 100% 100%;
      margin-left: 10%;
    }
    .timebox{
      margin-right: 15%;
      span{
        display: inline-block;
        line-height: 100px;
        color: #fff;
        font-size:24px;
      }
    }


  }
  .login_bg{
    //background: url('~@/assets/login_bg.jpg') center center no-repeat;
    //background-size: cover;
    height: 100%;
    .fontbox{
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      margin-top: 18%;
      i{
        width: 600px;
        height: 50px;
        display: inline-block;
        &.iconfup{
          background: url('~@/assets/f1.png') center no-repeat;
          background-size: 100% 100%;
          margin-bottom: 3%;
        }
        &.iconfdown{
          background: url('~@/assets/f2.png') center no-repeat;
          background-size: 100% 100%;
        }
      }
    }
    .login-form {
      position: relative;
      max-width: 100%;
      padding: 4.5vh;
      margin:0 8vw;
      overflow: hidden;
      background: #fff;
      box-shadow: 1px 2px 5px 3px rgba(0,0,0,.3);
      border-radius:10px;
      top: 8vw;
      .title-tips {
        margin-top:20px;
        font-size: 28px;
        font-weight: 400;
        color: #1890ff;
      }

      .login-btn {
        display: inherit;
        width: 100%;
        height: 50px;
        margin-bottom:20px;
        font-size:18px;
        letter-spacing: 5px;
        border: 0;

        &:hover {
          opacity: 0.9;
        }

        .forget-passwordword {
          width: 100%;
          margin-top: 40px;
          text-align: left;

          .forget-password {
            width: 129px;
            height: 19px;
            font-size: 20px;
            font-weight: 400;
            color: rgba(92, 102, 240, 1);
          }
        }
      }

      .tips {
        margin-bottom: 10px;
        font-size: $base-font-size-default;
        color: $base-color-white;

        span {
          &:first-of-type {
            margin-right: 16px;
          }
        }
      }

      .title-container {
        position: relative;

        .title {
          margin: 0 auto 40px auto;
          font-size: 34px;
          font-weight: bold;
          color: $base-color-blue;
          text-align: center;
        }
      }

      i {
        position: absolute;
        top: 8px;
        left: 5px;
        z-index: $base-z-index;
        font-size: 16px;
        color: #d7dee3;
        cursor: pointer;
        user-select: none;
      }

      .show-password {
        position: absolute;
        right: 25px;
        left: -35px;
        font-size: 16px;
        color: #d7dee3;
        cursor: pointer;
        user-select: none;
      }

      ::v-deep {
        .el-form-item {
          padding-right: 0;
          margin: 20px 0;
          color: #454545;
          background: transparent;
          border: 1px solid transparent;
          border-radius:5px;

          &__content {
            min-height: $base-input-height;
            line-height: $base-input-height;
          }

          &__error {
            position: absolute;
            top: 100%;
            left: 18px;
            font-size: $base-font-size-small;
            line-height: 18px;
            color: $base-color-red;
          }
        }

        .el-input {
          box-sizing: border-box;
          input {
            height: 48px;
            padding-left: 35px;
            font-size: $base-font-size-default;
            line-height: 58px;
            background: none;
            border:1px solid #e1e1e1;
          }
          &.codebox input{
            padding-right: 100px;
          }
        }
      }
    }

  }


  .footer{
      width: 1400px;
      margin: 20px auto 0;
      text-align: center;
  }
</style>
