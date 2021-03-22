export default class BrowserInMemStorage {

  public static inMemStorage: any = {} // In-memory storage object
  public static size: number = 0; // Number of items in the storage object
  private static hasInvoked: boolean = false; // Checker if the constructor has been invoked
  private static canLogout: boolean = false; // Checker to allow logout and preventing in-memory storage


  public static initializeStorage() {
    try {
      if (!BrowserInMemStorage.hasInvoked) {
        BrowserInMemStorage.init();
      } else {
        throw Error('In memory storage has already being initialized')
      }
    } catch (err) {
      console.error(err.message)
    } finally {
      BrowserInMemStorage.calculateStorageLength();
    }
  }

  private static visibilityChangeCallback() {
    if (!BrowserInMemStorage.canLogout) {
      if (document.hidden) {
        window.localStorage.backup = JSON.stringify(BrowserInMemStorage.inMemStorage);
      } else {
        BrowserInMemStorage.inMemStorage = BrowserInMemStorage.safelyParseItemsInStorage(
          window.localStorage.backup
        );
        localStorage.removeItem("backup");
      }
    }
  }

  private static beforeUnloadCallback() {
    if (!BrowserInMemStorage.canLogout) {
      window.localStorage.backup = JSON.stringify(BrowserInMemStorage.inMemStorage);
    }
  }

  private static init() {
    const backup = BrowserInMemStorage.safelyParseItemsInStorage(window.localStorage.backup);

    BrowserInMemStorage.inMemStorage = BrowserInMemStorage.safelyParseItemsInStorage(backup);

    window.addEventListener("beforeunload", BrowserInMemStorage.beforeUnloadCallback);

    document.addEventListener(
      "visibilitychange",
      BrowserInMemStorage.visibilityChangeCallback,
      false
    );

    // Remove all traces of visible storage
    localStorage.removeItem("backup");

    // Check for in-mem initialization
    BrowserInMemStorage.hasInvoked = true;
  }

  private static safelyParseItemsInStorage(data: any) {
    const parsedData: any = {};

    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    if (data) {
      Object.keys(data).forEach((key: string) => {
        if (key !== "backup") {
          try {
            parsedData[key] = JSON.parse(data[key]);
          } catch (err) {
            parsedData[key] = data[key];
          }
        }
      });
    }

    return parsedData;
  }

  private static calculateStorageLength(): void {
    BrowserInMemStorage.size = Object.keys(BrowserInMemStorage.inMemStorage).length;
  }

  public static logout(callback: () => void): void {
    callback?.();
    BrowserInMemStorage.canLogout = false;
  }

  public static clear(): void {
    BrowserInMemStorage.inMemStorage = {};
    BrowserInMemStorage.canLogout = true;
    BrowserInMemStorage.hasInvoked = false;
    BrowserInMemStorage.calculateStorageLength();
  }

  private static throwError(message: string): void {
    throw Error(message);
  }

  public static getItem<T>(key: string): T {
    return BrowserInMemStorage.inMemStorage[key];
  }

  public static setItem(key: string, value: any): void {
    try {
      if (typeof key !== "string") {
        BrowserInMemStorage.throwError("The key argument passed to setItem must be a string");
      }

      BrowserInMemStorage.inMemStorage[key] = value;
    } catch (error) {
      console.error(error.message);
    } finally {
      BrowserInMemStorage.calculateStorageLength();
    }
  }

  public static removeItem(key: string): void {
    delete BrowserInMemStorage.inMemStorage[key];
    BrowserInMemStorage.calculateStorageLength();
  }
}

/**
 *
 * Browser In Memory Storage Utils
 *
 */
export const setItem = (key: string, value: any): void => {
  BrowserInMemStorage.setItem(key, value);
};

export const getItem = <T>(key: string): T => {
  return BrowserInMemStorage.getItem<T>(key);
};

export const removeItem = (key: string): void => {
  BrowserInMemStorage.removeItem(key);
};

export const clear = (): void => {
  BrowserInMemStorage.clear();
};

export const logout = (callback: () => void): void => {
  BrowserInMemStorage.logout(callback);
};
