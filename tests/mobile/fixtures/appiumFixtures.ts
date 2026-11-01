import 'dotenv/config';
import { test as base } from '@playwright/test';
import { createAndroidSession } from '../drivers/appiumclient';
import { ApiDemosPage } from '../pages/ApiDemosPage';

type AppiumFixtures = {
  apiDemosPage: ApiDemosPage;
};

export const test = base.extend<AppiumFixtures>({
  apiDemosPage: async ({}, use) => {
    const appPath = process.env.ANDROID_APP_PATH;
    if (!appPath) {
      throw new Error(
        'Set ANDROID_APP_PATH to the absolute path of ApiDemos-debug.apk before running this test.',
      );
    }

    const driver = await createAndroidSession(appPath);
    try {
      await use(new ApiDemosPage(driver));
    } finally {
      await driver.deleteSession();
    }
  },
});
