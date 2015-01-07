Ship = (function() {
	var name, length, startPoint, endPoint, playerId = '';
	var blocks = [];
	var type = [	
		{
			name: "Derigible Bearer",
			zones: 5
		},
		{
			name: "War Craft",
			zones: 4
		},
		{
			name: "Ultra Aquatic",
			zones: 3
		},
		{
			name: "Ticonderoga",
			zones: 3
		},
		{
			name: "Titanic",
			zones: 2
		}
	];

	//Ship constructor
	function Ship(which){
		this.name = type[which].name;
		this.length = type[which].zones;
	}

	Ship.prototype = {
		getAlpha1: function(){
			alpha1 = this.startPoint.split("");
			return  alpha1[0];
		},
		getAlpha2: function(){
			alpha2 = this.endPoint.split("");
			return  alpha2[0];
		},
		getNum1: function(){
			num1 = this.startPoint.split("");
			var num = num1[1];
			if(num1.length === 3){ num = num + num1[2]; }
			return parseInt(num, 10);
		},
		getNum2: function(){
			num2 = this.endPoint.split("");
			var num = num2[1];
			if(num2.length === 3){ num = num + num2[2]; }
			return parseInt(num, 10);
		},
		getDesc: function(){
			message = "Now setting the " + this.name + ". It is " + this.length + " blocks long.";
			return message;
		},
		setShip: function(){
			$.ajax({
				type: "POST",
				url: "scripts/setShip.php",
				data: {
					startPoint: this.startPoint,
					endPoint: this.endPoint,
					length: this.length,
					name: this.name,
					playerId: this.playerId,
					blocks: blocks
				},
				dataType: "html"
			});
		},
		addBlock: function(block){
			if(blocks.length >= this.length){ blocks.length = 0;	}
			blocks.push(block);
		}
	};

	return Ship;
})();