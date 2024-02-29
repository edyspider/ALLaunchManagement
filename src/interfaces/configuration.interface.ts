import * as vscode from 'vscode';

export interface VSCodeConfiguration {
    label: string;
    configuration: vscode.DebugConfiguration;
}