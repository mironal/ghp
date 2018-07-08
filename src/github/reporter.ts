import { flags } from "@oclif/command"

type ReporterFn = (data: object) => string

const jsonReporter: ReporterFn = data => JSON.stringify(data)
const prettyJsonReporter: ReporterFn = data => JSON.stringify(data, null, 2)

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
