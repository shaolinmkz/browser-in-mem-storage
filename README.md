# Browser In-Mem Storage

[![CircleCI](https://circleci.com/gh/shaolinmkz/browser-in-mem-storage.svg?style=svg&circle-token=72b2a0b6be4ed32ba3d99b415483c669df32b025)](https://circleci.com/gh/shaolinmkz/browser-in-mem-storage) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com) [![NPM](https://img.shields.io/npm/v/browser-in-mem-storage.svg)](https://www.npmjs.com/package/browser-in-mem-storage) [![Total Download](https://img.shields.io/npm/dt/browser-in-mem-storage.svg)](https://www.npmjs.com/package/browser-in-mem-storage)

Simple in-memory storage for storing sensitive informations like a token.


[View Sample](https://8806v.csb.app/)

---
<img src="https://res.cloudinary.com/shaolinmkz/image/upload/v1616415559/My-port-folio/in-mem-storage.gif" width="500" />

# Installation

```sh
npm install browser-in-mem-storage
```

# Usage

```js
import BrowserInMemStorage from 'browser-in-mem-storage';

/**
 * Initialize storage
 *
 * Should be invoked once at the root level of your app
 */
BrowserInMemStorage.initializeStorage();

// Accesses the in-mem storage object
console.log(BrowserInMemStorage.inMemStorage) // {}
```


```js
import { clear, getItem, setItem, removeItem, logout } from 'browser-in-mem-storage';

/**
 * Set an item to storage
 * Takes a two arguments (key and value)
 */
setItem('name', 'Obiora C.N');
setItem('occupations', ['Frontend Engineer', 'Backend Engineer']);
console.log(BrowserInMemStorage.inMemStorage)
// { name: "Obiora C.N", occupations: ['Frontend Engineer', 'Backend Engineer'] }

/**
 * Get an item from storage
 * Takes an argument (key)
 */
const occupations = getItem('occupations');
console.log(occupations)
// ['Frontend Engineer', 'Backend Engineer']

/**
 * Removes an item from storage
 * Takes an argument (key)
 */
removeItem('occupations');
console.log(BrowserInMemStorage.inMemStorage)
// { name: "Obiora C.N" }

/**
 * Clears all items from storage
 * Usually invoked when you want to initiate a logout procedure
 * Takes no argument
 */
clear();
console.log(BrowserInMemStorage.inMemStorage) // {}

/**
 * Initiates the logout procedure
 * Incase you don't want to clear storage during a logout
 * You can remove the items you dont need then invoke the logout function
 * The callback will be called when the logout method is invoked
 * Takes a callback as an argument
 */
const handleLogoutProcedure = () => {
  // remove auth token and reload app
  removeItem('token');
};

logout(handleLogoutProcedure);
```

---
The in-mem storage functions can be accessed on the `BrowserInMemStorage` class

Example:

```js
BrowserInMemStorage.setItem('name', 'Obiora C.N');
BrowserInMemStorage.getItem('name');
BrowserInMemStorage.removeItem('name');
BrowserInMemStorage.clear();
BrowserInMemStorage.logout(() => {
  // remove auth token and reload app
});
```
