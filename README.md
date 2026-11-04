# cce-scan

Bare branch, unrelated to `master`. Holds a single manually-triggered GitHub
Actions workflow: [`.github/workflows/cce-scan.yml`](.github/workflows/cce-scan.yml).

It resolves the latest [`cce`](https://github.com/appcd-dev/cce) release from
[`stackgenhq/homebrew-stackgen/cce.rb`](https://github.com/stackgenhq/homebrew-stackgen/blob/main/cce.rb),
downloads and checksums the linux amd64 build, then scans three public repos
(one Go, one Python, one Java) known to call cloud SDKs directly:

| Language | Repo |
|----------|------|
| Go | [`eksctl-io/eksctl`](https://github.com/eksctl-io/eksctl) |
| Python | [`prowler-cloud/prowler`](https://github.com/prowler-cloud/prowler) |
| Java | [`awspring/spring-cloud-aws`](https://github.com/awspring/spring-cloud-aws) |

Run it: Actions tab → **CCE scan (internet repos)** → **Run workflow** →
pick this branch (`cce-scan`) as the ref. Optional inputs let you add one more
ad hoc `owner/repo` to the matrix. Each scan's JSON report is attached as a
build artifact; a per-repo summary (files scanned, entitlements by provider)
is written to the run's step summary.

Because this workflow only exists on this branch (not `master`, the repo's
default branch), GitHub's web UI may not list it under the Actions tab until
it has run at least once from here. If `Run workflow` doesn't show it, trigger
it from the CLI instead:

```bash
gh workflow run cce-scan.yml --repo sks/cloud-vis --ref cce-scan
```
