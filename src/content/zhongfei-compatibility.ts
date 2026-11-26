import type { CompanyPage } from '../content'

export const zhongfeiCompatibility: CompanyPage & { slug: string } = {
  slug: 'android-compatibility',
  title: 'Android 多机型适配',
  summary: '从界面、飞巡设备接入到巡检资料上传的常见适配问题',
  intro: '我负责飞巡 App 在不同 Android 机型上的兼容适配。下面以巡检业务为背景，整理五类常见问题的排查、处理和回归方法。',
  sections: [
    {
      title: '屏幕、字体与系统栏',
      text: '小屏手机切到横屏时，底部操作按钮可能被导航栏挡住。用户调大系统字体后，任务列表也可能出现文字截断或控件重叠。',
      points: [
        { title: '怎么定位', text: '对照窗口可用尺寸、字体缩放、屏幕方向和系统栏位置，检查布局是否用了固定高度，或把整块屏幕当成了可用区域。' },
        { title: '怎么解决', text: '用响应式约束布局，文字使用 sp，容器按内容伸缩。用 WindowInsets 给关键操作区避让状态栏、导航栏和刘海区域。' },
        { title: '怎么验证', text: '在窄屏和大字体下分别检查横竖屏，再切换手势导航和三键导航，确认巡检操作完整可见、可点击。' },
      ],
      link: { label: 'Android 官方文档 · 系统栏与边到边布局', url: 'https://developer.android.google.cn/develop/ui/views/layout/edge-to-edge?hl=zh-cn' },
    },
    {
      title: '照片、视频与文件访问权限',
      text: '巡检人员选好了照片或视频，App 却打不开文件；也可能在新版 Android 上只能访问用户选中的部分媒体。',
      points: [
        { title: '怎么定位', text: '记录 Android 版本和目标 SDK，区分问题发生在选择媒体、读取 URI，还是重启后恢复待上传任务。' },
        { title: '怎么解决', text: '用户主动选照片或视频时优先使用系统照片选择器，按返回的 content:// URI 读取。需要延后上传时，按来源保留可持久化的授权，或先把待上传资料复制到应用私有目录。' },
        { title: '怎么验证', text: '覆盖取消选择、仅选择部分照片，以及重启 App 后继续上传，确认页面能恢复任务或引导重新选择。' },
      ],
      link: { label: 'Android 官方文档 · 照片选择器', url: 'https://developer.android.google.cn/training/data-storage/shared/photo-picker?hl=zh-cn' },
    },
    {
      title: '遥控器接入与 DJI SDK 状态',
      text: '同一套遥控器换一台手机后，可能出现系统已识别外设，App 却一直停在连接中；重新插拔后，界面状态也可能没有及时更新。',
      points: [
        { title: '怎么定位', text: '用同一台遥控器和同一根数据线换手机对照，按顺序核对系统是否识别、是否完成相关授权、MSDK 的连接回调是否到达，以及当前设备是否支持所需能力。' },
        { title: '怎么解决', text: '分别处理未识别、待授权、连接中、已连接和断开。按 SDK 回调更新界面，断开时撤销已连接状态。对能力差异按设备实际支持情况展示功能入口。' },
        { title: '怎么验证', text: '用现场常用手机测首次接入、拒绝授权后再操作、进出后台和拔插重连，确认提示与设备状态一致。' },
      ],
    },
    {
      title: '图传预览与红外测温坐标',
      text: '横竖屏切换或进入后台再回来时，预览可能短暂黑屏。不同屏幕比例采用裁剪或留边显示时，画面上划出的线也可能偏离实际取温位置。',
      points: [
        { title: '怎么定位', text: '先看图传是否仍有帧、预览 Surface 是否重建。遇到测温点偏移，再对照原始图像尺寸、旋转方向和预览的缩放、裁剪范围。' },
        { title: '怎么解决', text: '按预览 Surface 的生命周期绑定或解绑图传。测温控件使用同一套坐标变换绘制标记，并把触点从屏幕坐标反算到原始热图坐标，处理画面外的点击。' },
        { title: '怎么验证', text: '用带已知位置标记的画面，在不同屏幕比例下测试旋转和后台恢复，核对中心、边缘的取温点与绘制位置。' },
      ],
    },
    {
      title: '后台限制与巡检资料上传',
      text: '遇到弱网、锁屏或切到后台，上传可能中断。用户再次提交时，还可能出现重复上传或进度停在旧状态。',
      points: [
        { title: '怎么定位', text: '区分网络断开、待上传文件无法读取，以及进程被系统回收。通过任务状态判断资料有没有被服务端确认。' },
        { title: '怎么解决', text: '先保存待上传任务及文件位置。可延后的上传用 WorkManager 配置网络条件和重试策略。服务端支持时，为同一份资料使用稳定的提交标识，避免重试产生重复记录。' },
        { title: '怎么验证', text: '模拟断网和恢复、锁屏和解锁、系统回收进程后重新打开，核对上传状态、失败提示和服务端结果。' },
      ],
      link: { label: 'Android 官方文档 · 持久后台任务', url: 'https://developer.android.google.cn/develop/background-work/background-tasks/persistent?hl=zh-cn' },
    },
  ],
  flow: { title: '兼容问题排查流程', items: ['记录机型、系统和 SDK 版本', '用对照设备复现', '定位问题所在环节', '用真机验证修复'] },
}
