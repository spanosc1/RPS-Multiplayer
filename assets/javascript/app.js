$(document).ready(function() {
	var hasPlayer = false;
	var numPlayers = 0;
	var playerNum = 0;
	var numChoices = 0;
	var opponentChoice = "";
	var draws = 0;
	var opponentName = "";
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
				playerNum = 1;
				gameData.update({
					one: player,
					numPlayers: numPlayers
				});
			} 
			if(numPlayers == 2)
			{
				playerNum = 2;
				gameData.update({
					two: player,
					numPlayers: numPlayers
				});
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
		choiceImg.attr('class', 'choiceImg');
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
	$("#chatSubmit").on('click', function() {
		var message = $("#chat").val();
		gameData.update({
			chat: message
		})
	});
	gameData.child('chat').on('value', updateChat)
	function updateChat(snapshot)
	{
		$("#chatSpace").append(snapshot.val());
		$("#chatSpace").append('<br>');
	}
	gameData.on("value", function (snapshot) {
		numPlayers = snapshot.val().numPlayers;
	});
	gameData.child("one").child("name").on("value", onNameOne)
	function onNameOne(snapshot)
	{	
		if(playerNum == 2 || playerNum == 0)
		{

			console.log("Player 1 entered!");
			var nameTwo = $('<p>');
			nameTwo.attr('id', 'opponentName');
			nameTwo.append(snapshot.val());
			$("#playerTwo").append(nameTwo);
		}
	}
	gameData.child("two").child("name").on("value", onNameTwo)
	function onNameTwo(snapshot)
	{
		if(playerNum == 1 || playerNum == 0)
		{
			console.log("Player 2 entered!");
			var nameTwo = $('<p>');
			nameTwo.attr('id', 'opponentName');
			nameTwo.append(snapshot.val());
			$("#playerTwo").append(nameTwo);
		}
	}
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
				player.wins++;
				$("#wins").html(player.wins);
			}
			else if(player.choice == "rock" && opponentChoice == "paper")
			{
				console.log("you lose!");
				player.losses++;
				$("#losses").html(player.losses);
			}
			else if(player.choice == "paper" && opponentChoice == "rock")
			{
				console.log("you win!");
				player.wins++;
				$("#wins").html(player.wins);
			}
			else if(player.choice == "paper" && opponentChoice == "scissors")
			{
				console.log("you lose!");
				player.losses++;
				$("#losses").html(player.losses);
			}
			else if(player.choice == "scissors" && opponentChoice == "paper")
			{
				console.log("you win!");
				player.wins++;
				$("#wins").html(player.wins);
			}
			else if(player.choice == "scissors" && opponentChoice == "rock")
			{
				console.log("you lose!");
				player.losses++;
				$("#losses").html(player.losses);
			}
			else
			{
				console.log("Its a draw!");
				draws++;
				$("#draws").html(draws);
			}
			var opponentImg = $('<img>');
			var opponentIcon = 'assets/images/' + opponentChoice + '.png';
			opponentImg.attr('src', opponentIcon);
			opponentImg.attr('class', 'choiceImg');
			$("#playerTwo").append(opponentImg);
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
			numChoices = 0;
			gameData.update({
				numChoices: numChoices
			});
		}
	}
});