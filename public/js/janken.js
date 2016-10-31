$(function() {
    var winCTX = document.getElementById('wins').getContext('2d'),
        loseCTX = document.getElementById('losses').getContext('2d'),
        drawCTX = document.getElementById('draws').getContext('2d'),
        minutesRef = $('#minutes'),
        secondsRef = $('#seconds'),
        timerForm = $('#timerForm'),
        timerCTX = document.getElementById('timerDisplay').getContext('2d'),
        startRef = $('#start'),
        restartRef = $('#restart'),
        playerRef = $('.janken .player'),
        choiceRef = $('.janken'),
        scoreRef = $('.scores'),
        timerDisplayRef = $('.timerDisplay'),
        wins = losses = draws = 0,
        counterInSeconds = 0,
        intervalRef = undefined,
        selectionArray = ["rock", "paper", "scissor"],
        cpuSelectionRef = $('#cpuSelection'),
        playerSelectionRef = $('#playerSelection'),
        modalRef = $('.resultModal'),
        gameResultRef = $('#gameResult'),
        resultScoreRef = $('#resultScore'),
        loginRegister = $('#loginRegister'),
        loginForm = $('#loginForm'),
        registerBtn = $('#register'),
        loginBtn = $('#login'),
        guestBtn = $('#guestBtn'),
        loginSection = $('.Login'),
        timersSection = $('.timers'),
        loginError = $('#loginError'),
        historySection = $('.history'),
        history = $('#history'),
        sessionToken;

    winCTX.font = loseCTX.font = drawCTX.font = timerCTX.font = "30px Nova Square";
    winCTX.textAlign = loseCTX.textAlign = drawCTX.textAlign = timerCTX.textAlign = "center";
    winCTX.fillStyle = 'green';
    loseCTX.fillStyle = 'red';

    loginRegister.on('click', function(event) {
        loginRegister.hide(100);
        loginForm.show(500);
    });

    registerBtn.on('click', function(event) {
        if (loginForm[0].checkValidity()) {
            registerBtn.prop('disabled', true);
            loginBtn.prop('disabled', true);

            $.ajax({
                type: "POST",
                url: '/createUser',
                data: {
                    username: $('#username').val(),
                    pass: $('#password').val()
                },
                dataType: 'json'
            }).then(function(resp) {
                sessionToken = resp.sessionToken;
                loginSection.hide(250);
                timersSection.show(500);
            }, function(err) {
                registerBtn.prop('disabled', false);
                loginBtn.prop('disabled', false);
                loginError.text(err.responseJSON.message || err.message);
            });
        }
    });

    loginBtn.on('click', function(event) {
        if (loginForm[0].checkValidity()) {
            registerBtn.prop('disabled', true);
            loginBtn.prop('disabled', true);

            $.ajax({
                type: "POST",
                url: '/login',
                data: {
                    username: $('#username').val(),
                    pass: $('#password').val()
                },
                dataType: 'json'
            }).then(function(resp) {
                sessionToken = resp.sessionToken;
                loginSection.hide(250);
                timersSection.show(500);
            }, function(err) {
                registerBtn.prop('disabled', false);
                loginBtn.prop('disabled', false);
                loginError.text(err.responseJSON.message || err.message);
            });
        }
    });

    guestBtn.on('click', function(event) {
        loginSection.hide(250);
        timersSection.show(500);
    });

    /* event bind for on click on start */
    startRef.on('click', function(event) {
        if (event.target.value === 'start' && validateForm()) {
            restartRef[0].removeAttribute('disabled');
            playerRef.children().prop('disabled', false);
            startRef.html('Stop');
            startRef.prop('value', 'stop');
            minutesRef.prop('disabled', true);
            secondsRef.prop('disabled', true);
            restartRef.show(500);
            choiceRef.show(500);
            scoreRef.show(500);
            timerDisplayRef.show(200);
            retrieveScores();
            gameStarter();
        } else if (event.target.value === 'stop') {
            timerCTX.clearRect(0, 0, 340, 70);
            timerCTX.fillText('Game Ended!', 170, 45);
            endGame();
        }
    });

    /* event bind for on click on restart */
    restartRef.on('click', function() {
        if (validateForm()) {
            gameStarter();
        }
    });

    /* event bind for on click of rock-paper-scissor options 
        shifts the selection array around so that the higher index indicates the winner */
    playerRef.on('click', 'button', function(event) {
        var selectionIndex = selectionArray.indexOf(event.target.value),
            playerChoice,
            cpuChoice;

        if (selectionIndex === 0) {
            selectionArray.unshift(selectionArray.pop());
        } else if (selectionIndex === 2) {
            selectionArray.push(selectionArray.shift());
        }

        playerChoice = selectionArray.indexOf(event.target.value);
        cpuChoice = Math.floor(Math.random() * 3);

        playerSelectionRef.removeClass("rock paper scissor").addClass(selectionArray[playerChoice]);
        cpuSelectionRef.removeClass("rock paper scissor").addClass(selectionArray[cpuChoice]);

        if (playerChoice === cpuChoice) {
            draws++;
            playerSelectionRef.removeClass("win lose");
            cpuSelectionRef.removeClass("win lose");
            updateScores("draw");
        } else if (playerChoice > cpuChoice) {
            wins++;
            playerSelectionRef.addClass("win").removeClass("lose");
            cpuSelectionRef.addClass("lose").removeClass("win");
            updateScores("win");
        } else {
            losses++;
            cpuSelectionRef.addClass("win").removeClass("lose");
            playerSelectionRef.addClass("lose").removeClass("win");
            updateScores("loss");
        }
    });

    /* preventing submit action of form used to group validations */
    timerForm.on('submit', function(event) {
        event.preventDefault();
    });

    /* clears and redraws the score canvas, slightly optimized for performance */
    updateScores = function(outcome) {
        switch (outcome) {
            case "loss":
                loseCTX.clearRect(0, 0, 100, 50);
                loseCTX.fillText(losses, 50, 35);
                break;
            case "win":
                winCTX.clearRect(0, 0, 100, 50);
                winCTX.fillText(wins, 50, 35);
                break;
            case "draw":
                drawCTX.clearRect(0, 0, 100, 50);
                drawCTX.fillText(draws, 50, 35);
                break;
            default:
                winCTX.clearRect(0, 0, 100, 50);
                loseCTX.clearRect(0, 0, 100, 50);
                drawCTX.clearRect(0, 0, 100, 50);
                winCTX.fillText(wins, 50, 35);
                loseCTX.fillText(losses, 50, 35);
                drawCTX.fillText(draws, 50, 35);
        }
    };

    /* clears and redraws timerDisplay */
    updateTimer = function() {
        var timerText;
        if (counterInSeconds <= 10) {
            timerCTX.fillStyle = 'red';
            timerText = counterInSeconds > 0 ? "You have " + counterInSeconds + "s left!" : "Time is Up!";
        } else {
            timerCTX.fillStyle = 'black';
            timerText = formatTimer(counterInSeconds);
        }
        timerCTX.clearRect(0, 0, 340, 70);
        timerCTX.fillText(timerText, 170, 45);
    };

    gameStarter = function() {
        clearInterval(intervalRef);
        minutesRef.val(minutesRef.val() || 0);
        secondsRef.val(secondsRef.val() || 0);
        counterInSeconds = 60 * parseInt(minutesRef.val()) + parseInt(secondsRef.val());
        wins = losses = draws = 0;
        playerSelectionRef.removeClass("rock paper scissor win lose");
        cpuSelectionRef.removeClass("rock paper scissor win lose");
        updateScores();
        updateTimer();
        intervalRef = setInterval(countdownLoop, 1000);
    };

    validateForm = function() {
        if (minutesRef[0].value > 0) {
            secondsRef.prop('required', false);
        } else if (secondsRef[0].value > 0) {
            minutesRef.prop('required', false);
        } else {
            secondsRef.prop('min', 1);
        }
        return timerForm[0].checkValidity();
    };

    /* parses input times into Ints and formats them into double digits for use of timerDisplay */
    formatTimer = function(c) {
        var s = c % 60,
            m = (c - s) / 60;
        return (m < 10 ? '0' + m : '' + m) + ':' + (s < 10 ? '0' + s : '' + s)
    };

    /* simple countdown timer, may be fractioanlly inaccurate do to processing times.
        other option would be to use the Date object to obtain real time. */
    countdownLoop = function() {
        counterInSeconds--;
        updateTimer();
        if (counterInSeconds === 0) {
            endGame();
        }
    };

    /* calculates winner and displays */
    endGame = function() {
        clearInterval(intervalRef);
        resetButtons();
        if (wins === losses) {
            gameResultRef.html("It's a Draw!");
        } else if (wins > losses) {
            gameResultRef.html("You Win!");
            gameResultRef.addClass("win");
        } else {
            gameResultRef.html("You Lose...");
            gameResultRef.addClass("lose");
        }
        resultScoreRef.html(wins + " vs " + losses);
        saveScores(retrieveScores);
        modalRef.fadeIn().delay(2000).fadeOut(function() { gameResultRef.removeClass("win lose") });
    };

    resetButtons = function() {
        startRef.html('Start');
        startRef.prop('value', 'start');
        restartRef.prop('disabled', true);
        playerRef.children().prop('disabled', true);
        minutesRef.prop({ 'disabled': false, 'required': true, 'min': 0 });
        secondsRef.prop({ 'disabled': false, 'required': true, 'min': 0 });
    };

    retrieveScores = function(doneCallback) {
        if (sessionToken) {
            $.ajax({
                type: "GET",
                headers: {
                    "x-access-token": sessionToken
                },
                url: '/retreiveHistory',
                dataType: 'json'
            }).then(function(resp) {
                history.text(JSON.stringify(resp));
                historySection.show(500);
            }, function(err) {

            }).done(function() {
                if(doneCallback) {
                    doneCallback();
                }
            });
        }
    };

    saveScores = function(doneCallback) {
        if (sessionToken) {
            $.ajax({
                type: "POST",
                headers: {
                    "x-access-token": sessionToken
                },
                url: '/storeScore',
                data: {
                    "wins": wins,
                    "losses": losses,
                    "draws": draws
                },
                dataType: 'json'
            }).then(function(resp) {
                
            }, function(err) {

            }).done(function() {
                if(doneCallback) {
                    doneCallback();
                }
            });
        }
    }
});
