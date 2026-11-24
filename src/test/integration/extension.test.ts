import * as assert from 'assert';
import * as vscode from 'vscode';

// These tests run inside a real VS Code window, opened on test-fixtures/workspace
// (see .vscode-test.mjs). launch.json is written to test-fixtures/workspace/.vscode.

type ShowQuickPick = typeof vscode.window.showQuickPick;

const windowApi = vscode.window as unknown as { showQuickPick: ShowQuickPick };
const originalShowQuickPick = windowApi.showQuickPick;

/** Answers the next quick pick by selecting the items with these labels. */
function selectLabels(labels: string[]): void {
    windowApi.showQuickPick = (async (items: readonly vscode.QuickPickItem[] | Thenable<readonly vscode.QuickPickItem[]>) =>
        (await items).filter(item => labels.includes(item.label))) as unknown as ShowQuickPick;
}

function launchSettings(): vscode.WorkspaceConfiguration {
    const folder = vscode.workspace.workspaceFolders?.[0];
    assert.ok(folder, 'The test workspace is not open');
    return vscode.workspace.getConfiguration('launch', folder.uri);
}

async function setLaunchConfigurations(configurations: vscode.DebugConfiguration[]): Promise<void> {
    await launchSettings().update('configurations', configurations, vscode.ConfigurationTarget.Workspace);
}

function launchConfigurationNames(): string[] {
    const configurations = launchSettings().inspect<vscode.DebugConfiguration[]>('configurations')?.workspaceValue ?? [];
    return configurations.map(configuration => configuration.name);
}

suite('AL Launch Management', () => {
    // The extension has no activation events: it is activated by its first command.
    // Activate it here so the commands are registered before the first test.
    suiteSetup(async () => {
        const extension = vscode.extensions.getExtension('EdySpider.allaunchmanagement');
        assert.ok(extension, 'The extension is not installed in the test window');
        await extension.activate();
    });

    setup(() => setLaunchConfigurations([]));

    teardown(async () => {
        windowApi.showQuickPick = originalShowQuickPick;
        await setLaunchConfigurations([]);
    });

    test('registers the commands', async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes('allaunchmanagement.setLaunchConfiguration'));
        assert.ok(commands.includes('allaunchmanagement.openLaunchConfiguration'));
        assert.ok(commands.includes('allaunchmanagement.openProjectLaunch'));
    });

    test('adds the selected configurations to launch.json', async () => {
        selectLabels(['Local', 'Sandbox']);

        await vscode.commands.executeCommand('allaunchmanagement.setLaunchConfiguration');

        assert.deepEqual(launchConfigurationNames(), ['Local Machine', 'Sandbox']);
    });

    test('replaces a configuration with the same name instead of duplicating it', async () => {
        selectLabels(['Local']);
        await vscode.commands.executeCommand('allaunchmanagement.setLaunchConfiguration');

        selectLabels(['Local']);
        await vscode.commands.executeCommand('allaunchmanagement.setLaunchConfiguration');

        assert.deepEqual(launchConfigurationNames(), ['Local Machine']);
    });

    test('keeps the configurations that were already in launch.json', async () => {
        await setLaunchConfigurations([{ name: 'My Configuration', type: 'al', request: 'launch' }]);
        selectLabels(['Sandbox']);

        await vscode.commands.executeCommand('allaunchmanagement.setLaunchConfiguration');

        assert.deepEqual(launchConfigurationNames(), ['My Configuration', 'Sandbox']);
    });

    test('does nothing when no configuration is selected', async () => {
        selectLabels([]);

        await vscode.commands.executeCommand('allaunchmanagement.setLaunchConfiguration');

        assert.deepEqual(launchConfigurationNames(), []);
    });
});
