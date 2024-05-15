import { translate } from './common/locale.ts';
import { AlleleType, IAllele } from './genetics/allele.ts';
import { ChromosomeType } from './genetics/chromosome.ts';
import { BeeGenome, IGenome, BeeChromosomeType, AlleleTemplate  } from './genetics/genome.ts';

export class Bee {
    genome: IGenome<BeeChromosomeType>

    constructor(species: IAllele<'species'> | IGenome<BeeChromosomeType>){
        if('value' in species){
            this.genome = new BeeGenome();
            this.genome.applyTemplate(species.value.template, 0)
            this.genome.applyTemplate(species.value.template, 1)
            this.genome.chromosomes['species'].alleles = [species, species]
        }
        else {
            this.genome = species
        }
    }

    static get(species: IAllele<'species'> | IGenome<BeeChromosomeType>){
        return new Bee(species)
    }

    repr(){
        console.log("BeeProperties:  {")
        for(const k in this.genome.chromosomes){
            const key = k as BeeChromosomeType
            console.log(`    ${translate("chromosomes." + key)}: \t${translate(this.genome.chromosomes[key].alleles[0].name)}\t${translate(this.genome.chromosomes[key].alleles[1].name)}\t(${translate("phenotype")}: ${translate(this.genome.chromosomes[key].active.name)})`)
        }
        console.log("}")
    }
}

export class BeeDrone extends Bee{
    static get(species: IAllele<'species'> | IGenome<BeeChromosomeType>){
        return new BeeDrone(species)
    }
}

export class BeePrincess extends Bee{
    static get(species: IAllele<'species'> | IGenome<BeeChromosomeType>){
        return new BeePrincess(species)
    }

    breed(bee: BeeDrone): [BeePrincess, BeeDrone[]]{
        // Produce princess
        let princess = BeePrincess.get(this.genome.inheritWith(bee.genome))
        let drones = []
        for(let i = 0; i < this.genome.chromosomes['fertility'].active.value; i++){
            drones.push(BeeDrone.get(this.genome.inheritWith(bee.genome)))
        }
        return [princess, drones]
    }
}

export function calcGenomeSimilarity(bee: Bee, template: AlleleTemplate<BeeChromosomeType> | Bee): number {
    let s = 0
    let k: BeeChromosomeType
    let chromosomes = bee.genome.chromosomes
    if('genome' in template){
        let temps = template.genome.chromosomes
        for(k in chromosomes){
            s += chromosomes[k].active.id == temps[k].active.id ? chromosomes[k].inactive.id == temps[k].active.id ? 2 : 1 : 0
        }
    }
    else {
        for(k in chromosomes){
            if(k in template){
                s += chromosomes[k].active.id == template[k]().id ? 1 : 0
                s += chromosomes[k].inactive.id == template[k]().id ? 1 : 0
            }
            else {
                s += 2
            }
        }
    }
    return s
}

export function containsAllele(bee: Bee, allele: IAllele<any>){
    let k: ChromosomeType
    for(k in bee.genome.chromosomes){
        let chromosome = bee.genome.chromosomes[k]
        if((chromosome.active.type == allele.type && chromosome.active.id == allele.id) || (chromosome.inactive.type == allele.type && chromosome.inactive.id == allele.id)){
            return true
        }
    }
    return false
}

export function containsTemplate(bee: Bee, template: AlleleTemplate<BeeChromosomeType>){
    let k: ChromosomeType
    for(k in bee.genome.chromosomes){
        let chromosome = bee.genome.chromosomes[k]
        if(k in template){
            if((chromosome.active.id != template[k]().id) && (chromosome.inactive.id != template[k]().id)){
                return false
            }
        }
    }
    return true
}

export function containsPureTemplate(bee: Bee, template: AlleleTemplate<BeeChromosomeType>){
    let k: ChromosomeType
    for(k in bee.genome.chromosomes){
        let chromosome = bee.genome.chromosomes[k]
        if(k in template){
            if((chromosome.active.id != template[k]().id) || (chromosome.inactive.id != template[k]().id)){
                return false
            }
        }
    }
    return true
}

export function containsPureSourceOrTarget(bee: Bee, source: AlleleTemplate<BeeChromosomeType>, target: AlleleTemplate<BeeChromosomeType>){
    let k: ChromosomeType
    for(k in bee.genome.chromosomes){
        let chromosome = bee.genome.chromosomes[k]
        if(k in source){
            if((chromosome.active.id != source[k]().id) || (chromosome.inactive.id != source[k]().id)){
                if(k in target){
                    if(((chromosome.active.id != source[k]().id) && (chromosome.active.id != target[k]().id)) || 
                    ((chromosome.inactive.id != source[k]().id) && (chromosome.inactive.id != target[k]().id))){
                        return false
                    }
                }
                else {
                    return false
                }
            }
        }
    }
    return true
}

export function mergeTemplate(source: AlleleTemplate<BeeChromosomeType>, target: AlleleTemplate<BeeChromosomeType>){
    //let k: ChromosomeType
    let temp = Object.assign({}, source)
    for(const k in target){
        temp[k] = target[k]
    }
    return temp
}

export function templateEquals(source: AlleleTemplate<BeeChromosomeType>, target: AlleleTemplate<BeeChromosomeType>){
    let k: ChromosomeType
    for(k in source){
        if(!(k in target)){
            return false
        }
    }
    for(k in target){
        if(k in source){
            if(target[k]().id != source[k]().id){
                return false
            }
        }
        else {
            return false
        }
    }
    return true
}