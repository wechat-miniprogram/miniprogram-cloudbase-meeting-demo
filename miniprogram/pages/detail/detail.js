// miniprogram/pages/detail/detail.js
const dayjs = require('dayjs')

const formatDate = (obj) => {
  Object.keys(obj).forEach(k => {
    if (k.endsWith('At')) {
      obj[k] = dayjs(obj[k]).format('MM-DD HH:mm')
    }
    if (Array.isArray(obj[k])) {
      obj[k].forEach(formatDate)
    }
  })
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meeting: null,
    logged: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    this.id = options.id
    const { result } = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'login'
      }
    })
    if (result.error === 0) {
      this.setData({
        logged: true,
      })
    }
    this.loadMeeting()
  },
  bindGetUserInfo: async function(e) {
    this.setData({
      logged: true
    })
    await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'register',
        ...e.detail.userInfo
      }
    })
  },
  loadMeeting: async function () {
    const {
      result
    } = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'getMeeting',
        id: this.id,
      }
    })
    console.log(result)
    formatDate(result)
    this.setData({
      meeting: result,
    })
  },
  joinMeeting: async function () {
    wx.requestSubscribeMessage({
      tmplIds: [''], //TODO FIXME 填入你自己的 TemplateID
      complete: async (res) => {
        const {
          result
        } = await wx.cloud.callFunction({
          name: 'meeting',
          data: {
            action: 'joinMeeting',
            id: this.id,
          }
        })
        wx.showToast({
          title: '报名成功',
          icon: 'success'
        })
        this.loadMeeting()
      }
    })
  },
  quitMeeting: async function () {
    const {
      result
    } = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'quitMeeting',
        id: this.id,
      }
    })
    wx.showToast({
      title: '取消报名成功',
      icon: 'success'
    })
    this.loadMeeting()
  },
  handleBack() {
    if (getCurrentPages().length === 1) {
      wx.redirectTo({
        url: '/pages/index/index',
      })
    } else {
      wx.navigateBack({
        delta: 1,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '我向你分享了一个聚会',
      path: `/pages/detail/detail?id=${this.id}`
    }
  }
})