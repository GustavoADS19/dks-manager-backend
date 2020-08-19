<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
@font-face { font-family: CenturyGothic; src: url("./assets/fonts/century-gothic.ttf"); }

:root{
  --color-dks: #F36E21;
  --color-vmo: #FFCD05;
  --color-glw: #37AB85;

  --dks-image: url("./assets/dks.png");
  --vmo-image: url("./assets/vmo.png");
  --glw-image: url("./assets/glw.png");
}

*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

h1, h2, h3, p, input, label{
  font-family: CenturyGothic;
}
</style>
