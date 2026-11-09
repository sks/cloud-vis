# cce-scan

Default branch. Holds a single GitHub Actions workflow:
[`.github/workflows/cce-scan.yml`](.github/workflows/cce-scan.yml).

This repo is a **fuzz harness**: it clones random public cloud-SDK repos and
scans them with [`stackgenhq/cce-action`](https://github.com/stackgenhq/cce-action)
(`diagnostics: true`) so unmapped signatures feed catalog-gap ingest. The
action installs `cce`, scans the clone, and exports AWS/GCP/Azure policies plus
E-SBOM. Everyday product CI should call the action directly on its own checkout
instead (diagnostics off by default).

Two ways repos get picked:

- **Every 10 minutes** (`schedule`, `*/10 * * * *` UTC): picks `random_repo_count` (default 2) repos each for
  Go, Python, and Java using GitHub *code* search for a cloud-SDK import
  marker. Each language randomly selects one of an AWS, GCP, or Azure marker
  (`github.com/aws/aws-sdk-go` / `cloud.google.com/go` /
  `github.com/Azure/azure-sdk-for-go`, and the Python/Java equivalents), not
  plain repository search. Plain repository search (stars/forks/size) picks
  popular repos regardless of what they do; an earlier run using that approach
  scanned 6 random repos and got 0 entitlements on all 6, because none of them
  happened to call a cloud SDK. Code search only returns repos that contain the
  marker, so a `-filter cloud` scan has something to find. Those searches use
  the `CODE_SEARCH_TOKEN` repository secret, not the Actions `GITHUB_TOKEN`.
  The Actions token is what produced the long 429s (one response asked for a
  728 second wait). The secret is sent only on `search/code`. Reading the
  scanned-repo list and pushing updates still use the Actions token. A
  fine-grained token that can read public repositories is enough:

  ```bash
  gh secret set CODE_SEARCH_TOKEN --repo sks/cloud-vis
  ```
- **Manual** (`workflow_dispatch`): scans three fixed repos by default (one per
  language; prowler exercises AWS/GCP/Azure checks), so a run is reproducible
  when you're checking a specific mapping change. Set `random_repos: true` to
  exercise the same random path on demand instead.

Repos that have already been selected are kept in
[`scanned.txt`](https://github.com/sks/cloud-vis/blob/scanned-repos/scanned.txt)
on the `scanned-repos` branch, not on this one. Random selection skips every
`owner/repo` in that file. After a run finishes, the workflow appends the repos
it selected and pushes the list back to `scanned-repos`. Curated and extra
repos are recorded too, so a later random run does not pick them again. A
manual run still scans the three fixed repos even if they are on the list.

| Language | Default manual-run repo |
|----------|------|
| Go | [`eksctl-io/eksctl`](https://github.com/eksctl-io/eksctl) |
| Python | [`prowler-cloud/prowler`](https://github.com/prowler-cloud/prowler) |
| Java | [`awspring/spring-cloud-aws`](https://github.com/awspring/spring-cloud-aws) |

Run it from the Actions tab: **CCE scan (internet repos)** → **Run workflow**.
`main` is the default branch, so GitHub lists the workflow there. Inputs let
you switch to random repos, change the per-language random count, or add one
more ad hoc `owner/repo` to the matrix either way. Each scan's report and
policy artifacts from `cce-action` are attached as a build artifact. A per-repo
summary (files scanned, entitlements by provider, and minimum permissions per
cloud) is written to the run's step summary.

```bash
gh workflow run cce-scan.yml --repo sks/cloud-vis
gh workflow run cce-scan.yml --repo sks/cloud-vis -f random_repos=true -f random_repo_count=3
```

## Vendored dependencies

Before each scan, the workflow adds `vendor/` to the cloned repository's
`.git/info/exclude`. The current CCE default scan honors this clone-local Git
exclude (including nested `vendor` directories), so dependency copies do not
inflate the fuzz scan or its diagnostics. It does **not** edit the upstream
repository, remove files from the checkout, or narrow the scan to a particular
source directory. Other application files remain in scope subject to the
repository's own `.gitignore` rules. CCE's walker skips matching paths even if
vendored files are **tracked**; plain `git check-ignore` would not report those
unless called with `--no-index`. The workflow checks each vendor directory with
that flag and fails the scan if a higher-priority repository `.gitignore`
negates the exclusion, rather than silently scanning it. Repositories without
`vendor` directories are unaffected. This targets directories literally named
`vendor`; other dependency layouts are not covered by this rule.

## Diagnostics

This harness sets `diagnostics: true` on `stackgenhq/cce-action`. Releases
before cce v0.0.11 posted one HTTP request per unmapped call, from its own
goroutine, with no dedup and no cap. One run against `eksctl`, `prowler`, and
`spring-cloud-aws` fired **282,761** of those from a single runner:

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
at most 500 after the scan. That is what this workflow runs via `cce-action`.
