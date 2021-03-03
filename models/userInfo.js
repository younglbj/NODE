const mongoose = require('mongoose');  
const { Schema, model } = mongoose;

// 用户信息数据模型
let userInfo = new Schema({
    name: { type: String, required: true},
    age: { type: String, require: true },
});

module.exports = model('userInfo', userInfo);