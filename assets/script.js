// rotação chevron
document.querySelector('.select').addEventListener('click', () => {
    document.querySelector('.icon').classList.toggle('rotate')
})

// customização do seletor de idiomas
const customSelect = document.querySelector('.custom-select')
const language = document.querySelector('.language')

document.querySelector('.custom-select').addEventListener('click', () => {
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