
import ComputerEntry from "../support/computer-entry.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class ComputerEnterPatient {
    constructor(myIndex, hospital) {
        this.index = myIndex;
        this.hospital = hospital;
        let self = this;
        let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

        this.tree = builder
            .sequence("Computer Enter Patient")
                .do("Enter Patient", (t) => {
                    let patient = me().getCurrentPatient();
                    let entry = new ComputerEntry(patient, "Unknown")

                    this.hospital.computer.add(entry);
                    //this.hospital.computer.print();
                    
                    return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

}

export default ComputerEnterPatient;