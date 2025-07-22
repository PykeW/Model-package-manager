# 🤖 AI模型管理器

一个基于React + TypeScript的工业级AI模型管理系统，提供直观的表格化界面来管理、归档和展示各类AI模型。

## ✨ 功能特性

- 🎯 **工业风格设计** - 专业的深色主题界面
- 📊 **表格化展示** - 支持排序、筛选、搜索的高性能表格
- 🏷️ **标签管理** - 灵活的标签分类和快速检索
- ⏰ **版本控制** - 基于时间戳的自动版本管理
- 📱 **响应式设计** - 适配桌面端和移动端
- 🧪 **完整测试** - 42个单元测试，确保代码质量

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) 查看应用。

### 构建生产版本

```bash
npm run build
```

### 运行测试

```bash
# 运行所有测试
npm run test:run

# 交互式测试模式
npm run test

# 测试覆盖率报告
npm run test:coverage
```

## 📁 项目结构

```
src/
├── components/           # React组件
│   ├── UI/              # 基础UI组件库
│   ├── ModelTable/      # 模型表格组件
│   ├── ModelManager/    # 模型管理器主组件
│   ├── ModelForm/       # 模型表单和详情组件
│   └── ModelManagerModal/ # 弹窗集成组件
├── hooks/               # 自定义React Hooks
├── types/               # TypeScript类型定义
├── utils/               # 工具函数库
├── data/                # Mock数据
├── styles/              # 全局样式和CSS变量
└── test/                # 测试配置
```

## 🎨 设计系统

项目采用工业风格设计，包含：

- **深色主题配色方案** - 专业的工业级深色界面
- **CSS变量系统** - 统一的设计令牌管理
- **模块化样式架构** - CSS Modules确保样式隔离
- **响应式布局** - 适配各种屏幕尺寸

## 🛠 技术栈

- **前端框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式方案**: CSS Modules + CSS Variables
- **测试框架**: Vitest + Testing Library
- **代码规范**: ESLint + TypeScript

## 📋 Git忽略配置

项目包含完整的`.gitignore`配置，涵盖：

- ✅ Node.js依赖和缓存文件
- ✅ 构建输出目录（dist、build等）
- ✅ IDE配置文件（.vscode、.idea等）
- ✅ 环境配置文件（.env等）
- ✅ 测试覆盖率报告
- ✅ 系统临时文件
- ✅ 各种缓存和日志文件

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
