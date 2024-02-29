const vscode = require('vscode');
import { VSCodeConfiguration } from './interfaces/configuration.interface';

export class ALLaunchManagement {
    /**
     * Update the Launch.json file based on the selected pre-defined configuration.
     */
    async SetLaunchConfiguration() {
        // Read predefined configurations from extension settings
        const predefinedConfigurations: VSCodeConfiguration[] = vscode.workspace
            .getConfiguration()
            .get('alLaunchManagement.launchConfigurations.configurations') || [];
        
        // Prompt the user to choose configurations
        const selectedConfigurations = await vscode.window.showQuickPick(
            predefinedConfigurations.map(config => config.label),
            { canPickMany: true, placeHolder: 'Select the configurations to add to launch.json' }
        );

        if (selectedConfigurations) {
            // Get the current configurations
            const currentConfigurations = vscode.workspace.getConfiguration().get('launch.configurations') || [];
      
            // Add the selected predefined configurations
            const updatedConfigurations = currentConfigurations.concat(
              predefinedConfigurations.filter(config => selectedConfigurations.includes(config.label)).map(config => config.configuration)
            );
      
            // Update the launch.json file
            vscode.workspace.getConfiguration().update('launch.configurations', updatedConfigurations, vscode.ConfigurationTarget.Workspace);

            console.log('AL Launch processed successfully!');
          } else {
            console.log('No configuration selected!');
          }
    }

    /**
     * Opens the extension configuration settings
     */
    OpenConfigurationSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', 'allaunchmanagement.launchConfigurations');
    }

    /**
     * Opens the current project Launch.json file.
     */
    OpenLaunchConfiguration() {
        vscode.commands.executeCommand('workbench.action.debug.configure');
    }
}