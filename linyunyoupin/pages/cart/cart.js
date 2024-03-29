var app = getApp();
var Zan = require('../../dist/index');
// var goodlistdata = require('../../dataList/GoodList.js');
// var GoodList = {};

Page(Object.assign({}, Zan.Quantity, Zan.Toast, {
  data: {
    empty: true,
    isLoading: true,
    checkboxItems: [],
    checkAll: true,
    isEdit: false,
    total: '0.00',
    unable: ''
  },
  onShow: function() {
    let _this = this;
    let selectGoods = app.globalData.selectGoods;
    if (selectGoods.length === 0) {
      _this.setData({
        empty: true
      });
    }
    console.log(app.globalData.selectGoods)
    // 展示页面信息
    this.upDateList();
  },
  upDateList() {
    // 更新购物车列表
    let _this = this;
    let selectGoods = app.globalData.selectGoods;
    // 将选中数据遍历在购物车列表
    let goodArr = [];
    // 从globalData中获得选中的商品在购物车展示出来
    console.log(selectGoods)
    // 判断购物车为空
    if (selectGoods.length !== 0) {
      _this.setData({
        empty: false
      });
    }
    if (selectGoods.length === 0) {
      _this.setData({
        empty: true
      });
    }
    setTimeout(() => {
      selectGoods.forEach((k, index) => {
        let goodItem = {
          gid: k.product_id,
          pic: k.smpic,
          name: k.goodName,
          kindName: k.kindName,
          price: k.currentPrice,
          checked: true,
          count: k.count,
          quantity: {
            quantity: k.count,
            min: 1,
            max: k.total
          }
        }
        goodArr.push(goodItem);
      });
      console.log(goodArr)
      _this.setData({
        checkboxItems: goodArr,
        isLoading: false
      });
      _this.upDateTotal();
    }, 300);
  },
  // checkboxChange: function(e) {
  //   // 子项影响全选
  //   let allItems = this.data.checkboxItems.length;
  //   // 判断全选的情况
  //   if (e.detail.value.length == allItems) {
  //     this.setData({
  //       checkAll: true
  //     });
  //   } else {
  //     this.setData({
  //       checkAll: false,
  //     });
  //   }
  //   // 处理选择一项
  //   // 系统会自动识别选中项的携带值，用e.detail.value获得
  //   var checkboxItems = this.data.checkboxItems,
  //     values = e.detail.value;
  //   for (var i = 0, lenI = checkboxItems.length; i < lenI; i++) {
  //     checkboxItems[i].checked = false; // 先清空所有选中
  //     for (var j = 0, lenJ = values.length; j < lenJ; j++) {
  //       if (checkboxItems[i].value === values[j]) { // 通过values来匹配选中项
  //         checkboxItems[i].checked = true;
  //         break;
  //       }
  //     }
  //   }
  //   this.setData({
  //     checkboxItems: checkboxItems
  //   });
  //   // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  //   this.upDateTotal()
  // },
  // checkAll(e) {
  //   // 处理全选按钮
  //   let checkboxItems = this.data.checkboxItems;
  //   if (e.detail.value == 'checkAll') {
  //     for (let i in checkboxItems) {
  //       checkboxItems[i].checked = true;
  //       this.setData({
  //         checkboxItems: checkboxItems
  //       });
  //     }
  //   } else {
  //     for (let i in checkboxItems) {
  //       checkboxItems[i].checked = false;
  //       this.setData({
  //         checkboxItems: checkboxItems
  //       });
  //     }
  //   }
  //   let checkAll = this.data.checkAll;
  //   this.setData({
  //     checkAll: !checkAll
  //   });
  //   // console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  //   this.upDateTotal();
  // },
  goIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  },
  toggleEdit() {
    let isEdit = this.data.isEdit;
    this.setData({
      isEdit: !isEdit
    });
  },
  handleZanQuantityChange(e) {
    let componentId = e.componentId;
    let quantity = e.quantity;
    let checkboxItems = this.data.checkboxItems;
    let selectGoods = app.globalData.selectGoods;
    this.setData({
      [`${componentId}.quantity`]: quantity
    });
    checkboxItems.forEach((i, j) => {
      if (j == componentId.replace(/[^0-9]/ig, "")) {
        i.count = quantity;
        selectGoods.forEach((k, o) => {
          if (o == componentId.replace(/[^0-9]/ig, "")) {
            app.globalData.selectGoods[o] = i;
          }
        })
      }
    });
    this.setData({
      checkboxItems: checkboxItems
    });
    this.upDateTotal();
  },

  upDateTotal() { // 更新总价
    let totalPrice = 0;
    let checkboxItems = this.data.checkboxItems;
    let allItems = this.data.checkboxItems.length;
    let arr = [];
    checkboxItems.forEach((i) => {
      if (i.checked == true) {
        totalPrice += parseFloat(i.price) * i.count;
        this.setData({
          total: totalPrice.toFixed(2)
        });
        arr.push(i)
      }
    });
    if (arr.length === 0) { // 如果全不选总价为0
      this.setData({
        total: 0
      });
    }
  },
  delGood(e) { // 删除商品
    var _this = this;
    wx.showToast({
      title: '删除中',
      icon: 'loading',
      duration: 500
    });
    console.log(e)
    let delGid = e.currentTarget.dataset.gid;
    let selectGoods = app.globalData.selectGoods;
    let arr = [];
    selectGoods.forEach((i) => {
      console.log(delGid)
      if (delGid !== i.product_id) {
        arr.push(i);
      }
    })
    console.log(arr)
    app.globalData.selectGoods = arr;
    if (arr.length === 0) {
      this.data.empty = true
    }
    console.log(this.data.empty)
    _this.upDateList();
  },
  goConfirm() { // 点击结算按钮
    wx.navigateTo({
      url: '../payOrder/payOrder'
    })
    // let _this = this;
    // let account = [];
    // let checkboxItems = this.data.checkboxItems;
    // checkboxItems.forEach((item, index) => {
    //   if (item.checked) {
    //     account.push(checkboxItems[index]);
    //   }
    // });
    // if (account.length > 0) {
    //   console.log('结算：');
    //   console.log(account);
    //   wx.request({
    //     url: 'https://wangtingting.top:9006/buyer/orderPay',
    //     method: "POST",
    //     data: {
    //       userOpenid: "oE3wM5PpfWIFztvhAjLLHOr_RO8A",
    //       orderId: '111',
    //     },
    //     success: function(res) {
    //       console.log(res)
    //     }
    //   })
    // } else {
    //   this.showZanToast('未选择商品！');
    // }
  },
  getUserInfo: function (e) {
    // 登陆函数
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
                    app.globalData.userInfo = resInfo
                    console.log(app.globalData.userInfo)
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
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  goIndex() {
    wx.switchTab({
      url: '../index/index'
    });
  }
}));