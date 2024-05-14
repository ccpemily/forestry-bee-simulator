import { BeeDrone, BeePrincess } from "./bee";
import { Alleles } from "./genetics/allele";

let princess = BeePrincess.get(Alleles.Species.forest)
let drone = BeeDrone.get(Alleles.Species.meadows)

let springs = princess.breed(drone)

springs[0].repr()