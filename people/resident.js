import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"

import AssignBed from "../behavior/assign-bed.js";
import AssignComputer from "../behavior/assign-computer.js";
import responsibility from "../behavior/responsibility/responsibility.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class resident {

  constructor(myIndex, hospital) {
    this.index = myIndex;
    this.hospital = hospital;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    this.toReturn = null;

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "ResidentStart";
    let me= ()=>this.hospital.agents.find(a=>a.id == myIndex);;

    let myGoal = this.hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new exception("We couldn't find a location called " + goToName);


    this.tree = builder
      .sequence("Assign")
      .splice(new GoTo(self.index, myGoal.location, this.hospital).tree)
      .splice(new AssignBed(myIndex, this.hospital.locations.find(l => l.name == "C1").location, this.hospital).tree) // C1
      .splice(new AssignComputer(myIndex, this.hospital.locations.find(l => l.name == "ResidentStart").location, this.hospital).tree) // ResidentStart
      .splice(new responsibility(myIndex, this.hospital).tree) // lazy: true

      .end()
      .build();
  }

  async update( crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default resident;
