import { GameObjects, Scene } from 'phaser'
import { Player } from './../../classes/Player'

export class Level1 extends Scene {
  private player!: Player
  public constructor() {
    super('level-1-scene')
  }

  create(): void {
    this.player = new Player(this, 100, 100)
  }

  update(): void {
    this.player.update()
  }
}
