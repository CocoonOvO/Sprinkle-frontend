# Sprinkle Web - 前端项目规格文档

## 1. Concept & Vision

**Sprinkle** 是一款甜点系虚拟聊天软件，名称源自"撒粉"动作，寓意轻松愉悦的社交体验。界面设计追求温暖、柔和、可爱的视觉风格，让用户在交流时感受到舒适与放松。整体体验强调流畅的实时交互和优雅的视觉反馈。

## 2. Design Language

### 色彩系统
```
粉蓝马卡龙配色 - Candy Macaron Theme:

Primary:     #FF8FAB (泡泡糖粉 - 主按钮、强调)
Secondary:   #60A5FA (天空蓝 - 辅助强调)
Accent:      #F472B6 (玫红色 - 高亮、hover)
Accent2:     #3B82F6 (海洋蓝 - 链接、进度条)
Background:  #F0F9FF (霜白 - 主背景)
Surface:     #FFFFFF (纯白卡片)
Border:      #E0E7FF (薄雾蓝 - 柔和边框)
Text:        #475569 (石板灰 - 主文字)
Text-Muted:  #94A3B8 (烟灰色 - 次要文字)

状态色彩:
- Success:  #34D399 (薄荷绿)
- Warning:  #FBBF24 (琥珀黄)
- Error:    #F87171 (珊瑚红)

消息气泡:
- 自己:     #FF8FAB → #F472B6 渐变 (粉蓝渐变)
- 他人:     #FFFFFF (纯白)

色值表 (Tailwind CSS 扩展):
- pink-50~900: #FF8FAB 系粉色
- blue-50~900: #60A5FA 系蓝色
- slate-50~900: #475569 系蓝灰色
```

### 字体
- 主字体: `"Inter", "PingFang SC", "Microsoft YaHei", sans-serif`
- 代码字体: `"JetBrains Mono", "Fira Code", monospace`
- 字重: 400 (正文), 500 (中等), 600 (标题), 700 (强调)

### 空间系统
- 基础单位: 4px
- 间距: 4, 8, 12, 16, 24, 32, 48, 64px
- 圆角: 8px (小), 12px (中), 16px (大), 9999px (胶囊)
- 阴影: `0 2px 8px rgba(0,0,0,0.08)` (卡片), `0 4px 16px rgba(0,0,0,0.12)` (悬浮)

### 动效哲学
- 过渡时长: 150ms (快速), 200ms (标准), 300ms (强调)
- 缓动函数: `cubic-bezier(0.34, 1.56, 0.64, 1)` (弹性撒糖效果)
- 微交互: 按钮hover上浮(-translate-y-0.5), 点击缩放0.95
- 消息入场: translateY(-20px) scale(0.95) → 原位, 200ms弹性缓动
- 悬浮效果: hover时阴影加深 + 轻微上浮

### 视觉资源
- 图标库: Lucide React (线性风格, 统一美观)
- 图片策略: 头像默认生成渐变色块配首字母
- 空状态插图: CC0免费SVG插画 (lukaszadam, Storyset)
  - `public/illustrations/chat-amico.svg` - 聊天插画
  - `public/illustrations/questions-amico.svg` - 问答插画
  - `public/illustrations/waiting-donut.svg` - 等待插画
  - `public/illustrations/conversation.svg` - 对话插画

## 3. Layout & Structure

### 整体布局 (三栏式)
```
┌─────────────────────────────────────────────────────────┐
│                      Header (56px)                      │
├────────────┬───────────────────────┬────────────────────┤
│            │                       │                    │
│  Sidebar   │      Chat Area        │    Detail Panel    │
│  (240px)   │      (flex: 1)        │      (320px)       │
│            │                       │                    │
│ - 会话列表  │ - 消息列表             │ - 成员列表          │
│ - 搜索     │ - 消息输入             │ - 会话设置          │
│            │                       │                    │
└────────────┴───────────────────────┴────────────────────┘
```

### 响应式策略
- **Desktop (≥1024px)**: 完整三栏布局
- **Tablet (768-1023px)**: 侧边栏可折叠, 详情面板 overlay
- **Mobile (<768px)**: 单栏, 底部导航, 全屏会话视图

### 页面结构
1. **Auth Pages** (登录/注册): 居中卡片, 品牌logo, 背景装饰
2. **Main App**: 固定Header + 三栏内容区
3. **Chat Area**: 消息流 + 固定底部输入框

## 4. Features & Interactions

### 认证模块
- **注册**: 用户名(3-50字符) + 密码(6-100字符) + 显示名(可选)
- **登录**: 用户名 + 密码 → JWT Token
- **Token自动刷新**: 拦截器自动处理, 静默续期
- **Agent Keys**: Agent用户可创建/管理API Keys

### 会话模块
- **创建会话**: 选择类型(direct/group) → 添加成员 → 设置名称
- **会话列表**: 按最近更新时间排序, 显示未读数
- **会话设置**: 修改名称, 管理员可以添加/移除成员, 修改角色

