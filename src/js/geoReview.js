import InteractiveMap from "./interactiveMap";
import MapDataStorage from "./mapDataStorage";

export default class GeoReview{
  constructor(){
    this.map = new InteractiveMap('map');
    this.map.onClick(this.onClick.bind(this));
    this.map.init().then(this.onInit.bind(this));

    this.mapStorage = new MapDataStorage()

    this.revContentTmp = require('../handlebars/review-content.handlebars');
  }

  async onInit(){
    document.addEventListener('submit', this.onDocumentSubmit.bind(this))

    this.mapStorage.getCoords()
      .then(coords => {
        coords.forEach( el=>{
          for (let i = 0; i < el.total; i++) {
            this.map.createPlaceMark(el.coords)
          }
        })
      })
      .catch( err => console.log(err) );
  }

  createReviewContent(coords, data = {}){
    let root = document.createElement('div');
    root.innerHTML = this.revContentTmp(data);

    let reviewForm = root.querySelector('form');
    reviewForm.dataset.coords = JSON.stringify(coords);

    return root;
  }

  onClick(coord){
    this.mapStorage.getByCoord(coord)
      .then(data=>{
        let reviews = data ? {reviews: data} : null;
        this.map.openBaloon(coord, this.createReviewContent(coord,reviews).innerHTML);
      })
  }

  onDocumentSubmit(e){
    if (e.target.dataset.coords) {
      e.preventDefault();
      if(e.target.classList.contains('js-review-form')){
        const revForm = e.target;
        const coords = JSON.parse(revForm.dataset.coords)
        const date = new Date();

        const data = {
          coords,
          review: {
            name: revForm.querySelector('[data-field=name]').value,
            place: revForm.querySelector('[data-field=place]').value,
            content: revForm.querySelector('[data-field=content]').value,
            date: `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`,
          }
        };

        this.mapStorage.add(data)
          .then(()=>{
            this.map.createPlaceMark(coords);
            this.map.closeBaloon();
          })
          .catch(e=>{
            alert(e);
          });
      }
    }
  }
}