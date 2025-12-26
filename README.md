# 🎄 Christmas Interactive Web App

一个基于 **React + TypeScript + Vite** 构建的交互式圣诞主题网页应用，支持动画特效、背景音乐、图片上传以及多种交互方式（鼠标 / 手势）。

适合用于：

* 个人展示页面
* 节日主题网站
* GitHub Pages 静态部署

---

## ✨ 功能特性

* 🎄 圣诞主题动画场景（雪花、圣诞树、星星等）
* 🖼️ 支持用户上传照片展示
* 🔊 背景圣诞音乐播放
* 🖱️ 鼠标交互 & 🤏 手势交互（设备支持时）
* 📱 移动端自适应
* ⚡ 极速构建与加载（Vite）

---

## 🧰 技术栈详解

### 前端框架

* **React 18**

  * 使用函数组件与 Hooks
  * 组件化设计，结构清晰

### 语言

* **TypeScript**

  * 强类型约束，提高代码可维护性
  * 独立 `types/` 目录定义业务类型

### 构建工具

* **Vite**

  * 极速冷启动
  * 原生 ES Module
  * 支持热更新（HMR）

### 样式方案

* **CSS / CSS Modules**

  * 全局样式：`index.css`
  * 组件样式：`App.css`

### 自定义 Hook

* `useChristmasAudio`：控制背景音乐
* `useHandGesture`：手势识别交互
* `useMouseFallback`：无手势时使用鼠标操作
* `useMobile`：判断移动端环境

### UI & 工具函数

* `components/ui`：通用 UI 组件
* `lib/utils.ts`：工具方法封装

---

## 📁 项目目录结构

```text
cxxpub.github.io
├── public/                 # 静态资源
│   ├── audio/              # 背景音乐
│   ├── my-photos/          # 示例图片
│   └── favicon.ico
├── src/
│   ├── components/         # 通用组件
│   │   ├── christmas/      # 圣诞主题组件
│   │   └── ui/              # UI 基础组件
│   ├── hooks/               # 自定义 Hooks
│   ├── pages/               # 页面级组件
│   ├── types/               # TypeScript 类型定义
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── vite.config.ts           # Vite 配置
├── tsconfig.json
└── package.json
```

---

## 🚀 本地开发

### 1️⃣ 安装依赖

```bash
npm install
```

或使用 pnpm / yarn：

```bash
pnpm install
# 或
yarn install
```

---

### 2️⃣ 启动开发服务器

```bash
npm run dev
```

浏览器访问：

```
http://localhost:5173
```

---

## 📦 构建项目

```bash
npm run build
```

构建产物会生成在：

```text
dist/
```

---

## 🌍 部署到 GitHub Pages

### 方式一：手动部署

1. 修改 `vite.config.ts` 中的 `base`：

```ts
export default defineConfig({
  base: '/你的仓库名/',
})
```

2. 构建项目：

```bash
npm run build
```

3. 将 `dist` 目录内容推送到 `gh-pages` 分支

---

### 方式二：GitHub Actions（推荐）

可配置 GitHub Actions 自动构建并部署（如有需要我可以直接帮你写一份 workflow）。

---

## 🧑‍💻 使用说明

* 打开页面后自动加载圣诞场景
* 点击 / 允许播放背景音乐
* 上传照片后将展示在场景中
* 桌面端支持鼠标交互
* 支持设备时可使用手势进行互动

---

## ❓ 常见问题

### 页面资源无法加载？

请确认：

* `vite.config.ts` 中 `base` 路径正确
* GitHub Pages 分支设置为 `gh-pages` 或 `main`

### 音乐无法自动播放？

浏览器限制自动播放，请手动点击页面触发。

---

## 📄 License

MIT License

---

🎉 **Merry Christmas & Happy Coding!**
