# Changelog

All notable changes to this project will be documented in this file.

## v2.0.0 (2026-04-26)

### Features
- **web**: replace Menu with CommandBar in web layout
- **react**: add command-bar component with command registry
- **e2e**: add unified test entry point with shared assets

### Bug Fixes
- **plugins**: fix auto-save plugin and register new plugins

### Refactoring
- **plugins**: migrate SaveModal from web to plugins/memory
- **react-components**: rename component directories to lowercase
- **e2e-syntax**: migrate syntax fixtures from HTML to ink
- **e2e-plugins**: migrate plugin fixtures from HTML to ink
- **e2e-core**: migrate core fixtures from HTML to ink
- **e2e**: simplify image E2E tests with shared patterns
- **e2e**: rename classTag fixtures to kebab-case
- **e2e**: restructure test files into core, plugins, and syntax directories
- **web**: restructure components and relocate i18n module

### Documentation
- **agents**: restructure development guide with best practices
- **agents**: fix plugin name format in development guide
- add E2E testing best practices to AGENTS.md

### Tests
- **e2e**: merge save modal test into existing basic fixture
- **e2e**: add E2E tests for auto-button, auto-save, cd-button, link-open, and memory plugins
- **plugins**: add E2E tests for image plugin
- **core**: add E2E tests for clear, restart, and compile error handling

### Chores
- **config**: fix types path and upgrade TypeScript
- **web**: simplify build config to single IIFE output

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.6.0...v2.0.0

## v1.6.0 (2026-04-23)

### Features
- **i18n**: add internationalization support with translation system
- **web**: integrate plugin configuration in web package
- **core-plugins**: add plugin configuration system with enable/disable support

### Bug Fixes
- **auto-button**: fix minor issue in AutoButton component

### Refactoring
- **web**: restructure entry point and extract renderer
- **plugins**: normalize plugin IDs to kebab-case
- **cli-test**: rename runner test to integration test
- **plugins**: normalize plugin directory names to kebab-case
- **plugins**: migrate plugins to unified Plugin interface with Plugins manager
- **web-entry**: refactor main entry point to use utility modules
- **web-components**: refactor web components and extract icons
- **web-utils**: extract utility classes to separate modules
- **core**: clean up public API exports

### Documentation
- **dev-guide**: update development guide with e2e testing and plugin configuration

### Tests
- **e2e**: add comprehensive Ink syntax test suite

### Chores
- **deps**: update dependencies and build configuration
- **scripts**: remove unnecessary test commands from package.json
- **web-build**: update build configuration for npm package format

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.5.1...v1.6.0

## v1.5.1 (2026-04-21)

### Features
- **audio-plugin**: add music state persistence with Zustand
- **react-choices**: enhance Choices component class handling

### Bug Fixes
- **core**: fix clear method and add Choice class support

### Refactoring
- **plugins**: improve plugin functionality and fix bugs

### Chores
- **deps**: upgrade development dependencies

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.5.0...v1.5.1

## v1.5.0 (2026-04-21)

### Features
- **plugins-autorestore**: add auto-restore plugin for automatic save state loading
- **react-contents**: support dynamic CSS classes in Contents component
- **plugins-class-tag**: add class tag plugin for CSS class support
- **parser**: add CSS class support to Parser
- **cli**: add event listener support in runner
- **plugins-scrollafterchoice**: add onScrollComplete event support
- **plugins-audio**: add onAudioPlay event support
- **plugins-fade-effect**: add onFadeComplete event support
- **plugins-image**: add onImageLoad event support
- **core**: integrate EventEmitter into InkStory
- **core**: add EventEmitter extension for event-driven architecture

### Refactoring
- **plugins**: improve existing plugin implementations and tests
- **core-state**: update state management for class support
- **cli**: update runner to handle ContentItem structure
- **tests**: introduce createMockInk utility for consistent test mocks
- **plugins-scrollafterchoice**: use Events constants for event listeners

### Documentation
- **plugins-docs**: update README with autorestore plugin documentation
- **changelog**: update changelog for event system features

### Tests
- **react-story**: update Story component tests and mock data
- **plugins-test**: add createMockStory utility for plugin testing
- **e2e**: add e2e tests for class tag feature

### Chores
- **typescript-config**: update TypeScript configuration files
- **web-entry**: update web package entry point
- **plugins-index**: add autorestore export to plugin index

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.4.2...v1.5.0

## v1.4.2 (2026-04-17)

### Features
- **cli**: add CLI tool package

### Bug Fixes
- **ci**: resolve promise-retry error in npm installation
- **plugins-image**: handle falsy image values properly
- **plugins-image**: fix img src attribute handling
- **plugins-fade-effect**: export useContentComplete hook

### Refactoring
- **cli**: improve runner display logic and choice prompting
- **react-story**: migrate to React 19 use hook and add onInit tests

### Tests
- **tests**: add comprehensive test coverage
- **react-choices**: add comprehensive tests for Choices and Contents components

### Chores
- **cli**: remove vite config and update dependencies
- **deps**: add esbuild dependency and update lockfile
- **ci**: add web bundle artifacts to release files
- **release**: include web package in release process
- **web**: update version and export paths for CDN usage

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.3.2...v1.4.2

## v1.3.2 (2026-04-03)

### Chores
- **test**: update E2E fixture for new web bundle naming
- **ci**: update publish workflow for web package
- **plugins**: simplify Vite build configuration
- **web**: optimize package configuration for CDN usage
- **test**: update playwright configuration
- **deps**: update dependencies and add ESM support

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.3.1...v1.3.2

## v1.3.0 (2026-04-02)

### Refactoring
- **web**: add override modifier to loadFile method
- **core**: improve type safety and add null checks
- **test**: move testing utilities to root directory
- **config**: migrate to per-package TypeScript configuration

### Chores
- **config**: remove tencent npm registry mirror
- **ci**: remove unnecessary npm update step
- **misc**: various code improvements and fixes
- **config**: update build and development tool configurations
- **deps**: update dependencies and prepare v1.2.0 release

**Full Changelog**: https://github.com/uglyboy-tl/InkWeave/compare/v1.2.0...v1.3.0

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
