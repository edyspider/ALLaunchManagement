#

<p align="center">
  <img
    src="https://raw.githubusercontent.com/edyspider/ALLaunchManagement/master/img/banner.png"
    align="center" alt="GitHub Readme Stats" />
  <h1 align="center">AL Launch Management</h1>
</p>

<p align="center">
  <a href="https://github.com/edyspider/ALLaunchManagement/blob/master/LICENSE">
    <img alt="License" src="https://img.shields.io/github/license/edyspider/allaunchmanagement">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=EdySpider.allaunchmanagement">
    <img alt="Visual Studio Marketplace Installs" src="https://img.shields.io/visual-studio-marketplace/i/EdySpider.allaunchmanagement">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=EdySpider.allaunchmanagement">
    <img alt="Visual Studio Marketplace Version" src="https://img.shields.io/visual-studio-marketplace/v/EdySpider.allaunchmanagement">
  </a>
  <a href="https://github.com/edyspider/ALLaunchManagement/tags">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/edyspider/ALLaunchManagement">
  </a>
  <a href="https://github.com/edyspider/ALLaunchManagement/issues">
    <img alt="GitHub issues" src="https://img.shields.io/github/issues/edyspider/ALLaunchManagement">
  </a>
</p>

## Features

This extensions allows you to add to your AL projects pre-configured `launch.json`
configurations to minimize the time spent setting up the configurations every time
you create or add new projects to your workspace/environments.

![Set Configuration](img/content/SettingConfiguration.png)

![Launch.json](img/content/launch.png)

---

## Requirements

- `Dynamics 365 Business Central`.
- `Visual Studio Code`.
- `AL Language Extension for VSCode`.

---

## Extension Settings

This extension contributes the following settings:

- `ALLaunchManagement.LaunchConfigurations`:
  - This setting allows you to define multiple launch.json configurations.

![Settings](img/content/Settings.png)

![Settings](img/content/launchConfigurations.png)

---

## Extension Commands

This extension contributes the following commands:

- `ES-LM: Set Launch.json Configuration`:
  - This command add to your project Launch.json file a new pre-defined configuration.
- `ES-LM: Open Launch Configuration`:
  - This command opens the configuration for this extension.
- `ES-LM: Open Project Launch.json`:
  - This command opens the launch.json file of the current project.

![Commands](img/content/Commands.png)

---

## Known Issues

There is [one](https://github.com/edyspider/ALLaunchManagement/issues)] reported
issue.

---

## Release Notes

### [1.3.2]

- Update launch.json file regardless if is on a workspace based project or
single project folder.
- If in a workspace environment and no file or folder is selected then select
the project to be updated from a dropdown list.
- Automatically update the launch.json file from the current (selected) workspace
project.
- Update windows messages.

---

## Authors

- [**EdySpider**](https://github.com/edyspider/)

---

## License

- **[MIT license](https://github.com/edyspider/ALLaunchManagement/blob/master/LICENSE)**
- Copyright 2024 &copy; [EdySpider](https://github.com/edyspider).
