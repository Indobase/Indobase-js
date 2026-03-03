<br />
<p align="center">
  <a href="https://indobase.io">
        <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/indobase/indobase/master/packages/common/assets/images/indobase-logo-wordmark--dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/indobase/indobase/master/packages/common/assets/images/indobase-logo-wordmark--light.svg">
      <img alt="Indobase Logo" width="300" src="https://raw.githubusercontent.com/indobase/indobase/master/packages/common/assets/images/logo-preview.jpg">
    </picture>
  </a>

  <h1 align="center">Indobase Auth JS SDK</h1>

  <h3 align="center">An isomorphic JavaScript SDK for the <a href="https://github.com/indobase/auth">Indobase Auth</a> API.</h3>

  <p align="center">
    <a href="https://indobase.com/docs/guides/auth">Guides</a>
    ·
    <a href="https://indobase.com/docs/reference/javascript/auth-signup">Reference Docs</a>
    ·
    <a href="https://indobase.github.io/indobase-js/auth-js/v2/spec.json">TypeDoc</a>
  </p>
</p>

<div align="center">

[![Build](https://github.com/indobase/indobase-js/workflows/CI/badge.svg)](https://github.com/indobase/indobase-js/actions?query=branch%3Amaster)
[![Package](https://img.shields.io/npm/v/@indobase/auth-js)](https://www.npmjs.com/package/@indobase/auth-js)
[![License: MIT](https://img.shields.io/npm/l/@indobase/indobase-js)](#license)
[![pkg.pr.new](https://pkg.pr.new/badge/indobase/auth-js)](https://pkg.pr.new/~/indobase/auth-js)

</div>

## Requirements

- **Node.js 20 or later** (Node.js 18 support dropped as of October 31, 2025)
- For browser support, all modern browsers are supported

> ⚠️ **Node.js 18 Deprecation Notice**
>
> Node.js 18 reached end-of-life on April 30, 2025. As announced in [our deprecation notice](https://github.com/orgs/indobase/discussions/37217), support for Node.js 18 was dropped on October 31, 2025.

## Quick start

Install

```bash
npm install --save @indobase/auth-js
```

Usage

```js
import { AuthClient } from '@indobase/auth-js'

const GOTRUE_URL = 'http://localhost:9999'

const auth = new AuthClient({ url: GOTRUE_URL })
```

- `signUp()`: https://indobase.com/docs/reference/javascript/auth-signup
- `signIn()`: https://indobase.com/docs/reference/javascript/auth-signin
- `signOut()`: https://indobase.com/docs/reference/javascript/auth-signout

### Custom `fetch` implementation

`auth-js` uses the [`cross-fetch`](https://www.npmjs.com/package/cross-fetch) library to make HTTP requests, but an alternative `fetch` implementation can be provided as an option. This is most useful in environments where `cross-fetch` is not compatible, for instance Cloudflare Workers:

```js
import { AuthClient } from '@indobase/auth-js'

const AUTH_URL = 'http://localhost:9999'

const auth = new AuthClient({ url: AUTH_URL, fetch: fetch })
```

## Development

This package is part of the [Indobase JavaScript monorepo](https://github.com/indobase/indobase-js). To work on this package:

### Building

```bash
# Complete build (from monorepo root)
npx nx build auth-js

# Build with watch mode for development
npx nx build auth-js --watch

# Individual build targets
npx nx build:main auth-js    # CommonJS build (dist/main/)
npx nx build:module auth-js  # ES Modules build (dist/module/)

# Other useful commands
npx nx lint auth-js          # Run ESLint
npx nx typecheck auth-js     # TypeScript type checking
npx nx docs auth-js          # Generate documentation
```

#### Build Outputs

- **CommonJS (`dist/main/`)** - For Node.js environments
- **ES Modules (`dist/module/`)** - For modern bundlers (Webpack, Vite, Rollup)
- **TypeScript definitions (`dist/module/index.d.ts`)** - Type definitions for TypeScript projects

### Testing

The auth-js package has two test suites:

1. **CLI Tests** - Main test suite using Indobase CLI (331 tests)
2. **Docker Tests** - Edge case tests requiring specific GoTrue configurations (11 tests)

#### Prerequisites

- **Indobase CLI** - Required for main test suite ([installation guide](https://indobase.com/docs/guides/cli))
- **Docker** - Required for edge case tests

#### Running Tests

```bash
# Run main test suite with Indobase CLI (recommended)
npx nx test:auth auth-js

# Run Docker-only edge case tests
npx nx test:docker auth-js

# Run both test suites
npx nx test:auth auth-js && npx nx test:docker auth-js
```

#### Main Test Suite (Indobase CLI)

The `test:auth` command automatically:

1. Stops any existing Indobase instance
2. Starts a local Indobase instance via CLI
3. Runs the test suite (excludes `docker-tests/` folder)
4. Cleans up after tests complete

```bash
# Individual commands for manual control
npx nx test:infra auth-js    # Start Indobase CLI
npx nx test:suite auth-js    # Run tests only
npx nx test:clean-post auth-js  # Stop Indobase CLI
```

#### Docker Tests (Edge Cases)

The `test:docker` target runs tests that require specific GoTrue configurations not possible with a single Indobase CLI instance:

- **Signup disabled** - Tests for disabled signup functionality
- **Asymmetric JWT (RS256)** - Tests for RS256 JWT verification
- **Phone OTP / SMS** - Tests requiring Twilio SMS provider
- **Anonymous sign-in disabled** - Tests for disabled anonymous auth

These tests are located in `test/docker-tests/` and use the Docker Compose setup in `infra/docker-compose.yml`.

```bash
# Individual commands for manual control
npx nx test:docker:infra auth-js    # Start Docker containers
npx nx test:docker:suite auth-js    # Run Docker tests only
npx nx test:docker:clean-post auth-js  # Stop Docker containers
```

#### Development Testing

For actively developing and debugging tests:

```bash
# Start Indobase CLI once
npx nx test:infra auth-js

# Run tests multiple times (faster since instance stays up)
npx nx test:suite auth-js

# Clean up when done
npx nx test:clean-post auth-js
```

#### Test Infrastructure

| Suite        | Infrastructure | Configuration               |
| ------------ | -------------- | --------------------------- |
| CLI Tests    | Indobase CLI   | `test/indobase/config.toml` |
| Docker Tests | Docker Compose | `infra/docker-compose.yml`  |

### Contributing

We welcome contributions! Please see our [Contributing Guide](../../../CONTRIBUTING.md) for details on how to get started.

For major changes or if you're unsure about something, please open an issue first to discuss your proposed changes.
