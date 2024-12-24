const app = getApp()

Page({
  data: {
    projectId: null,
    expenseTypes: ['餐饮', '交通', '住宿', '购物', '娱乐', '其他'],
    selectedPayer: null,
    consumers:[],
    expenseType: '',
    customType: '',
    showCustomType: false,
    date: '',
    amount: '',
    amountFocus: false,
    remark: '',
  },

  onLoad(options) {
    if (options.projectId) {
      this.setData({ projectId: options.projectId })
      this.fetchMembers()
    }
  },

  // 获取项目成员
  async fetchMembers() {
    try {
      const res = await app.request({
        url: '/expense/project/listMember',
        method: 'GET',
        data: {
          projectId: this.data.projectId
        }
      })

      if (res.data.status === 0) {
        // 将返回的数据转换为组件需要的格式
        const members = res.data.data.map(item => ({
          id: item.member,
          name: item.member,
          selected: false
        }))
        
        this.setData({ members })
      } else {
        wx.showToast({
          title: '获取成员列表失败',
          icon: 'none'
        })
      }
    } catch (error) {
      console.error('获取成员列表错误:', error)
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      })
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
    const selectedType = this.data.expenseTypes[index];
    
    // 如果选择"其他"，显示自定义输入框
    if (selectedType === '其他') {
      this.setData({
        showCustomType: true,
        expenseType: ''
      });
    } else {
      this.setData({
        expenseType: selectedType,
        showCustomType: false,
        customType: ''
      });
    }
  },

  // 新增：处理自定义类型输入
  handleCustomTypeInput(e) {
    this.setData({
      expenseType: e.detail.value,
      customType: e.detail.value
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

  // 处理金额输入
  handleAmountInput(e) {
    let value = e.detail.value;
    // 限制只能输入数字和小数点
    value = value.replace(/[^\d.]/g, '');
    // 限制只能有一个小数点
    if (value.split('.').length > 2) {
      value = value.slice(0, value.lastIndexOf('.'));
    }
    // 限制小数点后两位
    if (value.includes('.')) {
      const [integer, decimal] = value.split('.');
      if (decimal.length > 2) {
        value = `${integer}.${decimal.slice(0, 2)}`;
      }
    }
    
    this.setData({ amount: value });
    return value;
  },

  // 金额输入框获得焦点
  handleAmountFocus() {
    this.setData({ amountFocus: true });
  },

  // 金额输入框失去焦点
  handleAmountBlur() {
    this.setData({ amountFocus: false });
    // 格式化金额显示
    if (this.data.amount) {
      this.setData({
        amount: Number(this.data.amount).toFixed(2)
      });
    }
  },

  // 处理备注输入
  handleRemarkInput(e) {
    this.setData({
      remark: e.detail.value
    });
  },

  // 提交表单
  async handleSubmit(e) {
    const { 
      selectedPayer, 
      expenseType, 
      date, 
      members, 
      projectId,
      amount,
      remark
    } = this.data;

    // 表单验证
    if (!amount || !selectedPayer || !date) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none'
      });
      return;
    }

    if (!expenseType.trim()) {
      wx.showToast({
        title: '请选择或输入费用类型',
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
      const res = await app.request({
        url: '/expense/project/addRecord',
        method: 'POST',
        data: {
          projectId,
          amount: Number(amount),
          payMember: selectedPayer.name,
          consumerMembers: users.map(user => user.id),
          expenseType: expenseType.trim(),
          date: new Date(date).getTime() / 1000,
          remark: remark.trim()
        }
      });

      if (res.data.status === 0) {
        wx.showToast({
          title: '添加成功',
          icon: 'success'
        });

        // 返回上一页
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        wx.showToast({
          title: res.data.msg || '添加失败',
          icon: 'none'
        });
      }
    } catch (error) {
      console.error('添加费用错误:', error);
      wx.showToast({
        title: '网络错误，请重试',
        icon: 'none'
      });
    }
  },

  backToSelect() {
    this.setData({
      showCustomType: false,
      customType: '',
      expenseType: ''  // 清空已选择的类型
    });
  }
}); 