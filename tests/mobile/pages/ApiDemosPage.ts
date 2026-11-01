import type { createAndroidSession } from '../drivers/appiumclient';

type AndroidSession = Awaited<ReturnType<typeof createAndroidSession>>;

export class ApiDemosPage {
  private readonly driver: AndroidSession;

  constructor(driver: AndroidSession) {
    this.driver = driver;
  }

  async waitForApiDemosHome(): Promise<void> {
    await this.waitForVisible('//android.widget.TextView[@text="API Demos"]');
  }

  async openAppMenu(): Promise<void> {
    await this.clickVisible('//android.widget.TextView[@text="App"]');
  }

  async openAlarmMenu(): Promise<void> {
    await this.clickVisible('~Alarm');
  }

  async openAlarmService(): Promise<void> {
    await this.clickVisible('//android.widget.TextView[@text="Alarm Service"]');
  }

  async waitForAlarmServicePage(): Promise<void> {
    await this.waitForVisible(
      '//android.widget.TextView[@text="App/Alarm/Alarm Service"]',
    );
  }

  private async clickVisible(selector: string): Promise<void> {
    const element = await this.waitForVisible(selector);
    await element.click();
  }

  private async waitForVisible(selector: string) {
    const element = await this.driver.$(selector);
    await element.waitForDisplayed({ timeout: 10_000 });
    return element;
  }
}
