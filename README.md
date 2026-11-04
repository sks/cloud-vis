# cce-scan

Default branch. Holds a single GitHub Actions workflow:
[`.github/workflows/cce-scan.yml`](.github/workflows/cce-scan.yml).

It resolves the latest [`cce`](https://github.com/appcd-dev/cce) release from
[`stackgenhq/homebrew-stackgen/cce.rb`](https://github.com/stackgenhq/homebrew-stackgen/blob/main/cce.rb),
downloads and checksums the linux amd64 build, then scans public repos with
`cce --diagnostics`, so cce reports any method call signature it can't map to
Stackgen's catalog back to the ingest endpoint.

Two ways repos get picked:

- **Daily at 06:00 UTC** (`schedule`): picks 2 random repos each for Go, Python,
  and Java from GitHub search (stars 100-3000, forks 20-2000, size under 200MB,
  not archived). A different random page is sampled each run, so the set of
  repos varies day to day. The point of randomizing is coverage: varied repos
  hit varied, real-world call patterns, which surfaces more distinct catalog
  gaps than scanning the same few repos every time.
- **Manual** (`workflow_dispatch`): scans three fixed repos by default (one per
  language, all known AWS SDK consumers), so a run is reproducible when you're
  checking a specific mapping change. Set `random_repos: true` to exercise the
  same random path on demand instead.

| Language | Default manual-run repo |
|----------|------|
| Go | [`eksctl-io/eksctl`](https://github.com/eksctl-io/eksctl) |
| Python | [`prowler-cloud/prowler`](https://github.com/prowler-cloud/prowler) |
| Java | [`awspring/spring-cloud-aws`](https://github.com/awspring/spring-cloud-aws) |

Run it from the Actions tab: **CCE scan (internet repos)** → **Run workflow**.
`cce-scan` is the default branch, so GitHub lists the workflow there. Inputs let
you switch to random repos, change the per-language random count, or add one
more ad hoc `owner/repo` to the matrix either way. Each scan's JSON report is
attached as a build artifact. A per-repo summary (files scanned, entitlements by
provider) is written to the run's step summary.

```bash
gh workflow run cce-scan.yml --repo sks/cloud-vis
gh workflow run cce-scan.yml --repo sks/cloud-vis -f random_repos=true -f random_repo_count=3
```

## Diagnostics caveat

`cce`'s `-diagnostics` posts are fire-and-forget: each unmapped call signature
spawns a background goroutine with its own 5-second timeout, and `cce` does not
wait for those goroutines before exiting. On a scan that finishes in a second
or two, the process can exit before a POST completes, so a report can be
silently dropped even with `-diagnostics` on. `-log-level debug` surfaces a
failed post, but a successful one isn't logged either way, so the workflow logs
can't fully confirm whether reports landed. This is a gap in `cce` itself, not
something this workflow can work around.
