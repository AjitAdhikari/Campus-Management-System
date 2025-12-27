// export const environment = {
//   production: true,
//   ApiUrl:"http://api.feedlily.com/api",
//   MainUrl:"http://feedlily.com",
//   MediaUploadUrl:"http://api.feedlily.com/uploads"
// };

import { DynamicEnvironment } from './dynamic-environment';
class Environment extends DynamicEnvironment {

  public production: boolean;
  constructor() {
    super();
    this.production = true;
  }
}

export const environment = new Environment();
