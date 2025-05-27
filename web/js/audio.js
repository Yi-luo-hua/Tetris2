// 俄罗斯方块音效处理器

class AudioManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.3;
        this.muted = false;
        this.sounds = {};
        
        this.initAudioContext();
        this.createSounds();
    }

    // 初始化音频上下文
    initAudioContext() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // 创建主音量控制
            this.masterGain = this.audioContext.createGain();
            this.masterGain.gain.value = this.masterVolume;
            this.masterGain.connect(this.audioContext.destination);
        } catch (e) {
            console.warn('Web Audio API not supported:', e);
        }
    }

    // 创建游戏音效
    createSounds() {
        if (!this.audioContext) return;

        // 定义音效参数
        this.soundDefinitions = {
            move: { frequency: 220, duration: 0.1, type: 'square' },
            rotate: { frequency: 330, duration: 0.15, type: 'triangle' },
            drop: { frequency: 110, duration: 0.2, type: 'sawtooth' },
            lineClear: { frequency: 440, duration: 0.3, type: 'sine' },
            tetris: { frequency: 660, duration: 0.5, type: 'sine' },
            gameOver: { frequency: 165, duration: 1.0, type: 'triangle' },
            levelUp: { frequency: 880, duration: 0.4, type: 'sine' }
        };

        // 预生成音效缓冲区
        for (const [name, params] of Object.entries(this.soundDefinitions)) {
            this.sounds[name] = this.createSoundBuffer(params);
        }
    }

    // 创建音效缓冲区
    createSoundBuffer(params) {
        if (!this.audioContext) return null;

        const { frequency, duration, type } = params;
        const sampleRate = this.audioContext.sampleRate;
        const frameCount = sampleRate * duration;
        
        const buffer = this.audioContext.createBuffer(1, frameCount, sampleRate);
        const channelData = buffer.getChannelData(0);

        // 生成波形
        for (let i = 0; i < frameCount; i++) {
            const t = i / sampleRate;
            const envelope = Math.exp(-t * 3); // 指数衰减包络
            
            let sample = 0;
            switch (type) {
                case 'sine':
                    sample = Math.sin(2 * Math.PI * frequency * t);
                    break;
                case 'square':
                    sample = Math.sign(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'triangle':
                    sample = (2 / Math.PI) * Math.asin(Math.sin(2 * Math.PI * frequency * t));
                    break;
                case 'sawtooth':
                    sample = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
                    break;
            }
            
            channelData[i] = sample * envelope * 0.3;
        }

        return buffer;
    }

    // 播放音效
    playSound(soundName, volume = 1.0) {
        if (!this.audioContext || this.muted || !this.sounds[soundName]) return;

        try {
            // 恢复音频上下文（如果被暂停）
            if (this.audioContext.state === 'suspended') {
                this.audioContext.resume();
            }

            const source = this.audioContext.createBufferSource();
            const gainNode = this.audioContext.createGain();
            
            source.buffer = this.sounds[soundName];
            gainNode.gain.value = volume;
            
            source.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            source.start();
        } catch (e) {
            console.warn('Error playing sound:', e);
        }
    }

    // 播放特殊音效序列
    playLineClearSequence(linesCount) {
        if (linesCount === 4) {
            // Tetris! 特殊音效
            this.playSound('tetris');
            setTimeout(() => this.playSound('tetris', 0.7), 200);
            setTimeout(() => this.playSound('tetris', 0.5), 400);
        } else {
            // 普通消除音效
            for (let i = 0; i < linesCount; i++) {
                setTimeout(() => this.playSound('lineClear', 1.0 - i * 0.2), i * 100);
            }
        }
    }

    // 播放等级提升音效
    playLevelUpSequence() {
        this.playSound('levelUp');
        setTimeout(() => this.playSound('levelUp', 0.8), 150);
        setTimeout(() => this.playSound('levelUp', 0.6), 300);
    }

    // 播放游戏结束音效
    playGameOverSequence() {
        // 下降音调序列
        const frequencies = [330, 294, 262, 220, 196, 165];
        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                this.playTone(freq, 0.3, 'triangle');
            }, index * 200);
        });
    }

    // 播放自定义音调
    playTone(frequency, duration, type = 'sine', volume = 1.0) {
        if (!this.audioContext || this.muted) return;

        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
            
            // 设置包络
            gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(volume * 0.3, this.audioContext.currentTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
            
            oscillator.connect(gainNode);
            gainNode.connect(this.masterGain);
            
            oscillator.start();
            oscillator.stop(this.audioContext.currentTime + duration);
        } catch (e) {
            console.warn('Error playing tone:', e);
        }
    }

    // 设置主音量
    setMasterVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
        }
    }

    // 切换静音状态
    toggleMute() {
        this.muted = !this.muted;
        if (this.masterGain) {
            this.masterGain.gain.value = this.muted ? 0 : this.masterVolume;
        }
        return this.muted;
    }

    // 获取静音状态
    isMuted() {
        return this.muted;
    }

    // 播放背景音乐（简单的循环音调）
    startBackgroundMusic() {
        if (this.backgroundMusicInterval) return;

        const notes = [262, 294, 330, 349, 392, 440, 494, 523]; // C大调音阶
        let noteIndex = 0;

        this.backgroundMusicInterval = setInterval(() => {
            if (!this.muted) {
                this.playTone(notes[noteIndex], 0.5, 'sine', 0.1);
                noteIndex = (noteIndex + 1) % notes.length;
            }
        }, 1000);
    }

    // 停止背景音乐
    stopBackgroundMusic() {
        if (this.backgroundMusicInterval) {
            clearInterval(this.backgroundMusicInterval);
            this.backgroundMusicInterval = null;
        }
    }

    // 销毁音频管理器
    destroy() {
        this.stopBackgroundMusic();
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}

// 音效事件处理器
class SoundEffectHandler {
    constructor(audioManager, game) {
        this.audio = audioManager;
        this.game = game;
        this.lastScore = 0;
        this.lastLevel = 1;
        
        this.setupGameEvents();
    }

    // 设置游戏事件监听
    setupGameEvents() {
        // 监听分数变化（消除行）
        this.game.onLineClear = (linesCount) => {
            this.audio.playLineClearSequence(linesCount);
        };

        // 监听游戏结束
        this.game.onGameOver = () => {
            this.audio.stopBackgroundMusic();
            this.audio.playGameOverSequence();
        };

        // 监听分数更新
        this.game.onScoreUpdate = (score, level, lines) => {
            // 检查等级提升
            if (level > this.lastLevel) {
                this.audio.playLevelUpSequence();
                this.lastLevel = level;
            }
            
            this.lastScore = score;
        };
    }

    // 播放移动音效
    onPieceMove() {
        this.audio.playSound('move', 0.5);
    }

    // 播放旋转音效
    onPieceRotate() {
        this.audio.playSound('rotate', 0.7);
    }

    // 播放下落音效
    onPieceDrop() {
        this.audio.playSound('drop', 0.8);
    }

    // 重置状态
    reset() {
        this.lastScore = 0;
        this.lastLevel = 1;
    }
} 