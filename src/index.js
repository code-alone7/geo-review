// Подключение стилей
require('normalize.css');
require('./styles/main.scss');

// Подключение svg
require.context('./svg/', true, /\.svg$/);


// Подключение GeoReview
import GeoReview from './js/geoReview';

new GeoReview();