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
                    let simulationAgent = t.crowd[this.hospital.idIdxTracker[self.index]];
                    let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
                    agent.destination = new Vector3(loc.x, loc.y, loc.z);
                    if (agent.id == 9) {
                        console.log(agent.id + ": " + agent.location.x + ", " + agent.location.y + ", " + agent.location.z)
                        console.log(loc)
                        console.log()
                    }

                    //console.log("Stopped");
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

}

export default Stop;
