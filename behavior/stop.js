import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import Vector3 from "@crowdedjs/math"

class Stop {
    constructor(myIndex, hospital) {
        this.index = myIndex;
        this.hospital = hospital;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Stop")
                .do("Stop", (t) => {
                    let agent = this.hospital.agentConstants.find(a => a.id == self.index);
                    let simulationAgent = t.crowd.find(a => a.id == self.index);
                    let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
                    agent.destination = new Vector3(loc.x, loc.y, loc.z);

                    //console.log("Stopped");
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

}

export default Stop;
