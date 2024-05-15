import { randomBoolean } from "../common/utils.ts";
import { AlleleType, IAllele } from "./allele.ts";

export type ChromosomeType = 'species' | 'lifetime' | 'speed' | 'fertility' | 'flowers' | 'flowering' | 'territory' | 'effect' |
    'temperature_tol' | 'humidity_tol' | 'nocturnal' | 'rain_tolerance' | 'cave_dwelling'

const Scheme = {
    'species': 'species',
    'lifetime': 'lifetime',
    'speed': "speed",
    'fertility': 'fertility',
    'flowers': 'flowers',
    'flowering': 'flowering', 
    'territory': 'territory',
    'effect': 'effect',
    'temperature_tol': 'tolerance',
    'humidity_tol': 'tolerance',
    'nocturnal': 'boolean',
    'rain_tolerance': 'boolean',
    'cave_dwelling': 'boolean'
} as const;

type SchemeMapping<T extends ChromosomeType, M extends {[P in keyof M]: P extends ChromosomeType ? AlleleType : never}> = keyof M extends ChromosomeType ? T extends keyof M ? M[T] : never : never
export type IAlleleCompatible<T extends ChromosomeType> = SchemeMapping<T, typeof Scheme> extends never ? never : IAllele<SchemeMapping<T, typeof Scheme>> & {type: SchemeMapping<T, typeof Scheme>}

export interface IChromosome<T extends ChromosomeType> {
    alleles: [IAlleleCompatible<T>, IAlleleCompatible<T>]
    get active(): IAlleleCompatible<T>
    get inactive(): IAlleleCompatible<T>
    getAllele(active: boolean): IAlleleCompatible<T>
    inheritWith(chromosome: IChromosome<T>): IChromosome<T>
}

export class Chromosome<T extends ChromosomeType> implements IChromosome<T>{
    alleles: [IAlleleCompatible<T>, IAlleleCompatible<T>]

    get active(): IAlleleCompatible<T> {
        return this.alleles[0].dominant ? this.alleles[0] : this.alleles[1].dominant ? this.alleles[1] : this.alleles[0]
    }

    get inactive(): IAlleleCompatible<T> {
        return this.alleles[0].dominant ? this.alleles[1] : this.alleles[1].dominant ? this.alleles[0] : this.alleles[1]
    }

    getAllele(active: boolean): IAlleleCompatible<T> {
        return active ? this.active : this.inactive
    }

    toString(){
        return '[' + this.alleles[0].id + ", " + this.alleles[1] + ']'
    }

    constructor(active: IAlleleCompatible<T>, inactive?: IAlleleCompatible<T>){
        if(inactive){
            this.alleles = [active, inactive]
        }
        else {
            this.alleles = [active, active]
        }
    }
    
    inheritWith(chromosome: IChromosome<T>): IChromosome<T> {
        let selfChoice = this.alleles[randomBoolean() ? 1 : 0];
        let otherChoice = chromosome.alleles[randomBoolean() ? 1 : 0];

        let order = randomBoolean();
        return order ? new Chromosome<T>(selfChoice, otherChoice) : new Chromosome<T>(otherChoice, selfChoice)
    }
}