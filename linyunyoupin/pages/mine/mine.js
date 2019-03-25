var app = getApp();

Page({
  data: {
    userInfo: {},
    cartGoodCount: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      app.globalData.gooddata
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    // 登陆函数
    wx.getSetting({
      success: function() {
        wx.login({
          success: function(res) {
            wx.getUserInfo({
              success: function(res_user) {
                wx.request({
                  url: 'https://wangtingting.top:9006/wechat/login',
                  data: {
                    code: res.code,
                    encryptedData: res_user.encryptedData,
                    iv: res_user.iv
                  },
                  success: function(resInfo) {
                    // 将用户信息设为全局变量
                    app.globalData.userInfo = resInfo
                    console.log(app.globalData.userInfo)
                  },
                  error: function(error) {
                    console.log('error', error)
                  }
                })
              }
            })
          }
        })
      }
    })
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  goOrder(event) {
    if (app.globalData.userInfo) {
      wx.navigateTo({
        url: '../order/order?componentId=' + event.currentTarget.id
      });
    }else{
      wx.showModal({
        content: '请先点击上方登陆按钮', //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#f44', //确定按钮的文字颜色,
      });
    }
  },
  goCart() {
    // 我的购物车
    wx.switchTab({
      url: '../cart/cart',
    })
  },
  // 下面是会员卡等功能
  goUserChange() {
    wx.showModal({
      content: '该功能正在开发中...', //提示的内容,
      showCancel: false, //是否显示取消按钮,
      confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
      confirmColor: '#f44', //确定按钮的文字颜色,
    });
  },
  // goMember() {
  //   // 我的会员卡
  //   wx.navigateTo({
  //     url: '../go/goMember',
  //   })
  // },
  // goReturn() {
  //   console.log(1)
  //   // 我的返现
  //   wx.navigateTo({
  //     url: '../go/goReturn',
  //   })
  // },
  // goPresent() {
  //   // 我的礼品卡
  //   wx.navigateTo({
  //     url: '../go/goPresent',
  //   })
  // },
  // goIntegral() {
  //   // 我的积分
  //   wx.navigateTo({
  //     url: '../go/goIntegral',
  //   })
  // },
  // goPreferential() {
  //   // 我的优惠券
  //   wx.navigateTo({
  //     url: '../go/goPreferential',
  //   })
  // },
  // goCode() {
  //   // 我的优惠码
  //   wx.navigateTo({
  //     url: '../go/goCode',
  //   })
  // },
  // goGift() {
  //   // 我的礼物
  //   wx.navigateTo({
  //     url: '../go/goGift',
  //   })
  // },
  // goDistributor() {
  //   // 分销员中心
  //   wx.navigateTo({
  //     url: '../go/goDistributor',
  //   })
  // },
  // goColumn() {
  //   // 我购买的专栏、内容
  //   wx.navigateTo({
  //     url: '../go/goColumn',
  //   })
  // },
  onShow() {
    this.upDateCount();
  },
  upDateCount() {
    let count = 0;
    app.globalData.selectGoods.forEach((item, index) => {
      count += item.count;
    });
    this.setData({
      cartGoodCount: count
    })
  }
})