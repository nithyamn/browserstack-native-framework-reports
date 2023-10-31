# Generate HTML reports for Native App frameworks on BrowserStack

## Flutter

### Pre-requisite
* Update BrowserStack credentials
```sh
  export BROWSERSTACK_USERNAME=<browserstack-username> &&
  export BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
  ```

  - For Windows:

  ```shell
  set BROWSERSTACK_USERNAME=<browserstack-username>
  set BROWSERSTACK_ACCESS_KEY=<browserstack-access-key>
  ```
Alternatively, you can also hardcode username and access_key objects in the `androidReports.js` and `iOSReports.js`

* Add the `buildid` for the runs in `androidReports.js` for Android and `iOSReports.js` for iOS tests

### Run tests
* Run `npm install`
* For Android Run - `node androidReports.js`
* For iOS Run - `node iOSReports.js`