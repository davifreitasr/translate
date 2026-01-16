const customSelect = document.querySelector('.custom-select')
const language = document.querySelector('.language')

// customização do seletor de idioma e rotação do chevron
document.querySelector('.custom-select').addEventListener('click', () => {
    document.querySelector('.icon').classList.toggle('rotate')
    customSelect.classList.toggle('open')
})

customSelect.querySelectorAll('.lang-options').forEach(item => {
    item.addEventListener('click', () => {
        language.textContent = item.textContent
        language.classList.remove('open')
    })
})

document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        customSelect.classList.remove('open')
    }
})

// tradução
let selectedLang = 'en'

document.querySelectorAll('.lang-options').forEach(option => {
    option.addEventListener('click', () => {
        selectedLang = option.dataset.lang.toLowerCase()
    })
})

document.querySelector('#translate').addEventListener('click', async () => {
    const text = document.querySelector('#inputText').value

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=pt|${selectedLang}`

    const response = await fetch(url)
    const data = await response.json()

    document.getElementById('inputTranslated').value = data.responseData.translatedText
})







const microphone = document.getElementById('microphone')
const inputText = document.getElementById('inputText')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if (!SpeechRecognition) {
    microphone.disabled = true
    alert('Seu navegador não suporta reconhecimento de voz (use o Chrome/Edge)')
} else {
    const recognition = new SpeechRecognition()

    recognition.lang = 'pt'
    recognition.interimResultsResults = true
    recognition.continuous = false

    let listering = false

    microphone.addEventListener('click', () => {
        if (!listering) {
            recognition.start()
        } else {
            recognition.stop()
        }
    })

    recognition.onstart = () => {
        listering = true
        microphone.classList.add('active')
    }

    recognition.onresult = (e) => {
        let transcript = ''
        for (let i = e.resultIndex; i < e.results.length; i++) {
            transcript += e.results[i][0].transcript
        }
        inputText.value = transcript.trim()
    }
    recognition.onerror = (e) => {
        console.log('Speech error', e.error)
    }
}