import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomepageComponent } from './app/pages/homepage/homepage.component';

bootstrapApplication(HomepageComponent, appConfig).catch((err) =>
  console.error(err),
);
