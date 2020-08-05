// miniprogram/pages/detail/detail.js
const dayjs = require('dayjs')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tab: 'create',
    logged: false,
    meetings: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    await wx.cloud.callFunction({
      name: 'helloworld',
      data: {
        action: 'getMeeting'
      }
    })

    // LOGIN
    const { result } = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'login'
      }
    })
    if (result.error === 0) {
      this.getMeetings()
    }
  },
  getMeetings: async function() {
    const { result } = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'getMeetings',
        mode: this.data.tab
      }
    })
    this.setData({
      meetings: result.list.map(meeting => ({
        ...meeting,
        createdDisplay: dayjs(meeting.createdAt).format('MM-DD HH:mm')
      })),
      logged: true,
    })
  },

  switchTab: function(e) {
    this.setData({
      tab: e.currentTarget.dataset.tab
    })
    this.getMeetings()
  },
  bindGetUserInfo: function(e) {
    this.setData({
      logged: true
    })
    wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'register',
        ...e.detail.userInfo
      }
    })
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
  onShareAppMessage: function () {

  }
})