
const canvas = document.getElementById('canvas');
const refreshImagesBtn = document.getElementById('refreshImagesBtn');
const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');
const infoBtn = document.getElementById('infoBtn');
const instructionDialog = document.getElementById('instructionDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
const saveBtn = document.getElementById('saveBtn');
saveBtn.addEventListener('click', () => {
    const toolbar = document.getElementById('toolbar');
    toolbar.classList.add('hidden');

    setTimeout(() => {
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = drawingCanvas.width;
        exportCanvas.height = drawingCanvas.height;
        const exportCtx = exportCanvas.getContext('2d');

        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = currentBackgroundImage;

        bgImg.onload = () => {
            exportCtx.drawImage(bgImg, 0, 0, exportCanvas.width, exportCanvas.height);

            const imgElements = Array.from(canvas.querySelectorAll('img'));
            let loadedCount = 0;

            if (imgElements.length === 0) {
                drawOverlayAndSave();
                return;
            }

            imgElements.forEach(img => {
                const temp = new Image();
                temp.crossOrigin = 'anonymous';
                temp.src = img.src;

                temp.onload = () => {
                    const canvasRect = canvas.getBoundingClientRect();
                    const imgRect = img.getBoundingClientRect();

                    const x = imgRect.left - canvasRect.left;
                    const y = imgRect.top - canvasRect.top;

                    exportCtx.globalCompositeOperation = img.style.mixBlendMode || 'source-over';
                    exportCtx.drawImage(temp, x, y, img.width, img.height);

                    loadedCount++;
                    if (loadedCount === imgElements.length) drawOverlayAndSave();
                };

                temp.onerror = () => {
                    loadedCount++;
                    if (loadedCount === imgElements.length) drawOverlayAndSave();
                };
            });
        };

        bgImg.onerror = () => {
            drawOverlayAndSave(); // fallback if background doesn't load
        };

        function drawOverlayAndSave() {
            exportCtx.globalCompositeOperation = 'overlay';
            exportCtx.drawImage(drawingCanvas, 0, 0);

            const link = document.createElement('a');
            link.download = 'tableaux-collage.png';
            link.href = exportCanvas.toDataURL('image/png');
            link.click();

            toolbar.classList.remove('hidden');
        }
    }, 100);
});
console.log("Drawing complete, preparing to save.");


const toggleDrawBtn = document.getElementById('toggleDrawBtn');
const colorPicker = document.getElementById('colorPicker');
const undoBtn = document.getElementById('undoBtn');

let drawingEnabled = false;
let currentColor = '#ffffff';
let isDrawing = false;
let drawingHistory = [];

// Drawing Canvas Setup
const drawingCanvas = document.getElementById('drawingCanvas');
const ctx = drawingCanvas.getContext('2d');
drawingCanvas.width = canvas.offsetWidth;
drawingCanvas.height = canvas.offsetHeight;
drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));


window.addEventListener('resize', () => {
    drawingCanvas.width = canvas.offsetWidth;
    drawingCanvas.height = canvas.offsetHeight;
});

// Toggle Drawing Mode
toggleDrawBtn.addEventListener('click', () => {
    drawingEnabled = !drawingEnabled;
    drawingCanvas.style.pointerEvents = drawingEnabled ? 'auto' : 'none';
    drawingCanvas.style.cursor = drawingEnabled ? 'crosshair' : 'default';
    toggleDrawBtn.style.backgroundColor = drawingEnabled ? 'white' : 'black';
    toggleDrawBtn.style.color = drawingEnabled ? 'black' : 'white';
});

// Color Picker
colorPicker.addEventListener('input', e => {
    currentColor = e.target.value;
});

// Undo Button
undoBtn.addEventListener('click', () => {
    if (drawingHistory.length > 0) {
        const previousState = drawingHistory.pop();
        ctx.putImageData(previousState, 0, 0);
    }
});

