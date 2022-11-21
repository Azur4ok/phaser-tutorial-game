import { GameObjects, Scene } from 'phaser'

export class LoadingScene extends Scene {
  public constructor() {
    super('loading-scene')
  }

  preload(): void {
    this.load.baseURL = 'assets/'

    this.load.image('king', 'sprites/king.png')

    this.load.atlas('a-king', 'spritesheets/a-king.png', 'spritesheets/a-king_atlas.json')
  }

  create(): void {
    this.scene.start('level-1-scene')
    console.log('loading scene was created')
  }
}
