# Full-Stack Nuxt 3 & Serverless TypeScript Monorepo Template

This project provides a robust boilerplate for building modern full-stack applications. It combines a Nuxt 3 frontend with a TypeScript-based serverless backend, all managed within a pnpm workspace monorepo and deployable to AWS using the Serverless Framework.

## Key Features

- **Monorepo Structure:** Uses [pnpm workspaces](https://pnpm.io/workspaces) to manage `frontend` and `backend` packages within a single repository.
- **Nuxt 3 Frontend (`frontend/`):**
    - Latest (as of May 2025) Nuxt 3 for a powerful Vue.js development experience.
    - Configured for flexible rendering (SSR, SSG, ISR, Hybrid via Route Rules).
    - Example deployment target: Server-Side Rendering (SSR) on AWS Lambda via Serverless Framework.
- **TypeScript Backend (`backend/`):**
    - Write AWS Lambda functions in TypeScript, located in backend/src/.
    - Compiled and bundled using tsup into an optimized backend/dist/ folder for deployment.
- **Serverless Framework (`serverless.yml`):**
    - Infrastructure as Code for defining and deploying all AWS resources (API Gateway, Lambda, DynamoDB, Cognito, S3, etc.).
    - Streamlined deployment process.
- **Shared Development Tooling (Root Level):**
    - **TypeScript:** Consistent version across the monorepo. Individual `tsconfig.json` files per package, potentially extending a root `tsconfig.base.json`.
    - **ESLint:** Modern "flat config" (`eslint.config.js`) at the root, providing shared linting rules with specific configurations for Nuxt/Vue and backend TypeScript.
    - **Prettier:** Centralized code formatting configuration at the root.
- **Optimized Developer Experience:**
    - Simplified dependency management with pnpm.
    - Scripts for common tasks (dev, build, lint, deploy) managed in the root `package.json`.
    - Consistent coding standards enforced by shared tooling.

## Project Structure Overview

```text
/myproject
├── frontend/ # Nuxt 3 application
│ ├── .output/ # Nuxt build output for Lambda (server part)
│ ├── nuxt.config.ts # Nuxt app configuration
│ ├── package.json # Frontend dependencies
│ └── tsconfig.json # Frontend TypeScript configuration
|
├── backend/ # TypeScript Serverless functions
│ ├── src/ # Your TypeScript source files
│ │ └── functions/ # Your Lambda handler files (e.g., userAPI.ts)
│ ├── dist/ # COMPILED JavaScript output from tsup (this gets deployed)
│ ├── package.json # Backend dependencies & tsup build scripts
│ ├── tsconfig.json # Backend TypeScript configuration (for type checking & editor)
│ └── tsup.config.ts # tsup configuration file
|
├── .gitignore
├── eslint.config.js # Root ESLint flat configuration for the entire monorepo
├── package.json # Root pnpm workspace config & shared dev dependencies
├── pnpm-lock.yaml # Single lock file for the entire monorepo
├── pnpm-workspace.yaml # Defines pnpm workspace packages
├── prettier.config.js # Or .prettierrc.js - Root Prettier configuration (optional)
├── serverless.yml # Serverless Framework deployment configuration
└── tsconfig.base.json # Optional: Base TypeScript config extended by frontend/backend
└── README.md
```

## Prerequisites

- Node.js (>= 18.x, latest stable recommended)
- pnpm (>= 9.x)
- AWS Account (if deploying to AWS)
- AWS CLI configured with your credentials and default region (if deploying)
- Serverless Framework CLI (can be installed globally: `npm install -g serverless` or used via pnpm script from root dev dependencies)

## Getting Started

1.  **Clone/Copy this Repository:**

    ```bash
    git clone <this-repo-url> my-new-project
    cd my-new-project
    ```

    (Or if you are copying this structure, ensure all files are in place.)

2.  **Customize Project Name/Details (Optional):**

    - Update `name` fields in:
        - `./package.json` (root)
        - `./frontend/package.json`
        - `./backend/package.json`
    - Update service name in `serverless.yml`.

3.  **Install Dependencies:**
    Run this command from the **root** of the project:
    ```bash
    pnpm install
    ```
    This will install dependencies for the root, `frontend`, and `backend` packages.

## Development Workflow

Scripts are generally run from the project root using pnpm's `--filter` flag or by using pre-configured scripts in the root `package.json`.

- **Frontend Dev Server (Nuxt):**

    ```bash
    pnpm --filter frontend dev
    # or if you added a root script: pnpm run dev:frontend
    ```

    Access at `http://localhost:3000` (or as configured).

- **Backend Local Simulation (Serverless Offline):**
  This requires AWS credentials to be set up, even for local simulation of some services.

    ```bash
    pnpm sls:offline
    # or from root: serverless offline --stage dev
    ```

    This simulates API Gateway and Lambda locally.

- **Linting:**

    ```bash
    pnpm eslint . --fix
    ```

- **Formatting (Prettier):**
    ```bash
    pnpm prettier --write .
    ```

## Building for Production

To prepare your application for a production deployment, you need to build both the frontend and the backend. It's recommended to have a combined build script in your root `package.json` for convenience.

**Example root `package.json` script:**

```json package.json
{
	"scripts": {
		"build:frontend": "pnpm --filter frontend build",
		"build:backend": "pnpm --filter backend build",
		"build": "pnpm run build:frontend && pnpm run build:backend"
	}
}
```

You can then run `pnpm build` from the root directory to build everything.
Here's what happens for each part:

1.  **Build Frontend (Nuxt):**

    - **Command:** `pnpm --filter frontend build` (or `pnpm run build:frontend` from the root)
    - **Action:** This executes the build script defined in `frontend/package.json` (typically `nuxt build`).
    - **Output:** Generates the optimized Nuxt application. For an SSR setup intended for AWS Lambda, this includes the server-side bundle in `frontend/.output/server/` and static assets in `frontend/.output/public/`.

2.  **Build Backend (TypeScript with `tsup`):**
    - **Command:** `pnpm --filter backend build` (or `pnpm run build:backend` from the root)
    - **Action:** This executes the build script defined in `backend/package.json` (which should be `tsup`, configured via `backend/tsup.config.ts`).
    - **Output:** `tsup` compiles your TypeScript source files from `backend/src/` into optimized JavaScript, outputting them to the `backend/dist/` directory. This `backend/dist/` folder contains the code that will be packaged and deployed to AWS Lambda by the Serverless Framework.
    - **Note:** Since `tsup` now handles the TypeScript-to-JavaScript compilation for the backend _before_ the Serverless Framework packaging step, you might no longer need (or might simplify) Serverless Framework plugins like `serverless-esbuild` or `serverless-plugin-typescript` if their primary role was backend TS compilation. The Serverless Framework will now focus on packaging the already compiled JavaScript from `backend/dist/`.

After running the build steps, your `frontend/.output/` and `backend/dist/` directories will contain the necessary artifacts for deployment.

## Deployment to AWS

1.  **Configure `serverless.yml`:**

    - Define your Lambda functions, pointing handlers to your compiled backend code (e.g., `backend/dist/functions/userAPI.handler`) or directly to TS files if using a TS plugin.
    - Define the Nuxt SSR Lambda function, typically pointing its handler to `frontend/.output/server/index.handler`.
    - Set up API Gateway routes, DynamoDB tables, Cognito User Pools, S3 buckets, IAM roles, and other necessary AWS resources.
    - Ensure environment variables are correctly configured for different stages.

2.  **Deploy:**
    Run from the project root:

    ```bash
    # Deploy to a 'dev' stage (example)
    pnpm deploy:dev
    # or directly: serverless deploy --stage dev

    # Deploy to a 'prod' stage
    pnpm deploy:prod
    # or directly: serverless deploy --stage prod
    ```

## Customizing for Your Project

- **Frontend:** Develop your Nuxt application in the `frontend/` directory (pages, components, layouts, store, server API routes).
- **Backend:** Create your Lambda handlers (TypeScript files) in the `backend/functions/` directory. Add any shared backend utilities in `backend/lib/` or similar.
- **Infrastructure:** Define all your AWS resources within `serverless.yml`.
- **Configuration:**
    - `frontend/nuxt.config.ts`: For Nuxt specific settings, modules, route rules (for rendering modes), etc.
    - `eslint.config.js`: Adjust global and package-specific linting rules.
    - `prettier.config.js` (or `.prettierrc.js`): Modify formatting preferences if needed.
    - `**/tsconfig.json` & `tsconfig.base.json`: Fine-tune TypeScript compiler options.
- **Dependencies:** Add frontend-specific dependencies to `frontend/package.json`, backend-specific to `backend/package.json`, and truly shared dev tools or Serverless Framework plugins to the root `package.json`. Always run `pnpm install` from the root after changes.

## Key Configuration Files to Note

- **`pnpm-workspace.yaml`:** Defines the packages in the monorepo.
- **`./package.json` (root):** Manages workspace-level scripts and shared development dependencies.
- **`serverless.yml`:** The heart of your AWS infrastructure and deployment definitions.
- **`eslint.config.js` (root):** Centralized ESLint configuration for code quality.
- **`frontend/nuxt.config.ts`:** Core configuration for your Nuxt frontend application.
- **`frontend/tsconfig.json` & `backend/tsconfig.json`:** TypeScript settings for each respective package, potentially extending `tsconfig.base.json`.

---

Remember to tailor this further with any specific choices or tools you've integrated. Good luck!
