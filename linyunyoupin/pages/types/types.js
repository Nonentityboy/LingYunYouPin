var GoodList = {};
var GoodList2 = {};
var app = getApp();
var goodlistdata = require('../../dataList/GoodList.js');

function removeEmptyArrayEle(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] === undefined) {
      arr.splice(i, 1);
      i = i - 1; // i - 1 ,因为空元素在数组下标 2 位置，删除空之后，后面的元素要向前补位，
      // 这样才能真正去掉空元素,觉得这句可以删掉的连续为空试试，然后思考其中逻辑
    }
  }
  return arr;
};

Page({
  data: {
    isLoading: true,
    typeData: {},
    goodData: {}
  },
  onLoad() {
    let _this = this;
    wx.request({
      url: 'https://wangtingting.top:9006/buyer/product/list',
      data: {},
      success: function(res) {
        console.log(res.data.data)
        const arr2 = res.data.data
        for (let i = 0; i < arr2.length; i++) {
          if (arr2[i].products.length === 0){
            delete (arr2[i])
          } 
        }
        let arr = removeEmptyArrayEle(arr2)
        GoodList2 = arr
        console.log(GoodList2)
        _this.initData();
      }
    })

    setTimeout(() => {
      _this.setData({
        isLoading: false
      });
    }, 300);
    GoodList = goodlistdata;
    // 初始化scroll-view高度
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
  },
  initData() {
    console.log(GoodList2)
    let orderArr = [];
    let types = [];
    // for (let i in GoodList.type) {
    //   orderArr.push(GoodList.type[i].tid);
    // }
    for (let i in GoodList2) {
      orderArr.push(GoodList2[i].category_id);
    }
    // 拿到最大的ID设为初始化分类
    let orderId = Math.max(...orderArr);
    // this.setData({
    //   current: orderId,
    //   typeData: GoodList.type
    // });
    this.setData({
      current: orderId,
      typeData: GoodList2
    });
    console.log(orderId)
    console.log(GoodList.type)
    console.log(GoodList2)
    // 初始化商品列表
    this.setGoodList(orderId);
  },
  tapTpye(event) {
    this.setData({
      current: event.currentTarget.dataset.current
    });
    console.log(event)
    this.setGoodList(event.currentTarget.dataset.current);
  },
  tapGood(event) {
    console.log(this.data.current)
    console.log(event)
    // let current = this.data.current - 1;
    // // 将点击商品数据存为全局数据
    // app.globalData.gooddata = this.data.typeData[current];
    // console.log(app.globalData.gooddata.products[event.currentTarget.dataset.product_id])
    // wx.navigateTo({
    //   url: '../detail/detail' + event.currentTarget.dataset.product_id
    // });
    let current = this.data.current;
    // 将点击商品数据存为全局数据
    let typeData = this.data.typeData;
    console.log(this.data)
    console.log(event.currentTarget.dataset.product_id)
    console.log(current)
    console.log(this.data.typeData)
    let gooddata;
    for (let j = 0; j < typeData.length; j++) {
      if (typeData[j].category_id === this.data.current) {
        gooddata = typeData[j].products;
      }
    }
    for (let i = 0; i < gooddata.length; i++) {
      if (gooddata[i].product_id === event.currentTarget.dataset.product_id) {
        app.globalData.gooddata = gooddata[i]
      }
    }
    console.log(app.globalData.gooddata)
    wx.navigateTo({
      url: '../detail/detail'
    });
  },

  // 建立商品菜单列表
  setGoodList(typ) {
    // for (let i in GoodList.type) {
    //   if (GoodList.type[i].tid == typ) {
    //     this.setData({
    //       goodData: GoodList.type[i]
    //     });
    //   }
    // }
    for (let i in GoodList2) {
      if (GoodList2[i].category_id === typ) {
        this.setData({
          goodData: GoodList2[i]
        });
      }
    }
  }
})



// wx.request({
//   url: 'https://xcxkj.tech/xcxi/weixin/goods/goodlist',
//   data: {},
//   success: function (res) {
//     setTimeout(() => {
//       _this.setData({
//         isLoading: false
//       });
//     }, 300);
//     GoodList = res.data;
//     _this.initData();
//   }
// })

// 模拟获取数据