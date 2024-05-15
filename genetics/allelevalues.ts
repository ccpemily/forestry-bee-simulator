import { ChromosomeType, IAlleleCompatible } from "./chromosome.ts";
import { BeeChromosomeType } from "./genome.ts";

export type SpeciesTemplate<T extends ChromosomeType> = {[P in Exclude<T, 'species'>]?: () => IAlleleCompatible<P>}

export class Species<T extends ChromosomeType> {
    template: SpeciesTemplate<T>

    constructor(template: SpeciesTemplate<T>){
        this.template = template
    }
}

export class BeeSpecies extends Species<BeeChromosomeType> {

}


export class FlowerProvider {

}

export class EffectProvider {

}