import { Alleles } from "./allele.ts";
import { Chromosome, ChromosomeType, IAlleleCompatible, IChromosome } from "./chromosome.ts";

export type AlleleTemplate<T extends ChromosomeType> = {[P in T]?: () => IAlleleCompatible<P>}
export type DefaultTemplate<T extends ChromosomeType> = {[P in T]: IAlleleCompatible<P>}
export type GenomeContainer<T extends ChromosomeType> = {[P in T]: IChromosome<P>}

export interface IGenome<T extends ChromosomeType> {
    chromosomes: GenomeContainer<T>

    get defaultTemplate(): DefaultTemplate<T>;

    applyTemplate(template: AlleleTemplate<T>, index: 0 | 1): void;
    inheritWith(genome: IGenome<T>): IGenome<T>;
    getAllele<I extends T>(type: I, active: boolean): IAlleleCompatible<I>
}

export type BeeChromosomeType = 'species' | 'lifetime' | 'speed' | 'fertility' | 'flowers' | 'flowering' | 'territory' | 'effect' |
'temperature_tol' | 'humidity_tol' | 'nocturnal' | 'rain_tolerance' | 'cave_dwelling'

export class BeeGenome implements IGenome<BeeChromosomeType> {
    chromosomes: GenomeContainer<BeeChromosomeType>

    get defaultTemplate() {
        return {
            'species': Alleles.Species.forest,
            'lifetime': Alleles.Life.shorter,
            'speed': Alleles.Speed.slowest,
            'fertility': Alleles.Fertility.normal,
            'flowers': Alleles.Flowers.vanilla,
            'flowering': Alleles.Flowering.slowest,
            'territory': Alleles.Territory.average,
            'effect': Alleles.Effect.none,
            'temperature_tol': Alleles.Tolerance.none,
            'humidity_tol': Alleles.Tolerance.none,
            'nocturnal': Alleles.Boolean.false,
            'rain_tolerance': Alleles.Boolean.false,
            'cave_dwelling': Alleles.Boolean.false
        }
    }

    constructor(){
        this.chromosomes = Object.fromEntries(Object.entries(this.defaultTemplate).map(([k, v]) => [k, new Chromosome(v)])) as {[P in BeeChromosomeType]: IChromosome<P>}
    }
    
    getAllele<I extends BeeChromosomeType>(type: I, active: boolean): IAlleleCompatible<I> {
        return this.chromosomes[type].getAllele(active)
    }

    applyTemplate(template: {[P in BeeChromosomeType]?: () => IAlleleCompatible<P>}, index: 0 | 1){
        let t = this.defaultTemplate
        for(const k in template){
            t[k] = template[k]()
        }
        
        for(const tk in t){
            this.chromosomes[tk].alleles[index] = t[tk]
        }
    }

    inheritWith(genome: IGenome<BeeChromosomeType>): IGenome<BeeChromosomeType> {
        let ge = new BeeGenome()
        for(const k in ge.defaultTemplate){
            ge.chromosomes[k] = this.chromosomes[k].inheritWith(genome.chromosomes[k])
        }
        let species = ge.chromosomes['species']
        return ge
    }
}