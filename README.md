# JXK · Tech Notes

个人技术知识分享网站，收录学习笔记与算法题解。使用 Astro 和 TypeScript 构建。

## 本地运行

需要 Node.js `22.23.4` 或更高版本，以及 npm `9.6.5` 或更高版本。

```sh
npm ci
npm run dev
```

开发地址为 `http://localhost:4321`。

## 内容目录

- [学习笔记](src/content/learning/)
- [算法题解](src/content/algorithms/)

## 检查与构建

```sh
npm run check
npm run test:content
npm run build
```

静态文件输出到 `dist/`，可用 `npm run preview` 在本地预览。
