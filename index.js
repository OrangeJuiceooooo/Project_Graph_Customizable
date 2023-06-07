// const width = 1261;
// const height = 834;
let width = 1000;
let height = 1000;
let iterations = 200000;
let height_compression_rate = 10;
let init_maximum = 300;

var initial = 0;
var Canvas = document.getElementById('Canvas');
var ctx = Canvas.getContext('2d');
var Graph = document.getElementById('Graph');
var Graph_Context = Graph.getContext('2d');
var grid;
var total = 0;
var data_y;
var finalData;
var animationID = 0;
var CanvasImages;
var GraphImages;

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.save();
}

function isTouched(x, y) {
    let isXZero = x == 0;
    let isYZero = y == 0;
    let isXWidth = x == width - 1;
    let isYHeight = y == height - 1;
    let result = false;

    if (isXZero) {
        if (isYZero) {
            result = grid[1][0] || grid[0][1];
            // return result
        } else if (isYHeight) {
            result = grid[1][y] || grid[0][y - 1];
            // return result;
        } else {
            result = grid[0][y + 1] || grid[0][y - 1] || grid[1][y];
            // return result;
        }
    } else if (isXWidth) {
        if (isYZero) {
            result = grid[x][y + 1] || grid[x - 1][y];
            // return result;
        } else if (isYHeight) {
            result = grid[x][y - 1] || grid[x - 1][y];
            // return result
        } else {
            result = grid[x][y - 1] || grid[x][y + 1] || grid[x - 1][y];
            // return result;
        }
    } else {
        if (isYZero) {
            result = grid[x][1] || grid[x - 1][0] || grid[x + 1][0];
            // return result;
        } else if (isYHeight) {
            result = grid[x][y - 1] || grid[x - 1][y] || grid[x + 1][y];
            // return result;
        } else {
            result = grid[x][y - 1] || grid[x - 1][y] || grid[x + 1][y] || grid[x][y + 1];
            // return result;
        }
    }
    return result;
}

function clearCanvas(TheCanvas, CanvasContext) {
    CanvasContext.clearRect(0, 0, TheCanvas.width, TheCanvas.height);
}

function clear2DArrayFalse(TwoDimensionalArray) {
    for (let index = 0; index < TwoDimensionalArray.length; index++) {
        TwoDimensionalArray[index].fill(false);
    }
}

function clear2DArrayInteger(TwoDimensionalArray) {
    for (let index = 0; index < TwoDimensionalArray.length; index++) {
        TwoDimensionalArray[index].fill(0);
    }
}

function getrandomWalk(x, y) {
    let x1 = x;
    let y1 = y;
    const isX = Math.random() < 0.5;
    const isAddition = Math.random() < 0.5;
    if (isX) {
        x1 += isAddition ? 1 : -1;
    } else {
        y1 += isAddition ? 1 : -1;
    }
    if (x1 < 0 || x1 == width || y1 < 0 || y1 == height) {
        return getrandomWalk(x, y);
    }
    return [x1, y1];
}

