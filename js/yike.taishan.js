/**
 * 串串计划
 * @param uid
 * @constructor
 */

function yikeTaishan(url, uid) {
    this.url = url + '?i='+uid+'&c=entry&m=yike_ts_plan';
    this.uid = uid;
    // this.openid = openid;
}

yikeTaishan.prototype = {
    constructor: yikeTaishan,
    /**
     * 基础查询函数
     * @param controller
     * @param action
     * @param op
     * @returns {AV.Promise}
     */
    query: function (data) {
        var promise = new AV.Promise();
        var url = this.url;
        for (var key in data) {
            if (url != "") {
                url += "&";
            }
            url += key + "=" + encodeURIComponent(data[key]);
        }

        $.ajax({
            url: url,
            dataType: 'jsonp',
            processData: false,
            type: 'get',
            success: function (data) {
                promise.resolve(data);
            },
            error: function (i, data) {
                connectionTimeout();
                promise.reject(data);
            }
        });
        return promise;
    },


    /**
     * 注册
     * @param phone
     * @param mac
     * @param qq
     * @param nickname
     * @param password
     * @returns {*|AV.Promise}
     */
    register:function(phone,mac,qq,nickname,password,tourists){
        return this.query({
            do:'register',
            phone:phone,
            mac:mac,
            qq:qq,
            nickname:nickname,
            password:password,
            tourists:tourists
        });
    },
    /**
     * 发送手机验证码
     * @param phone
     * @param op
     * @returns {*|AV.Promise}
     */
    sendMsg:function(phone,op){
        return this.query({
            do:'sendmsg',
            op:op,
            phone:phone
        });
    },
    /**
     * 确认邮箱验证完成
     * @param uid
     * @returns {*|AV.Promise}
     */
    confirmEmail :function(uid){
        return this.query({
            do:'confirm',
            op:'ok',
            uid:uid
        });
    },
    /**
     * 登录
     * @param email
     * @param password
     * @param op
     * @returns {*|AV.Promise}
     */
    login :function(email,password,op){
        return this.query({
            do:'login',
            op:op,
            email:email,
            password:password
        });
    },
    /**
     * 获取账户是否到期
     * @param uid
     * @param token
     * @returns {*|AV.Promise}
     */
    expire :function(uid,token){
        return this.query({
            do:'user',
            uid:uid,
            token:token
        });
    },
    /**
     * 首页banner
     * @returns {*|AV.Promise}
     */
    banner :function(){
        return this.query({
            do:'banner'
        });
    },
    /**
     * 历史开奖
     * @param op
     * @param page
     * @returns {*|AV.Promise}
     */
    lottery :function(op,page){
        return this.query({
            do:'lottery',
            op:op,
            page:page
        });
    },
    /**
     * 开奖走势
     * @param op
     * @param ob
     * @param num
     * @returns {*|AV.Promise}
     */
    movements :function(op,ob,num){
        return this.query({
            do:'trend',
            op:op,
            ob:ob,
            num:num
        });
    },
    /**
     * 重庆时时彩方案列表
     * @returns {*|AV.Promise}
     */
    sscScheme :function(){
        return this.query({
            do:'plan',
            op:'list'
        });
    },
    /**
     * pk10方案列表
     * @returns {*|AV.Promise}
     */
    pkScheme :function(token){
        return this.query({
            do:'pk10_plan',
            op:'list',
            token:token
        });
    },
    /**
     * 重庆时时彩方案详情
     * @param plan_id
     * @returns {*|AV.Promise}
     */
    schemeDetails :function(plan_id){
        return this.query({
            do:'plan',
            op:'detail',
            plan_id:plan_id
        });
    },
    /**
     * pk10方案详情
     * @param plan_id
     * @returns {*|AV.Promise}
     */
    pkDetails :function(plan_id){
        return this.query({
            do:'pk10_plan',
            op:'detail',
            num:3,
            code:5,
            plan_id:plan_id
        });
    },
    /**
     * 获取代理用户信息
     * @param token
     * @returns {*|AV.Promise}
     */
    agencyMessage:function(token){
        return this.query({
            do:"agency",
            op:"index",
            token:token
        });
    },
    /**
     * 查询会员和代理列表
     * @param token
     * @param page
     * @param phone
     * @param type
     * @param time
     * @param time1
     * @returns {*|AV.Promise}
     */
    queryUserList:function(token,page,phone,type,time,time1){
        return this.query({
            do:"agency",
            op:"list",
            token:token,
            page:page,
            phone:phone,
            type:type,
            time:time,
            time1:time1
        });
    },
    /**
     * 获取会员详情
     * @param token
     * @param id
     * @returns {*|AV.Promise}
     */
    userListDetails:function(token,id){
        return this.query({
            do:"agency",
            op:"view",
            token:token,
            id:id
        });
    },
    /**
     * 生成注册链接
     * @param token
     * @param type
     * @param num
     * @param ratio
     * @returns {*|AV.Promise}
     */
    generateLink:function(token,type,num,ratio){
        return this.query({
            do:"agency",
            op:"links",
            token:token,
            type:type,
            num:num,
            ratio:ratio
        });
    },
    /**
     * 收藏方案
     * @param ob
     * @param op
     * @param plan_id
     * @param uid
     * @returns {*|AV.Promise}
     */
    collect :function(op,ob,plan_id,uid){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            plan_id:plan_id,
            uid:uid
        });
    },
    /**
     * 我收藏的方案
     * @param op
     * @param ob
     * @param uid
     * @returns {*|AV.Promise}
     */
    myCollect :function(op,ob,uid){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            uid:uid
        });
    },
    /**
     * 删除我的收藏
     * @param op
     * @param ob
     * @param id
     * @returns {*|AV.Promise}
     */
    deleteCollect :function(op,ob,id){
        return this.query({
            do:'collection',
            op:op,
            ob:ob,
            id:id
        });
    },
    /**
     * 获取消息列表和详情
     * @param type
     * @param page
     * @param id
     * @returns {*|AV.Promise}
     */
    myMessageAndDetail:function(type,page,id){
        return this.query({
            do:"inform",
            op:"pk10",
            type:type,
            page:page,
            id:id
        });
    },
    /**
     * 修改密码
     * @param op
     * @param phone
     * @param password
     * @param new_password
     * @param token
     * @returns {*|AV.Promise}
     */
    modificationPassword :function(op,phone,new_password,password,token){
        return this.query({
            do:'reset',
            op:op,
            phone:phone,
            new_password:new_password,
            password:password,
            token:token
        });
    },
    /**
     * 公告列表
     * @returns {*|AV.Promise}
     */
    notice :function(){
        return this.query({
            do:'notice'
        });
    },
    /**
     * 个人中心
     * @param uid
     * @param op
     * @returns {*|AV.Promise}
     */
    personalCenter :function(op,uid){
        return this.query({
            do:'personal_center',
            op:op,
            uid:uid
        });
    },
    /**
     * 充值
     * @param phone
     * @param password
     * @param token
     * @returns {*|AV.Promise}
     */
    recharge :function(phone,password,token){
        return this.query({
            do:'recharge',
            phone:phone,
            password:password,
            token:token
        });
    },
    /***
     * 退出登录
     * @param uid
     * @returns {*|AV.Promise}
     */
    logout :function(uid){
        return this.query({
            do:'login_out',
            uid:uid
        });
    },
    /**
     * 绑定手机号
     * @param phone
     * @param token
     * @returns {*|AV.Promise}
     */
    bindPhone :function(phone,token){
        return this.query({
            do:'binding',
            phone:phone,
            token:token
        });
    },
    //咨询秘籍 >彩票新闻
    news:function(){
        return this.query({
            do:'info',
            op:'index',
            type:1
        });
    },
    //咨询秘籍 >技术技巧
    workmanship:function(){
        return this.query({
            do:'info',
            op:'index',
            type:2
        });
    },
    //更多
    more:function(id){
        return this.query({
            do:'info',
            op:'more',
            classify_id:id
        });
    },
    //详情
    details:function(id){
        return this.query({
            do:'info',
            op:'details',
            id:id
        });
    },
    /**
     * 是否显示充值按钮
     * @returns {*|AV.Promise}
     */
    isShowRecharge :function(){
        return this.query({
            do:'open'
        });
    },
    /**
     * 支付接口
     * @returns {*|AV.Promise}
     */
    payPorts :function(id){
        return this.query({
            do:'req',
            package_id:id
        });
    },
    /**
     * 套餐接口
     //  *{*|AV.Promise
     */
    setWays :function(){
        return this.query({
            do:'package',
            op:'index'
        });
    },
    //选择充值方式充值
    choseChargeWay :function(payway,id,token){
        return this.query({
            do:'package',
            op:'recharge',
            pay:payway,
            id:id,
            token:token
        });
    },
    // 微信支付
    weixinpay :function(){
        return this.query({
            do:'pay'
        });
    },
    // 意见反馈提交
    feedback :function(content,from){
        return this.query({
            op:'add',
            do:'addmsg',
            content:content,
            from:from
        });
    },
    // 计划详情搜索
    search :function(plan_id,num,code,rate_high,rate_low,no_num_high,no_num_low,ok_num_high,ok_num_low,current_high,current_low){
        return this.query({
            op:'detail',
            do:'pk10_plan',
            m:'yike_ts_plan',
            plan_id:plan_id,
            num:num,
            code:code,
            rate_high:rate_high,
            rate_low:rate_low,
            no_num_high:no_num_high,
            no_num_low:no_num_low,
            ok_num_high:ok_num_high,
            ok_num_low:ok_num_low,
            current_high:current_high,
            current_low:current_low
        });
    }
};

//var openid = elocalStorage.get('openid') || '';
var yikeTaishan = new yikeTaishan(WX_API_URL, WX_ID);
