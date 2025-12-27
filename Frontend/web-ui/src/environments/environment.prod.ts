// export const environment = {
//     production: false,
//     ApiUrl:"http://celebseek.com",
//     MainUrl:"http://celebseek.com",
//     MediaUploadUrl : "http://test.com"
//     };

import { DynamicEnvironment } from './dynamic-environment';
class Environment extends DynamicEnvironment {

  public production: boolean;
  constructor() {
    super();
    this.production = true;

  }
}

export const environment = new Environment();