### 消息模块
- **发送消息**: 文本/markdown, 支持@提及, 回复引用
- **消息状态**: 发送中 → 已发送 → 已读
- **编辑消息**: 仅发送者可编辑, 显示"已编辑"标签
- **删除消息**: 软删除, 显示"消息已删除"
- **实时更新**: SSE推送新消息, 平滑入场动画
- **流式消息**: AI Agent 响应支持 SSE 流式传输，逐块渲染，类似打字机效果
  - 支持取消正在传输的消息
  - 增量更新内容，自动滚动
  - 流式消息与普通消息统一渲染

### 文件模块
- **上传**: 拖拽/点击, 进度显示, 最大10个文件
- **预览**: 图片直接预览, 其他显示文件名和大小
- **下载**: 点击下载, 显示加载状态

### 用户模块
- **个人信息**: 显示名修改, 头像上传
- **头像**: 默认生成字母头像, 可上传自定义

## 5. Component Inventory

### Button
- **变体**: Primary, Secondary, Ghost, Danger
- **尺寸**: sm(32px), md(36px), lg(40px)
- **状态**: default, hover(scale 0.98), active(scale 0.95), disabled(opacity 0.5), loading(spinner)

### Input
- **状态**: default(灰色边框), focus(primary边框+shadow), error(红色边框+消息), disabled
- **特性**: 支持前缀/后缀图标, 密码显示切换

### Avatar
- **尺寸**: xs(24px), sm(32px), md(40px), lg(56px), xl(80px)
- **状态**: 加载中(骨架), 错误(字母头像), 离线(灰色遮罩)

### Message Bubble
- **自己**: 右对齐, primary背景, 白色文字, 右圆角
- **他人**: 左对齐, 灰色背景, 深色文字, 左圆角
- **元信息**: 时间戳, 发送状态图标, 编辑标签
- **流式消息**: AI响应专用，显示闪烁光标，内容逐步展开

### Streaming Message
- **样式**: 与普通消息气泡一致，右侧增加取消按钮
- **光标**: 消息尾部显示闪烁的草莓粉色竖线
- **动画**: 内容增量更新，自动滚动到底部
- **交互**: 可随时取消正在传输的消息

### Conversation Item
- **状态**: default, hover(背景变浅), active(primary左边框+浅紫背景)
- **信息**: 头像 + 名称 + 最后消息预览 + 时间 + 未读数

### Modal
- **动效**: 背景渐显(150ms), 内容从下滑入(200ms)
- **特性**: 遮罩可点击关闭, ESC关闭, 聚焦陷阱

### Toast
- **类型**: success(绿), error(红), warning(橙), info(蓝)
- **动效**: 从右侧滑入(200ms), 3秒后自动消失

## 6. Technical Approach

### 技术栈
- **框架**: React 19 + TypeScript
- **构建**: Vite 8
- **样式**: Tailwind CSS 4 + @tailwindcss/postcss
- **路由**: React Router 7
- **状态**: Zustand 5 (全局状态)
- **数据获取**: TanStack Query 5 (API缓存 + 实时更新)
- **图标**: Lucide React
- **日期**: date-fns
- **格式化**: clsx + tailwind-merge

### 项目结构
```
src/
├── api/              # API 请求函数 (待实现)
├── components/       # 公共组件
│   ├── ui/          # 基础UI组件
│   │   ├── Button, Input, Avatar, Badge, Modal, Toast, Switch
│   │   └── cn.ts
│   └── features/   # 业务组件
│       ├── Sidebar, ChatArea, MessageList
│       ├── MessageBubble, MessageInput, StreamingMessage
│       ├── ConversationItem, Header, DetailPanel
│       └── MemberList, UserInfo, GroupInfo, SettingsPanel
├── hooks/           # 自定义Hooks
│   └── useStreamMessage.ts  # 流式消息Hook
├── lib/             # 工具函数
│   └── sse.ts       # SSE管理器
├── mocks/          # Mock数据 (开发模式)
├── pages/          # 页面组件
├── stores/         # Zustand stores
└── types/          # TypeScript 类型
```

### API 层设计
- 基于 fetch 的请求封装, 自动附加 Authorization header
- 统一的错误处理 (401跳转登录, 4xx显示错误消息)
- SSE 事件源管理, 自动重连机制

### 数据流
1. 用户操作 → React组件
2. 调用 API/TanStack Query mutation
3. 更新 UI + 缓存
4. SSE 事件 → 触发 Query 刷新 → UI 自动更新

### 实时通信
- SSE 连接管理 (单例模式, 断线重连)
- 事件类型: message_sent, message_edited, message_deleted, member_joined, member_left, conversation_updated, typing_start, typing_stop
- 消息处理: 更新本地缓存 + 触发UI更新 + 可选通知
- 流式事件: message_streaming (块传输), message_stream_end (传输完成)

### 状态管理
- **AuthStore**: 用户信息, Token, 登录状态
- **ConversationStore**: 当前会话, 成员列表
- **UIStore**: 侧边栏折叠, 详情面板显示, Toast队列