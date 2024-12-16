const canvas = document.getElementById('canvas');
const refreshImagesBtn = document.getElementById('refreshImagesBtn');
const changeBackgroundBtn = document.getElementById('changeBackgroundBtn');
const clearCanvasBtn = document.getElementById('clearCanvasBtn');
const infoBtn = document.getElementById('infoBtn');
const previewBtn = document.getElementById('previewBtn');
const exitPreviewBtn = document.getElementById('exitPreview');
const instructionDialog = document.getElementById('instructionDialog');
const closeDialogBtn = document.getElementById('closeDialogBtn');
let previewMode = false;

// Image Libraries
const imageLibrary = [
    'images/breanna35.jpg',
    'images/rustybrown-stripe-tile.jpg',
    'images/lips.jpg',
    'images/pinkdottile.jpg',
    'images/lips-text.jpg',
    'images/rclaim-sage-tile.jpg',
    'images/moon-floor.png',
    'images/xray-chest-front.png',
    'images/andre_fam.png',
    'images/hair-poster-styles.jpg',
    'images/cotton-grass.png'
];

const backgroundLibrary = [
    'images/5042-5052-s-drexel.jpg',
    'images/harpercourt-girls-undated.jpg',
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
    canvas.innerHTML = ''; // Clear existing images
    const shuffledImages = shuffle([...imageLibrary]);

    shuffledImages.slice(0, 6).forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.className = 'img-item';

        // Set Random Dimensions
        const maxWidth = 300; // Maximum width for images
        const randomScale = Math.random() * 0.5 + 0.5; // Random scale between 0.5 and 1
        const randomWidth = maxWidth * randomScale; // Calculate random width
        img.style.width = `${randomWidth}px`; // Set random width
        img.style.height = 'auto'; // Maintain aspect ratio

        // Random initial placement
        img.style.left = `${Math.random() * (canvas.offsetWidth - randomWidth)}px`;
        img.style.top = `${Math.random() * (canvas.offsetHeight - randomWidth)}px`;

        // Drag-and-Drop Logic
        let isDragging = false;
        let moveImage; // Function reference for cleanup

        // Click to Pick Up or Drop
        img.addEventListener('click', e => {
            isDragging = !isDragging; // Toggle dragging state

            if (isDragging) {
                img.style.cursor = 'grabbing';
                img.style.zIndex = 1000; // Bring the image to the front

                // Function to move the image with the cursor
                moveImage = e => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left - img.offsetWidth / 2;
                    const y = e.clientY - rect.top - img.offsetHeight / 2;

                    img.style.position = 'absolute';
                    img.style.left = `${x}px`;
                    img.style.top = `${y}px`;
                };

                document.addEventListener('mousemove', moveImage);
            } else {
                img.style.cursor = 'grab';
                img.style.zIndex = ''; // Reset z-index

                // Stop moving the image
                document.removeEventListener('mousemove', moveImage);
            }
        });

        canvas.appendChild(img);
    });
}

// Change Background
function changeBackground() {
    const randomBackground =
        backgroundLibrary[Math.floor(Math.random() * backgroundLibrary.length)];
    canvas.style.backgroundImage = `url(${randomBackground})`;
    canvas.style.backgroundSize = 'cover';
    canvas.style.backgroundPosition = 'center';
    canvas.style.backgroundRepeat = 'no-repeat';
}

// Clear Canvas
function clearCanvas() {
    canvas.innerHTML = ''; // Removes all draggable items
}

// Toggle Preview Mode
function togglePreview() {
    const toolbar = document.getElementById('toolbar');
    previewMode = !previewMode;

    if (previewMode) {
        toolbar.classList.add('hidden');
        exitPreviewBtn.classList.add('visible'); // Show the "Exit Preview" button
    } else {
        toolbar.classList.remove('hidden');
        exitPreviewBtn.classList.remove('visible'); // Hide the "Exit Preview" button
    }
}

// Exit Preview Mode
exitPreviewBtn.addEventListener('click', () => {
    if (previewMode) {
        togglePreview(); // Exit preview mode
    }
});

// Close Instruction Dialog
closeDialogBtn.addEventListener('click', () => {
    instructionDialog.classList.add('hidden');
});


// Smooth scroll to the info section
document.getElementById('infoBtn').addEventListener('click', () => {
    document.getElementById('info').scrollIntoView({
        behavior: 'smooth'
    });
});

// Scroll back to the collage maker section
document.getElementById('backToTableauxBtn').addEventListener('click', () => {
    document.getElementById('canvas').scrollIntoView({
        behavior: 'smooth'
    });
});

// Button Events
refreshImagesBtn.addEventListener('click', loadRandomImages);
changeBackgroundBtn.addEventListener('click', changeBackground);
clearCanvasBtn.addEventListener('click', clearCanvas);
previewBtn.addEventListener('click', togglePreview);

// Initial Load
loadRandomImages();
changeBackground();
