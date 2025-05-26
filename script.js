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
        // Placeholder for shuffle functionality
        console.log('Shuffle button clicked');
    });

    clearButton.addEventListener('click', function() {
        // Placeholder for clear selection functionality
        console.log('Clear button clicked');
    });

    // Event listeners for letter tiles
    letters.forEach(letter => {
        letter.addEventListener('click', function() {
            // Placeholder for letter selection functionality
            console.log('Letter clicked:', this.querySelector('.letter__label').textContent);
        });
    });

    // Functions to be implemented:
    // 1. initializeGame() - Set up the game board with letters
    // 2. handleLetterSelection() - Handle user selecting letters
    // 3. validateWord() - Check if selected letters form a valid word
    // 4. addFoundWord() - Add word to found words list
    // 5. updateScore() - Update the user's score
    // 6. shuffleBoard() - Rearrange letters on the board
});