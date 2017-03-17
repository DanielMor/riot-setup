import riot from 'riot';
import route from 'riot-route/tag';
import Pages from './tags/pages/index.tag';
import routes from  './tags/app.tag';
import store from './store';
import storeMixin from './store/mixin';

riot.mixin('redux-store', new storeMixin(store));

riot.mount('*');