export function chiSquaredTest(samples: string[]): number {
  const bins: { [key: string]: number } = {}

  for (const sample of samples) {
    if (bins[sample]) {
      bins[sample] += 1
    } else {
      bins[sample] = 1
    }
  }

  // chi-squared test for uniformity
  let chiSquared = 0
  const expected = samples.length / Object.keys(bins).length
  const keys: any[] = Object.keys(bins)
  for (let i = 0; i < keys.length; i++) {
    chiSquared += (bins[keys[i]] - expected) ** 2 / expected
  }
  return chiSquared
}
