var app = getApp();

Page({
  data: {
    inputShowed: false,
    inputVal: "",
    Rotation: [{
      img: "/images/1.png"
    },
    {
      img: "/images/2.png"
    },
    {
      img: "/images/3.png"
    }
    ],
    example: [{
      img: "/images/example1.png"
    },
    {
      img: "/images/example2.png"
    },
    {
      img: "/images/example3.png"
    },
    {
      img: "/images/example4.png"
    },
    ]
  },
  onLoad: function () {
    console.log(this.data.Rotation)
    var _this = this;
    wx.request({
      url: 'https://wangtingting.top:9006/buyer/product/list',
      method: 'GET',
      success: function (res) {
        // console.log(res.data.data[1].products[0])
        app.globalData.gooddata = res.data.data[1].products[0]
        _this.setData({
          gooddata: res.data.data[1].products[0]
        })
      }
    })
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    var _this = this;
    if (e.detail.value !== '') {
      wx.request({
        url: 'https://wangtingting.top:9006/buyer/product/key?key=' + e.detail.value,
        method: 'GET',
        success: function (res) {
          // inputVal: res.data.data
          _this.setData({
            inputVals: res.data.data
          })
        }
      })
    }
    this.setData({
      inputVal: e.detail.value
    })
  },
  bindSwiper: function (e) {
    console.log(e)
    wx.navigateTo({
      url: '../detail/detail'
    });
  }
});