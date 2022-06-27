import jcRequest from "./index"

export function getHotSearch() {
  return jcRequest.get("/search/hot")
}

export function getSearchSuggest(keywords) {
  return jcRequest.get("/search/suggest",{
    keywords,
    type: "mobile"
  })
}

export function getResultSongs(keywords) {
  return jcRequest.get("/search",{
    keywords
  })
}