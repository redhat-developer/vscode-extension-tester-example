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
import { Notification, NotificationType, VSBrowser, Workbench } from 'vscode-extension-tester';

describe('Sample notifications tests', () => {
	beforeEach(async () => {
		// Execute the Hello World command from the command palette
		// this command is going to display a notification
		await new Workbench().executeCommand('hello world');

		// Wait for a notification to appear — 5 s matches the Mocha test timeout so
		// a slow VS Code render does not cause a spurious timeout before the test body runs.
		(await VSBrowser.instance.driver.wait(() => {
			return notificationExists('Hello');
		}, 5000)) as Notification;
	});

	afterEach(async () => {
		// Dismiss any leftover notifications so they don't bleed into the next test.
		try {
			const notifications = await new Workbench().getNotifications();
			for (const notification of notifications) {
				await notification.dismiss();
			}
		} catch {
			// ignore — no notifications present or already dismissed
		}
	});

	// The first type of notifications is the standalone one
	// Standalone notifications are the ones that pop up and usually disappear after a while
	it('Standalone notifications', async () => {
		// retrieve all currently shown notifications
		const notifications = await new Workbench().getNotifications();

		// find the one we are interested in
		let notification!: Notification;
		for (const not of notifications) {
			const message = await not.getMessage();
			if (message.includes('Hello')) {
				notification = not;
			}
		}

		expect(await notification.getText()).equals('Hello World!');
		expect(await notification.getType()).equals(NotificationType.Info);

		// and we can manually dismiss the notification
		await notification.dismiss();
	});

	// Another way to look at notifications is to open the notifications center
	// Notifications there usually stay until dismissed
	it('Notifications Center', async () => {
		const center = await new Workbench().openNotificationsCenter();

		// get notifications from the notifications center
		// this time they can be filtered by type
		// lets get info notifications only
		const notifications = await center.getNotifications(NotificationType.Info);

		// once again we can look for the hello notification
		let notification!: Notification;
		for (const not of notifications) {
			const message = await not.getMessage();
			if (message.includes('Hello')) {
				notification = not;
			}
		}

		expect(await notification.getText()).equals('Hello World!');
		expect(await notification.getType()).equals(NotificationType.Info);

		// this time we can clear all notifications
		await center.clearAllNotifications();
	});
});

/**
 * Example wait condition for WebDriver. Wait for a notification with given text to appear.
 * Wait conditions resolve when the first truthy value is returned.
 * In this case we choose to return the first matching notification object we find,
 * or undefined if no such notification is found.
 */
async function notificationExists(text: string): Promise<Notification | undefined> {
	const notifications = await new Workbench().getNotifications();
	for (const notification of notifications) {
		const message = await notification.getMessage();
		if (message.indexOf(text) >= 0) {
			return notification;
		}
	}
}
