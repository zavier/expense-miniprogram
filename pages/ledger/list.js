const app = getApp()

Page({
  data: {
    projects: [],
    loading: false,
    searchText: '',
    pageNum: 1,
    pageSize: 2000,
    hasMore: true,
    total: 0
  },

  onShow() {
    this.fetchProjects()
  },

  onLoad() {
    // 检查是否有token，没有则跳转到登录页
    const token = wx.getStorageSync('jwtToken')
    if (!token) {
      wx.redirectTo({
        url: '/pages/login/login'
      })
      return
    }
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.setData({
      projects: [],
      pageNum: 1,
      hasMore: true
    }, () => {
      this.fetchProjects().then(() => {
        wx.stopPullDownRefresh()
      })
    })
  },

  // 上拉加载更多
  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.setData({
        pageNum: this.data.pageNum + 1
      }, () => {
        this.fetchProjects()
      })
    }
  },

  // 搜索框输入处理
  onSearchInput(e) {
    this.setData({ 
      searchText: e.detail.value,
      pageNum: 1,  // 重置页码
      projects: [],  // 清空列表
      hasMore: true // 重置加载状态
    }, () => {
      // 输入后立即搜索
      this.fetchProjects()
    })
  },

  // 获取项目列表
  async fetchProjects() {
    // if (this.data.loading || !this.data.hasMore) return
    try {
      this.setData({ loading: true })
      
      const res = await app.request({
        url: '/expense/project/list',
        method: 'GET',
        data: {
          page: this.data.pageNum,
          size: this.data.pageSize,
          name: this.data.searchText
        }
      })

      if (res.data.status === 0) {
        const { items, total } = res.data.data
        
        // 格式化项目数据
        const formattedItems = items.map(item => ({
          id: item.projectId,
          name: item.projectName,
          description: item.projectDesc,
          totalMember: item.totalMember,
          totalExpense: item.totalExpense,
        }))

        this.setData({
          // TODO 合并project
          projects: [...formattedItems],
          total,
          hasMore: this.data.projects.length + formattedItems.length < total
        })
      } else {
        wx.showToast({
          title: '获取项目列表失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取项目列表错误:', error)
      // 如果是网络错误，可能是token过期
      if (error.errMsg && error.errMsg.includes('request:fail')) {
        wx.removeStorageSync('jwtToken')
        wx.redirectTo({
          url: '/pages/login/login'
        })
        return
      }
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  // 添加新项目
  onAddNew() {
    wx.navigateTo({
      url: '/pages/ledger/create'
    })
  },

  // 点击项目卡片
  onCardTap(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/expense/list?projectId=${id}&name=${name}`
    })
  },

  // 添加费用
  onAddExpense(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/expense/add?projectId=${id}`
    })
  },

  // 查看费用明细
  viewExpenseDetails(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/expense/list?projectId=${id}`
    })
  },

  // 查看统计信息
  viewStatistics(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/statistics/index?projectId=${id}`
    })
  },

  // 添加成员
  addMembers(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/member/index?projectId=${id}&mode=add`
    })
  },

  // 查看成员信息
  viewMembers(e) {
    const { id } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/member/index?projectId=${id}&mode=view`
    })
  },

  // 删除项目
  deleteProject(e) {
    const { id } = e.currentTarget.dataset
    wx.showModal({
      title: '确认删除',
      content: '确定要删除这个项目吗？',
      success: (res) => {
        if (res.confirm) {
          // TODO: 实现删除项目功能
        }
      }
    })
  }
})