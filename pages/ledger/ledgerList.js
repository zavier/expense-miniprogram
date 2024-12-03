Page({
    data: {
      projects: [
        {
          id: 1,
          name: "项目一",
          description: "这是项目一的描述信息",
          image: "/images/project1.png",
          date: "2024-03-20",
          status: "ongoing",
          statusText: "进行中"
        },
        {
          id: 2,
          name: "项目二",
          description: "这是项目二的描述信息",
          image: "/images/project2.png",
          date: "2024-03-19",
          status: "completed",
          statusText: "已完成"
        }
      ]
    },
  
    onLoad() {
      // 页面加载时可以从服务器获取项目列表
      this.getProjectList()
    },
  
    getProjectList() {
      // TODO: 调用API获取项目列表
    },
  
    onSearch(e) {
      const keyword = e.detail.value
      // TODO: 实现搜索功能
    },
  
    goToDetail(e) {
      const projectId = e.currentTarget.dataset.id
      wx:navigateTo({
        url: `/pages/projectDetail/projectDetail?id=${projectId}`
      })
    },
  
    toggleMenu(e) {
      const id = e.currentTarget.dataset.id;
      const projects = this.data.projects.map(project => {
        if (project.id === id) {
          project.showMenu = !project.showMenu;
        }
        return project;
      });
      this.setData({ projects });
    }
  })