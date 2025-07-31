# 盲盒网站 - 项目说明

这是一个功能完善的全栈盲盒模拟网站，旨在提供从浏览、抽取、分享到后台管理的完整用户体验。本项目作为 Web 开发课程的大作业，严格遵循了模块化、组件化和前后端分离的开发思想。

---

## 技术栈 (Tech Stack)

本项目采用当前业界主流且高效的技术栈进行构建：

#### **前端 (Frontend)**

* **框架**: 使用 **React 18** 进行开发，基于 **Vite** 构建，具备高效的开发体验和现代化特性。
* **组件库**: 采用 **MUI (Material-UI)**，提供丰富、高质量的 UI 组件，确保了设计语言的统一和专业性。
* **路由管理**: 通过 **React Router** (`react-router-dom`) 实现前端路由，支持多页面切换和受保护的路由。
* **网络请求**: 通过 **Axios** 实现与后端 API 的数据交互，并配置了请求拦截器以自动附加认证 Token。
* **状态管理**: 使用 React 的 **Context API** 进行全局用户状态（如登录信息、余额）的管理。
* **样式方案**: 以 **MUI** 为主，**Tailwind CSS** 为辅，实现快速、灵活的样式开发。

#### **后端 (Backend)**

* **框架**: 基于 **Node.js** 环境，使用轻量且灵活的 **Express** 框架搭建 RESTful API 服务。
* **数据库**: 采用 **SQLite**，轻量级、易于部署和本地开发测试。
* **数据访问层 (ORM)**: 使用 **Sequelize** 操作数据库，通过定义模型（Model）来映射数据表，实现了数据结构的清晰化和代码的可维护性。
* **认证与权限**: 采用 **JWT (JSON Web Token)** 机制进行用户认证，并通过自定义中间件实现了基于角色的权限控制（普通用户/管理员）。

#### **包管理 (Package Management)**

* 前后端均采用 **npm** 进行依赖管理。
* 项目结构采用 **Monorepo** 模式，将前后端代码统一存放在一个 Git 仓库中，便于统一管理和版本控制。

---

## 安装与运行

本项目采用 `npm` 进行包管理。首次拉取代码后，请分别在前端和后端目录执行安装命令。

#### **1. 安装后端依赖**

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install
```

#### **2. 安装前端依赖**

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install
```

---

## 启动项目

请确保同时启动前端和后端两个开发服务器。

#### **1. 启动后端服务器**

```bash
# 确保当前位于 backend 目录
cd backend

# 启动服务器
node server.js

# 后端服务将运行在 http://localhost:5000
```

#### **2. 启动前端开发服务器**

```bash
# 确保当前位于 frontend 目录
cd frontend

# 启动服务器
npm run dev

# 前端应用将运行在 http://localhost:5173 (或终端提示的其他端口)
```

---

## 目录结构

项目采用 Monorepo 结构，清晰地分离了前后端代码。

```
blind-box-project/
├── backend/        # 后端项目, 基于 Node.js + Express
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── tests/
│   └── server.js
├── frontend/       # 前端项目, 基于 React + Vite
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── context/
│       ├── pages/
│       └── services/
└── Readme.md       # 项目说明文件
