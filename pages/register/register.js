const app = getApp()

Page({
  data: {
    nickname: '',
    email: '',
    password: '',
    confirmPassword: '',
    submitLoading: false
  },

  // 处理昵称输入
  handleNicknameInput(e) {
    this.setData({
      nickname: e.detail.value
    })
  },

  // 处理邮箱输入
  handleEmailInput(e) {
    this.setData({
      email: e.detail.value
    })
  },

  // 处理密码输入
  handlePasswordInput(e) {
    this.setData({
      password: e.detail.value
    })
  },

  // 处理确认密码输入
  handleConfirmPasswordInput(e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  // 验证邮箱格式
  validateEmail(email) {
    const reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    return reg.test(email)
  },

  // 提交注册
  async handleSubmit() {
    const { nickname, email, password, confirmPassword } = this.data

    // 表单验证
    if (!nickname.trim()) {
      wx.showToast({
        title: '请输入昵称',
        icon: 'none'
      })
      return
    }

    if (!email.trim()) {
      wx.showToast({
        title: '��输入邮箱',
        icon: 'none'
      })
      return
    }

    if (!this.validateEmail(email)) {
      wx.showToast({
        title: '邮箱格式不正确',
        icon: 'none'
      })
      return
    }

    if (!password) {
      wx.showToast({
        title: '请输入密码',
        icon: 'none'
      })
      return
    }

    if (password.length < 6) {
      wx.showToast({
        title: '密码至少6位',
        icon: 'none'
      })
      return
    }

    if (password !== confirmPassword) {
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
      return
    }

    this.setData({ submitLoading: true })

    try {
      const res = await app.request({
        url: '/expense/user/add',
        method: 'POST',
        data: {
          username: nickname.trim(),
          email: email.trim(),
          password
        }
      })

      if (res.data.status === 0) {
        wx.showToast({
          title: '注册成功',
          icon: 'success'
        })

        // 延迟返回登录页
        setTimeout(() => {
          wx.navigateBack()
        }, 1500)
      } else {
        wx.showToast({
          title: res.data.msg || '注册失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('注册错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ submitLoading: false })
    }
  },

  handleCancel() {
    wx.navigateBack({
      delta: 1
    })
  }
}) 