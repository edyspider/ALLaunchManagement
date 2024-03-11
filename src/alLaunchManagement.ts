const vscode = require('vscode');
import { VSCodeConfiguration } from './interfaces/configuration.interface';

export class ALLaunchManagement {
    /**
     * Update the Launch.json file based on the selected pre-defined configuration.
     */
    async SetLaunchConfiguration() {
        let selectedWorkspaceFolder: any;
        let currentConfigurations: any;
        const singleProjectFolder: boolean = this.isSingleFolderProject();

        if (singleProjectFolder) {
            // Get the current configurations
            currentConfigurations = vscode.workspace.getConfiguration().get('launch.configurations') || [];
        } else {    
            // Get the active text editor's URI (file or untitled)
            const activeTextEditorUri = vscode.window.activeTextEditor?.document.uri;

            if (!activeTextEditorUri) {
                // Get all workspace folders
                const workspaceFolders = vscode.workspace.workspaceFolders;

                if (!workspaceFolders) {
                    vscode.window.showWarningMessage(`AL Launch Management: No workspace opened!`);
                    return;
                }

                // Prompt user to select a workspace folder
                const selectedFolder = await vscode.window.showQuickPick(
                    workspaceFolders.map((folder: { uri: { fsPath: any; }; }) => folder.uri.fsPath),
                    { placeHolder: 'Select a workspace folder' }
                );

                if (!selectedFolder) {
                    vscode.window.showWarningMessage(`AL Launch Management: Selected workspace folder not found!`);
                    return;
                }

                // Get selected folder URI
                const selectedFolderUri  = vscode.Uri.file(selectedFolder);

                // Get the workspace folder for the active text editor's URI
                selectedWorkspaceFolder = vscode.workspace.getWorkspaceFolder(selectedFolderUri);
            } else {
                // Get the workspace folder for the active text editor's URI
                selectedWorkspaceFolder = vscode.workspace.getWorkspaceFolder(activeTextEditorUri);

                if (!selectedWorkspaceFolder) {
                    vscode.window.showWarningMessage(`AL Launch Management: No workspace folder found for the active file!`);
                    return;
                }
            }

            if (!selectedWorkspaceFolder) {
                vscode.window.showWarningMessage(`AL Launch Management: No workspace folder selected!`);
                return;
            }
            
            // Get the current configurations for the active workspace folder
            currentConfigurations = vscode.workspace
                .getConfiguration(undefined, selectedWorkspaceFolder.uri)
                .get('launch.configurations') || [];
        }

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
            // Add the selected predefined configurations
            const updatedConfigurations = currentConfigurations.concat(
                predefinedConfigurations.filter(config => selectedConfigurations.includes(config.label)).map(config => config.configuration)
            );

            if (singleProjectFolder) {
                vscode.workspace
                    .getConfiguration()
                    .update('launch.configurations', updatedConfigurations, vscode.ConfigurationTarget.workspace);
            } else {
                vscode.workspace
                    .getConfiguration(undefined, selectedWorkspaceFolder.uri)
                    .update('launch.configurations', updatedConfigurations, vscode.ConfigurationTarget.WorkspaceFolder);
            }

            vscode.window.showInformationMessage(`AL Launch Management: AL Launch processed successfully for workspace folder:'${selectedWorkspaceFolder}'!`);
        } else {
            vscode.window.showWarningMessage(`AL Launch Management: No configuration selected!`);
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

    /**
     * Check if the current project is not in a workspace based project
     * @returns boolean
     */
    isSingleFolderProject() {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        
        if (workspaceFolders) {
            // Check if there is only one workspace folder
            return workspaceFolders.length === 1;
        } else {
            // No workspace folders, likely a single-folder project
            return true;
        }
    }
}