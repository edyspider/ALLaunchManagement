import * as vscode from 'vscode';
import { ALLaunchManagement } from './alLaunchManagement';

export function activate(context: vscode.ExtensionContext) {
	const launchManagement = new ALLaunchManagement();

	context.subscriptions.push(
		vscode.commands.registerCommand('allaunchmanagement.setLaunchConfiguration', () => launchManagement.setLaunchConfiguration()),
		vscode.commands.registerCommand('allaunchmanagement.openLaunchConfiguration', () => launchManagement.openConfigurationSettings()),
		vscode.commands.registerCommand('allaunchmanagement.openProjectLaunch', () => launchManagement.openLaunchConfiguration()),
	);
}

export function deactivate() {}