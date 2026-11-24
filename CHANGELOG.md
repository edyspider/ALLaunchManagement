# Change Log

All notable changes to the "AL Launch Management" extension will be documented here.

## [Unreleased]

## [1.4.0] - 2026-11-24

### Fixed

- A configuration with the same name as one already in `launch.json` is now
replaced instead of duplicated ([#2](https://github.com/edyspider/ALLaunchManagement/issues/2)).
- Only the project `launch.json` is read, so `launch` configurations from the
user settings (or the `.code-workspace` file) are no longer copied to the project.
- With a `.code-workspace` file that has a single folder, the configurations are
written to the folder `launch.json` instead of the `.code-workspace` file.
- In a multi-root workspace, when the active file is not in any folder, a list of
folders is shown instead of stopping.
- With no folder open, a warning is shown instead of a false success message.
- The success message shows the folder name and how many configurations were
added and replaced, and errors while saving are shown.
- The "Sandbox Debug API" default configuration uses `request: attach`.
- The "Open Launch Configuration" command opens only the settings of this extension.

### Added

- JSON schema for `alLaunchManagement.launchConfigurations` (IntelliSense and
validation in `settings.json`).
- Unit and integration tests, GitHub Actions CI and Dependabot.

### Changed

- Requires VS Code 1.95 or later.
- The extension is activated by its commands instead of every time an AL file
is opened.
- Updated to TypeScript 6 and ESLint 10.

## [1.3.2]

- Update launch.json file regardless if is on a workspace based project or
single project folder.
- If in a workspace environment and no file or folder is selected then select
the project to be updated from a dropdown list.
- Automatically update the launch.json file from the current (selected) workspace
project.
- Update windows messages.

## [1.0.0]

- New Release
