import { After, Before, Status, setDefaultTimeout } from '@cucumber/cucumber';
import { Timeouts } from '@constants/timeouts';
import { CustomWorld } from './world';

setDefaultTimeout(Timeouts.TEST);

Before(async function (this: CustomWorld) {
  await this.launch();
});

After(async function (this: CustomWorld, { result }) {
  if (result?.status === Status.FAILED && this.page) {
    const screenshot = await this.page.screenshot({ fullPage: true }).catch(() => undefined);
    if (screenshot) this.attach(screenshot, 'image/png');
  }
  await this.dispose();
});
