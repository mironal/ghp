import fs from "fs"
import { promisify } from "util"
import { mkdir } from "shelljs"
import path from "path"
import os from "os"

const envSuffix = process.env.GHP_CONFIG_SUFFIX
  ? `_${process.env.GHP_CONFIG_SUFFIX}`
  : ""

export const authTokenFilepath = path.join(
  os.homedir(),
  ".config",
  `/ghp${envSuffix}/`,
  "auth",
)

export const readAuthTokenSync = (): string | undefined => {
  if (fs.existsSync(authTokenFilepath)) {
    return fs.readFileSync(authTokenFilepath, { encoding: "utf8" }).trim()
  }
  return undefined
}

export const writeAuthToken = (token: string): Promise<void> =>
  Promise.resolve(mkdir("-p", path.dirname(authTokenFilepath))).then(() =>
    promisify(fs.writeFile)(authTokenFilepath, token, { encoding: "utf8" }),
  )
