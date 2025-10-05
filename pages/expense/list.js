// pages/expense/list.js
const app = getApp()

Page({
  data: {
    projectId: null,
    projectName: null,
    expenses: [],
    loading: false,
    isShared: false,
    shareToken: null,
    memberStats: []  // 改为空数组，等待接口数据
  },

  onShow() {
    this.fetchExpenses()
    this.fetchMemberStats()
  },

  onLoad(options) {
    if (options.projectId) {
      this.setData({ 
        projectId: options.projectId,
        projectName: options.name,
        isShared: !!options.isShared,
        shareToken: options.shareToken
      })
      this.fetchExpenses()
      this.fetchMemberStats()
      
      // 如果是通过分享进入，可以显示提示或进行其他处理
      if (options.isShared) {
        wx.showToast({
          title: '欢迎查看共享账单',
          icon: 'none'
        })
      }
    }
  },

  // 获取费用列表
  async fetchExpenses() {
    if (this.data.loading) return

    try {
      this.setData({ loading: true })

      let res;
      if (this.data.isShared) {
        res = await app.request({
          url: '/expense/wx/project/listRecord/share',
          method: 'GET',
          data: {
            shareToken: this.data.shareToken
          }
        })
      } else {
        res = await app.request({
          url: '/expense/project/listRecord',
          method: 'GET',
          data: {
            projectId: this.data.projectId
          }
        })
      }

      if (res.data.status === 0) {
        // 格式化数据
        const expenses = res.data.data.rows.map(item => ({
          ...item,
          // 将时间戳转换为日期字符串
          dateStr: this.formatDate(item.date)
        }))

        this.setData({ expenses })
      } else {
        wx.showToast({
          title: '获取费用列表失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取费用列表错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 格式化日期
  formatDate(timestamp) {
    if (!timestamp) return ''
    const date = new Date(timestamp * 1000)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
  },

  // 新增：获取成员账单统计
  async fetchMemberStats() {
    try {
      let res
      if (this.data.isShared) {
        res = await app.request({
          url: '/expense/wx/project/sharing/share',
          method: 'GET',
          data: {
            shareToken: this.data.shareToken
          }
        })
      } else {
        res = await app.request({
          url: '/expense/project/sharing',
          method: 'GET',
          data: {
            projectId: this.data.projectId
          }
        })
      }

      if (res.data.status === 0 && res.data.data.rows) {
        // 处理数据，计算差额
        const memberStats = res.data.data.rows.map(item => ({
          member: item.member,
          totalAmount: item.totalAmount.toFixed(2),
          shouldPay: item.consumeAmount.toFixed(2),
          actualPay: item.paidAmount.toFixed(2),
          // 将 balance 也格式化为保留两位小数的数字
          balance: Number((item.paidAmount - item.consumeAmount).toFixed(2))
        }))

        this.setData({ memberStats })
      } else {
        wx.showToast({
          title: '获取成员统计失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取成员统计错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  },

  // 下拉刷新同时刷新两个数据
  onPullDownRefresh() {
    Promise.all([
      this.fetchExpenses(),
      this.fetchMemberStats()
    ]).then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onAddExpense() {
    wx.navigateTo({
      url: '/pages/expense/add?projectId=' + this.data.projectId
    })
  },

  // 编辑费用
  onEditExpense(e) {
    const recordId = e.currentTarget.dataset.recordId;
    wx.navigateTo({
      url: '/pages/expense/add?projectId=' + this.data.projectId + '&recordId=' + recordId
    })
  },

  // 添加页面分享配置
  async onShareAppMessage() {
    const projectName = this.data.projectName || '费用明细'
    
    try {
      const res = await app.request({
        url: '/expense/wx/project/shareToken',
        method: 'GET',
        data: {
          projectId: this.data.projectId
        }
      })

      if (res.data.status === 0 && res.data.data) {
        return {
          title: `${projectName} - 快来查看我们的账单吧`,
          path: `/pages/expense/list?projectId=${this.data.projectId}&shareToken=${res.data.data}&isShared=true`,
          imageUrl: '/images/share-cover.png'
        }
      }

      wx.showToast({
        title: '生成分享链接失败',
        icon: 'none'
      })
      return {
        title: projectName,
        path: '/pages/index/index'
      }
      
    } catch (error) {
      console.error('生成分享链接错误:', error)
      wx.showToast({
        title: '生成分享链接失败',
        icon: 'none'
      })
      return {
        title: projectName,
        path: '/pages/index/index'
      }
    }
  }
})