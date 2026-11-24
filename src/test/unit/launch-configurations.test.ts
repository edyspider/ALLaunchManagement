import { describe, test } from 'node:test';
import * as assert from 'node:assert/strict';
import type { DebugConfiguration } from 'vscode';
import { mergeConfigurations } from '../../launch-configurations';

function config(name: string, extra: Record<string, unknown> = {}): DebugConfiguration {
    return { name, type: 'al', request: 'launch', ...extra };
}

describe('mergeConfigurations', () => {
    test('adds new configurations at the end', () => {
        const result = mergeConfigurations([config('A')], [config('B'), config('C')]);

        assert.deepEqual(result.configurations.map(c => c.name), ['A', 'B', 'C']);
        assert.equal(result.added, 2);
        assert.equal(result.replaced, 0);
    });

    test('replaces a configuration with the same name in the same position (issue #2)', () => {
        const current = [config('A', { tenant: 'old' }), config('B')];
        const result = mergeConfigurations(current, [config('A', { tenant: 'new' })]);

        assert.deepEqual(result.configurations.map(c => c.name), ['A', 'B']);
        assert.equal(result.configurations[0].tenant, 'new');
        assert.equal(result.added, 0);
        assert.equal(result.replaced, 1);
    });

    test('adds and replaces in the same call', () => {
        const result = mergeConfigurations([config('A'), config('B')], [config('A'), config('C')]);

        assert.deepEqual(result.configurations.map(c => c.name), ['A', 'B', 'C']);
        assert.equal(result.added, 1);
        assert.equal(result.replaced, 1);
    });

    test('works with an empty launch.json', () => {
        const result = mergeConfigurations([], [config('A')]);

        assert.deepEqual(result.configurations.map(c => c.name), ['A']);
        assert.equal(result.added, 1);
    });

    test('does not change the current list', () => {
        const current = [config('A')];
        mergeConfigurations(current, [config('B')]);

        assert.equal(current.length, 1);
    });
});
