# Frontend Repository

## Branching Strategy

This repository follows a specific branching strategy to ensure stability and smooth development.

### Branches

- **`master`** (Live/Production):
  - This branch contains the stable, production-ready code.
  - **Do not push directly to this branch.**
  - Changes are merged here only from `development` after thorough testing.

- **`development`** (Development/Integration):
  - This is the main branch for active development.
  - All new features and integration work happen here.
  - **Create your future feature branches from this branch.**

### Workflow

1.  **Checkout `development`**: Always start by pulling the latest `development` branch.
    ```bash
    git checkout development
    git pull origin development
    ```
2.  **Create a Feature Branch**: Create a new branch for your specific task.
    ```bash
    git checkout -b feature/your-feature-name
    ```
3.  **Merge Request**: Once your feature is complete, merge it back into `development`.
