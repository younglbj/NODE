const router = require('koa-router')()
const UserInfo = require('../../models/userInfo')


router.get('/addUserInfo', async (ctx) => {
  ctx.verifyParams({
    name: { type: "string", required: true },
    age: { type: "string", required: true },
  })
  const {name, age} = ctx.query
  const [err, data] = await to(new UserInfo({name, age}).save())
  if(err) return ctx.throw(500, err)
  ctx.response.body = data
})

router.get('/findUserInfo', async (ctx) => {
    const data = await UserInfo.find()
    ctx.response.body = data.join('\n')
})

router.post('/remove', async (ctx) => {
  const { name } = ctx.request.body
  console.log('name:', name);
  const data = await UserInfo.deleteOne({name: name})
  ctx.response.body = data
})

router.post('/update', async (ctx) => {
  ctx.verifyParams({
    name: { type: "string", required: true },
    age: { type: "string"},
  })
  const {name, age} = ctx.request.body
  const [err, data] = await to( UserInfo.updateOne({name}, {age}) )
  if(err) return ctx.throw(500, err)
  ctx.response.body = data
})


module.exports = router
