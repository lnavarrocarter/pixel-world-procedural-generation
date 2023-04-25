const container = document.querySelector('.container')
const sizeEl = document.querySelector('.size')
const color = document.querySelector('.color')
const resetBtn = document.getElementById('reset')
const downloadBtn = document.getElementById('download')

let size = sizeEl.value
let draw = false

function populate(size) {
    container.style.setProperty('--size', size)
    for (let i = 0; i < size * size; i++) {
        const div = document.createElement('div')
        div.classList.add('pixel')

        div.addEventListener('mouseover', function () {
            if (!draw) return
            div.style.backgroundColor = color.value
        })
        div.addEventListener('mousdown', function () {
            div.style.backgroundColor = color.value
        })

        container.appendChild(div)
    }
}

// Set draw to true when the user press down the mouse
window.addEventListener("mousedown", function () {
    draw = true
})
// Set draw to false when the user release the mouse
window.addEventListener("mouseup", function () {
    draw = false
})


function reset(){
    container.innerHTML = ''
    populate(size)
}

resetBtn.addEventListener('click', reset)

sizeEl.addEventListener('keyup', function () {
    size = (sizeEl.value > 50 )? 50 : sizeEl.value
    reset()
})

downloadBtn.addEventListener('click', function () {
    download();
})

//export design to png
function download() {
    const link = document.createElement('a');
    link.download = "image.png";
    console.log(this.canvas);
    link.href = this.canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    link.click();
}

populate(size)