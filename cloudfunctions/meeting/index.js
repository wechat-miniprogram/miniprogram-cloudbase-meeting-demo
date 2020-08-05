// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  // 简单的路由
  if (event.action && meetingHelper[event.action]) {
    const result = await meetingHelper[event.action](wxContext, event)
    return result
  }
  return {
    message: 'hello there! you need to provide a valid action to use meeting helper.',
    error: -1,
  }
}

const db = cloud.database()
const _ = db.command
// 聚会助手 函数列表
const meetingHelper = {
  async createMeeting(context, params) {
    // implement me
    const doc = await db.collection('meetings').add({
      data: {
        title: params.title,
        content: params.content,
        date: params.date,
        time: params.time,
        limit: params.limit,
        joiner: [],
        images: params.images,
        createdAt: Date.now(),
        updateAt: Date.now(),
        createdBy: context.OPENID,
      }
    })

    return {
      doc
    }
  },
  async joinMeeting(context, params) {
    // implement me
    const meet = await db.collection('meetings').where({
      _id: params.id
    }).get()
    const [meeting] = meet.data
    const userdoc = await db.collection('users').where({
      openid: context.OPENID
    }).get()
    const [user] = userdoc.data
    meeting.joiner.push({
      ...user,
      joinedAt: Date.now()
    })
    delete meeting._id
    try {
      const result = await cloud.openapi.subscribeMessage.send({
        touser: context.OPENID, // 通过 getWXContext 获取 OPENID
        data: {
          thing1: {
            value: meeting.title
          },
          thing2: {
            value: meeting.content
          },
          date3: {
            value: `${meeting.date} ${meeting.time}`
          },
          thing4: {
            value: '请准时参加哦'
          }
        },
        templateId: '',//TODO FIXME 填入你自己的 TemplateID
        page: 'index'
      })
      console.log(result)
    } catch (error) {
      console.log(error)
    }
    await db.collection('meetings').where({
      _id: params.id
    }).update({
      data: meeting
    })
    return {}
  },

  // 后续函数逻辑较简单，在此不做过多展示
  // ------------------------------
  async getMeeting(context, params) {
    const {
      id
    } = params
    if (!id) return {
      error: 1,
    }
    const doc = await db.collection('meetings').aggregate()
      .lookup({
        from: 'users',
        localField: 'createdBy',
        foreignField: 'openid',
        as: 'creator',
      }).match({
        _id: id,
      })
      .end()
    const [meeting] = doc.list
    if (meeting.joiner.some(u => u.openid === context.OPENID)) {
      meeting.joined = true
    } else meeting.joined = false
    return meeting
  },
  async getMeetings(context, params) {
    let doc
    switch (params.mode) {
      case 'create':
        doc = await db.collection('meetings').aggregate()
          .lookup({
            from: 'users',
            localField: 'createdBy',
            foreignField: 'openid',
            as: 'creator',
          }).match({
            createdBy: context.OPENID
          })
          .end()
        return doc
      case 'join':
        doc = await db.collection('meetings').aggregate()
          .lookup({
            from: 'users',
            localField: 'createdBy',
            foreignField: 'openid',
            as: 'creator',
          })
          .match({
            joiner: _.elemMatch({
              openid: context.OPENID,
            })
          })
          .end()
        return doc
      default:
        break
    }
  },
  async quitMeeting(context, params) {
    const {
      id
    } = params
    const userInfo = await db.collection('users').where({
      openid: context.OPENID
    }).get()
    const [user] = userInfo.data
    const doc = await db.collection('meetings').where({
      _id: id
    }).update({
      data: {
        joiner: _.pull({
          openid: context.OPENID,
          ...user
        }),
        updatedAt: Date.now(),
      }
    })
    return doc
  },
  async login(context) {
    const doc = await db.collection('users').where({
      openid: context.OPENID,
    }).get()
    if (doc.data.length !== 0) {
      return {
        error: 0,
        message: 'ok',
        doc,
      }
    } else {
      return {
        error: 1,
        message: 'not registered'
      }
    }
  },
  async register(context, params) {
    const openid = context.OPENID
    const {
      avatarUrl,
      nickName
    } = params
    await db.collection('users').add({
      data: {
        openid,
        avatarUrl,
        nickName,
        createAt: Date.now(),
        updatedAt: Date.now(),
      }
    })
    return {
      error: 0,
      msg: 'register successfully',
    }
  }
}