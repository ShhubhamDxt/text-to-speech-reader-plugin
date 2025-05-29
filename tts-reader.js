let synth = window.speechSynthesis;
let selectedVoice = null;
let queue = [];
let currentIndex = 0;
let isPaused = false;
let isStopped = false;
let autoReadEnabled = false;

document.addEventListener('DOMContentLoaded', () => {
    const controls = document.getElementById('tts-controls');
    const playBtn = document.getElementById('tts-play');
    const pauseBtn = document.getElementById('tts-pause');
    const stopBtn = document.getElementById('tts-stop');
    const rateSlider = document.getElementById('tts-rate');
    const autoReadCheckbox = document.getElementById('tts-auto-read');

    function isFemaleVoice(name) {
        return /female|woman|girl/i.test(name);
    }

    function selectVoice() {
        const allVoices = synth.getVoices();

        // Try Irish female voice
        selectedVoice = allVoices.find(v => v.lang.toLowerCase() === 'ga-ie' && isFemaleVoice(v.name));

        // Fallback to any Irish voice
        if (!selectedVoice) {
            selectedVoice = allVoices.find(v => v.lang.toLowerCase() === 'ga-ie');
        }

        // Fallback to English female voice
        if (!selectedVoice) {
            selectedVoice = allVoices.find(v => v.lang.toLowerCase().startsWith('en') && isFemaleVoice(v.name));
        }

        // Absolute fallback to any English voice
        if (!selectedVoice) {
            selectedVoice = allVoices.find(v => v.lang.toLowerCase().startsWith('en'));
        }
    }

    synth.onvoiceschanged = selectVoice;
    selectVoice();

    function splitIntoSentences(text) {
        return text.match(/[^.!?]+[.!?]*/g) || [text];
    }

    function speakChunks() {
        if (isStopped || currentIndex >= queue.length) return;

        const utterance = new SpeechSynthesisUtterance(queue[currentIndex]);
        utterance.voice = selectedVoice;
        utterance.rate = parseFloat(rateSlider.value);

        utterance.onend = () => {
            if (!isPaused && !isStopped) {
                currentIndex++;
                speakChunks();
            }
        };

        synth.speak(utterance);
    }

    function startSpeaking(text) {
        synth.cancel();
        isStopped = false;
        isPaused = false;
        queue = splitIntoSentences(text).map(s => s.trim()).filter(Boolean);
        currentIndex = 0;
        speakChunks();
    }

    document.addEventListener('mouseup', () => {
        const selectedText = window.getSelection().toString().trim();
        if (selectedText.length > 0) {
            controls.style.display = 'block';
            if (autoReadEnabled) {
                startSpeaking(selectedText);
            }
        }
    });

    playBtn.addEventListener('click', () => {
        if (isPaused) {
            isPaused = false;
            synth.resume();
        } else {
            const selectedText = window.getSelection().toString().trim();
            if (selectedText.length > 0) {
                startSpeaking(selectedText);
            }
        }
    });

    pauseBtn.addEventListener('click', () => {
        if (synth.speaking && !synth.paused) {
            isPaused = true;
            synth.pause();
        }
    });

    stopBtn.addEventListener('click', () => {
        isStopped = true;
        isPaused = false;
        synth.cancel();
    });

    autoReadCheckbox.addEventListener('change', () => {
        autoReadEnabled = autoReadCheckbox.checked;
    });
});
