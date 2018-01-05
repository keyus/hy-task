--任务详情弹窗

默认：是一个promise  回调

1.打开弹窗
2.根据任务ID，初始化任务详情数据，并通过store.commit('updateTask',data) 全量更新到vuex状态管理中
3.[
  权限获取,
  角色获取,
  更新模型,
  完成情况,
]  由store.getters  通过store.state.task 去维护.

4.菜单交互

a. task-menus.vue组件内的menus状态 同步到 store.taskMenus
b. store getter中的taskModuleVisible  会实时计算出  由菜单按钮控制的组件的切换显示状态


任务详情弹窗组件内部只维护详情state.task模型，且task的变化，会实时映射反应到getter中


