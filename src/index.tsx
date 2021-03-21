export default class BrowserInMemStorage {
  public static inMemStorage: any = {}; // In-memory storage object
  public static size: number = 0; // Number of items in the storage object
  private static hasInvoked: boolean = false; // Checker if the constructor has been invoked
  private static canLogout: boolean = false; // Checker to allow logout and preventing in-memory storage

  constructor() {
    if (!BrowserInMemStorage.hasInvoked) {
      BrowserInMemStorage.initializeStorage();
    }
  }

  private static initializeStorage() {
    const backup = this.safelyParseItemsInStorage(window.localStorage.backup);

    this.inMemStorage = this.safelyParseItemsInStorage(backup);

    window.addEventListener("beforeunload", () => {
      if (!this.canLogout) {
        window.localStorage.backup = JSON.stringify(this.inMemStorage);
      }
    });

    document.addEventListener(
      "visibilitychange",
      () => {
        if (!this.canLogout) {
          if (document.hidden) {
            window.localStorage.backup = JSON.stringify(this.inMemStorage);
          } else {
            this.inMemStorage = this.safelyParseItemsInStorage(
              window.localStorage.backup
            );
            localStorage.removeItem("backup");
          }
        }
      },
      false
    );

    localStorage.removeItem("backup");
    this.hasInvoked = true;
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
    this.size = Object.keys(this.inMemStorage).length;
  }

  public static logout(): void {
    this.canLogout = true;
  }

  public static clear(): void {
    this.logout();
    this.inMemStorage = {};
    this.hasInvoked = false;
    this.calculateStorageLength();
  }

  private static throwError(message: string): void {
    throw Error(message);
  }

  public static getItem(key: string): any {
    return this.inMemStorage[key];
  }

  public static setItem(key: string, value: any): void {
    try {
      if (typeof key !== "string") {
        this.throwError("The key argument passed to setItem must be a string");
      }

      this.inMemStorage[key] = value;
    } catch (error) {
      console.error(error.message);
    } finally {
      this.calculateStorageLength();
    }
  }

  public static removeItem(key: string): void {
    delete this.inMemStorage[key];
    this.calculateStorageLength();
  }
}

/**
 *
 * Browser In Memory Storage Utils
 *
 */
export const setItem = (key: string, value: any) => {
  BrowserInMemStorage.setItem(key, value);
};

export const getItem = (key: string) => {
  BrowserInMemStorage.getItem(key);
};

export const removeItem = (key: string) => {
  BrowserInMemStorage.removeItem(key);
};

export const clear = () => {
  BrowserInMemStorage.clear();
};
