$(document).ready(function() {
	var hasPlayer = false;
	var numPlayers = 0;
	var playerNum = 0;
	var numChoices = 0;
	var opponentChoice = "";
	var player = {
		name: "",
		choice: "",
		wins: "",
		losses: ""
	};
	var gameData = new Firebase("https://rps-multiplayer.firebaseio.com/");
	$("#nameSubmit").on('click', function () {
		if(!hasPlayer)
		{
			player.name = $("#nameInput").val();
			var name = $('<p>');
			name.attr('id', 'playerName');
			name.append(player.name);
			$("#playerOne").append(name);
			hasPlayer = true;
			numPlayers++;
			if(numPlayers == 1)
			{
				gameData.update({
					one: player,
					numPlayers: numPlayers
				});
				playerNum = 1;
			} 
			if(numPlayers == 2)
			{
				gameData.update({
					two: player,
					numPlayers: numPlayers
				});
				playerNum = 2;
			}
		}
		var rock = $('<p>');
		rock.attr('id', 'rock');
		rock.addClass('choice');
		rock.append("Rock");
		$("#playerOne").append(rock);
		var paper = $('<p>');
		paper.attr('id', 'paper');
		paper.addClass('choice');
		paper.append("Paper");
		$("#playerOne").append(paper);
		var scissors = $('<p>');
		scissors.attr('id', 'scissors');
		scissors.addClass('choice');
		scissors.append("Scissors");
		$("#playerOne").append(scissors);
	});
	$(document).on('click', '.choice', function () {
		player.choice = $(this).attr('id');
		var choiceImg = $('<img>');
		choiceImg.attr('id', 'choiceImg');
		var imgSrc = "assets/images/" + player.choice + ".png";
		choiceImg.attr('src', imgSrc);
		$("#playerOne").append(choiceImg);
		if(playerNum == 1)
		{
			gameData.update({
				one: player
			});
		}
		else if(playerNum == 2)
		{
			gameData.update({
				two: player
			});
		}
	});
	gameData.on("value", function (snapshot) {
		numPlayers = snapshot.val().numPlayers;
	});
	gameData.child("one").child("choice").on("value", onChangeOne);
	function onChangeOne(snapshot) {
		if(snapshot.val() == "rock" || snapshot.val() == "paper" || snapshot.val() == "scissors")
		{
			if(playerNum == 2)
			{
				opponentChoice = snapshot.val();
				console.log("Your oppenent chose " + opponentChoice);
			}
			numChoices++;
			gameData.update({
				numChoices: numChoices
			});
		}
	}
	gameData.child("two").child("choice").on("value", onChangeTwo);
	function onChangeTwo(snapshot) {
		if(snapshot.val() == "rock" || snapshot.val() == "paper" || snapshot.val() == "scissors")
		{
			if(playerNum == 1)
			{
				opponentChoice = snapshot.val();
				console.log("Your oppenent chose " + opponentChoice);
			}
			numChoices++;
			gameData.update({
				numChoices: numChoices
			});
		}
	}
	gameData.child("numChoices").on("value", onChoices);
	function onChoices(snapshot) {
		if(snapshot.val() == 2)
		{
			if(player.choice == "rock" && opponentChoice == "scissors")
			{
				console.log("you win!");
			}
			else if(player.choice == "rock" && opponentChoice == "paper")
			{
				console.log("you lose!");
			}
			else if(player.choice == "paper" && opponentChoice == "rock")
			{
				console.log("you win!");
			}
			else if(player.choice == "paper" && opponentChoice == "scissors")
			{
				console.log("you lose!");
			}
			else if(player.choice == "scissors" && opponentChoice == "paper")
			{
				console.log("you win!");
			}
			else if(player.choice == "scissors" && opponentChoice == "rock")
			{
				console.log("you lose!");
			}
			else
			{
				console.log("Its a draw!");
			}
		}
	}
});