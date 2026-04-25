# Specifications Workflow

Each feature lives as a markdown file under `SPECIFICATIONS/`. Files move between two states.

## Layout

```
SPECIFICATIONS/
├── NOT_YET_IMPLEMENTED/    # Pending specs — write new specs here
└── IMPLEMENTED/            # Shipped specs — moved here once the code is merged
```

## File naming

- Pending: `FEATURE_NAME_{YYYYDDMM}.md` (e.g. `WAITLIST_20260425.md`)
- Implemented: `IMPLEMENTED_FEATURE_NAME_{YYYYDDMM}.md` (prefix added, rest unchanged)

`YYYYDDMM` is the date the spec was authored, not the date it shipped.

## Lifecycle

1. **Author the spec.** Drop the file in `NOT_YET_IMPLEMENTED/`. Aim for 45min–2h of unassisted writing. Cover: user-facing behavior, golden path, edge cases, data model changes, and any external services touched.
2. **Detail the spec.** Run an agent loop over the raw spec to expand it into a buildable plan. Review and correct. Loop until tight.
3. **Build.** Implement against the detailed spec. Commit the code changes against the feature branch.
4. **Mark implemented.** After the feature merges:
   - Add the `IMPLEMENTED_` prefix to the filename
   - Move the file from `NOT_YET_IMPLEMENTED/` into `IMPLEMENTED/`
   - Commit this rename in its own commit: `git commit -m "spec: mark FEATURE_NAME as implemented"`

The spec commit MUST be separate from the code commits. This keeps the spec history readable when looking back at what shipped.

## What goes in a spec

A good spec answers, before any code is written:

- **What does the user see?** Screens, flows, copy.
- **What's the golden path?** The single most common end-to-end interaction.
- **What are the edge cases?** Error states, empty states, race conditions, auth boundaries.
- **What changes in the data model?** New tables, new columns, migrations.
- **What external services are involved?** Polar webhooks, R2, OpenRouter, OAuth.
- **What's explicitly out of scope?** Features that look related but are not part of this slice.

Specs are the durable record of intent. Code answers _what_; specs answer _why_.
