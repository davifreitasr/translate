const inputText = document.getElementById('inputText')
const translate = document.getElementById('translate')
const inputTranslated = document.getElementById('inputTranslated')
const customSelect = document.querySelector('.custom-select')
const language = document.querySelector('.language')
const icon = document.querySelector('.icon')
const msg = document.querySelector('.msg')

// customização do seletor de idioma e rotação do chevron
customSelect.addEventListener('click', () => {
    icon.classList.toggle('rotate')
    customSelect.classList.toggle('open')
})

// customização do nome visível no seletor de idioma
customSelect.querySelectorAll('.lang-options').forEach(item => {
    item.addEventListener('click', () => {
        language.textContent = item.textContent
        language.classList.remove('open')
    })
})

// fechar o seletor de idioma ao clicar fora...
document.addEventListener('click', (e) => {
    if (!customSelect.contains(e.target)) {
        icon.classList.remove('rotate')
        customSelect.classList.remove('open')
    }
})

// tradução
let selectedLang = null

document.querySelectorAll('.lang-options').forEach(option => { // pega todos os elementos
    option.addEventListener('click', () => {                   // adiciona evento de clique para todos os elementos
        selectedLang = option.dataset.lang.toLowerCase()       // 
    })
})

// 
translate.addEventListener('click', async () => {
    const input = document.getElementById('inputText').value.trim()
    
    if (!selectedLang) { // caso nenhum elemento seja selecionado...
        msg.classList.add('active')
        msg.textContent = 'Selecione um idioma'
        msg.style.color = '#cf3939'
        customSelect.style.borderColor = '#cf3939'
        
        setTimeout(() => {
            msg.classList.remove('active')
            customSelect.style.borderColor = ''
        }, 3000)
        return
    }

    if (input.length === 0) { // caso nada seja digitado no input...
        msg.classList.add('active')
        msg.textContent = 'Digite algo'
        msg.style.color = '#cf3939'
        inputText.style.borderColor = '#cf3939'

        setTimeout(() => {
            msg.classList.remove('active')
            inputText.style.borderColor = ''
        }, 3000)
        return
    }

    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(input)}&langpair=pt|${selectedLang}`
    const response = await fetch(url)    
    const data = await response.json()
    
    inputTranslated.value = data.responseData.translatedText
})

// limpar inputs
document.querySelector('.clear').addEventListener('click', () => {
    inputText.value = ''
    inputTranslated.value = ''
})

// mic mode
const microphone = document.getElementById('microphone')
const copyIcon = document.querySelector('.copy')
const checkedIcon = document.querySelector('.checked')

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

let recognition
let listening = false

if (!SpeechRecognition) {
    microphone.disabled = true // se o navegador não tiver suporte para rec. de voz...
    alert('Seu navegador não suporta reconhecimento de voz (use o Chrome)')
} else {
    recognition = new SpeechRecognition()
    recognition.lang = 'pt'
    recognition.continuous = true
}

microphone.addEventListener('click', () => {
    if (!listening) {
        recognition.start()
    } else {
        recognition.stop()
    }
})

recognition.onstart = () => {
    listening = true
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
    microphone.style.borderColor = '#cf3939'
    listening = false
    msg.classList.add('active')
    msg.style.color = '#cf3939'

    switch (e.error) {
        case 'not-allowed':
            msg.textContent = 'Permissão do microfone negada'
            break
        case 'no-speech':
            msg.textContent = 'Nenhuma voz detectada'
            break
        case 'audio-capture':
            msg.textContent = 'Microfone não encontrado'
            break
        case 'network':
            msg.textContent = 'Falha na operação'
            break
        default: msg.textContent = 'Tente novamente'
    }

    setTimeout(() => {
        msg.classList.remove('active')
        microphone.style.borderColor = ''
    }, 3000);
}

recognition.onend = () => {
    listening = false
    microphone.classList.remove('active')
}

// copiar conteúdo do input
function copy() {
    const input = document.getElementById('inputTranslated').value // pega valor do input
    const borderTop = document.querySelector('.containerTranslate')
    const borderBottom = document.querySelector('.containerTranslated')

    if (!input) { // caso o input esteja vazio...
        msg.classList.add('active')
        msg.textContent = 'Digite algo'
        msg.style.color = '#cf3939'
        borderTop.classList.add('danger')
        copyIcon.style.color = '#cf3939'

        setTimeout(() => {
            msg.classList.remove('active')
            borderTop.classList.remove('danger')
            copyIcon.style.color = ''
        }, 3000)
        return
    }

    navigator.clipboard.writeText(input).then(() => { // copia valor do input
        msg.classList.add('active')
        msg.textContent = 'Copiado'
        copyIcon.classList.add('hidden')
        checkedIcon.classList.add('show')
        msg.style.color = '#008156'

        setTimeout(() => {
            msg.classList.remove('active')
            copyIcon.classList.remove('hidden')
            checkedIcon.classList.remove('show')
            borderBottom.classList.remove('sucess')
        }, 2000);
    })
}