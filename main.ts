import { Bee, BeeDrone, BeePrincess, calcGenomeSimilarity, containsPureSourceOrTarget, containsPureTemplate, containsTemplate, mergeTemplate} from "./bee.ts";
import { Alleles } from "./genetics/allele.ts";
import { AlleleTemplate, BeeChromosomeType } from "./genetics/genome.ts";

let meadows_drone = BeeDrone.get(Alleles.Species.common)

let initial: AlleleTemplate<BeeChromosomeType> = {
    "species": () => Alleles.Species.forest,
    "speed": () => Alleles.Speed.fast,
    "lifetime": () => Alleles.Life.shortest,
    "fertility": () => Alleles.Fertility.maxium,
    "flowers": () => Alleles.Flowers.vanilla,
    "flowering": () => Alleles.Flowering.maxium,
    "territory": () => Alleles.Territory.largest,
    "temperature_tol": () => Alleles.Tolerance.both_2,
    "humidity_tol": () => Alleles.Tolerance.both_2,
    "effect": () => Alleles.Effect.beautific,
    "nocturnal": () => Alleles.Boolean.true,
    "rain_tolerance": () => Alleles.Boolean.true,
    "cave_dwelling": () => Alleles.Boolean.true
}

let target: AlleleTemplate<BeeChromosomeType> = {
    "species": () => Alleles.Species.meadows,
    "effect": () => Alleles.Effect.exploration
}

meadows_drone.genome.applyTemplate(target, 0)
//meadows_drone.genome.applyTemplate(target, 1)

function testInherit(initial: AlleleTemplate<BeeChromosomeType>, target: AlleleTemplate<BeeChromosomeType>, input: Bee): [BeePrincess[], BeeDrone[], number, number]{
    if(!containsTemplate(input, target)){
        console.log("Input bee does not contain target genome.")
        return [undefined, undefined, -1, -1]
    }
    
    let princess = BeePrincess.get(Alleles.Species.forest)
    
    let initial_drone = BeeDrone.get(Alleles.Species.forest)
    princess.genome.applyTemplate(initial, 0)
    princess.genome.applyTemplate(initial, 1)
    initial_drone.genome.applyTemplate(initial, 0)
    initial_drone.genome.applyTemplate(initial, 1)
    let drone_used: BeeDrone[] = []
    let princesses = [princess]
    let t = mergeTemplate(initial, target)

    let drones: Bee[] = []
    let u = princess.breed(input)
    princesses.push(u[0])
    drone_used.push(input)
    drones = drones.concat(u[1])
    drones = drones.filter((bee) => containsTemplate(bee, target)).sort((a, b) => calcGenomeSimilarity(b, t) - calcGenomeSimilarity(a, t))
    let gen = 1
    let time = princess.genome.getAllele('lifetime', true).value
    princess = u[0]

    while(!containsPureTemplate(princess, t) || (drones.length > 0 && !containsPureTemplate(drones[0], t))){
        while(!containsPureSourceOrTarget(princess, initial, target)){
            let p = princess.breed(initial_drone);
            princesses.push(p[0])
            drone_used.push(initial_drone)
            princess = p[0]
            drones = drones.concat(p[1])
            drones = drones.filter((bee) => containsTemplate(bee, target)).sort((a, b) => calcGenomeSimilarity(b, t) - calcGenomeSimilarity(a, t))
            gen++
            time += princess.genome.getAllele('lifetime', true).value
        }
        
        while(!containsTemplate(princess, target)){
            if(drones.length < 1){
                return [undefined, undefined, -1, -1]
            }
            let d = drones.shift()
            let u = princess.breed(d)
            princesses.push(u[0])
            drone_used.push(d)
            gen++
            princess = u[0]
            time += princess.genome.getAllele('lifetime', true).value
            drones = drones.concat(u[1])
            drones = drones.filter((bee) => containsTemplate(bee, target)).sort((a, b) => calcGenomeSimilarity(b, t) - calcGenomeSimilarity(a, t))
        }
        if(drones.length < 1){
            return [undefined, undefined, -1, -1]
        }

        let d = drones.shift()
        let u = princess.breed(d)
        princesses.push(u[0])
        drone_used.push(d)
        gen++
        princess = u[0]
        time += princess.genome.getAllele('lifetime', true).value
        drones = drones.concat(u[1])
        drones = drones.filter((bee) => containsTemplate(bee, target)).sort((a, b) => calcGenomeSimilarity(b, t) - calcGenomeSimilarity(a, t))
    }
    if(drones[0]){
        //console.log("Total gen: "+ gen)
        //console.log("Preserved drones: " + drones.length)
        //console.log("Princess: ")
        //princess.repr()
        //console.log("Drone: ")
        //drones[0].repr()
        return [princesses, drone_used, gen, time]
    }
    return [undefined, undefined, -1, -1]
}   

let n = 100
let success = 0
let fail = 0
let totalgen = 0
let totaltime = 0
console.log("Genome diff: " + (26 - calcGenomeSimilarity(meadows_drone, initial)))
let s = Date.now()
for(let  i = 0; i < n; i++){
    let r = testInherit(initial, target, meadows_drone)
    if(r[2] >= 0){
        success++
        totalgen += r[2]
        //for(let j = 0; j < r[0].length; j++){
        //    r[0][j].repr()
        //}
        totaltime += r[3]
    }
    else {
        fail++
    }
}
let e = Date.now()

console.log("Time spent for sim: " + (e - s) + "ms")
console.log("Total try: " + n)
console.log("Total success: " + success)
console.log("Success rate: " + (success / n * 100).toFixed(1) + "%")
console.log("Average gen: " + (totalgen / success).toFixed(1))
console.log("Average time: " + (totaltime / success).toFixed(1) + " min")