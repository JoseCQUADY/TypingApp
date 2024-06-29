
const get = (selector) => document.querySelector(selector)
const $paragraph = get('p')
const $input = get('input')
const $time = get('time')
const TIME_LIMIT = 30
const $section = document.getElementById('type')
const $wpm = document.getElementById('wpm')
const $accuracy = document.getElementById('accuracy')
const $reload = document.getElementById('reload')
const $startButton = document.getElementById('startButton')
const $container = document.getElementById('gameContainer')

let text = [
    "I am the hope of the universe. I am the answer to all living things that cry out for peace.", // Goku
    "It's not the end, it's not even the beginning of the end!", // Vegeta
    "I am the prince of all Saiyans once again!", // Vegeta
    "Sometimes, we have to look beyond what we want and do what's best.", // Piccolo
    "I am looking at things from a much higher perspective than you, and the view is quite revealing.", // Whis
    "You fool! Don't you realize yet you're up against the perfect weapon?", // Cell
    "You'll never really know what you’re capable of until you try.", // Gohan
    "It's not about strength, it's about determination!", // Goku
    "Power comes in response to a need, not a desire.", // Goku
    "Even the mightiest warriors experience fears. What makes them a true warrior is the courage that they possess to overcome their fears." // Vegeta
];


let numTextsToCombine = Math.floor(Math.random() * 2) + 3; // Randomly choose between 3 or 4 texts

let selectedTexts = [];
while (selectedTexts.length < numTextsToCombine) {
    let randomIndex = Math.floor(Math.random() * text.length);
    if (!selectedTexts.includes(text[randomIndex])) {
        selectedTexts.push(text[randomIndex]);
    }
}

text = selectedTexts.join(" ");

const words = text.split(' ')

$section.addEventListener('click', () => {
    $input.focus()
})

$reload.addEventListener('click', () => {
    location.reload()
})

$startButton.addEventListener('click', () => {
    startSetInterval()
    initEvents() 
    $startButton.style.display = 'none'
})



$paragraph.innerHTML = words.map(word => `<span class="word">
    ${word.split('').map(letter => `<span class="letter">${letter}</span>`).join('')}
    </span>`).join('')


function pauseSetInterval(){

}

function startSetInterval() {
    let timeLeft = TIME_LIMIT
    const timer = setInterval(function initGame() {
        timeLeft--
        $time.innerHTML = timeLeft
        if (timeLeft === 0) {
            clearInterval(timer)
            gameOver(timeLeft)
        }
        return initGame;
    }(), 1000);
}

function gameOver(timeLeft) {
    $container.style.display = 'none'
    const niceWords = document.querySelectorAll('.word.correct').length
    $wpm.innerHTML = `WPM : ${Math.round(niceWords / (TIME_LIMIT - timeLeft) * 60)}`
    $accuracy.innerHTML = `Accuracy :${Math.round(niceWords / words.length * 100)}%`
    $reload.style.display = 'block'
}

$section.addEventListener('click', () => {
    $input.focus()
})

const $firstWord = $section.querySelector('.word')
const $firstLetter = $section.querySelector('.letter')

$firstLetter.classList.add('active')
$firstWord.classList.add('active')

function onKeyDown(e) {
    let $currentWord = $paragraph.querySelector('.word.active')
    let $currentLetter = $currentWord.querySelector('.letter.active')

    const lastWord = $paragraph.querySelector('.word:last-child')
    const lastLetter = lastWord.querySelector('.letter:last-child')


    if (lastLetter.classList.contains('correct') || lastLetter.classList.contains('incorrect')) {
        const timeLeft = $time.innerText
        gameOver(timeLeft)
    }


    if (e.key === ' ') {
        e.preventDefault()

        const nextWord = $currentWord.nextElementSibling;
        if (nextWord === null) {
            const timeLeft = $time.innerText
            $currentWord.classList.remove('active')
            $currentWord.classList.add('missed')
            gameOver(timeLeft)
            $section.style
            return
        }
        const nextLetter = nextWord.querySelector('.letter');

        $currentWord.classList.remove('active')
        $currentLetter.classList.remove('active')

        nextWord.classList.add('active')
        nextLetter.classList.add('active')

        $input.value = ''

        const lettersMissed = $currentWord.querySelectorAll('.letter:not(.correct)').length > 0
        lettersMissed ? $currentWord.classList.add('missed') : $currentWord.classList.add('correct')

    }
}


function onKeyUp() {

    let $currentWord = $paragraph.querySelector('.word.active')
    const currentWord = $currentWord.innerText.trim()
    $input.maxLength = currentWord.length
    const $allLetters = $currentWord.querySelectorAll('.letter')

    $allLetters.forEach(letter => letter.classList.remove('correct', 'incorrect'))

    $input.value.split('').forEach((letter, index) => {
        if (letter === $allLetters[index].innerText) {
            $allLetters[index].classList.add('correct')
        } else {
            $allLetters[index].classList.add('incorrect')
        }
    })

    if ($input.key === ' ') {
        $input.value = ''
    }

}

function initEvents() {
    $reload.style.display = 'none'
    $input.addEventListener('keydown', onKeyDown)
    $input.addEventListener('keyup', onKeyUp)
}






