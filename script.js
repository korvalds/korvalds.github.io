// Word Puzzle Game - Script
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const gameBoard = document.querySelector('.gameboard');
    const letters = document.querySelectorAll('.letter');
    const currentWordDisplay = document.getElementById('current-word');
    const shuffleButton = document.getElementById('shuffle-button');
    const clearButton = document.getElementById('clear-button');
    const scoreDisplay = document.getElementById('score');
    const foundCountDisplay = document.getElementById('found-count');
    const totalCountDisplay = document.getElementById('total-count');
    const foundWordsByOrder = document.getElementById('words-by-order');
    const tabButtons = document.querySelectorAll('.foundwords-tab');
    const listByOrder = document.querySelector('.foundwords-list-by-order');
    const listByLength = document.querySelector('.foundwords-list-by-length');

    // Game data placeholder
    const gameData = {
        score: 0,
        foundWords: [],
        totalWords: 20, // Placeholder for total number of words
        currentSelection: []
    };

    // Display total word count
    totalCountDisplay.textContent = gameData.totalWords;

    // Tab switching for found words
    tabButtons.forEach(tab => {
        tab.addEventListener('click', function() {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const sortType = this.dataset.sort;
            if (sortType === 'order') {
                listByOrder.classList.remove('hidden');
                listByLength.classList.add('hidden');
            } else {
                listByOrder.classList.add('hidden');
                listByLength.classList.remove('hidden');
            }
        });
    });

    // Event listeners for buttons
    shuffleButton.addEventListener('click', function() {
        shuffleBoard();
    });

    clearButton.addEventListener('click', function() {
        clearSelection();
    });

    // Event listeners for letter tiles
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            handleLetterSelection(this);
        });
    });

    // Function to handle letter selection
    function handleLetterSelection(letterElement) {
        const letterText = letterElement.querySelector('.letter__label').textContent;
        const position = letterElement.dataset.position;
        
        // Check if letter is already selected
        if (letterElement.classList.contains('selected')) {
            // If it's the last letter added, remove it
            if (gameData.currentSelection.length > 0 && 
                gameData.currentSelection[gameData.currentSelection.length - 1].position === position) {
                
                // Remove from selection
                gameData.currentSelection.pop();
                letterElement.classList.remove('selected');
                updateCurrentWordDisplay();
            }
            return;
        }
        
        // Add letter to selection
        letterElement.classList.add('selected');
        gameData.currentSelection.push({
            letter: letterText,
            element: letterElement,
            position: position
        });
        
        // Update word display
        updateCurrentWordDisplay();
        
        // Optional: Validate word if needed
        // validateWord();
    }
    
    // Function to update the current word display
    function updateCurrentWordDisplay() {
        currentWordDisplay.innerHTML = '';
        
        if (gameData.currentSelection.length === 0) {
            return;
        }
        
        gameData.currentSelection.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.letter;
            currentWordDisplay.appendChild(li);
        });
    }
    
    // Function to clear the current selection
    function clearSelection() {
        gameData.currentSelection.forEach(item => {
            item.element.classList.remove('selected');
        });
        
        gameData.currentSelection = [];
        updateCurrentWordDisplay();
    }

    // Function to shuffle the letters on the board
    function shuffleBoard() {
        const letterElements = Array.from(letters);
        const labelContents = letterElements.map(letter => letter.querySelector('.letter__label').textContent);
        
        // Fisher-Yates shuffle algorithm
        for (let i = labelContents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [labelContents[i], labelContents[j]] = [labelContents[j], labelContents[i]];
        }
        
        // Update the letter labels with the shuffled content
        letterElements.forEach((letter, index) => {
            letter.querySelector('.letter__label').textContent = labelContents[index];
        });
        
        // Clear any existing selection when shuffling
        clearSelection();
        
        console.log('Board shuffled!');
    }

    // Functions to be implemented:
    // 1. validateWord() - Check if selected letters form a valid word
    // 2. addFoundWord() - Add word to found words list
    // 3. updateScore() - Update the user's score
});