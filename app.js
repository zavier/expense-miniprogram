// app.js
App({
  globalData: {
    baseUrl: 'https://api.zhengw-tech.com'
  },
  request(options) {
    const token = wx.getStorageSync('jwtToken')
    
    return new Promise((resolve, reject) => {
      wx.request({
        ...options,
        url: `${this.globalData.baseUrl}${options.url}`,
        header: {
          ...options.header,
          'Cookie': token ? `jwtToken=${token}` : ''
        },
        success: (res) => {
          // 统一处理未授权的情况
          if (res.statusCode === 401 || res.data.status === 401) {
            wx.removeStorageSync('jwtToken')
            wx.redirectTo({
              url: '/pages/login/login'
            })
            reject(new Error('未授权'))
            return
          }
          resolve(res)
        },
        fail: reject
      })
    })
  },
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 检查登录状态
    const token = wx.getStorageSync('jwtToken');
    if (!token) {
      wx.reLaunch({
        url: '/pages/login/login'
      });
    }
  }
})
