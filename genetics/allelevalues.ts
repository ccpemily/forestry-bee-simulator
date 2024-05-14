import { ChromosomeType, IAlleleCompatible } from "./chromosome";
import { BeeChromosomeType } from "./genome";

export class Species<T extends ChromosomeType> {
    template: {[P in Exclude<T, 'species'>]?: () => IAlleleCompatible<P>}

    constructor(template: {[P in Exclude<T, 'species'>]?: () => IAlleleCompatible<P>}){
        this.template = template
    }
}

export class BeeSpecies extends Species<BeeChromosomeType> {

}


export class FlowerProvider {

}

export class EffectProvider {

}