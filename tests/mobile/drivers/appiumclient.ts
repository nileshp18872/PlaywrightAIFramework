// src/mobile/drivers/appiumClient.ts
import { remote } from 'webdriverio';

export async function createAndroidSession(appPath: string) {
  return await remote({
    hostname: '127.0.0.1',
    port: 4723,
    path: '/',
    capabilities: {
      platformName: 'Android',
      'appium:automationName': 'UiAutomator2',
      'appium:deviceName': 'Android_Emulator',
      'appium:app': appPath,
      'appium:ensureWebviewsHavePages': true,
    },
  });
}