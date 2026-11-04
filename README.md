# cce-scan

Default branch. Holds a single GitHub Actions workflow:
[`.github/workflows/cce-scan.yml`](.github/workflows/cce-scan.yml).

It resolves the latest [`cce`](https://github.com/appcd-dev/cce) release from
[`stackgenhq/homebrew-stackgen/cce.rb`](https://github.com/stackgenhq/homebrew-stackgen/blob/main/cce.rb),
downloads and checksums the linux amd64 build, then scans public repos.
`CCE_DIAGNOSTICS` is on. `cce` v0.0.11 batches distinct cloud API operations
into a few posts per scan and leaves builtins, the standard library, and local
helpers out.

Two ways repos get picked:

- **Hourly** (`schedule`): picks `random_repo_count` (default 2) repos each for
  Go, Python, and Java using GitHub *code* search for an exact cloud-SDK import
  marker (`github.com/aws/aws-sdk-go`, `import boto3`, `com.amazonaws`), not
  plain repository search. Plain repository search (stars/forks/size) picks
  popular repos regardless of what they do; an earlier run using that approach
  scanned 6 random repos and got 0 entitlements on all 6, because none of them
  happened to call a cloud SDK. Code search only returns repos that contain the
  marker, so a `-filter cloud` scan has something to find.
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

## Diagnostics

`CCE_DIAGNOSTICS` is on. Releases before v0.0.11 posted one HTTP request per
unmapped call, from its own goroutine, with no dedup and no cap. One run
against `eksctl`, `prowler`, and `spring-cloud-aws` fired **282,761** of those
from a single runner:

| Failure | Count |
|---|---|
| `connect: connection refused` (never left the runner) | 246,624 |
| `unexpected status 500` from the ingest Lambda | ~27,800 |
| `i/o timeout` | 6,226 |
| `context deadline exceeded` | 1,976 |

CloudWatch confirmed both halves of that: the ingest Lambda's
`ConcurrentExecutions` hit the account's default ceiling of 1000 and recorded
170 throttles, but it only saw ~32,000 invocations total out of 282,761
attempts, so most posts died on the runner itself before reaching AWS. Of the
~32,000 that did arrive, most of the 500s trace back to every post targeting
the same S3 key (`cce/YYYYMMDD.ndjson`); the ingest Lambda appends with
`GetObject` + `PutObject --if-match`, so thousands of concurrent executions
racing the same key's ETag blow through its 64-attempt retry budget.

v0.0.11 collects distinct cloud API operations and posts them in batches of
at most 500 after the scan. That is what this workflow runs.
