import riot from 'riot';
import route from 'riot-route/tag';
import Pages from './tags/pages/index.tag';
import routes from  './tags/app.tag';

route.base('/');
riot.mount('*');