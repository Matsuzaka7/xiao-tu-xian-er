<template>
  <Form class="xtx-form" ref="formCom" :validation-schema="schema" v-slot="{errors}">
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field name="account" v-model="form.account" class="input" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if="errors.account">{{errors.account}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field name="mobile" v-model="form.mobile" class="input" type="text" placeholder="请输入手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field name="code" v-model="form.code" class="input" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">{{timer === 0 ? '发送验证码' : `${timer}后发送`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field name="password" v-model="form.password" class="input" type="password" placeholder="请输入密码" />
      </div>
      <div class="error" v-if="errors.password">{{errors.password}}</div>
    </div>
    <div class="xtx-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field name="rePassword" v-model="form.rePassword" class="input" type="password" placeholder="请确认密码" />
      </div>
      <div class="error" v-if="errors.rePassword">{{errors.rePassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { ref, reactive, onUnmounted } from 'vue';
import { userQQPatchCode } from '@/api/user'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import schema from '@/utils/vee-validate-schema'
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { userQQPatchLogin } from '@/api/user'

export default {
  name: 'CallbackPatch',
  components: { Form, Field },
  props: {
    unionId: String,
    default: ''
  },
  setup (props) {
    // 1. 表单校验 增加两个校验（用户名会否存在，再次输入密码是否一致）

    // 表单数据对象
    const form = reactive({
      account: null,
      mobile: null,
      code: null,
      password: null,
      rePassword: null
    })

    // 表单校验规则
    const mySchema = {
      account: schema.accountApi,
      mobile: schema.mobile,
      code: schema.code,
      password: schema.password,
      rePassword: schema.rePassword
    }

    // 2. 发送验证码
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
    const send = () => {
      // 校验手机号，合法为true
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (timer.value === 0) {
          userQQPatchCode(form.mobile).then(res => {
            console.log(res);
            Message({ type: 'success', text: '验证码已发送 验证码为：123456' })
            timer.value = 60
            // 开启定时器
            resume()
          }).catch(err => {
            formCom.value.setFieldError('mobile', err.response.data.message)
          })
        }
      } else {
        // 失败，使用vee的错误函数提供的文字，setFieldError(字段， 错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }

    // 3. 完善信息
    const store = useStore()
    const router = useRouter()
    const submit = async () => {
      const valid = formCom.value.validate() 
      if (valid) {
        // input检验成功，发请求
        userQQPatchLogin({ 
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
            Message({ type: 'success', text: 'QQ完善信息成功' })
          })
        }).catch(err => {
          Message({ type: 'error', text: err.response?.data?.message || '失败' })
        })
      }
    }

    return { form, schema: mySchema, formCom, send, timer, submit }
  }
}
</script>

<style scoped lang='less'>
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
