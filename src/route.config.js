import navConfig from './nav.config.json';

import cmpNavConfig from '../../../../src/nav.config.json';

import  Docs  from  './docs';

if (Array.isArray(navConfig[1].groups)) {
  navConfig[1].groups = cmpNavConfig.groups;
}


const LOAD_MAP = name => {
  return r => require.ensure([], () =>
    r(require(`./pages/${name}.vue`)),
    'map');
}
const load = function (path) {
  return LOAD_MAP(path);
};

const LOAD_DOCS_MAP = path => {
  
  return  Docs(path)
};

const LOAD_DOCS_MAP__CMP = path => {
  return r => require.ensure([], () =>
    r(require(`../../../../src/docs/${path}.md`)),
    'doc-map');
};

const loadDocs = function (path) {
  if(path==='installation'){
    return LOAD_DOCS_MAP(path);
  }
  return LOAD_DOCS_MAP__CMP(path);
};

const registerRoute = (navConfig) => {
  let route = [];
  let index = 0;

  let navs = navConfig;
  route.push({
    path: `/component`,
    redirect: `/component/installation`,
    component: load('component'),
    children: []
  });
  navs.forEach(nav => {
    if (nav.href) return;
    if (nav.groups) {
      nav.groups.forEach(group => {
        group.list.forEach(nav => {
          addRoute(nav, index);
        });
      });
    } else if (nav.children) {
      nav.children.forEach(nav => {
        addRoute(nav, index);
      });
    } else {
      addRoute(nav, index);
    }
  });

  function addRoute(page, index) {
    const component = loadDocs(page.path.slice(1));
    let child = {
      path: page.path.slice(1),
      meta: {
        title: page.title || page.name,
        description: page.description,
      },
      name: 'component-' + (page.title || page.name),
      component: component.default || component
    };

    route[index].children.push(child);
  }

  return route;
};





let route = registerRoute(navConfig);


let indexRoute = {
  path: `/`, // 首页
  meta: 'home',
  name: 'home',
  component: load('index')
};

route.push(indexRoute);



let defaultPath;

defaultPath = "/"

route = route.concat([{
  path: '/',
  redirect: defaultPath
}, {
  path: '*',
  redirect: defaultPath
}]);

export default route;