Page({
  data: {
    members: [], // 项目成员列表
    expenseTypes: [
      { id: 1, name: '餐饮' },
      { id: 2, name: '交通' },
      { id: 3, name: '住宿' },
      { id: 4, name: '购物' },
      { id: 5, name: '娱乐' },
      { id: 6, name: '其他' }
    ],
    selectedPayer: null,
    selectedType: null,
    date: '',
    projectId: '' // 当前项目ID
  },

  onLoad(options) {
    const { projectId } = options;
    this.setData({ projectId });
    this.fetchMembers();
  },

  // 获取项目成员
  async fetchMembers() {
    try {
      // 这里调用获取成员接口
      const members = await wx.cloud.callFunction({
        name: 'getProjectMembers',
        data: { projectId: this.data.projectId }
      });
      
      // 为每个成员添加selected属性用于多选
      const formattedMembers = members.data.map(member => ({
        ...member,
        selected: false
      }));
      
      this.setData({ members: formattedMembers });
    } catch (error) {
      wx.showToast({
        title: '获取成员失败',
        icon: 'none'
      });
    }
  },

  // 选择支付人
  handlePayerChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedPayer: this.data.members[index]
    });
  },

  // 选择/取消选择使用人
  toggleUser(e) {
    const { id } = e.currentTarget.dataset;
    const { members } = this.data;
    const newMembers = members.map(member => {
      if (member.id === id) {
        return { ...member, selected: !member.selected };
      }
      return member;
    });
    this.setData({ members: newMembers });
  },

  // 选择费用类型
  handleTypeChange(e) {
    const index = e.detail.value;
    this.setData({
      selectedType: this.data.expenseTypes[index]
    });
  },

  // 选择日期
  handleDateChange(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 取消
  handleCancel() {
    wx.navigateBack();
  },

  // 提交表单
  async handleSubmit(e) {
    const { amount, remark } = e.detail.value;
    const { selectedPayer, selectedType, date, members, projectId } = this.data;

    // 表单验证
    if (!amount || !selectedPayer || !selectedType || !date) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    const users = members.filter(member => member.selected);
    if (users.length === 0) {
      wx.showToast({
        title: '请选择使用人',
        icon: 'none'
      });
      return;
    }

    try {
      // 这里调用添加费用接口
      await wx.cloud.callFunction({
        name: 'addExpense',
        data: {
          projectId,
          amount: Number(amount),
          payerId: selectedPayer.id,
          userIds: users.map(user => user.id),
          typeId: selectedType.id,
          date,
          remark
        }
      });

      wx.showToast({
        title: '添加成功',
        icon: 'success'
      });

      // 返回上一页
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    } catch (error) {
      wx.showToast({
        title: '添加失败',
        icon: 'none'
      });
    }
  }
}); 