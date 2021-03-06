import { IQuantumGate } from '../types/quantumGate';

export default class Not implements IQuantumGate {
  private modifier: number[][];
  private twoBitmodifier: number[][];
  public constructor() {
    this.modifier = [[0, 1], [1, 0]];
    this.twoBitmodifier = [
      [0, 0, 0, 1],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [1, 0, 0, 0]
    ];
  }

  public getModifier() {
    return this.modifier;
  }

  public getTwoBitModifier() {
    return this.twoBitmodifier;
  }
}
