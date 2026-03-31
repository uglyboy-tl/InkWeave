# Changelog

All notable changes to this project will be documented in this file.

## v1.2.0 (2026-03-31)

### Features
- **e2e**: add playwright end-to-end testing infrastructure

### Bug Fixes
- **changelog**: handle unreleased tag correctly
- **image**: render img element even when no image

### Refactoring
- **image**: handle null image with empty string fallback

### Documentation
- **config**: add changelog and update biome config

### CI/CD
- **publish**: include changelog in GitHub releases

### Chores
- **deps**: add playwright and serve dependencies with config updates
- **release**: add automated changelog generation

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.6...v1.2.0

## v1.1.6 (2026-03-30)

### Chores
- **ci**: update release name to use ref_name instead of ref

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.5...v1.1.6

## v1.1.5 (2026-03-30)

### Chores
- **config**: remove publish scripts from package.json files
- **ci**: update publish workflow to use npm directly

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.4...v1.1.5

## v1.1.4 (2026-03-30)

### Chores
- **publish**: remove provenance flag from publish scripts

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.3...v1.1.4

## v1.1.2 (2026-03-30)

### Features
- **fade-effect**: add linedelay tag support and comprehensive tests

### Bug Fixes
- **plugins**: add @testing-library/jest-dom to devDependencies
- **image**: correct useEffect dependency array in Image component
- **tests**: update TypeScript config and fix test calls
- **plugins**: update scrollafterchoice selector for new structure
- **image-plugin**: reset error state when image changes

### Performance
- **react**: optimize component rendering performance

### Refactoring
- **react**: remove unused hooks re-exports
- **web-container**: adapt to integrated Story component
- **css-styles**: migrate styles to global CSS classes
- **react-components**: integrate Contents and Choices into Story component
- **plugins**: update plugins to use ChoiceRegistry
- **react-components**: rename ChoiceComponents to ChoiceRegistry
- **cd-button**: refactor cooldown button component and state management
- **auto-button**: adapt to new ChoiceComponentProps interface
- **react-components**: refactor ChoiceComponentProps interface
- **web**: remove line delay configuration
- **plugins**: update plugin components with CSS modules
- **web-components**: refactor web components with CSS modules and remove global styles
- **react-components**: refactor components to use CSS modules and index structure
- **web**: improve web component accessibility and functionality
- **plugins**: optimize React hooks usage in plugin components

### Documentation
- improve AGENTS.md with comprehensive development guide
- **dev-guide**: update documentation and add test matchers types
- **dev-guide**: add InkWeave development guide
- **plugins**: add plugins README documentation
- **readme**: refactor and simplify README
- **architecture**: update ChoiceRegistry references

### Styles
- **config**: format config and test files
- **web**: format code with biome
- **react**: format code with biome
- **plugins**: format code with biome
- **core**: format code with biome
- **codebase**: apply prettier formatting rules

### Tests
- **react**: add React component tests
- **image-plugin**: add Image component React tests
- **test-infra**: add happy-dom and testing-library test infrastructure
- **core-test**: remove line delay related tests

### Chores
- **publish**: standardize package configurations with repository and provenance
- **ci**: update publish workflow with Node.js 22 and npm upgrade
- **build**: standardize publish scripts to use npm instead of bun
- **ci**: update publish workflow permissions and node environment
- **tooling**: add version bump and release script
- **ci**: add GitHub Actions publish workflow
- **build**: refactor build scripts and standardize publish commands
- **typescript**: restructure TypeScript configuration
- **tooling**: migrate from prettier to biome formatter
- **config**: remove unused vite.lib.config.ts
- **build**: simplify build and test scripts across packages
- **deps**: update bun.lock with new dependencies
- **deps**: update package dependencies and scripts
- **config**: update package tsconfig files
- **config**: update root config for unified test environment
- **test-config**: remove redundant package-specific bunfig.toml files
- **test-config**: migrate test imports from vitest to bun:test
- **config**: add prettier configuration files
- **web-config**: update web configuration and plugin loading
- **plugins-config**: update plugin configurations and options
- **core**: update core types and package configurations

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.1...v1.1.2

## v1.1.1 (2026-03-27)

### Chores
- **packages**: bump package versions
- **react**: update package version to 1.1.0

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.1.0...v1.1.1

## v1.1.0 (2026-03-27)

### Features
- **core**: add refresh mechanism for story restart
- **core**: add error handler support to story creation
- **web**: create independent web application package

### Bug Fixes
- **web**: fix save modal close logic

### Refactoring
- **plugins**: migrate plugin system to independent package
- **react**: migrate React components to independent package

### Documentation
- **readme**: refactor documentation to feature-oriented structure

### Tests
- **core**: add tests for refresh mechanism

### Chores
- **config**: update package version and gitignore
- **publish**: add npm publish configuration and scripts
- **cleanup**: delete old monolithic repository structure code

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.0.0...v1.1.0

## v1.0.0 (2026-03-27)

### Features
- **web**: implement web player with React components
- **core**: implement ink player core library

### Refactoring
- **core**: migrate core engine to independent package

### Documentation
- **docs**: update project documentation and architecture explanation
- **readme**: add comprehensive project documentation

### Tests
- **infra**: set up testing infrastructure

### Chores
- **config**: configure monorepo workspace and build tools
- **build**: configure build tools and testing
- **config**: initialize project with base configuration
