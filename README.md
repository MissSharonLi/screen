# screen 大屏 排行榜 即时展示最新氪金情况 满屏横向滚动弹幕

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run dev
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## git 提交代码

本项目配置了 gitHook 与 git 规范，所以在执行执行 commit 的时候，执行`git cz`

如果执行`git cz`不成功的话，需要全局安装 cz-customizable、cz-conventional-changelog、commitizen

`npm i cz-customizable cz-conventional-changelog commitizen -g`

```sh

# 错误做法
git commit -m "xxx"

# 正确做法
git cz
```
