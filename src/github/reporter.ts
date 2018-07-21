import { flags } from "@oclif/command"
import { ResolveableCard } from "../type"

type FormatterFn<R extends {}> = (data: R) => string

export const formatSingleColumn: FormatterFn<{
  id: number
  name: string
}> = data => `${data.id}: ${data.name}`

export const formatSingleProject: FormatterFn<{
  [key: string]: string
}> = data =>
  Object.keys(data)
    .filter(key => !["creator"].includes(key))
    .map(key => `${key}: ${data[key]}`)
    .join("\n")

export const formatSingleCard: FormatterFn<ResolveableCard> = data => {
  if (data.note) {
    return `${data.id}: ${data.note}`
  } else if (data.content_url) {
    if (data.issue) {
      return `${data.id}: ${data.issue.title} #${
        data.issue.number
      } ${data.issue.assignees.map(a => `@${a.login}`).join(" ")}`
    }
    return `${data.id}: ${data.content_url}`
  }
  return `${data.id}: Invalid response`
}

const jsonReporter: FormatterFn<{}> = data => JSON.stringify(data)
const prettyJsonReporter: FormatterFn<{}> = data =>
  // tslint:disable-next-line:no-null-keyword
  JSON.stringify(data, null, 2)

const reporterFlagOpt = flags.string({
  description: "A reporter format",
  options: ["json", "prettyJson", "pretty"],
  default: "pretty",
})

export const format = <R extends {}>(
  data: R,
  type: string,
  prettyFormatter: ((data: R) => string) | string,
) => {
  if (type === "json") {
    return jsonReporter(data)
  } else if (type === "prettyJson") {
    return prettyJsonReporter(data)
  } else {
    if (typeof prettyFormatter === "function") {
      return prettyFormatter(data)
    }
    return prettyFormatter
  }
}

export const reporterFlag = {
  reporter: reporterFlagOpt,
}
