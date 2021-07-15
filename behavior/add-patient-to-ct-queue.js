import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class AssignPatientToCTQueue {
  constructor(myIndex, bed, hospital) {
    this.index = myIndex;
    this.hospital = hospital;

    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me = () => this.hospital.agentConstants.find(a => a.id == myIndex);;

    this.tree = builder
      .sequence("Assign Patient To CT Queue")
      .do("Assign Patient", (t) => {
        
        let myPatient = me().getCurrentPatient();
        this.hospital.getCTQueue().add(myPatient);
        console.log(this.hospital.getCTQueue());
        
        return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }

}

export default AssignPatientToCTQueue;