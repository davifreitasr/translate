const customSelect = document.querySelector('.custom-select')
const language = document.querySelector('.language')
const icon = document.querySelector('.icon')

// customização do seletor de idioma e rotação do chevron
document.querySelector('.custom-select').addEventListener('click', (e) => {
    e.stopPropagation()
    icon.classList.toggle('rotate')
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
        icon.classList.remove('rotate')
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

// mic mode
const microphone = document.getElementById('microphone')
const inputText = document.getElementById('inputText')
const msg = document.querySelector('.msg')
const copyIcon = document.querySelector('.copy')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

if (!SpeechRecognition) {
    microphone.disabled = true
    alert('Seu navegador não suporta reconhecimento de voz (use o Chrome)')
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
        microphone.classList.remove('active')
        msg.classList.add('active')
        msg.style.color = '#cf3939'

        if (e.error === 'not-allowed') {
            msg.textContent = 'Permissão do microfone negada'
        } else if (e.error === 'no-speech') {
            msg.textContent = 'Nenhuma voz detectada'
        } else if (e.error === 'audio-capture') {
            msg.textContent = 'Microfone não encontrado'
        } else if (e.error === 'network') {
            msg.textContent = 'Falha na operação'
        } else {
            msg.textContent = 'Tente novamente'
        }

        setTimeout(() => {
            msg.classList.remove('active')
        }, 3000)
    }

    recognition.onend = () => {
        microphone.classList.remove('active')
    }
}

function copy() {
    const inputTranslated = document.getElementById('inputTranslated').value // pega valor do input

    if (!inputTranslated) { // caso o textarea esteja vazio...
            msg.classList.add('active')
            msg.style.color = '#cf3939'
            msg.textContent = 'Vazio'
            
            setTimeout(() => {
                msg.classList.remove('active')
            }, 2000)
            return
    }
    
    navigator.clipboard.writeText(inputTranslated).then(() => { // copia valor do textarea
        msg.classList.add('active')
        msg.textContent = 'Texto copiado'
        copyIcon.style.color = '#008156'
        msg.style.color = '#008156'

        setTimeout(() => {
            msg.classList.remove('active')
            copyIcon.style.color = ''
        }, 2000);
    })
}