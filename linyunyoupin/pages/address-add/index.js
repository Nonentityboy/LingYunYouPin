
//获取应用实例
var app = getApp()
Page({
  data: {
    provinces: [],
    citys: [],
    districts: [],
    selProvince: '请选择',
    selCity: '请选择',
    selDistrict: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selDistrictIndex: 0
  },
  onLoad: function () {
    console.log(11)

  },
  bindCancel: function () {
    wx.navigateBack({})
  },
  bindSave: function (e) {
    console.log(e)
    console.log()
    var that = this;
    var linkMan = e.detail.value.linkMan;
    var address = e.detail.value.address;
    var mobile = e.detail.value.mobile;
    var code = e.detail.value.code;
    var openid = 'oU4-G5NeZc3nAruhWa3Zh7O_3BEs';
    if (linkMan == "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (mobile == "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }
    if (address == "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }
    if (code == "") {
      wx.showModal({
        title: '提示',
        content: '请填写邮编',
        showCancel: false
      })
      return
    }
    if (linkMan !== '' && mobile !== '' && address !== '' && code !== '') {
      app.globalData.address = {
        openId: openid,
        userName: linkMan,
        userAddress: address,
        userPhone: mobile,
        userGender: code,
      }
      console.log(app.globalData.address)
      wx.request({
        url: 'https://wangtingting.top:9006/user/info/modify', //开发者服务器接口地址",
        data: {
          openId: openid,
          userName: linkMan,
          userAddress: address,
          userPhone: mobile,
          userGender: code,
        }, //请求的参数",
        method: 'POST',
        dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res)
          if (res.data.msg === 'success') {

            wx.navigateBack({
            });
          }
        },
      });
    }
  },

  selectCity: function () {

  },
  deleteAddress: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          WXAPI.deleteAddress(id, wx.getStorageSync('token')).then(function () {
            wx.navigateBack({})
          })
        } else {
          console.log('用户点击取消')
        }
      }
    })
  },
})
