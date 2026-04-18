# Contributing to Ghost Rate

Thanks for your interest. Ghost Rate is open source and welcomes contributions that improve the candidate experience data or the platform itself.

## Getting Started

Follow the [local setup steps in README.md](README.md#local-setup) to get the app running locally before contributing.

## Branch Naming

| Type | Pattern | Example |
|---|---|---|
| Feature | `feature/short-description` | `feature/flag-review` |
| Bug fix | `fix/short-description` | `fix/score-display` |
| Chore | `chore/short-description` | `chore/update-deps` |
| Docs | `docs/short-description` | `docs/api-setup` |

## Commit Style

This project uses [Conventional Commits](https://www.conventionalcommits.org):

```
feat: add flag button to review cards
fix: clear error alert when navigating stepper steps
refactor: extract YesNo into shared component
test: add unit tests for ghost threshold validation
chore: update supabase-js to v2.50
docs: add contributing guide
```

## Pull Request Guidelines

- One concern per PR — don't bundle unrelated changes
- Keep PRs small and focused; large diffs are hard to review
- Describe *why* the change is needed, not just what it does
- PRs require passing CI before merge

## What to Work On

Good first issues:
- UI improvements and accessibility gaps
- Additional company data fields
- Improved error messages
- Test coverage

Out of scope:
- Job listings or salary data — this is a hiring *process* tracker only
- Anonymous reviews — LinkedIn sign-in is a core trust mechanism

## Questions

Open an issue on GitHub if you're unsure whether something fits the project's direction before spending time building it.