function getRandomStartingPoint() {
    return [width - 1, getRandomInt(0, height - 1)];
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function setPixel(x, y) {
    ctx.fillStyle = '#000';
    ctx.fillRect(x, y, 1, 1);
}

function setGraphPixel(x, y) {
    Graph_Context.fillStyle = '#000';
    Graph_Context.fillRect(x, y, 1, 1);
}

function run() {

    // design Initial figures
    // grid[0].fill(true);
    // drawLine(0, 0, 0, height - 1);
    // let initial = 10;
    for (let i = 0; i < height; i++) {
        let y = i;
        let radians = y * (Math.PI / 180);
        let x = Math.round(initial * Math.sin(radians)) + init_maximum;
        grid[x][y] = true;
        setPixel(x, y);
    }
    runFunc();

}

function runFunc() {
    putdots();
    total++;
    // if (total % 10 == 0) {
    //     console.log(total);

    // }

    // if (!reachTarget) {
    if (total % 10 == 0) {
        console.log(total);
    }
    animationID = requestAnimationFrame(runFunc);
    // }
}

function putdots() {
    let position = getRandomStartingPoint();
    while (!isTouched(position[0], position[1])) {
        position = getrandomWalk(position[0], position[1]);
    }
    grid[position[0]][position[1]] = true;

    //this segment 
    setPixel(position[0], position[1]);
    if (data_y[position[0]] == 0) {
        data_y[position[0]] = total;
        setGraphPixel(position[0], total / height_compression_rate);
        if (data_y[data_y.length - 1] != 0) {
            cancelAnimationFrame(animationID);
            runFunctionFunction(initial + 1);
        }

    }
}

function runFunctionFunction(amplitude) {
    if (initial <= init_maximum) {
        const CanvasImage = new Image();
        CanvasImage.src = Canvas.toDataURL();
        CanvasImages[initial] = CanvasImage;

        const GraphImage = new Image();
        GraphImage.src = Graph.toDataURL();
        GraphImages[initial] = GraphImage;


        finalData[initial] = total;
        initial = amplitude;
        clear2DArrayFalse(grid);
        total = 0;
        data_y.fill(0);
        clearCanvas(Canvas, ctx);
        clearCanvas(Graph, Graph_Context);
        run();
    }
    if (initial - 1 == init_maximum) {
        var zip = new JSZip();
        var CanvasZip = zip.folder("Canvas");
        var GraphZip = zip.folder("Graph");
        const linkElement = document.getElementById('download-link');

        CanvasImages.forEach((imageData, index) => {
            // fetch(imageData)
            //     .then(res => res.blob)
            //     .then(blob => {
            //         CanvasZip.file(`image-${index}.png`, blob);
            //     });
            CanvasZip.file("image_" + index + ".png", imageData.src.split(',')[1], { base64: true });
        });
        GraphImages.forEach((imageData, index) => {
            // fetch(imageData)
            //     .then(res => res.blob)
            //     .then(blob => {
            //         GraphZip.file(`image-${index}.png`, blob);
            //     });
            GraphZip.file("image_" + index + ".png", imageData.src.split(',')[1], { base64: true });
        });


        //CSV file
        var CSVString = "";
        CSVString += width + "x" + height + "\n";
        for (let index = 0; index < finalData.length; index++) {
            const element = finalData[index];
            CSVString += index + "," + element + "\n";
        }

        zip.file("result.csv", CSVString);





        zip.generateAsync({ type: 'blob' })
            .then(blob => {
                const linkElement = document.getElementById('download-link');
                linkElement.href = URL.createObjectURL(blob);
                linkElement.download = "result.zip";
                linkElement.click();
            });

        //try download only one image
        // linkElement.href = GraphImages[0].src;
        // linkElement.download = "image.png";
        // linkElement.click();


    }
}


//Init logic

//Create empty 2d array






document.getElementById("button").onclick = function() {
    let anythingWrong = false;

    width = parseInt(document.getElementById('width-input').value);
    height = parseInt(document.getElementById('height-input').value);
    iterations = parseInt(document.getElementById('iterations-input').value);
    height_compression_rate = parseInt(document.getElementById('height-compression-rate-input').value);
    init_maximum = parseInt(document.getElementById('init-maximum-input').value);
    initial = parseInt(document.getElementById('initial-input').value);

    if (!anythingWrong) {

        grid = new Array(width);
        for (let index = 0; index < grid.length; index++) {
            grid[index] = new Array(height);
            grid[index].fill(false);
        }



        data_y = new Array(width);
        finalData = new Array(init_maximum);
        CanvasImages = new Array(init_maximum + 1);
        GraphImages = new Array(init_maximum + 1);
        // data_x.fill(0);
        data_y.fill(0);

        Canvas.width = width;
        Canvas.height = height;

        Graph.width = width;
        Graph.height = iterations / height_compression_rate;

        // Graph.width = max_amplitude;
        // Graph.height = 1000;
        run();
    }
};