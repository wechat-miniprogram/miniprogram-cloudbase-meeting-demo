# miniprogram-cloudbase-meeting-demo

云开发直播运营活动 demo 云聚会助手

# 快速开始

申请 AppID，然后点击详情修改为申请的 AppID。(或修改 project.config.json) 中的 APPID 部分

```json
{
    "appid": "", // 修改为你的 APPID
}
```

后续涉及到订阅消息的部分，也需要修改对应的订阅消息 ID。(cloudfunctions/meeting/index.js 和 miniprogram/pages/detail/detail.js)

```js
wx.requestSubscribeMessage({
  tmplIds: [''], //TODO FIXME 填入你自己的 TemplateID
  // ...
})
```

第一次使用需要构建 NPM（工具-构建 npm）

开通云开发，点击云开发 Tab，并申请一个环境。

选择云环境，右键点击 cloudfunction 文件夹，选择新建的环境。

上传云函数，右键点击 meeting 函数，点击「上传并部署（所有文件）」。

后续就可以进行实战开发的部分了，修改 meeting 函数中的两个 implement me 来完成吧。

# License

MIT
