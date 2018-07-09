import { flags } from "@oclif/command"

type FormatterFn<R extends {}> = (data: R) => string

export const formatSingleProject: FormatterFn<{
  [key: string]: string
}> = data =>
  Object.keys(data)
    .filter(key => !["creator"].includes(key))
    .map(key => `${key}: ${data[key]}`)
    .join("\n")

const jsonReporter: FormatterFn<{}> = data => JSON.stringify(data)
const prettyJsonReporter: FormatterFn<{}> = data =>
  JSON.stringify(data, null, 2)

const reporterFlagOpt = flags.string({
  description: "A reporter format",
  options: ["json", "prettyJson", "pretty"],
  default: "pretty",
})

export const format = <R extends {}>(
  data: R,
  type: string,
  prettyFormatter: (data: R) => string,
) => {
  if (type === "json") {
    return jsonReporter(data)
  } else if (type === "prettyJson") {
    return prettyJsonReporter(data)
  } else {
    return prettyFormatter(data)
  }
}

export const reporterFlag = {
  reporter: reporterFlagOpt,
}
