import taskMainBlock from './task-main-block.vue'
import taskSourceMainBlock from './task-source-main-block.vue'
import taskMoreBlock from './task-more-block.vue'
import taskSourceMoreBlock from './task-source-more-block.vue'
import TaskBar from './task-bar.vue'
import TaskToolbar from './task-toolbar.vue'
import TaskSourceToolbar from './task-source-toolbar.vue'
import TaskTitle from './task-title.vue'
import TaskRate from './task-rate.vue'
import TaskDesc from './task-desc.vue'
import TaskComment from './task-comment.vue'
import TaskChild from './task-child.vue'
import TaskAttachments from './task-attachments.vue'
import taskCenterName from './task-center-name.vue'
import TaskOpen from './task-open.vue'
import taskStart from './task-start.vue'
import taskGroup from './task-group.vue'
import taskNotice from './task-notice.vue'
import taskPeriod from './task-period.vue'
import taskMenus from './task-menus.vue'

const components = [
  taskMainBlock,
  taskSourceMainBlock,
  taskMoreBlock,
  taskSourceMoreBlock,
  TaskBar,
  TaskToolbar,
  TaskSourceToolbar,
  TaskTitle,
  TaskRate,
  TaskDesc,
  TaskComment,
  TaskChild,
  TaskAttachments,
  taskCenterName,
  TaskOpen,
  taskStart,
  taskGroup,
  taskNotice,
  taskPeriod,
  taskMenus,
];
const install = function(Vue) {
  if (install.installed) return;
  components.length && components.map(component => {
    Vue.component(component.name, component);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
};

export default {
  version: '2.0.0',
  install,
  taskMainBlock,
  taskSourceMainBlock,
  taskMoreBlock,
  taskSourceMoreBlock,
  TaskBar,
  TaskToolbar,
  TaskSourceToolbar,
  TaskTitle,
  TaskRate,
  TaskDesc,
  TaskComment,
  TaskChild,
  TaskAttachments,
  taskCenterName,
  TaskOpen,
  taskStart,
  taskGroup,
  taskNotice,
  taskPeriod,
  taskMenus,
}
