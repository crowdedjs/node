class Hospital {

  agentConstants;
  locations;
  computer;
  comments = [];
  CTQueue = [];
  activePeople = [];

  CT1Occupied = false;
  CT2Occupied = false;

  aTeam = [];
  emergencyQueue = [];

  constructor() {

  }

  getFPS() { return 60; }

  getCTQueue() {
    return this.CTQueue;
  }
  setCTQueue(queue) {
    this.CTQueue = queue;
  }



  isCT1Occupied() {
    return this.CT1Occupied;
  }
  isCT2Occupied() {
    return this.CT2Occupied;
  }
  setCT1Occupied(occupied) {
    this.CT1Occupied = occupied;
  }
  setCT2Occupied(occupied) {
    this.CT2Occupied = occupied;
  }

  getLocationByName(name) {
    return this.locations.find(i => i.getName() == name);

  }



}

export default Hospital;
