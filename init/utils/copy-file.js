import fs from 'node:fs'

export const copyFile = (src, dest) => {
  fs.copyFile(src, dest, error => {
    if (error) {
      console.error(error)
    }
  })
}
