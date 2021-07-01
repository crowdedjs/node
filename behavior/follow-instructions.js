import PatientTempState from "../support/patient-temp-state.js";
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"
import LocationStatus from "../support/location-status.js";
import Vector3 from "@crowdedjs/math"


class FollowInstructions {

  constructor(myIndex, hospital) {
    this.hospital = hospital;
    this.lastState = -1;

    //this.me = agent;
    let me = () => this.hospital.agentConstants.find(a => a.id == myIndex);

    this.index = myIndex;


    const builder = new fluentBehaviorTree.BehaviorTreeBuilder();

    let self = this;//Since we need to reference this in anonymous functions, we need a reference


    this.tree = builder
      .sequence("Follow Instructions")
      .do("Follow Instructions", t => {
        let agentConstant = this.hospital.agentConstants.find(a => a.id == self.index);

        let id = this.hospital.agentConstants[self.index].id;
        let simulationAgent = t.crowd.find(f => f.id == id);
        let loc = new Vector3(simulationAgent.location.x, simulationAgent.location.y, simulationAgent.location.z);
        let state = me().getPatientTempState();

        let myGoal = this.hospital.locations.find(l => l.name == "Check In");
        if (me().arrivalLocation == "Ambulance Entrance") {
          myGoal = this.hospital.locations.find(l => l.name == "Ambulance Entrance");
        }
        // }

        if (state == PatientTempState.WAITING) {
          agentConstant.destination = new Vector3(agentConstant.location.x, agentConstant.location.y, agentConstant.location.z);
        }
        else if (state == PatientTempState.FOLLOWING) {
          let instructor = me().getInstructor();
          let instructorLoc = Vector3.fromObject(t.crowd.find(f => f.id == instructor.id).location);
          let instructorLocation = instructorLoc;
          let myLocation = loc;
          if (myLocation.distanceTo(instructorLocation) < 1) // If we're really close, stop
          {
            agentConstant.destination = new Vector3(loc.x, loc.y, loc.z);//Stop
          }
          // the patient needs to hold their horses. Wait for their instructor to come to them, then follow.
          else if (myLocation.distanceTo(instructorLocation) > 10) {
            //console.log("Waiting for my instructor!");
          }
          else {
            //Head toward the instructor, but don't collide
            let towardMe = Vector3.subtract(instructorLocation, myLocation);
            towardMe.normalize();
            let destination = Vector3.add(instructorLocation, towardMe);
            agentConstant.destination = destination;
          }
        }
        else if (state == PatientTempState.GO_INTO_ROOM) {
          let destination = me().getAssignedRoom().getLocation();
          if (Vector3.fromObject(destination).distanceTo(me().getLocation()) < .5) {
            me().setPatientTempState(PatientTempState.WAITING)
          }
          else {
            me().setDestination(destination);
          }
        }
        else if (state == PatientTempState.DONE) {
          //console.log("Done")
          me().inSimulation = false;
          // ADJUST CTQUEUE SO TECH TAKES NEXT PATIENT TO CT ROOM
          this.hospital.CTQueue.shift();
          //Hospital.setCTOccupied(false);
          if (me().getCTRoom() == "CT 1") {
            this.hospital.setCT1Occupied(false);
          }
          else {
            this.hospital.setCT2Occupied(false);
          }
          // SET ROOM AS READY TO CLEAN
          me().getPermanentRoom().setLocationStatus(LocationStatus.SANITIZE);
        }
        else if (state == PatientTempState.ARRIVED) {
          agentConstant.destination = myGoal.location;
        }
        else if (state == PatientTempState.BOOKED) {
          //agentConstant.destination = myGoal.location;
          me().inSimulation = false;
        }
        else {
          console.log("Invalid patient temp state " + state);
        }


        return fluentBehaviorTree.BehaviorTreeStatus.Running;
      })

      .end()
      .build();
  }



}

export default FollowInstructions;