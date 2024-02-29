// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ALLaunchManagement } from './alLaunchManagement';


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const launchMgt = new ALLaunchManagement();

	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "AL Launch Management" is now active!');

	let disposableSetLaunchConfig = vscode.commands.registerCommand('allaunchmanagement.setLaunchConfiguration', () => {
		launchMgt.SetLaunchConfiguration();
	});
	context.subscriptions.push(disposableSetLaunchConfig);

	let openSettingsDisposable = vscode.commands.registerCommand('allaunchmanagement.openLaunchConfiguration', () => {
		launchMgt.OpenConfigurationSettings();
	});
	context.subscriptions.push(openSettingsDisposable);

	let openLaunchJsonDisposable = vscode.commands.registerCommand('allaunchmanagement.openProjectLaunch', () => {
		launchMgt.OpenLaunchConfiguration();
	});
	context.subscriptions.push(openLaunchJsonDisposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
