//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    angle: 0,
    userInfo: {}
  },
  getUserInfo: function (e) {
    // 登陆函数
    wx.switchTab({ url: '../index/index' });
    wx.getSetting({
      success: function () {
        wx.login({
          success: function (res) {
            wx.getUserInfo({
              success: function (res_user) {
                wx.request({
                  url: 'https://wangtingting.top:9006/wechat/login',
                  data: {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  },
                  success: function (resInfo) {
                    // 将用户信息设为全局变量
                    app.globalData.resInfo = resInfo
                  },
                  error: function (error) {
                    console.log('error', error)
                  }
                })
              }
            })
          }
        })
      }
    })
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1500);
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) { angle = 14; }
      else if (angle < -14) { angle = -14; }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  }
});