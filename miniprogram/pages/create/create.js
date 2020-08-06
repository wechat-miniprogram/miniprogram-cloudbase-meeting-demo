// miniprogram/pages/create/create.js
const dayjs = require('dayjs')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    content: '',
    date: dayjs().format('YYYY-MM-DD'),
    time: dayjs().format('HH:mm'),
    files: [],
    fileIds: [],
    limit: 10,
  },

  nameInput(e) {
    this.setData({
      name: e.detail.value
    })
  },

  limitInput(e) {
    this.setData({
      limit: e.detail.value
    })
  },
  dateInput(e) {
    this.setData({
      date: e.detail.value
    })
  },
  timeInput(e) {
    this.setData({
      time: e.detail.value
    })
  },
  contentInput(e) {
    this.setData({
      content: e.detail.value
    })
  },

  // upload 相关
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },
  async uploadFile(params) {
    const files = params.tempFiles
    // implement me: upload file
    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      const filePath = file.path
      const tok = filePath.split('.')
      const cloudPath = Date.now().toString() + '.' + tok[tok.length - 1]
      const res = await wx.cloud.uploadFile({
        filePath,
        cloudPath
      })
      this.setData({
        fileIds: [...this.data.fileIds, res.fileID]
      })
    }
    // implement me end
    return {
      urls: files.map(d => d.path)
    }
  },

  async createMeet() {
    wx.showLoading({
      title: '正在创建...',
    })
    const res = await wx.cloud.callFunction({
      name: 'meeting',
      data: {
        action: 'createMeeting',
        title: this.data.name,
        content: this.data.content,
        images: this.data.fileIds,
        date: this.data.date,
        time: this.data.time,
        limit: this.data.limit
      }
    })
    console.log(res)
    wx.hideLoading()
    wx.redirectTo({
      url: `/pages/detail/detail?id=${res.result.doc._id}`,
    })
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    console.log('upload success', e.detail)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uploadFile: this.uploadFile.bind(this),
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