import { RegistryClass, makeTypedRegistry } from "../common/registry.ts";
import { EffectProvider, FlowerProvider, BeeSpecies } from "./allelevalues.ts";

export type AlleleType = 'species' | 'lifetime' | 'speed' | 'fertility' | 'flowers' | 'flowering' | 'territory' | 'effect' | 'tolerance' | 'boolean'

export type ValueScheme = {
    'species': BeeSpecies,
    'lifetime': number,
    'speed': number,
    'fertility': 1 | 2 | 3 | 4,
    'flowers': FlowerProvider,
    'flowering': number, 
    'territory': [number, number, number],
    'effect': EffectProvider,
    'tolerance': [number, number]
    'boolean': boolean
}

type SchemeMapping<T extends AlleleType, M extends {[P in keyof M]: P extends AlleleType ? any : never}> = keyof M extends AlleleType ? T extends keyof M ? M[T] : never : never
export type IAlleleValue<T extends AlleleType> = SchemeMapping<T, ValueScheme>


export interface IAllele<T extends AlleleType> {
    id: string;
    type: T;
    get name(): string;
    dominant: boolean;
    value: IAlleleValue<T>
}

export class Allele<T extends AlleleType> extends RegistryClass implements IAllele<T> {
    readonly dominant: boolean
    readonly value: IAlleleValue<T>

    type: T 

    get name() {
        return "allele." + this.type + "." + this.id
    }

    constructor(value: IAlleleValue<T>, dominant? : boolean){
        super();
        this.value = value
        this.dominant = dominant ? true : false
    }
}

export class Alleles {
    static Species = makeTypedRegistry('species', {
        "forest": new Allele<'species'>(new BeeSpecies({"fertility": () => Alleles.Fertility.high}), true),
        "meadows": new Allele<'species'>(new BeeSpecies({}), true),
        "common": new Allele<'species'>(new BeeSpecies({}), true),
        "cultivated": new Allele<'species'>(new BeeSpecies({}), true),

        "noble": new Allele<'species'>(new BeeSpecies({}), false),
        "majestic": new Allele<'species'>(new BeeSpecies({}), true),
        "imperial": new Allele<'species'>(new BeeSpecies({}), false),

        "diligent": new Allele<'species'>(new BeeSpecies({}), false),
        "unweary": new Allele<'species'>(new BeeSpecies({}), true),
        "industrious": new Allele<'species'>(new BeeSpecies({}), false),

        "valiant": new Allele<'species'>(new BeeSpecies({}), true),
        "steadfast": new Allele<'species'>(new BeeSpecies({}), false),
        "heroic": new Allele<'species'>(new BeeSpecies({}), false)
    })

    static Life = makeTypedRegistry('lifetime', {
        "shortest": new Allele<'lifetime'>(10),
        "shorter": new Allele<'lifetime'>(20, true),
        "short": new Allele<'lifetime'>(30, true),
        "shortened": new Allele<'lifetime'>(35, true),
        "normal": new Allele<'lifetime'>(40),
        "enlongated": new Allele<'lifetime'>(45, true),
        "long": new Allele<'lifetime'>(50),
        "longer": new Allele<'lifetime'>(60),
        "longest": new Allele<'lifetime'>(70)
    })

    static Speed = makeTypedRegistry('speed', {
        "slowest": new Allele<'speed'>(0.3, true),
        "slower": new Allele<'speed'>(0.6, true),
        "slow": new Allele<'speed'>(0.8, true),
        "normal": new Allele<'speed'>(1.0),
        "fast": new Allele<'speed'>(1.2, true),
        "faster": new Allele<'speed'>(1.4),
        "fastest": new Allele<'speed'>(1.7)
    })

    static Fertility = makeTypedRegistry('fertility', {
        "low": new Allele<'fertility'>(1, true),
        "normal": new Allele<'fertility'>(2, true),
        "high": new Allele<'fertility'>(3),
        "maxium": new Allele<'fertility'>(4)
    })

    static Flowers = makeTypedRegistry('flowers', {
        "vanilla": new Allele<'flowers'>(new FlowerProvider(), true),
        "nether": new Allele<'flowers'>(new FlowerProvider()),
        "cacti": new Allele<'flowers'>(new FlowerProvider()),
        "mushroom": new Allele<'flowers'>(new FlowerProvider()),
        "end": new Allele<'flowers'>(new FlowerProvider()),
        "jungle": new Allele<'flowers'>(new FlowerProvider()),
        "snow": new Allele<'flowers'>(new FlowerProvider(), true),
        "wheat": new Allele<'flowers'>(new FlowerProvider(), true),
        "gourd": new Allele<'flowers'>(new FlowerProvider(), true)
    })

    static Flowering = makeTypedRegistry('flowering', {
        "slowest": new Allele<'flowering'>(5, true),
        "slower": new Allele<'flowering'>(10),
        "slow": new Allele<'flowering'>(15),
        "average": new Allele<'flowering'>(20),
        "fast": new Allele<'flowering'>(25),
        "faster": new Allele<'flowering'>(30),
        "fastest": new Allele<'flowering'>(35),
        "maxium": new Allele<'flowering'>(99, true)
    })

    static Territory = makeTypedRegistry('territory', {
        "average": new Allele<'territory'>([9, 6, 9]),
        "large": new Allele<'territory'>([11, 8, 11]),
        "larger": new Allele<'territory'>([13, 12, 13]),
        "largest": new Allele<'territory'>([15, 13, 15])
    })

    static Effect = makeTypedRegistry('effect', {
        "none": new Allele<'effect'>(new EffectProvider(), true),
        "beautific": new Allele<'effect'>(new EffectProvider()),
        "exploration": new Allele<'effect'>(new EffectProvider())
    })

    static Tolerance = makeTypedRegistry('tolerance', {
        "none": new Allele<'tolerance'>([0, 0]),
        "up_1": new Allele<'tolerance'>([1, 0], true),
        "up_2": new Allele<'tolerance'>([2, 0]),
        "down_1": new Allele<'tolerance'>([0, 1], true),
        "down_2": new Allele<'tolerance'>([0, 2]),
        "both_1": new Allele<'tolerance'>([1, 1], true),
        "both_2": new Allele<'tolerance'>([2, 2])
    })

    static Boolean = makeTypedRegistry('boolean', {
        "true": new Allele<'boolean'>(true),
        "false": new Allele<'boolean'>(false)
    })
}