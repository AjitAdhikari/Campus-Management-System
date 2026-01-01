export default class StorageHelper
{
  static removeToken() {
    window.localStorage.removeItem(this._getTokenKey());
  }
  private static _getTokenKey()
  {
    return "_token_key";
  }
  static  setToken(value:any)
  {
    window.localStorage.setItem(StorageHelper._getTokenKey(),value);
  }

  static getToken() : string | null
  {
    return window.localStorage.getItem(StorageHelper._getTokenKey());
  }


  static setLocalStorageItem(key: string, value: any)
  {
    window.localStorage.setItem(key, value);
  }

  static removeStorageItem(key: string)
  {
    window.localStorage.removeItem(key);
  }

  static getStorageItem(key: string): any | null
  {
    return window.localStorage.getItem(key);
  }

  // Alias for clarity; some components call getLocalStorageItem
  static getLocalStorageItem(key: string): any | null
  {
    return window.localStorage.getItem(key);
  }
}

