class Hospital{

  agentConstants;
  locations;
  computer;
  comments = [];
  CTQueue = [];
  activePeople = [];

  CTOccupied = false;

  constructor() {
    
  }

  getFPS(){return 60;}

  getCTQueue()
  {
    return this.CTQueue;
  }
  setCTQueue(queue){
    this.CTQueue = queue;
  }

  

  isCTOccupied(){
    return this.CTOccupied;
  }
  setCTOccupied(occupied){
    this.CTOccupied = occupied;
  }

  getLocationByName(name){
    return this.locations.find(i=>i.getName() == name);

  }

  

}

export default Hospital;
