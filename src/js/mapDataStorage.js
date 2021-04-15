import LocalStorageManager from "./localStorageManager";

export default class MapDataStorage{
  constructor(){
    this.locStorageManager = new LocalStorageManager;
  }

  add(data){
    debugger;
    let index = this.getIndex(data.coords);
    return this.locStorageManager.getItem(index)
      .then(el=>{
        el = el || [];
        el.push(data.review)
        this.locStorageManager.insert(index, el);
      })
    /* return new Promise((resolve, reject)=>{
      try{
        this.validate(data);

        let index = `${data.coords[0]}_${data.coords[1]}`;
        let reviewStr = localStorage[index];

        let reviewList = reviewStr ? JSON.parse(reviewStr) : [];
        reviewList.push(data.review);
        localStorage[index] = JSON.stringify(reviewList);
        
        this.locStorageManager.insert(this.getIndex(data.coords), data.review);
        
        resolve();
      }
      catch(e){
        reject(e);
      }      
    }) */
   
  }
  getCoords(){
    /* return new Promise((resolve, reject)=>{
      try{
        let data = this.locStorageManager.getData();
        let coords = [];

        for (const coord in data) {
          let currCoord = coord.split('_').map(el => parseFloat(el));      

          if(!this.validateCoords(currCoord)) continue;
          if(!data[coord]) continue;     
          
          console.log(data[coord]);

          coords.push({
            coords: currCoord,
            total: data[coord].length,
          })          
        }
        
        resolve(coords);
      }
      catch(e){
        reject(e.message);
      }
    }) */

    return this.locStorageManager.getData()
      .then(data=>{
        let coords = [];

        for (const strCoords in data) {
          let currCoords = strCoords.split('_').map(el => parseFloat(el));

          if(!this.validateCoords(currCoords)) continue;
          if(!data[strCoords]) continue;    

          coords.push({
            coords: currCoords,
            total: data[strCoords].length,
          })
        }
        
        return coords;
      })
      .catch(e=>console.log(e));
  }

  getByCoord(coord){    
    const index = this.getIndex(coord);
    /* return new Promise((resolve)=>{
      const reviewsStr = localStorage[`${coord[0]}_${coord[1]}`];

      if(!reviewsStr) resolve(null);

      const reviews = JSON.parse(reviewsStr);
      resolve(reviews);
    }) */
    return this.locStorageManager.getItem(this.getIndex(coord))
      .catch(e => console.log(e));
  }


  validate(data){
    if(!this.validateCoords(data.coords)){
      throw new Error('Invalid review data');
    }
    if(!this.validateReivew(data.review)){
      throw new Error('Invalid review data');
    }
  }

  validateCoords(coords){
    return Array.isArray(coords) && coords.length === 2;
  }

  validateReivew(review){
    return !(!review || !review.name || !review.place || !review.content);
  }

  getIndex(coord){
    return `${coord[0]}_${coord[1]}`;
  }
}