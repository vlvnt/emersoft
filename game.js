const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: { preload, create, update },
    scale: { mode: Phaser.Scale.FIT }
};

const game = new Phaser.Game(config);
let resources = { wood: 50, gold: 30, food: 100 };
let selectedUnit = null;
const gridSize = 64;

function preload() {
    this.load.image('tile', 'assets/tile.png');
    this.load.image('worker', 'assets/worker.png');
    this.load.image('tree', 'assets/tree.png');
}

function create() {
    // Сетка 10x10
    this.grid = this.add.group();
    for (let y = 0; y < 10; y++) {
        for (let x = 0; x < 10; x++) {
            const tile = this.add.image(x * gridSize, y * gridSize, 'tile')
                .setAlpha(0.3)
                .setInteractive()
                .on('pointerdown', () => {
                    if (selectedUnit) moveUnit(this, selectedUnit, x, y);
                });
            this.grid.add(tile);
        }
    }

    // Юниты и ресурсы
    this.units = this.add.group();
    spawnUnit(this, 3, 3, 'worker');
    spawnResource(this, 7, 2, 'tree');

    // Интерфейс
    this.resourcesText = this.add.text(10, 10, getResourcesText(), {
        font: '18px Arial',
        fill: '#fff',
        backgroundColor: '#000'
    });
}

function update() { }

function spawnUnit(scene, x, y, type) {
    const unit = scene.add.sprite(x * gridSize, y * gridSize, type)
        .setInteractive()
        .on('pointerdown', () => {
            selectedUnit = unit;
            highlightTiles(scene, unit);
        });
    scene.units.add(unit);
    return unit;
}

function spawnResource(scene, x, y, type) {
    const res = scene.add.sprite(x * gridSize, y * gridSize, type)
        .setData('type', type);
    return res;
}

function moveUnit(scene, unit, targetX, targetY) {
    scene.tweens.add({
        targets: unit,
        x: targetX * gridSize,
        y: targetY * gridSize,
        duration: 300,
        onComplete: () => {
            updateEconomy(scene);
        }
    });
}

function updateEconomy(scene) {
    // Производство
    resources.wood += 1;
    resources.food -= 1;

    // Обновляем текст
    scene.resourcesText.setText(getResourcesText());
}

function getResourcesText() {
    return `Дерево: ${resources.wood} | Золото: ${resources.gold} | Еда: ${resources.food}`;
}

function highlightTiles(scene, unit) {
    scene.grid.getChildren().forEach(tile => tile.setAlpha(0.3));
    const unitX = Math.floor(unit.x / gridSize);
    const unitY = Math.floor(unit.y / gridSize);
    
    // Подсвечиваем соседние клетки
    for (let y = unitY - 1; y <= unitY + 1; y++) {
        for (let x = unitX - 1; x <= unitX + 1; x++) {
            if (x >= 0 && x < 10 && y >= 0 && y < 10) {
                scene.grid.getChildren()[y * 10 + x].setAlpha(0.7);
            }
        }
    }
}
