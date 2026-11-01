import { test } from '../fixtures/appiumFixtures';

test('Navigate to the API Demos Alarm Service screen @appium @android', async ({
  apiDemosPage,
}) => {
  await test.step('Verify the API Demos app is launched', async () => {
    await apiDemosPage.waitForApiDemosHome();
  });

  await test.step('Open the App menu', async () => {
    await apiDemosPage.openAppMenu();
  });

  await test.step('Open the Alarm menu', async () => {
    await apiDemosPage.openAlarmMenu();
  });

  await test.step('Open Alarm Service and verify its screen', async () => {
    await apiDemosPage.openAlarmService();
    await apiDemosPage.waitForAlarmServicePage();
  });
});
