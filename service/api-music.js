import jcRequest from './index'

export function getBanners() {
  return jcRequest.get("/banner",{
    type: 2
  })
}

export function getRanking(idx) {
  return jcRequest.get("/top/list",{
    idx
  })
}

export function getSongMenu(cat="全部",limit=6,offset=0){
  return jcRequest.get("/top/playlist",{
    cat,
    limit,
    offset
  })
}

export function getSongMenuDetail(id) {
  return jcRequest.get("/playlist/detail/dynamic",{
    id
  })
}