<template>
  <Form :validation-schema="mySchema" v-slot="{errors}" ref="formCom" autocomplete="off" class="xtx-form">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>Hi，{{nickname}} 欢迎来到小兔鲜，完成绑定后可以QQ账号一键登录哦~</p>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field :class="{err: errors.mobile}" name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field :class="{err: errors.code}" name="code" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span @click="send" class="code">{{timer === 0 ? '发送验证码' : `${timer}后发送`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a @click="submit" href="javascript:;" class="submit">立即绑定</a>
  </Form>
</template>

<script>
import QC from 'qc'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, reactive, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
import schema from '@/utils/vee-validate-schema'
import Message from '@/components/library/Message'
export default {
  name: 'CallbackBind',
  components: { Form, Field },
  props: {
    unionId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 1. 准备信息，openId(unionId), qq头像, qq昵称
    const nickname = ref('')
    const avatar = ref('')
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        nickname.value = res.data.nickname  
        avatar.value = res.data.figureurl_1
      })
    }
    // 2. 完成表单校验
    const form = reactive({
      mobile: null,
      code: null
    })
    const mySchema = {
      mobile: schema.mobile,
      code: schema.code
    }
    // 3. 发送验证码（校验，定义api，调用，完成倒计时）

    // vueuse中定时器的方法 pause暂停, resume开启
    // useIntervalFn(回调函数, 执行间隔, 是否立即执行)
    const formCom = ref(null)
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
          await userQQBindCode(form.mobile)
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

    // 4. 进行绑定，绑定成功就登录成功
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate() 
      if (valid) {
        // input检验成功，发请求
        userQQBindLogin({ 
          unionId: props.unionId,
          ...form
        }).then(data => {
           // 保存数据到vuex
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          store.dispatch('cart/mergeCart').then(res => {
            // 合并成功
            // 跳转到来源页或首页
            router.push(store.state.user.redirectUrl)
            // 成功提示
            Message({ type: 'success', text: 'QQ登录成功' })
          })
        }).catch(err => {
          Message({ type: 'error', text: '绑定失败' })
        })
      }
    }
    return { nickname, avatar, form, mySchema, send, timer, formCom, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
  .code {
    position: absolute;
    right: 0;
    top: 0;
    line-height: 50px;
    width: 80px;
    color: #999;
    &:hover {
      cursor: pointer;
    }
  }
</style>
