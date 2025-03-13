# conventional-changelog-turbo

> Conventional changelog preset for projects using the Turbo Commit Convention

## Installation

```bash
npm install --save-dev conventional-changelog-turbo
```

## What is Turbo Commit Convention?

A simple and powerful convention for Git commits with the following format:

```
[TAG] scope: subject #issue-number
```

With tags defined as:
- `[ADD]`: features commits, adding lines of code
- `[FIX]`: bugfixing commits
- `[MOD]`: change commits, tiny changes, modifying the way of doing something
- `[DEL]`: deleting commits, code cleanup, remove old libs, deleting files
- `[REF]`: refactor commits, part of a refactor, big changes
- `[BRK]`: breaking changes commits, when breaking old APIs

## Usage

### With CLI

```bash
# Install the conventional-changelog CLI
npm install -g conventional-changelog-cli

# Generate a changelog from your git metadata
conventional-changelog -p turbo -i CHANGELOG.md -s
```

### With package.json scripts

Add this to your package.json:

```json
{
  "scripts": {
    "version": "conventional-changelog -p turbo -i CHANGELOG.md -s && git add CHANGELOG.md",
    "postversion": "git push && git push --tags"
  },
  "devDependencies": {
    "conventional-changelog-cli": "^3.0.0",
    "conventional-changelog-turbo": "^1.0.0"
  }
}
```

Now, whenever you run `npm version [patch|minor|major]`, it will:

1. Bump your package version
2. Generate or update the CHANGELOG.md file based on your Turbo Commit Convention
3. Commit the changelog and tag the release
4. Push your changes and tags

### Example

Given these example commits:

```
[ADD] component: add user profile card #issue-42
[FIX] auth: fix login validation error #issue-43
[MOD] styles: update button hover state
[DEL] utils: remove deprecated helper functions
[REF] api: refactor authentication service #issue-44
[BRK] core: change public API for configuration
```

The generated changelog will look like:

```markdown
# 1.0.0 (2025-03-13)

### 🚀 Features

- **component:** add user profile card (#issue-42)

### 🐛 Bug Fixes

- **auth:** fix login validation error (#issue-43)

### 🔧 Changes

- **styles:** update button hover state

### 🗑️ Removals

- **utils:** remove deprecated helper functions

### ♻️ Refactor

- **api:** refactor authentication service (#issue-44)

### 💥 Breaking Changes

- **core:** change public API for configuration
```

## Commit Message Validation

To enforce the Turbo Commit Convention, you can set up a Git hook. Create a file called `commit-msg` in your `.git/hooks/` directory:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const msgPath = process.argv[2];
const msg = fs.readFileSync(msgPath, 'utf8').trim();

// Turbo Commit Convention pattern
const commitPattern = /^\[(ADD|FIX|MOD|DEL|REF|BRK)\]\s*(?:(\w*):)?\s*(.*)(?:\s*(#\w+-\d+))?$/;
const isValid = commitPattern.test(msg.split('\n')[0]);

// Check title length (50 characters)
const firstLine = msg.split('\n')[0];
const isTitleValid = firstLine.length <= 50;

// Check description lines (72 characters)
const descriptionLines = msg.split('\n').slice(1).filter(line => line.trim().length > 0);
const isDescriptionValid = descriptionLines.every(line => line.length <= 72);

if (!isValid || !isTitleValid || !isDescriptionValid) {
  console.error('\nInvalid commit message format! Please follow the Turbo Commit Convention:');
  console.error('[TAG] scope: subject #issue-number');
  console.error('\nValid tags: [ADD], [FIX], [MOD], [DEL], [REF], [BRK]');
  console.error('Title must not exceed 50 characters.');
  console.error('Description lines must not exceed 72 characters.\n');
  process.exit(1);
}
```

Make it executable:

```bash
chmod +x .git/hooks/commit-msg
```

## License

MIT
