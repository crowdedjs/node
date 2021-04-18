import fluentBehaviorTree from "@crowdedjs/fluent-behavior-tree"

class HandleResponsibility {
    constructor(myIndex, hospital) {
        this.index = myIndex;
        this.hospital = hospital;

        const builder = new fluentBehaviorTree.BehaviorTreeBuilder();
        let self = this;//Since we need to reference this in anonymous functions, we need a reference
        let me= ()=>this.hospital.agentConstants.find(a=>a.id == myIndex);

        this.tree = builder
            .sequence("Handle Responsibility")
                .do("Do Work", (t) => {
		
                    let responsibility = me().Responsibility;
                    
                    let timeElapsed = 1.0/60;
                    
                    if(!responsibility.isStarted()) {
                        //this.hospitalModel.get().addComment(me, null, "Go " + responsibility.Name;
                        
                    }
                    
                    responsibility.doWork(timeElapsed);
                    
                    if(responsibility.isDone()) {
                        //me.removeResponsibility();
                        //this.hospitalModel.get().addComment(me, null, "Done " + responsibility.getName());
                        
                        return fluentBehaviorTree.BehaviorTreeStatus.Success;
                    }
		
                    return fluentBehaviorTree.BehaviorTreeStatus.Running;
                })
            .end()
            .build();
    }


}

export default HandleResponsibility;