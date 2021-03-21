import BrowserInMemStorage, { clear, getItem, setItem, removeItem, logout } from '..';

describe('BrowserInMemStorage', () => {

  it('should initialize storage check it initial data in memory is an empty object', () => {
    // Initialize storage
    BrowserInMemStorage.initializeStorage();

    expect(BrowserInMemStorage.inMemStorage).toEqual({});
    expect(BrowserInMemStorage.size).toEqual(0);
  });

  it('should initialize storage again with an error thrown', () => {
    console.error = jest.fn();
    // Initialize storage again with an error
    BrowserInMemStorage.initializeStorage();

    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('In memory storage has already being initialized');
  });

  it('should create an error while setting an item to storage', () => {
    console.error = jest.fn();

    // @ts-ignore
    setItem(123455, 'casue an error');

    expect(console.error).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('The key argument passed to setItem must be a string');
  });

  it('should store items in memory', () => {
    setItem('name', 'Obiora N.C');
    setItem('occupation', 'Software Engineer');
    setItem('technologies', ['Reactjs', 'VueJs', 'NodeJs', 'SCSS']);
    setItem('yearsOfExperience', 3);

    expect(BrowserInMemStorage.inMemStorage.name).toEqual('Obiora N.C');
    expect(BrowserInMemStorage.inMemStorage.yearsOfExperience).toEqual(3);
  });


  it('should get items in memory', () => {
    const name = getItem<string>('name');
    const occupation = getItem<string>('occupation');
    const technologies = getItem<string[]>('technologies');
    const yearsOfExperience = getItem<number>('yearsOfExperience');

    expect(name).toEqual('Obiora N.C');
    expect(occupation).toEqual('Software Engineer');
    expect(technologies[1]).toEqual('VueJs');
    expect(yearsOfExperience).toEqual(3);
    expect(BrowserInMemStorage.size).toEqual(4);
  });

  it('should remove an item in memory', () => {
    removeItem('occupation');

    expect(BrowserInMemStorage.inMemStorage.occupation).toEqual(undefined);
    expect(BrowserInMemStorage.size).toEqual(3);
  });

  it('should simulate the browser beforeunload', () => {
    window.dispatchEvent(new Event('beforeunload'))

    expect(window.localStorage.backup).toBeDefined();
  });

  it('should simulate the browser visibility when a user navigates away from the page', () => {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hidden', { value: true, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(document.hidden).toEqual(true);
  });

  it('should simulate the browser visibility when a user is still active on the page', () => {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(document.hidden).toEqual(false);
  });

  it('should prep listerners for logout', () => {
    logout();
  });

  it('should clear in memory storage', () => {
    clear();

    expect(BrowserInMemStorage.inMemStorage).toEqual({});
    expect(BrowserInMemStorage.size).toEqual(0);
  });

  it('should simulate the browser beforeunload after user logs out', () => {
    window.dispatchEvent(new Event('beforeunload'))

    expect(window.localStorage.backup).toBeUndefined();
  });

  it('should simulate the browser visibility when logout has been trigger', () => {
    Object.defineProperty(document, 'visibilityState', { value: 'visible', writable: true });
    Object.defineProperty(document, 'hidden', { value: false, writable: true });
    document.dispatchEvent(new Event("visibilitychange"));

    expect(document.hidden).toEqual(false);
  });
});


describe('BrowserInMemStorage CASE 2', () => {
  it('should set a temp backup and initialize in-mem', () => {
    window.localStorage.backup = JSON.stringify({ name: 'Obiora C.N', backup: ['all the backup'], id: '12hh133YY212' });

    BrowserInMemStorage.initializeStorage();

    expect(BrowserInMemStorage.inMemStorage.name).toEqual('Obiora C.N');
    expect(BrowserInMemStorage.size).toEqual(2);
  })
});
