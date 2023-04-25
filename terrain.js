class WorldGenerator {

    

    constructor() {
        this.noise = '';
        this.colourPalettes = {
            green: [
                '#438a46',
                '#449647',
                '#4CAF50',
                '#8BC34A',
                '#f1e556',
                '#30bfff',
                '#19b7ff',
                '#06A9F3',
                '#2196F3'
            ],
            snow: [
                '#DEE3E3',
                '#EDF0F0',
                '#F2FEFF',
                '#DAE6E3',
                '#B3C9CB'
            ]
        };
        this.colourPalette = 'green';
        this.seed = 'AAAAA';
        this.canvas = document.querySelector('#c');
        this.ctx = this.canvas.getContext('2d');
        this.pixelScale = 2;
        this.noiseScale = 50;
        this.terrainHeight = 5;
        this.waterLevel = 2;
        this.colours = [];
        this.treeProbability = 0.56;
        this.HomeChance = 0.8;
        this.treeColour = ['#4b8c3e'];
        this.houseColours = ['#8B4513', '#A0522D', '#D2691E', '#CD853F'];
        this.personColours = ['#FFA07A', '#FF4500', '#DC143C', '#FF69B4'];
        this.treesRendered = true;
        this.personChance = 0.15;

        this.housePixels = [
            [null, null, null, null, 0, 0, null, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 2, 2, 1, 1, null, null],
            [null, 1, 1, 2, 2, 2, 2, 1, 1, null],
            [1, 1, 2, 2, 2, 2, 2, 2, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [null, null, 3, 3, null, null, 3, 3, null, null],
            [null, null, 3, 3, null, null, 3, 3, null, null]
        ];

        this.treePixels = [
            [null, null, null, null, 0, 0, null, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 1, 1, 1, 1, null, null],
            [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, 1, 1, 1, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, null, 1, 1, null, null, null, null]
        ];

        this.personPixels = [
            [null, null, null, null, 0, 0, null, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, 1, 1, 1, 1, 1, 1, null, null],
            [null, null, null, null, null, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
            [null, 1, 1, 1, 1, 1, 1, 1, 1, null],
            [null, null, 1, 1, 1, 1, 1, 1, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, 1, 1, 1, 1, null, null, null],
            [null, null, null, null, 1, 1, null, null, null, null]
        ];
    
        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    onWindowResize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.loadSeed();
    }

    loadColours() {
        const colourPalette = this.colourPalette;
        switch (colourPalette) {
            case 'green':
                this.colours = this.colourPalettes.green;
                this.treeColour = '#4b8c3e';
                this.treeDarkColour = '#3c7b3f';
                break;
            case 'snow':
                this.colours = this.colourPalettes.snow;
                this.treeColour = '#d2d9e3';
                this.treeDarkColour = '#d2d9e3';
                break;
        }
        this.drawCanvas();
    }

    genSeed() {
        const seed = Array.apply(null, Array(5)).map(this.genSeedChar);
        const seedString = seed.join('');
        return seedString;
    }

    genSeedChar() {
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';
        const seedNum = Math.floor(Math.random() * (25 - 0 + 1) + 0);
        const seedChar = alphabet[seedNum];
        return seedChar;
    }

    generateNewMap() {
        this.seed = this.genSeed();
        this.noise = noise.seed(this.seed);
        this.loadColours();
        this.drawCanvas();
    }

    loadSeed() {
        this.noise = noise.seed(this.seed);
        this.drawCanvas();
    }

    drawCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let y = 0; y < Math.ceil(this.canvas.height / this.pixelScale); y++) {
            for (let x = 0; x < Math.ceil(this.canvas.width / this.pixelScale); x++) {
                const colourIndex = noise.simplex2(x / this.noiseScale, y / this.noiseScale) * this.terrainHeight + this.waterLevel;
                let pixelColour = '';
                if (colourIndex < 0) {
                    pixelColour = this.colours[0];
                } else if (colourIndex > this.colours.length - 1) {
                    pixelColour = this.colours[this.colours.length - 1];
                } else {
                    pixelColour = this.colours[~~colourIndex];
                }
                if (this.shouldDrawHouse(x, y)) {
                    this.drawObject(this.housePixels, x, y, this.houseColours);
                } else if (this.shouldDrawTree(x, y)) {
                    this.drawObject(this.treePixels, x, y, this.treeColours);
                } else if (this.shouldDrawPerson(x, y)) {
                    this.drawObject(this.personPixels, x, y, this.personColours);
                } else {
                    this.ctx.fillStyle = this.addDetails(pixelColour, x, y);
                    this.ctx.fillRect(x * this.pixelScale, y * this.pixelScale, this.pixelScale, this.pixelScale);
                }
            }
        }
    }

    addDetails(pixelColour, x, y) {
        const noiseDetailChance = noise.simplex2(x / this.noiseScale, y / this.noiseScale) % 0.002;

        if (pixelColour === this.colours[2] ||
            pixelColour === this.colours[1]) {
            if (noiseDetailChance < this.treeProbability) {
                pixelColour = this.treeColour;
            }
        } else if (pixelColour === this.colours[0] && noiseDetailChance > -this.treeChance) {
            pixelColour = this.treeDarkColour;
        }
        return pixelColour;
    }

    drawObject(pixels, x, y, colourPalette) {
        for (let i = 0; i < pixels.length; i++) {
            for (let j = 0; j < pixels[i].length; j++) {
                if (pixels[i][j] !== null) {
                    this.ctx.fillStyle = colourPalette[Math.floor(Math.random() * colourPalette.length)];
                    this.ctx.fillRect((x + j) * this.pixelScale, (y + i) * this.pixelScale, this.pixelScale, this.pixelScale);
                }
            }
        }
    }

    shouldDrawHouse(x, y) {
        return noise.simplex2(x / this.noiseScale, y / this.noiseScale) % 0.002 > this.HomeChance;
    }

    shouldDrawPerson(x, y) {
        return noise.simplex2(x / this.noiseScale, y / this.noiseScale) % 0.002 > this.personChance;
    }

    shouldDrawTree(x, y) {
        return noise.simplex2(x / this.noiseScale, y / this.noiseScale) % 0.002 > this.threeChance;
    }

    downloadImage() {
        const link = document.createElement('a');
        link.download = "test.png";
        console.log(this.canvas);
        link.href = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
        link.click();
    }
        
}
