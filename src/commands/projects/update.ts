import { Command, flags } from "@oclif/command"

export default class ProjectsUpdate extends Command {
  static description = "describe the command here"

  static flags = {
    help: flags.help({ char: "h" }),
  }

  static args = [{ name: "file" }]

  async run() {
    const { args, flags } = this.parse(ProjectsUpdate)

    const name = flags.name || "world"
    this.log(
      `hello ${name} from /Users/miro/Documents/develop/ghp/src/commands/projects/update.ts`,
    )
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
