// // Select vào những đối tượng thẻ và lưu vào biến tương ứng
let cardCurtain = document.querySelector('.card-curtain');
let playGround = document.querySelector('.playground');
let playBtn = document.querySelector('.menu button');
let playAgainBtn = document.querySelector('.result button');
let menuWin = document.querySelector('.menu');
let scoreEle = document.querySelector('.score');
let timeEle = document.querySelector('.time');
let timerInterval;
let resultEle = document.querySelector('.result');
let isTimeup = false;

let score = 0;
let time = 60;

let picA = [0, 0];
let picB = [0, 0];

let prevVal = null;

let totalLevel = 3;
let currLev = 1;

let numCard = 6;
let countCorrectCard = 0;

const bg = new Audio('./Sound/this-8-bit-music-short-245264.mp3');
const timeupSound = new Audio('./Sound/timeup.mp3');
const scoreSound = new Audio('./Sound/score.mp3');
const winSound = new Audio('./Sound/win.mp3');
const wrongSound = new Audio('./Sound/wrong.mp3');
const winLevel = new Audio('./Sound/winLevel.mp3');

bg.loop = true;
bg.volume = 0;
bg.preload = 'auto';


function refreshLevel () {
    isTimeup = false;
    countCorrectCard = 0;
    if (currLev === 1) {
        numCard = 6;
        time = 15;
    } else if (currLev === 2) {
        numCard = 8;
        time = 25;
    } else if (currLev === 3) {
        numCard = 10;
        time = 35;
    };
}

function renderCards () {
    let html = '';
    // 1. Tạo ra những cặp hình theo thứ tự
    let cardArr = [];
    for (let i = 1; i <= numCard / 2; i++) {
        cardArr.push(i);
        cardArr.push(i);
    };

    // 2. Xào thẻ bài ngẫu nhiên và insert vào trong playGround
    for (let i = 0; i < numCard; i++) {
        // Trả về giá trị ngẫu nhiên từ 0 -> cardArr.length - 1
        let ran = Math.floor(Math.random() * cardArr.length);
        html += `
            <div class="card-item" data-id="${i + 1}" data-type="${cardArr[ran]}">
                <div class="card-item-inner">
                    <div class="card-img">
                        <img src="./pictures/${cardArr[ran]}.png" alt="">
                    </div>
                    <div class="card-curtain"></div>
                </div>
            </div>
        `;
        cardArr.splice(ran, 1);
    };
    playGround.innerHTML = `<div class="card-group">${html}</div>`;
};



// Gắn việc lắng nghe hành động click chuột vào đối tượng 

// function renderCards() {
//     let contentHtml = '';
//     for (let i=0; i < 6; i++) {
//         console.log('i', i)
//         contentHtml += `
//         <div style="background: blue; margin: 10px; color: white">
//             Hello word ${i + 1}
//             <img width="50px" src="./pictures/${i+1}.png"/>
//         </div>
//         `
//     }
//     playGround.innerHTML = contentHtml
// }
    
playGround.addEventListener('click', function(e) {
    const currCard = e.target.closest('.card-item');
    if (isTimeup || !currCard) return;
    let currCardClassList = currCard.querySelector('.card-item-inner').classList;
    let type = parseInt(currCard.dataset.type);
    let id = parseInt(currCard.dataset.id);
    console.log('currCardClassList', currCardClassList)
    let isOpen = Array.from(currCardClassList).includes('show');
    console.log('isOpen', isOpen)
    if (isOpen) return;
    currCardClassList.add('show');
    if (prevVal) {
        let prevCard = document.querySelector(`[data-id="${prevVal.id}"]`);
        if (prevVal.type === type) {
            scoreSound.play();
            score += 1;
            countCorrectCard += 2;

            if (countCorrectCard === numCard) {
                clearInterval(timerInterval);
                if (currLev === 3) {
                    resultEle.querySelector('p').textContent = 'Congrat! You win 🏆';
                    resultEle.style.display = 'block';
                    bg.currentTime = 0; 
                    bg.pause();
                    winSound.play();
                    return;
                };
                currLev += 1;
                refreshLevel();
                menuWin.classList.remove('menuHide');
                menuWin.querySelector('p').textContent = `Congrat! Next Level: ${currLev}`;
                winLevel.play();
            }
        } else {
            setTimeout(() => {
                currCard.querySelector('.card-item-inner').classList.remove('show');
                prevCard.querySelector('.card-item-inner').classList.remove('show');
            }, 1000)
            wrongSound.play();
            
            if (score > 0) score -= 1;
        };
        scoreEle.innerHTML = score;
        prevVal = null;
    } else {
        prevVal = {id, type};
    }


    // if (picA[0] === 0) {
    //     picA[0] = type;
    //     picA[1] = id;
    // } else if (picB[0] === 0) {
    //     picB[0] = type;
    //     picB[1] = id;

    //     // If select wrong pair
    //     if (picA[0] != picB[0]) {
    //         wrongSound.play();
    //         let eleA = document.querySelector(`[data-id="${picA[1]}"]`);
    //         let eleB = document.querySelector(`[data-id="${picB[1]}"]`);

    //         setTimeout(() => {
    //             eleA.querySelector('.card-item-inner').classList.remove('show');
    //             eleB.querySelector('.card-item-inner').classList.remove('show');
    //         }, 800);

    //         if (score > 0) {
    //             score -= 1;
    //             scoreEle.innerHTML = score;
    //         };
    //     } else {
    //         // If select correct
    //         scoreSound.play();
    //         score += 2;
    //         scoreEle.innerHTML = score;
    //         countCorrectCard += 2;
    //         if (countCorrectCard === numCard) {
    //             clearInterval(timerInterval);
                
    //             if (currLev === 3) {
    //                 resultEle.querySelector('p').textContent = 'Congrat! You win 🏆';
    //                 resultEle.style.display = 'block';
    //                 bg.currentTime = 0; 
    //                 bg.pause();
    //                 winSound.play();
    //                 return;
    //             };
    //             currLev += 1;
    //             refreshLevel();
    //             menuWin.classList.remove('menuHide');
    //             menuWin.querySelector('p').textContent = `Congrat! Next Level: ${currLev}`;
    //             winLevel.play();
    //         }
    //     }

    //     picA = [0, 0];
    //     picB = [0, 0];
    // };
})

function countDown() {
    timerInterval = setInterval(() => {
        console.log('run')
        timeEle.innerHTML = time;
       
        if (time == 0) {
            isTimeup = true;
            clearInterval(timerInterval);
            resultEle.querySelector('p').textContent = 'Time up! 🙁'
            resultEle.style.display = 'block';
            score = 0;
            scoreEle.innerHTML = score;
            bg.currentTime = 0;
            bg.pause();
            timeupSound.play();
        }
        time -= 1;
    }, 1000)
}

playBtn.addEventListener('click', function() {
    menuWin.classList.add('menuHide');
    renderCards();
    scoreEle.innerHTML = score;
    countDown();
    bg.play();
});

playAgainBtn.addEventListener('click', function() {
    refreshLevel();
    resultEle.style.display = 'none';
    renderCards();
    scoreEle.innerHTML = score;
    countDown();
    bg.play()
});

menuWin.querySelector('p').textContent = `Level ${currLev}`;

