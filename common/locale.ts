const localeCN = {
    "chromosomes.species": "品种",
    "chromosomes.lifetime": "寿命",
    "chromosomes.speed": "工作速度",
    "chromosomes.fertility": "生育能力",
    "chromosomes.flowers": "采蜜对象",
    "chromosomes.flowering": "授粉速度",
    "chromosomes.territory": "活动范围",
    "chromosomes.effect": "特殊效果",
    "chromosomes.temperature_tol": "温度适性",
    "chromosomes.humidity_tol": "湿度适性",
    "chromosomes.nocturnal": "夜行性",
    "chromosomes.rain_tolerance": "耐雨飞行",
    "chromosomes.cave_dwelling": "穴居性",
    "allele.species.forest": "森林",
    "allele.species.meadows": "草原",
    "allele.speed.slowest": "最慢速",
    "allele.lifetime.shorter": "较短寿",
    "allele.fertility.normal": "2x",
    "allele.fertility.high": "3x",
    "allele.flowers.vanilla": "鲜花",
    "allele.flowering.slowest": "最慢速",
    "allele.territory.average": "平均",
    "allele.effect.none": "无效果",
    "allele.tolerance.none": "无",
    "allele.boolean.false": "否",
    "phenotype": "表现型"
}

export function translate(key: string){
    return key in localeCN ? localeCN[key] : key
}