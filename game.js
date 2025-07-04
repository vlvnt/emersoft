const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: { debug: false }
    }
};

const game = new Phaser.Game(config);
let player, cursors, trees, resourcesText;
let resources = { wood: 0 };

function preload() {
    this.load.image('player', 'assets/player.png');
    this.load.image('tree', 'assets/tree.png');
    this.load.image('tiles', 'assets/tiles.png');
}

function create() {
    // Фон
    this.add.image(400, 300, 'tiles').setScale(2);

    // Игрок
    player = this.physics.add.sprite(400, 300, 'player');
    player.setCollideWorldBounds(true);

    // Деревья
    trees = this.physics.add.staticGroup();
    trees.create(200, 200, 'tree');
    trees.create(500, 400, 'tree');

    // Текст ресурсов
    resourcesText = this.add.text(10, 10, 'Дерево: 0', {
        font: '16px Arial',
        fill: '#ffffff',
        backgroundColor: '#000000'
    });

    // Управление
    cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(player, trees, collectTree, null, this);
}

function update() {
    player.setVelocity(0);
    if (cursors.left.isDown) player.setVelocityX(-100);
    else if (cursors.right.isDown) player.setVelocityX(100);
    if (cursors.up.isDown) player.setVelocityY(-100);
    else if (cursors.down.isDown) player.setVelocityY(100);
}

function collectTree(player, tree) {
    tree.destroy();
    resources.wood += 1;
    resourcesText.setText(`Дерево: ${resources.wood}`);
}