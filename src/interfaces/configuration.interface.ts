import type { DebugConfiguration } from 'vscode';

export interface VSCodeConfiguration {
    label: string;
    configuration: DebugConfiguration;
}