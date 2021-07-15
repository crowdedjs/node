import {Worker} from "worker_threads"

const populationLength = 20;
let activeWorkers = [];
let finishedData = [];


//One Sim
runCrowdSim(0)

//All Sims
// for (let i = 0; i < populationLength; i++) {
//     finishedData.push(runCrowdSim(i))
// }

Promise.all(finishedData)
    .then(result => {
        console.log(result)
    })


function runCrowdSim(workerData) {
    return new Promise((resolve, reject) => {
        const worker = new Worker("./index.js", { workerData });
        activeWorkers.push([workerData, worker])
        worker.on('message', data => {
            activeWorkers = activeWorkers.filter(w => w[0] != workerData)
            console.log(data)
            resolve(data)
        })
        worker.on('error', data => {
            console.log("hey we found an error! Workerdata: " + workerData)
            console.log(data)
            resolve(data)
        })
        worker.on('exit', data => {
            activeWorkers = activeWorkers.filter(w => w[0] != workerData)
            resolve({
                layoutNum: workerData + 1,
                endTick: Infinity
            })
        })
    })
}
