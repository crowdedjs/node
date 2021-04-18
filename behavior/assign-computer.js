import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import Vector3 from "@crowdedjs/math"


class AssignComputer {
    
      constructor(myIndex, room, hospital) {
        this.index = myIndex;
        this.room = room;
        this.hospital = hospital;

    
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
    
        this.tree = builder
          .sequence("Assign Computer")
          //Set the computer. This is a one-shot behavior since we only want to
          //update the return value once
            .do("Set Computer Location", (t) => {
              let agent = this.hospital.agentConstants.find(a => a.id == myIndex);

              agent.Computer =  Vector3.fromObject(this.room)

              return fluentBehaviorTree.BehaviorTreeStatus.Success;
          })
          .end()
          .build();
        }

}

export default AssignComputer;