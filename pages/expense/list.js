// pages/expense/list.js
const app = getApp()

Page({
  data: {
    projectId: null,
    expenses: [],
    loading: false,
    memberStats: [
      {
        member: '张三',
        totalAmount: '1200.00',
        shouldPay: '400.00',
        actualPay: '600.00',
        balance: 200.00  // 正数表示应收，负数表示应付
      },
      {
        member: '李四',
        totalAmount: '900.00',
        shouldPay: '400.00',
        actualPay: '300.00',
        balance: -100.00
      },
      {
        member: '王五',
        totalAmount: '600.00',
        shouldPay: '400.00',
        actualPay: '300.00',
        balance: -100.00
      }
    ]
  },

  onLoad(options) {
    if (options.projectId) {
      this.setData({ projectId: options.projectId })
      this.fetchExpenses()
    }
  },

  // 获取费用列表
  async fetchExpenses() {
    if (this.data.loading) return

    try {
      this.setData({ loading: true })

      const res = await app.request({
        url: '/expense/project/listRecord',
        method: 'GET',
        data: {
          projectId: this.data.projectId
        }
      })

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

  // 下拉刷新
  onPullDownRefresh() {
    this.fetchExpenses().then(() => {
      wx.stopPullDownRefresh()
    })
  },

  onAddExpense() {
    wx.navigateTo({
      url: '/pages/expense/add?projectId=' + this.data.projectId
    })
  }
})