import { expect, test } from "@oclif/test"

describe("projects", () => {
  let projectIDs: number[] = []
  test
    .stdout()
    .command([
      "projects:create",
      "mironal/ghp-test",
      "--name=(੭•̀ᴗ•̀)",
      "--body=φ(•ᴗ•๑)",
    ])
    .it("runs create", ctx => {
      expect(ctx.stdout).to.contain("name: (੭•̀ᴗ•̀)")
      expect(ctx.stdout).to.contain("body: φ(•ᴗ•๑)")
    })
  test
    .stdout()
    .command(["projects:list", "mironal/ghp-test", "--reporter=json"])
    .it("runs list", ctx => {
      const list = JSON.parse(ctx.stdout) as any[]
      expect(list).to.be.an.instanceof(Array)
      const ids = list.map(p => p.id) as number[]
      expect(ids).to.satisfies((i: any) => typeof i === "number")
      projectIDs = ids
    })
})
