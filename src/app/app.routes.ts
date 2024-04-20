import { Routes } from '@angular/router';

import { HomepageComponent } from './pages/homepage/homepage.component';
import { SignInComponent } from './pages/authentication/sign-in/sign-in.component';
import { SignUpComponent } from './pages/authentication/sign-up/sign-up.component';
import { CompanyProfileComponent } from './pages/company-profile/company-profile.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { OpportunityComponent } from './pages/opportunity/opportunity.component';
import { StudentProfileComponent } from './pages/student-profile/student-profile.component';
import { TraininDetailsComponent } from './pages/trainin-details/trainin-details.component';

export const routes: Routes = [
  // NOTE: HomePage is the default route.
  // I know those routes could be named better. However,
  // to make our lives easier, I tried to match pages dirs names.
  { path: 'sign-in', component: SignInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'company-profile', component: CompanyProfileComponent },
  { path: 'student-profile', component: StudentProfileComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'opportunity', component: OpportunityComponent },
  { path: 'trainin-details', component: TraininDetailsComponent },
  { path: '**', component: HomepageComponent },
];
