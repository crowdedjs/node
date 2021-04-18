import { workerData, parentPort } from "worker_threads"
import "./crowded.js"
import assets from "../obj-builder/assets/index.js"
import Hospital from "./support/hospital.js"
import Room from "./support/room.js"
import Computer from "./support/computer.js"
import PatientAgent from "./people/patient-agent.js"
import MedicalAgent from "./people/medical-agent.js"
function VectorEquals(one, two) {
    if (!one || !two) return false;
    return one.x == two.x && one.y == two.y && one.z == two.z;
}

var toRun = workerData;
let objValue = assets.objs;       //Grab the value of the environment 
let locationValue = assets.locations;  //Grab the value of all the locations
let arrivalValue = assets.arrivals[0];



let CrowdAgentParams = crowded.CrowdAgentParams;
let RecastTestMeshBuilder = crowded.RecastTestMeshBuilder;
let NavMesh = crowded.NavMesh;
let NavMeshQuery = crowded.NavMeshQuery;
let Crowd = crowded.Crowd;
let ObstacleAvoidanceParams = crowded.ObstacleAvoidanceParams;

//We have to instantiate a hospital and pass it to
//all the different agents that need it for their info.
let hospital = new Hospital()
hospital.computer = new Computer();
let locations = []
let agentConstants = []

locationValue[toRun].forEach(l => {
    console.log(l.annotationName.toUpperCase().replace(" ", "_"))
    locations.push(new Room(l.position, l.annotationName.toUpperCase().replace(" ", "_"), l.name))
})
hospital.locations = locations;

arrivalValue.forEach((agent, index) => {
    if (agent.name == "patient")
        agentConstants.push(new PatientAgent(agent, locations.find(l => l.name == agent.arrivalLocation).getLocation(), undefined, undefined, undefined, hospital));
    else
        agentConstants.push(new MedicalAgent(agent, locations.find(l => l.name == agent.arrivalLocation).getLocation(), hospital));
    //Is this line necessary?
    agentConstants[agentConstants.length - 1].setId(index);
})
hospital.agentConstants = agentConstants;


class CrowdSimApp {

    static updateFlags = CrowdAgentParams.DT_CROWD_ANTICIPATE_TURNS | CrowdAgentParams.DT_CROWD_OPTIMIZE_VIS
        | CrowdAgentParams.DT_CROWD_OPTIMIZE_TOPO | CrowdAgentParams.DT_CROWD_OBSTACLE_AVOIDANCE;
    static query;
    crowd;
    agents = [];
    static ext;
    static filter;
    ap;
    md;
    navmesh;

    bootMesh(objFileContents) {
        this.nmd = RecastTestMeshBuilder.fromFile(objFileContents).getMeshData();
        this.navmesh = new NavMesh(this.nmd, 6, 0);
        this.query = new NavMeshQuery(this.navmesh);
        this.crowd = new Crowd(500, 0.6, this.navmesh);
        let params = new ObstacleAvoidanceParams();
        params.velBias = 0.5;
        params.adaptiveDivs = 5;
        params.adaptiveRings = 2;
        params.adaptiveDepth = 1;
        this.crowd.setObstacleAvoidanceParams(0, params);

        this.ap = this.getAgentParams(this.updateFlags);
        this.ext = this.crowd.getQueryExtents();
        this.filter = this.crowd.getFilter(0);
    }

    getAgentParams(updateFlags) {
        let ap = new CrowdAgentParams();
        ap.radius = 0.6;
        ap.height = 2;
        ap.maxAcceleration = 8.0;
        ap.maxSpeed = 2.5; //Originally 3.5f
        ap.collisionQueryRange = ap.radius * 12;
        ap.pathOptimizationRange = ap.radius * 30;
        ap.updateFlags = updateFlags;
        ap.obstacleAvoidanceType = 0;
        ap.separationWeight = 1; //Originally 2f
        return ap;
    }
}

class App extends CrowdSimApp {
    currentMillisecond = 0;
    millisecondsBetweenFrames = 40; //40ms between frames, or 25fps
    currentTick = 0;
    arrivals = [];
    locations = [];
    activeAgents = [];


    constructor(objFileContents, secondsOfSimulation, locationFileContents) {
        super();
        this.objFileContents = objFileContents;
        this.secondsOfSimulation = secondsOfSimulation;
        this.locations = locationFileContents;
    }

    boot(nonce) {
        this.bootMesh(this.objFileContents);
    }

    getAgentDefinitions() {
        return { type: "agentDefinitions", agents: JSON.stringify(CrowdSimApp.agents) };
    }

