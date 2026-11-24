import * as vscode from 'vscode';
import type { VSCodeConfiguration } from './interfaces/configuration.interface';
import { mergeConfigurations } from './launch-configurations';

const MESSAGE_PREFIX = 'AL Launch Management';

export class ALLaunchManagement {
    /**
     * Adds the selected pre-defined configurations to the launch.json file
     * of the current workspace folder. A configuration with the same name is replaced.
     */
    async setLaunchConfiguration(): Promise<void> {
        const workspaceFolder = await this.selectWorkspaceFolder();
        if (!workspaceFolder) {
            return;
        }

        // Read pre-defined configurations from the extension settings
        const predefinedConfigurations = vscode.workspace
            .getConfiguration()
            .get<VSCodeConfiguration[]>('alLaunchManagement.launchConfigurations.configurations') ?? [];

        if (predefinedConfigurations.length === 0) {
            vscode.window.showWarningMessage(`${MESSAGE_PREFIX}: No pre-defined configurations found in the settings!`);
            return;
        }

        // Prompt the user to choose configurations
        const selectedItems = await vscode.window.showQuickPick(
            predefinedConfigurations.map(predefined => ({
                label: predefined.label,
                description: predefined.configuration.name,
                predefined,
            })),
            { canPickMany: true, placeHolder: 'Select the configurations to add to launch.json' },
        );

        if (!selectedItems || selectedItems.length === 0) {
            vscode.window.showWarningMessage(`${MESSAGE_PREFIX}: No configuration selected!`);
            return;
        }

        // With a .code-workspace file, each folder has its own launch.json (WorkspaceFolder).
        // With a single folder opened, the folder's launch.json is the workspace one.
        const usesWorkspaceFile = vscode.workspace.workspaceFile !== undefined;
        const target = usesWorkspaceFile
            ? vscode.ConfigurationTarget.WorkspaceFolder
            : vscode.ConfigurationTarget.Workspace;

        // inspect() reads only the chosen level, so user-level launch configurations are not copied
        const launchConfiguration = vscode.workspace.getConfiguration('launch', workspaceFolder.uri);
        const inspected = launchConfiguration.inspect<vscode.DebugConfiguration[]>('configurations');
        const currentConfigurations = (usesWorkspaceFile
            ? inspected?.workspaceFolderValue
            : inspected?.workspaceValue) ?? [];

        const result = mergeConfigurations(
            currentConfigurations,
            selectedItems.map(item => item.predefined.configuration),
        );

        try {
            await launchConfiguration.update('configurations', result.configurations, target);
        } catch (error) {
            const reason = error instanceof Error ? error.message : String(error);
            vscode.window.showErrorMessage(`${MESSAGE_PREFIX}: Could not update launch.json. ${reason}`);
            return;
        }

        vscode.window.showInformationMessage(
            `${MESSAGE_PREFIX}: launch.json of '${workspaceFolder.name}' updated ` +
            `(${result.added} added, ${result.replaced} replaced).`,
        );
    }

    /**
     * Opens the extension configuration settings
     */
    openConfigurationSettings() {
        vscode.commands.executeCommand('workbench.action.openSettings', '@ext:EdySpider.allaunchmanagement');
    }

    /**
     * Opens the current project Launch.json file.
     */
    openLaunchConfiguration() {
        vscode.commands.executeCommand('workbench.action.debug.configure');
    }

    /**
     * Returns the workspace folder to update: the only one, the one of the active file,
     * or the one the user picks from a list.
     */
    private async selectWorkspaceFolder(): Promise<vscode.WorkspaceFolder | undefined> {
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if (!workspaceFolders || workspaceFolders.length === 0) {
            vscode.window.showWarningMessage(`${MESSAGE_PREFIX}: Open a folder or workspace first!`);
            return undefined;
        }

        if (workspaceFolders.length === 1) {
            return workspaceFolders[0];
        }

        const activeFileUri = vscode.window.activeTextEditor?.document.uri;
        const activeFolder = activeFileUri ? vscode.workspace.getWorkspaceFolder(activeFileUri) : undefined;
        if (activeFolder) {
            return activeFolder;
        }

        const pickedFolder = await vscode.window.showWorkspaceFolderPick({
            placeHolder: 'Select the workspace folder to update',
        });

        if (!pickedFolder) {
            vscode.window.showWarningMessage(`${MESSAGE_PREFIX}: No workspace folder selected!`);
        }

        return pickedFolder;
    }
}
