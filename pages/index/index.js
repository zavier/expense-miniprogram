// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {},
  // 事件处理函数
  bindViewTap() {
  },
  onLoad() {
  },
  listProject() {
    wx.request({
      url: 'http://localhost:8080/wx/expense/project/list?page=1&size=10',
      method: 'GET', // 或者 'POST'
      success: function (res) {
        // 请求成功，处理返回的数据
        console.log(res.data);
        // 在这里更新页面数据，比如
        this.setData({
          projectList: res.data
        });
      },
      fail: function (error) {
        // 请求失败的处理
        console.error('请求失败', error);
      }
    });
  },
  getUserProfile(e) {
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认，开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '展示用户信息', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  getUserInfo(e) {
    // 不推荐使用getUserInfo获取用户信息，预计自2021年4月13日起，getUserInfo将不再弹出弹窗，并直接返回匿名的用户个人信息
    console.log(e)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
