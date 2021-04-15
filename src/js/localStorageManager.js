export default class LocalStorageManager{
  constructor(){
    if(!localStorage.mapData){
      localStorage.mapData = JSON.stringify({})
    }
  }  

  insert(key, content){
    this.getData()
      .then(data=>{
        data[key] = content;        
        this.stringifyStorage(data);
      })
  }  

  getItem(key){
    return this.getData()
      .then(data=>{
        return data[key] || null;
      })
    
  }

  getData(){
    return new Promise((resolve, reject) => {
      const data = JSON.parse(localStorage.mapData);
      
      if(!data) reject('cannot get data');
      
      resolve(data);
    })
  }
  stringifyStorage(storage){
    localStorage.mapData = JSON.stringify(storage);
  }
}