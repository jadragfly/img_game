/**
 * UI 管理系统
 */

class UIManager {
    constructor() {
        this.elements = {};
        this.container = null;
    }
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            debugLog('UI 容器未找到:', containerId);
            return;
        }
        
        debugLog('UI 管理器初始化');
    }
    
    createElement(type, config) {
        const element = document.createElement(type);
        
        element.id = config.id || `ui-${Date.now()}`;
        element.className = config.className || '';
        element.textContent = config.text || '';
        
        if (config.style) {
            Object.assign(element.style, config.style);
        }
        
        if (config.parent) {
            config.parent.appendChild(element);
        } else if (this.container) {
            this.container.appendChild(element);
        }
        
        this.elements[element.id] = element;
        debugLog('UI 元素创建:', element.id);
        
        return element;
    }
    
    updateElement(id, content) {
        const element = this.elements[id];
        if (element) {
            element.textContent = content;
        }
    }
    
    showGameOverScreen(score) {
        const overlay = this.createElement('div', {
            id: 'game-over-overlay',
            style: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px'
            }
        });
        
        this.createElement('div', {
            id: 'game-over-title',
            text: '游戏结束',
            parent: overlay,
            style: {
                marginBottom: '20px'
            }
        });
        
        this.createElement('div', {
            id: 'final-score',
            text: `最终得分: ${score}`,
            parent: overlay,
            style: {
                fontSize: '24px',
                marginBottom: '30px'
            }
        });
        
        const restartButton = this.createElement('button', {
            id: 'restart-button',
            text: '重新开始',
            parent: overlay,
            style: {
                padding: '15px 30px',
                fontSize: '20px',
                cursor: 'pointer'
            }
        });
        
        restartButton.addEventListener('click', () => {
            window.location.reload();
        });
        
        debugLog('游戏结束界面显示');
    }
    
    showPauseScreen() {
        const overlay = this.createElement('div', {
            id: 'pause-overlay',
            style: {
                position: 'absolute',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                fontFamily: 'Arial, sans-serif',
                fontSize: '48px'
            }
        });
        
        this.createElement('div', {
            id: 'pause-text',
            text: '游戏暂停',
            parent: overlay
        });
        
        debugLog('暂停界面显示');
    }
    
    hidePauseScreen() {
        const pauseOverlay = this.elements['pause-overlay'];
        if (pauseOverlay) {
            pauseOverlay.remove();
            delete this.elements['pause-overlay'];
        }
    }
    
    createHealthBar(x, y, width, height, maxHealth) {
        const container = this.createElement('div', {
            id: 'health-bar-container',
            style: {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                width: `${width}px`,
                height: `${height}px`,
                backgroundColor: '#333',
                border: '2px solid white'
            }
        });
        
        const healthFill = this.createElement('div', {
            id: 'health-bar-fill',
            parent: container,
            style: {
                width: '100%',
                height: '100%',
                backgroundColor: 'green',
                transition: 'width 0.3s'
            }
        });
        
        return {
            update: (currentHealth) => {
                const percentage = (currentHealth / maxHealth) * 100;
                healthFill.style.width = `${percentage}%`;
                
                if (percentage < 30) {
                    healthFill.style.backgroundColor = 'red';
                } else if (percentage < 60) {
                    healthFill.style.backgroundColor = 'orange';
                } else {
                    healthFill.style.backgroundColor = 'green';
                }
            }
        };
    }
    
    createScoreDisplay(x, y) {
        const scoreElement = this.createElement('div', {
            id: 'score-display',
            text: '分数: 0',
            style: {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                color: 'white',
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                textShadow: '2px 2px 2px black'
            }
        });
        
        return {
            update: (score) => {
                scoreElement.textContent = `分数: ${score}`;
            }
        };
    }
    
    createLivesDisplay(x, y, maxLives) {
        const livesElement = this.createElement('div', {
            id: 'lives-display',
            text: '生命: ' + '❤'.repeat(maxLives),
            style: {
                position: 'absolute',
                left: `${x}px`,
                top: `${y}px`,
                color: 'red',
                fontSize: '24px',
                fontFamily: 'Arial, sans-serif',
                textShadow: '2px 2px 2px black'
            }
        });
        
        return {
            update: (currentLives) => {
                livesElement.textContent = '生命: ' + '❤'.repeat(currentLives);
            }
        };
    }
}

window.UIManager = UIManager;
