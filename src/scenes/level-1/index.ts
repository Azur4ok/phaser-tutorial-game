import { Scene, Tilemaps } from 'phaser'
import { Player } from './../../classes/Player'
import { gameObjectsToObjectPoints } from './../../helpers/gameobject-to-object-point'

export class Level1 extends Scene {
  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  private groundLayer!: Tilemaps.TilemapLayer
  private player!: Player
  private chests!: Phaser.GameObjects.Sprite[]
  public constructor() {
    super('level-1-scene')
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 })
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles')
    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0)
    this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0)
    this.wallsLayer.setCollisionByProperty({ collides: true })
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height)
  }

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Chests', (obj) => obj.name === 'ChestPoint'),
    )
    this.chests = chestPoints.map((chestPoint: { x: number; y: number }) =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
    )
    this.chests.forEach((chest) => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        obj2.destroy()
        this.cameras.main.flash()
      })
    })
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height)
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09)
    this.cameras.main.setZoom(2)
  }

  create(): void {
    this.initMap()
    this.player = new Player(this, 100, 100)
    this.physics.add.collider(this.player, this.wallsLayer)
    this.initChests()
    this.initCamera()
  }

  update(): void {
    this.player.update()
  }
}
