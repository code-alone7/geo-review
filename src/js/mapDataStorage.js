export default class MapDataStorage{

  add(data){
    return new Promise((resolve, reject)=>{
      try{
        this.validate(data);

        let index = `${data.coords[0]}_${data.coords[1]}`;
        let reviewStr = localStorage[index];

        let reviewList = reviewStr ? JSON.parse(reviewStr) : [];
        reviewList.push(data.review);
        localStorage[index] = JSON.stringify(reviewList);
        
        resolve();
      }
      catch(e){
        reject(e);
      }
    })
  }
  getCoords(){
    return new Promise((resolve, reject)=>{
      try{
        let coords = [];

        for (const coord in localStorage) {
          let newCoord = coord.split('_').map(el => parseFloat(el));      

          if(!this.validateCoords(newCoord)) continue;
          if(localStorage[coord].length == 0) continue;      

          coords.push({
            coords: newCoord,
            total: JSON.parse(localStorage[coord]).length,
          })          
        }
        
        resolve(coords);
      }
      catch(e){
        reject(e.message);
      }
    })
  }

  getByCoord(coord){
    return new Promise((resolve, reject)=>{
      const reviewsStr = localStorage[`${coord[0]}_${coord[1]}`];

      if(!reviewsStr) resolve(null);

      const reviews = JSON.parse(reviewsStr);
      resolve(reviews);
    })
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
}