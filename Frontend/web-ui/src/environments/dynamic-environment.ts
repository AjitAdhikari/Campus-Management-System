declare var window: any;

export class DynamicEnvironment {
    public get environment() {
        return window.config.environment;
    }
    public get ApiUrl(){
      return window.config.ApiUrl;
    }
    public get MainUrl(){
      return window.config.MainUrl;
    }
    public get MediaUploadUrl(){
      return window.config.MediaUploadUrl;
    }

    public get IncomeCategory(){
      return window.config.IncomeCategory;
    }

    public get ExpenseCategory(){
      return window.config.ExpenseCategory;
    }
}
