# Sprinkle Web 开发指南

## 目录

1. [项目概览](#1-项目概览)
2. [后端 API 架构](#2-后端-api-架构)
3. [前端结构](#3-前端结构)
4. [API 接口规范](#4-api-接口规范)
5. [SSE 实时通信](#5-sse-实时通信)
6. [状态管理](#6-状态管理)
7. [环境配置](#7-环境配置)
8. [开发流程](#8-开发流程)
9. [测试清单](#9-测试清单)
10. [后端缺失接口](#10-后端缺失接口)

---

## 1. 项目概览

**Sprinkle** 是一款甜点系虚拟聊天软件，主打温暖、柔和的视觉风格和流畅的实时交互体验。

### 核心功能

- 即时消息通讯（支持文本、Markdown、图片、文件）
- 群聊与私聊
- AI Agent 智能助手
- 消息实时推送（SSE）

### 技术栈

| 层级 | 技术 | 版本 | 说明 |
|------|------|------|------|
| 前端框架 | React | 19.x | UI 渲染 |
| 类型系统 | TypeScript | 6.x | 类型安全 |
| 构建工具 | Vite | 8.x | 快速开发 |
| 样式方案 | Tailwind CSS | 4.x | 甜点系主题 |
| 路由管理 | React Router | 7.x | SPA 路由 |
| 状态管理 | Zustand | 5.x | 全局状态 |
| 图标库 | Lucide React | 1.x | 线性图标 |

### 后端服务

- **地址**: `124.221.78.82:8003`
- **技术栈**: FastAPI (Python), SQLAlchemy 2.0, PostgreSQL, Redis, SSE
- **API 文档**: `http://124.221.78.82:8003/docs`

---

## 2. 后端 API 架构

### 2.1 系统架构图

```
┌─────────────────────────────────────────────────────────────┐
│                        前端 (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Pages │ Components │ Stores │ Hooks │ Types                │
└────┬────────────────────────────────────────────────────────┘
     │ HTTP / SSE
┌────▼────────────────────────────────────────────────────────┐
│                  后端 API (FastAPI)                         │
│  /api/v1/*                                          :8003  │
├─────────────────────────────────────────────────────────────┤
│  Auth │ Users │ Conversations │ Messages │ Files │ Events   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 后端技术栈

- **框架**: FastAPI (Python 3.11+)
- **ORM**: SQLAlchemy 2.0
- **数据库**: PostgreSQL
- **缓存**: Redis
- **实时通信**: SSE (Server-Sent Events)
- **认证**: JWT Bearer Token

---

## 3. 前端结构

### 3.1 目录结构

```
src/
├── api/                      # API 请求层（待创建）
│   ├── client.ts            # Fetch 封装 + 拦截器
│   ├── auth.ts              # 认证相关 API
│   ├── conversations.ts      # 会话相关 API
│   ├── messages.ts          # 消息相关 API
│   ├── users.ts             # 用户相关 API
│   └── files.ts             # 文件相关 API
│
├── components/              # 组件
│   ├── ui/                  # 基础 UI 组件
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Switch.tsx
│   │   └── Skeleton.tsx
│   │
│   └── features/            # 业务组件
│       ├── Sidebar.tsx
│       ├── ChatArea.tsx
│       ├── MessageList.tsx
│       ├── MessageBubble.tsx
│       ├── MessageInput.tsx
│       ├── ConversationItem.tsx
│       ├── Header.tsx
│       ├── DetailPanel.tsx
│       ├── MemberList.tsx
│       ├── UserInfo.tsx
│       ├── GroupInfo.tsx
│       ├── SettingsPanel.tsx
│       └── StreamingMessage.tsx
│
├── hooks/                   # 自定义 Hooks
│   ├── useAuth.ts           # 认证 Hook
│   ├── useConversations.ts   # 会话 Hook
│   ├── useMessages.ts       # 消息 Hook
│   ├── useSSE.ts           # SSE 连接管理
│   ├── useStreamMessage.ts  # 流式消息（需适配后端）
│   └── index.ts
│
├── lib/                    # 工具库
│   ├── sse.ts              # SSE 管理器（已实现）
│   ├── constants.ts
│   └── utils.ts
│
├── mocks/                  # Mock 数据（开发模式）
│   ├── auth.ts
│   ├── conversation.ts
│   ├── message.ts
│   └── data.ts
│
├── pages/                  # 页面组件
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── MainPage.tsx
│   └── NotFoundPage.tsx
│
├── stores/                 # Zustand 状态
│   ├── authStore.ts        # 需适配新 API
│   ├── conversationStore.ts # 需适配新 API
│   ├── messageStore.ts     # 需适配新 API
│   └── uiStore.ts
│
├── types/                  # TypeScript 类型
│   └── index.ts
│
├── App.tsx
├── main.tsx
└── index.css              # 全局样式 + Tailwind
```

---

## 4. API 接口规范

### 4.1 基础约定

```
Base URL: /api/v1

认证方式: Bearer Token (JWT)
Content-Type: application/json
SSE 认证: ?token=<jwt_token> (query parameter)

请求超时: 30s
重试策略: 3次，指数退避
```

### 4.2 统一响应格式

后端使用 FastAPI 标准响应，无统一包装：

```typescript
// 成功响应（直接返回数据）
{
  "access_token": "...",
  "refresh_token": "...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user_id": "..."
}

// 错误响应
{
  "detail": "错误信息"
}

// 分页响应
{
  "items": [...],
  "total": 100,
  "limit": 50,
  "offset": 0
}
```

### 4.3 认证模块 `/api/v1/auth`

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| POST | `/register` | `{username, password, display_name?, is_agent?}` | `RegisterResponse` | 注册 |
| POST | `/login` | `{username, password}` | `TokenResponse` | 登录 |
| POST | `/refresh` | `{refresh_token}` | `TokenResponse` | 刷新 Token |

**请求/响应示例**：

```typescript
// POST /api/v1/auth/register
Request: {
  "username": "alice",
  "password": "password123",
  "display_name": "Alice Smith",
  "is_agent": false
}
Response: {
  "id": "uuid-xxx",
  "username": "alice",
  "display_name": "Alice Smith",
  "user_type": "user",
  "created_at": "2024-01-01T00:00:00Z"
}

// POST /api/v1/auth/login
Request: {
  "username": "alice",
  "password": "password123"
}
Response: {
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "expires_in": 1800,
  "user_id": "uuid-xxx"
}
```

### 4.4 用户模块 `/api/v1/users`

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| GET | `/me` | - | `UserResponse` | 获取当前用户 |
| PUT | `/me` | `{display_name?, metadata?}` | `UserResponse` | 更新当前用户 |
| POST | `/me/avatar` | `{file_id}` | `UserResponse` | 设置头像 |
| DELETE | `/me/avatar` | - | `{message}` | 删除头像 |

### 4.5 会话模块 `/api/v1/conversations`

| 方法 | 路径 | 查询参数 | 请求体 | 响应 | 说明 |
|------|------|----------|--------|------|------|
| GET | `/` | `?limit&offset` | - | `ConversationListResponse` | 获取会话列表 |
| POST | `/` | - | `{type, name?, member_ids[], metadata?}` | `ConversationResponse` | 创建会话 |
| GET | `/:conversation_id` | - | - | `ConversationResponse` | 获取会话详情 |
| PUT | `/:conversation_id` | - | `{name?, metadata?}` | `ConversationResponse` | 更新会话 |
| DELETE | `/:conversation_id` | - | - | `204 No Content` | 删除会话 |

### 4.6 成员模块 `/api/v1/conversations/:conversation_id/members`

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| GET | `/` | - | - | `MemberListResponse` | 获取成员列表 |
| POST | `/` | `{user_id, role?, nickname?}` | `MemberResponse` | 添加成员 |
| PUT | `/:user_id` | `{role}` | `MemberResponse` | 更新成员角色 |
| DELETE | `/:user_id` | - | `204 No Content` | 移除成员 |

**注意**: 后端路径参数是 `user_id` 不是 `userId`

### 4.7 消息模块 `/api/v1/conversations/:conversation_id/messages`

| 方法 | 路径 | 查询参数 | 请求体 | 响应 | 说明 |
|------|------|----------|--------|------|------|
| GET | `/` | `?limit&before&after` | - | `MessageListResponse` | 获取消息列表 |
| POST | `/` | - | `{content, content_type?, file_ids?, mentions?, reply_to?}` | `MessageResponse` | 发送消息 |

**消息编辑/删除** (顶级路径):

| 方法 | 路径 | 请求体 | 响应 | 说明 |
|------|------|--------|------|------|
| PUT | `/:message_id` | `{content}` | `MessageResponse` | 编辑消息 |
| DELETE | `/:message_id` | - | `204 No Content` | 删除消息 |

### 4.8 文件模块 `/api/v1/files`

| 方法 | 路径 | 参数 | 请求体 | 响应 | 说明 |
|------|------|------|--------|------|------|
| POST | `/upload` | `?conversation_id` | `FormData (file)` | `FileResponse` | 上传文件 |
| GET | `/:file_id` | - | - | `File (binary)` | 下载文件 |
| DELETE | `/:file_id` | - | - | `204 No Content` | 删除文件 |

### 4.9 事件模块 `/api/v1/events`

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/` | SSE 事件流（需认证，token 通过 query 传递） |
| POST | `/subscribe` | `?conversation_id` 订阅会话事件 |
| POST | `/unsubscribe` | `?conversation_id` 取消订阅 |

---

## 5. SSE 实时通信

### 5.1 连接方式

```typescript
// src/lib/sse.ts (已实现，需验证)
const token = localStorage.getItem('token');
const eventSource = new EventSource(
  `${API_BASE}/events?token=${encodeURIComponent(token)}`
);
```

**重要**: 后端 SSE 认证通过 **query parameter** `?token=` 传递，不是 Header。

### 5.2 后端 SSE 事件

根据 Swagger，后端支持以下 SSE 事件：

| 事件类型 | 说明 | 数据格式 |
|---------|------|----------|
| `member_joined` | 成员加入 | `{member, conversation_id}` |
| `member_left` | 成员离开 | `{user_id, conversation_id}` |
| `conversation_updated` | 会话信息更新 | `{conversation_id, ...}` |
| `message_sent` | 新消息 | `{message, conversation_id}` |

### 5.3 前端 SSE 处理

```typescript
// src/lib/sse.ts
type SSEEventType =
  | 'message_sent'
  | 'member_joined'
  | 'member_left'
  | 'conversation_updated';

sseManager.on('message_sent', (data: { message: Message; conversation_id: string }) => {
  // 处理新消息
});

sseManager.on('member_joined', (data: { member: Member; conversation_id: string }) => {
  // 处理成员加入
});
```

### 5.4 心跳和重连

- 后端每 30 秒发送一次 comment 行作为心跳
- 前端自动重连（最多 5 次）

---

## 6. 状态管理

### 6.1 Store 概览

| Store | 职责 | 主要状态 |
|-------|------|---------|
| `authStore` | 认证状态 | user, token, isAuthenticated |
| `conversationStore` | 会话状态 | conversations, currentConversation, members |
| `messageStore` | 消息状态 | messages |
| `uiStore` | UI 状态 | sidebarCollapsed, detailPanelOpen |

### 6.2 数据流

```
用户操作 → React Component → Zustand Store → API 调用
                                    ↓
                              SSE 事件通知
                                    ↓
                              React Component 更新
```

---

## 7. 环境配置

### 7.1 环境变量

```bash
# .env.development
VITE_API_BASE=http://124.221.78.82:8003/api/v1
VITE_USE_MOCK=false

# .env.production
VITE_API_BASE=/api/v1
VITE_USE_MOCK=false
```

### 7.2 Vite 配置

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://124.221.78.82:8003',
        changeOrigin: true,
      },
    },
  },
});
```

---

## 8. 开发流程

```
Phase 1: 基础搭建
├── 创建 API Client (client.ts)
├── 对接认证模块 (登录/注册)
├── 实现 Token 管理
└── 搭建开发环境

Phase 2: 核心功能
├── 会话列表 CRUD
├── 消息收发
├── SSE 实时通信
└── 成员管理

Phase 3: 高级功能
├── 文件上传/下载
├── 消息编辑/删除
├── 用户信息更新
└── 头像设置

Phase 4: 优化完善
├── 错误处理
├── Loading 状态
├── 性能优化
└── E2E 测试
```

---

## 9. 测试清单

### 9.1 功能测试

| 模块 | 测试点 | 预期结果 |
|------|--------|---------|
| 认证 | 注册成功 | 返回用户信息 |
| 认证 | 登录成功 | 返回 token，跳转主页 |
| 认证 | Token 刷新 | 获取新 access_token |
| 会话 | 创建私聊/群聊 | 创建成功，添加到列表 |
| 会话 | 更新会话名称 | 显示新名称 |
| 会话 | 删除会话 | 从列表移除 |
| 成员 | 添加成员 | 成员出现在列表 |
| 成员 | 移除成员 | 成员从列表消失 |
| 成员 | 修改角色 | 角色更新显示 |
| 消息 | 发送消息 | 消息显示在列表 |
| 消息 | 编辑消息 | 显示"edited"标签 |
| 消息 | 删除消息 | 显示"消息已删除" |
| 文件 | 上传文件 | 返回 file_id |
| 实时 | 新消息通知 | 即使不在会话中也收到 |
| 实时 | 成员加入通知 | 显示加入提示 |

### 9.2 边界测试

| 场景 | 测试点 |
|------|--------|
| 网络 | 断开网络，发送消息 |
| 网络 | 断网重连后，SSE 自动恢复 |
| 消息 | 发送空消息，应被拦截 |
| 消息 | 超长消息（>10KB） |
| 分页 | 消息列表分页加载 |
| 并发 | 多端同时登录 |

---

## 10. 后端缺失接口

### 10.1 流式消息（关键缺失）

**前端设计**: `POST /api/v1/conversations/:id/messages/stream`
**后端现状**: **不存在此接口**

后端只有普通消息发送 `POST /api/v1/conversations/:id/messages`，不支持流式响应。

**建议方案**:
1. 短期：使用普通消息发送，AI 服务端流式处理后返回完整消息
2. 长期：后端需实现 SSE 流式端点

### 10.2 其他缺失接口

| 功能 | 前端需求 | 后端状态 | 建议 |
|------|----------|----------|------|
| 流式消息 | `POST /messages/stream` | ❌ 不存在 | 暂时使用普通消息 |
| 输入状态 | `typing_start/typing_stop` | ❌ 不存在 | 暂时不实现 |
| 消息已读 | 标记消息已读 | ❌ 不存在 | 暂不实现 |
| 会话搜索 | 搜索会话 | ❌ 不存在 | 暂不实现 |
| 消息搜索 | 搜索消息 | ❌ 不存在 | 暂不实现 |
| 离线消息 | 拉取离线消息 | ❌ 不存在 | 暂不实现 |

### 10.3 API 差异修正

| 原设计 | 实际后端 | 修正 |
|--------|----------|------|
| `DELETE /conversations/:id/members/:userId` | `DELETE /conversations/:id/members/:user_id` | 路径参数名不同 |
| `PATCH /conversations/:id` | `PUT /conversations/:id` | HTTP 方法不同 |
| `Authorization: Bearer <token>` (Header) | `?token=` (Query) | SSE 认证方式不同 |
| 统一响应 `{success, data}` | 直接返回数据 | 响应格式不同 |

---

## 附录

### A. 类型定义

```typescript
// src/types/index.ts (需根据后端更新)

export interface User {
  id: string;
  username: string;
  display_name: string;
  user_type: 'user' | 'agent';
  avatar_id?: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group';
  name?: string;
  owner_id: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  member_count: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  content_type: 'text' | 'markdown' | 'image' | 'file';
  attachments: AttachmentInfo[];
  mentions: string[];
  reply_to?: string;
  is_deleted: boolean;
  created_at: string;
  edited_at?: string;
  deleted_at?: string;
  deleted_by?: string;
}

export interface Member {
  user_id: string;
  conversation_id: string;
  role: 'admin' | 'member';
  nickname?: string;
  joined_at: string;
  is_active: boolean;
}
```

### B. 错误码

后端使用 FastAPI 标准错误格式：

```json
{
  "detail": "错误描述"
}
```

常见 HTTP 状态码：
- `200` - 成功
- `201` - 创建成功
- `204` - 删除成功（无内容）
- `401` - 未认证
- `403` - 无权限
- `404` - 资源不存在
- `422` - 验证错误

### C. 甜点系配色

```css
/* src/index.css */

:root {
  /* 草莓粉 - Primary */
  --color-strawberry-50: #fdf2f8;
  --color-strawberry-500: #ec4899;
  --color-strawberry-600: #db2777;

  /* 奶油黄 - Secondary */
  --color-vanilla-50: #fffbeb;
  --color-vanilla-400: #fbbf24;

  /* 薄荷绿 - Accent */
  --color-mint-50: #ecfdf5;
  --color-mint-500: #10b981;

  /* 巧克力棕 - Text */
  --color-chocolate-600: #4a3728;
  --color-chocolate-400: #9a8478;

  /* 暖白 - Background */
  --color-cream-50: #FFFBF5;
}
```