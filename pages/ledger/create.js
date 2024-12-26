const app = getApp()

Page({
  data: {
    projectName: '',
    projectDesc: '',
    newMember: '',
    members: []
  },

  // 处理项目名称输入
  onProjectNameInput(e) {
    this.setData({
      projectName: e.detail.value
    })
  },

  // 处理项目描述输入
  onProjectDescInput(e) {
    this.setData({
      projectDesc: e.detail.value
    })
  },

  // 处理成员输入
  onMemberInput(e) {
    this.setData({
      newMember: e.detail.value
    })
  },

  // 添加成员
  addMember() {
    if (!this.data.newMember.trim()) {
      wx.showToast({
        title: '请输入成员名称',
        icon: 'none'
      })
      return
    }

    this.setData({
      members: [...this.data.members, this.data.newMember.trim()],
      newMember: ''
    })
  },

  // 删除成员
  removeMember(e) {
    const index = e.currentTarget.dataset.index
    const members = [...this.data.members]
    members.splice(index, 1)
    this.setData({ members })
  },

  // 提交表单
  async submitForm() {
    if (!this.data.projectName.trim()) {
      wx.showToast({
        title: '请输入项目名称',
        icon: 'none'
      })
      return
    }

    if (this.data.members.length === 0) {
      wx.showToast({
        title: '请至少添加一个成员',
        icon: 'none'
      })
      return
    }

    try {
      const res = await app.request({
        url: '/expense/project/create',
        method: 'POST',
        data: {
          projectName: this.data.projectName,
          projectDesc: this.data.projectDesc,
          members: this.data.members
        }
      })

      if (res.data.status === 0) {
        wx.showToast({
          title: '创建成功',
          icon: 'success'
        })

        wx.navigateBack({
          delta: 1
        })
      } else {
        wx.showToast({
          title: res.data.message || '创建失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('创建账本错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
    }
  }
}) 