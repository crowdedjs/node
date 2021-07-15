import GoTo from "../behavior/go-to.js"
import GoToLazy from "../behavior/go-to-lazy.js"
import TakeTime from "../behavior/take-time.js"
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import LocationStatus from "../support/location-status.js"



class janitorial {

  constructor(myIndex, hospital) {
    this.index = myIndex;
    this.hospital = hospital;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "Fast Track 1";
    let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);;

    let myGoal = this.hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Janitorial")
      .splice(new GoTo(self.index, myGoal.location, this.hospital).tree)
      
      //find room to clean
      .do("Find Room to Clean", (t) => {               
        if (typeof this.hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE) === 'undefined') {
          return fluentBehaviorTree.BehaviorTreeStatus.Running;
        }
        else {
          return fluentBehaviorTree.BehaviorTreeStatus.Success;
        }
      })

      // GO TO THE ROOM THAT NEEDS CLEANING
      .splice(new GoToLazy(self.index, () => this.hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE).location, this.hospital).tree)

      // TAKE TIME IN THE ROOM TO CLEAN
      .splice(new TakeTime(60, 120).tree)

      // set that room's status as NONE
      .do("Done with the Room", (t) => {               
        this.hospital.locations.find(l => l.locationStatus == LocationStatus.SANITIZE).setLocationStatus(LocationStatus.NONE);
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      //.splice(new WaitForever(self.index, myGoal.location).tree)
            
      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default janitorial;
