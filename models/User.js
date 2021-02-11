const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const saltRounds = 10
const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true, //"dev htak@naver.com" 에서 존재하는 띄어쓰기를 삭제해준다.
        unique: true         
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String        
    },
    tokenExp: {
        type: Number
    }
})

// save가 호출되기 전에 실행한다.
userSchema.pre('save', function(next) {
    // 비밀번호 암호화
    var user = this
    // password가 변경되면 salt를 만들어 수정
    if(user.isModified('password')) { 
        // salt를 만든다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            // callback 함수
            if(err) return next(err)
            bcrypt.hash(user.password, salt, function(err, hash) {
                if(err) return next(err)
                user.password = hash
                next()
            })
        })
    } else {
        next()   
    }    
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // 입력된 비밀번호화 hash값과 비교해야 한다.
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) 
            return cb(err)
        cb(null, isMatch)
    })
}

userSchema.methods.generateToken = function(cb) {
    // jwt을 이용하여 token 생성
    // user._id + secretToken으로 token을 만든다.
    // token으로 user._id를 반환받을 수 있다.
    var token = jwt.sign(this._id.toHexString(), 'secretToken') 
    this.token = token
    
    this.save(function(err, user) {
        if(err) 
            return cb(err)
        return cb(null, user)
    })
     
}

userSchema.statics.findByToken = function(token, cb) {
    // token = user._id + secretToken
    var user = this
    jwt.verify(token, 'secretToken', function(err, decoded){
        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err)
            cb(null, user)
        })
    })
}


const User = mongoose.model('User', userSchema)
module.exports = { User }