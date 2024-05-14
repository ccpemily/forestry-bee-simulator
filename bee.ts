import { translate } from './common/locale';
import { Allele, IAllele } from './genetics/allele';
import { BeeSpecies } from './genetics/allelevalues';
import { BeeGenome, IGenome, BeeChromosomeType  } from './genetics/genome';

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

export { BeeSpecies };
