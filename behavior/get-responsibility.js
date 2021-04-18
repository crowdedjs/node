import ResponsibilityFactory from "./responsibility/responsibility-factory.js"
import ResponsibilitySubject from "./responsibility/responsibility-subject.js"
import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"


class GetResponsibility {
    constructor(myIndex, hospital) {
        this.index = myIndex;
        this.hospital = hospital;


        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me = () => this.hospital.agentConstants.find(a => a.id == myIndex);;

        this.tree = builder
            .sequence("Get Responsibility")
            .do("Check Responsibilities", (t) => {
                let classedResponsibility = this.getResponsibilityFactory(me().MedicalStaffSubclass)

                let I= me();

                let superResponsibilities = this.hospital.computer.entries
                    .map(i=>{return {entry: i, responsibility:classedResponsibility.get(i, I)}})
                    .filter(i=>{
                        // console.log(i)
                        return i.responsibility!=null && I.hasRoom(i.entry.getBed())}
                        );

                let responsibilities = this.hospital.computer.entries.filter(
                    i => me().hasRoom(i.getBed()) &&
                        classedResponsibility.get(i, me()) != null
                );
                if (!responsibilities || responsibilities.length == 0)
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                responsibilities = responsibilities.filter(i=>classedResponsibility.get(i, me()).getSubject != ResponsibilitySubject.COMPUTER)
                if(!responsibilities || responsibilities.length == 0)
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                let responsibility = responsibilities
                    .map(i => classedResponsibility.get(i, me()))
                    .reduce((a, b) => a == null ? null : b == null ? a : a.getPriority() < b.getPriority() ? a : b)



                if (responsibility == null) {
                    return fluentBehaviorTree.BehaviorTreeStatus.Failure;
                }

                //this.hospitalModel.get().addComment(me, null, "!! " + responsibility.getName());

                me().Responsibility = responsibility;

                return fluentBehaviorTree.BehaviorTreeStatus.Success;
            })
            .end()
            .build();
    }

    getResponsibilityFactory(medicalStaffSubclass) {
        return ResponsibilityFactory.get(medicalStaffSubclass);
    }
}

export default GetResponsibility;