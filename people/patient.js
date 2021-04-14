import FollowInstructions from "../behavior/follow-instructions.js";
import GoToLazy from "../behavior/go-to-lazy.js";
// import LOG 
import Stop from "../behavior/stop.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class patient {

  constructor(myIndex, startLocation, hospital) {
    this.index = myIndex;
    this.startLocation = startLocation;
    this.hospital = hospital;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let me = () => this.hospital.agents.find(a => a.id == myIndex);;
    let myGoal = this.hospital.locations.find(l => l.name == "Check In");
    if (!myGoal) throw new Exception("We couldn't find a location called Check In");

    // this.goTo = new GoTo(self.index, myGoal.location);

    this.tree = builder

      .sequence("Patient Actions")
      //.selector("Check In")
      .splice(new GoToLazy(myIndex, () => this.startLocation.location, this.hospital).tree)// CHECK IN

      .splice(new Stop(myIndex, this.hospital).tree)



      .splice(new FollowInstructions(myIndex, this.hospital).tree)
      .do("Done following instructions", async function (t) {
        console.log("Done following instructions")
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })

      //.splice(new WaitForever(myIndex).tree)
      .end()
      .build();
  }

  async update(crowd, msec) {
    //this.toReturn = null;//Set the default return value to null (don't change destination)
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
    //return this.toReturn; //Return what the behavior tree set the return value to
  }

}

export default patient;