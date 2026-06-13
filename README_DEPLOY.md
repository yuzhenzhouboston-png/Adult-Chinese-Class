# 成人中文班复习中心发布说明

这个网站是静态网页，适合小班学生通过一个网址访问。它不需要服务器数据库，发布到 Netlify、Vercel、GitHub Pages 都可以。

网站在同一页面直接显示中文和 English 双语标注，不需要切换版本。

## 发布前要改的地方

打开 `site-config.js`：

```js
window.CLASS_SITE_CONFIG = {
  accessCode: "2026",
  slides: [
    {
      name: "第一课复习课件",
      url: "https://你的课件链接",
      uploadedAt: "第一周"
    }
  ],
  video: {
    name: "餐厅点餐听力",
    url: "https://你的公开视频或非公开视频链接"
  }
};
```

- `accessCode` 是学生进入网站的访问码。适合小班使用，但不是严格安全的登录系统。
- `slides` 放 PPT、PDF 或讲义链接。推荐用 Google Drive、OneDrive、Dropbox 或网盘共享链接。
- `video.url` 推荐用 YouTube unlisted 链接，或者可公开访问的视频链接。

## 最简单发布方式：Netlify

1. 打开 <https://app.netlify.com/drop>
2. 把整个 `Adult Chinese Class website` 文件夹拖进去
3. Netlify 会生成一个网址
4. 把网址和访问码发给学生

## GitHub Pages 发布方式

1. 新建一个 GitHub repository
2. 上传这个文件夹里的所有文件
3. 在 repository 的 Settings -> Pages 里选择发布 main branch
4. 等 GitHub 生成网址

## 小班使用建议

- 课件和视频尽量用“知道链接的人可查看”。
- 不要在这个静态版本里放学生隐私信息。
- 如果以后要让学生提交作业、老师查看成绩、接入真正 AI 对话，需要加后台服务和登录。
