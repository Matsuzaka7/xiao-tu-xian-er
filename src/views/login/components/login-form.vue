<template>
  <div class="account-box">
    <div class="toggle">
      <a href="javascript:;" class="mock" @click="mockData()">点我输入测试账号</a>
      <a @click="isMsgLogin=false" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="isMsgLogin=true" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- errors 这个对象是组件根据schema返回出来的对象数据 -->
    <Form ref="formCom" class="form" :validation-schema="schema" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- 这个name会去校验规则中寻找对应的 -->
            <Field :class="{error: errors.account}" name="account" v-model="form.account" type="text"
              placeholder="请输入用户名或手机号" />
          </div>
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error: errors.password}" name="password" v-model="form.password" type="password"
              placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error: errors.mobile}" name="mobile" v-model="form.mobile" type="text"
              placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error: errors.code}" name="code" v-model="form.code" type="text" placeholder="请输入验证码" />
            <span @click="send()" class="code">{{timer === 0 ? '发送验证码' : `${timer}后发送`}}</span>
          </div>
          <div class="error" v-if="errors.code"><i class="iconfont icon-warning" />{{errors.code}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- Field默认解析成input，如果需要解析成其他，使用as进行标记 -->
          <!-- 注意：如果改成了其他组件，其他组件需要支持v-model，否则触发不了事件 -->
          <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>

      </div>
      <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>

      <!-- <span id="qqLoginBtn"></span> -->
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>
<script>
import { reactive, ref, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
import { useIntervalFn } from '@vueuse/core'
// import QC from 'qc'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup() {
    // 点击输入预设账号
    const mockData = () => {
      if (isMsgLogin.value) {
        form.mobile = 13000000000
      } else {
        form.account = 'zhousg'
        form.password = '123456'
      }
    }
    // 是否短信登录
    const isMsgLogin = ref(false)
    // 表单信息对象
    const form = reactive({
      isAgree: true,
      account: null, // 用户名
      password: null, // 密码
      mobile: null, // 手机号
      code: null, // 验证码
    })

    // vee-vaildate 校验基本步骤
    // 1. 导入 Form, Field 组件，在组件上加上name属性，该属性用于指定对应的校验规则
    // 2. Field 需要对数据进行绑定，这里用了 form 对象
    // 3. 定义Field的name规则函数，Form的validation-schema接收校验规则
    const mySchema = {
      // 校验函数规则：返回true就是校验成功
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }

    // 监听isMsgLogin，重置表单数据
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果使用的是v-show，没有销毁field组件，则需要清空校验结果
      // formCom.value.resetForm()
    })

    // 在setup中获取应用实例
    // const { proxy } = getCurrentInstance()
    // proxy.$message({text: '你好'})

    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    // 点击登录时对表单进行校验
    const login = async () => {
      // Form组件提供了一个 validate 函数，作为整体表单校验，返回的是promise
      const valid = await formCom.value.validate()
      // 准备登录api调用，成功则存储用户信息并跳转到来源页，失败弹消息提示
      if (valid) {
        // 使用try是因为 await 返回错误时会直接报错，需要接受这个错误 提示用户
        try {
          // 手机号登录
          let data = null
          if (isMsgLogin.value) {
            // 发送验证码
            // 手机号登录
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
            // 账号密码登录  
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
          // 登录成功 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(res => {
            // 合并成功
            // 跳转到上一页，如果没有则调回首页
            router.push(route.query.redirectUrl || '/')
            Message({ type: 'success', text: '登陆成功' })
          })
        } catch (e) {
          if (e?.response?.data) {
            Message({ type: 'error', text: e.response.data.message || '登录失败'})
          }
        }
      } 
    }

    // vueuse中定时器的方法 pause暂停, resume开启
    // useIntervalFn(回调函数, 执行间隔, 是否立即执行)
    const timer = ref(1)
    const { pause, resume } = useIntervalFn(() => {
      timer.value--
      if (timer.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 发送验证码
    const send = async () => {
      // 校验手机号，合法为true
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (timer.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '验证码已发送 验证码为：123456' })
          timer.value = 60
          // 开启定时器
          resume()
        }
      } else {
        // 失败，使用vee的错误函数提供的文字，setFieldError(字段， 错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 初始化qq登录按钮
    // 1. 准备一个span（有id）
    // 2. QC.login({ btnId: 'span的id'})
    // onUnmounted(() => {
    //   QC.Login({ btnId: 'qqLoginBtn'})
    // })

    return { mockData, isMsgLogin, form, schema: mySchema, formCom, login, send, timer }
  }
}
</script>
<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    display: flex;
    justify-content: space-between;

    .mock {
      color: @xtxColor;

      &:hover {
        text-decoration: underline;
      }
    }

    a {
      color: @xtxColor;

      i {
        font-size: 14px;
      }
    }
  }

  .form {
    padding: 0 40px;

    &-item {
      margin-bottom: 28px;

      .input {
        position: relative;
        height: 36px;

        >i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }

        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;

          &.error {
            border-color: @priceColor;
          }

          &.active,
          &:focus {
            border-color: @xtxColor;
          }
        }

        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }

      >.error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;

        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }

    .agree {
      a {
        color: #069;
      }
    }

    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;

      &.disabled {
        background: #cfcdcd;
      }
    }
  }

  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>