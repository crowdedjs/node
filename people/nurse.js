import responsibility from "../behavior/responsibility/responsibility.js";
import GoTo from "../behavior/go-to.js";
import AssignComputer from "../behavior/assign-computer.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class nurse {

    constructor(myIndex, hospital) {
      this.index = myIndex;
      this.hospital = hospital;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
      this.toReturn = null;
  
      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);
      
      let goToName = "NursePlace";
      let myGoal = this.hospital.locations.find(l => l.name == goToName);
      let computer =  this.hospital.locations.find(l => l.name == "NursePlace");
      this.tree = builder

      .sequence("Assign Nurse")
        .splice(new GoTo(self.index, myGoal.location, this.hospital).tree)
        .splice(new AssignComputer(myIndex, computer.location, this.hospital).tree) // NURSE PLACE
        .splice(new responsibility(myIndex, this.hospital).tree) // LAZY: TRUE
      .end()
      .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }

    checkEndOfSimulation() {
      if (self.this.hospital.computer.entries.length > 0) {
        return self.this.hospital.computer.entries[0].unacknowledged("NurseEscortPatientToExit");
      }
      return false;
    }
  
  }

export default nurse;