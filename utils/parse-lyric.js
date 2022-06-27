function parseLyric(lyricsString) {
  const timeRegExp = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/
  const lyrics = lyricsString.split("\n")
  const lyricInfos = []
  for(const lyric of lyrics) {
    const regResult = timeRegExp.exec(lyric)
    if(!regResult) continue
    const minute = regResult[1] * 60 * 1000
    const second = regResult[2] * 1000
    const millSecond = regResult[3].length === 2 ? regResult[3] * 10 : regResult[3] * 1
    const time = minute + second + millSecond
    const text = lyric.replace(timeRegExp,"")
    lyricInfos.push({time,text})
  }
  lyricInfos.push({time: 888888888,text: ""})
  return lyricInfos
}

export {
  parseLyric
}