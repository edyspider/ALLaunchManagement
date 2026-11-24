import type { DebugConfiguration } from 'vscode';

export interface MergeResult {
    configurations: DebugConfiguration[];
    added: number;
    replaced: number;
}

/**
 * Merges the selected configurations into the current ones.
 * A selected configuration replaces the current one with the same name;
 * the others are added at the end, in the order they were selected.
 */
export function mergeConfigurations(
    current: readonly DebugConfiguration[],
    selected: readonly DebugConfiguration[],
): MergeResult {
    const configurations = [...current];
    let added = 0;
    let replaced = 0;

    for (const configuration of selected) {
        const index = configurations.findIndex(existing => existing.name === configuration.name);

        if (index === -1) {
            configurations.push(configuration);
            added++;
        } else {
            configurations[index] = configuration;
            replaced++;
        }
    }

    return { configurations, added, replaced };
}
