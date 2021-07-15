import GoTo from "../behavior/go-to.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class EscapePerson {

    constructor(myIndex, hospital) {
      this.index = myIndex;
  
      const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

      let self = this;//Since we need to reference this in anonymous functions, we need a reference
      let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);;
      let myGoal = this.hospital.locations.find(l => l.name == "Exit");
      if (!myGoal) throw new Exception("We couldn't find a location called Exit");  
  
  
      this.tree = builder
        .sequence("Escape Person Behaviors")
            .splice(new GoTo(self.index, myGoal.location, this.hospital).tree)
                    
        .end()
        .build();
    }
  
    async update( crowd, msec) {
      //this.toReturn = null;//Set the default return value to null (don't change destination)
      await this.tree.tick({ crowd, msec }) //Call the behavior tree
      //return this.toReturn; //Return what the behavior tree set the return value to
    }
  
  }

export default EscapePerson;