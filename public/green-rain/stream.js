function Stream() {
	this.symbols = [];
	this.totalSymbols = random(8, Math.floor(window.innerHeight / symbolSize));

	this.generateSymbols = function(x, y){
		var first = Math.floor(Math.random() * 3) == 0;
		for (var i = 0; i < this.totalSymbols; i++) {
			symbol = new Symbol(x, y, first, 1);


			symbol.setToRandomSymbol();
			this.symbols.push(symbol);
			
			y -= symbolSize;
			first = false;
			if(i >= (this.totalSymbols  / 2)){
				var fadeAfter = Math.round(this.totalSymbols / 2);
				var nrOfFadeSymbols = this.totalSymbols - fadeAfter;
				var currentFadeSymbol = this.totalSymbols - i;
				symbol.opacity = currentFadeSymbol / nrOfFadeSymbols;
			}
			else{
				symbol.opacity = 1;	
			}
		}
	}

	this.generateNewSymbol = function(x, y, first){
		if(y >= canvas.height){
			y = 0 - (Math.floor(Math.random() * 20) * symbolSize);
			//y = 0;
		}
		symbol = new Symbol(x, y, first, 1);
		symbol.setToRandomSymbol();
		this.symbols.unshift(symbol);
		if(this.symbols.length >= this.totalSymbols){
			this.symbols.pop();
		}

	}

	this.render = function(){
		this.generateNewSymbol(this.symbols[0].x, this.symbols[0].y + symbolSize, this.symbols[0].first);
		this.symbols[1].first = false;
		this.symbols.forEach(function(symbol){
			context.save();

			context.translate(symbol.x, symbol.y);
			context.font = symbolSize + "px Consolas";
			context.textAlign = "center";
			context.scale(-1, 1);
			if(symbol.first){
				context.fillStyle = "rgb(150, 255, 150)";
				context.shadowColor = "rgb(150, 255, 150)";
			}
			else{
				context.fillStyle = "rgba(0, 255, 70, " + symbol.opacity + ")";
				context.shadowColor = "rgba(0, 255, 70, " + symbol.opacity + ")";
			}
			
			context.shadowBlur = 20;
			context.fillText(symbol.value, 0 + symbolSize / 2 - 1, 0 - 1);
			
			context.shadowBlur = 20;
			context.fillText(symbol.value, 0 + symbolSize / 2, 0);
			
			context.shadowBlur = 20;
			context.fillText(symbol.value, 0 + symbolSize / 2 + 1, 0 + 1);
			/*
			context.shadowBlur = 40;
			context.fillText(symbol.value, 0 + symbolSize / 2, 0);
			*/
			context.restore();
			//symbol.rain();
			//symbol.setToRandomSymbol();
		});
	}
}
