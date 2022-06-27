import jcRequest from "./index"

export function getTopMVs(offset,limit = 10) {
  return jcRequest.get('/top/mv',{
    offset,
    limit
  })
}

export function getMVURL(id) {
  return jcRequest.get("/mv/url",{
    id
  })
}

export function getMVDetail(id) {
  return jcRequest.get("/mv/detail",{
    mvid: id
  })
}

export function getRelatedVideos(id) {
  return jcRequest.get("/related/allvideo",{
    id
  })
}