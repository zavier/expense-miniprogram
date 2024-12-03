Page({
  data: {
    phone: '',
    code: '',
    counting: false,
    countDown: 60
  },

  // 手机号输入
  onPhoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },

  // 验证码输入
  onCodeInput(e) {
    this.setData({
      code: e.detail.value
    });
  },

  // 发送验证码
  async sendCode() {
    const { phone } = this.data;
    
    // 验证手机号
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      });
      return;
    }

    try {
      // 调用发送验证码接口
      await wx.cloud.callFunction({
        name: 'sendSmsCode',
        data: { phone }
      });

      // 开始倒计时
      this.setData({ counting: true });
      this.startCountDown();

      wx.showToast({
        title: '验证码已发送',
        icon: 'success'
      });
    } catch (error) {
      wx.showToast({
        title: '发送失败，请重试',
        icon: 'none'
      });
    }
  },

  // 倒计时
  startCountDown() {
    let count = 60;
    const timer = setInterval(() => {
      count--;
      this.setData({
        countDown: count
      });
      
      if (count === 0) {
        clearInterval(timer);
        this.setData({
          counting: false,
          countDown: 60
        });
      }
    }, 1000);
  },

  // 手机号登录
  async handleLogin() {
    const { phone, code } = this.data;
    
    if (!phone || !code) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    try {
      // 调用登录接口
      const result = await wx.cloud.callFunction({
        name: 'login',
        data: { phone, code }
      });

      // 保存登录状态
      wx.setStorageSync('token', result.data.token);
      wx.setStorageSync('userInfo', result.data.userInfo);

      // 登录成功跳转
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } catch (error) {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }
  },

  // 微信登录
  async handleWechatLogin(e) {
    if (!e.detail.userInfo) {
      wx.showToast({
        title: '请授权后继续',
        icon: 'none'
      });
      return;
    }

    try {
      // 获取微信登录凭证
      const { code } = await wx.login();
      
      // 调用微信登录接口
      const result = await wx.cloud.callFunction({
        name: 'wechatLogin',
        data: {
          code,
          userInfo: e.detail.userInfo
        }
      });

      // 保存登录状态
      wx.setStorageSync('token', result.data.token);
      wx.setStorageSync('userInfo', result.data.userInfo);

      // 登录成功跳转
      wx.reLaunch({
        url: '/pages/index/index'
      });
    } catch (error) {
      wx.showToast({
        title: '登录失败，请重试',
        icon: 'none'
      });
    }
  }
}); 