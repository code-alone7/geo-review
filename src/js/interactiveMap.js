export default class InteractiveMap{
  constructor(mapID){
    this.elementID = mapID;
  }

  async init(){
    await this.injectMapScript();
    await this.loadMap();
    this.initMap();
  }

  onClick(listener){
    this.clickListener = listener;
  }


  injectMapScript(){
    return new Promise((resolve)=>{
      const mapScirpt = document.createElement('script');
      mapScirpt.src = 'https://api-maps.yandex.ru/2.1/?apikey=5a4c2cfe-31f1-4007-af4e-11db22b6954b&lang=ru_RU';
      document.body.appendChild(mapScirpt);
      mapScirpt.addEventListener('load', resolve);
    })
  }

  loadMap(){
    return new Promise((resolve) => ymaps.ready(resolve));
  }

  initMap(){
    this.clusterer = new ymaps.Clusterer({
      groupByCoordinates: true,
      clusterDisableClickZoom: true,
      clusterOpenBalloonOnClick: false,
    });
    this.clusterer.events.add('click', e => {
      const coords = e.get('target').geometry.getCoordinates();
      this.clickListener(coords);
    });
    this.map = new ymaps.Map(this.elementID, {
      center: [55.76, 37.64],
      zoom: 10,
    });
    this.map.events.add('click', e => {
      this.clickListener(e.get('coords'));
    });
    this.map.geoObjects.add(this.clusterer);
  }


  openBaloon(coords, content){
    this.map.balloon.open(coords, content);
  }
  setBaloonContent(content){
    this.map.balloon.setData(content);
  }
  closeBaloon(){
    this.map.balloon.close();
  }

  createPlaceMark(coords){
    const placemark = new ymaps.Placemark(coords);
    placemark.events.add('click', e => {
      const coords = e.get('target').geometry.getCoordinates();
      this.clickListener(coords);
    });
    this.clusterer.add(placemark);
  }
}