export function queryRect(selector) {
  return new Promise((reslove,reject) => {
    const query = wx.createSelectorQuery()
    query.select(selector).boundingClientRect()
    query.exec(reslove)
  })
}