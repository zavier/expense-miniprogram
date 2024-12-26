const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    errors: {},
    loading: false
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

  // 处理微信登录
  async handleWechatLogin() {
    if (this.data.loading) return
    
    try {
      this.setData({ loading: true })
      
      // 获取微信登录code
      const loginRes = await wx.login()
      
      if (!loginRes.code) {
        throw new Error('获取微信登录凭证失败')
      }

      // 发送code到后端
      const res = await app.request({
        url: '/expense/wx/user/login',
        method: 'GET',
        data: {
          code: loginRes.code
        }
      })

      if (res.data.status === 0) {
        // 保存登录信息
        wx.setStorageSync('jwtToken', res.data.data)

        // 登录成功后跳转到首页
        wx.reLaunch({
          url: '/pages/ledger/list'
        })
      } else {
        wx.showToast({
          title: res.data.msg || '登录失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('微信登录错误:', error)
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 跳转到注册页
  goToRegister() {
    wx.navigateTo({
      url: '/pages/register/register'
    })
  }
}) 