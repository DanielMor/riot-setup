import riot from 'riot';
import mainApp from './tags/main-app.tag';
//import routes from './routes.js';

riot.route.stop();
riot.route.start(true);

riot.route(function(collection, id, action) {
  console.log(collection);
  console.log('id', id);
  console.log('action', action);
  riot.mount(mainApp);
});

riot.route.base('/');
