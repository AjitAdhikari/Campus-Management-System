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
}

