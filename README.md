# Bolus-Calculator
Open Source fast acting insulin (Bolus) dosage calculator app.

## Current Status
I am working on porting the original Bolus-Calculator https://github.com/AdamGovier/Bolus-Calculator written without a front-end framework (Apache Cordova was used however to compile into a mobile app.) to Vue 3 & Capacitor. Most of the original features are ported over from the original app and I am currently working on new features.

### Why port to Vue 3 
I want this project to be the best I can possibly make it. The move over to Vue will allow a more maintainable codebase allowing me to update the app without the need of digging through spaghetti code.

On top of porting over everything to Vue I need to actually finish the project so this will not be finished any time soon.

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
4.) Either open and run in Android Studio using:
```
npx cap open android
```
or, run the app directly from the Command-Line using:
```
npx cap run android
```

https://capacitorjs.com/docs/android
### iOS
Coming soon.