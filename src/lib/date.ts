export const FormatDateMdY = (date: undefined|string) => {
  if (date === undefined) {
    return ''
  }
  const msec = Date.parse(date)
  const d = new Date(msec)
  const m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${m[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
}
