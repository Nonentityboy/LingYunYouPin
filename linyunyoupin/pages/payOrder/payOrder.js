var app = getApp()

Page({
  data: {
    totalScoreToPay: 0,
    selectGoods: [],
    address: [],
    curAddressData: false,
    goodsList: [],
    isNeedLogistics: 1, // 是否需要物流信息
    allGoodsPrice: 0,
    yunPrice: 0,
    allGoodsAndYunPrice: 0,
    goodsJsonStr: "",
    orderType: "", //订单类型，购物车下单或立即支付下单，默认是购物车，
    pingtuanOpenId: undefined, //拼团的话记录团号
    hasNoCoupons: true,
    coupons: [],
    youhuijine: 0, //优惠券金额
    curCoupon: null // 当前选择使用的优惠券
  },
  onLoad: function(e) {
    console.log(app.globalData.userInfo)
    // var openid = 'oU4-G5NeZc3nAruhWa3Zh7O_3BEs';
    // wx.request({
    //   url: 'https://wangtingting.top:9006/user/info/search?openId=' + openid, //开发者服务器接口地址",
    //   method: 'GET',
    //   success: res => {
    //     console.log(res)
    //   },
    // });

    let that = this;
    let _data = {
      isNeedLogistics: 1,
    }
    if (e.pingtuanOpenId) {
      _data.pingtuanOpenId = e.pingtuanOpenId
    }
    this.setData(_data);
    console.log(app.globalData.selectGoods)
    that.setData({
      selectGoods: app.globalData.selectGoods,
    })
    let totalPrice = 0;
    let checkboxItems = app.globalData.selectGoods;
    let arr = [];
    checkboxItems.forEach((i) => {
      totalPrice += parseFloat(i.currentPrice) * i.count;
      this.setData({
        total: totalPrice.toFixed(2)
      });
      arr.push(i)
      console.log(totalPrice)
    });
  },
  onShow: function() {
    console.log(app.globalData.address)
    if (app.globalData.address !== undefined) {
      this.setData({
        curAddressData: true,
        address: app.globalData.address
      })
      console.log(this.data.address)
    }

    var that = this;
    var shopList = [];
    //立即购买下单
    if ("buyNow" == that.data.orderType) {
      var buyNowInfoMem = wx.getStorageSync('buyNowInfo');
      that.data.kjId = buyNowInfoMem.kjId;
      if (buyNowInfoMem && buyNowInfoMem.shopList) {
        shopList = buyNowInfoMem.shopList
      }
    } else {
      //购物车下单
      var shopCarInfoMem = wx.getStorageSync('shopCarInfo');
      that.data.kjId = shopCarInfoMem.kjId;
      if (shopCarInfoMem && shopCarInfoMem.shopList) {
        // shopList = shopCarInfoMem.shopList
        shopList = shopCarInfoMem.shopList.filter(entity => {
          return entity.active;
        });
      }
    }
    that.setData({
      goodsList: shopList,
    });
    that.initShippingAddress();
  },



  getDistrictId: function(obj, aaa) {
    if (!obj) {
      return "";
    }
    if (!aaa) {
      return "";
    }
    return aaa;
  },

  createOrder: function(e) {},
  initShippingAddress: function() {},
  processYunfei: function() {},
  addAddress: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  selectAddress: function() {
    wx.navigateTo({
      url: "/pages/address-add/index"
    })
  },
  getMyCoupons: function() {
    var that = this;
    WXAPI.myCoupons({
      token: wx.getStorageSync('token'),
      status: 0
    }).then(function(res) {
      if (res.code == 0) {
        var coupons = res.data.filter(entity => {
          return entity.moneyHreshold <= that.data.allGoodsAndYunPrice;
        });
        if (coupons.length > 0) {
          that.setData({
            hasNoCoupons: false,
            coupons: coupons
          });
        }
      }
    })
  },
  bindChangeCoupon: function(e) {
    const selIndex = e.detail.value[0] - 1;
    if (selIndex == -1) {
      this.setData({
        youhuijine: 0,
        curCoupon: null
      });
      return;
    }
    //console.log("selIndex:" + selIndex);
    this.setData({
      youhuijine: this.data.coupons[selIndex].money,
      curCoupon: this.data.coupons[selIndex]
    });
  },
  pay: function() {
    console.log(app.globalData.userInfo.data.data[0].user_openid)
    let openid = app.globalData.userInfo.data.data[0].user_openid;
    let orderId = Math.random().toString(36).substr(2);
    console.log(this.data.total)
    let total = this.data.total;
    if (this.data.curAddressData === true) {
      var ordercode = this.data.txtOrderCode;
      // wx.request({
      //   url: "https://wangtingting.top:9006/buyer/createOrder",
      //   data: {
      //     userName: app.globalData.address.userName,
      //     userAddress: app.globalData.address.userAddress,
      //     userPhone: app.globalData.address.userPhone,
      //     userOpenid: app.globalData.address.openId,
      //     deliveryTime: 1533340109205,
      //     items: [{
      //       "productId": "1",
      //       "productQuantity": 3
      //     }, {
      //       "productId": "15334397164282686",
      //       "productQuantity": 1
      //     }]
      //   },
      //   method: 'POST',
      //   success: function(res) {
      wx.login({
        success: function(res) {
          if (res.code) {
            wx.request({
              url: 'https://wangtingting.top:9006/buyer/orderPay',
              data: {
                total_fee: total,
                userOpenid: openid,
                detail: 123123231,
                orderId: orderId
              },
              method: 'POST',
              success: function(res) {
                console.log(res.data)
                wx.requestPayment({
                  total_fee: total,
                  timeStamp: res.data.timeStamp,
                  nonceStr: res.data.nonceStr,
                  package: 'prepay_id=' + res.data.package,
                  signType: 'MD5',
                  paySign: res.data.paySign,
                  success: function(res) {
                    // success
                    console.log(res);
                  },
                  fail: function(res) {
                    // fail
                    console.log(res);
                  },
                  complete: function(res) {
                    // complete
                    console.log(res);
                  }
                })
              }
            })
          } else {
            console.log('获取用户登录态失败！' + res.errMsg)
          }
        }
      })

    } else {
      wx.showModal({
        content: '请填写您的地址信息', //提示的内容,
        showCancel: false, //是否显示取消按钮,
        confirmText: '确定', //确定按钮的文字，默认为取消，最多 4 个字符,
        confirmColor: '#f44', //确定按钮的文字颜色,
      });
    }
  }
})