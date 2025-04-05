---
title: "Next.js/T3 Stack集成测试系列1: 基础环境搭建与tRPC后端路由测试"
pubDate: "2025-04-05"
description: "从零搭建Next.js/T3 Stack测试环境，验证tRPC基础路由功能"
categories: ["Next.js"]
tags: ["T3 Stack", "Next.js", "tRPC", "单元测试", "TypeScript", "vitest", "drizzle"]
---

## 引言

为了业务的完整性，为项目的后端集成测试是非常有必要的。
我在使用 [T3 Stack](https://create.t3.gg/) 探索如何为我的应用程序添加测试时遇到了很多问题。
现存网络上关于如何为Next.js的后端路由集成测试的资料非常少且零碎。

由此写下这篇文章帮助更多和我一样的人。本文将通过：

1. 搭建完整的Vitest测试环境
2. 编写测试用例 测试Trpc路由
3. 解决配置过程中遇到的问题

帮助快速建立可靠的测试基础。

## 环境准备

```bash
# 使用create-t3-app脚手架初始化项目
pnpm create t3-app@latest my-vitest-tests
```

脚手架有很多选择，我的选择如下：

- Will you be using TypeScript or JavaScript?
  - TypeScript
- Will you be using Tailwind CSS for styling?
  - Yes
- Would you like to use tRPC?
  - Yes
- What authentication provider would you like to use?
  - NextAuth.js
- What database ORM would you like to use?
  - Drizzle
- Would you like to use Next.js App Router?
  - Yes
- What database provider would you like to use?
  - PostgreSQL
- Would you like to use ESLint and Prettier or Biome for linting and formatting?
  - Biome
- Should we initialize a Git repository and stage the changes?
  - Yes
- Should we run 'pnpm install' for you?
  - Yes
- What import alias would you like to use?
  - @

你不需要和我的选择一摸一样，但如果你选择 Prisma 作为你的 database ORM，则代码中的一些示例可能不适用于你，但整体来说，都是通用的，你应该只需要少量的修改。

你应该按照[官网](https://create.t3.gg/zh-hans/usage/first-steps)的教程先配置好你的项目，配置完成后继续往下看。

## 目的

初始化项目后，在 `src\server\api\routers\post.ts` 下默认有一个默认路由
我们的目的是为这个路由编写测试用例，测试这个路由的有效性

## 安装vitest

我们的目的是为后端trpc路由集成测试，因此不跟随 Next.js 官方的[文档](https://nextjs.org/docs/app/building-your-application/testing/vitest)文档走

### 1. 安装vitest

```base
pnpm add -D vitest
```

### 2. 新建 vitest.config.mts 配置文件

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['next'],
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

### 3. 添加基础测试用例

新建 `src\test\server\trpc\post.test.ts` 文件用于编写测试用例。

```typescript
import { describe, expect, it } from 'vitest'

describe('post router', () => {
  it('returns the correct greeting', async () => {
    const greeting = ({ text }: { text: string }) => ({
      greeting: `Hello ${text}`,
    })
    const result = greeting({
      text: 'vitest',
    })
    expect(result).toMatchObject({ greeting: 'Hello vitest' })
  })
})
```

### 4. 添加执行脚本

```json
{
  "scripts": {
    // ... 省略
    "test": "vitest"
  }
}
```

### 5. 运行 `pnpm run test`

![![alt text](image.png)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/base-test.png>)

如果出现上图内容，则 `vitest` 就安装完成了。

## 接入真实路由

### 1. caller

为了调用trpc路由，我们需要一个服务端调用的caller

在 `src\server\api\root.ts` 文件下，有一个 `createCaller` 函数

在 `src\trpc\server.ts` 下可以看到

```typescript
/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  const heads = new Headers(await headers())
  heads.set('x-trpc-source', 'rsc')

  return createTRPCContext({
    headers: heads,
  })
})

const caller = createCaller(createContext)
```

只需要传入上下文，即可实现路由的调用

在 `src\server\api\trpc.ts` 下有createTRPCContext的定义

```typescript
export async function createTRPCContext(opts: { headers: Headers }) {
  const session = await auth()

  return {
    db,
    session,
    ...opts,
  }
}
```

在该函数下添加 `createContextInner` 用于测试环境下的上下文创建

```typescript
export function createContextInner(opts: {
  session: Session | null
  db?: typeof db
}) {
  const headers = new Headers()
  return {
    db: opts.db ?? db,
    headers,
    ...opts,
  }
}
```

测试环境下没有客户端传过来的headers，因此需要手动 new 一个

新建 `src\test\server\trpc\utils\setupTrpc.ts` 用于创建caller

注意，现在是导入了 `@/server/db`下的db，调用会出现报错，提示无法连接到数据库，当前仍未解决。
在下一章使用专用数据库会创建专门用于测试的db实例，即可略过这个问题。

```typescript
import type { Session } from 'next-auth'
import { createCaller } from '@/server/api/root'
import { createContextInner } from '@/server/api/trpc'
import { db } from '@/server/db'

export async function setupTrpc() {
  const ctx = createContextInner({
    session: null,
    db,
  })
  const caller = createCaller(ctx)

  return { caller, db }
}

export async function setupAuthorizedTrpc({
  session,
}: {
  session: Session | null
}) {
  const ctx = createContextInner({
    session,
    db,
  })
  const caller = createCaller(ctx)

  return { callerAuthorized: caller, db }
}
```

然后在 `src\test\server\trpc\post.test.ts` 下使用

```typescript
import { describe, expect, it } from 'vitest'
import { setupTrpc } from './utils/setupTrpc'

describe('post router', async () => {
  it('returns the correct greeting', async () => {
    const { caller } = await setupTrpc()
    const result = await caller.post.hello({
      text: 'vitest',
    })
    expect(result).toMatchObject({ greeting: 'Hello vitest' })
  })
})
```

此时运行vitest，会遇到以下问题

![![alt text](image.png)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/env-err.png>)

### 2. env

该错误由[t3-env](https://github.com/t3-oss/t3-env)抛出。
这是一个类型安全访问环境变量的方案，由于我们导入了`@/server/db`下的db，此部分会取出`.env`中的`DATABASE_URL`连接数据库。
t3-env 检测到`DATABASE_URL`未定义，因此抛出错误。

本质上是运行时没有加载环境变量。

当我们使用 `next cli` 启动项目时，Next.js 内部会自动为我们注入环境变量，但当我们使用`vitest`启动测试时，需要我们自己手动加载环境变量

我们需要安装`@next/env`包

```base
pnpm i @next/env -D
```

并在vitest.config.mts 文件中加载

```typescript
import nextEnv from '@next/env'
import { defineConfig } from 'vitest/config'

nextEnv.loadEnvConfig(process.cwd())

export default defineConfig({
  test: {
    server: {
      deps: {
        inline: ['next'],
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

再次运行vitest，运行成功

![![alt text](image.png)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/base-test-with-router.png>)

### 3. 添加受保护路由测试

```typescript
it('throws an error if not logged in', async () => {
  const { caller } = await setupTrpc()
  await expect(() =>
    caller.post.getSecretMessage(),
  ).rejects.toThrowErrorMatchingInlineSnapshot('[TRPCError: UNAUTHORIZED]')
})

it('returns the secret message if logged in', async () => {
  const { callerAuthorized } = await setupAuthorizedTrpc()
  const example = await callerAuthorized.post.getSecretMessage()
  expect(example).toMatchInlineSnapshot(
    `"you can now see this secret message!"`,
  )
})
```

运行通过

![[![alt text](image.png)](<T3 Stack 集成测试系列1 搭建基本环境测试trpc路由.md>)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/base-test-with-protected-router.png>)

### 4. 可能出现的问题

在最新的`create-t3-app`脚手架下创建的项目，上述过程一个可以正常实现。
但如果是在以前创建的t3项目，大概是t3没有升级到react19之前，可能会出现以下问题。

#### 1.Next Auth Error

![![alt text](image.png)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/err-next-auth.png>)

####

这可以通过配置vitest的Vite-node server options选项解决

```typescript
export default defineConfig({
  // ... 省略
  test: {
    server: {
      deps: {
        inline: ['next'],
      },
    },
  },

})
```

#### 2.err-(0 , cache) is not a function

![![alt text](image.png)](<../image/T3 Stack 集成测试系列1 搭建基本环境测试trpc路由/err-(0 , cache) is not a function.png>)
这似乎会出现在 react canary 版本中，我们可以Vitest的mock功能来模拟React模块，添加这个函数的定义。

创建 `src\test\setup.ts` 文件，添加以下内容

```typescript
import { vi } from 'vitest'

vi.mock('react', async (importOriginal) => {
  const testCache = <T extends (...args: Array<unknown>) => unknown>(func: T) =>
    func
  const originalModule = await importOriginal<typeof import('react')>()
  return {
    ...originalModule,
    cache: testCache,
  }
})
```

这应该可以解决问题

## 总结

经过以上流程，现在已经可以做到对trpc的router进行测试。
不过为了不污染数据库，在测试环境下，我们应该另外使用测试专用数据库进行测试。

请看 Next.js/T3 Stack集成测试系列2 搭建专用测试数据库环境

还没写

## 相关链接

[示例仓库](https://github.com/JinJieBeWater/my-vitest-tests)

[nextjs test-environment-variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#test-environment-variables)

[TypeError: (0 , \_react.cache) is not a function #49304](https://github.com/vercel/next.js/discussions/49304)

[Next Auth Error](https://github.com/nextauthjs/next-auth/discussions/9385#discussioncomment-11064988)
