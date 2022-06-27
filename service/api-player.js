import jcRequest from "./index"

export function getSongDetail(ids) {
  return jcRequest.get("/song/detail",{
    ids
  })
}

export function getLyricsString(id) {
  return jcRequest.get("/lyric",{
    id
  })
}