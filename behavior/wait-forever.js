import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import Vector3 from "@crowdedjs/math"

class WaitForever {
    constructor(myIndex, hospital) {
        //this.agent = agent;
        this.hospital = hospital;
        this.index = myIndex;
        let self = this;
        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Wait Forever")
            .do("Wait Forever", (t) => {
                let agent = this.hospital.agentConstants.find(a => a.id == self.index);
                let simulationAgent = t.crowd[this.hospital.idIdxTracker[self.index]];
                let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
                agent.destination = new Vector3(loc.x, loc.y, loc.z);
                simulationAgent.pose = "Idle";


                return fluentBehaviorTree.BehaviorTreeStatus.Running;
            })
            .end()
            .build();
    }

}

export default WaitForever;