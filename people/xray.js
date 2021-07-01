import GoTo from "../behavior/go-to.js"
import WaitForever from "../behavior/wait-forever.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"



class xray {

  constructor(myIndex, hospital) {
    this.index = myIndex;
    this.hospital = hospital;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference
    let goToName = "XRay 1";
    if (myIndex == 17) {
      goToName = "XRay 2";
    }

    let me= ()=>this.hospital.agents.find(a=>a.id == myIndex);;
    let myGoal = this.hospital.locations.find(l => l.name == goToName);
    if (!myGoal) throw new Exception("We couldn't find a location called " + goToName);

    this.goTo = new GoTo(self.index, myGoal.location, this.hospital);


    this.tree = builder
      .sequence("X-Ray Tree")
      .splice(this.goTo.tree)
      .splice(new WaitForever(myIndex, this.hospital).tree)
            
      .end()
      .build();
  }

  async update( crowd, msec) {
    await this.tree.tick({ crowd, msec }) //Call the behavior tree
  }

}

export default xray;