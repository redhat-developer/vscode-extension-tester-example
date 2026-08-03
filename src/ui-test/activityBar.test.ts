/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License", destination); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { expect } from 'chai';
import { ActivityBar, VSBrowser, WaitHelper } from 'vscode-extension-tester';

// sample tests using the Activity Bar (the left toolbar)
describe('Activity Bar Example Tests', () => {
	let activityBar: ActivityBar;
	let waitHelper: WaitHelper;

	before(async () => {
		// init the activity bar page object
		activityBar = new ActivityBar();
		// WaitHelper is exported from vscode-extension-tester and provides
		// withRetry() with built-in StaleElementReferenceError handling
		waitHelper = new WaitHelper(VSBrowser.instance.driver);
	});

	// Test what view controls are available
	it('Shows explorer view control (container)', async () => {
		// getViewControl() uses Promise.all internally in the installed package,
		// which can hit StaleElementReferenceError when VS Code re-renders the bar.
		// WaitHelper.withRetry() re-runs the entire call on stale — each attempt
		// re-queries the DOM from scratch.
		const explorerControl = await waitHelper.withRetry(() => activityBar.getViewControl('Explorer'));
		expect(explorerControl).is.not.undefined;
	});

	// Opening a view by title
	it('Get a view control and open its associated view', async () => {
		// retrieving a view control by title does not require the keyboard shortcut to be part of the argument
		// if the given control exists, it will be returned, otherwise it is undefined
		const ctrl = await waitHelper.withRetry(() => activityBar.getViewControl('Explorer'));

		// click the given control to open its view (using optional notation since it can be undefined)
		const view = await ctrl?.openView();

		// assert the view is open
		expect(view).is.not.undefined;
		expect(await view?.isDisplayed()).is.true;
	});

	// NOTE: This will be working only for testing with VS Code 1.101+

	// Using the global actions controls (the ones on the bottom of the activity bar)
	// This test uses context menus, which are not available on mac, so we skip it there
	it('Manipulate the Global Actions', async () => {
		// getGlobalAction() has the same Promise.all pattern — wrap with withRetry
		const manage = await waitHelper.withRetry(() => activityBar.getGlobalAction('Manage'));

		// actions open a context menu on click
		const menu = await manage?.openActionMenu();

		// lets just close the menu for now
		await menu?.close();
	});
});
