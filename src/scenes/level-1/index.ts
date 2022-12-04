import { Scene, Tilemaps } from 'phaser'
import { EVENTS_NAME } from '../../constants'
import { Player } from './../../classes/Player'
import { gameObjectsToObjectPoints } from './../../helpers/gameobject-to-object-point'
import { Enemy } from './../../classes/Enemy'

export class Level1 extends Scene {
  private map!: Tilemaps.Tilemap
  private tileset!: Tilemaps.Tileset
  private wallsLayer!: Tilemaps.TilemapLayer
  private groundLayer!: Tilemaps.TilemapLayer
  private player!: Player
  private chests!: Phaser.GameObjects.Sprite[]
  enemies!: Enemy[]
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
        this.game.events.emit(EVENTS_NAME.chestLoot)
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

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint'),
    )

    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(1.5),
    )

    this.physics.add.collider(this.enemies, this.wallsLayer)
    this.physics.add.collider(this.enemies, this.enemies)
    this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1)
    })
  }

  create(): void {
    this.initMap()
    this.player = new Player(this, 100, 100)
    this.physics.add.collider(this.player, this.wallsLayer)
    this.initChests()
    this.initCamera()
    this.initEnemies()
  }

  update(): void {
    this.player.update()
  }
}
