import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



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
      
      // after patient leaves a room, go to that room

      // .splice(new TakeTime(30, 60).tree) // seconds: uniform, 30, 60

      // set that room's status as NONE
      
      .splice(new WaitForever(myIndex, this.hospital).tree)
      
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
