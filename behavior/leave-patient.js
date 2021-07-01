import PatientTempState from "../support/patient-temp-state.js";
import RoomType from "../support/room-type.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class LeavePatient {

  constructor(myIndex, hospital) {
    this.index = myIndex;
    this.hospital = hospital;

    
    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;
    let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);

    this.tree = builder
      .sequence("Leave Patient")
        .do("Assign Room", (t) => {
            let patient = me().getCurrentPatient();
            me().setCurrentPatient(null);
            if (patient.getPermanentRoom().name == "Main Entrance"){
              patient.setPatientTempState(PatientTempState.BOOKED);
              return fluentBehaviorTree.BehaviorTreeStatus.Success;
            }

            patient.setPatientTempState(PatientTempState.GO_INTO_ROOM);
            patient.setAssignedRoom(this.hospital.computer.getEntry(patient).getBed());
            

            return fluentBehaviorTree.BehaviorTreeStatus.Success;
      })
      .end()
      .build();
  }


}

export default LeavePatient;