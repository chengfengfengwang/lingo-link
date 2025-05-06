
简体中文 ｜ [English](README_EN.md)
## ⚠️ 项目已停止维护 / Project Unmaintained ⚠️
由于个人精力原因，本项目已停止维护。欢迎移步我的另一个主要维护项目：[布偶阅读](https://ragdoll.lingolink.xyz/)
## 商店下载
- [chrome 浏览器](https://chromewebstore.google.com/detail/lingo-link/ahhlnchdiglcghegemaclpikmdclonmo)
- [edge 浏览器](https://microsoftedge.microsoft.com/addons/detail/llmpcnfgcldhpheamlkfagokdlmolmnm)
## 介绍
lingo link是一个浏览器插件，主要功能是划词翻译，希望能够辅助外文**原文**阅读，在此过程中提高外语能力。插件的设计希望能够简洁、美观。

## 主要特性
- 查词：有道查词简明、有道查词柯林斯
- 翻译：有道翻译、Google翻译、OpenAI、Gemi、moonshot、deepseek等，大模型翻译需要自备apikey
- 生词标记：收藏过的生词会在网页中被标记
- 生词同步：生词数据可本地化、也支持将生词同步到欧路词典、内置账号系统将生词同步至服务端
## 计划
- [ ] 可以对YouTube字幕进行查词翻译
## 本地下载
1. 点击 Releases
2. 下载解压 source code
3. 解压 edgeDist.zip或chromeDist.zip
4. 在浏览器扩展界面加载解压后的目录


## 开发

```
npm install
npm run dev:chrome
或者
npm run dev:edge
```
打开浏览器扩展开发模式，加载dist文件夹

## 构建
```
npm run build:chrome
或者
npm run build:edge
```

## 感谢
- [openai-translator](https://github.com/openai-translator/openai-translator)
- [ext-saladict](https://github.com/crimx/ext-saladict)
- [relingo](https://chromewebstore.google.com/detail/relingo-master-words-bili/dpphkcfmnbkdpmgneljgdhfnccnhmfig)
