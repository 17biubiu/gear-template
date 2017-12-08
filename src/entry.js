import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
import Element from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import routes from './route.config';
import demoBlock from './components/demo-block.vue';
import MainFooter from './components/footer.vue';
import MainHeader from './components/header.vue';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';
import {
  getFileName,
  getCamelCase,
  getMidLineCase
} from './utils';


let CMPs = require.context('../../../../src/components');

// let replacePattern = new RegExp('^' + options.prefix);


CMPs.keys().forEach(key => {
  if (key.indexOf('.vue') < 0) { //重复解析
    return;
  }
  let name =
    getFileName(key)
    .replace(/\.vue/, '')
    // .replace(replacePattern, '')
    .replace(/-/, '');

  name = name.charAt(0).toLowerCase() + name.slice(1);


  let cc = getCamelCase(name);
  let ml = getMidLineCase(name);
  let component = CMPs(key);
  if (CMPs(key).default) {
    component = CMPs(key).default;
  }
  if (cc === ml) {
    Vue.component(cc, component);
  } else {
    Vue.component(cc, component);
    Vue.component(ml, component);
  }
});




Vue.use(Element);
Vue.use(VueRouter);

Vue.component('demo-block', demoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  // const data = title[route.meta.lang];
  // for (let val in data) {
  //   if (new RegExp('^' + val, 'g').test(route.name)) {
  //     document.title = data[val];
  //     return;
  //   }
  // }
  document.title = 'Gear';
});

new Vue({ // eslint-disable-line
  render: h => h(entry),
  router
}).$mount('#app');