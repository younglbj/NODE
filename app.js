const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const parameter = require("koa-parameter")
const Moment = require("moment")
const fs = require('fs')
const Router = require('koa-router')
const router = new Router()
const {to} = require('await-to-js')
//连接数据库
const mongoose = require('./db')


// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger((str) => {                // 使用日志中间件
  console.log(Moment().format('YYYY-MM-DD HH:mm:ss')+str);
}))
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
function useRouter(path) {
  var path = path || __dirname + '/routes'
  let urls = fs.readdirSync(path)
  urls.forEach((element) => {
    const elementPath = path + '/' + element
    const stat = fs.lstatSync(elementPath);
    const isDir = stat.isDirectory();
    if (isDir) { // 文件夹递归注册路由
      useRouter(elementPath)
    } else {
      let module = require(elementPath)
      let routeRrefix = path.split('/routes')[1] || ''
      // console.log('routeRrefix', routeRrefix);
      // //routes里的文件名作为 路由名
      router.use(routeRrefix + '/' + element.replace('.js', ''), module.routes())
    }
  })
  //使用路由
  app.use(router.routes()).use(router.allowedMethods())
}
// 自动读取路由文件
useRouter()
//
app.use(parameter(app));

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

// set global
global.to = to

module.exports = app
