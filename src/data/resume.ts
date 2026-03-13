export type ResumeContact = {
  type: 'email' | 'phone' | 'location' | 'github'
  label: string
  href?: string
}

export type ResumeEducation = {
  school: string
  degree: string
  period: string
}

export type ResumeProject = {
  name: string
  role: string
  period: string
  frontend?: string
  backend?: string
  highlights: string[]
}

export type ResumeData = {
  name: string
  role: string
  contacts: ResumeContact[]
  education: ResumeEducation[]
  skills: string[]
  projects: ResumeProject[]
}

export const resumeData: ResumeData = {
  name: '陈锦杰',
  role: '前端/全栈开发',
  contacts: [
    {
      type: 'email',
      label: 'a2042244174@gmail.com',
      href: 'mailto:a2042244174@gmail.com'
    },
    {
      type: 'location',
      label: '广东潮州'
    },
    {
      type: 'github',
      label: 'https://github.com/JinJieBeWater',
      href: 'https://github.com/JinJieBeWater'
    }
  ],
  education: [
    {
      school: '广东海洋大学',
      degree: '物联网工程 - 本科',
      period: '2022.09 - 2026.07'
    }
  ],
  skills: [
    '熟练 HTML、CSS、SCSS、Tailwind CSS，擅长编写响应式、多端适配的前端界面',
    '熟练 JavaScript、TypeScript，具备强 TS 类型安全意识',
    '熟练 React、TanStack、shadcn UI 等工具进行前端开发',
    '熟练使用 Hono、oRPC、Drizzle ORM、Docker 等工具进行后端开发',
    '熟悉 Vite、Vitest、Git、Dotenv、Monorepo、Turborepo 等工具链',
    '阅读 React、Vue、NestJS 源码，对其底层实现机制有一定理解',
    '持续阅读《You Dont Know JS》《Vue.js 设计与实现》《React 技术揭秘》《深入浅出 Node.js》等书籍',
    '持续跟进 AI SDK / Mastra / Next.js / Local-First 等前沿技术'
  ],
  projects: [
    {
      name: '离线优先·模板驱动内容管理平台',
      role: '全栈',
      period: '2026.01 - 至今',
      backend: 'Hono / PowerSync / Better Auth / oRPC / Drizzle / PostgreSQL / Cloudflare R2',
      frontend: 'React / TanStack Router / shadcn UI / Drizzle / WA SQLite',
      highlights: [
        '基于 PowerSync + WA SQLite 构建离线优先多端同步架构，实现登录态切换后的数据所有权迁移',
        '基于 PowerSync 上传链路构建本地云端事务桥接机制，保证本地与云端变更原子性',
        '封装响应式查询层，加入缓存与 Zod 解析管道，映射 SQLite 和 PG 数据类型，统一前后端数据模型',
        '构建 Yjs 增量更新与压缩机制，实现富文本的离线编辑与多端同步',
        '基于 AttachmentQueue + S3 Presigned URL 实现多端文件同步与离线访问'
      ]
    },
    {
      name: '本地优先·去中心化的小说编辑器',
      role: '全栈',
      period: '2025.12 - 2026.01',
      backend: 'Hono / LiveStore / Better Auth / D1 / Durable Objects',
      frontend: 'React / TanStack Router / shadcn UI / LiveStore / Yjs',
      highlights: [
        '基于 Better Auth 与 D1 实现身份验证，用户数据分布式存储在边缘 SQLite 实例中',
        '基于 LiveStore 事件溯源与 Durable Objects 实现数据的断网可写、多端同步',
        '基于 ProseMirror 与 Yjs、Durable Objects 实现富文本的离线编辑、多端同步',
        '基于 Alchemy，使用 TypeScript 编排基础设施，一键打包部署 Cloudflare'
      ]
    },
    {
      name: 'Reddit 定时数据抓取与分析 Agent',
      role: '全栈',
      period: '2025.07 - 2025.08',
      backend: 'NestJS / tRPC / AI SDK / Prisma / PostgreSQL / Docker',
      frontend: 'React / TanStack Query / shadcn UI / AI SDK',
      highlights: [
        '基于 AI SDK 构建 Agent，支持对话驱动的任务编排与工作流定时执行',
        '基于 AI SDK 构建抓取分析 workflow，实现去重机制并实时推送执行进度',
        '使用 Vitest 为 NestJS 各模块编写单元、集成与端到端测试，覆盖核心流程',
        '使用 tsup 构建共享工具包，同时兼容 NestJS（CJS）与 Web（ESM）'
      ]
    },
    {
      name: '体育馆预定微信小程序',
      role: '前端',
      period: '2023.10 - 2024.01',
      frontend: 'Vue3 / TypeScript / Pinia / Uniapp / SCSS',
      highlights: [
        '实现多时间段预定表单组件，实现场馆状态显示、多场次预定等功能',
        '实现二维码核销、核销码分享、计时码核销等业务',
        '集成 @umijs/openapi，根据 OpenAPI 文档自动生成接口函数与类型，提高开发效率'
      ]
    }
  ]
}
