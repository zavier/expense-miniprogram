const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    errors: {}
  },

  // 用户名输入
  onUsernameInput(e) {
    this.setData({
      username: e.detail.value,
      'errors.username': ''
    })
  },

  // 密码输入
  onPasswordInput(e) {
    this.setData({
      password: e.detail.value,
      'errors.password': ''
    })
  },

  // 表单验证
  validateForm() {
    let isValid = true
    const errors = {}

    if (!this.data.username.trim()) {
      errors.username = '请输入用户名'
      isValid = false
    }

    if (!this.data.password.trim()) {
      errors.password = '请输入密码'
      isValid = false
    }

    this.setData({ errors })
    return isValid
  },

  // 登录处理
  async handleLogin() {
    if (!this.validateForm()) return

    try {
      const res = await app.request({
        url: '/expense/user/login',
        method: 'POST',
        data: {
          username: this.data.username,
          password: this.data.password
        }
      })

      console.log('登录响应:', res.data)

      if (res.data.status === 0) {
        // 登录成功，保存token
        wx.setStorageSync('jwtToken', res.data.data)
        
        // 跳转到账本列表页
        wx.reLaunch({
          url: '/pages/ledger/list'
        })
      } else {
        // 显示错误信息
        wx.showToast({
          title: res.data.msg || '登录失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('登录错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  },

  // 微信登录
  handleWechatLogin() {
    wx.showToast({
      title: '微信登录功能开发中',
      icon: 'none'
    })
  },

  // 跳转到注册页
  goToRegister() {
    wx.showToast({
      title: '注册功能开发中',
      icon: 'none'
    })
  }
}) 