    async tick(newAgents, newDestinations, leavingAgents, app) {
        let self = this;
        if (!this.crowd) return;
        let i = this.currentTick++;
        if (i < 1) {
            // initialize all agent's id

        }
        for (let agent of newAgents) {
            app.agents.push(agent);
            this.activeAgents.push(agent)
            let start = this.getStart(agent);
            let idx = this.crowd.addAgent(start, this.getAgentParams(CrowdSimApp.updateFlags));
            agent.idx = idx;
            let nearest = this.query.findNearestPoly(this.getEnd(agent), this.ext, this.filter);
            this.crowd.requestMoveTarget(agent.idx, nearest.getNearestRef(), nearest.getNearestPos());
            agent.hasEntered = true;
            agent.inSimulation = true;
            hospital.agentConstants[agent.id].hasEntered = true;
            hospital.agentConstants[agent.id].inSimulation = true;
        }
        for (let agent of newDestinations) {
            console.log("currenttick: " + this.currentTick)
            console.log("new destination for " + agent.name + " " + this.getEnd(agent))

            if (agent.id !== undefined) {
                let nearest = this.query.findNearestPoly(this.getEnd(agent), this.ext, this.filter); 
                this.crowd.requestMoveTarget(agent.idx, nearest.getNearestRef(), nearest.getNearestPos());
            }
        }
        for (let agent of leavingAgents) {
            agent.inSimulation = false;
            this.activeAgents.splice(this.activeAgents.indexOf(agent), 1);
            app.agents.find(a => a.idx == agent.idx).inSimulation = false;
            hospital.agentConstants[agent.id].inSimulation = false;
            this.crowd.removeAgent(agent.idx);
        }

        this.crowd.update(1 / 25.0, null, i * this.millisecondsBetweenFrames);

        let toPost = [];
        for (let a = 0; a < app.agents.length; a++) {
            let agent = app.agents[a];
            let toAdd = {
                hasEntered: agent.hasEntered,
                inSimulation: agent.inSimulation,
            };
            if (agent.hasEntered && agent.inSimulation) {
                let internalAgent = this.crowd.getAgent(agent.idx);
                let pos = internalAgent.npos;
                toAdd.x = pos[0];
                toAdd.y = pos[1];
                toAdd.z = pos[2];
                toAdd.idx = agent.idx;
                toAdd.id = agent.id;
                toPost.push(toAdd);
                hospital.agentConstants[agent.id].location = {x: toAdd.x, y: toAdd.y, z: toAdd.z};
            }
        }
        setTimeout(() => doneWithFrame({ agents: toPost, frame: i }, self), 0)
    }

    getStart(agent) {
        return hospital.agentConstants[agent.id].getStart();
    }

    getEnd(agent) {
        return hospital.agentConstants[agent.id].getEnd();
    }
}


async function boot(index) {
    let app = new App(objValue[index], 10000, locationValue[index]);
    // console.trace()
    app.boot();

    for (const property in arrivalValue) {
        app.arrivals.push(arrivalValue[property])
    }
    for (const property in locationValue[index]) {
        app.locations.push(locationValue[index][property])
    }
    await app.tick([], [], [], app);
}

async function doneWithFrame(options, app) {
    let remove = [];
    let newDestinations = [];
    let patients = app.activeAgents.filter(a => a.name == "patient");

    patients.forEach(p => {
        if (!hospital.agentConstants[p.id].inSimulation) {
            remove.push(p)
        }
    })

    if (app.currentTick % 500 == 0) {
        console.log("Tick " + app.currentTick)
        console.log(hospital.agentConstants[0].location)
    }
    if (app.arrivals.length == 0 && patients.length == 0) {
        done(app)
    } else {
        let temp = [];
        app.arrivals.forEach(newAgent => {
            if (newAgent.arrivalTick <= options.frame) {
                temp.push(newAgent)
            }
        })
        app.arrivals = app.arrivals.slice(temp.length);

        for (let j = 0; j < app.activeAgents.length; j++) {
            let agent = hospital.agentConstants[app.activeAgents[j].id]
            // let agentLocs = [];
            // hospital.agentConstants.forEach(a => {
            //     agentLocs.push(a.getLocation())
            // })
            let oldDestination = agent.destination;
            await agent.behavior.update(hospital.agentConstants, agent.getLocation(), app.currentTick * 1000); //HERE

            //If the new destination is not null, send the updated destination to the
            //path finding engine
            if (app.getEnd(app.activeAgents[j]) != null && !VectorEquals(agent.destination, oldDestination)) {
                [agent.destX, agent.destY, agent.destZ] = [agent.destination.x, agent.destination.y, agent.destination.z];
                newDestinations.push(agent);
            }
        }

        await app.tick(temp, newDestinations, remove, app)
    }
}

function done(app) {
    parentPort.postMessage({
        layoutNum: toRun + 1,
        endTick: app.currentTick
    })
}


boot(toRun)
