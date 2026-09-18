# HERBuddy

HERBuddy is a lightweight Swift package project that serves a locally previewed WalkBuddy prototype in the browser. The app is implemented as a static HTML mockup rather than a native SwiftUI/WebView app shell, which keeps it portable in the current Linux environment.

## Project status

- Swift package builds successfully in the current environment
- WalkBuddy design mockup included as [walk_buddy_unified_app.html](walk_buddy_unified_app.html)
- Minimal local preview server included in [Sources/main.swift](Sources/main.swift)
- No native iOS app conversion was added for this step

## Run locally

From the project root:

```bash
cd /workspaces/HERBuddy
swift run
```

Then open:

```text
http://localhost:8080
```

The server serves the WalkBuddy HTML prototype directly from the workspace root.

## Files of note

- [Package.swift](Package.swift) — SwiftPM package manifest
- [Sources/main.swift](Sources/main.swift) — minimal HTTP server entry point
- [walk_buddy_unified_app.html](walk_buddy_unified_app.html) — interactive WalkBuddy mockup UI

## Notes

This project is intentionally kept simple and cross-environment friendly. It is designed to preview the mockup in a browser without requiring Apple-only native frameworks or a full iOS shell.
