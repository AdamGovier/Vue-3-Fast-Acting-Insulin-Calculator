<template>
    <div class="loader">Loading...</div>
</template>

<style>
/* https://projects.lukehaas.me/css-loaders/ */
.loader {
  font-size: 10px;
  margin: 50px auto;
  text-indent: -9999em;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  background: #ef4d5a;
  background: -moz-linear-gradient(left, #ef4d5a 10%, rgba(239,77,90, 0) 42%);
  background: -webkit-linear-gradient(left, #ef4d5a 10%, rgba(239,77,90, 0) 42%);
  background: -o-linear-gradient(left, #ef4d5a 10%, rgba(239,77,90, 0) 42%);
  background: -ms-linear-gradient(left, #ef4d5a 10%, rgba(239,77,90, 0) 42%);
  background: linear-gradient(to right, #ef4d5a 10%, rgba(239,77,90, 0) 42%);
  position: relative;
  -webkit-animation: load3 1.4s infinite linear;
  animation: load3 1.4s infinite linear;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
}
.loader:before {
  width: 50%;
  height: 50%;
  background: var(--action-colour);
  border-radius: 100% 0 0 0;
  position: absolute;
  top: 0;
  left: 0;
  content: '';
}
.loader:after {
  background: var(--secondary-bg-colour);
  width: 75%;
  height: 75%;
  border-radius: 50%;
  content: '';
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
@-webkit-keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load3 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>