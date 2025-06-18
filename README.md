# ⚛️ React + Vite Setup Guide (Modern Boilerplate)

This setup ensures:

- Clean and consistent code formatting
- Linting for JavaScript, TypeScript, CSS
- Git commit message standards
- Environment-based configuration
- Proxy support for APIs
- Testing with Vitest
- Absolute imports for better project structure

---

## 📦 1. Project Initialization with Vite

**Vite** is a fast build tool for modern web apps.

```bash
npm create vite@latest my-app --template react-ts
cd my-app
npm install
```

---

## 🧼 2. Code Quality & Formatting

### ✅ ESLint

**ESLint** checks for JavaScript/TypeScript code issues.

> Vite often comes with ESLint by default.

To customize rules, edit `eslint.config.js` or `.eslintrc.js`.

---

### 🎨 Prettier

**Prettier** auto-formats your code for consistency.

#### Setup:

```bash
npm install --save-dev --save-exact prettier
```

#### `.prettierrc`:

```json
{
    "trailingComma": "none",
    "tabWidth": 4,
    "semi": false,
    "singleQuote": true,
    "bracketSameLine": true,
    "printWidth": 150,
    "singleAttributePerLine": true,
    "endOfLine": "lf"
}
```

#### `.prettierignore`:

Ignore files from formatting (e.g. build folders).

#### VSCode Auto-format:

Create `.vscode/settings.json`:

```json
{
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
}
```

---

### 🧪 Stylelint

**Stylelint** checks CSS for errors and code quality.

```bash
npm init stylelint
```

Follow prompts to configure. It works like ESLint but for stylesheets.

---

## 🔒 3. Git Hooks for Clean Commits

### 🐶 Husky

**Husky** adds Git hooks to automate tasks before commit/push (e.g., lint checks).

```bash
npm install --save-dev husky
npx husky install
npm pkg set scripts.prepare="husky install"
```

Add a pre-commit hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

### 🧾 Commitlint

**Commitlint** enforces commit message conventions (like Angular-style: `feat:`, `fix:`).

```bash
npm install --save-dev @commitlint/cli @commitlint/config-conventional
```

Create `commitlint.config.js`:

```js
export default {
    extends: ['@commitlint/config-conventional']
}
```

Add a commit-msg hook:

```bash
npx husky add .husky/commit-msg 'npx --no-install commitlint --edit "$1"'
```

---

## 🎯 4. Lint-Staged (Run Linters on Changed Files)

Only lint files you’re committing — faster & more efficient.

```bash
npm install --save-dev lint-staged
```

### `lint-staged.config.js`:

```js
export default {
    '*.{js,ts,jsx,tsx}': ['npm run lint:eslint', 'npm run format:check'],
    '*.css': ['npm run lint:stylelint', 'npm run format:check'],
    '*.{json,html,md,yml,yaml}': ['npm run format:check']
}
```

Then wire it to Husky's `pre-commit` hook:

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

---

## 🌐 5. Environment Configuration

Use different `.env` files for development, production, testing, etc.

| File               | Used When Running...    |
| ------------------ | ----------------------- |
| `.env.development` | `npm run dev`           |
| `.env.production`  | `npm run build/preview` |

Add this to `vite.config.ts`:

```ts
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '')
    return {
        define: {
            'process.env': env
        }
    }
})
```

#### TypeScript Hints for Env

Create `src/vite-env.d.ts`:

```ts
interface ImportMetaEnv {
    readonly VITE_ENV: 'development' | 'production'
}
```

---

## ✅ 6. Environment Variable Validation

Make sure required env variables exist. Add this to `vite.config.ts`:

```ts
function validateEnv(env: Record<string, string>, keys: string[]) {
    keys.forEach((key) => {
        if (!env[key]) throw new Error(`Missing env variable: ${key}`)
    })
}
```

Call it before returning config:

```ts
const requiredVars = ['PORT', 'VITE_ENV']
validateEnv(env, requiredVars)
```

---

## 🌍 7. Proxy Setup (API Redirection)

Let Vite forward API requests during development.

In `vite.config.ts`:

```ts
server: {
  proxy: {
    '/api': {
      target: env.BACKEND_PROXY, // e.g. https://dummyjson.com
      changeOrigin: true,
      rewrite: path => path.replace(/^\/api/, '')
    }
  }
}
```

Now requests to `/api/products` will go to `https://dummyjson.com/products`.

---

## 🏗️ 8. Project Architecture

### Screaming Architecture (Feature-Based Structure)

```
src/
  features/
    user/
    auth/
  shared/
    components/
    utils/
```

Group files by feature/domain for better separation and scaling.

---

## 📁 9. Absolute Imports

Avoid long relative paths like `../../../utils`.

### In `vite.config.ts`:

```ts
import path from 'path';

resolve: {
  alias: {
    '@features': path.resolve(__dirname, 'src/features'),
    '@shared': path.resolve(__dirname, 'src/shared')
  }
}
```

### In `tsconfig.json`:

```json
{
    "compilerOptions": {
        "baseUrl": ".",
        "paths": {
            "@features/*": ["src/features/*"],
            "@shared/*": ["src/shared/*"]
        }
    }
}
```

---

## 🧪 10. Testing with Vitest

Fast, native testing with the Vite ecosystem.

### Install:

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom jsdom
```

### Add to `vite.config.ts`:

```ts
test: {
  globals: true,
  environment: 'jsdom'
}
```

### Sample Test:

```tsx
import { render, screen } from '@testing-library/react'
import App from './App'

test('renders hello world', () => {
    render(<App />)
    expect(screen.getByText(/hello/i)).toBeInTheDocument()
})
```

---

## 🧪 (Optional) Test Coverage

Coming soon — configure with `c8` or built-in support in Vitest.

---

## ✅ Summary of Scripts

In `package.json`, add:

```json
{
    "scripts": {
        "dev": "vite --mode development",
        "build": "vite build --mode production",
        "preview": "vite preview --mode production",
        "lint:eslint": "eslint . --ext .js,.ts,.jsx,.tsx",
        "lint:stylelint": "stylelint **/*.css",
        "format:check": "prettier --check .",
        "format:fix": "prettier --write .",
        "test": "vitest"
    }
}
```

---

▶️ [video](https://www.youtube.com/watch?v=dT8W_fb6z40&t=8983s)

---