// Drawing Events
drawingCanvas.addEventListener('mousedown', e => {
    if (!drawingEnabled) return;
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

drawingCanvas.addEventListener('mousemove', e => {
    if (!isDrawing || !drawingEnabled) return;
    ctx.lineTo(e.offsetX, e.offsetY);
ctx.strokeStyle = currentColor;
ctx.lineWidth = 4;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';

// 🌟 Glow effect
ctx.shadowBlur = 10;
ctx.shadowColor = currentColor;

ctx.stroke();

});

drawingCanvas.addEventListener('mouseup', () => {
    isDrawing = false;

    if (drawingEnabled) {
        drawingHistory.push(ctx.getImageData(0, 0, drawingCanvas.width, drawingCanvas.height));
        if (drawingHistory.length > 30) {
            drawingHistory.shift();
        }
    }
});

// Image Libraries
const imageLibrary = [
    'images/harpercourt-girls-undated.jpg',
    'images/lips.jpg',
    'images/lips-text.jpg',
    'images/luvs.png',
    'images/eye-makeup.jpg',
    'images/royal woman.png',
    'images/bob-marley-casket.jpg',
    'images/hands.jpg',
    'images/lady in red.png',
    'images/girls-jumping-rope.jpg',
    'images/black-carpet-text.jpg',
    'images/pleasure.png',
    'images/goodtimes.jpg',
    'images/black-diva.jpg',
    'images/murrays.jpg',
    'images/umbrella-boy-dog.png',
    'images/priest.png',
    'images/ebony-fashion-fair.jpg',
    'images/couple-dancing.png',
    'images/woman-microscope.png',
];


const backgroundLibrary = [
    'images/5042-5052-s-drexel.jpg',
    'images/5042-5052SDrexel-undated.jpg',
    'images/5626-s-kimbark-kitchen.jpg',
    'images/harpercourt-shop.jpg',
    'images/6119-s-vernon-livingroom.jpg',
    'images/6530-s-university-car.jpg',
    'images/2970-w-harrison-livingroom-1970.jpg',
    'images/salem-baptist-church-215-w-71-st-1971.jpg',
    'images/4823-s-kimbark-dining-1967.jpg',
    'images/5312-s-hyde-park-entrance-1967.jpg',
    'images/1164-e-54-st-ceiling-1967.jpg',
    'images/6119-s-vernon-bath.jpg',
    'images/4801-15-w-washington-blvd-livingroom-child-1969.jpg',
    'images/salem-baptist-church-view-of-pews.jpg'
];

// Shuffle Utility
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function loadRandomImages() {
    canvas.innerHTML = '';
    const shuffledImages = shuffle([...imageLibrary]);
    const blendModes = ['hard-light', 'overlay', 'lighten', 'multiply'];

    shuffledImages.slice(0, 6).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'img-item';

        const maxWidth = 300;
        const randomScale = Math.random() * 0.5 + 0.5;
        const randomWidth = maxWidth * randomScale;
        img.style.width = `${randomWidth}px`;
        img.style.height = 'auto';

        const left = Math.random() * (canvas.offsetWidth - randomWidth);
        const top = Math.random() * (canvas.offsetHeight - randomWidth);
        const blendMode = blendModes[Math.floor(Math.random() * blendModes.length)];
        img.style.mixBlendMode = blendMode;

        // Create wrapper
        const wrapper = document.createElement('div');
        img.classList.add('drifting'); // 
        img.style.animationDelay = `${Math.random() * 10}s`;
        wrapper.className = 'img-wrapper drifting';
        wrapper.style.position = 'absolute';
        wrapper.style.left = `${left}px`;
        wrapper.style.top = `${top}px`;
        wrapper.style.width = `${randomWidth}px`;
        wrapper.style.height = `${img.offsetHeight}px`;
        wrapper.style.userSelect = 'none';

        // Prevent browser drag/select
        img.draggable = false;
        img.style.userSelect = 'none';

        img.style.position = 'relative';
        img.style.left = '0px';
        img.style.top = '0px';

        // Resize handle
        const handle = document.createElement('div');
        handle.className = 'resize-handle';
        handle.style.display = 'none';

        // Show/hide handle on hover
        wrapper.addEventListener('mouseenter', () => {
            handle.style.display = 'block';
        });
        wrapper.addEventListener('mouseleave', () => {
            handle.style.display = 'none';
        });

        // Resize logic
        let isResizing = false;
        handle.addEventListener('mousedown', e => {
            e.stopPropagation();
            isResizing = true;

            const startX = e.clientX;
            const startWidth = img.offsetWidth;

            const onMouseMove = e => {
                if (!isResizing) return;
                const dx = e.clientX - startX;
                const newWidth = Math.max(50, startWidth + dx);
                img.style.width = `${newWidth}px`;

                // Update wrapper size to match image
                requestAnimationFrame(() => {
                    const newHeight = img.offsetHeight;
                    wrapper.style.width = `${newWidth}px`;
                    wrapper.style.height = `${newHeight}px`;
                });
            };

            const onMouseUp = () => {
                isResizing = false;
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        // Drag logic
        let isDragging = false;
        let moveWrapper;

        wrapper.addEventListener('click', e => {
            isDragging = !isDragging;

            if (isDragging) {
                wrapper.style.cursor = 'grabbing';
                wrapper.style.zIndex = 1000;

                moveWrapper = e => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left - wrapper.offsetWidth / 2;
                    const y = e.clientY - rect.top - wrapper.offsetHeight / 2;

                    wrapper.style.left = `${x}px`;
                    wrapper.style.top = `${y}px`;
                };

                document.addEventListener('mousemove', moveWrapper);
            } else {
                wrapper.style.cursor = 'grab';
                wrapper.style.zIndex = '';
                document.removeEventListener('mousemove', moveWrapper);
            }
        });

        // Assemble
        wrapper.appendChild(img);
        wrapper.appendChild(handle);
        canvas.appendChild(wrapper);
    });
}






let currentBackgroundImage = null;

function changeBackground() {
    const randomBackground = backgroundLibrary[Math.floor(Math.random() * backgroundLibrary.length)];
    currentBackgroundImage = randomBackground; // ✅ store it
    canvas.style.backgroundImage = `url(${randomBackground})`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundRepeat = 'no-repeat';
}


function clearCanvas() {
    canvas.innerHTML = '';
    ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingHistory = [];
}


closeDialogBtn.addEventListener('click', () => {
    instructionDialog.classList.add('hidden');
});

infoBtn.addEventListener('click', () => {
    document.getElementById('info').scrollIntoView({
        behavior: 'smooth'
    });
});

document.getElementById('backToTableauxBtn').addEventListener('click', () => {
    document.getElementById('canvas').scrollIntoView({
        behavior: 'smooth'
    });
});

refreshImagesBtn.addEventListener('click', loadRandomImages);
changeBackgroundBtn.addEventListener('click', changeBackground);
clearCanvasBtn.addEventListener('click', clearCanvas);
saveBtn.addEventListener('click', () => {
    const toolbar = document.getElementById('toolbar');
    toolbar.classList.add('hidden');

    // Short delay to ensure it's hidden before capture
    setTimeout(() => {
        // Create a temp canvas
        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = drawingCanvas.width;
        exportCanvas.height = drawingCanvas.height;
        const exportCtx = exportCanvas.getContext('2d');

        // Draw background image (set on #canvas)
        const backgroundImage = new Image();
        const bgStyle = getComputedStyle(canvas);
        const backgroundURL = bgStyle.backgroundImage.slice(5, -2); // remove url("...")

        backgroundImage.onload = () => {
            exportCtx.drawImage(backgroundImage, 0, 0, exportCanvas.width, exportCanvas.height);

            // Draw all images on canvas
            const images = canvas.querySelectorAll('img');
            images.forEach(img => {
                const rect = img.getBoundingClientRect();
                const canvasRect = canvas.getBoundingClientRect();
                const x = rect.left - canvasRect.left;
                const y = rect.top - canvasRect.top;
                exportCtx.globalCompositeOperation = img.style.mixBlendMode || 'source-over';
                exportCtx.drawImage(img, x, y, img.width, img.height);
            });

            // Draw the drawing canvas (preserves overlay effect)
            exportCtx.globalCompositeOperation = 'overlay';
            exportCtx.drawImage(drawingCanvas, 0, 0);

            // Save image
            const link = document.createElement('a');
            link.download = 'tableaux-collage.png';
            link.href = exportCanvas.toDataURL('image/png');
            link.click();

            // Restore toolbar
            toolbar.classList.remove('hidden');
        };

        backgroundImage.src = backgroundURL;
    }, 100); // slight delay for UI update
});

loadRandomImages();
changeBackground();
