<center>
    <h1>Bolus-Calculator</h1>
    <img src="https://i.imgur.com/u1ZGUtn.png" alt="drawing" width="100%"  />

    Open Source fast acting insulin (Bolus) dosage calculator app.

</center>

## Current Status

The application is not ready for general use.

### Finished:

* ✅ The original [Bolus-Calculator](https://github.com/AdamGovier/Bolus-Calculator) fully ported to Vue & Ionic.
* ✅ Many new features added.
* ✅ Base application almost finished.

### Underworks:

* 🧪 E2E testing needs to be caried out.
* 🧑‍🚀 Personal testing (I will test the application on myself).
* 👪 User testing (An alpha test with a select user-group.).

Once the above is finished I plan to continue to add features to the application through the use of application updates.

### Planned future features:

* Companion app for friends & family to be able to monitor your data.
* A web view of your data for clinics.

### Why port to Vue 3

Vue 3 allows me to easily maintain a large codebase with splitting the UI and logic into smaller components. This will make the addition of future updates easier aswell as making the project more accessible for other developers wishing to make Bolus Calculator their own.

## Compiling

Before starting please make sure you have setup your development environment to these specifications: https://capacitorjs.com/docs/getting-started/environment-setup.

1.) First start of by installing dependencies using:

```
npm install
```

2.) Buld the project for production.

```
npm run build
```

### Android

3.) Add the Android platform using:

```
npx cap add android
```

4.) Either, open and run in Android Studio using:

```
npx cap open android
```

or alternatively, run the app directly from the Command-Line using:

```
npx cap run android
```

https://capacitorjs.com/docs/android

### iOS

3.) Add the iOS platform using:

```
npx cap add ios
```

4.) Either, open and run in XCode using:

```
npx cap open ios
```

or alternativelyalternativl, run the app directly from the Command-Line using:

```
npx cap run ios
```

**https://capacitorjs.com/docs/ios**
